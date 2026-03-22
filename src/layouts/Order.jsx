import React, { useEffect, useRef } from 'react';
import AuthNavbar from 'components/Navbars/AuthNavbar';

const Order = ({ children }) => {
  const mainContent = useRef();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, []);

  return (
    <div className="order-content bg-gradient-info" ref={mainContent} style={{ minHeight: '100vh', marginLeft: 0 }}>
      <AuthNavbar />
      {/* Spacer for absolute-positioned navbar — reduced height so content is close to navbar */}
      <div style={{ height: '120px' }} />
      <div className="px-4 pb-5" style={{ marginTop: '-24px' }}>
        {children}
      </div>
    </div>
  );
};

export default Order;