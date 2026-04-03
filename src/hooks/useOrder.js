import { useEffect, useCallback, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../services/axios-instance';
import { toast } from 'react-toastify';
import { useOrderStore } from '../store/orderStore';
import desktopBridge from '../services/desktop-bridge';

const DATA_QUERY_KEY = ['pesanan'];

const fetchPesanan = async ({ queryKey }) => {
  const [_key, filters, headers] = queryKey;
  
  // Mapping parameters to align with Clean Architecture V2 endpoint
  const params = {
    page: filters.page,
    per_page: filters.rowPerPage,
    search: filters.search,
    status: filters.status,
  };

  if (filters.dateFrom) params.date_from = filters.dateFrom;
  if (filters.dateTo) params.date_to = filters.dateTo;

  const res = await axios.get("api/v2/pesanan", {
    headers,
    params: params
  });
  return res.data;
};

export const useOrder = () => {
  const queryClient = useQueryClient();
  
  // Selectors for store values to prevent unnecessary re-renders
  const filters = useOrderStore((state) => state.filters);
  const setFilters = useOrderStore((state) => state.setFilters);
  const viewMode = useOrderStore((state) => state.viewMode);
  const setViewMode = useOrderStore((state) => state.setViewMode);
  const selectedOrder = useOrderStore((state) => state.selectedOrder);
  const isDetailModalOpen = useOrderStore((state) => state.isDetailModalOpen);
  const toggleDetailModal = useOrderStore((state) => state.toggleDetailModal);

  const authToken = localStorage.getItem("token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${authToken}` }), [authToken]);

  const { data: pesanan, isLoading, isFetching } = useQuery({
    queryKey: [...DATA_QUERY_KEY, filters, headers],
    queryFn: fetchPesanan,
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000
  });

  const refreshData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: DATA_QUERY_KEY });
  }, [queryClient]);

  const updateStatus = useCallback(async (kode_pesan, status) => {
    try {
      await axios.patch(`api/pesanan/update-pesanan/${kode_pesan}`, { status }, { headers });
      refreshData();
      toast.success(`Status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  }, [headers, refreshData]);

  const printName = useCallback(async (order) => {
    if (desktopBridge.hasNativePrint()) {
      try {
        await desktopBridge.printName(order);
        toast.success("Ngeprint Berhasil");
      } catch (err) {
        toast.error("Gagal Ngeprint");
      }
    } else {
      await toast.promise(
        fetch("https://printer.test/coba.php", {
          method: "POST",
          body: JSON.stringify({ data: JSON.stringify(order) })
        }),
        {
          pending: "Sabar, lagi ngeprint....",
          error: "Gagal Ngeprint",
          success: "Ngeprint Berhasil"
        }
      );
    }
  }, []);

  const printInvoice = useCallback(async (order) => {
    if (desktopBridge.hasNativePrint()) {
      try {
        await desktopBridge.printRaw(order);
        toast.success("Ngeprint Berhasil");
      } catch (err) {
        toast.error("Gagal Ngeprint");
      }
    } else {
      await toast.promise(
        fetch("https://printer.test/print_order.php", {
          method: "POST",
          body: JSON.stringify({ data: JSON.stringify(order) })
        }),
        {
          pending: "Sabar, otw ngeprint bosss.....",
          error: "gagal ngeprint bosss...",
          success: "Ngeprint sukses "
        }
      );
    }
  }, []);

  const sendInvoice = useCallback(async (kode_pesan) => {
    const id = toast.loading("Sedang Mengirim Invoice...");
    try {
      const res = await axios.post(`api/notification/send-invoice`, { kode_pesan }, { headers });
      toast.update(id, { render: `${res.data.message} 🥰`, type: "success", isLoading: false, autoClose: 5000 });
      refreshData();
    } catch (err) {
      toast.update(id, { render: "Invoice Gagal Dikirim 🥹", type: "error", isLoading: false, autoClose: 5000 });
      refreshData();
    }
  }, [headers, refreshData]);

  const sendNotification = useCallback(async (kode_pesan) => {
    const id = toast.loading("Sedang Mengirim Notif...");
    try {
      const res = await axios.post(`api/notification/send-notif`, { kode_pesan }, { headers });
      toast.update(id, { render: `${res.data.message} 🥰`, type: "success", isLoading: false, autoClose: 5000 });
      refreshData();
    } catch (err) {
      toast.update(id, { render: "Notif Gagal Dikirim 🥹", type: "error", isLoading: false, autoClose: 5000 });
      refreshData();
    }
  }, [headers, refreshData]);

  return useMemo(() => ({
    pesanan,
    isLoading,
    isFetching,
    filters,
    setFilters,
    viewMode,
    setViewMode,
    selectedOrder,
    isDetailModalOpen,
    toggleDetailModal,
    updateStatus,
    printName,
    printInvoice,
    sendInvoice,
    sendNotification,
    refreshData
  }), [
    pesanan, isLoading, isFetching, filters, setFilters, viewMode, setViewMode,
    selectedOrder, isDetailModalOpen, toggleDetailModal, updateStatus,
    printName, printInvoice, sendInvoice, sendNotification, refreshData
  ]);
};
