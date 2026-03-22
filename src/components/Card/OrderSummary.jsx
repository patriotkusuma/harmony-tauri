import moment from "moment"
import { Button, Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap"
import RupiahFormater from "utils/RupiahFormater"
import { isDesktopRuntime } from "services/runtime"
import "../../assets/css/custom-switch.css"

const OrderSummary = ({
        kodePesan, 
        nama, 
        telpon, 
        estimasi, 
        subTotal, 
        isLunas, 
        setIsLunas, 
        onEditCustomer, 
        onSubmitOrder,
        isOrderDisabled,
        antar,
        setAntar,
        onPrintNama,
        onPrintLastOrder,
        onRFIDAttach,
    }) => {
    return (
        <>
           <Card className="mb-2">
                <CardHeader className="pb-2">
                    <Row className="d-flex align-items-center justify-content-between">
                        <Col xs="5">
                            <h3 className="mb-0">Identitas</h3>
                        </Col>
                        <Col className="text-end" xs="7" style={{ display: 'flex', gap: 4, justifyContent: 'flex-end', flexWrap: 'nowrap' }}>
                            <Button color="info" size="sm" onClick={onPrintNama} disabled={!nama} title="Print Nama (F5)">
                                <i className="fa-solid fa-print"></i>
                                <span> Nama</span>
                                <small style={{ fontSize: 9, opacity: 0.7, marginLeft: 3 }}>F5</small>
                            </Button>
                            <Button color="primary" size="sm" onClick={onEditCustomer} className="ms-1" title="Edit Pelanggan (F2)">
                                <i className="fa-solid fa-pen-to-square"></i>
                                <span>F2</span>
                            </Button>
                        </Col>
                    </Row>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md="5">
                            <h4>Kode Pesan</h4>
                        </Col>
                        <Col md="7" className="text-end">
                            <h4>{kodePesan || ''}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <h4>Nama</h4>
                        </Col>
                        <Col md="6" className="text-end">
                            <h4>{nama || ''}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="6">
                            <h4>No Wa</h4>
                        </Col>
                        <Col md="6" className="text-end">
                            <h4>{telpon || ''}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="5">
                            <h4>Tanggal Masuk</h4>
                        </Col>
                        <Col md="7" className="text-end">
                            <h4>{moment().format('HH:mm, DD MMMM YYYY')}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="5">
                            <h4>Tanggal Selesai</h4>
                        </Col>
                        <Col md="7" className="text-end">
                            <h4>{moment(estimasi).format('HH:mm, DD MMMM YYYY')}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="5">
                            <h4 for="antarJemputSwitch">Antar & Jemput ?</h4>
                        </Col>
                        <Col md="7" className="text-end">
                             <div className="custom-switch">
                                <Input
                                type="checkbox"
                                id="antarJemputSwitch"
                                name="antar"
                                checked={antar === 1 ? true :false}
                                onChange={() => setAntar(antar === 1? 0 : 1)}
                                />
                                <label htmlFor="antarJemputSwitch" className="slider"></label>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>
            <Row className="mb-2">
                <Col>
                    <Button className="w-100" color={!isLunas ? 'success' : 'white'} onClick={() => setIsLunas(false)}>
                        Belum Lunas
                    </Button>
                </Col>
                <Col>
                    <Button className="w-100" color={isLunas ? 'success' : 'white'} onClick={() => setIsLunas(true)}>
                        Lunas
                    </Button>
                </Col>
            </Row>
            <Button
                disabled={isOrderDisabled}
                className="w-100"
                color="default"
                onClick={onSubmitOrder}
            >
                <Row className="d-flex justify-content-between">
                    <Col md="4" className="text-start">
                        <span>Bayar</span>
                        <i className="fa-solid fa-arrow-right"></i>
                    </Col>
                    <Col md="8" className="text-end">
                        <RupiahFormater value={subTotal} />
                    </Col>
                </Row>
            </Button>

            {isDesktopRuntime() && (
                <>
                    <Button
                        className="w-100 mt-2"
                        color="success"
                        size="sm"
                        onClick={onRFIDAttach}
                        title="Attach RFID ke Last Order (F4)"
                    >
                        <i className="fas fa-tag me-1" />
                        <span>Attach RFID Last Order</span>
                        <small style={{ fontSize: 9, opacity: 0.75, marginLeft: 5, border: '1px solid rgba(255,255,255,0.4)', padding: '0px 4px', borderRadius: 3 }}>F4</small>
                    </Button>
                    <Button
                        className="w-100 mt-1"
                        color="secondary"
                        size="sm"
                        onClick={onPrintLastOrder}
                        title="Re-Print Struk Terakhir (F3)"
                    >
                        <i className="fa-solid fa-clock-rotate-left me-1" />
                        <span>Re-Print Struk Terakhir</span>
                        <small style={{ fontSize: 9, opacity: 0.7, marginLeft: 5, border: '1px solid rgba(255,255,255,0.3)', padding: '0px 4px', borderRadius: 3 }}>F3</small>
                    </Button>
                </>
            )}
        </>
    )
}

export default OrderSummary
