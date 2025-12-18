import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import illustration from '../assets/Illustrasi Login.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw; 
  background-color: #fff; 
  margin: 0;
  padding: 0;
`;

const LoginContainer = styled.div`
  display: flex;
  background-color: #fff;
  width: 100vw; 
  height: 100vh; 
  max-width: none; 
  overflow: hidden; 
`;

const LoginFormSection = styled.div`
  flex: 1; 
  padding: 40px; 
  display: flex;
  flex-direction: column;
  justify-content: center; 
  align-items: center; 
  box-sizing: border-box; 
`;

const LoginFormContent = styled.div`
  width: 100%; 
  max-width: 400px; 
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center; 
  margin-bottom: 20px;

  span {
    font-size: 24px;
    font-weight: bold;
    color: #e53935; 
  }
`;

const Logo = styled.img`
  width: 40px;
  height: 40px;
  margin-right: 10px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 30px;
  color: #333;
  text-align: center; 
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;

  i {
    margin-right: 10px;
    color: #888;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #e53935; 
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 18px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #c62828; 
  }
`;

const RegisterLink = styled.p`
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #555;

  a {
    color: #e53935;
    text-decoration: none;
    font-weight: bold;
  }
`;

const LoginIllustrationSection = styled.div`
  flex: 1; 
  background-color: #fce4ec; 
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Illustration = styled.img`
  max-width: 100%;
  height: auto;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 15px;
  text-align: center;
`;

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
        <LoginPageContainer>
            <LoginContainer>
                <LoginFormSection>
                    <LoginFormContent>
                        <LogoSection>
                            <Logo src={logo} alt="SIMS PPOB Logo" />
                            <span>SIMS PPOB</span>
                        </LogoSection>
                        <Title>Masuk atau buat akun untuk memulai</Title>
                        <form onSubmit={handleSubmit}>
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            <InputGroup>
                                <i className="fas fa-envelope"></i>
                                <Input
                                    type="email"
                                    placeholder="masukan email anda"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <i className="fas fa-lock"></i>
                                <Input
                                    type="password"
                                    placeholder="masukan password anda"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <LoginButton type="submit">Masuk</LoginButton>
                        </form>
                        <RegisterLink>
                            belum punya akun? <a href="/register">registrasi di sini</a>
                        </RegisterLink>
                    </LoginFormContent>
                </LoginFormSection>
                <LoginIllustrationSection>
                    <Illustration src={illustration} alt="Login Illustration" />
                </LoginIllustrationSection>
            </LoginContainer>
        </LoginPageContainer>
    );
}

export default LoginPage;
