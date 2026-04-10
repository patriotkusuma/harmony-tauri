import React, { useState, useEffect, useRef } from "react";
import { 
  Offcanvas, OffcanvasHeader, OffcanvasBody, 
  Input, Button, Spinner,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from "reactstrap";
import { whatsappInstance } from "../../../services/whatsapp-instance";
import { useRawWebSocket } from "../../../services/RawWebSocketContext";
import { useKostStore, STATUS_CONFIG, STATUS_FLOW } from "../../../store/kostStore";

const KostChatSidebar = ({ isOpen, kost, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [notes, setNotes] = useState(kost?.internal_notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  
  const scrollRef = useRef(null);
  const { subscribe } = useRawWebSocket();
  const { updateNotes } = useKostStore();

  const getJid = (phone) => {
    if (!phone) return null;
    let clean = phone.replace(/\D/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.substring(1);
    }
    return clean + "@s.whatsapp.net";
  };

  const fetchMessages = async () => {
    if (!kost?.phone) return;
    setLoading(true);
    try {
      const jid = getJid(kost.phone);
      const res = await whatsappInstance.get(`/chat/${jid}/messages`, {
        params: { limit: 50, offset: 0 },
        headers: { 'X-Device-Id': 'harmony-gebang' }
      });
      setMessages(res.data.results?.data || []);
    } catch (err) {
      console.error("Gagal memuat pesan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && kost) {
      setNotes(kost.internal_notes || "");
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [isOpen, kost]);

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    const success = await updateNotes(kost.id, notes);
    if (success) setIsEditingNotes(false);
    setSavingNotes(false);
  };

  const handleUpdateStatus = async (newStatus) => {
    await updateStatus(kost.id, newStatus);
  };

  // WebSocket Subscription for real-time updates
  useEffect(() => {
    if (!isOpen || !kost?.phone) return;

    const targetJid = getJid(kost.phone);
    const unsubscribe = subscribe((rawData) => {
      if (rawData.code === "message") {
        const msg = rawData.data;
        if (msg.from === targetJid || msg.to === targetJid) {
          // Re-fetch or append
          fetchMessages();
        }
      }
    });

    return () => unsubscribe();
  }, [isOpen, kost, subscribe]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !kost?.phone) return;

    setSending(true);
    try {
      const jid = getJid(kost.phone);
      const formData = new FormData();
      formData.append("phone", jid);
      formData.append("message", input);

      await whatsappInstance.post("/send/message", formData, {
        headers: { 
          "X-Device-Id": "harmony-gebang",
          "Content-Type": "multipart/form-data" 
        }
      });

      setInput("");
      fetchMessages(); // Refresh after send
    } catch (err) {
      console.error("Gagal mengirim pesan:", err);
    } finally {
      setSending(false);
    }
  };

  if (!kost) return null;

  const cfg = STATUS_CONFIG[kost.status] ?? STATUS_CONFIG["pending"];

  return (
    <Offcanvas 
      direction="end" 
      isOpen={isOpen} 
      toggle={onClose} 
      style={{ width: "450px", borderLeft: "none", boxShadow: "-20px 0 40px rgba(0,0,0,0.15)" }}
    >
      <OffcanvasHeader toggle={onClose} className="border-bottom bg-white py-2">
        <div className="d-flex align-items-center justify-content-between w-100">
          <div className="d-flex align-items-center">
            <div 
              className="mr-3 d-flex align-items-center justify-content-center"
              style={{ 
                width: "42px", height: "42px", borderRadius: "50%", 
                background: "#25D366", color: "white", fontSize: "1.2rem"
              }}
            >
              <i className="fab fa-whatsapp" />
            </div>
            <div style={{ lineHeight: "1.2" }}>
              <h5 className="mb-0" style={{ fontSize: "1rem", fontWeight: 700 }}>{kost.name}</h5>
              <UncontrolledDropdown>
                <DropdownToggle tag="span" className="text-success cursor-pointer small" style={{ fontWeight: 500, cursor: "pointer" }}>
                  <i className={`fas ${cfg.icon} mr-1`} style={{ color: `var(--${cfg.color})` }} />
                  {cfg.label} <i className="fas fa-chevron-down ml-1" style={{ fontSize: "0.6rem" }} />
                </DropdownToggle>
                <DropdownMenu className="shadow border-0 rounded-lg">
                  <DropdownItem header>Ubah Status Kost</DropdownItem>
                  {STATUS_FLOW.map((s) => (
                    <DropdownItem 
                      key={s} 
                      onClick={() => handleUpdateStatus(s)}
                      className={kost.status === s ? "active" : ""}
                    >
                      <i className={`${STATUS_CONFIG[s].icon} mr-2 text-${STATUS_CONFIG[s].color}`} />
                      {STATUS_CONFIG[s].label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          </div>
        </div>
      </OffcanvasHeader>
      
      <OffcanvasBody className="d-flex flex-column p-0" style={{ background: "#e5ddd5" }}>
        {/* Internal Notes Section */}
        <div className="bg-white border-bottom p-3 shadow-sm" style={{ zIndex: 10 }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="mb-0 small font-weight-bold text-muted text-uppercase">
              <i className="fas fa-sticky-note mr-1" /> Catat Khusus Kost
            </h6>
            {!isEditingNotes ? (
              <Button color="link" size="sm" className="p-0 text-primary" onClick={() => setIsEditingNotes(true)}>
                Edit
              </Button>
            ) : (
              <div className="d-flex gap-2">
                <Button color="link" size="sm" className="p-0 text-muted mr-2" onClick={() => {
                  setNotes(kost.internal_notes || "");
                  setIsEditingNotes(false);
                }}>
                  Batal
                </Button>
                <Button color="link" size="sm" className="p-0 text-success font-weight-bold" onClick={handleSaveNotes} disabled={savingNotes}>
                  {savingNotes ? <Spinner size="xs" /> : "Simpan"}
                </Button>
              </div>
            )}
          </div>
          
          {isEditingNotes ? (
            <Input 
              type="textarea" 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              placeholder="Tambahkan catatan khusus untuk kost ini..."
              rows="2"
              className="small"
              style={{ borderRadius: "8px", border: "1px solid #e2e8f0" }}
            />
          ) : (
            <div 
              className="p-2 rounded small" 
              style={{ 
                background: notes ? "#fef3c7" : "#f8fafc", 
                border: notes ? "1px solid #fde68a" : "1px dashed #e2e8f0", 
                color: notes ? "#92400e" : "#94a3b8",
                minHeight: "40px",
                cursor: "pointer"
              }}
              onClick={() => setIsEditingNotes(true)}
            >
              {notes || "Klik untuk menambah catatan..."}
            </div>
          )}
        </div>

        {/* Chat Area with WhatsApp style background */}
        <div 
          ref={scrollRef}
          className="flex-grow-1 p-3 overflow-auto d-flex flex-column"
          style={{ 
            gap: "8px", 
            backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            backgroundRepeat: "repeat",
            backgroundSize: "contain"
          }}
        >
          {loading ? (
            <div className="text-center my-auto">
              <Spinner size="sm" color="success" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center my-auto px-4">
              <div className="bg-white p-3 rounded-lg shadow-sm small text-muted">
                Belum ada percakapan dengan <strong>{kost.name}</strong>. 
                Mulai kirim pesan untuk menghubungi pengelola kost.
              </div>
            </div>
          ) : (
            messages
              .slice()
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
              .map((msg, i) => {
                const isMe = msg.is_from_me === true || msg.is_from_me === 1;
                return (
                  <div 
                    key={msg.id || i}
                    className={`d-flex w-100 ${isMe ? 'justify-content-end' : 'justify-content-start'}`}
                    style={{ marginBottom: "2px" }}
                  >
                    <div 
                      style={{ 
                        maxWidth: "80%", 
                        padding: "6px 10px 14px 10px", 
                        borderRadius: "8px",
                        fontSize: "0.9rem",
                        position: "relative",
                        background: isMe ? "#dcf8c6" : "white",
                        boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
                        color: "#303030",
                        borderBottomRightRadius: isMe ? "2px" : "8px",
                        borderBottomLeftRadius: isMe ? "8px" : "2px",
                      }}
                    >
                      <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {msg.content}
                      </div>
                      <div 
                        style={{ 
                          fontSize: "0.65rem", 
                          color: "#999", 
                          textAlign: "right", 
                          position: "absolute", 
                          bottom: "2px", 
                          right: "6px" 
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isMe && (
                          <i 
                            className={`fas fa-check-double ml-1 ${msg.status === 'read' ? 'text-primary' : ''}`}
                            style={{ fontSize: "0.7rem" }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
          )}
          {sending && (
            <div className="d-flex justify-content-end">
              <div className="bg-white p-1 px-2 rounded-lg shadow-sm">
                <Spinner size="xs" color="success" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-2 bg-light border-top">
          <div className="d-flex align-items-center gap-2">
            <Input 
              type="textarea"
              rows="1"
              placeholder="Ketik pesan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              style={{ 
                borderRadius: "20px", border: "none", 
                padding: "8px 15px", maxHeight: "100px", resize: "none" 
              }}
            />
            <Button 
              color="success" 
              className="rounded-circle d-flex align-items-center justify-content-center shadow-sm"
              style={{ width: "45px", height: "45px", flexShrink: 0, padding: 0 }}
              onClick={handleSend}
              disabled={!input.trim() || sending || !kost?.phone}
            >
              <i className="fas fa-paper-plane" />
            </Button>
          </div>
        </div>
      </OffcanvasBody>

      <style>{`
        .offcanvas-header .close {
          margin: 0;
          padding: 8px;
          opacity: 0.5;
        }
        .offcanvas-header .close:hover { opacity: 1; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </Offcanvas>
  );
};

export default KostChatSidebar;
