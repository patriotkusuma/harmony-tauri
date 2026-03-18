import axios from 'services/axios-instance';
import Order from 'layouts/Order'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Card, CardBody, CardFooter, CardHeader, CardImg, CardImgOverlay, CardText, CardTitle, Col, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from 'reactstrap'
import RupiahFormater from 'utils/RupiahFormater';
import moment from 'moment';

const Pesan = () => {

    const [searchData, setSearchData] = useState();
    const [category, setCategory] = useState();
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('token')||null);
    const [isLunas, setIsLunas] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [cartItems, setCartItems] = useState(null);
    const [estimasi, setEstimasi] = useState(moment());
    const [subTotal, setSubtotal] = useState(0);
    const [idPelanggan, setIdPelanggan]= useState(null)
    const [nama,setNama] = useState(null);
    const [telpon, setTelpon] = useState(null);
    const [timer, setTimer] = useState(null);
    const [pelanggan, setPelanggan] = useState(null);
    const [isOpenBayar, setIsOpenBayar] = useState(false);
    const [valueBayar, setValueBayar] = useState(0);
    const [hoverName,setHoverName] = useState(0)


    const [dataChart, setDataCart] = useState({
        quantity: "",
    })

    let componentRef = useRef();

    let kode_pesan = "HRMN-" + moment().unix();


    const addCart = async (value) => {

        await axios.post('/paket-cart', {
            idJenisCuci: value.id
        },{headers}).then((res) => {
            getCart()
        })
        .catch((err) => console.log(err))
    }

    const getCart = async () => {
        await axios.get('/paket-cart',{headers})
            .then((res) => {
                setCartItems(res.data.data.cart_items)
                setEstimasi(res.data.data.estimasiSelesai)
                setSubtotal(res.data.data.subTotal)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    
    const updateCart = async (value, id) => {
        clearTimeout(timer);

        const newTimer  =  setTimeout( async()=>{  
            await axios.patch('/paket-cart/' + id, {qty: value}, {headers})
            .then((res) => getCart())
            .catch((err) => console.log(err))
        },500);

        setTimer(newTimer);
    }
    const removeOneCart = async(value) => {
        await axios.delete('/paket-cart/' + value.id, {headers})
            .then((res) => {
                getCart()
            })
            .catch((err) => console.log(err))
    }
    const headers = {
        'Authorization' : `Bearer ${authenticated}`
    }

    

    const getCategory = async (searchValue = null) => {
        await axios.get('/category', {
            headers: headers, 
            params: {
                searchData: searchValue !=null ? searchValue : "",
            }
        }).then((res) => {
            setCategory(res.data.data)
            // getCart()
        })
        .catch((err) => console.log(err))
    }




    const toggleModal = () => {
        setIsOpen(!isOpen);
    }

    const handleUserKeyPress = useCallback((event) => {
        const {key, keyCode} = event;
        if(keyCode === 113){setIsOpen(true)}
        if(keyCode === 114){ 
            lastOrder()
            return false
        }
        if(keyCode === 115){
            lastOrder()
            return false
        }
        if(keyCode === 27){setIsOpen(false)}
    })

    const ignore = (e) => {
        if(e.keyCode === 114){
            e.preventDefault()
        }
    }

    const submit = () => {

        let form = {
            kodePesan: "HRMN-" + moment().unix(),
            nama: nama,
            telpon: telpon,
            statusPembayaran: isLunas === true ? "Lunas" : "Belum Lunas",
            bayar: valueBayar
        }

        

        axios.post('/order',{
            id_pelanggan: idPelanggan,
            kodePesan: kode_pesan,
            nama: nama,
            telpon: telpon,
            statusPembayaran: isLunas ===true? "Lunas" : "Belum Lunas",
            subTotal: subTotal,
            totalBayar: valueBayar !== 0 ? valueBayar : 0,
        },{headers})
            .then((res) => {
                printOrder(res.data.data)
                // window.refre
                setCartItems(null)
                setNama(null);
                setTelpon(null);
                setIdPelanggan(null)
                // window.location.reload(true);
               
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const printOrder = async (data) => {
        // await axios.post('https://harmony.test/api/print-order?kode_pesan=' + data.kode_pesan )
        //     .then((res) => {})
        //     .catch((err) => console.log(err))
        await axios.post('https://printer.test/last_order.php', {
            data: JSON.stringify(data)
        } )
            .then((res) => {})
            .catch((err) => console.log(err))
    }

    const printLastOrder = async (data) => {
            // await axios.post('https://harmony.test/api/print-order-last', {data: JSON.stringify(data)})
            //     .then((res) => {})
            //     .catch((err) => {})

        await axios.post("https://printer.test/last_order.php", {
            data: JSON.stringify(data)
        }).then((res) => {console.log(res.data)})

    
    }

    const lastOrder = async () => {
        await axios.get('/last-order', {headers})
            .then((res) => {
                printLastOrder(res.data.data.pesanan)
            })
    }
    useEffect(() => {
        if(authenticated!=null && category == null){
            getCategory()
            getCart()
        }


        window.addEventListener("keyup", handleUserKeyPress);
        window.addEventListener("keydown", ignore);
        return () => {
            window.removeEventListener('keyup', handleUserKeyPress)
            window.removeEventListener('keydown', ignore)
        }

    }, [authenticated, handleUserKeyPress]);

    const getCustomer = async () => {
        clearTimeout(timer);

        const newTimer = setTimeout(async() => {

            await axios.get('pelanggan', {
                params: {
                nama: nama,
                telpon: telpon
            },
                headers: headers
            }).then((res) => {
                setPelanggan(res.data.data);
            }).catch((err) => {
                setTelpon("")
            })
        }, 500);

        setTimer(newTimer);
    }

    const searchCategory = (value) => {
        clearTimeout(timer);

        const newTimer = setTimeout(async() => {
            await getCategory(value)
        }, 700);
        setTimer(newTimer)
    }

    useEffect(()=>{
        if(nama != null){
            getCustomer()
        }
        if(telpon != null){
            getCustomer()
        }
    }, [nama,telpon]);

  return (
    <>
        <Order>
            <Row className='justify-content-center'>
                <Col md="8">
                    <Card>
                        <CardHeader title='Ini adalah judul'>
                            <CardTitle tag={"h3"}>
                                <Row>
                                    <Col md="7">
                                        Daftar Paket Laundry
                                    </Col>
                                    <Col md="5">
                                        <Input
                                            name='nama'
                                            id='nama'
                                            autoFocus={true}
                                            placeholder='Cari Paket Cuci'
                                            onChange={(e) => searchCategory(e.target.value)}
                                            defaultValue={searchData != null ? searchData : ''}
                                        />
                                    </Col>
                                </Row>
                            </CardTitle>
                        </CardHeader>
                        <CardBody className='bg-secondary'>
                            <div className='overflo-scroll'>
                                {category != null && category.map((categoryPaket, index) => {
                                    return (
                                        <>
                                            <h3 className='heading-medium text-muted'>
                                                {categoryPaket.nama + " " + categoryPaket.durasi + " " + categoryPaket.tipe_durasi}
                                            </h3>
                                            <Row className='mb-3'>
                                                {categoryPaket.paket_cuci != null && categoryPaket.paket_cuci.map((paket, index)=> {
                                                    return  (
                                                        <>
                                                            <Col md="3 mt-2">
                                                                <Card   
                                                                        
                                                                    className={`shadow ${cartItems != null && Object.keys(cartItems).length > 0 && cartItems[paket.id] != null && "border border-primary border-5"}`}
                                                                >
                                                                    <CardImg src={paket.gambar}/>
                                                                    {cartItems!=null && Object.keys(cartItems).length !== 0 && cartItems[paket.id] != null && (
                                                                        <CardImgOverlay className='py-2'>
                                                                            <CardText tag={'h2'}>
                                                                                <i className='fa-solid fa-circle-check'></i>
                                                                            </CardText>
                                                                        </CardImgOverlay>
                                                                    )}
                                                                    <CardBody className='p-0'>
                                                                        <CardTitle
                                                                            tag="h"
                                                                            className='pt-0 pb-2 px-2 m-0 justify-content-center d-flex flex-column'
                                                                        >
                                                                            <strong>{paket.nama}</strong>
                                                                            <span>{paket.keterangan}</span>

                                                                            <span>
                                                                                <RupiahFormater value={paket.harga}/>
                                                                            </span>
                                                                        </CardTitle>

                                                                    </CardBody>
                                                                    <Button
                                                                        onClick={()=>{addCart(paket)}}
                                                                    >
                                                                        Tambah
                                                                    </Button>
                                                                </Card>
                                                            </Col>
                                                        </>
                                                    )
                                                })}
                                            </Row>
                                        </>
                                    )
                                })}
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                {/* Right */}
                <Col md="4" className='order-first order-md-last'>
                    <div className=''>
                        <Card className='mb-2'>
                            <CardHeader className='pb-4'>
                                <CardTitle
                                    tag="h2"
                                    className='d-flex justify-content-between'>
                                    <span>Cart</span>
                                    <Button
                                        color='danger'
                                        size='sm'
                                        // onClick={}
                                    >
                                        X
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardBody>
                                {cartItems != null && Object.keys(cartItems).map((key, index) => {
                                    return (
                                        <Row className='bg-info mb-2 rounded align-items-center'>
                                            <Col md="7">
                                                <div className='d-flex align-items-center'>
                                                    <CardImg
                                                        className='rounded-lg p-2'
                                                        style={{width:"80px"}}
                                                        src={cartItems[key].attributes.image}
                                                    />
                                                    <h4 className='d-flex flex-column w-full text-dark'>
                                                        <span className='text-default'>{cartItems[key].attributes.category_paket}</span>
                                                        <span>{cartItems[key].name}</span>
                                                        <span className='font-weight-light'>{cartItems[key].quantity + " Rp " + cartItems[key].price}</span>
                                                    </h4>
                                                </div>
                                            </Col>
                                            <Col md="5">
                                                <div className='d-flex align-items-center ' style={{gap:'5%'}}>
                                                    <Input 
                                                        autoFocus={true}
                                                        className='w-100'
                                                        defaultValue={cartItems[key].quantity}
                                                        onChange={(e) => {
                                                            updateCart(e.target.value, cartItems[key].id)
                                                        }}
                                                    />
                                                    <Button
                                                        color='danger'
                                                        size='sm'
                                                        type='button'
                                                        onClick={() => removeOneCart(cartItems[key])}
                                                    >
                                                        <i className='fa-solid fa-xmark'></i>
                                                    </Button>
                                                </div>
                                            </Col>

                                        </Row>
                                    )
                                })}

                            </CardBody>
                            <CardFooter className='py-2'>
                                <CardTitle
                                    tag="h3"
                                    className='d-flex justify-content-between'
                                >
                                    <span>Sub Total</span>
                                    <span><RupiahFormater value={subTotal}/></span>
                                </CardTitle>
                            </CardFooter>
                        </Card>

                        <Card className='mb-2'>
                            <CardHeader className='pb-2'>
                                <Row className='d-flex align-items-center justify-content-between'>
                                    <Col xs="8">
                                        <h3 className='mb-0'>Identitas</h3>
                                    </Col>
                                    <Col className='text-right' xs="4">
                                        <Button color='primary' size='sm' 
                                            onClick={() => {setIsOpen(true)}}
                                            >
                                            <i className='fa-solid fa-pen-to-square'></i>
                                            <span>Edit</span>
                                        </Button>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col md="5">
                                        <h4>Kode Pesan</h4>
                                    </Col>
                                    <Col md="7" className="text-right">
                                        <h4>{kode_pesan ? kode_pesan : ""}</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <h4>Nama</h4>
                                    </Col>
                                    <Col md="6" className="text-right">
                                        <h4>{nama ? nama : ""}</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="6">
                                        <h4>No Wa</h4>
                                    </Col>
                                    <Col md="6" className="text-right">
                                        <h4>{telpon ? telpon : ""}</h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="5">
                                        <h4>Tanggal Masuk</h4>
                                    </Col>
                                    <Col md="7" className="text-right">
                                        <h4>
                                            {moment().format("HH:mm, DD MMMM YYYY")}
                                        </h4>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md="5">
                                        <h4>Tanggal Selesai</h4>
                                    </Col>
                                    <Col md="7" className="text-right">
                                        <h4>
                                            {moment(estimasi).format('HH:mm, DD MMMM YYYY')}
                                        </h4>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                        <Row className='mb-2'>
                            <Col>
                                <Button
                                    className='w-100'
                                    color={!isLunas ? "success" : "white"}
                                    onClick={()=>{
                                        setIsLunas(false)
                                    }}
                                    >
                                    Belum Lunas
                                </Button>
                            </Col>
                            <Col>
                                <Button
                                    className='w-100'
                                    color={isLunas? 'success' : 'white'}
                                    onClick={()=>{
                                        setIsLunas(true)
                                    }}
                                >
                                    Lunas
                                </Button>
                            </Col>
                        </Row>
                        <Button 
                            disabled={nama === null ? true : false}
                            className='w-100' color='default' onClick={(e) => {
                                 if(isLunas===true){
                                    setIsOpenBayar(true)
                                }else{
                                    setIsOpenBayar(false)
                                    submit()
                                }
                            }}>
                            <Row className='d-flex justify-content-between'>
                                <Col md="4" className='text-left'>
                                    <span>Bayar</span>
                                    <i className='fa-solid fa-arrow-right'></i>
                                </Col>
                                <Col md="8" className='text-right'>
                                    <RupiahFormater value={subTotal}/>
                                </Col>
                            </Row>
                        </Button>
                    </div>
                </Col>
            </Row>
        </Order>

        <Modal centered isOpen={isOpen} autoFocus={false}>
            <ModalHeader>Identitas Customer</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md="6">
                        <FormGroup >
                            <Label className='form-label'>Nama</Label>
                            <Input
                                className='form-control-alternative'
                                name='nama'
                                id='nama'
                                placeholder='Nama Pelanggan'
                                autoFocus={isOpen ==true ? true : false}
                                value={nama ? nama : ''}
                                onChange={(e) => setNama(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    <Col md="6">
                    <FormGroup >
                            <Label className='form-label'>Telpon / WA</Label>
                            <Input
                                className='form-control-alternative'
                                name='telpon'
                                id='telpon'
                                placeholder='No Telpon / Wa'
                                value={telpon ? telpon : ''}
                                onChange={(e) => setTelpon(e.target.value)}
                            />
                        </FormGroup> 
                    </Col>
                    <Col >
                    {pelanggan != null && pelanggan.map((plg, index) => {
                        return (

                            <Button
                                className='mt-1'
                                onClick={()=> {
                                    setNama(plg.nama)
                                    setTelpon(plg.telpon)
                                    setIdPelanggan(plg.id)
                                }}
                                color={hoverName === plg.id ? 'default' : 'white'}
                                onMouseEnter={()=>setHoverName(plg.id)}
                                onMouseLeave={()=>setHoverName(0)}
                            >
                                {plg.nama + " " + plg.telpon}
                                <br></br>
                                <span>
                                {plg.keterangan}
                                </span>
                            </Button>
                        )
                    } )}
                    </Col>
                </Row>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-between'>
                <Button color='secondary' onClick={toggleModal}>
                    Cancel
                </Button>
                <Button color='primary' onClick={toggleModal}>
                    Simpan
                </Button>
            </ModalFooter>
        </Modal>

        <Modal centered isOpen={isOpenBayar} autoFocus={false}>
            <ModalHeader>Pembayaran</ModalHeader>
            <ModalBody>
                <Row>
                    <Col md="12">
                        <FormGroup >
                            <Label className='form-label'>Uang Cash</Label>
                            <Input
                                style={{fontSize:'48px', color: '#000', fontWeight:'bold'}}
                                className='form-control-alternative'
                                name='total_bayar'
                                id='total_bayar'
                                placeholder='50000'
                                autoFocus={isOpenBayar ===true ? true : false}
                                value={valueBayar ? valueBayar : ''}
                                onChange={(e) => setValueBayar(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                    
                </Row>
                <Table>
                    <tbody>

                    <tr>
                        <td className='font-weight-bold'><h4>Sub Total</h4></td>
                        <td><h4><RupiahFormater value={subTotal ? subTotal: 0} /></h4></td>
                    </tr>
                    <tr>
                        <td className='font-weight-bold'><h4>Jumlah Bayar</h4></td>
                        <td><h4><RupiahFormater value={valueBayar ? valueBayar : 0} /></h4></td>
                    </tr>
                    <tr>
                        <td className='font-weight-bold'><h4>Kembali</h4></td>
                        <td ><h4 className='p-2 bg-danger text-white rounded'><RupiahFormater value={subTotal ? (valueBayar - subTotal) : 0} /></h4></td>
                    </tr>
                    </tbody>
                </Table>
            </ModalBody>
            <ModalFooter className='d-flex justify-content-between'>
                <Button color='secondary' onClick={ ()=>setIsOpenBayar(!isOpenBayar)}>
                    Cancel
                </Button>
                <Button color='primary' onClick={()=>submit()}>
                    Simpan
                </Button>
            </ModalFooter>
        </Modal>
    </>
  )
}

export default Pesan