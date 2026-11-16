import React, { useState, useEffect, useRef } from 'react';
import { whatsappInstance } from 'services/whatsapp-instance';
import api from 'services/axios-instance';
import { formatImageUrl } from 'utils/formatImageUrl';

const formatWhatsAppText = (text) => {
  if (!text) return '';
  let f = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  f = f.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  f = f.replace(/_([^_]+)_/g, '<em>$1</em>');
  f = f.replace(/~([^~]+)~/g, '<del>$1</del>');
  f = f.replace(/```([^`]+)```/g, '<code style="background:rgba(0,0,0,.05);padding:.15rem;border-radius:3px">$1</code>');
  f = f.replace(/\n/g, '<br/>');
  return f;
};

const HeaderAvatar = ({ jid, name }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let alive = true;
    if (!jid) return;
    whatsappInstance.get('/user/avatar', {
      params: { phone: jid, is_preview: true },
      headers: { 'X-Device-Id': 'harmony-gebang' }
    }).then(r => { if (alive && r.data?.results?.url) setUrl(r.data.results.url); }).catch(() => {});
    return () => { alive = false; };
  }, [jid]);
  if (url) return <img src={formatImageUrl(url)} alt="" />;
  return <>{name?.charAt(0) || jid?.charAt(0) || 'N'}</>;
};

const MediaMessage = ({ messageId, phone, mediaUrl, setPreviewImageUrl, mediaType }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    if (!mediaUrl || mediaType !== 'image') return;
    let alive = true;
    const load = async () => {
      try {
        let endpoint;
        if (mediaUrl.includes('mmg.whatsapp.net')) {
          endpoint = `/message/${messageId}/download?phone=${phone}`;
        } else {
          endpoint = mediaUrl.startsWith('http') ? mediaUrl.replace(whatsappInstance.defaults.baseURL, '') : mediaUrl;
        }
        const { data } = await whatsappInstance.get(endpoint, { headers: { 'X-Device-Id': 'harmony-gebang' } });
        if (!alive || !data?.results) return;
        const r = data.results;
        if (r.file_path) {
          const base = whatsappInstance.defaults.baseURL.replace(/\/$/, '');
          setUrl(base + (r.file_path.startsWith('/') ? r.file_path : `/${r.file_path}`));
        } else if (r.data) {
          setUrl(`data:${r.mime_type || 'image/jpeg'};base64,${r.data}`);
        }
      } catch {}
    };
    load();
    return () => { alive = false; };
  }, [mediaUrl, mediaType]);

  if (mediaType !== 'image') return null;
  if (!url) return <div className="media-placeholder"><i className="fas fa-image" /></div>;
  return <img src={url} alt="" className="chat-image-thumb" onClick={() => setPreviewImageUrl(url)} style={{cursor:'pointer'}} />;
};

const RightPanel = ({ messages, selectedContact, newMessage, setNewMessage, onSendMessage, onDeleteMessage, setShowChat, onLoadMore, deviceId }) => {
  const [previewImageUrl, setPreviewImageUrl] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [orderDropdownOpen, setOrderDropdownOpen] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    const dismiss = () => setContextMenu(null);
    window.addEventListener('click', dismiss);
    return () => window.removeEventListener('click', dismiss);
  }, []);

  useEffect(() => {
    const el = document.getElementById('chat-messages');
    if (el) {
      const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 150;
      if (atBottom) el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (selectedContact) {
      setTimeout(() => {
        const el = document.getElementById('chat-messages');
        if (el) el.scrollTop = el.scrollHeight;
      }, 50);
    }
  }, [selectedContact?.jid]);

  const handleLoadMore = () => {
    const el = document.getElementById('chat-messages');
    const prev = el?.scrollHeight || 0;
    if (onLoadMore) onLoadMore();
    setTimeout(() => { if (el) el.scrollTop = el.scrollHeight - prev; }, 500);
  };

  const handleContextMenu = (e, message) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, message });
  };

  const handleSendMessageSubmit = () => {
    if (isSending) return;
    if (pendingFile) { handleConfirmSend(); return; }
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
    if (type === 'image') { formData.append('image', file); formData.append('caption', caption || ''); }
    else { formData.append('file', file); formData.append('caption', caption || file.name); }
    try {
      await whatsappInstance.post(type === 'image' ? '/send/image' : '/send/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-Device-Id': deviceId }
      });
      setPendingFile(null);
      setNewMessage('');
    } catch (err) {
      alert(`Gagal mengirim ${type}.`);
    } finally {
      setIsSending(false);
    }
  };

  const handleFileSelect = (e, type) => {
    const file = e.target.files[0];
    if (!file || !selectedContact || isSending) return;
    setPendingFile({
      file, type,
      previewUrl: type === 'image' ? URL.createObjectURL(file) : null,
      caption: newMessage || ''
    });
    e.target.value = '';
  };

  const handleUpdateOrderStatus = async (kode, status) => {
    if (isUpdatingOrder) return;
    setIsUpdatingOrder(true);
    try {
      await api.post(`/api/v2/pesanan/${kode}/status`, { status });
      alert(`Pesanan ${kode} → ${status}`);
      setOrderDropdownOpen(false);
    } catch { alert('Gagal mengubah status pesanan'); }
    finally { setIsUpdatingOrder(false); }
  };

  const closePreview = () => { setZoom(1); setOffset({x:0,y:0}); setIsDragging(false); setPreviewImageUrl(null); };

  if (!selectedContact) {
    return (
      <div className="right-panel">
        <div className="chat-empty-state">
          <i className="fab fa-whatsapp" />
          <h3>Harmony Chat</h3>
          <p>Pilih kontak untuk mulai mengirim pesan.</p>
        </div>
      </div>
    );
  }

  const formatDateDivider = (date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    if (msgDate === today) return 'Hari Ini';
    if (msgDate === today - 86400000) return 'Kemarin';
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const groups = [];
  (Array.isArray(messages) ? messages : []).forEach(msg => {
    const d = new Date(msg.timestamp);
    const ds = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const last = groups[groups.length - 1];
    if (!last || last.ds !== ds) groups.push({ ds, date: d, msgs: [msg] });
    else last.msgs.push(msg);
  });

  return (
    <div className="right-panel">
      {/* ── HEADER ── */}
      <div className="chat-header">
        <div className="chat-header-left">
          {isMobile && <button className="back-button" onClick={() => setShowChat(false)}>← </button>}
          <div className="chat-header-avatar">
            <HeaderAvatar jid={selectedContact?.jid} name={selectedContact?.display_name || selectedContact?.name} />
          </div>
          <div className="chat-header-info">
            <h2 className="chat-header-name">
              {selectedContact.display_name || selectedContact.name || selectedContact.jid}
            </h2>
            <span className="chat-header-sub">
              {selectedContact.jid.split('@')[0]}
              {selectedContact?.enriched_info?.keterangan && ` · ${selectedContact.enriched_info.keterangan}`}
            </span>
          </div>
        </div>
        <div className="chat-header-actions">
          {selectedContact?.active_orders?.length > 0 && (
            <div style={{position:'relative'}}>
              <button className="chat-order-btn" aria-expanded={orderDropdownOpen} onClick={() => setOrderDropdownOpen(!orderDropdownOpen)}>
                <i className="fas fa-shopping-basket" />
                {selectedContact.active_orders.length} Order
                <i className={`fas fa-chevron-${orderDropdownOpen ? 'up' : 'down'}`} style={{fontSize:'.6rem'}} />
              </button>
              {orderDropdownOpen && (
                <div className="chat-order-dropdown">
                  <div className="chat-order-dropdown-head">Pesanan Aktif</div>
                  <div className="chat-order-dropdown-body">
                    {selectedContact.active_orders.map(o => (
                      <div key={o.id} className="chat-order-item">
                        <div className="chat-order-item-head">
                          <span className="chat-order-code">{o.kode_pesan}</span>
                          <span className={`chat-order-status ${o.status}`}>{o.status}</span>
                        </div>
                        <div className="chat-order-detail">
                          Rp {o.total_harga?.toLocaleString('id-ID')} · {o.status_pembayaran}
                        </div>
                        <div className="chat-order-actions">
                          <button className="btn-selesai" disabled={isUpdatingOrder || o.status === 'selesai'} onClick={() => handleUpdateOrderStatus(o.kode_pesan, 'selesai')}>Selesai</button>
                          <button className="btn-diambil" disabled={isUpdatingOrder} onClick={() => handleUpdateOrderStatus(o.kode_pesan, 'diambil')}>Diambil</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── MESSAGES ── */}
      <div id="chat-messages" className="chat-messages">
        {pendingFile && (
          <div className="chat-file-preview">
            <div className="chat-file-preview-header">
              <h4>Preview {pendingFile.type === 'image' ? 'Gambar' : 'File'}</h4>
              <button onClick={() => setPendingFile(null)}><i className="fas fa-times" /></button>
            </div>
            <div className="chat-file-preview-body">
              {pendingFile.type === 'image'
                ? <img src={pendingFile.previewUrl} alt="Preview" />
                : <div style={{textAlign:'center'}}><i className="fas fa-file-alt" style={{fontSize:'2.5rem',color:'#64748b'}} /><p style={{marginTop:'.4rem',fontWeight:500}}>{pendingFile.file.name}</p></div>
              }
            </div>
            <label className="chat-file-preview-caption">Caption</label>
            <textarea className="message-input" style={{borderRadius:'.4rem'}} placeholder="Tambah caption…" value={pendingFile.caption} onChange={e => setPendingFile({...pendingFile, caption: e.target.value})} rows={2} />
            <div className="chat-file-preview-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setPendingFile(null)} disabled={isSending} style={{borderRadius:'1rem'}}>Batal</button>
              <button className="btn btn-success btn-sm" onClick={handleConfirmSend} disabled={isSending} style={{borderRadius:'1rem',display:'flex',alignItems:'center'}}>
                {isSending ? <i className="fas fa-circle-notch fa-spin me-1" /> : <i className="fas fa-paper-plane me-1" />}
                Kirim
              </button>
            </div>
          </div>
        )}

        {messages?.length >= 20 && (
          <button className="chat-load-more" onClick={handleLoadMore}>Pesan Sebelumnya ↑</button>
        )}

        {groups.map(g => (
          <React.Fragment key={g.ds}>
            <div className="date-divider"><span>{formatDateDivider(g.date)}</span></div>
            {g.msgs.map(msg => (
              <div key={msg.id} onContextMenu={e => handleContextMenu(e, msg)} className={`message-container ${msg.sender === 'Me' ? 'my-message' : 'other-message'}`}>
                <div className="message-bubble">
                  {(() => {
                    const q = msg.quoted || msg.quotedMsg || msg.quotedMessage || msg.reply_to || msg.contextInfo?.quotedMessage;
                    const qt = q?.text || q?.conversation || q?.content || q?.caption || (typeof q === 'string' ? q : null);
                    if (!qt) return null;
                    return (
                      <div className="replied-message">
                        {q?.sender && <span className="reply-sender">{q.sender === selectedContact?.jid ? selectedContact?.display_name || selectedContact?.name : (q.sender === 'Me' ? 'Anda' : q.sender)}</span>}
                        <span className="reply-text">{qt}</span>
                      </div>
                    );
                  })()}
                  {msg.text && <div className="message-text-content" style={{whiteSpace:'pre-wrap',wordBreak:'break-word',lineHeight:'1.4'}} dangerouslySetInnerHTML={{__html: formatWhatsAppText(msg.text)}} />}
                  {msg.media_type === 'image' && <MediaMessage messageId={msg.id} phone={selectedContact?.jid} mediaUrl={msg.media_url} mediaType={msg.media_type} setPreviewImageUrl={setPreviewImageUrl} />}
                  {msg.media_type === 'document' && (
                    <div className="message-document">
                      <i className="fas fa-file-alt" />
                      <div className="message-document-info">
                        <span className="message-document-name">{msg.text || 'Dokumen'}</span>
                        {msg.media_url && <a href={msg.media_url.startsWith('http') ? msg.media_url : `${whatsappInstance.defaults.baseURL}message/${msg.id}/download?phone=${selectedContact?.jid}`} target="_blank" rel="noopener noreferrer" className="message-document-link">Unduh</a>}
                      </div>
                    </div>
                  )}
                  <div className="message-meta">
                    <span className="message-time">{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',hour12:false})}</span>
                    {msg.sender === 'Me' && <span className={`message-status ${msg.status}`}>{msg.status === 'read' ? '✅✅' : msg.status === 'delivered' ? '✅✅' : '✅'}</span>}
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* ── INPUT ── */}
      <div className="message-input-area">
        {replyingTo && (
          <div className="chat-reply-bar">
            <div>
              <span className="reply-label">Membalas {replyingTo.sender === 'Me' ? 'Anda' : (selectedContact?.display_name || 'Kontak')}</span>
              <div className="reply-preview">{replyingTo.text || 'File'}</div>
            </div>
            <button onClick={() => setReplyingTo(null)}><i className="fas fa-times" /></button>
          </div>
        )}
        <div style={{display:'none'}}>
          <input type="file" ref={imageInputRef} accept="image/*" onChange={e => handleFileSelect(e, 'image')} />
          <input type="file" ref={fileInputRef} onChange={e => handleFileSelect(e, 'file')} />
        </div>
        <div className="chat-input-row">
          <div className="chat-attach-btns">
            <button onClick={() => imageInputRef.current.click()} title="Gambar" disabled={isSending}><i className="fas fa-image" /></button>
            <button onClick={() => fileInputRef.current.click()} title="File" disabled={isSending}><i className="fas fa-paperclip" /></button>
          </div>
          <textarea
            placeholder="Ketik pesan… (Enter = Kirim)"
            className="message-input"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            rows={Math.min(4, newMessage.split('\n').length || 1)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); handleSendMessageSubmit(); }
            }}
          />
          <button className="send-button" onClick={handleSendMessageSubmit} title="Kirim" disabled={isSending}>
            {isSending ? <i className="fas fa-circle-notch fa-spin" /> : <i className="fas fa-paper-plane" />}
          </button>
        </div>
      </div>

      {/* ── IMAGE PREVIEW ── */}
      {previewImageUrl && (
        <div className="image-modal-overlay" onMouseMove={e => { if (isDragging) setOffset({x: e.clientX - startPos.x, y: e.clientY - startPos.y}); }} onMouseUp={() => setIsDragging(false)} onMouseLeave={() => setIsDragging(false)} onClick={closePreview}>
          <div className="image-modal-content" onClick={e => e.stopPropagation()}>
            <img src={previewImageUrl} alt="Preview" style={{transform:`scale(${zoom}) translate(${offset.x/zoom}px, ${offset.y/zoom}px)`, cursor: isDragging ? 'grabbing' : 'grab', transition: isDragging ? 'none' : 'transform .2s'}} onMouseDown={e => { setIsDragging(true); setStartPos({x: e.clientX - offset.x, y: e.clientY - offset.y}); }} draggable={false} />
            <div className="zoom-controls">
              <button onClick={() => setZoom(p => Math.min(p + .2, 5))}>🔍+</button>
              <button onClick={() => setZoom(p => Math.max(p - .2, 1))}>🔍−</button>
            </div>
          </div>
          <div className="btn-close-button" onClick={closePreview}><i className="fas fa-times" /></div>
        </div>
      )}

      {/* ── CONTEXT MENU ── */}
      {contextMenu && (
        <div className="chat-context-menu" style={{top: contextMenu.y, left: contextMenu.x}} onClick={e => e.stopPropagation()}>
          <div className="chat-context-item" onClick={() => { setReplyingTo(contextMenu.message); setContextMenu(null); }}>
            <i className="fas fa-reply" /> Balas
          </div>
          <div className="chat-context-item danger" onClick={() => { if (window.confirm('Tarik pesan ini?')) onDeleteMessage(contextMenu.message.id); setContextMenu(null); }}>
            <i className="fas fa-trash-alt" /> Hapus
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
