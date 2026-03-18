import axios from '../../services/axios-instance';

import Header from 'components/Headers/Header'
import Pagination from 'components/Pagination/Pagination';
import { CustomTable } from 'components/Table/CustomTable'
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Card, CardBody, CardFooter, CardHeader, Col, Container, Form, FormGroup, Input, InputGroup, Row } from 'reactstrap'
import RupiahFormater from 'utils/RupiahFormater';


const headRow = [
    "No",
    "Pesanan",
    "Customer",
    "Tanggal",
    "Total",
    "Status",
    "Action"
];

export const RiwayatPesan = (props) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("token")||null)
    const [pesanan, setPesanan] = useState(null);
    const [lastParams, setLastParams] = useState(JSON.parse(localStorage.getItem('lastParams'))||null)
    const [searchData, setSearchData] = useState(lastParams? lastParams.searchData: null);
    const [dateFrom, setDateFrom] = useState(lastParams? lastParams.dateFrom:null);
    const [dateTo, setDateTo] = useState(lastParams?lastParams.dateTo: null);
    const [status, setStatus] = useState(lastParams?lastParams.status: null);
    const [timer, setTimer] = useState(0);
    const currentPage = useRef(lastParams?lastParams.currentPage: 1);
    const rowPerPage = useRef(lastParams?lastParams.rowPerPage:10);
    const navigate = useNavigate()

    const headers = {
        'Authorization':`Bearer ${authToken}`
    }




    // let params = {
    //     page: currentPage.current,
    //     rowPerPage: rowPerPage.current
    // }

    const checkStatus = (param) => {
        switch (param.status) {
            case "diambil":
                return (
                    <h4 className='text-white text-center p-2 bg-default text-align-center rounded-lg'>
                        <span className='mr-2'>{param.status}</span>
                        <i className="fas fa-check-circle"></i>
                    </h4>
                )
            case "batal":
                return (
                    <h4 className='text-white text-center p-2 bg-danger text-align-center rounded-lg'>
                        <span className='mr-2'>{param.status}</span>
                        <i className="fas fa-check-circle"></i>
                    </h4>
                )

            default:
                return (
                    <>
                        <h4 className='text-white text-center p-2 bg-success text-align-center rounded-lg'>
                            <span className='mr-2'>{param.status}</span>
                        </h4>
                        {param.status === "cuci" ? (

                            <a type='button' className='text-danger font-weight-bold mr-2' onClick={()=>{updateStatus(param, "selesai")}} >Selesai</a>
                        ) : ""}
                        <span>-</span>
                        <a type='button' className='text-danger font-weight-bold ml-2' onClick={() => {updateStatus(param, 'diambil')}}>Diambil</a>
                    </>
                )
        }
    }

    const changedFilter = async () => {
        let params = lastParams !== null ?lastParams: {
            page: currentPage.current,
            rowPerPage: rowPerPage.current,
            search: searchData ? searchData : "",
            dateFrom: dateFrom? dateFrom : null,
            dateTo: dateTo ? dateTo : null,
            status: status ? status : ''
        }

        // setSearchData(lastParams !== null ? lastParams.searchData : '')

        clearTimeout(timer);
        const newTimer = setTimeout(async()=>{
            // setPesanan(null);
            await axios.get('api/pesanan/get-pesanan', {
                headers: headers,
                params: params
            })
            .then((res) => {
                setPesanan(res.data)
                currentPage.current = 1
            })
            .catch((err) => {console.log(err)} )
        },200);
        setTimer(newTimer)
    }

    const pageChange = (pageNumber) => {
        currentPage.current = pageNumber;
        changedFilter();
    }

    const previousPage = () => {
        if(currentPage !== 1){
            currentPage.current = currentPage.current -1;
            changedFilter();
        }
    }

    const nextPage = () => {
        if(currentPage !== Math.ceil(pesanan.total / rowPerPage)){
            currentPage.current = currentPage.current +1;
            changedFilter();
        }
    }

    const PrintName = async (e, jumlah=2) => {
        // await axios.post('https://harmony.test/api/print-nama', {data:JSON.stringify(e)}).then((res) => console.log(res))
        // .catch((err) => console.log(err))

        await toast.promise(
            fetch("https://printer.test/coba.php", {
                method: "POST",
                body: JSON.stringify({data: JSON.stringify(e)})
            }),
            {
                pending: "Sabar, lagi ngeprint....",
                error: "Gagal Ngeprint",
                success: "Ngeprint Berhasil"
            }
        )

        // await axios.post('https://printer.test/coba.php', {data:JSON.stringify(e)}).then((res) => console.log(res))
        // .catch((err) => console.log(err))


        
    }

    const kirimInvoice = async(e) =>{
        const id = toast.loading("Sedang Mengirim Invoice...");
        await axios.post(`api/notification/send-invoice`, {
            kode_pesan: e.kode_pesan
        }, {
            headers: {
            'Authorization': `Bearer ${authToken}`
            }
        })
        .then((res) => {
            toast.update(id, {render: `${res.data.message} 🥰`, type: "success", isLoading: false, autoClose: 5000})
            changedFilter()
        })
        .catch((err) =>{
            toast.update(id, {render: "Invoice Gagal Dikirim 🥹", type: "error", isLoading: false, autoClose: 5000})
            changedFilter()

        })
    }
    const kirimNotif = async(e) =>{
        const id = toast.loading("Sedang Mengirim Notif...");
        await axios.post(`api/notification/send-notif`,{
            kode_pesan : e.kode_pesan,
        },{
            headers: {
                'Authorization' : `Bearer ${authToken}`
            }
        })
        .then((res) => {
            toast.update(id, {render: `${res.data.message} 🥰`, type: "success", isLoading: false, autoClose: 5000})
            changedFilter()
        })
        .catch((err) =>{
            toast.update(id, {render: "Invoice Gagal Dikirim 🥹", type: "error", isLoading: false, autoClose: 5000})
            changedFilter()

        })
    }


    const printPesanan =async(e)=>{
        // await axios.post('https://harmony.test/api/print-pesanan',{data:JSON.stringify(e)}).then((res) => console.log(e))
        // .catch((err) => console.log(err))

        await toast.promise(
            fetch("https://printer.test/print_order.php", {
                method: "POST",
                body: JSON.stringify({data: JSON.stringify(e)})
            }),
            {
                pending: "Sabar, otw ngeprint bosss.....",
                error: "gagal ngeprint bosss...",
                success: "Ngeprint sukses "
            }
        )
        // await axios.post('https://printer.test/print_order.php',{data:JSON.stringify(e)}).then((res) => console.log(e))
        // .catch((err) => console.log(err))
    }

    const updateStatus = async(e,currStatus) =>{
        try{

            await axios.patch(`api/pesanan/update-pesanan/${e.kode_pesan}`, {
                status: currStatus,
                // _method: 'patch'
            },{headers}).then((res) =>{
                removeLastParam()
                changedFilter()
            })

        }catch(err){
            console.log(err)
        }
    }

    const detailPage = (kode_pesan)=>{
        let curParams = {
            page: currentPage.current,
            rowPerPage: rowPerPage.current,
            searchData: searchData ? searchData : "",
            dateFrom: dateFrom? dateFrom : null,
            dateTo: dateTo ? dateTo : null,
            status: status ? status : ''
        }

        localStorage.setItem('lastParams', JSON.stringify(curParams))
        navigate(`/admin/riwayat/${kode_pesan}`)
    }

    const removeLastParam = () =>{
        setLastParams(null)
        localStorage.removeItem('lastParams')
    }

    useEffect(()=>{
        if(searchData !== null){
            removeLastParam()
            const delayDebounceFn = setTimeout(() => {
                
                changedFilter();
                // Send Axios request here
              }, 700)
          
              return () => clearTimeout(delayDebounceFn)
        }

        if(authToken != null){
            removeLastParam()
            changedFilter();
        }
        if(dateFrom != null){
            removeLastParam()
            changedFilter();
        }
        if(dateTo != null){
            removeLastParam()
            changedFilter();
        }
        if(status != null)
        {
            removeLastParam()
            changedFilter();
        }

    },[searchData, authToken, dateFrom, dateTo, status])

    // console.log(lastParams)

    return (
        <>
            <header className="header bg-gradient-info pb-8 pt-5 pt-md-8">
            </header>

            <Container className='mt--7' fluid>
                
            <Card>
                <CardHeader className=''>
                    <Row className='align-items-ceenter'>
                        <div className='col-12'>
                            <h6 className='text-uppercase ls-1 mb-1'>
                                Riwayat Pesanan Harmony Laundry
                            </h6>
                            <h2 className='mb-0'>Riwayat Pesanan</h2>
                            
                        </div>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row className='my-3' style={{'gap-y':"12px"}}>
                        <Col xs="12" lg="2">
                            <select 
                                value={rowPerPage.current}
                                onChange={(e) => {
                                    currentPage.current = 1;
                                    rowPerPage.current = e.target.value;
                                    changedFilter();
                                }}

                                className='form-control-alternative form-control form-control-select-sm mr-3'>
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                            </select>
                            
                        </Col>
                        <Col xs="12" lg="2">
                            <select 
                                value={status}
                                onChange={(e) => {
                                    setStatus(e.target.value)
                                    currentPage.current = 1
                                }}
                                className='form-control-alternative form-control form-control-select-sm mr-3'>
                                <option value="">Pilih Status</option>
                                <option value="cuci">Cuci</option>
                                <option value="selesai">Selesai</option>
                                <option value="diambil">Diambil</option>
                            </select>
                        </Col>
                        <Col xs="12" lg="2">
                            <InputGroup className='input-group-alternative'>
                                <InputGroup className='input-group-alternative'>
                                    <Input
                                        id='dateFrom'
                                        name='dateFrom'
                                        type='date'
                                        value={dateFrom ? dateFrom : ""}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                    />
                                </InputGroup>
                            </InputGroup>
                        </Col>
                        <Col xs="12" lg="3">
                            <InputGroup className='input-group-alternative'>
                                <InputGroup className='input-group-alternative'>
                                    <Input
                                        id='dateTo'
                                        name='dateTo'
                                        type='date'
                                        value={dateTo ? dateTo : ""}
                                        onChange={(e) => setDateTo(e.target.value)}
                                    />
                                </InputGroup>
                            </InputGroup>
                        </Col>
                        <Col xs="12" lg="3">
                            <Form className='justify-content-between'>
                                <InputGroup className='input-group-alternative'>
                                    <Input 
                                        id='search'
                                        name='search'
                                        type='text'
                                        value={ lastParams !== null ? lastParams.searchData : (searchData ? searchData : '')}
                                        onChange={(e) => {
                                            setSearchData(e.target.value)
                                            currentPage.current=1
                                        }}
                                        placeholder='Cari Disini'
                                    />
                                    <Button className='shadow-none border-none text-muted bg-transparent'
                                    >
                                        <i className='fa-solid fa-magnifying-glass'></i>
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Col>
                    </Row>

                    <CustomTable
                        headData={headRow}
                        currentUrl = "/order"
                    >   
                    {Array.isArray(pesanan?.data) && pesanan?.data?.map((pesan,index)=> {
                        return (
                            <tr key={index} className={pesan.status === 'batal' && "bg-info"}>
                                <th scope='col' style={{width: '25px'}}>
                                {(pesanan.current_page -
                                                            2) *
                                                            pesanan.per_page +
                                                            index +
                                                            pesanan.per_page +
                                                            1}
                                </th>
                                <td className={'w-25'}>
                                    <span>
                                        {pesan.kode_pesan}
                                    </span>
                                    {Array.isArray(pesan?.detail_pesanans) && pesan?.detail_pesanans?.map((detailPesanan, index) => {
                                        return (
                                            <>
                                                <br/>
                                                <strong>
                                                    {detailPesanan.jenis_cuci.nama}
                                                </strong>
                                            </>
                                        )
                                    })}
                                    <br/>
                                    { pesan.notify_pesan === 0 && pesan.status !== 'diambil' && pesan.status !== 'batal'  && (
                                        <Button 
                                            color='warning'
                                            size='sm'
                                            onClick={()=>{kirimInvoice(pesan)}}
                                            className='mb-1'
                                        >
                                            <i className='fas fa-paper-plane'></i>
                                            <span>Kirim Invoice</span>
                                        </Button>
                                    )}
                                    <br />
                                    { pesan.notify_selesai === 0 && pesan.status !== 'diambil' && pesan.status !== 'batal' && (
                                        <Button 
                                            color='primary'
                                            size='sm'
                                            onClick={()=>{kirimNotif(pesan)}}
                                            className='mt-1'
                                        >
                                            <i className='fas fa-bell'></i>
                                            <span>Kirim Notif</span>
                                        </Button>
                                    )}
                                </td>
                                <td className='d-flex flex-column'>
                                    <strong className='mb-0 text-sm'>
                                        {`${pesan.customer.nama}` }
                                        <br/>
                                        {`${pesan.customer.keterangan !==null ? ("("+pesan.customer.keterangan + ")") :''}`}
                                    </strong>
                                    <span>
                                        WA: {" "}
                                        <a target='_blank' href={'https://wa.me/628' +  (pesan?.customer?.telpon?.substring(2)||"")}>{pesan.customer.telpon}</a>
                                    </span>
                                    <span>
                                        Invoice {pesan.notify_pesan_error === 1 && pesan.notify_pesan === 0 ? "Tidak Terkirim" : "Terkirim"}
                                        <i class={`fas fa-paper-plane text-${pesan.notify_pesan_error ===1 && pesan.notif_pesan === 0 ? "warning" : "default"} ml-2`}></i>
                                    </span>
                                    {pesan.status === "selesai" && (

                                        <span className={`${ pesan.notify_selesai === 0 ? 'p-1 my-1 bg-danger text-white' :' '} rounded`}>
                                            Notif {pesan.notify_selesai === 0 ? "Tidak Terkirim" :"Terkirim"}
                                            <i class={`fas fa-bell ml-2`}></i>
                                        </span>
                                    )}

                                    {pesan.status !== 'batal' && (

                                        <Button 
                                            color='default'
                                            size='sm'
                                            onClick={()=>PrintName(pesan)}
                                        >
                                            <i className='fa-solid fa-print'></i>
                                            <span>Nama</span>
                                        </Button>
                                    )}
                                 
                                        
                                        
                                  
                                </td>
                                <td>
                                    <div className="d-flex flex-column">
                                        <h4 className="font-weight-light">
                                            <i className="fa-solid fa-calendar-check"></i>
                                            <span className="ml-2">
                                                {moment(
                                                    pesan.tanggal_pesan
                                                ).format(
                                                    "DD MMMM YYYY"
                                                )}
                                            </span>
                                        </h4>
                                        <h4 className="text-success">
                                            <i className="fa-solid fa-calendar-check"></i>
                                            <span className="ml-2">
                                                {moment(
                                                    pesan.tanggal_selesai
                                                ).format(
                                                    "DD MMMM YYYY"
                                                )}
                                            </span>
                                        </h4>
                                    </div>
                                </td>
                                <td>
                                    <h5 className={`bg-${pesan.status_pembayaran == "Lunas" ? "default" : "danger"} text-white text-center p-2 rounded-lg`}>
                                        {pesan.status_pembayaran}
                                    </h5>
                                    <h3>
                                        <RupiahFormater value={pesan.total_harga}/>
                                        {/* <AddComma
                                            value={
                                                riwayatPesanan.total_harga
                                            }
                                        /> */}
                                    </h3>
                                </td>
                                <td>
                                    {checkStatus(pesan)}
                                </td>
                                <td style={{width: "10%"}}   >
                                    <Row style={{"gap-y" : "12px"}}>
                                        <Col xs="12">
                                        
                                            <Button 
                                                color='warning'
                                                size='sm'
                                                block
                                                to={`/admin/riwayat/${pesan.kode_pesan}`}
                                                // href={"/pesanan/" + pesan.kode_pesan}
                                                tag={Link}
                                                onClick={()=>{detailPage(pesan.kode_pesan)}}
                                            >
                                                <i className="fa-regular fa-pen-to-square"></i>
                                                <span>Detail</span>
                                            </Button>
                                            {/* <Link
                                                className='p-2 bg-warning text-white w-100 rounded mb-4'
                                                to={{pathname: "/pesanan/" + pesan.kode_pesan}}
                                                state={pesan.kode_pesan}
                                            >
                                                <i className="fa-regular fa-pen-to-square"></i>
                                                <span>Detail</span>

                                            </Link> */}
                                        </Col>
                                        <Col xs="12">
                                        
                                            <Button 
                                                color="default"
                                                size='sm'
                                                onClick={()=> printPesanan(pesan)}
                                                block
                                                >
                                                <i className='fa-solid fa-print'></i>
                                                <span>Print</span>
                                            </Button>
                                        </Col>
                                    </Row>
                                </td>

                            </tr>
                        )
                    })}
                    {pesanan == null && (
                        <tr>
                            <td colSpan={7} className='text-center'>Loading ...</td>
                        </tr>
                    )}

                    </CustomTable>
                </CardBody>
                <CardFooter className='py-4'>
                    <nav aria-label='....'>
                        {pesanan != null &&  (

                            <Pagination 
                            currentPage={pesanan && pesanan.current_page}
                            rowPerPage={rowPerPage.current}
                            totalPosts={pesanan.total}
                            onPageChange={pageChange}
                            previousPage={previousPage}
                            nextPage={nextPage}
                            lastPage={pesanan.last_page}
                            />
                        )}
                    </nav>
                </CardFooter>
                </Card>
            </Container>
        </>
    )
}
