import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { whatsappInstance } from 'services/whatsapp-instance';
import api from 'services/axios-instance';
import 'assets/css/chatui.css';
import RightPanel from './RightPannel';
import { useRawWebSocket } from 'services/RawWebSocketContext';

// Main App component for the chat UI
const ContactAvatar = ({ jid, name }) => {
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
        // silence error
      }
    };
    fetchAvatar();
    return () => { isMounted = false; };
  }, [jid]);

  if (avatarUrl) {
    return <img src={avatarUrl} alt="avatar" style={{width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover'}} />;
  }
  return <>{name?.charAt(0) || jid?.charAt(0) || '?'}</>;
};

const ChatUi = (props) => {
  // const {contacts} = props
  // Mock data for contacts and messages
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null)
  const [contacts, setContacts] = useState(null)
  
  // State variables for the chat application
  const [messages, setMessages] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(contacts && contacts.length > 0 ? contacts[0].jid : null); // Default to the first contact
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedOutlet, setSelectedOutlet] = useState(JSON.parse(localStorage.getItem("selected-outlet")) || null)
  const [enrichedData, setEnrichedData] = useState([])
  const [showChat, setShowChat] = useState(false); // default false
  const [contactsOffset, setContactsOffset] = useState(0);
  const [messagesOffset, setMessagesOffset] = useState(0);
  const [isFetchingContacts, setIsFetchingContacts] = useState(false);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [hasMoreContacts, setHasMoreContacts] = useState(true);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const { wsConnected, subscribe } = useRawWebSocket();

  const location = useLocation();
  const initialPhone = location.state?.phone;

  const handleScrollContacts = (e) => {
    const target = e.currentTarget;
    // adding Math.ceil prevents fractional pixel issues on high-dpi screens
    const bottom = Math.ceil(target.scrollHeight - target.scrollTop) <= target.clientHeight + 50;
    
    if (bottom && !isFetchingContacts && hasMoreContacts) {
      const nextOffset = contactsOffset + 20;
      setContactsOffset(nextOffset);
      getContacts(nextOffset);
    }
  };

  const handleLoadMoreMessagesUi = () => {
    if (!isFetchingMessages && hasMoreMessages) {
      const nextOffset = messagesOffset + 20;
      setMessagesOffset(nextOffset);
      getMessagesByTelpon(selectedContactId, nextOffset);
    }
  };



  const getContacts = async (offset = 0) => {
    if (isFetchingContacts) return;
    setIsFetchingContacts(true);
    try {
      const response = await whatsappInstance.get('/chats', {
        headers: {
          'X-Device-Id': 'harmony-gebang'
        },
        params: {
          limit: 20,
          offset: offset
        }
      })
      const newChats = response.data.results?.data || [];
      
      if (newChats.length < 20) {
        setHasMoreContacts(false);
      } else {
        setHasMoreContacts(true);
      }

      let allChats = newChats;
      if (offset > 0 && contacts) {
        allChats = [...contacts, ...newChats];
      }
      setContacts(allChats)
      
      const chatsToEnrich = offset > 0 ? newChats : allChats;
      
      // Extract phones and fetch enriched data in batch
      if (chatsToEnrich.length > 0) {
        const phones = chatsToEnrich.map(c => {
          const phoneOnly = c.jid.split('@')[0];
          return phoneOnly.startsWith('0') ? '62' + phoneOnly.substring(1) : phoneOnly;
        });
        fetchEnrichedData(phones, offset >  0);
      }

      if (allChats.length > 0 && !selectedContactId) {
        const firstContact = allChats[0]
        setMessagesOffset(0);
        setHasMoreMessages(true);
        getMessagesByTelpon(firstContact?.jid || '', 0)
      }
    }catch(error) {
      console.error('Error fetching contacts:', error)
    } finally {
      setIsFetchingContacts(false);
    }
  }

  const fetchEnrichedData = async (phones, isAppend = false) => {
    try {
      if (!phones || phones.length === 0) return;
      
      const response = await api.post('api/customer/by-phones', {
        phones: phones
      });
      const newEnriched = response.data.groups || [];
      setEnrichedData(prev => isAppend ? [...prev, ...newEnriched] : newEnriched);
    } catch (error) {
      console.error('Error fetching enriched data:', error);
    }
  }

  const getMessagesByTelpon = async(telpon, offset = 0) => {
    if (isFetchingMessages) return;
    setIsFetchingMessages(true);
    try {
      const response = await whatsappInstance.get(`/chat/${telpon}/messages`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'X-Device-Id': 'harmony-gebang'
        },
        params: {
          limit: 20,
          offset: offset
        }
      });

      setSelectedContactId(telpon)
      const newMessages = response.data.results?.data || [];
      
      if (newMessages.length < 20) {
        setHasMoreMessages(false);
      } else {
        setHasMoreMessages(true);
      }

      if (offset > 1 && messages) {
        // Since we are loading older messages, append them and let sorting handle the chronological order
        setMessages([...messages, ...newMessages]);
      } else {
        setMessages(newMessages);
      }
    }catch(error){
      console.error('Error fetching messages:', error)
    } finally {
      setIsFetchingMessages(false);
    }
  }
  // Filter contacts based on search term
