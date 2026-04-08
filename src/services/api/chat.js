import axios from '../axios-instance';

/**
 * Send a chat message. If session_id is null, backend will create a new session.
 * @param {string|null} sessionId
 * @param {string} content
 */
const sendMessage = async (sessionId, content) => {
  const payload = { content };
  if (sessionId) payload.session_id = sessionId;
  const res = await axios.post('api/v2/chat/send', payload);
  return res.data; // { success, session_id, messages }
};

/**
 * Get all chat sessions belonging to the authenticated user.
 */
const getSessions = async () => {
  const res = await axios.get('api/v2/chat/sessions');
  return res.data.data ?? [];
};

/**
 * Get messages for a specific session.
 */
const getMessages = async (sessionId) => {
  const res = await axios.get(`api/v2/chat/sessions/${sessionId}/messages`);
  return res.data.data ?? res.data.messages ?? [];
};

export const chatService = {
  sendMessage,
  getSessions,
  getMessages,
};
