import React from 'react';
import { FormGroup, Input, InputGroup, InputGroupText } from 'reactstrap';

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
          <>
            <InputGroupText>
              <i className={icon} />
            </InputGroupText>
          </>
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
          <InputGroupText
            style={{ cursor: onAppendClick ? 'pointer' : 'default' }} 
            onClick={onAppendClick}
          >
            <i className={appendIcon} />
          </InputGroupText>
        )}
      </InputGroup>
    </FormGroup>
  );
};

export default AuthInput;