const filteredContacts = contacts
  ? contacts
      .filter(c => c?.jid !== selectedOutlet?.telpon + '@s.whatsapp.net')
      .slice() // bikin salinan biar tidak mutasi array asli
      .sort((a, b) => {
        const tsA = new Date(a?.last_message_time || 0).getTime();
        const tsB = new Date(b?.last_message_time || 0).getTime();
        return tsB - tsA; // descending
      })
      .filter(contact =>
        
        contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact?.jid?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(contact => {
        // Find enriched info from go backend (Phone matching: normalized format)
        const jidPhone = contact.jid.split('@')[0];
        const normalizedJidPhone = jidPhone.startsWith('62') ? '0' + jidPhone.substring(2) : jidPhone;

        const info = enrichedData.find(g => {
          const gPhone = g.phone;
          const normalizedGPhone = gPhone.startsWith('62') ? '0' + gPhone.substring(2) : gPhone;
          return normalizedGPhone === normalizedJidPhone;
        });

        // Determine best customer name (prefer the one with active order)
        let bestName = contact?.name || contact.jid;
        if (info && info.customers?.length > 0) {
          const activeCust = info.customers.find(c => c.has_active_order);
          bestName = activeCust ? activeCust.nama : info.customers[0].nama;
        }

        return {
          ...contact,
          display_name: bestName,
          enriched_info: info
        };
      })
  : null;
  // Get the currently selected contact
  const selectedContact = filteredContacts ? filteredContacts.find(contact => contact.jid === selectedContactId) : null;
  // Get messages for the selected contact
  // const currentChatMessages = messages[selectedContactId] || [];
  const currentChatMessages = Array.isArray(messages)
    ? messages
        .slice()
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(msg => ({
          ...msg, // spread to keep contextInfo or quoted message
          id: msg.id,
          sender: msg.is_from_me ? 'Me' : msg.sender_jid,
          text: msg.content,
          media_type: msg.media_type,
          media_url: msg.url,
          timestamp: msg.timestamp,
          status: msg.status || 'sent',
        }))
    : []

  // Function to handle sending a new message
  const handleSendMessage = async (replyMessageId = null) => {
    try{

      if (newMessage.trim() === '') return; // Don't send empty messages
      
      const payload = {
        phone: selectedContactId,
        message: newMessage
      };

      if (replyMessageId) {
        payload.reply_message_id = replyMessageId;
      }

      const response = await whatsappInstance.post('/send/message', payload,
        {
          headers: {
            'X-Device-Id': 'harmony-gebang'
          }
        }
      );

      console.log(`[${new Date().toLocaleString()}] - Respon`, response)
    
    // Setelah berhasil, jalankan:
    setNewMessage('');
    setMessagesOffset(0);
    setHasMoreMessages(true);
    getMessagesByTelpon(selectedContactId, 0);
    }catch(error){
      console.error(`[${new Date().toLocaleString()}] - Gagal mengirim pesan `, error)
    }

  };

  const handleDeleteMessage = async (messageId) => {
    if (!selectedContactId || !messageId) return;
    try {
      await whatsappInstance.post(`/message/${messageId}/delete`, 
        { phone: selectedContactId },
        { headers: { 'X-Device-Id': 'harmony-gebang' } }
      );
      // Refresh messages
      setMessagesOffset(0);
      setHasMoreMessages(true);
      getMessagesByTelpon(selectedContactId, 0);
    } catch (err) {
      console.error('Gagal menghapus pesan', err);
    }
  };

  const formatTime = (timestamp) => {
    // if (!timestamp) return '';
    // return new Intl.DateTimeFormat('id-ID', {
    //   hour: '2-digit',
    //   minute: '2-digit',
    //   hour12: false,
    //   timeZone: 'Asia/Jakarta',
    //   day:'2-digit',
    //   month:'long',
    //   year:'numeric',
    // }).format(new Date(timestamp));
    if(!timestamp) return ''
    const date = new Date(timestamp);
    const now = new Date();

    // Normalisasi waktu untuk perbandingan (hapus jam, menit, dsb.)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const timePart = new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(date);

    if (dateOnly.getTime() === today.getTime()) {
      // Hari ini
      return timePart;
    } else if (dateOnly.getTime() === yesterday.getTime()) {
      // Kemarin
      return `Yesterday ${timePart}`;
    } else {
      // Tanggal lengkap
      const datePart = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
      }).format(date);
      return `${datePart} ${timePart}`;
    }
  };




  // Effect to scroll to the bottom of the chat messages when new messages arrive
  // Moved this logic to RightPanel for better lazy loading compatibility

  // Saat contacts berhasil didapat, set kontak pertama (atau dari state)
  useEffect(() => {
    if (contacts && contacts.length > 0) {
      let targetJid = null;
      
      if (initialPhone) {
        // Normalize initialPhone to JID format
        const phoneOnly = initialPhone.startsWith('0') ? '62' + initialPhone.substring(1) : initialPhone;
        targetJid = phoneOnly + '@s.whatsapp.net';
      }

      const activeJid = targetJid || selectedContactId || contacts[0].jid;
      
      setSelectedContactId(activeJid);
      setMessagesOffset(0);
      setHasMoreMessages(true);
      getMessagesByTelpon(activeJid, 0);
      
      if (targetJid) setShowChat(true);
    }
  }, [contacts, initialPhone]);
  useEffect(() => {
    if (contacts === null && authToken !== null) {
      getContacts(0);
    }

    const unsubscribe = subscribe((rawData) => {
      console.log(`[ChatUi] Received from Global WS:`, rawData);

      // Handle unread indicator locally in contacts list
      if (rawData.code === "message") {
        const senderJid = rawData.data.from;
        
        // Only increment if not currently chatting with this person
        if (senderJid !== selectedContactId) {
          setContacts(prev => {
            if (!prev) return prev;
            return prev.map(c => {
              if (c.jid === senderJid) {
                return { 
                  ...c, 
                  unread_count: (c.unread_count || 0) + 1,
                  last_message_time: new Date().toISOString()
                };
              }
              return c;
            });
          });
        }
      }

      // Refresh contacts and messages according to user request
      setContactsOffset(0);
      setHasMoreContacts(true);
      getContacts(0);
      
      if (selectedContactId) {
        setMessagesOffset(0);
        setHasMoreMessages(true);
        getMessagesByTelpon(selectedContactId, 0);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [authToken, selectedContactId, subscribe]); 

  return (
    <div className={`chat-app-container ${showChat ? 'show-chat' : ''}`}>

      {/* Left Panel: Contact List */}
      <div className="left-panel">
        {/* Search Bar - Stays at the top */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Cari kontak..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="ws-status-indicator" style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: wsConnected ? '#2dce89' : '#f5365c',
              marginRight: '6px',
              boxShadow: wsConnected ? '0 0 8px #2dce89' : 'none'
            }}></div>
            <span style={{ fontSize: '11px', color: '#8898aa', fontWeight: '500' }}>
              {wsConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'}
            </span>
          </div>
        </div>

        {/* Contact List - Scrolls independently */}
        <div className="contact-list" onScroll={handleScrollContacts}>
          {filteredContacts?.length > 0 ? (
            <>
            {filteredContacts
              .map(contact => (
              <div key={contact.jid} className={`contact-item ${selectedContactId === contact.jid ? 'selected' : ''}`} 
                onClick={() =>{ 
                  setMessagesOffset(0);
                  setHasMoreMessages(true);
                  getMessagesByTelpon(contact.jid, 0)
                  setShowChat(true)
                  
                  // Reset unread count for this contact
                  setContacts(prev => prev ? prev.map(c => 
                    c.jid === contact.jid ? { ...c, unread_count: 0 } : c
                  ) : null);
                }}
                >
                <div className="contact-avatar" style={{ position: 'relative' }}>
                  <ContactAvatar jid={contact.jid} name={contact?.display_name || contact?.name} />
                  {contact.unread_count > 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: '-2px',
                      right: '-2px',
                      backgroundColor: '#f5365c',
                      color: 'white',
                      borderRadius: '50%',
                      width: '18px',
                      height: '18px',
                      fontSize: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '2px solid white',
                      fontWeight: 'bold',
                      zIndex: 2
                    }}>
                      {contact.unread_count > 99 ? '99+' : contact.unread_count}
                    </div>
                  )}
                </div>
                <div className="contact-content">
                  <div className="contact-header">
                    <h3 className="contact-name">
                      {contact?.display_name}
                    </h3>
                    
                    <span className="contact-time">{formatTime(contact?.last_message_time)}</span>
                  </div>
                  <div className="contact-footer" style={{marginTop: '4px'}}>
                    <div style={{display: 'flex', alignItems: 'center', flexWrap: 'wrap'}}>
                      {contact?.enriched_info?.has_active_order && (
                        <span className="badge badge-success mr-2" style={{fontSize: '9px', padding: '2px 6px'}}>
                          <i className="fas fa-shopping-basket mr-1"></i> Order Aktif 
                          {contact.enriched_info.active_orders?.[0]?.status ? ' ('+contact.enriched_info.active_orders[0].status+')' : ''}
                        </span>
                      )}
                      {/* Optional: Add customer type (member/non-member) if needed */}
                    </div>
                  </div>
                </div>
              </div>

            ))}
            
            {isFetchingContacts && (
              <div style={{ padding: '1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
                Memuat kontak...
              </div>
            )}
          </>
          ) : (
            <p className="no-contacts-found">Tidak ada kontak ditemukan.</p>
          )}
        </div>
      </div>

      {/* Right Panel: Chat Window */}
          <RightPanel 
             messages={currentChatMessages}
            selectedContact={selectedContact}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            onSendMessage={handleSendMessage}
            onDeleteMessage={handleDeleteMessage}
            setShowChat={setShowChat}
            onLoadMore={handleLoadMoreMessagesUi}
          />
    </div>
  );
}

export default ChatUi;