import React, { useCallback, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "services/axios-instance";
import BuktiFotoSection from "./BuktiFotoSection";

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

/**
 * fetchBuktiPesanan mengambil seluruh bukti milik satu pesanan dalam satu
 * panggilan: bukti pembayaran, foto pakaian, dan bukti pengiriman.
 * Field `tersedia` dari server dipakai untuk menandai berkas yang hilang.
 */
const fetchBuktiPesanan = async ({ queryKey }) => {
  const [, kodePesan] = queryKey;
  const res = await axios.get("api/v2/bukti-pesanan", {
    headers: authHeaders(),
    params: { kode_pesan: kodePesan },
  });
  return res.data.data;
};

const BuktiPesananSection = ({ kodePesan }) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["bukti-pesanan", kodePesan],
    queryFn: fetchBuktiPesanan,
    enabled: !!kodePesan,
  });

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["bukti-pesanan", kodePesan] });
  }, [queryClient, kodePesan]);

  // Bukti pengiriman diunggah dari sini (satu pesanan boleh punya banyak foto).
  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // agar file yang sama bisa dipilih ulang
    if (!file) return;

    const formData = new FormData();
    formData.append("kode_pesan", kodePesan);
    formData.append("foto", file);
    formData.append("keterangan", "Bukti pengiriman");

    setUploading(true);
    const toastId = toast.loading("Mengunggah bukti pengiriman…");
    try {
      await axios.post("api/v2/bukti-kirims", formData, {
        headers: authHeaders(),
      });
      toast.update(toastId, {
        render: "Bukti pengiriman tersimpan!",
        type: "success",
        isLoading: false,
        autoClose: 2500,
      });
      refresh();
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.error || "Gagal mengunggah bukti pengiriman",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    const toastId = toast.loading("Menghapus bukti…");
    try {
      await axios.delete(`api/v2/bukti-kirims/${item.id}`, {
        headers: authHeaders(),
      });
      toast.update(toastId, {
        render: "Bukti dihapus",
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
      refresh();
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.error || "Gagal menghapus bukti",
        type: "error",
        isLoading: false,
        autoClose: 4000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-4 text-muted">
        <i className="fas fa-spinner fa-spin me-2" /> Memuat bukti…
      </div>
    );
  }

  const pembayaran = data?.pembayaran || [];
  const pakaian = data?.pakaian || [];
  const pengiriman = data?.pengiriman || [];

  // Tidak ada bukti sama sekali: tetap tampilkan bagian pengiriman supaya
  // kasir/kurir bisa mengunggah bukti kirim pertamanya.
  return (
    <>
      <BuktiFotoSection
        title="Bukti Pembayaran"
        icon="fas fa-receipt"
        accent="success"
        items={pembayaran}
        emptyHint="Pesanan ini belum memiliki foto bukti pembayaran."
      />

      <BuktiFotoSection
        title="Bukti Foto Baju"
        icon="fas fa-tshirt"
        accent="info"
        items={pakaian}
        emptyHint="Belum ada foto bukti pakaian untuk pesanan ini."
      />

      <BuktiFotoSection
        title="Bukti Pengiriman"
        icon="fas fa-truck"
        accent="primary"
        items={pengiriman}
        emptyHint="Belum ada bukti pengiriman. Unggah foto saat pesanan diserahkan."
        canUpload
        uploading={uploading}
        onUpload={handleUploadClick}
        onDelete={handleDelete}
      />

      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="d-none"
        onChange={handleFileChange}
      />
    </>
  );
};

export default BuktiPesananSection;
