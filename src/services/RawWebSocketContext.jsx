import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import notificationSound from '../assets/sound/notification_sound.mp3';

const RawWebSocketContext = createContext(null);

const STORAGE_KEY = 'ws_notifications';
const MAX_NOTIFICATIONS = 100;

export const RawWebSocketProvider = ({ children }) => {
    const [wsConnected, setWsConnected] = useState(false);
    const [notifications, setNotifications] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    });
    const [unreadCount, setUnreadCount] = useState(0);
    const [currentDeviceId, setCurrentDeviceId] = useState(null);
    const wsRef = useRef(null);
    const subscribersRef = useRef([]);

    // Persist notifications to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    }, [notifications]);

    const subscribe = useCallback((callback) => {
        subscribersRef.current.push(callback);
        return () => {
            subscribersRef.current = subscribersRef.current.filter(cb => cb !== callback);
        };
    }, []);

    const playNotificationSound = () => {
        const audio = new Audio(notificationSound);
        audio.play().catch(e => console.warn("[Audio] Autoplay blocked or error:", e));
    };

    const connect = useCallback((deviceId) => {
        if (!deviceId) return;

        if (wsRef.current) {
            wsRef.current.onclose = null;
            wsRef.current.close();
        }

        const wsUrl = `wss://ws.harmonylaundry.my.id/ws?device_id=${deviceId}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log(`[Global WebSocket] Connected: ${deviceId}`);
            setWsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const rawData = JSON.parse(event.data);
                
                // Notify all subscribers (like ChatUi)
                subscribersRef.current.forEach(callback => callback(rawData));

                if (rawData.code === "message") {
                    const isFromMe = rawData.data.from === deviceId || rawData.data.from_me === true;
                    if (!isFromMe) {
                        playNotificationSound();
                        
                        // Add to notifications list with timestamp for UI
                        const newNotif = {
                            ...rawData.data,
                            received_at: new Date().toISOString()
                        };

                        setNotifications(prev => {
                            const updated = [newNotif, ...prev];
                            return updated.slice(0, MAX_NOTIFICATIONS);
                        });
                        
                        setUnreadCount(prev => prev + 1);
                    }
                }
            } catch (e) {
                // Ignore non-JSON or malformed
            }
        };

        ws.onclose = () => {
            console.log(`[Global WebSocket] Disconnected`);
            setWsConnected(false);
            // Simple reconnect logic after 5 seconds if still the same device
            setTimeout(() => {
                const currentStoredOutlet = JSON.parse(localStorage.getItem("selected-outlet")) || null;
                const currentStoredPhone = currentStoredOutlet?.telpon;
                const currentStoredNormalized = currentStoredPhone?.startsWith('0') ? '62' + currentStoredPhone.substring(1) : currentStoredPhone;
                const currentStoredDeviceId = currentStoredNormalized ? `${currentStoredNormalized}@s.whatsapp.net` : null;

                if (currentStoredDeviceId === deviceId) {
                    connect(deviceId);
                }
            }, 5000);
        };

        ws.onerror = (err) => {
            console.error(`[Global WebSocket] Error:`, err);
            ws.close();
        };
    }, []);

    useEffect(() => {
        const selectedOutlet = JSON.parse(localStorage.getItem("selected-outlet")) || null;
        if (selectedOutlet?.telpon) {
            const phone = selectedOutlet.telpon;
            const normalizedPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone;
            const deviceId = `${normalizedPhone}@s.whatsapp.net`;
            setCurrentDeviceId(deviceId);
            connect(deviceId);
        }

        return () => {
            if (wsRef.current) {
                wsRef.current.onclose = null;
                wsRef.current.close();
            }
        };
    }, [connect]);

    const markAsRead = () => {
        setUnreadCount(0);
    };

    const clearNotifications = () => {
        setNotifications([]);
        localStorage.removeItem(STORAGE_KEY);
    };

    const reconnect = () => {
        const selectedOutlet = JSON.parse(localStorage.getItem("selected-outlet")) || null;
        if (selectedOutlet?.telpon) {
            const phone = selectedOutlet.telpon;
            const normalizedPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone;
            const deviceId = `${normalizedPhone}@s.whatsapp.net`;
            setCurrentDeviceId(deviceId);
            connect(deviceId);
        }
    };

    return (
        <RawWebSocketContext.Provider value={{ 
            wsConnected, 
            notifications, 
            unreadCount, 
            markAsRead,
            clearNotifications,
            reconnect,
            subscribe 
        }}>
            {children}
        </RawWebSocketContext.Provider>
    );
};

export const useRawWebSocket = () => {
    const context = useContext(RawWebSocketContext);
    if (!context) {
        throw new Error('useRawWebSocket must be used within a RawWebSocketProvider');
    }
    return context;
};
