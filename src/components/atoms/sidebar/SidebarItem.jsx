import React from "react";
import { Link, useLocation } from "react-router-dom";

const SidebarItem = ({ to, icon, label, onClick }) => {
  const { pathname } = useLocation();
  const isActive = pathname === to || pathname.startsWith(to + "/");
  return (
    <Link to={to} onClick={onClick} className={`sb-item${isActive ? " active" : ""}`}>
      <span className="sb-item-icon"><i className={icon} /></span>
      <span className="sb-item-label">{label}</span>
    </Link>
  );
};

export default SidebarItem;
