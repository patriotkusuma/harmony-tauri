import { useState } from "react";
import { Container, Row, Col, Form, FormGroup, Input, Button } from "reactstrap";

/* ── helpers ─────────────────────────────────────────────────────── */
function getInitials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function avatarGradient(name = "") {
  const hue = [...name].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 360;
  return `linear-gradient(135deg, hsl(${hue},65%,55%) 0%, hsl(${(hue + 40) % 360},70%,45%) 100%)`;
}

/* ════════════════════════════════════════════════════════════════════ */
const Profile = () => {
  const [userLocal] = useState(localStorage.getItem("user") || null);
  const user = JSON.parse(userLocal) || {};

  const pegawai = user.pegawai || {};
  const initials = getInitials(user.name);

  return (
    <>
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <div
        className="profile-hero"
        style={{
          minHeight: 260,
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          padding: "0 0 0 0",
        }}
      >
        {/* decorative blobs */}
        <div style={{
          position: "absolute", top: -60, right: -60,
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(94,114,228,0.25) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: -40, left: "30%",
          width: 200, height: 200, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(45,206,137,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Hero content */}
        <Container fluid className="pb-5 pt-7 px-4 px-md-6" style={{ position: "relative" }}>
          <div className="d-flex align-items-center" style={{ gap: 20 }}>
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: "50%",
              background: avatarGradient(user.name),
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 28, fontWeight: 700, color: "#fff",
              border: "3px solid rgba(255,255,255,0.25)",
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
            }}>
              {initials}
            </div>
            <div>
              <h1 style={{ color: "#fff", fontSize: 26, fontWeight: 700, margin: 0 }}>
                {user.name}
              </h1>
              <p style={{ color: "rgba(255,255,255,0.55)", margin: "4px 0 0", fontSize: 14 }}>
                {user.email}
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Page content ────────────────────────────────────────── */}
      <Container className="pb-6" fluid style={{ marginTop: -32 }}>
        <Row>
          {/* ── Left: Identity Card ─────────────────────────────── */}
          <Col xl="4" lg="5" className="mb-4">
            <div className="profile-card">
              {/* Avatar large */}
              <div className="text-center mb-3">
                <div style={{
                  width: 100, height: 100, borderRadius: "50%",
                  background: avatarGradient(user.name),
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 38, fontWeight: 700, color: "#fff",
                  boxShadow: "0 12px 32px rgba(94,114,228,0.35)",
                  border: "4px solid rgba(94,114,228,0.3)",
                }}>
                  {initials}
                </div>
              </div>

              {/* Name & role */}
              <div className="text-center mb-4">
                <h2 className="profile-name">{user.name}</h2>
                <div className="d-flex justify-content-center align-items-center" style={{ gap: 8 }}>
                  <span className="profile-badge profile-badge--role">{user.role}</span>
                  <span className="profile-badge profile-badge--status">{user.status}</span>
                </div>
              </div>

              <hr className="profile-divider" />

              {/* Info list */}
              <ul className="profile-info-list">
                {user.email && (
                  <li>
                    <span className="profile-info-icon">
                      <i className="fas fa-envelope" />
                    </span>
                    <span className="profile-info-value">{user.email}</span>
                  </li>
                )}
                {pegawai.no_hp && (
                  <li>
                    <span className="profile-info-icon">
                      <i className="fas fa-phone" />
                    </span>
                    <span className="profile-info-value">{pegawai.no_hp}</span>
                  </li>
                )}
                {pegawai.alamat && (
                  <li>
                    <span className="profile-info-icon">
                      <i className="fas fa-map-marker-alt" />
                    </span>
                    <span className="profile-info-value">{pegawai.alamat}</span>
                  </li>
                )}
                {pegawai.cabang?.name && (
                  <li>
                    <span className="profile-info-icon">
                      <i className="fas fa-store" />
                    </span>
                    <span className="profile-info-value">{pegawai.cabang.name}</span>
                  </li>
                )}
              </ul>
            </div>
          </Col>

          {/* ── Right: Edit Form ────────────────────────────────── */}
          <Col xl="8" lg="7" className="mb-4">
            <div className="profile-card">
              {/* Section: Info Akun */}
              <div className="profile-section-header">
                <i className="fas fa-user-circle mr-2" />
                Informasi Akun
              </div>
              <Form>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <label className="profile-label">Nama Lengkap</label>
                      <Input
                        className="profile-input"
                        defaultValue={user.name || ""}
                        placeholder="Nama Lengkap"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="profile-label">Email</label>
                      <Input
                        className="profile-input"
                        defaultValue={user.email || ""}
                        placeholder="email@example.com"
                        type="email"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="profile-label">Role</label>
                      <Input
                        className="profile-input"
                        defaultValue={user.role || ""}
                        type="text"
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="profile-label">Status</label>
                      <Input
                        className="profile-input"
                        defaultValue={user.status || ""}
                        type="text"
                        disabled
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <hr className="profile-divider" />

                {/* Section: Kontak */}
                <div className="profile-section-header">
                  <i className="fas fa-address-card mr-2" />
                  Kontak & Lokasi
                </div>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <label className="profile-label">No. HP</label>
                      <Input
                        className="profile-input"
                        defaultValue={pegawai.no_hp || ""}
                        placeholder="08xxxxxxxxxx"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="profile-label">Cabang</label>
                      <Input
                        className="profile-input"
                        defaultValue={pegawai.cabang?.name || ""}
                        type="text"
                        disabled
                      />
                    </FormGroup>
                  </Col>
                  <Col md="12">
                    <FormGroup>
                      <label className="profile-label">Alamat</label>
                      <Input
                        className="profile-input"
                        defaultValue={pegawai.alamat || ""}
                        placeholder="Alamat lengkap"
                        type="text"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <hr className="profile-divider" />

                {/* Section: Ganti Password */}
                <div className="profile-section-header">
                  <i className="fas fa-lock mr-2" />
                  Ganti Password
                </div>
                <Row>
                  <Col md="6">
                    <FormGroup>
                      <label className="profile-label">Password Baru</label>
                      <Input
                        className="profile-input"
                        placeholder="••••••••"
                        type="password"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="6">
                    <FormGroup>
                      <label className="profile-label">Konfirmasi Password</label>
                      <Input
                        className="profile-input"
                        placeholder="••••••••"
                        type="password"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                {/* Save button */}
                <div className="d-flex justify-content-end mt-2">
                  <Button
                    style={{
                      background: "linear-gradient(135deg,#5e72e4 0%,#825ee4 100%)",
                      border: "none",
                      borderRadius: 10,
                      padding: "10px 28px",
                      fontWeight: 600,
                      fontSize: 14,
                      boxShadow: "0 4px 15px rgba(94,114,228,0.4)",
                      color: "#fff",
                    }}
                  >
                    <i className="fas fa-save mr-2" />
                    Simpan Perubahan
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>

      {/* ── Scoped Styles ───────────────────────────────────────── */}
      <style>{`
        /* ── Card ── */
        .profile-card {
          background: #fff;
          border-radius: 16px;
          padding: 28px 24px;
          box-shadow: 0 4px 24px rgba(0,0,0,0.07);
          border: 1px solid #f0f0f5;
          transition: background 0.2s, border-color 0.2s;
        }
        .dark-mode .profile-card {
          background: #1e1e2f;
          border-color: #2e2e45;
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        /* ── Name ── */
        .profile-name {
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 10px;
          color: #1a1a2e;
        }
        .dark-mode .profile-name { color: #e0e0f0; }

        /* ── Badges ── */
        .profile-badge {
          display: inline-block;
          padding: 3px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .profile-badge--role {
          background: rgba(94,114,228,0.12);
          color: #5e72e4;
        }
        .dark-mode .profile-badge--role {
          background: rgba(94,114,228,0.2);
          color: #8fa4ff;
        }
        .profile-badge--status {
          background: rgba(45,206,137,0.12);
          color: #1a9e6a;
        }
        .dark-mode .profile-badge--status {
          background: rgba(45,206,137,0.2);
          color: #2dce89;
        }

        /* ── Divider ── */
        .profile-divider {
          border: none;
          border-top: 1px solid #f0f0f5;
          margin: 20px 0;
        }
        .dark-mode .profile-divider { border-top-color: #2e2e45; }

        /* ── Info list ── */
        .profile-info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .profile-info-list li {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .profile-info-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: rgba(94,114,228,0.08);
          color: #5e72e4;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          flex-shrink: 0;
        }
        .dark-mode .profile-info-icon {
          background: rgba(94,114,228,0.18);
          color: #8fa4ff;
        }
        .profile-info-value {
          font-size: 13px;
          color: #4a4a6a;
          line-height: 32px;
          word-break: break-word;
        }
        .dark-mode .profile-info-value { color: #adadd5; }

        /* ── Section header ── */
        .profile-section-header {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: #8898aa;
          margin-bottom: 16px;
        }
        .dark-mode .profile-section-header { color: #6060a0; }

        /* ── Label ── */
        .profile-label {
          font-size: 12px;
          font-weight: 600;
          color: #4a4a6a;
          margin-bottom: 6px;
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .dark-mode .profile-label { color: #adadd5; }

        /* ── Input ── */
        .profile-input {
          border: 1.5px solid #e4e4f0 !important;
          border-radius: 10px !important;
          padding: 10px 14px !important;
          font-size: 13px !important;
          background: #fafafa !important;
          color: #1a1a2e !important;
          transition: border-color 0.15s, box-shadow 0.15s !important;
        }
        .profile-input:focus {
          border-color: #5e72e4 !important;
          box-shadow: 0 0 0 3px rgba(94,114,228,0.12) !important;
          background: #fff !important;
        }
        .profile-input:disabled {
          background: #f0f0f8 !important;
          color: #aaaacc !important;
          cursor: not-allowed !important;
        }
        .dark-mode .profile-input {
          background: #252540 !important;
          border-color: #35355a !important;
          color: #e0e0f0 !important;
        }
        .dark-mode .profile-input:focus {
          border-color: #5e72e4 !important;
          background: #2a2a4a !important;
        }
        .dark-mode .profile-input:disabled {
          background: #1e1e35 !important;
          color: #6060a0 !important;
        }
        .dark-mode .profile-input::placeholder { color: #6060a0; }

        /* ── Hero ── */
        .dark-mode .profile-hero {
          /* already dark by default */
        }
      `}</style>
    </>
  );
};

export default Profile;
