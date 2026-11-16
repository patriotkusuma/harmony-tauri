import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { whatsappInstance } from 'services/whatsapp-instance';
import api from 'services/axios-instance';
import { formatImageUrl } from 'utils/formatImageUrl';
import { useRawWebSocket } from 'services/RawWebSocketContext';
import 'assets/css/chatui.css';
import RightPanel from './RightPannel';

const ContactAvatar = ({ jid, name }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    let alive = true;
    if (!jid) return;
    whatsappInstance.get('/user/avatar', {
      params: { phone: jid, is_preview: true },
      headers: { 'X-Device-Id': 'harmony-gebang' }
    }).then(r => { if (alive && r.data?.results?.url) setAvatarUrl(r.data.results.url); }).catch(() => {});
    return () => { alive = false; };
  }, [jid]);

  if (avatarUrl) return <img src={formatImageUrl(avatarUrl)} alt="" />;
  return <>{name?.charAt(0) || jid?.charAt(0) || '?'}</>;
};

const formatTime = (ts) => {
  if (!ts) return '';
  const date = new Date(ts);
  const now = new Date();
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Jakarta' });
  if (d.getTime() === today.getTime()) return time;
  if (d.getTime() === yesterday.getTime()) return `Kemarin`;
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', timeZone: 'Asia/Jakarta' });
};

