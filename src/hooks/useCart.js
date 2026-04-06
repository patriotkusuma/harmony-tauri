import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import axios from '../services/axios-instance';
import moment from 'moment';

/**
 * useCart - Hook for Cart V2 (Clean Architecture)
 * Supports user-based and customer-based carts.
 * 
 * @param {string} authenticated - Auth token
 * @param {number|null} idCustomer - Optional customer ID to switch to customer cart
 */
const useCart = (authenticated, idCustomer = 0) => {
    const [cartItems, setCartItems] = useState(null);
    const [estimasi, setEstimasi] = useState(moment());
    const [subTotal, setSubTotal] = useState(0);
    const timerRef = useRef(null);

    const headers = useMemo(() => ({
        Authorization: `Bearer ${authenticated}`,
        "Content-Type": "application/json",
    }), [authenticated]);

    // Build query params for customer-specific requests
    const getParams = useCallback(() => {
        return idCustomer ? { id_customer: idCustomer } : {};
    }, [idCustomer]);

    const getCart = useCallback(async () => {
        if (!authenticated) return;
        try {
            const res = await axios.get('api/v2/cart', { 
                headers,
                params: getParams()
            });
            
            setCartItems(res.data.carts);
            setEstimasi(res.data.estimasi_selesai);
            setSubTotal(res.data.total_sub_total);
        } catch (err) {
            console.error(`[useCart] Error fetching data:`, err);
        }
    }, [authenticated, headers, getParams]);

    const addCart = useCallback(async (packageID) => {
        try {
            await axios.post('api/v2/cart', { 
                id_jenis_cuci: packageID,
                id_customer: idCustomer || 0
            }, { headers });
            getCart();
        } catch (err) {
            console.error(`[useCart] Error adding to cart:`, err);
        }
    }, [headers, getCart, idCustomer]);

    const updateCart = useCallback((value, id) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(async () => {
            try {              
                await axios.patch(`api/v2/cart`, {
                    id_jenis_cuci: id, 
                    qty: value,
                    id_customer: idCustomer || 0
                }, { headers });
                getCart();
            } catch (err) {    
                console.error(`[useCart] Error updating cart:`, err);
            }
        }, 500);
    }, [headers, getCart, idCustomer]);

    const removeOneCart = useCallback(async (item) => {
        try {
            await axios.delete(`api/v2/cart/${item.id_jenis_cuci}`, { 
                headers,
                params: getParams()
            });
            getCart();
        } catch (err) {
            console.error(`[useCart] Error removing from cart:`, err);
        }
    }, [headers, getCart, getParams]);

    const clearCart = useCallback(async () => {
        try {
            await axios.delete('api/v2/cart/clear', { 
                headers,
                params: getParams()
            });
            setCartItems(null);
            setSubTotal(0);
            setEstimasi(null);
        } catch (err) {
            console.error(`[useCart] Error clearing cart:`, err);
        }
    }, [headers, getParams]);

    // Force local clear (without API call, e.g. after order success)
    const resetCartLocal = useCallback(() => {
        setCartItems(null);
        setSubTotal(0);
        setEstimasi(null);
    }, []);

    useEffect(() => {
        getCart();
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [getCart]);
    
    return {
        cartItems,
        estimasi,
        subTotal,
        addCart,
        updateCart,
        removeOneCart,
        clearCart,
        getCart,
        resetCartLocal
    };
};

export default useCart;
