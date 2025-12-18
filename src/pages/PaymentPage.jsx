import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';

import pbbIcon from '../assets/PBB.png';
import listrikIcon from '../assets/Listrik.png';
import pulsaIcon from '../assets/Pulsa.png';
import pdamIcon from '../assets/PDAM.png';
import pgnIcon from '../assets/PGN.png';
import televisiIcon from '../assets/Televisi.png';
import musikIcon from '../assets/Musik.png';
import gameIcon from '../assets/Game.png';
import voucherMakananIcon from '../assets/Voucher Makanan.png';
import kurbanIcon from '../assets/Kurban.png';
import zakatIcon from '../assets/Zakat.png';
import paketDataIcon from '../assets/Paket Data.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const PaymentPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 120px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    @media (max-width: 1200px) {
        padding-left: 60px;
        padding-right: 60px;
    }

    @media (max-width: 768px) {
        padding-left: 20px;
        padding-right: 20px;
    }
`;

const HeaderLeft = styled.a`
    display: flex;
    align-items: center;
    text-decoration: none;
    
    span {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
    }
`;

const Logo = styled.img`
    width: 24px;
    height: 24px;
    margin-right: 8px;
`;

const Nav = styled.nav`
    display: flex;
    gap: 30px;

    a {
        text-decoration: none;
        color: #1a1a1a;
        font-weight: 500;
        font-size: 15px;
        transition: color 0.2s ease;

        &:hover {
            color: #f13b2e;
        }
    }
`;

const Main = styled.main`
    flex: 1;
    padding: 30px 120px;

    @media (max-width: 1200px) {
        padding-left: 60px;
        padding-right: 60px;
    }

    @media (max-width: 768px) {
        padding-left: 20px;
        padding-right: 20px;
    }
`;

const ProfileBalanceSection = styled.section`
    display: flex;
    gap: 30px;
    margin-bottom: 30px;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const ProfileSection = styled.div`
    flex: 0 0 40%;
`;

const ProfilePhoto = styled.img`
    width: 70px;
    height: 70px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
    border: 2px solid #ddd;
`;

const WelcomeText = styled.p`
    margin: 0;
    font-size: 20px;
    color: #1a1a1a;
`;

const UserName = styled.h2`
    margin: 5px 0 0;
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
`;

const BalanceSection = styled.div`
    flex: 1;
    background-color: #f13b2e;
    color: #fff;
    border-radius: 16px;
    padding: 25px 30px;
    background-size: cover;
    background-position: right center;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const BalanceLabelText = styled.p`
    margin: 0;
    font-size: 16px;
    opacity: 0.95;
`;

const BalanceAmount = styled.h2`
    margin: 8px 0 0;
    font-size: 32px;
    font-weight: 700;
`;

const ToggleBalanceBtn = styled.button`
    background: transparent;
    border: none;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    text-align: left;
    padding: 0;
    display: flex;
    align-items: center;
    gap: 5px;
    opacity: 0.9;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 1;
    }
`;

const PaymentFormSection = styled.section`
    background-color: transparent;
`;

const FormLabel = styled.p`
    margin: 0;
    font-size: 16px;
    color: #1a1a1a;
`;

const ServiceInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 10px 0 25px;
`;

const ServiceIcon = styled.img`
    width: 40px;
    height: 40px;
`;

const ServiceName = styled.h2`
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #1a1a1a;
`;

const ErrorMessage = styled.p`
    color: #f13b2e;
    margin-bottom: 15px;
    font-size: 14px;
`;

const InputWrapper = styled.div`
    position: relative;
    margin-bottom: 20px;
`;

const InputIcon = styled.span`
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
`;

const PaymentInput = styled.input`
    width: 100%;
    padding: 15px 15px 15px 50px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    background-color: #f9f9f9;
    box-sizing: border-box;
`;

const PaymentSubmitBtn = styled.button`
    width: 100%;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    background-color: #f13b2e;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
        background-color: #d32f2f;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: #fff;
    padding: 40px;
    border-radius: 16px;
    text-align: center;
    max-width: 400px;
    width: 90%;

    p {
        margin: 5px 0;
        color: #666;
    }

    h3 {
        margin: 10px 0;
        font-size: 24px;
        color: #1a1a1a;
    }
`;

