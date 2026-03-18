import React from "react";
import { Container, Row, Col, Card } from "reactstrap";

// Hooks
import { useEmployeeManagement } from "hooks/useEmployeeManagement";

// Organisms
import EmployeeHeader from "components/organisms/EmployeeHeader";
import EmployeeListTable from "components/organisms/EmployeeListTable";
import EmployeeFormModal from "components/organisms/EmployeeFormModal";
import EmployeeRfidModal from "components/organisms/EmployeeRfidModal";

const EmployeeManagement = () => {
    const {
        employees, outlets, total, page, setPage, loading, search, setSearch,
        modal, setModal, editMode, formLoading, form, setForm,
        rfidModal, setRfidModal, selectedUserForRfid, rfidLoading, manualRfid, setManualRfid,
        scannedRFID, mqttConnected,
        fetchEmployees, toggleModal, handleEdit, handleDelete, handleSubmit,
        handleAttachRFID, openRfidModal, handleOutletToggle, totalPages, PAGE_LIMIT
    } = useEmployeeManagement();

    return (
        <>
            <div className="header bg-gradient-info pb-6 pt-5 pt-md-6 px-4 shadow-lg">
                <Container fluid>
                    <div className="header-body">
                        <Row className="align-items-center py-4">
                            <Col lg="6" xs="12">
                                <h1 className="display-2 text-white font-weight-bold">Manajemen Tim</h1>
                                <p className="text-white opacity-8 h4 mt-2">
                                    Atur tim outlet, peran akses, dan otentikasi RFID untuk keamanan sistem.
                                </p>
                            </Col>
                            <Col lg="6" xs="12" className="text-right d-none d-lg-block">
                                <i className="fas fa-user-shield fa-4x text-white opacity-2" />
                            </Col>
                        </Row>
                    </div>
                </Container>
            </div>

            <Container className="mt--7 pb-5" fluid>
                <Row>
                    <Col>
                        <Card className="shadow-premium border-0 glass-card">
                            <EmployeeHeader 
                                onAdd={toggleModal}
                                search={search}
                                setSearch={setSearch}
                                onSearch={() => fetchEmployees(1)}
                            />

                            <EmployeeListTable 
                                employees={employees}
                                loading={loading}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                onRfid={openRfidModal}
                                page={page}
                                totalPages={totalPages}
                                setPage={setPage}
                                limit={PAGE_LIMIT}
                                total={total}
                            />
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Modals */}
            <EmployeeFormModal 
                isOpen={modal}
                toggle={toggleModal}
                editMode={editMode}
                form={form}
                setForm={setForm}
                outlets={outlets}
                loading={formLoading}
                onSubmit={handleSubmit}
                handleOutletToggle={handleOutletToggle}
            />

            <EmployeeRfidModal 
                isOpen={rfidModal}
                toggle={() => setRfidModal(false)}
                employee={selectedUserForRfid}
                scannedRFID={scannedRFID}
                manualRfid={manualRfid}
                setManualRfid={setManualRfid}
                mqttConnected={mqttConnected}
                loading={rfidLoading}
                onAttach={handleAttachRFID}
            />

            <style>{`
                .display-2 { font-size: 2.8rem; }
                .bg-gradient-info { 
                    background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important; 
                }
                @media (max-width: 768px) {
                    .display-2 { font-size: 2rem; }
                }
            `}</style>
        </>
    );
};

export default EmployeeManagement;
