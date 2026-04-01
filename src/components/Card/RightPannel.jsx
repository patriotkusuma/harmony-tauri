import React, { useState, useEffect } from 'react';
import { whatsappInstance } from 'services/whatsapp-instance';
import api from 'services/axios-instance';
import { formatImageUrl } from 'utils/formatImageUrl';

const formatWhatsAppText = (text) => {
    if (!text) return '';
    
    // Escape HTML to prevent XSS
    const escapeHtml = (unsafe) => {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    let formatted = escapeHtml(text);
    
    // Bold: *text*
    formatted = formatted.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    // Italic: _text_
    formatted = formatted.replace(/_([^_]+)_/g, '<em>$1</em>');
    // Strikethrough: ~text~
    formatted = formatted.replace(/~([^~]+)~/g, '<del>$1</del>');
    // Code block: ```text```
    formatted = formatted.replace(/```([^`]+)```/g, '<code style="background: rgba(0,0,0,0.05); padding: 0.2rem; border-radius: 4px;">$1</code>');
    
    // New lines
    formatted = formatted.replace(/\n/g, '<br/>');

    return formatted;
};

const HeaderAvatar = ({ jid, name }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (!jid) return;
    const fetchAvatar = async () => {
      try {
        const response = await whatsappInstance.get('/user/avatar', {
          params: { phone: jid, is_preview: true },
          headers: { 'X-Device-Id': 'harmony-gebang' }
        });
        if (isMounted && response.data?.results?.url) {
          setAvatarUrl(response.data.results.url);
        }
      } catch (error) {
        // ignore
      }
    };
    fetchAvatar();
    return () => { isMounted = false; };
  }, [jid]);

  if (avatarUrl) {
    return <img src={formatImageUrl(avatarUrl)} alt="avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />;
  }
  return <>{name?.charAt(0) || jid?.charAt(0) || 'N'}</>;
};

const Message = ({ messageId, phone, mediaUrl, setPreviewImageUrl, mediaType }) => {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!mediaUrl || mediaType !== 'image') return;
    let isMounted = true;
    const fetch= async () => {
      try {
        let endpoint = '';
        let isAbsolute = mediaUrl.startsWith('http');
        
        if (mediaUrl.includes('mmg.whatsapp.net')) {
          // It's a raw WhatsApp URL, we must ask the wa2 backend to download it
          endpoint = `/message/${messageId}/download?phone=${phone}`;
        } else {
          // It's already our backend URL
          endpoint = isAbsolute ? mediaUrl.replace(whatsappInstance.defaults.baseURL, '') : mediaUrl;
        }

        const response = await whatsappInstance.get(endpoint, {
          headers: { 'X-Device-Id': 'harmony-gebang' }
        });

        if (isMounted && response.data?.results) {
          const results = response.data.results;
          if (results.file_path) {
            // New direct file path format
            const baseUrl = whatsappInstance.defaults.baseURL || 'https://wa2.harmonylaundry.my.id/';
            // remove trailing slash from baseUrl if exists, then prepend to file_path
            const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
            const fullPath = results.file_path.startsWith('/') ? results.file_path : `/${results.file_path}`;
            setUrl(cleanBaseUrl + fullPath);
          } else if (results.data) {
            // Old base64 data format (fallback)
            const mime = results.mime_type || 'image/jpeg';
            const formatStr = `data:${mime};base64,${results.data}`;
            setUrl(formatStr);
          }
        }
      } catch (error) {
        // ignore error, leave url as null to show placeholder
      }
    };
    fetch();
    return () => { isMounted = false; };
  }, [mediaUrl, mediaType]);

  if (mediaType !== 'image') return null;

  if (!url) {
    return (
      <div className="media-placeholder" style={{width: 150, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e2e8f0', borderRadius: 8, marginTop: '0.2rem', marginBottom: '0.2rem'}}>
        <i className="fas fa-image" style={{color: '#94a3b8', fontSize: '2rem'}}></i>
      </div>
    );
  }

  return (
    <img
      src={url}
      alt="Message "
      className="chat-image-thumb"
      onClick={() => setPreviewImageUrl(url)}
      style={{cursor: 'pointer'}}
    />
  );
};

const RightPanel = ({ messages, selectedContact, newMessage, setNewMessage, onSendMessage, onDeleteMessage, setShowChat, onLoadMore }) => {
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [visibleMessagesCount, setVisibleMessagesCount] = useState(20);
    const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState(null);
    const [replyingTo, setReplyingTo] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const [pendingFile, setPendingFile] = useState(null); // { file, type, previewUrl, caption }
    const fileInputRef = React.useRef(null);
    const imageInputRef = React.useRef(null);

    const isMobile = window.innerWidth <= 768;

    // Dismiss Context Menu by clicking anywhere
    useEffect(() => {
        const handleGlobalClick = () => setContextMenu(null);
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, []);

    const handleLoadMoreMessages = () => {
        const chatContainer = document.getElementById('chat-messages');
        const currentScrollHeight = chatContainer.scrollHeight;

        if (onLoadMore) onLoadMore();

        // Keep scroll position relative to bottom
        setTimeout(() => {
            const newScrollHeight = chatContainer.scrollHeight;
            chatContainer.scrollTop = newScrollHeight - currentScrollHeight;
        }, 500); // 500ms since API call takes time to respond and re-render
    };

    // Auto scroll when first opening or receiving NEW messages
    useEffect(() => {
        const chatContainer = document.getElementById('chat-messages');
        if (chatContainer) {
             // only autoscroll if user was already at the bottom (or btn-close to it)
             // or if this is the initial load (less than 20 messages visible)
             const isAtBottom = chatContainer.scrollHeight - chatContainer.scrollTop <= chatContainer.clientHeight + 150;
             if (isAtBottom && visibleMessagesCount <= 20) {
                 chatContainer.scrollTop = chatContainer.scrollHeight;
             }
        }
    }, [messages]);

    // Reset limit when changing contact
    useEffect(() => {
        if (selectedContact) {
            setVisibleMessagesCount(20);
            setTimeout(() => {
                const chatContainer = document.getElementById('chat-messages');
                if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 50);
        }
    }, [selectedContact?.jid]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const newX = e.clientX - startPos.x;
        const newY = e.clientY - startPos.y;
        setOffset({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const closePreview = () => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setIsDragging(false);
        setPreviewImageUrl(null);
    };




    const handleContextMenu = (e, message) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            message: message
        });
    };

    const handleSendMessageSubmit = () => {
        if (isSending) return;
        
        if (pendingFile) {
            handleConfirmSend();
            return;
        }

        if (newMessage.trim() === '') return;
        onSendMessage(replyingTo?.id || null);
        setReplyingTo(null);
    };

    const handleConfirmSend = async () => {
        if (!pendingFile || !selectedContact || isSending) return;

        setIsSending(true);
        const { file, type, caption } = pendingFile;
        const formData = new FormData();
        formData.append('phone', selectedContact.jid);
        
        if (type === 'image') {
            formData.append('image', file);
            formData.append('caption', caption || '');
        } else {
            formData.append('file', file);
            formData.append('caption', caption || file.name);
        }

        try {
            const endpoint = type === 'image' ? '/send/image' : '/send/file';
            await whatsappInstance.post(endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Device-Id': 'harmony-gebang'
                }
            });
            setPendingFile(null);
            setNewMessage('');
        } catch (error) {
            console.error(`Error sending ${type}:`, error);
            alert(`Gagal mengirim ${type}.`);
        } finally {
            setIsSending(false);
        }
    };

    const handleFileSelect = (e, type) => {
      const file = e.target.files[0];
      if (!file || !selectedContact || isSending) return;

      let previewUrl = null;
      if (type === 'image') {
          previewUrl = URL.createObjectURL(file);
      }

      setPendingFile({
          file,
          type,
          previewUrl,
          caption: newMessage || '' // use current newMessage as initial caption
      });
      
      // Clear input so same file can be selected again
      e.target.value = '';
    };

  if (!selectedContact) {
      return (
          <div className="right-panel" style={{ alignItems: 'center', justifyContent: 'center' }}>
              <div className="empty-chat" style={{ textAlign: 'center', color: '#64748b' }}>
                  <i className="fab fa-whatsapp" style={{ fontSize: '4rem', marginBottom: '1rem', color: '#94a3b8' }}></i>
                  <h3 style={{ margin: 0, fontWeight: 500 }}>Harmony Chat</h3>
                  <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Pilih kontak untuk mulai mengirim pesan.</p>
              </div>
          </div>
      );
  }

  const handleUpdateOrderStatus = async (kodePesan, newStatus) => {
    if (isUpdatingOrder) return;
    setIsUpdatingOrder(true);
    try {
      await api.put(`/api/v2/pesanan/status/${kodePesan}`, { status: newStatus });
      alert(`Pesanan ${kodePesan} berhasil diubah ke ${newStatus}`);
      // Refresh selectedContact data? Usually ChatUi will handle the refresh via WebSocket or Re-fetching
      // For now, assume it's done. Close dropdown.
      setOrderDropdownOpen(false);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Gagal mengubah status pesanan');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  return (
    <div className="right-panel">
      <div className="chat-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.8rem 1.2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1, minWidth: 0 }}>
          <div className="chat-header-avatar">
            <HeaderAvatar jid={selectedContact?.jid} name={selectedContact?.display_name || selectedContact?.name} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 className="chat-header-name" style={{ margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontSize: '1.1rem', fontWeight: 600 }}>
                {selectedContact ? (selectedContact.display_name || selectedContact.name || selectedContact.jid) : 'Pilih Kontak'}
              </h2>
              {selectedContact?.jid && (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 400 }}>
                  ({selectedContact.jid.split('@')[0]})
                </span>
              )}
            </div>
            {(selectedContact?.enriched_info?.keterangan || selectedContact?.active_orders?.length > 0) && (
              <span style={{ fontSize: '0.75rem', color: '#64748b', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {selectedContact?.enriched_info?.keterangan || `${selectedContact?.active_orders?.length || 0} Pesanan Aktif`}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {selectedContact?.active_orders && selectedContact.active_orders.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setOrderDropdownOpen(!orderDropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  border: '1px solid #bfdbfe',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fas fa-shopping-basket"></i>
                {selectedContact.active_orders.length} Order Aktif
                <i className={`fas fa-chevron-${orderDropdownOpen ? 'up' : 'down'}`} style={{ fontSize: '0.7rem' }}></i>
              </button>

              {orderDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '120%',
                  right: 0,
                  width: '320px',
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: '1px solid #e2e8f0',
                  zIndex: 1000,
                  overflow: 'hidden'
                }}>
                  <div style={{ padding: '0.8rem 1rem', borderBottom: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600 }}>Daftar Pesanan Aktif</h4>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {selectedContact.active_orders.map(order => (
                      <div key={order.id} style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                          <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>{order.kode_pesan}</span>
                          <span style={{ 
                            fontSize: '0.7rem', 
                            padding: '2px 8px', 
                            borderRadius: '12px', 
                            backgroundColor: order.status === 'selesai' ? '#f0fdf4' : '#fff7ed',
                            color: order.status === 'selesai' ? '#166534' : '#9a3412',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                          }}>
                            {order.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.8rem' }}>
                          Total: Rp {order.total_harga?.toLocaleString('id-ID')} | {order.status_pembayaran}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            disabled={isUpdatingOrder || order.status === 'selesai'}
                            onClick={() => handleUpdateOrderStatus(order.kode_pesan, 'selesai')}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              fontSize: '0.75rem',
                              borderRadius: '6px',
                              backgroundColor: '#22c55e',
                              color: 'white',
                              border: 'none',
                              cursor: order.status === 'selesai' ? 'not-allowed' : 'pointer',
                              opacity: order.status === 'selesai' ? 0.6 : 1,
                              fontWeight: 600
                            }}
                          >
                            Set Selesai
                          </button>
                          <button 
                            disabled={isUpdatingOrder}
                            onClick={() => handleUpdateOrderStatus(order.kode_pesan, 'diambil')}
                            style={{
                              flex: 1,
                              padding: '0.4rem',
                              fontSize: '0.75rem',
                              borderRadius: '6px',
                              backgroundColor: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            Set Diambil
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isMobile && (
            <button className="back-button" onClick={() => setShowChat(false)}>
              ← Kembali
            </button>
          )}
        </div>

      <div id="chat-messages" className="chat-messages">
          {/* Preview Overlay */}
          {pendingFile && (
            <div style={{
              position: 'absolute',
              top: '70px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxHeight: '70%',
              backgroundColor: 'white',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              borderRadius: '12px',
              zIndex: 100,
              display: 'flex',
              flexDirection: 'column',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              animation: 'fadeInUp 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h4 style={{ margin: 0 }}>Preview {pendingFile.type === 'image' ? 'Gambar' : 'File'}</h4>
                <button 
                  onClick={() => setPendingFile(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
              
              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '150px', backgroundColor: '#f8fafc', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem' }}>
                {pendingFile.type === 'image' ? (
                  <img src={pendingFile.previewUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }} />
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <i className="fas fa-file-alt" style={{ fontSize: '3rem', color: '#64748b' }}></i>
                    <p style={{ marginTop: '0.5rem', color: '#1e293b', fontWeight: '500' }}>{pendingFile.file.name}</p>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.4rem' }}>Caption</label>
                <textarea 
                  className="message-input"
                  style={{ margin: 0, width: '100%', borderRadius: '8px', fontSize: '0.9rem' }}
                  placeholder="Tambah caption..."
                  value={pendingFile.caption}
                  onChange={(e) => setPendingFile({ ...pendingFile, caption: e.target.value })}
                  rows={2}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '10px' }}>
                <button 
                  className="btn btn-secondary btn-sm" 
                  onClick={() => setPendingFile(null)}
                  disabled={isSending}
                  style={{ borderRadius: '20px' }}
                >
                  Batal
                </button>
                <button 
                  className="btn btn-success btn-sm" 
                  onClick={handleConfirmSend}
                  disabled={isSending}
                  style={{ borderRadius: '20px', display: 'flex', alignItems: 'center' }}
                >
                  {isSending ? <i className="fas fa-circle-notch fa-spin me-2"></i> : <i className="fas fa-paper-plane me-2"></i>}
                  Kirim Sekarang
                </button>
              </div>
            </div>
          )}

        {messages?.length >= 20 && (
            <div style={{ textAlign: 'center', margin: '0.5rem 0 1rem 0' }}>
                <button
                    onClick={handleLoadMoreMessages}
                    style={{
                        backgroundColor: '#e2e8f0',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '1rem',
                        color: '#475569',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontWeight: 500,
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#cbd5e1'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#e2e8f0'}
                >
                  Lihat Pesan Sebelumnya
                </button>
            </div>
        )}
        {(() => {
            const groups = [];
            // Use API returned messages, assume already limited by backend
            const visibleMessages = Array.isArray(messages) ? messages : [];
            visibleMessages.forEach(message => {
                const date = new Date(message.timestamp);
                const dateString = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
              
                let lastGroup = groups[groups.length - 1];
                if (!lastGroup || lastGroup.dateString !== dateString) {
                    lastGroup = {
                        dateString,
                        dateObj: date,
                        messages: []
                    };
                    groups.push(lastGroup);
                }
                lastGroup.messages.push(message);
            });

            const formatDateDivider = (date) => {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
                const yesterday = today - 86400000;
                const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

                if (msgDate === today) return 'Hari Ini';
                if (msgDate === yesterday) return 'Kemarin';
                
                return new Intl.DateTimeFormat('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                }).format(date);
            };

            return groups.map(group => (
                <React.Fragment key={group.dateString}>
                    <div className="date-divider">
                        <span>{formatDateDivider(group.dateObj)}</span>
                    </div>
                    {group.messages.map(message => (
                        <div
                            key={message.id}
                            onContextMenu={(e) => handleContextMenu(e, message)}
                            className={`message-container ${message.sender === 'Me' ? 'my-message' : 'other-message'}`}
                        >
                            <div className="message-bubble">
                                {/* Reply Quote Box placeholder */}
                                {(() => {
                                  // Find typical formats for quoted messages
                                  const quoted = message.quoted || message.quotedMsg || message.quotedMessage || message.reply_to || (message.contextInfo && message.contextInfo.quotedMessage);
                                  const quotedText = quoted?.text || quoted?.conversation || quoted?.content || quoted?.caption || (typeof quoted === 'string' ? quoted : null);
                                  
                                  if (quotedText) {
                                    return (
                                      <div className="replied-message">
                                        {quoted?.sender ? <span className="reply-sender">{quoted.sender === selectedContact?.jid ? selectedContact?.display_name || selectedContact?.name : (quoted.sender === 'Me' ? 'Anda' : quoted.sender)}</span> : null}
                                        <span className="reply-text">{quotedText}</span>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}

                                 {message.text && (
                                    <div 
                                      className="message-text-content" 
                                      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', lineHeight: '1.4' }}
                                      dangerouslySetInnerHTML={{ __html: formatWhatsAppText(message.text) }} 
                                    />
                                )}
                                {message.media_type === 'image' && (
                                    <Message messageId={message.id} 
                                      phone={selectedContact?.jid} 
                                      mediaUrl={message.media_url} 
                                      mediaType={message.media_type}
                                      setPreviewImageUrl={setPreviewImageUrl} 
                                    />
                                )}
                                {message.media_type === 'document' && (
                                    <div className="message-document" style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      padding: '0.5rem', 
                                      backgroundColor: 'rgba(0,0,0,0.05)', 
                                      borderRadius: '8px',
                                      marginTop: '0.2rem'
                                    }}>
                                        <i className="fas fa-file-alt" style={{ fontSize: '1.5rem', marginRight: '10px', color: '#64748b' }}></i>
                                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {message.text || 'Dokumen'}
                                            </span>
                                            {message.media_url && (
                                                <a href={message.media_url.startsWith('http') ? message.media_url : `${whatsappInstance.defaults.baseURL}message/${message.id}/download?phone=${selectedContact?.jid}`} 
                                                   target="_blank" rel="noopener noreferrer" 
                                                   style={{ fontSize: '0.75rem', color: '#3b82f6', textDecoration: 'none' }}>
                                                   Unduh File
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className="message-meta">
                                    <span className="message-time">
                                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                                    </span>
                                    {message.sender === 'Me' && (
                                        <span className={`message-status ${message.status}`}>
                                            {message.status === 'read' ? '✅✅' : message.status === 'delivered' ? '✅✅' : '✅'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </React.Fragment>
            ));
        })()}
      </div>

      <div className="message-input-area" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Reply Badge Indicator */}
        {replyingTo && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#f1f5f9', padding: '0.4rem 0.8rem', borderRadius: '8px 8px 0 0',
            borderLeft: '4px solid #3b82f6', marginBottom: '-2px', zIndex: 1
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#1e293b' }}>
                Membalas {replyingTo.sender === 'Me' ? 'Anda' : (selectedContact?.display_name || 'Kontak')}:
              </span>
              <div style={{ fontSize: '0.85rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                {replyingTo.text || 'File'}
              </div>
            </div>
            <button 
              onClick={() => setReplyingTo(null)} 
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}
        <div style={{ display: 'none' }}>
           <input 
             type="file" 
             ref={imageInputRef} 
             accept="image/*" 
             onChange={(e) => handleFileSelect(e, 'image')} 
           />
           <input 
             type="file" 
             ref={fileInputRef} 
             onChange={(e) => handleFileSelect(e, 'file')} 
           />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', width: '100%', position: 'relative' }}>
          <div className="attachment-options" style={{ display: 'flex', marginBottom: '8px', marginRight: '8px' }}>
            <button 
              onClick={() => imageInputRef.current.click()} 
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
              title="Kirim Gambar"
              disabled={isSending}
            >
              <i className="fas fa-image"></i>
            </button>
            <button 
              onClick={() => fileInputRef.current.click()} 
              style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', padding: '5px' }}
              title="Kirim File"
              disabled={isSending}
            >
              <i className="fas fa-paperclip"></i>
            </button>
          </div>
          <textarea
            placeholder="Ketik pesan... (Enter = Kirim, Ctrl+Enter = Baris Baru)"
            className="message-input"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={Math.min(5, newMessage.split('\n').length || 1)}
            style={{ 
              resize: 'none', 
              overflowY: 'auto',
              paddingTop: '0.8rem',
              paddingBottom: '0.8rem',
              lineHeight: '1.4',
              borderRadius: replyingTo ? '0 8px 8px 8px' : '20px'
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (e.ctrlKey || e.shiftKey) {
                  return;
                }
                e.preventDefault();
                handleSendMessageSubmit();
              }
            }}
          />
          <button className="send-button" onClick={handleSendMessageSubmit} title="Kirim" disabled={isSending}>
            {isSending ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <i className="fas fa-paper-plane"></i>
            )}
          </button>
</div>
      </div>

        {previewImageUrl && (
            <div
                className="image-modal-overlay"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={closePreview}
            >
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                <img
                src={previewImageUrl}
                alt="Preview"
                style={{
                    transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    transition: isDragging ? 'none' : 'transform 0.2s ease',
                }}
                onMouseDown={handleMouseDown}
                draggable={false}
                />
                <div className="zoom-controls">
                <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 5))}>🔍+</button>
                <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 1))}>🔍−</button>
                </div>
            </div>

            <div className="btn-close-button" onClick={closePreview}>
                <i className="fas fa-times"></i>
            </div>
            </div>

        )}

        {/* Custom Context Menu Bubble */}
        {contextMenu && (
          <div 
            style={{
              position: 'fixed',
              top: contextMenu.y,
              left: contextMenu.x,
              backgroundColor: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '0.5rem 0',
              zIndex: 9999,
              minWidth: '150px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => {
                setReplyingTo(contextMenu.message);
                setContextMenu(null);
                // Optionally focus textarea
              }}
            >
              <i className="fas fa-reply me-2 text-primary" style={{ width: '16px' }}></i> Balas
            </div>
            <div 
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              onClick={() => {
                if(window.confirm('Yakin ingin menarik pesan ini?')) {
                  onDeleteMessage(contextMenu.message.id);
                }
                setContextMenu(null);
              }}
            >
              <i className="fas fa-trash-alt me-2 text-danger" style={{ width: '16px' }}></i> Hapus (Tarik)
            </div>
          </div>
        )}

    </div>
  );
};

export default RightPanel;
