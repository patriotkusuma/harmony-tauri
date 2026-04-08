import { create } from 'zustand';
import { chatService } from '../services/api/chat';

const useChatStore = create((set, get) => ({
  sessions: [],
  activeSessionId: null,
  messages: [],
  loadingSessions: false,
  loadingMessages: false,
  sending: false,
  error: null,

  /** Load all past sessions */
  fetchSessions: async () => {
    set({ loadingSessions: true, error: null });
    try {
      const sessions = await chatService.getSessions();
      set({ sessions, loadingSessions: false });
    } catch (err) {
      set({ error: err?.response?.data?.error ?? 'Gagal memuat sesi chat', loadingSessions: false });
    }
  },

  /** Select a session and FETCH its messages from API */
  selectSession: async (sessionId) => {
    set({ activeSessionId: sessionId, loadingMessages: true, messages: [] });
    try {
      const messages = await chatService.getMessages(sessionId);
      set({ messages, loadingMessages: false });
    } catch (err) {
      set({ error: err?.response?.data?.error ?? 'Gagal memuat pesan', loadingMessages: false });
    }
  },

  /** Start a brand-new session */
  newSession: () => {
    set({ activeSessionId: null, messages: [] });
  },

  /** Send a message to the AI */
  sendMessage: async (content) => {
    if (!content?.trim()) return;
    const { activeSessionId } = get();
    set({ sending: true, error: null });

    // Optimistically add user message
    const tempUserMsg = {
      id: `tmp-${Date.now()}`,
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    set((state) => ({ messages: [...state.messages, tempUserMsg] }));

    try {
      const result = await chatService.sendMessage(activeSessionId, content);
      const newMessages = result.messages ?? [];
      const newSessionId = result.session_id;
      const updatedSession = result.session;

      set((state) => {
        const exists = state.sessions.find((s) => s.id === newSessionId);
        const updatedSessions = exists
          ? state.sessions.map((s) =>
              s.id === newSessionId
                ? { ...s, title: updatedSession?.title ?? s.title, updated_at: new Date().toISOString() }
                : s
            )
          : [
              {
                id: newSessionId,
                title: updatedSession?.title ?? content.slice(0, 40),
                updated_at: new Date().toISOString(),
              },
              ...state.sessions,
            ];

        return {
          activeSessionId: newSessionId,
          messages: newMessages,
          sessions: updatedSessions,
          sending: false,
        };
      });
    } catch (err) {
      set((state) => ({
        messages: state.messages.filter((m) => m.id !== tempUserMsg.id),
        error: err?.response?.data?.error ?? 'Gagal mengirim pesan',
        sending: false,
      }));
    }
  },

  clearError: () => set({ error: null }),
}));

export default useChatStore;
