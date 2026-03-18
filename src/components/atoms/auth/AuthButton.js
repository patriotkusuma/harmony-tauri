import React from 'react';
import { Button } from 'reactstrap';

const AuthButton = ({ children, color = 'primary', type = 'button', onClick, className, disabled, loading }) => {
  return (
    <Button 
      className={`my-4 ${className}`} 
      color={color} 
      type={type} 
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? 'Processing...' : children}
    </Button>
  );
};

export default AuthButton;
