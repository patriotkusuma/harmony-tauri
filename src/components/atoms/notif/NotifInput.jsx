import React from 'react';
import { FormGroup, Label, Input } from 'reactstrap';

const NotifInput = ({ label, type = 'text', name, value, onChange, placeholder, helpText, rows, step }) => {
  return (
    <FormGroup>
      {label && <Label className="label-notification">{label}</Label>}
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-notification"
        rows={rows}
        step={step}
      />
      {helpText && <small className="text-muted">{helpText}</small>}
    </FormGroup>
  );
};

export default NotifInput;
