import React, { useEffect, useRef } from 'react';
import AuthNavbar from 'components/Navbars/AuthNavbar';

const Order = ({ children }) => {
  const mainContent = useRef();

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, []);

  return (
    <div
      className="order-content bg-gradient-info"
      ref={mainContent}
      style={{ minHeight: '100vh', marginLeft: 0 }}
    >
      <AuthNavbar />

      {/* Spacer for the fixed navbar — responsive height */}
      <div className="order-navbar-spacer" />

      <div className="px-3 px-md-4 pb-5 order-page-body">
        {children}
      </div>

      <style>{`
        /* Navbar spacer — taller on desktop (navbar has 'py-4'), slimmer on mobile */
        .order-navbar-spacer {
          height: 100px;
        }
        @media (max-width: 767.98px) {
          .order-navbar-spacer {
            height: 72px;
          }
          /* Push content above the kasir bottom nav bar on mobile */
          .order-page-body {
            padding-bottom: calc(62px + env(safe-area-inset-bottom, 0px) + 1rem) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Order;