import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from '../services/axios-instance';
import { toast } from 'react-toastify';
import moment from 'moment';

const fetchDetailPesanan = async ({ queryKey }) => {
  const [, kodePesan] = queryKey;
  const authToken = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${authToken}` };
  const res = await axios.get(`api/pesanan/get-pesanan/${kodePesan}`, { headers });
  return res.data.data;
};

const fetchOrderLog = async ({ queryKey }) => {
  const [, kodePesan] = queryKey;
  const authToken = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${authToken}` };
  const res = await axios.get(`api/order-log/get-log?kode_pesan=${kodePesan}`, { headers });
  return res.data.data;
};

export const useOrderDetail = () => {
  const { kodePesan } = useParams();
  const queryClient = useQueryClient();
  const authToken = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${authToken}` };

  const [namaPelanggan, setNamaPelanggan] = useState('');
  const [telpon, setTelpon] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [tanggalPesan, setTanggalPesan] = useState('');
  const [tanggalSelesai, setTanggalSelesai] = useState('');
  
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // For Create/Edit modal

  const { data: pesanan, isLoading: loadingPesanan } = useQuery({
    queryKey: ["detail-pesanan", kodePesan],
    queryFn: fetchDetailPesanan,
    enabled: !!kodePesan,
  });

  const { data: logs, isLoading: loadingLog } = useQuery({
    queryKey: ["order-log", kodePesan],
    queryFn: fetchOrderLog,
    enabled: !!kodePesan,
  });

  useEffect(() => {
    if (pesanan) {
      setTanggalPesan(pesanan.tanggal_pesan);
      setTanggalSelesai(pesanan.tanggal_selesai);
      if (pesanan.customer) {
        setNamaPelanggan(pesanan.customer.nama);
        setTelpon(pesanan.customer.telpon);
        setKeterangan(pesanan.customer.keterangan);
      }
    }
  }, [pesanan]);

  const refreshDetail = () => {
    queryClient.invalidateQueries({ queryKey: ["detail-pesanan", kodePesan] });
    queryClient.invalidateQueries({ queryKey: ["order-log", kodePesan] });
    queryClient.invalidateQueries({ queryKey: ["pesanan"] });
  };

  const updateCustomer = async () => {
    if (!pesanan?.customer?.id) return;
    const loadingToast = toast.loading("Menyimpan customer....");
    try {
      await axios.patch(`api/customer/update-customer/${pesanan.customer.id}`, {
        nama: namaPelanggan,
        telpon: telpon,
        keterangan: keterangan,
      }, { headers });
      toast.update(loadingToast, { render: "Berhasil update customer!", type: "success", isLoading: false, autoClose: 3000 });
      refreshDetail();
    } catch (err) {
      toast.update(loadingToast, { render: "Gagal update customer", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const updateAntarJemput = async (antar) => {
    const loadingToast = toast.loading("Menyimpan delivery...");
    try {
      await axios.patch(`api/pesanan/update-pesanan/${kodePesan}`, { antar }, { headers });
      toast.update(loadingToast, { render: "Berhasil update delivery!", type: "success", isLoading: false, autoClose: 3000 });
      refreshDetail();
    } catch (err) {
      toast.update(loadingToast, { render: "Gagal update delivery", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const updateTanggal = async () => {
    const loadingToast = toast.loading("Memperbarui tanggal...");
    try {
      await axios.patch(`api/pesanan/${kodePesan}/tanggal`, {
        tanggal_pesan: moment(tanggalPesan).format("YYYY-MM-DD HH:mm:ss"),
        tanggal_selesai: moment(tanggalSelesai).format("YYYY-MM-DD HH:mm:ss"),
      }, { headers });
      toast.update(loadingToast, { render: "Berhasil update tanggal!", type: "success", isLoading: false, autoClose: 3000 });
      refreshDetail();
    } catch (err) {
      toast.update(loadingToast, { render: err.response?.data?.message || "Gagal update tanggal", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  const cancelOrder = async () => {
    const loadingToast = toast.loading("Membatalkan pesanan...");
    try {
      await axios.post(`api/pesanan/cancel-pesanan/${kodePesan}`, {}, { headers });
      toast.update(loadingToast, { render: "Pesanan berhasil dibatalkan!", type: "success", isLoading: false, autoClose: 3000 });
      setIsCancelModalOpen(false);
      refreshDetail();
    } catch (err) {
      toast.update(loadingToast, { render: err.response?.data?.message || "Gagal membatalkan pesanan", type: "error", isLoading: false, autoClose: 3000 });
    }
  };

  return {
    kodePesan,
    pesanan,
    logs,
    loadingPesanan,
    loadingLog,
    namaPelanggan, setNamaPelanggan,
    telpon, setTelpon,
    keterangan, setKeterangan,
    tanggalPesan, setTanggalPesan,
    tanggalSelesai, setTanggalSelesai,
    isCancelModalOpen, setIsCancelModalOpen,
    isModalOpen, setIsModalOpen,
    updateCustomer,
    updateAntarJemput,
    updateTanggal,
    cancelOrder,
    refreshDetail
  };
};
