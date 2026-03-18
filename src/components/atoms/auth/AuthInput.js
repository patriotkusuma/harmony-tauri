import React from 'react';
import { FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

const AuthInput = ({ 
  placeholder, 
  type = 'text', 
  icon, 
  value, 
  onChange, 
  autoComplete,
  appendIcon,
  onAppendClick,
  name
}) => {
  return (
    <FormGroup className="mb-3">
      <InputGroup className="input-group-alternative">
        {icon && (
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className={icon} />
            </InputGroupText>
          </InputGroupAddon>
        )}
        <Input
          placeholder={placeholder}
          type={type}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          name={name}
        />
        {appendIcon && (
          <InputGroupAddon 
            addonType="append" 
            style={{ cursor: onAppendClick ? 'pointer' : 'default' }} 
            onClick={onAppendClick}
          >
            <InputGroupText>
              <i className={appendIcon} />
            </InputGroupText>
          </InputGroupAddon>
        )}
      </InputGroup>
    </FormGroup>
  );
};

export default AuthInput;
