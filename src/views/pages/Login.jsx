import axios from "../../services/axios-instance";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMQTTRFID } from "../../hooks/useMQTTRFID";
import { Card, CardHeader, CardBody, Row, Col } from "reactstrap";

// Atomic Design Components
import RFIDLoginBanner from "../../components/molecules/auth/RFIDLoginBanner";
import LoginForm from "../../components/organisms/auth/LoginForm";

const Login = () => {
    const [authenticated, setAuthenticated] = useState(localStorage.getItem("token") || false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    };

    useEffect(() => {
        if (authenticated) {
            navigate('/admin/dashboard');
        }
    }, [authenticated, navigate]);

    // MQTT RFID Login
    const { connected: mqttConnected } = useMQTTRFID({
        enabled: true,
        onUID: async (uid) => {
            const loadingToast = toast.loading(`Mendapatkan akses RFID: ${uid}...`);
            try {
                const res = await axios.post("api/auth/login/rfid", { rfid_code: uid }, { headers });
                
                // Save Auth Data
                localStorage.setItem("token", res.data.token);
                if (res.data.selected_outlet) {
                    localStorage.setItem("selected-outlet", JSON.stringify(res.data.selected_outlet));
                } else if (res.data.user?.id_outlet) {
                    localStorage.setItem("selected-outlet", JSON.stringify({ id: res.data.user.id_outlet }));
                }

                if (res.data.user) {
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                }

                toast.update(loadingToast, {
                    render: `Selamat datang, ${res.data.user?.nama || "User"}!`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 2000
                });
                
                setAuthenticated(res.data.token);
            } catch (error) {
                toast.update(loadingToast, {
                    render: error.response?.data?.message || "Login RFID Gagal. Kartu tidak terdaftar.",
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000
                });
            }
        }
    });

    // Manual Login Handler
    const handleManualLogin = async (credentials) => {
        setIsLoading(true);
        try {
            const response = await axios.post('login', credentials, { headers });
            
            localStorage.setItem("token", response.data.token);
            if (response.data.selected_outlet) {
                localStorage.setItem("selected-outlet", JSON.stringify(response.data.selected_outlet));
            }
            if (response.data.user) {
                localStorage.setItem("user", JSON.stringify(response.data.user));
            }

            toast.success("Login berhasil! Mengalihkan...");
            setAuthenticated(response.data.token);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Login Gagal. Periksa kredensial Anda.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Col lg="5" md="7">
            <Card className="bg-secondary shadow border-0 overflow-hidden" style={{ borderRadius: '15px' }}>
                <CardHeader className="bg-transparent pb-5">
                    <div className="text-muted text-center mt-2 mb-3">
                        <small className="text-uppercase font-weight-bold" style={{ letterSpacing: '1px' }}>Harmony Laundry</small>
                    </div>
                    <div className="btn-wrapper text-center">
                        <div className="text-center mb-3">
                             <h2 className="text-primary font-weight-700">Manajemen Outlet</h2>
                             <p className="text-muted small">Masuk untuk mengelola operasional laundry Anda</p>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-lg-5 py-lg-5 pt-0">
                    {/* RFID Section (Molecule) */}
                    <div className="text-center text-muted mb-4">
                        <small>Gunakan Kartu RFID</small>
                    </div>
                    <RFIDLoginBanner isConnected={mqttConnected} />

                    <div className="text-center text-muted my-4">
                        <small>Atau Gunakan Kredensial</small>
                    </div>
                    {/* Login Form (Organism) */}
                    <LoginForm onSubmit={handleManualLogin} loading={isLoading} />
                </CardBody>
            </Card>
            
            <Row className="mt-3">
                <Col xs="6">
                    <a className="text-light" href="#forgot" onClick={(e) => e.preventDefault()}>
                        <small>Bantuan Akses?</small>
                    </a>
                </Col>
                <Col xs="6" className="text-end">
                    <Link className="text-light" to="/auth/help">
                        <small>Butuh Bantuan?</small>
                    </Link>
                </Col>
            </Row>

            <style>{`
                .font-weight-700 { font-weight: 700 !important; }
                .text-end { text-align: right !important; }
            `}</style>
        </Col>
    );
};

export default Login;
