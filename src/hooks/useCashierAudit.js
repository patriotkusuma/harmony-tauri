import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useCashierAuditStore, DEFAULT_DENOMINATIONS } from '../store/cashierAuditStore';

export const useCashierAudit = () => {
  const {
    activeShift,
    userRole,
    historyItems,
    summaryStats,
    totalItems,
    selectedShiftDetail,
    lastClosedResult,
    loadingActive,
    loadingHistory,
    submitting,
    filters,
    setFilters,
    clearLastClosedResult,
    fetchActiveShift,
    fetchShiftHistory,
    fetchShiftDetail,
    openShift,
    addMutation,
    closeShift,
    reviewShift,
  } = useCashierAuditStore();

  // Form Buka Shift
  const [openModal, setOpenModal] = useState(false);
  const [openForm, setOpenForm] = useState({
    shift_name: '',
    opening_cash: '',
    opening_notes: '',
  });

  // Form Mutasi Kas Laci Manual (In / Out)
  const [mutationModal, setMutationModal] = useState(false);
  const [mutationForm, setMutationForm] = useState({
    mutation_type: 'OUT',
    category: 'Operasional Laci',
    amount: '',
    description: '',
  });

  // Form Tutup Shift (Blind Count Kalkulator Pecahan)
  const [closeModal, setCloseModal] = useState(false);
  const [denominations, setDenominations] = useState(
    DEFAULT_DENOMINATIONS.map((d) => ({ ...d }))
  );
  const [manualActualCash, setManualActualCash] = useState('');
  const [closingNotes, setClosingNotes] = useState('');

  // Modal Detail Audit Shift
  const [detailModal, setDetailModal] = useState(false);

  const resetCloseForm = useCallback(() => {
    setDenominations(DEFAULT_DENOMINATIONS.map((d) => ({ ...d })));
    setManualActualCash('');
    setClosingNotes('');
  }, []);

  // Total uang fisik dari kalkulator pecahan
  const denominationTotal = useMemo(() => {
    return denominations.reduce((acc, item) => acc + item.nominal * (Number(item.qty) || 0), 0);
  }, [denominations]);

  const effectiveActualCash = useMemo(() => {
    if (denominationTotal > 0) return denominationTotal;
    return Number(manualActualCash) || 0;
  }, [denominationTotal, manualActualCash]);

  const updateDenominationQty = (nominal, qtyVal) => {
    const cleanQty = Math.max(0, parseInt(qtyVal, 10) || 0);
    setDenominations((prev) =>
      prev.map((d) =>
        d.nominal === nominal
          ? { ...d, qty: cleanQty, subtotal: d.nominal * cleanQty }
          : d
      )
    );
  };

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchActiveShift(), fetchShiftHistory()]);
  }, [fetchActiveShift, fetchShiftHistory]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const handleOpenShift = async (e) => {
    if (e) e.preventDefault();
    const openingCashNum = Number(openForm.opening_cash) || 0;
    if (openingCashNum < 0) {
      toast.warning('Modal awal laci tidak boleh negatif');
      return;
    }

    try {
      await openShift({
        shift_name: openForm.shift_name,
        opening_cash: openingCashNum,
        opening_notes: openForm.opening_notes,
      });
      toast.success('Shift kasir berhasil dibuka');
      setOpenModal(false);
      setOpenForm({ shift_name: '', opening_cash: '', opening_notes: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal membuka shift kasir');
    }
  };

  const handleAddMutation = async (e) => {
    if (e) e.preventDefault();
    const amt = Number(mutationForm.amount) || 0;
    if (amt <= 0) {
      toast.warning('Nominal mutasi harus lebih dari Rp 0');
      return;
    }
    if (!mutationForm.description?.trim()) {
      toast.warning('Keterangan / alasan mutasi wajib diisi agar audit jelas');
      return;
    }

    try {
      await addMutation({
        mutation_type: mutationForm.mutation_type,
        category: mutationForm.category,
        amount: amt,
        description: mutationForm.description,
      });
      toast.success('Mutasi kas laci berhasil dicatat');
      setMutationModal(false);
      setMutationForm({
        mutation_type: 'OUT',
        category: 'Operasional Laci',
        amount: '',
        description: '',
      });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal mencatat mutasi kas');
    }
  };

  const handleCloseShift = async () => {
    const confirm = await Swal.fire({
      title: 'Konfirmasi Blind Count & Tutup Kasir',
      html: `
        <div class="text-start small">
          <p class="mb-2">Anda menyatakan uang fisik di laci saat ini adalah:</p>
          <h3 class="text-primary font-weight-bold mb-3">Rp ${effectiveActualCash.toLocaleString('id-ID')}</h3>
          <div class="alert alert-warning py-2 px-3 mb-0">
            <i class="fas fa-exclamation-triangle me-1"></i>
            <strong>Perhatian:</strong> Setelah dikirim, hitungan tidak dapat diubah. Jika uang fisik kurang dari catatan sistem, selisihnya otomatis tercatat sebagai <strong>Piutang Karyawan</strong>.
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#f5365c',
      cancelButtonColor: '#8898aa',
      confirmButtonText: 'Ya, Kirim & Tutup Shift',
      cancelButtonText: 'Hitung Ulang',
    });

    if (!confirm.isConfirmed) return;

    try {
      const closed = await closeShift({
        actual_cash: effectiveActualCash,
        denominations: denominations.filter((d) => d.qty > 0),
        closing_notes: closingNotes,
      });
      setCloseModal(false);
      resetCloseForm();

      const diff = Number(closed?.difference || 0);
      if (diff < 0) {
        Swal.fire({
          title: 'Selisih Kas Kurang (Minus)!',
          html: `
            <div class="text-start">
              <p class="mb-1">Uang Sistem: <strong>Rp ${(closed.expected_cash || 0).toLocaleString('id-ID')}</strong></p>
              <p class="mb-1">Uang Fisik Laci: <strong>Rp ${(closed.actual_cash || 0).toLocaleString('id-ID')}</strong></p>
              <hr class="my-2"/>
              <p class="text-danger font-weight-bold mb-2">Kurang: Rp ${Math.abs(diff).toLocaleString('id-ID')}</p>
              <p class="small text-muted mb-0">Sistem telah otomatis membukukan selisih ini ke akun <strong>Piutang Karyawan</strong> dan mengirim notifikasi ke Owner.</p>
            </div>
          `,
          icon: 'error',
        });
      } else if (diff > 0) {
        Swal.fire({
          title: 'Shift Ditutup (Selisih Lebih)',
          html: `Uang fisik lebih <strong>Rp ${diff.toLocaleString('id-ID')}</strong> dari catatan sistem (Rp ${(closed.expected_cash || 0).toLocaleString('id-ID')}).`,
          icon: 'info',
        });
      } else {
        Swal.fire({
          title: 'Klop / Sesuai!',
          text: `Uang fisik laci (Rp ${effectiveActualCash.toLocaleString('id-ID')}) sesuai 100% dengan catatan sistem.`,
          icon: 'success',
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menutup shift kasir');
    }
  };

  const handleOpenDetail = async (shiftId) => {
    try {
      await fetchShiftDetail(shiftId);
      setDetailModal(true);
    } catch (err) {
      toast.error('Gagal memuat detail audit shift');
    }
  };

  const handleReviewShift = async (shiftId, notes) => {
    if (!notes?.trim()) {
      toast.warning('Catatan verifikasi wajib diisi');
      return;
    }
    try {
      await reviewShift(shiftId, notes);
      toast.success('Catatan verifikasi Owner disimpan');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Gagal menyimpan review');
    }
  };

  const isPrivileged = userRole === 'admin' || userRole === 'owner';

  return {
    activeShift,
    userRole,
    isPrivileged,
    historyItems,
    summaryStats,
    totalItems,
    selectedShiftDetail,
    lastClosedResult,
    clearLastClosedResult,
    loadingActive,
    loadingHistory,
    submitting,
    filters,
    setFilters,
    fetchShiftHistory,
    refreshAll,

    // Modals & Forms
    openModal,
    setOpenModal,
    openForm,
    setOpenForm,
    handleOpenShift,

    mutationModal,
    setMutationModal,
    mutationForm,
    setMutationForm,
    handleAddMutation,

    closeModal,
    setCloseModal,
    denominations,
    updateDenominationQty,
    denominationTotal,
    manualActualCash,
    setManualActualCash,
    effectiveActualCash,
    closingNotes,
    setClosingNotes,
    resetCloseForm,
    handleCloseShift,

    detailModal,
    setDetailModal,
    handleOpenDetail,
    handleReviewShift,
  };
};
