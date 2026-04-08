import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'reactstrap';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useChatStore from '../../store/chatStore';
import '../../assets/css/ai-chat.css';

/* ── Helper: format relative time ─────────────────────────── */
const fmtTime = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
};

const fmtDate = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

/* ── Quick-prompt suggestions ──────────────────────────────── */
const SUGGESTIONS = [
  { icon: 'fas fa-chart-line', text: 'Berapa omset hari ini?' },
  { icon: 'fas fa-boxes', text: 'Stok bahan baku apa yang hampir habis?' },
  { icon: 'fas fa-id-card', text: 'Kenapa RFID ini tidak bisa dipakai?' },
  { icon: 'fas fa-lightbulb', text: 'Bantu analisa profit laundry saya' },
];

/* ── Typing indicator ──────────────────────────────────────── */
const TypingIndicator = () => (
  <div className="ai-msg-row ai-msg-assistant">
    <div className="ai-avatar-sm"><i className="fas fa-robot" /></div>
    <div className="ai-bubble ai-bubble-assistant ai-typing">
      <span /><span /><span />
    </div>
  </div>
);

/* ── Single message bubble ─────────────────────────────────── */
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === 'user';
  return (
    <div className={`ai-msg-row ${isUser ? 'ai-msg-user' : 'ai-msg-assistant'}`}>
      {!isUser && (
        <div className="ai-avatar-sm">
          <i className="fas fa-robot" />
        </div>
      )}
      <div className={`ai-bubble ${isUser ? 'ai-bubble-user' : 'ai-bubble-assistant'}`}>
        {isUser ? (
          <p className="ai-bubble-text">{msg.content}</p>
        ) : (
          <div className="ai-bubble-md">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="ai-md-p">{children}</p>,
                h1: ({ children }) => <h4 className="ai-md-h">{children}</h4>,
                h2: ({ children }) => <h5 className="ai-md-h">{children}</h5>,
                h3: ({ children }) => <h6 className="ai-md-h">{children}</h6>,
                ul: ({ children }) => <ul className="ai-md-ul">{children}</ul>,
                ol: ({ children }) => <ol className="ai-md-ol">{children}</ol>,
                li: ({ children }) => <li className="ai-md-li">{children}</li>,
                code: ({ inline, children }) =>
                  inline
                    ? <code className="ai-md-code-inline">{children}</code>
                    : <pre className="ai-md-pre"><code>{children}</code></pre>,
                strong: ({ children }) => <strong className="ai-md-strong">{children}</strong>,
                table: ({ children }) => <div className="ai-md-table-wrap"><table className="ai-md-table">{children}</table></div>,
                th: ({ children }) => <th className="ai-md-th">{children}</th>,
                td: ({ children }) => <td className="ai-md-td">{children}</td>,
                blockquote: ({ children }) => <blockquote className="ai-md-blockquote">{children}</blockquote>,
                a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="ai-md-link">{children}</a>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        )}
        <span className="ai-bubble-time">{fmtTime(msg.created_at)}</span>
      </div>
    </div>
  );
};

/* ── Session list item ─────────────────────────────────────── */
const SessionItem = ({ session, active, onClick }) => (
  <button
    className={`ai-session-item ${active ? 'ai-session-active' : ''}`}
    onClick={() => onClick(session.id)}
  >
    <div className="ai-session-icon"><i className="fas fa-comment-dots" /></div>
    <div className="ai-session-info">
      <span className="ai-session-title">{session.title || 'Percakapan Baru'}</span>
      <span className="ai-session-time">{fmtDate(session.updated_at)}</span>
    </div>
  </button>
);

/* ── Main Page ─────────────────────────────────────────────── */
const AiChat = () => {
  const {
    sessions, messages, activeSessionId, sending, loadingSessions,
    fetchSessions, selectSession, newSession, sendMessage,
  } = useChatStore();

  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { fetchSessions(); }, []);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  const handleSend = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput('');
    await sendMessage(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <>
      <header className="header bg-gradient-ai-chat pb-8 pt-5 pt-md-8" />
      <Container className="mt--7 pb-5" fluid>
        <div className="ai-chat-shell">
          {/* ── LEFT: Session History ─── */}
          <aside className="ai-sidebar">
            <div className="ai-sidebar-header">
              <div>
                <h5 className="ai-sidebar-title">
                  <i className="fas fa-robot me-2 text-primary" />AI Assistant
                </h5>
                <p className="ai-sidebar-sub">Didukung oleh Gemini AI</p>
              </div>
              <button className="ai-new-chat-btn" onClick={newSession} title="Percakapan baru">
                <i className="fas fa-plus" />
              </button>
            </div>

            <div className="ai-session-list">
              {loadingSessions ? (
                <div className="ai-sessions-loading">
                  {[1,2,3].map(i => <div key={i} className="ai-skeleton" />)}
                </div>
              ) : sessions.length === 0 ? (
                <div className="ai-sessions-empty">
                  <i className="fas fa-comments" />
                  <span>Belum ada percakapan</span>
                </div>
              ) : (
                sessions.map((s) => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    active={s.id === activeSessionId}
                    onClick={selectSession}
                  />
                ))
              )}
            </div>
          </aside>

          {/* ── RIGHT: Chat Area ─── */}
          <main className="ai-chat-main">
            {/* Header */}
            <div className="ai-chat-topbar">
              <div className="ai-chat-topbar-info">
                <div className="ai-chat-avatar">
                  <i className="fas fa-brain" />
                </div>
                <div>
                  <p className="ai-chat-name">Harmony AI</p>
                  <p className="ai-chat-status">
                    <span className="ai-status-dot" />
                    Siap membantu • LiteLLM
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="ai-messages">
              {!hasMessages ? (
                /* Welcome / Empty state */
                <div className="ai-welcome">
                  <div className="ai-welcome-icon"><i className="fas fa-robot" /></div>
                  <h4 className="ai-welcome-title">Halo! Saya Harmony AI 👋</h4>
                  <p className="ai-welcome-sub">
                    Tanyakan apapun seputar operasional laundry Anda — omset, stok, RFID, hingga strategi bisnis.
                  </p>
                  <div className="ai-suggestions">
                    {SUGGESTIONS.map((s, i) => (
                      <button
                        key={i}
                        className="ai-suggestion-chip"
                        onClick={() => { setInput(s.text); }}
                      >
                        <i className={`${s.icon} me-2`} />{s.text}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))
              )}

              {sending && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="ai-input-bar">
              <textarea
                className="ai-input"
                rows={1}
                placeholder="Tanyakan sesuatu… (tekan Enter untuk kirim)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={sending}
              />
              <button
                className={`ai-send-btn ${sending || !input.trim() ? 'ai-send-disabled' : ''}`}
                onClick={handleSend}
                disabled={sending || !input.trim()}
                title="Kirim"
              >
                {sending
                  ? <i className="fas fa-spinner fa-spin" />
                  : <i className="fas fa-paper-plane" />
                }
              </button>
            </div>
          </main>
        </div>
      </Container>
    </>
  );
};

export default AiChat;