const ModalServiceIcon = styled.img`
    width: 60px;
    height: 60px;
    margin-bottom: 20px;
`;

const ModalIcon = styled.div`
    font-size: 48px;
    margin-bottom: 20px;

    &.success {
        color: #4caf50;
        width: 60px;
        height: 60px;
        border: 3px solid #4caf50;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
    }

    &.error {
        color: #f13b2e;
        width: 60px;
        height: 60px;
        border: 3px solid #f13b2e;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
    }
`;

const SuccessText = styled.p`
    color: #4caf50 !important;
    font-weight: 600;
`;

const ErrorText = styled.p`
    color: #f13b2e !important;
    font-weight: 600;
`;

const ModalConfirmBtn = styled.button`
    width: 100%;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    background-color: transparent;
    color: #f13b2e;
    border: none;
    cursor: pointer;
    margin-top: 15px;
`;

const ModalCancelBtn = styled.button`
    width: 100%;
    padding: 12px;
    font-size: 14px;
    font-weight: 500;
    background-color: transparent;
    color: #999;
    border: none;
    cursor: pointer;
`;

const ModalBackBtn = styled.button`
    width: 100%;
    padding: 12px;
    font-size: 14px;
    font-weight: 600;
    background-color: #f13b2e;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 20px;
`;


