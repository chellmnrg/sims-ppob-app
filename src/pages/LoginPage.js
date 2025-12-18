import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import logo from '../assets/Logo.png';
import illustration from '../assets/Illustrasi Login.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('userToken', data.data.token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error or server is unreachable.');
      console.error('Login API error:', err);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-form-content">
            <div className="logo-section">
              <img src={logo} alt="SIMS PPOB Logo" className="logo" />
              <span>SIMS PPOB</span>
            </div>
            <h2>Masuk atau buat akun untuk memulai</h2>
            <form onSubmit={handleSubmit}>
              {error && <p className="error-message">{error}</p>}
              <div className="input-group">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  placeholder="masukan email anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="masukan password anda"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="login-button">Masuk</button>
            </form>
            <p className="register-link">
              belum punya akun? <a href="/register">registrasi di sini</a>
            </p>
          </div>
        </div>
        <div className="login-illustration-section">
          <img src={illustration} alt="Login Illustration" className="illustration" />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
