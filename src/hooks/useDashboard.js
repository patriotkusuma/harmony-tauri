import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../services/axios-instance';

const fetchUrutanKerja = async ({ queryKey }) => {
  const [, headers] = queryKey;
  const res = await axios.get("api/pesanan/urutan-kerja", { headers });
  return res.data.pesanans;
};

const fetchAmbilKerja = async ({ queryKey }) => {
  const [, headers] = queryKey;
  const res = await axios.get('api/pesanan/get-deadline', { headers });
  return res.data.pesanans;
};

export const useDashboard = () => {
  const authToken = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${authToken}` };

  const { 
    data: urutanKerja, 
    isLoading: loadingUrutan,
    refetch: refetchUrutan 
  } = useQuery({
    queryKey: ["urutan-kerja", headers],
    queryFn: fetchUrutanKerja,
    select: (data) => data?.filter(p => !["selesai", "diambil", "batal"].includes(p.status)),
    enabled: !!authToken,
  });

  const { 
    data: ambilPesanan, 
    isLoading: loadingAmbil,
    refetch: refetchAmbil 
  } = useQuery({
    queryKey: ["ambil-pesanan", headers],
    queryFn: fetchAmbilKerja,
    enabled: !!authToken,
  });

  const refreshDashboard = () => {
    refetchUrutan();
    refetchAmbil();
  };

  return {
    urutanKerja,
    ambilPesanan,
    isLoading: loadingUrutan || loadingAmbil,
    refreshDashboard
  };
};
