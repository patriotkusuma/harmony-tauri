import axios from '../../services/axios-instance'
import Header from 'components/Headers/Header'
import Cookies from 'js-cookie'
import Admin from 'layouts/Admin'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardBody, CardHeader, Col, Container, Nav, NavItem, NavLink, Row, Table } from 'reactstrap'
import { useGetToken } from 'services/api'
import {io} from 'socket.io-client'

const SectionTitle = ({ title, subtitle, light }) => (
  <div className="mb-3">
    <h6 className={`text-uppercase ls-1 mb-1 ${light ? "text-light" : "text-muted"}`}>
      {subtitle}
    </h6>
    <h2 className={`${light ? "text-white" : ""} mb-0`}>
      {title}
    </h2>
  </div>
);


const Dashboard = (props) => {

  const [authToken, setAuthToken] = useState(localStorage.getItem("token")||false)
  const [urutanKerja, setUrutanKerja] = useState(null);
  const [ambilPesanan, setAmbilPesanan] = useState(null);

  const navigate = useNavigate();

  // const socket = io("https://jutra.my.id",{
  //   withCredentials:true,
  //   extraHeaders:{
  //     'my-custom-headers': 'abcd'
  //   }
  // })

  const headers = {
    Authorization: `Bearer ${authToken}`
  }

  const getUrutanKerja = async () => {
    try{
      let data = await axios.get("api/pesanan/urutan-kerja",{headers})
      setUrutanKerja(data.data.pesanans)
    }catch(err){
      Cookies.set();
    }
  }
  const getAmbilKerja = async () => {
    try{
      let data = await axios.get('api/pesanan/get-deadline', {headers})
      setAmbilPesanan(data.data.pesanans);
    }catch(err){

    }
  }

  useEffect(()=>{
    getAmbilKerja()
    getUrutanKerja()
  }, [])

  return (
    <>
      <header className="header bg-gradient-info pb-8 pt-5 pt-md-8">
      </header>
      <Container className='mt--7' fluid>
        <Row>
          <Col className='mb-5 mb-xl-0' xl="6">
          <Card className='shadow mb-3'>
              <CardHeader className=''>
                <Row className='align-items-center'>
                  <div className='col-12'>
                    <h6 className='text-uppercase ls-1 mb-1'>
                      Dikirim Hari Ini
                    </h6>
                    <h2 className='mb-0'>{moment().format('DD MMMM YYYY')}</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <Table className='align-items-center table-flush' responsive>
                  <thead className=''>
                    <tr>
                      <th scope='col'>No</th>
                      <th scope='col'>Nama</th>
                      <th scope='col'>Jam</th>
                      <th scope='col'>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ambilPesanan != null && ambilPesanan.map((ambil, index) => {
                        if(ambil.antar === 1) {
                          
                          return (
                            
                          <tr className='' key={index}>
                            <td>{index+1}</td>
                            <td className=''>
                              <h4 className=''>
                                {ambil.customer.nama}
                                </h4>
                            </td>
                            <td className='font-bold'>
                              <strong>{moment(ambil.tanggal_selesai).format('HH:mm')}</strong>
                            </td>
                            <td>
                                <h4 className={`text-white text-center p-2 ${ambil.status != "diambil" ? "bg-success" : "bg-default"} text-align-center rounded-lg`}>
                                    <span className="mr-2">
                                        {ambil.status}
                                    </span>
                                    {ambil.status == "diambil" && (
                                        <i class="fa-solid fa-circle-check"></i>
                                    )}
                                </h4>
                            </td>
                          </tr>
                          
                      )
                    }
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          <Card className="bg-gradient-default shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col-12">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      Overview
                    </h6>
                    <h2 className="text-white mb-0">Urutan Kerja Hari Ini</h2>
                  </div>
                  <div className="col-12">
                    
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <Table className='align-items-center table-flush' responsive>
                      <thead className='thead-light' >
                        <tr>
                          <th scope='col' style={{width:'15px'}} >No</th>
                          <th scope='col'>Nama</th>
                          <th scope='col'>Pesanan</th>
                          <th scope='col'>Deadline</th>
                        </tr>
                      </thead>
                      <tbody>

                        {Array.isArray(urutanKerja) && urutanKerja.map((urutan, index) => {
                          return(
                            <tr className={index === 0 ? "bg-danger text-light" : ""} key={index}>
                              <td>{index+1}</td>
                              <td className='text-light'>
                                <h4 className='text-light'>
                                {urutan.customer.nama}
                                </h4>
                              </td>
                              <td>
                                {urutan.detail_pesanans.map((detail, index) => {
                                  return (
                                    <Row key={index}>
                                      <Col>
                                        {detail.jenis_cuci.nama}
                                      </Col>
                                    </Row>
                                  )
                                })}
                              </td>
                              <td className='font-bold'>
                                <strong>{moment(urutan.tanggal_selesai).format("HH:mm, DD MMMM YYYY")}</strong>
                              </td>

                            </tr>
                          )
                        })}

                      </tbody>
                    </Table>
              </CardBody>
            </Card>

            
          </Col>
          <Col className='mb-5 mb-xl-0' xl="6">
            <Card className=" shadow">
              <CardHeader className="">
                <Row className="align-items-center">
                  <div className="col-12">
                    <h6 className="text-uppercase  ls-1 mb-1">
                      Ambil Hari Ini
                    </h6>
                    <h2 className=" mb-0">{moment().format('DD MMMM YYYY')}</h2>
                  </div>
                  <div className="col-12">
                    
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <Table className='align-items-center table-flush' responsive>
                      <thead className='' >
                        <tr>
                          <th scope='col'>No</th>
                          <th scope='col'>Nama</th>
                          <th scope='col'>Jam</th>
                          <th scope='col'>Status</th>
                        </tr>
                      </thead>
                      <tbody>

                        {ambilPesanan != null && ambilPesanan.map((ambil, index) => {
                          return(
                            <tr className='' key={index}>
                              <td>{index+1}</td>
                              <td className=''>
                                <h4 className=''>
                                {ambil.customer.nama}
                                </h4>
                              </td>
                              <td className='font-bold'>
                                <strong>{moment(ambil.tanggal_selesai).format("HH:mm")}</strong>
                              </td>
                              <td>
                                <h4 className={`text-white text-center p-2 ${ambil.status != "diambil" ? "bg-success" : "bg-default"} text-align-center rounded-lg`}>
                                    <span className="mr-2">
                                        {ambil.status}
                                    </span>
                                    {ambil.status == "diambil" && (
                                        <i class="fa-solid fa-circle-check"></i>
                                    )}
                                </h4>
                                
                              </td>

                            </tr>
                          )
                        })}

                      </tbody>
                    </Table>
              </CardBody>
            </Card>
          </Col>

          <Col className='mb-5 mb-xl-0' xl="6">
            
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Dashboard;