function PaymentPage() {
    const navigate = useNavigate();
    const { serviceCode } = useParams();
    const [profile, setProfile] = useState(null);
    const [balance, setBalance] = useState(null);
    const [service, setService] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('confirm');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showBalance, setShowBalance] = useState(false);

    const serviceIcons = {
        'PAJAK': pbbIcon,
        'PLN': listrikIcon,
        'PULSA': pulsaIcon,
        'PDAM': pdamIcon,
        'PGN': pgnIcon,
        'TV': televisiIcon,
        'MUSIK': musikIcon,
        'GAME': gameIcon,
        'VOUCHER_MAKANAN': voucherMakananIcon,
        'QURBAN': kurbanIcon,
        'ZAKAT': zakatIcon,
        'PAKET_DATA': paketDataIcon,
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const profileData = await profileResponse.json();
                if (profileResponse.ok) {
                    setProfile(profileData.data);
                }

                const balanceResponse = await fetch(`${API_BASE_URL}/balance`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const balanceData = await balanceResponse.json();
                if (balanceResponse.ok) {
                    setBalance(balanceData.data.balance);
                }

                const servicesResponse = await fetch(`${API_BASE_URL}/services`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const servicesData = await servicesResponse.json();
                if (servicesResponse.ok) {
                    const foundService = servicesData.data.find(s => s.service_code === serviceCode);
                    if (foundService) {
                        setService(foundService);
                    } else {
                        setError('Service tidak ditemukan');
                    }
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Gagal memuat data');
            }
        };

        fetchData();
        fetchData();
    }, [navigate, serviceCode]);

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };

    const handlePayment = () => {
        if (balance < service?.service_tariff) {
            setError('Saldo tidak mencukupi');
            return;
        }
        setError('');
        setModalType('confirm');
        setShowModal(true);
    };

    const confirmPayment = async () => {
        setLoading(true);
        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch(`${API_BASE_URL}/transaction`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ service_code: serviceCode }),
            });

            const data = await response.json();

            if (response.ok) {
                setBalance(prev => prev - service.service_tariff);
                setModalType('success');
            } else {
                setError(data.message || 'Pembayaran gagal');
                setModalType('error');
            }
        } catch (err) {
            setError('Network error');
            setModalType('error');
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        if (modalType === 'success') {
            navigate('/dashboard');
        }
    };

    const getServiceIcon = () => {
        if (!service) return logo;
        return serviceIcons[service.service_code] || logo;
    };

    return (
        <PaymentPageContainer>
            <Header>
                <HeaderLeft href="/dashboard">
                    <Logo src={logo} alt="SIMS PPOB Logo" />
                    <span>SIMS PPOB</span>
                </HeaderLeft>
                <Nav>
                    <a href="/topup">Top Up</a>
                    <a href="/transaction">Transaction</a>
                    <a href="/account">Akun</a>
                </Nav>
            </Header>

            <Main>
                <ProfileBalanceSection>
                    <ProfileSection>
                        <ProfilePhoto
                            src={profile?.profile_image && !profile.profile_image.includes('null') ? profile.profile_image : profilePhoto}
                            alt="Profile"
                        />
                        <WelcomeText>Selamat datang,</WelcomeText>
                        <UserName>{profile ? `${profile.first_name} ${profile.last_name}` : 'User'}</UserName>
                    </ProfileSection>
                    <BalanceSection>
                        <BalanceLabelText>Saldo anda</BalanceLabelText>
                        <BalanceAmount>
                            Rp {showBalance ? (balance !== null ? balance.toLocaleString('id-ID') : '...') : '•••••••'}
                        </BalanceAmount>
                        <ToggleBalanceBtn onClick={toggleBalance} aria-label={showBalance ? "Sembunyikan Saldo" : "Lihat Saldo"}>
                            <BalanceLabelText>Lihat Saldo</BalanceLabelText>
                            {showBalance ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="white" />
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 7C14.76 7 17 9.24 17 12C17 12.86 16.79 13.66 16.42 14.38L18.66 16.62C19.96 15.35 20.88 13.78 21.26 12C19.58 7.39 15.17 4 10 4C8.42 4 6.91 4.33 5.54 4.9L7.4 6.76C8.2 6.27 9.08 6 10 6L12 7ZM2.53 2.81L1.27 4.08L4.35 7.16C2.77 8.44 1.55 10.1 1 12C2.68 16.61 7.09 20 12.26 20C13.73 20 15.12 19.7 16.41 19.16L19.23 21.98L20.5 20.71L2.53 2.81ZM12 17C9.24 17 7 14.76 7 12C7 11.13 7.23 10.32 7.6 9.61L13.6 15.61C13.11 15.86 12.57 16 12 16V17Z" fill="white" />
                                </svg>
                            )}
                        </ToggleBalanceBtn>
                    </BalanceSection>
                </ProfileBalanceSection>

                <PaymentFormSection>
                    <FormLabel>Pembayaran</FormLabel>
                    <ServiceInfo>
                        <ServiceIcon src={getServiceIcon()} alt={service?.service_name} />
                        <ServiceName>{service?.service_name || 'Loading...'}</ServiceName>
                    </ServiceInfo>

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <InputWrapper>
                        <InputIcon>💳</InputIcon>
                        <PaymentInput
                            type="text"
                            value={service ? `Rp${service.service_tariff.toLocaleString('id-ID')}` : ''}
                            disabled
                        />
                    </InputWrapper>

                    <PaymentSubmitBtn
                        onClick={handlePayment}
                        disabled={!service}
                    >
                        Bayar
                    </PaymentSubmitBtn>
                </PaymentFormSection>
            </Main>

            {showModal && (
                <ModalOverlay onClick={closeModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        {modalType === 'confirm' && (
                            <>
                                <ModalServiceIcon src={getServiceIcon()} alt="" />
                                <p>Beli {service?.service_name} senilai</p>
                                <h3>Rp{service?.service_tariff.toLocaleString('id-ID')} ?</h3>
                                <ModalConfirmBtn onClick={confirmPayment} disabled={loading}>
                                    {loading ? 'Processing...' : 'Ya, lanjutkan Bayar'}
                                </ModalConfirmBtn>
                                <ModalCancelBtn onClick={closeModal}>Batalkan</ModalCancelBtn>
                            </>
                        )}
                        {modalType === 'success' && (
                            <>
                                <ModalIcon className="success">✓</ModalIcon>
                                <p>Pembayaran {service?.service_name} sebesar</p>
                                <h3>Rp{service?.service_tariff.toLocaleString('id-ID')}</h3>
                                <SuccessText>berhasil!</SuccessText>
                                <ModalBackBtn onClick={closeModal}>Kembali ke Beranda</ModalBackBtn>
                            </>
                        )}
                        {modalType === 'error' && (
                            <>
                                <ModalIcon className="error">✗</ModalIcon>
                                <p>Pembayaran {service?.service_name} sebesar</p>
                                <h3>Rp{service?.service_tariff.toLocaleString('id-ID')}</h3>
                                <ErrorText>gagal</ErrorText>
                                <ModalBackBtn onClick={closeModal}>Kembali ke Beranda</ModalBackBtn>
                            </>
                        )}
                    </ModalContent>
                </ModalOverlay>
            )}
        </PaymentPageContainer>
    );
}

export default PaymentPage;
