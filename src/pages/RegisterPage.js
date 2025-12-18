import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import logo from '../assets/Logo.png';
import illustration from '../assets/Illustrasi Login.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: lastName,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Registration successful! Please log in.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error or server is unreachable.');
      console.error('Registration API error:', err);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-form-section">
          <div className="register-form-content">
            <div className="logo-section">
              <img src={logo} alt="SIMS PPOB Logo" className="logo" />
              <span>SIMS PPOB</span>
            </div>
            <h2>Lengkapi data untuk membuat akun</h2>
            <form onSubmit={handleSubmit}>
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
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
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="nama depan"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input
                  type="text"
                  placeholder="nama belakang"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="buat password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  placeholder="konfirmasi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="register-button">Registrasi</button>
            </form>
            <p className="login-link">
              sudah punya akun? <a href="/login">login di sini</a>
            </p>
          </div>
        </div>
        <div className="register-illustration-section">
          <img src={illustration} alt="Register Illustration" className="illustration" />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
