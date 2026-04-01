import { create } from 'zustand';
import axios from '../services/axios-instance';
import { toast } from 'react-toastify';

export const useIoTStore = create((set, get) => ({
  devices: [],
  loading: false,
  total: 0,

  fetchDevices: async (outletId = null) => {
    set({ loading: true });
    try {
      const params = outletId ? { outlet_id: outletId } : {};
      const res = await axios.get('/api/v2/iot-device', { params });
      const data = res.data.data || [];
      set({ devices: data, total: data.length });
    } catch (err) {
      console.error('Error fetching devices:', err);
      toast.error('Gagal memuat daftar perangkat IoT');
    } finally {
      set({ loading: false });
    }
  },

  createDevice: async (payload) => {
    try {
      await axios.post('/api/v2/iot-device', payload);
      toast.success('Perangkat IoT berhasil didaftarkan');
      get().fetchDevices();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mendaftar perangkat');
      return false;
    }
  },

  updateDevice: async (id, payload) => {
    try {
      await axios.put(`/api/v2/iot-device/${id}`, payload);
      toast.success('Data perangkat berhasil diperbarui');
      get().fetchDevices();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal update perangkat');
      return false;
    }
  },

  deleteDevice: async (id) => {
    try {
      await axios.delete(`/api/v2/iot-device/${id}`);
      toast.success('Perangkat berhasil dihapus');
      get().fetchDevices();
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal hapus perangkat');
      return false;
    }
  },

  mapMachineRFID: async (machineId, rfidCode) => {
    try {
      await axios.post(`/api/mesin/${machineId}/rfid`, { rfid_code: rfidCode });
      toast.success('RFID berhasil dihubungkan ke mesin');
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mapping RFID');
      return false;
    }
  }
}));
