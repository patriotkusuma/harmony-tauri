import React from 'react';
import { Input, FormGroup } from 'reactstrap';

const NotifSwitch = ({ id, name, label, description, checked, onChange, className }) => {
  return (
    <div className={`custom-switch-notification-wrapper ${className || ''}`} onClick={() => onChange({ target: { name, type: 'checkbox', checked: !checked } })}>
      <Input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="custom-switch-notif-input"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="notif-label-group">
        <span className="notif-label-text">{label}</span>
        {description && (
          <span className="notif-desc-text">
            {description}
          </span>
        )}
      </div>
    </div>
  );
};

export default NotifSwitch;
