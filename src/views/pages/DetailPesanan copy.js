import axios from "../../services/axios-instance";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";



// Layout
import MyLayout from "layouts/MyLayout";

// Components
import AntarJemputCard from "components/DetailPesanan/AntarJemputCard"; // Path placeholder
import PesananInfoCard from "components/DetailPesanan/PesananInfoCard"; // Path placeholder
import DetailPakaianSection from "components/DetailPesanan/DetailPakaianSection"; // Path placeholder
import Create from "components/Modals/DetailPesanan/Create";
import BuktiPakaian from "components/DetailPesan/BuktiPakaian";
import DetailPesananHeader from "components/DetailPesanan/DetailPesananHeader";
import { toast } from "react-toastify";

const DetailPesanan = (props) => {
  // const {pesanan} = this.props;
  const { kodePesan } = useParams();
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("token") || null
  );
  const [pesanan, setPesanan] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filteredData, setFilteredData] = useState(null);
  const [namaPelanggan, setNamaPelanggan] = useState();
  const [telpon, setTelpon] = useState();
  const [keterangan, setKeterangan] = useState();
  const [antarActive, setAntarActive] = useState(0);


  const deletePakaian = async (e) => {
    await axios.post(
      `/pakaian/${e.id}`,
      {
        _method: "delete",
      },
      { headers }
    );
  };

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  const toggleModal = () => {
    setFilteredData(null);
    setIsModalOpen(!isModalOpen);
  };

  const editModal = (pakaian) => {
    setFilteredData(pakaian);
    setIsModalOpen(true);
  };
  const getDetailPesanan = async () => {
    await axios
      .get(`api/pesanan/get-pesanan/${kodePesan}`, { headers })
      .then((res) => {
        setPesanan(res.data.data);
        setAntarActive(res.data.data.antar);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  const updatePakaian = async (pakaian, jumlah) => {
    await axios
      .post(
        `/pakaian/${pakaian.id}`,
        {
          id: pakaian.id,
          nama: pakaian.nama_pakaian,
          kodePesan: pakaian.kodePesan,
          jumlah: jumlah,
          _method: "patch",
        },
        { headers }
      )
      .then((res) => {
        getDetailPesanan();
      })
      .catch((err) => console.log(err));
  };

  const updateNama = async (e) => {
    const loadingToast = toast.loading("Menyimpan customer....")
    try{
      const response = await axios.patch(
        `api/customer/update-customer/${e.customer.id}`,
        {
          nama: namaPelanggan != null ? namaPelanggan : e.customer.nama,
          telpon: telpon != null ? telpon : e.customer.telpon,
          keterangan: keterangan != null ? keterangan : e.customer.keterangan,
        },
        { headers }
      )

      toast.update(loadingToast, {
        render:`Berhasil update customer!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,

      })
    }catch(err){
      toast.update(loadingToast, {
        render:
          err.response?.data?.error || "Terjadi kesalahan saat update",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
      });

    }
    // await axios
    //   .patch(
    //     `api/customer/update-customer/${e.customer.id}`,
    //     {
    //       nama: namaPelanggan != null ? namaPelanggan : e.customer.nama,
    //       telpon: telpon != null ? telpon : e.customer.telpon,
    //       keterangan: keterangan != null ? keterangan : e.customer.keterangan,
    //     },
    //     { headers }
    //   )
    //   .then((res) => {
    //     getDetailPesanan();
    //   })
    //   .catch((err) => console.log(err));
  };

  const updateAntarJemput = async (antar, e) => {
    const loadingToast = toast.loading("Menyimpan customer....")
    try{
      const response = await axios.patch(
        `api/pesanan/update-pesanan/${kodePesan}`,
        {
          antar: antar,
          // _method: "patch",
        },
        { headers }
      )

      setPesanan(response.data.pesanan);
      setAntarActive(response.data.pesanan.antar)
      toast.update(loadingToast, {
        render:`Berhasil update delivery!`,
        type: "success",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        closeButton:true

      })
    }catch(err){
      toast.update(loadingToast, {
        render:
          err.response?.data?.error || "Terjadi kesalahan saat update",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        closeOnClick: true,
        closeButton: true
      });

    }
    // await axios
    //   .patch(
    //     `api/pesanan/update-pesanan/${kodePesan}`,
    //     {
    //       antar: antar,
    //       // _method: "patch",
    //     },
    //     { headers }
    //   )
    //   .then((res) => {
    //     setPesanan(res.data.pesanan);
    //     setAntarActive(res.data.pesanan.antar)
    //     // getDetailPesanan()
    //   });
  };

  const printPakaian = async (data) => {
    try {
      await axios.post("https://printer.test/print_pakaian.php", {
        data: JSON.stringify(data),
      });
    } catch (err) {
      console.error("Error printing clothes:", err);
    }
  };





  useEffect(() => {
    if (pesanan == null) {
      if (authToken != null) {
        getDetailPesanan();
      }
    }
  }, [pesanan]);
  return (
    <MyLayout header={`Detail Pesanan ${kodePesan}`}>
      
      {/* DetailPesananHeader component removed as customer info is moved */}
      <header className="bg-gradient-info pb-8 pt-5 pt-md-8">
        <DetailPesananHeader/>
      </header>
      

      {pesanan != null && (
        <>
          <Container className="mt--8" fluid>
            <Row>
              <Col md="6">
                <AntarJemputCard
                  antarActive={antarActive}
                  updateAntarJemput={updateAntarJemput}
                  pesanan={pesanan}
                />
              </Col>
              <Col md="6">{/* Keeping column structure */}</Col>
            </Row>
          </Container>

          <Container className="" fluid>
            <Row>
              <Col md="6">
                <PesananInfoCard
                  pesanan={pesanan}
                  kodePesan={kodePesan}
                  namaPelanggan={namaPelanggan}
                  setNamaPelanggan={setNamaPelanggan}
                  telpon={telpon}
                  setTelpon={setTelpon}
                  keterangan={keterangan}
                  setKeterangan={setKeterangan}
                  updateNama={updateNama}
                />
              </Col>
              <Col md="6">
                {/* <DetailPakaianSection
                  pesanan={pesanan}
                  printPakaian={printPakaian}
                  setIsModalOpen={setIsModalOpen}
                  updatePakaian={updatePakaian}
                  editModal={editModal}
                  deletePakaian={deletePakaian}
                />
                <BuktiPakaian pesanan={pesanan} /> */}
              </Col>
              
            </Row>

            <Create
              isOpen={isModalOpen}
              toggleModal={toggleModal}
              kodePesan={kodePesan}
              filteredData={filteredData}
              onSubmitSuccess={getDetailPesanan}
            />
          </Container>
        </>
      )}
    </MyLayout>
  );
};

export default DetailPesanan;
