import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";
import { whatsappInstance } from "../../services/whatsapp-instance";
import { toast } from "react-toastify";

const WhatsAppPayloadSettings = () => {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [pushName, setPushName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const deviceId = "harmony-gebang"; // Hardcoded as per other components

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const response = await whatsappInstance.get("/app/status", {
        headers: { "X-Device-Id": deviceId },
      });
      setDeviceInfo(response.data.results);
      
      // Fetch user info to get current pushname and avatar
      const userRes = await whatsappInstance.get("/user/info", {
          params: { phone: response.data.results.device_id },
          headers: { "X-Device-Id": deviceId },
      });
      setPushName(userRes.data.results.verified_name || "");
    } catch (err) {
      console.error("Error fetching WhatsApp status:", err);
      // Don't toast error if it's just not connected
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleUpdateAvatar = async () => {
    if (!avatar) {
      toast.warning("Pilih file gambar terlebih dahulu.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      await whatsappInstance.post("/user/avatar", formData, {
        headers: {
          "X-Device-Id": deviceId,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Foto profil WhatsApp berhasil diperbarui!");
      setAvatar(null);
      fetchStatus();
    } catch (err) {
      console.error("Error updating avatar:", err);
      toast.error("Gagal memperbarui foto profil.");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdatePushName = async () => {
    if (!pushName.trim()) {
      toast.warning("Nama tidak boleh kosong.");
      return;
    }

    setSavingName(true);
    try {
      await whatsappInstance.post(
        "/user/pushname",
        { push_name: pushName },
        { headers: { "X-Device-Id": deviceId } }
      );
      toast.success("Nama tampilan WhatsApp berhasil diperbarui!");
      fetchStatus();
    } catch (err) {
      console.error("Error updating push name:", err);
      toast.error("Gagal memperbarui nama tampilan.");
    } finally {
      setSavingName(false);
    }
  };

  return (
    <>
      <header className="header bg-gradient-info pb-8 pt-5 pt-md-8" />
      <Container className="mt--7" fluid>
        <Row>
          <Col lg="8" className="mx-auto">
            <Card className="shadow border-0 rounded-lg overflow-hidden">
              <CardHeader className="bg-white border-0 py-4">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-uppercase text-muted ls-1 mb-1">Pengaturan WhatsApp</h6>
                    <h2 className="mb-0">Profile & Payload Settings</h2>
                  </div>
                  <Button color="primary" size="sm" onClick={fetchStatus} disabled={loading}>
                    <i className={`fas fa-sync-alt ${loading ? "fa-spin" : ""}`} />
                  </Button>
                </div>
              </CardHeader>
              <CardBody className="bg-secondary px-lg-5 py-lg-5">
                {loading && !deviceInfo ? (
                  <div className="text-center py-5">
                    <Spinner color="primary" />
                    <p className="mt-3 text-muted">Memeriksa status koneksi...</p>
                  </div>
                ) : deviceInfo ? (
                  <>
                    <Alert color={deviceInfo.is_connected ? "success" : "danger"} className="border-0 shadow-sm mb-4">
                      <div className="d-flex align-items-center">
                        <i className={`fas ${deviceInfo.is_connected ? "fa-check-circle" : "fa-exclamation-triangle"} fa-2x me-3`} />
                        <div>
                          <h5 className="alert-heading mb-1">{deviceInfo.is_connected ? "Terhubung" : "Terputus"}</h5>
                          <small>{deviceInfo.device_id}</small>
                        </div>
                      </div>
                    </Alert>

                    {/* Update Avatar Section */}
                    <div className="mb-5 bg-white p-4 rounded-lg shadow-sm border">
                      <h4 className="mb-4 text-primary">
                        <i className="fas fa-image me-2" /> Update WhatsApp Profile Picture
                      </h4>
                      <Row className="align-items-center">
                        <Col md="12">
                          <FormGroup>
                            <Label className="form-control-label">Pilih Foto Baru</Label>
                            <div className="form-file">
                              <Input
                                type="file"
                                className="form-file-input"
                                id="avatarFile"
                                accept="image/*"
                                onChange={handleAvatarChange}
                              />
                              <Label className="form-file-label" htmlFor="avatarFile">
                                {avatar ? avatar.name : "Pilih gambar..."}
                              </Label>
                            </div>
                            <small className="text-muted mt-2 d-block">
                              Format: JPG/PNG. Foto akan langsung tampil sebagai profil WA Anda.
                            </small>
                          </FormGroup>
                        </Col>
                        <Col md="12" className="mt-3">
                          <Button 
                            color="success" 
                            className="w-100" 
                            onClick={handleUpdateAvatar} 
                            disabled={uploading || !avatar}
                          >
                            {uploading ? <Spinner size="sm" className="me-2" /> : <i className="fas fa-upload me-2" />}
                            Update Foto Profil
                          </Button>
                        </Col>
                      </Row>
                    </div>

                    {/* Update Push Name Section */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border">
                      <h4 className="mb-4 text-primary">
                        <i className="fas fa-user-edit me-2" /> Update Display Name
                      </h4>
                      <FormGroup>
                        <Label className="form-control-label">Nama Tampilan (Pushname)</Label>
                        <Input
                          type="text"
                          className="form-control-alternative"
                          placeholder="Contoh: Harmony Laundry Admin"
                          value={pushName}
                          onChange={(e) => setPushName(e.target.value)}
                        />
                      </FormGroup>
                      <Button 
                        color="info" 
                        className="w-100 mt-2" 
                        onClick={handleUpdatePushName} 
                        disabled={savingName}
                      >
                        {savingName ? <Spinner size="sm" className="me-2" /> : <i className="fas fa-save me-2" />}
                        Simpan Perubahan Nama
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-plug fa-3x text-danger mb-3" />
                    <h3>Layanan WhatsApp Tidak Ditemukan</h3>
                    <p className="text-muted">Pastikan server WhatsApp (MultiDevice) sudah berjalan dengan ID: <b>{deviceId}</b></p>
                    <Button color="primary" className="mt-4" onClick={fetchStatus}>
                      Coba Lagi
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .rounded-lg { border-radius: 1rem !important; }
        .shadow-sm { box-shadow: 0 .125rem .25rem rgba(0,0,0,.075) !important; }
        .ls-1 { letter-spacing: 1px; }
      `}</style>
    </>
  );
};

export default WhatsAppPayloadSettings;
