import React from "react";

const IoTStatusDot = ({ isOnline }) => (
  <div 
    className={`status-dot me-3 ${isOnline ? 'bg-success' : 'bg-gray-400'}`} 
    style={{ width: "10px", height: "10px", borderRadius: "50%", display: "inline-block" }}
    title={isOnline ? "Online" : "Offline"}
  />
);

export default IoTStatusDot;
