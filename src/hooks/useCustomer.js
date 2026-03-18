import axios from 'services/axios-instance'
import  { useCallback, useEffect, useMemo, useState } from 'react'
import { debounce } from 'lodash'

const COUNTRY_LIST = [
    { code: '62', flag: '🇮🇩', name: 'Indonesia' },
    { code: '60', flag: '🇲🇾', name: 'Malaysia' },
    { code: '65', flag: '🇸🇬', name: 'Singapore' },
    { code: '66', flag: '🇹🇭', name: 'Thailand' },
    { code: '63', flag: '🇵🇭', name: 'Philippines' },
    { code: '84', flag: '🇻🇳', name: 'Vietnam' },
    { code: '61', flag: '🇦🇺', name: 'Australia' },
    { code: '1', flag: '🇺🇸', name: 'USA' },
    { code: '44', flag: '🇬🇧', name: 'UK' },
    { code: '81', flag: '🇯🇵', name: 'Japan' },
    { code: '82', flag: '🇰🇷', name: 'South Korea' },
    { code: '86', flag: '🇨🇳', name: 'China' },
    { code: '91', flag: '🇮🇳', name: 'India' },
    { code: '886', flag: '🇹🇼', name: 'Taiwan' },
];

const useCustomer = (authenticated) => {
    const [nama, setNama] = useState('')
    const [telpon, setTelpon] = useState('')
    const [idPelanggan, setIdPelanggan] = useState(null)
    const [pelanggan, setPelanggan] = useState([]) // Inisialisasi dengan array kosong []

    const headers = useMemo(()=>({
        Authorization: `Bearer ${authenticated}`
    }), [authenticated])

    const searchCustomersDebounced = useCallback(
        debounce(async (queryNama, queryTelpon) => {
            // Abaikan pencarian jika hanya berisi kode negara dari daftar
            const isJustCountryCode = COUNTRY_LIST.some(c => c.code === queryTelpon);
            const effectiveTelpon = isJustCountryCode ? '' : queryTelpon;

            // HANYA LAKUKAN PENCARIAN JIKA ADA QUERY YANG TIDAK KOSONG
            if(!authenticated || (!queryNama && !effectiveTelpon)){
                setPelanggan([]); // Set ke array kosong jika tidak ada query
                return;
            }

            try{
                const params = {};
                if (queryNama) params.nama = queryNama;
                if (effectiveTelpon) params.telpon = effectiveTelpon;

                const res = await axios.get('api/customer/get-customer', { params, headers });
                setPelanggan(res.data.customers);
            }catch(err){
                console.error(`Error fetching customer data: ${err}`);
                setPelanggan([]); // Set ke array kosong saat error
            }

        }, 500),
        [authenticated, headers]
    );

    const selectCustomer = useCallback((customer) => {
        setNama(customer.nama);
        setTelpon(customer.telpon);
        setIdPelanggan(customer.id);
        setPelanggan([]); // Kosongkan saran setelah memilih
    }, []);

    const resetCustomer = useCallback(() => {
        setNama('');
        setTelpon('');
        setIdPelanggan(null);
        setPelanggan([]); // Kosongkan saran saat reset
    }, []);

    useEffect(()=>{
        // Panggil fungsi yang sudah di-debounce dengan nama dan telpon terbaru
        searchCustomersDebounced(nama, telpon);
    }, [nama, telpon, searchCustomersDebounced]);

    useEffect(() => {
        // Cleanup function untuk membatalkan debounce timer
        return () => {
            if (searchCustomersDebounced.cancel) { // Pastikan debounce memiliki metode cancel
                searchCustomersDebounced.cancel();
            }
        };
    }, [searchCustomersDebounced]);

    return useMemo(() => ({
        nama,
        setNama,
        telpon,
        setTelpon,
        idPelanggan,
        setIdPelanggan,
        pelanggan,
        selectCustomer,
        resetCustomer,
    }), [nama, telpon, idPelanggan, pelanggan, selectCustomer, resetCustomer]);
};

export default useCustomer;