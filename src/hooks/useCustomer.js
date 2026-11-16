import axios from 'services/axios-instance'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import debounce from 'lodash/debounce'
import { attachDummyInsights, resolveCustomerInsights } from 'utils/customerInsights'
import { COUNTRY_LIST } from 'utils/countryList'

const useCustomer = (authenticated) => {
    const [nama, setNama] = useState('')
    const [telpon, setTelpon] = useState('')
    const [idPelanggan, setIdPelanggan] = useState(null)
    const [pelanggan, setPelanggan] = useState([])
    const [customerInsights, setCustomerInsights] = useState(null)
    const [isSearchingCustomers, setIsSearchingCustomers] = useState(false)
    const selectedCustomerIdRef = useRef(null)

    const headers = useMemo(() => ({
        Authorization: `Bearer ${authenticated}`
    }), [authenticated])

    // Pencarian eksplisit: dipanggil oleh modal setiap input berubah.
    // Debounce tetap di sini supaya tidak spam API.
    const searchCustomers = useCallback(
        debounce(async (queryNama, queryTelpon) => {
            const isJustCountryCode = COUNTRY_LIST.some(c => c.code === queryTelpon)
            const effectiveTelpon = isJustCountryCode ? '' : queryTelpon

            if (!authenticated || (!queryNama && !effectiveTelpon)) {
                setPelanggan([])
                setIsSearchingCustomers(false)
                return
            }

            setIsSearchingCustomers(true)
            try {
                const params = {}
                if (queryNama) params.nama = queryNama
                if (effectiveTelpon) params.telpon = effectiveTelpon

                const res = await axios.get('api/customer/get-customer', { params, headers })
                const customers = res.data.customers || []
                const ids = customers.map((customer) => customer.id).filter(Boolean)

                if (!ids.length) {
                    setPelanggan(customers)
                    return
                }

                // Ambil insight semua hasil pencarian dalam satu request.
                try {
                    const insightRes = await axios.get('api/v2/customer/insights', {
                        params: { ids: ids.join(',') },
                        headers,
                    })
                    const insightMap = insightRes.data?.data || {}

                    setPelanggan(customers.map((customer) => {
                        const insight = insightMap[String(customer.id)]
                        // attachDummyInsights hanya menjadi cadangan saat data contoh diaktifkan.
                        return insight
                            ? { ...customer, insights: { ...insight, is_dummy: false } }
                            : attachDummyInsights(customer)
                    }))
                } catch (insightErr) {
                    console.error(`Error fetching customer insights: ${insightErr}`)
                    setPelanggan(customers.map(attachDummyInsights))
                }
            } catch (err) {
                console.error(`Error fetching customer data: ${err}`)
                setPelanggan([])
            } finally {
                setIsSearchingCustomers(false)
            }
        }, 500),
        [authenticated, headers]
    )

    const selectCustomer = useCallback((customer) => {
        if (searchCustomers.cancel) searchCustomers.cancel()

        const customerId = customer.id ?? null
        selectedCustomerIdRef.current = customerId

        setNama(customer.nama || '')
        setTelpon(customer.telpon || '')
        setIdPelanggan(customerId)
        setCustomerInsights(customer.insights || resolveCustomerInsights(customer))
        setPelanggan([])

        // Hasil pencarian biasanya sudah membawa insight. Kalau belum ada,
        // ambil sekali lagi untuk pelanggan yang benar-benar dipilih.
        if (!customer.insights && customerId) {
            axios.get(`api/v2/customer/${customerId}/insights`, { headers })
                .then((res) => {
                    if (String(selectedCustomerIdRef.current) !== String(customerId)) return
                    const insight = res.data?.data
                    if (insight) {
                        setCustomerInsights({ ...insight, is_dummy: false })
                    }
                })
                .catch((err) => {
                    console.error(`Error fetching customer insight: ${err}`)
                })
        }
    }, [searchCustomers, headers])

    // Pelanggan baru: pakai nama/telepon yang diketik, tanpa id pelanggan lama.
    const selectNewCustomer = useCallback(({ nama: newName, telpon: newPhone }) => {
        if (searchCustomers.cancel) searchCustomers.cancel()
        selectedCustomerIdRef.current = null
        setNama((newName || '').trim())
        setTelpon(newPhone || '')
        setIdPelanggan(null)
        setCustomerInsights(null)
        setPelanggan([])
    }, [searchCustomers])

    const resetCustomer = useCallback(() => {
        if (searchCustomers.cancel) searchCustomers.cancel()
        selectedCustomerIdRef.current = null
        setNama('')
        setTelpon('')
        setIdPelanggan(null)
        setCustomerInsights(null)
        setPelanggan([])
    }, [searchCustomers])

    useEffect(() => {
        return () => {
            if (searchCustomers.cancel) searchCustomers.cancel()
        }
    }, [searchCustomers])

    return useMemo(() => ({
        nama,
        setNama,
        telpon,
        setTelpon,
        idPelanggan,
        setIdPelanggan,
        pelanggan,
        customerInsights,
        isSearchingCustomers,
        searchCustomers,
        selectCustomer,
        selectNewCustomer,
        resetCustomer,
    }), [
        nama, telpon, idPelanggan, pelanggan, customerInsights, isSearchingCustomers,
        searchCustomers, selectCustomer, selectNewCustomer, resetCustomer,
    ])
}

export default useCustomer
