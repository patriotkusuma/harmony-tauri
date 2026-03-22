import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button
} from "reactstrap";
import classnames from "classnames";

import AffiliateListTab from "../../components/organisms/affiliates/AffiliateListTab";
import AffiliateFeesTab from "../../components/organisms/affiliates/AffiliateFeesTab";
import AffiliateCommissionsTab from "../../components/organisms/affiliates/AffiliateCommissionsTab";

const AffiliateManagement = () => {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <>
      {/* Premium Header */}
      <div className="header bg-gradient-premium pb-8 pt-5 pt-md-7">
        <Container fluid>
          <div className="header-body">
            <Row className="align-items-center mt--6 mb-4">
              <Col lg="8" md="10">
                <h2 className="text-white font-weight-900 mb-1" style={{ letterSpacing: '-0.02em', fontSize: '2rem' }}>
                  Afiliasi & Partner
                </h2>
                <p className="text-white opacity-8 lead mb-0" style={{ fontSize: '1rem', fontWeight: 500 }}>
                  Kelola kemitraan dengan pengurus kos dan maksimalkan eksposur layanan.
                </p>
              </Col>
            </Row>
          </div>
        </Container>
      </div>

      <Container className="mt--7" fluid>
        <Card className="shadow-premium border-0 overflow-hidden" style={{ borderRadius: "15px", backgroundColor: "var(--card-bg, #fff)" }}>
          <div className="border-bottom-custom px-4 py-3 bg-white-10">
            <Nav pills className="nav-pills-custom">
              <NavItem>
                <NavLink
                  className={classnames("font-weight-bold px-4 py-2 cursor-pointer transition-all", { active: activeTab === "1" })}
                  onClick={() => toggle("1")}
                >
                  <i className="fas fa-users me-2" /> Data Partner
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames("font-weight-bold px-4 py-2 cursor-pointer transition-all", { active: activeTab === "2" })}
                  onClick={() => toggle("2")}
                >
                  <i className="fas fa-percent me-2" /> Skema Komisi
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames("font-weight-bold px-4 py-2 cursor-pointer transition-all", { active: activeTab === "3" })}
                  onClick={() => toggle("3")}
                >
                  <i className="fas fa-hand-holding-usd me-2" /> Riwayat & Tagihan Payout
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          <CardBody className="p-0 custom-wrapper">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="1" className="p-4">
                <AffiliateListTab />
              </TabPane>
              <TabPane tabId="2" className="p-4">
                <AffiliateFeesTab />
              </TabPane>
              <TabPane tabId="3" className="p-4">
                <AffiliateCommissionsTab />
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </Container>
      
      <style>{`
        /* Scoped Tab Styles for Dark Mode & Premium UI */
        .bg-gradient-premium {
          background: linear-gradient(87deg, #11cdef 0, #1171ef 100%) !important;
        }
        body.dark-mode .bg-gradient-premium {
          background: linear-gradient(87deg, #1e293b 0, #0f172a 100%) !important;
        }

        .bg-white-10 { background: #f8f9fe; border-bottom: 2px solid #e9ecef; }
        body.dark-mode .bg-white-10 { background: #161625; border-bottom: 2px solid rgba(255,255,255,0.05); }

        .custom-wrapper { background-color: #ffffff; }
        body.dark-mode .custom-wrapper { background-color: #1e293b; color: #f8fafc; }

        /* Pills Customization */
        .nav-pills-custom .nav-link { color: #525f7f; border-radius: 50px; }
        body.dark-mode .nav-pills-custom .nav-link { color: #94a3b8; }
        
        .nav-pills-custom .nav-link:hover:not(.active) { background-color: rgba(94, 114, 228, 0.1); color: #5e72e4; }
        body.dark-mode .nav-pills-custom .nav-link:hover:not(.active) { background-color: rgba(129, 140, 248, 0.1); color: #818cf8; }

        .nav-pills-custom .nav-link.active {
          background-color: #5e72e4;
          box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }
        body.dark-mode .nav-pills-custom .nav-link.active {
          background-color: #6366f1;
        }
      `}</style>
    </>
  );
};

export default AffiliateManagement;
