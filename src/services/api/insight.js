import axios from '../axios-instance';

const fetchAiInsights = async (period = 'monthly', outletId = null, refresh = false) => {
  const params = { period };
  if (outletId) params.outlet_id = outletId;
  if (refresh) params.refresh = "true";
  
  const res = await axios.get('api/v1/insights/performance', { params });
  return res.data.data;
};

const fetchOrderDuration = async (period = 'monthly', outletId = null) => {
  const params = { period };
  if (outletId) params.outlet_id = outletId;
  const res = await axios.get('api/v1/insights/order-duration', { params });
  return res.data.data;
};

export const insightService = {
  fetchAiInsights,
  fetchOrderDuration,
};
