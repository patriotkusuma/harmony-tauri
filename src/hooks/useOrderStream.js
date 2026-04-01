import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

/**
 * Hook to subscribe to real-time order updates via Server-Sent Events (SSE).
 * Based on docs/api_realtime_order_stream.md
 */
export const useOrderStream = () => {
    const queryClient = useQueryClient();
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const selectedOutletStr = localStorage.getItem("selected-outlet");
        if (!selectedOutletStr) return;

        try {
            const selectedOutlet = JSON.parse(selectedOutletStr);
            const outletId = selectedOutlet.id;
            const token = localStorage.getItem("token");

            if (!outletId) return;

            // SSE Endpoint
            const baseUrl = "https://go.harmonylaundry.my.id";
            const url = `${baseUrl}/api/v2/orders/stream?outlet_id=${outletId}&token=${token}`;

            console.log('[SSE] Connecting to order stream for outlet:', outletId);
            const evtSource = new EventSource(url);

            evtSource.onopen = () => {
                console.log('[SSE] Connection opened.');
                setIsConnected(true);
            };

            evtSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    console.log('[SSE] Event received:', data);

                    // If order created or updated, invalidate 'pesanan' query
                    if (data.type === 'ORDER_CREATED' || data.type === 'ORDER_UPDATED') {
                        queryClient.invalidateQueries({ queryKey: ['pesanan'] });

                        // Show notification toast
                        const message = data.type === 'ORDER_CREATED' 
                            ? `Pesanan Baru: ${data.order_id}` 
                            : `Pembaruan Pesanan: ${data.order_id} (${data.status})`;
                        
                        toast.info(message, {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });
                    }
                } catch (err) {
                    console.error('[SSE] Failed to parse SSE data:', err);
                }
            };

            evtSource.onerror = (err) => {
                console.error('[SSE] Connection error/disconnected, browser will automatically reconnect.', err);
                setIsConnected(false);
            };

            // Cleanup
            return () => {
                evtSource.close();
                setIsConnected(false);
                console.log('[SSE] Connection closed.');
            };
        } catch (e) {
            console.error('[SSE] Error initializing order stream:', e);
            setIsConnected(false);
        }
    }, [queryClient]);

    return { isConnected };
};
