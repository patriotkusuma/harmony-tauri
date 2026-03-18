// Socket.io has been removed and replaced by raw WebSocket in relevant components.
export const socket = null;
export const SocketContext = { Provider: ({ children }) => children, Consumer: null };