import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import illustration from '../assets/Illustrasi Login.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const RegisterPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f5f7fa; 
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
`;

const RegisterContainer = styled.div`
  display: flex;
  background-color: #ffffff;
  border-radius: 12px; 
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1); 
  overflow: hidden;
  width: 950px; 
  max-width: 95%;
  height: auto;
`;

const RegisterFormSection = styled.div`
  flex: 1;
  padding: 50px; 
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const RegisterFormContent = styled.div`
  width: 100%;
  max-width: 380px; 
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30px; 
`;

const Logo = styled.img`
  width: 45px; 
  height: 45px;
  margin-right: 15px;
`;

const LogoText = styled.span`
  font-size: 28px; 
  font-weight: 700;
  color: #e53935;
`;

const Title = styled.h2`
  font-size: 26px; 
  margin-bottom: 35px;
  color: #333;
  text-align: center;
  line-height: 1.3;
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 25px; 
  border: 1px solid #e0e0e0; 
  border-radius: 8px; 
  padding: 12px 15px; 
  background-color: #fcfcfc;

  i {
    margin-right: 12px;
    color: #9e9e9e; 
    font-size: 18px;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  color: #333;
  background-color: transparent;
`;

const RegisterButton = styled.button`
  width: 100%;
  padding: 15px; 
  background: linear-gradient(45deg, #ef5350, #e53935); 
  color: #fff;
  border: none;
  border-radius: 25px; 
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(229, 57, 53, 0.3);

  &:hover {
    background: linear-gradient(45deg, #e53935, #d32f2f);
    box-shadow: 0 6px 15px rgba(229, 57, 53, 0.4);
    transform: translateY(-2px);
  }
`;

const LoginLink = styled.p`
  text-align: center;
  margin-top: 30px; 
  font-size: 15px;
  color: #616161;

  a {
    color: #e53935;
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;

    &:hover {
      color: #d32f2f;
    }
  }
`;

const RegisterIllustrationSection = styled.div`
  flex: 1;
  background-color: #fce4ec;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px; 
`;

const Illustration = styled.img`
  max-width: 100%;
  height: auto;
  display: block; 
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
`;

const SuccessMessage = styled.p`
  color: #2e7d32; 
  background-color: #e8f5e9; 
  border: 1px solid #a5d6a7;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 20px;
  text-align: center;
  font-size: 14px;
`;

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
        <RegisterPageContainer>
            <RegisterContainer>
                <RegisterFormSection>
                    <RegisterFormContent>
                        <LogoSection>
                            <Logo src={logo} alt="SIMS PPOB Logo" />
                            <LogoText>SIMS PPOB</LogoText>
                        </LogoSection>
                        <Title>Lengkapi data untuk membuat akun</Title>
                        <form onSubmit={handleSubmit}>
                            {error && <ErrorMessage>{error}</ErrorMessage>}
                            {success && <SuccessMessage>{success}</SuccessMessage>}
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
                                <i className="fas fa-user"></i>
                                <Input
                                    type="text"
                                    placeholder="nama depan"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <i className="fas fa-user"></i>
                                <Input
                                    type="text"
                                    placeholder="nama belakang"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <i className="fas fa-lock"></i>
                                <Input
                                    type="password"
                                    placeholder="buat password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <InputGroup>
                                <i className="fas fa-lock"></i>
                                <Input
                                    type="password"
                                    placeholder="konfirmasi password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </InputGroup>
                            <RegisterButton type="submit">Registrasi</RegisterButton>
                        </form>
                        <LoginLink>
                            sudah punya akun? <a href="/login">login di sini</a>
                        </LoginLink>
                    </RegisterFormContent>
                </RegisterFormSection>
                <RegisterIllustrationSection>
                    <Illustration src={illustration} alt="Register Illustration" />
                </RegisterIllustrationSection>
            </RegisterContainer>
        </RegisterPageContainer>
    );
}

export default RegisterPage;
