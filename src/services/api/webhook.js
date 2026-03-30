import axios from '../axios-instance';

export const webhookService = {
  getLogs: async (params) => {
    // Expected params: { status, event, device_id, page, limit }
    const res = await axios.get('api/v2/webhook/logs', { params });
    return res.data;
  },

  retryLog: async (id) => {
    // Future expansion: Retry a failed webhook manually
    const res = await axios.post(`api/v2/webhook/logs/${id}/retry`);
    return res.data;
  }
};
