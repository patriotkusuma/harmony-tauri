import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import axios from 'services/axios-instance';
import moment from 'moment';

const useChart = (authenticated) => {
    const [cartItems, setCartItems] = useState(null);
    const [estimasi, setEstimasi] = useState(moment());
    const [subTotal, setSubTotal] = useState(0);
    const timerRef = useRef(null);

    const headers = useMemo(() => ({
        Authorization: `Bearer ${authenticated}`,
        "Content-Type": "Application/json",
    }), [authenticated]);

    const getCart = useCallback(async () => {
        if (!authenticated) return;
        try {
            const res = await axios.get('api/cart/get-all-cart', { headers });
            setCartItems(res.data.carts);
            setEstimasi(res.data.estimasi_selesai);
            setSubTotal(res.data.total_sub_total);
        } catch (err) {
            console.error(`[useChart] Error fetching data:`, err);
        }
    }, [authenticated, headers]);

    const addCart = useCallback(async (packageID) => {
        try {
            await axios.post('api/cart/add-cart', { id_jenis_cuci: packageID }, { headers });
            getCart();
        } catch (err) {
            console.error(`[useChart] Error adding to cart:`, err);
        }
    }, [headers, getCart]);

    const updateCart = useCallback((value, id) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        
        timerRef.current = setTimeout(async () => {
            try {              
                await axios.patch(`api/cart/update-cart`, {
                    id_jenis_cuci: id, 
                    qty: value
                }, { headers });
                getCart();
            } catch (err) {    
                console.error(`[useChart] Error updating cart:`, err);
            }
        }, 500);
    }, [headers, getCart]);

    const removeOneCart = useCallback(async (item) => {
        try {
            await axios.delete(`api/cart/clear-cart/${item.id_jenis_cuci}`, { headers });
            getCart();
        } catch (err) {
            console.error(`[useChart] Error removing from cart:`, err);
        }
    }, [headers, getCart]);

    const clearCart = useCallback(() => {
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
        getCart
    };
};

export default useChart;