const ChatUi = () => {
  const [contacts, setContacts] = useState(null);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedOutlet] = useState(JSON.parse(localStorage.getItem("selected-outlet")) || null);
  const [enrichedData, setEnrichedData] = useState([]);
  const [showChat, setShowChat] = useState(false);
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
    const t = e.currentTarget;
    if (Math.ceil(t.scrollHeight - t.scrollTop) <= t.clientHeight + 50 && !isFetchingContacts && hasMoreContacts) {
      const next = contactsOffset + 20;
      setContactsOffset(next);
      getContacts(next);
    }
  };

  const handleLoadMore = () => {
    if (!isFetchingMessages && hasMoreMessages) {
      const next = messagesOffset + 20;
      setMessagesOffset(next);
      getMessagesByTelpon(selectedContactId, next);
    }
  };

  const getContacts = useCallback(async (offset = 0) => {
    if (isFetchingContacts) return;
    setIsFetchingContacts(true);
    try {
      const { data } = await whatsappInstance.get('/chats', {
        headers: { 'X-Device-Id': 'harmony-gebang' },
        params: { limit: 20, offset }
      });
      const newChats = data.results?.data || [];
      setHasMoreContacts(newChats.length >= 20);
      const allChats = offset > 0 && contacts ? [...contacts, ...newChats] : newChats;
      setContacts(allChats);
      setError('');

      const toEnrich = offset > 0 ? newChats : allChats;
      if (toEnrich.length > 0) {
        const phones = toEnrich.map(c => {
          const p = c.jid.split('@')[0];
          return p.startsWith('0') ? '62' + p.substring(1) : p;
        });
        fetchEnrichedData(phones, offset > 0);
      }
      if (allChats.length > 0 && !selectedContactId) {
        setMessagesOffset(0);
        setHasMoreMessages(true);
        getMessagesByTelpon(allChats[0]?.jid || '', 0);
      }
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Tidak dapat memuat percakapan. Periksa koneksi.');
    } finally {
      setIsFetchingContacts(false);
    }
  }, [contacts, isFetchingContacts]);

  const fetchEnrichedData = async (phones, append = false) => {
    try {
      if (!phones?.length) return;
      const { data } = await api.post('api/customer/by-phones', { phones });
      const items = data.groups || [];
      setEnrichedData(prev => append ? [...prev, ...items] : items);
    } catch {}
  };

  const getMessagesByTelpon = useCallback(async (jid, offset = 0) => {
    if (!jid || isFetchingMessages) return;
    setIsFetchingMessages(true);
    try {
      const { data } = await whatsappInstance.get(`/chat/${encodeURIComponent(jid)}/messages`, {
        headers: { 'X-Device-Id': 'harmony-gebang' },
        params: { limit: 20, offset }
      });
      setSelectedContactId(jid);
      const msgs = data.results?.data || [];
      setHasMoreMessages(msgs.length >= 20);
      setMessages(offset > 0 && messages ? [...messages, ...msgs] : msgs);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setIsFetchingMessages(false);
    }
  }, [messages, isFetchingMessages]);

  const filteredContacts = contacts
    ? contacts
        .filter(c => c?.jid !== selectedOutlet?.telpon + '@s.whatsapp.net')
        .sort((a, b) => new Date(b?.last_message_time || 0) - new Date(a?.last_message_time || 0))
        .filter(c => c?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || c?.jid?.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(contact => {
          const jidPhone = contact.jid.split('@')[0];
          const norm = jidPhone.startsWith('62') ? '0' + jidPhone.substring(2) : jidPhone;
          const info = enrichedData.find(g => {
            const gp = g.phone.startsWith('62') ? '0' + g.phone.substring(2) : g.phone;
            return gp === norm;
          });
          let bestName = contact?.name || contact.jid;
          if (info?.customers?.length > 0) {
            const active = info.customers.find(c => c.has_active_order);
            bestName = active ? active.nama : info.customers[0].nama;
          }
          return { ...contact, display_name: bestName, enriched_info: info };
        })
    : null;

  const selectedContact = filteredContacts?.find(c => c.jid === selectedContactId) || null;
  const currentChatMessages = Array.isArray(messages)
    ? messages.slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map(msg => ({
        ...msg,
        sender: msg.is_from_me ? 'Me' : msg.sender_jid,
        text: msg.content,
        media_type: msg.media_type,
        media_url: msg.url,
        timestamp: msg.timestamp,
        status: msg.status || 'sent',
      }))
    : [];

  const handleSendMessage = async (replyId = null) => {
    if (newMessage.trim() === '') return;
    const formData = new FormData();
    formData.append('phone', selectedContactId);
    formData.append('message', newMessage);
    if (replyId) formData.append('reply_message_id', replyId);
    try {
      await whatsappInstance.post('/send/message', formData, {
        headers: { 'X-Device-Id': 'harmony-gebang', 'Content-Type': 'multipart/form-data' }
      });
      setNewMessage('');
      setMessagesOffset(0);
      setHasMoreMessages(true);
      getMessagesByTelpon(selectedContactId, 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Pesan gagal dikirim.');
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!selectedContactId || !messageId) return;
    try {
      await whatsappInstance.post(`/message/${messageId}/delete`,
        { phone: selectedContactId },
        { headers: { 'X-Device-Id': 'harmony-gebang' } }
      );
      setMessagesOffset(0);
      setHasMoreMessages(true);
      getMessagesByTelpon(selectedContactId, 0);
    } catch (err) {
      console.error('Gagal menghapus pesan', err);
    }
  };

  useEffect(() => { getContacts(0); }, []);

  useEffect(() => {
    if (contacts?.length > 0) {
      let targetJid = null;
      if (initialPhone) {
        const p = initialPhone.startsWith('0') ? '62' + initialPhone.substring(1) : initialPhone;
        targetJid = p + '@s.whatsapp.net';
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
    const unsub = subscribe(() => {
      getContacts(0);
      if (selectedContactId) getMessagesByTelpon(selectedContactId, 0);
    });
    return unsub;
  }, [selectedContactId, subscribe]);

  return (
    <div className={`chat-app-container ${showChat ? 'show-chat' : ''}`}>
      {/* ════ LEFT PANEL ════ */}
      <div className="left-panel">
        <div className="chat-panel-header">
          <div className="chat-inbox-toolbar">
            <strong><i className="fab fa-whatsapp" />Pesan</strong>
            <div className="chat-ws-status">
              <span className={`chat-ws-dot ${wsConnected ? 'online' : 'offline'}`} />
              {wsConnected ? 'Online' : 'Offline'}
            </div>
          </div>
          <div className="chat-search-wrap">
            <i className="fas fa-search" />
            <input
              type="text"
              placeholder="Cari nama atau nomor…"
              className="search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          {error && <div className="chat-error" role="alert">{error}</div>}
        </div>

        <div className="contact-list" onScroll={handleScrollContacts}>
          {filteredContacts?.length > 0 ? (
            <>
              {filteredContacts.map(contact => (
                <div
                  key={contact.jid}
                  className={`contact-item ${selectedContactId === contact.jid ? 'selected' : ''}`}
                  onClick={() => {
                    setMessagesOffset(0);
                    setHasMoreMessages(true);
                    getMessagesByTelpon(contact.jid, 0);
                    setShowChat(true);
                    setContacts(prev => prev?.map(c => c.jid === contact.jid ? { ...c, unread_count: 0 } : c) || null);
                  }}
                >
                  <div className="contact-avatar">
                    <ContactAvatar jid={contact.jid} name={contact?.display_name || contact?.name} />
                    {contact.unread_count > 0 && (
                      <span className="contact-unread-badge">
                        {contact.unread_count > 99 ? '99+' : contact.unread_count}
                      </span>
                    )}
                  </div>
                  <div className="contact-content">
                    <div className="contact-header">
                      <h3 className="contact-name">{contact?.display_name}</h3>
                      <span className="contact-time">{formatTime(contact?.last_message_time)}</span>
                    </div>
                    <div className="contact-footer">
                      {contact?.active_orders?.length > 0 && (
                        <span className="chat-active-order-badge">
                          <i className="fas fa-shirt" />
                          {contact.active_orders.length} order
                          <span className="chat-active-order-status">{contact.active_orders[0].status}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isFetchingContacts && <div className="contact-loading">Memuat…</div>}
            </>
          ) : contacts === null ? (
            <div className="contact-loading">Memuat kontak…</div>
          ) : (
            <p className="no-contacts-found">Tidak ada kontak ditemukan.</p>
          )}
        </div>
      </div>

      {/* ════ RIGHT PANEL ════ */}
      <RightPanel
        messages={currentChatMessages}
        selectedContact={selectedContact}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onDeleteMessage={handleDeleteMessage}
        setShowChat={setShowChat}
        onLoadMore={handleLoadMore}
        deviceId="harmony-gebang"
      />
    </div>
  );
};

export default ChatUi;
