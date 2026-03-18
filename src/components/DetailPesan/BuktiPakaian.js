import React, { useState } from 'react'
import { Button, Card, CardBody, CardHeader, CardImg, Col, Row } from 'reactstrap'
import Zoom  from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import ModalTambah from './ModalTambah'
import { formatImageUrl } from 'utils/formatImageUrl'

const BuktiPakaian = (props) => {
    const {pesanan} = props
    const [modal, setModal] = useState(false)

    const toggle = () => setModal(!modal)
    return (
        <Card className='bg-secondary shadow mt-3'>
            <CardHeader>
                <Row className="align-items-center">
                    <Col xs="6">
                        <h3 className="mb-0">Bukti</h3>
                    </Col>
                    <Col className="text-right" xs="2">
                        <Button
                            color="default"
                            size="sm"
                            onClick={() => {}}
                        >
                            Print
                        </Button>
                    </Col>
                    <Col className="text-right" xs="2">
                        <Button
                            color="primary"
                            size="sm"
                            onClick={toggle}
                        >
                            Tambah
                        </Button>
                    </Col>
                </Row>
            </CardHeader>
            <CardBody>
                <Row className='my-3'>
                    {pesanan?.bukti_pakaians?.map((bukti_pakaian, index) => {
                        return (
                            <Col md="6">
                                <div className='rounded'>
                                    <Zoom>
                                        <img
                                            alt='bukti_pakaian'
                                            className='rounded'
                                            src={formatImageUrl(bukti_pakaian?.foto)}
                                            style={{aspectRatio:1/1, objectFit: 'cover', width: '100%'}}
                                        />
                                    </Zoom>
                                        {/* <CardImg
                                            src={bukti_pakaian?.foto}
                                            style={{aspectRatio:1/1, objectFit:'cover'}}
                                        /> */}
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            </CardBody>
            <ModalTambah modal={modal} toggle={toggle}/>
        </Card>
    )
}

export default BuktiPakaian