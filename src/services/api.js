import Cookies from "js-cookie"
import axios from "../services/axios-instance"

export const getUrutanKerja = async (headers) => {
    try{
        let res = await axios.get("/urutan-kerja", {headers})
        return res.data
    }catch(err){

    }
}

export const useGetDetailPesanan = async (kode_pesan, headers) => {
    try{
        let res = await axios.get(`/order/${kode_pesan}`, {headers})

        return res.data
    }catch(err){
        console.log(err);
    }
}

export const useGetToken = () => {
    let token = Cookies.get('token')
    return token;
}