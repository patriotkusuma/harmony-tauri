import React from 'react';
import { CustomInput, FormGroup } from 'reactstrap';

const NotifSwitch = ({ id, name, label, checked, onChange, className }) => {
  return (
    <FormGroup>
      <CustomInput
        type="switch"
        id={id}
        name={name}
        label={label}
        checked={checked}
        onChange={onChange}
        className={`custom-switch-notification ${className || ''}`}
      />
    </FormGroup>
  );
};

export default NotifSwitch;
