import React, { useState } from 'react';
import { Form, FormGroup } from 'reactstrap';
import AuthInput from '../../atoms/auth/AuthInput';
import AuthButton from '../../atoms/auth/AuthButton';

const LoginForm = ({ onSubmit, loading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Form role="form" onSubmit={handleSubmit}>
      <AuthInput
        placeholder="Email"
        type="email"
        icon="ni ni-email-83"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      
      <AuthInput
        placeholder="Password"
        type={showPassword ? 'text' : 'password'}
        icon="ni ni-lock-circle-open"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        appendIcon={showPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'}
        onAppendClick={() => setShowPassword(!showPassword)}
      />

      <div className="custom-control custom-control-alternative custom-checkbox">
        <input
          className="custom-control-input"
          id="customCheckLogin"
          type="checkbox"
        />
        <label
          className="custom-control-label"
          htmlFor="customCheckLogin"
        >
          <span className="text-muted">Ingat saya</span>
        </label>
      </div>

      <div className="text-center">
        <AuthButton 
          type="submit" 
          block 
          className="w-100 rounded-pill shadow-premium"
          loading={loading}
        >
          Masuk ke Sistem
        </AuthButton>
      </div>
    </Form>
  );
};

export default LoginForm;
