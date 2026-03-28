import React, { useState } from 'react';
import { Container, Row, Col, Card, CardHeader, CardBody, Input, Button, Badge, Spinner, UncontrolledTooltip } from 'reactstrap';
import { useSystemSettings } from '../../hooks/useSystemSettings';

const SystemSettings = () => {
  const { settings, loading, saving, updateSetting, resetSetting } = useSystemSettings();
  const [showApiKey, setShowApiKey] = useState(false);
  const [editValues, setEditValues] = useState({});

  const handleLocalChange = (key, val) => {
    setEditValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (key) => {
    const val = editValues[key] !== undefined ? editValues[key] : settings[key];
    await updateSetting(key, val);
    // Clear temp storage after save
    const newEdits = { ...editValues };
    delete newEdits[key];
    setEditValues(newEdits);
  };

  const getVal = (key) => editValues[key] !== undefined ? editValues[key] : (settings[key] || '');

  return (
    <div className="system-settings-page">
      <div className="header bg-gradient-premium pb-8 pt-5 pt-md-8 px-4 position-relative">
        <Container fluid>
          <div className="header-body">
             <Row className="align-items-center py-4">
                <Col>
                  <h1 className="text-white font-weight-bold mb-0">Pengaturan Sistem</h1>
                  <p className="text-white-50 lead mb-0">Kelola konfigurasi inti, kunci API, dan parameter cerdas Gemini AI.</p>
                </Col>
             </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7 mb-5" fluid>
        <Row>
          {/* Gemini AI CONFIGURATION */}
          <Col xl="12" className="mb-4">
            <Card className="shadow-premium border-0 glass-panel overflow-hidden">
              <CardHeader className="bg-transparent border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                   <div className="icon-box bg-primary text-white me-3 rounded-circle shadow-sm">
                      <i className="fas fa-brain" />
                   </div>
                   <h3 className="mb-0 text-dark font-weight-bold">Konfigurasi Gemini AI</h3>
                </div>
                <Badge color="info" pill className="px-3 py-1 uppercase ls-1">Smart Engine</Badge>
              </CardHeader>
              <CardBody className="px-4 py-5">
                <Row>
                  <Col md="6">
                    <div className="setting-card-item p-4 rounded-xl border-light-subtle mb-4 h-100">
                      <h6 className="text-uppercase text-muted ls-1 mb-2">Gemini API Key</h6>
                      <div className="d-flex gap-2">
                        <Input 
                          type={showApiKey ? "text" : "password"} 
                          className="premium-input flex-grow-1" 
                          value={getVal('GEMINI_API_KEY')}
                          onChange={(e) => handleLocalChange('GEMINI_API_KEY', e.target.value)}
                        />
                        <Button 
                          color="neutral" 
                          className="p-1 px-3 shadow-sm border" 
                          onClick={() => setShowApiKey(!showApiKey)}
                        >
                          <i className={`fas fa-${showApiKey ? 'eye-slash' : 'eye'}`} />
                        </Button>
                      </div>
                      <div className="mt-3 d-flex justify-content-end gap-2">
                         <Button color="secondary" size="sm" onClick={() => resetSetting('GEMINI_API_KEY')}>Reset</Button>
                         <Button 
                            color="primary" 
                            size="sm" 
                            disabled={saving === 'GEMINI_API_KEY'}
                            onClick={() => handleSave('GEMINI_API_KEY')}
                         >
                            {saving === 'GEMINI_API_KEY' ? <Spinner size="sm" /> : 'Simpan Kunci'}
                         </Button>
                      </div>
                    </div>
                  </Col>
                  <Col md="6">
                    <div className="setting-card-item p-4 rounded-xl border-light-subtle mb-4 h-100">
                      <h6 className="text-uppercase text-muted ls-1 mb-2">Pilih Model Gemini</h6>
                      <Input 
                        type="select" 
                        className="premium-input-select"
                        value={getVal('GEMINI_MODEL')}
                        onChange={(e) => handleLocalChange('GEMINI_MODEL', e.target.value)}
                      >
                         <optgroup label="Gemini 3 Series (Next Gen)">
                            <option value="gemini-3.1-pro">Gemini 3.1 Pro (Advanced reasoning & coding)</option>
                            <option value="gemini-3-flash">Gemini 3 Flash (High performance)</option>
                            <option value="gemini-3.1-flash-lite">Gemini 3.1 Flash-Lite (Super fast & cheap)</option>
                         </optgroup>
                         <optgroup label="Gemini 2.5 Series (Stable/Preview)">
                            <option value="gemini-2.5-pro">Gemini 2.5 Pro (Deep reasoning)</option>
                            <option value="gemini-2.5-flash">Gemini 2.5 Flash (Balanced price-performance)</option>
                            <option value="gemini-2.5-flash-lite">Gemini 2.5 Flash-Lite (Fast multimodal)</option>
                         </optgroup>
                      </Input>
                      <p className="small text-muted mt-2 ps-1 italic">
                        <i className="fas fa-info-circle me-1" />
                        Gunakan model Flash untuk performa tinggi dan biaya rendah.
                      </p>
                      <div className="mt-3 d-flex justify-content-end">
                         <Button 
                            color="primary" 
                            size="sm" 
                            disabled={saving === 'GEMINI_MODEL' || getVal('GEMINI_MODEL') === settings['GEMINI_MODEL']}
                            onClick={() => handleSave('GEMINI_MODEL')}
                         >
                            {saving === 'GEMINI_MODEL' ? <Spinner size="sm" /> : 'Ganti Model'}
                         </Button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>

          {/* SYSTEM BEHAVIOR CONFIG */}
          <Col xl="12">
            <Card className="shadow-premium border-0 glass-panel overflow-hidden">
               <CardHeader className="bg-transparent border-0 pt-4 pb-0">
                  <div className="d-flex align-items-center">
                     <div className="icon-box bg-success text-white me-3 rounded-circle shadow-sm">
                        <i className="fas fa-cogs" />
                     </div>
                     <h3 className="mb-0 text-dark font-weight-bold">Perilaku Sistem</h3>
                  </div>
               </CardHeader>
               <CardBody className="px-4 py-5">
                  <div className="table-responsive rounded-xl overflow-hidden border">
                     <table className="table align-middle mb-0">
                        <thead className="bg-light">
                           <tr>
                              <th className="font-weight-bold ls-1 uppercase text-xs p-4">Konfigurasi</th>
                              <th className="font-weight-bold ls-1 uppercase text-xs p-4">Nilai Aktif</th>
                              <th className="font-weight-bold ls-1 uppercase text-xs p-4 text-center">Status</th>
                              <th className="font-weight-bold ls-1 uppercase text-xs p-4 text-end">Aksi</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td className="p-4">
                                 <div className="font-weight-bold text-dark mb-0">Auto Close Accounting</div>
                                 <small className="text-muted d-block">Tutup periode akuntansi otomatis tepat waktu</small>
                              </td>
                              <td className="p-4">
                                 <Badge color={settings.AUTO_CLOSE_ACCOUNTING_PERIOD === 'true' ? 'success' : 'secondary'} pill>
                                    {settings.AUTO_CLOSE_ACCOUNTING_PERIOD === 'true' ? 'Aktif' : 'Non-aktif'}
                                 </Badge>
                              </td>
                              <td className="p-4 text-center">
                                 <div className="custom-control custom-switch">
                                    <Input 
                                       type="switch" 
                                       id="autoCloseSwitch"
                                       checked={settings.AUTO_CLOSE_ACCOUNTING_PERIOD === 'true'}
                                       onChange={(e) => updateSetting('AUTO_CLOSE_ACCOUNTING_PERIOD', e.target.checked ? 'true' : 'false')}
                                    />
                                 </div>
                              </td>
                              <td className="p-4 text-end">
                                 <Button color="link" className="text-danger p-0 text-sm" onClick={() => resetSetting('AUTO_CLOSE_ACCOUNTING_PERIOD')}>
                                    <i className="fas fa-undo me-1" /> Reset Default
                                 </Button>
                              </td>
                           </tr>
                        </tbody>
                     </table>
                  </div>
               </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .bg-gradient-premium {
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%) !important;
          border-bottom: 4px solid #1e40af;
        }
        .icon-box { width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; }
        .glass-panel { background: rgba(255,255,255,0.92); backdrop-filter: blur(10px); }
        .rounded-xl { border-radius: 16px; }
        .shadow-premium { box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important; }
        .premium-input { border: 2px solid #e2e8f0; border-radius: 12px; height: 50px; font-weight: 600; font-size: 1rem; transition: all 0.2s; }
        .premium-input:focus { border-color: #3b82f6; box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1); }
        .premium-input-select { border: 2px solid #e2e8f0; border-radius: 12px; height: 48px; cursor: pointer; font-weight: 500;}
        .setting-card-item { background: #fff; box-shadow: 0 4px 6px rgba(0,0,0,0.02); transition: transform 0.2s; }
        .setting-card-item:hover { transform: translateY(-2px); }
        .custom-switch .custom-control-label::before { height: 1.5rem; width: 2.75rem; border-radius: 1rem; }
        .custom-switch .custom-control-label::after { width: calc(1.5rem - 4px); height: calc(1.5rem - 4px); border-radius: 50%; }
        .italic { font-style: italic; }
      `}</style>
    </div>
  );
};

export default SystemSettings;
