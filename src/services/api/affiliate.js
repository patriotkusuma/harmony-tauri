import axios from "../axios-instance";

const affiliateService = {
  // 1. Partners
  getAffiliates: () => axios.get("api/v2/affiliates"),
  createAffiliate: (data) => axios.post("api/v2/affiliates", data),
  updateAffiliate: (id, data) => axios.put(`api/v2/affiliates/${id}`, data),
  deleteAffiliate: (id) => axios.delete(`api/v2/affiliates/${id}`),

  // 2. Fees
  getFees: (type) => axios.get(`api/v2/affiliates/fees?type=${type}`),
  setFee: (data) => axios.post("api/v2/affiliates/fees", data),
  updateFee: (id, data) => axios.put(`api/v2/affiliates/fees/${id}`, data),
  deleteFee: (id) => axios.delete(`api/v2/affiliates/fees/${id}`),

  // 3. Commissions
  getCommissions: (affiliateId, status = "") => 
    axios.get(`api/v2/affiliates/${affiliateId}/commissions${status ? `?status=${status}` : ""}`),
  confirmCommission: (id) => axios.put(`api/v2/affiliates/commissions/${id}/confirm`),
  payCommission: (id) => axios.put(`api/v2/affiliates/commissions/${id}/pay`),

  // 4. Linked Customers
  getLinkedCustomers: (affiliateId) => axios.get(`api/v2/affiliates/${affiliateId}/customers`),
  linkCustomers: (affiliateId, customerIds) => 
    axios.post(`api/v2/affiliates/${affiliateId}/customers`, { customer_ids: customerIds }),
    
  // 5. Transaction History (New)
  getTransactions: (affiliateId) => axios.get(`api/v2/affiliates/${affiliateId}/transactions`),

  // Helper for searching customers (V2)
  searchCustomers: (query) => axios.get(`api/v2/customer?search=${query}&limit=10`)
};

export default affiliateService;
