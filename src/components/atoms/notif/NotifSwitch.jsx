import React from 'react';
import { Input, FormGroup } from 'reactstrap';

const NotifSwitch = ({ id, name, label, description, checked, onChange, className }) => {
  return (
    <FormGroup>
      <Input
        type="switch"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className={`custom-switch-notification ${className || ''}`}
        label={
          <div className="d-flex flex-column justify-content-center w-100 h-100 ms-1">
            <span className="font-weight-bold" style={{ color: 'inherit', fontSize: '0.9rem' }}>{label}</span>
            {description && (
              <span className="text-muted opacity-8" style={{ fontSize: '0.75rem', marginTop: '2px', lineHeight: '1.3' }}>
                {description}
              </span>
            )}
          </div>
        }
      />
    </FormGroup>
  );
};

export default NotifSwitch;
