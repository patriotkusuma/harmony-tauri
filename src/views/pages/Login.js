import axios from "../../services/axios-instance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useMQTTRFID } from "../../hooks/useMQTTRFID";
import { Card, CardBody, Row, Col } from "reactstrap";

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
            <Card className="bg-secondary shadow-premium border-0 overflow-hidden" style={{ borderRadius: '20px' }}>
                <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center mb-4">
                        <h2 className="font-weight-bold text-primary">Harmony Laundry</h2>
                        <p className="text-muted small">Terminal Kasir & Manajemen Outlet</p>
                    </div>

                    {/* RFID Section (Molecule) */}
                    <RFIDLoginBanner isConnected={mqttConnected} />

                    <div className="text-center text-muted mb-4 position-relative">
                        <hr className="my-4" />
                        <small className="bg-secondary px-2 position-absolute" style={{ top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                            Kredensial Login
                        </small>
                    </div>

                    {/* Login Form (Organism) */}
                    <LoginForm onSubmit={handleManualLogin} loading={isLoading} />
                </CardBody>
            </Card>
            
            <Row className="mt-4">
                <Col xs="12" className="text-center">
                    <a className="text-light opacity-8 hover-opacity-10" href="#forgot" onClick={(e) => e.preventDefault()}>
                        <small>Lupa Kata Sandi?</small>
                    </a>
                </Col>
            </Row>
        </Col>
    );
};

export default Login;
