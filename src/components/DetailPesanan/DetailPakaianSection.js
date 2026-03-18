import React from 'react';
import { Card, CardBody, CardHeader, Col, Button, Row, Table, Input } from 'reactstrap';

const DetailPakaianSection = ({
  pesanan,
  printPakaian,
  setIsModalOpen,
  updatePakaian,
  editModal,
  deletePakaian,
}) => {
  return (
    <Card className="bg-secondary shadow">
      <CardHeader>
        <Row className="align-items-center">
          <Col xs="6">
            <h3 className="mb-0">Detail Pakaian</h3>
          </Col>
          <Col className="text-right" xs="6"> {/* Adjusted column size */}
            <Button
              color="primary"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="mr-2" // Added margin
            >
              <i className="fas fa-plus mr-1"></i> {/* Added icon */}
              Tambah
            </Button>
            <Button
              color="default"
              size="sm"
              onClick={() => printPakaian(pesanan)}
            >
              <i className="fas fa-print mr-1"></i> {/* Added icon */}
              Print
            </Button>
          </Col>
        </Row>
      </CardHeader>
      <CardBody>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th>No</th>
              <th>Nama</th>
              <th>Jumlah</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {pesanan && pesanan.detail_pakaian.length > 0 ? (
              pesanan.detail_pakaian.map((detailPakaian, index) => (
                <tr key={detailPakaian.id}> {/* Added key */}
                  <td>{index + 1}</td>
                  <td>{detailPakaian.nama_pakaian}</td>
                  <td>
                    <Input
                      name="jumlah"
                      id="jumlah"
                      type="number" // Added type number
                      min="1" // Added min value
                      onChange={(e) =>
                        updatePakaian(detailPakaian, e.target.value)
                      }
                      defaultValue={detailPakaian.jumlah}
                      className="form-control-alternative" // Added Argon style
                    />
                  </td>
                  <td>
                    <Button
                      color="success"
                      size="sm"
                      onClick={() => editModal(detailPakaian)} // Corrected handler
                      className="mr-2" // Added margin
                    >
                      Edit
                    </Button>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => deletePakaian(detailPakaian)} // Corrected handler
                    >
                      Hapus
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4"> {/* Adjusted colspan and added padding */}
                  Belum ada detail pakaian ditambahkan.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default DetailPakaianSection;