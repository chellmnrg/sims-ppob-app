import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

import banner1 from '../assets/Banner 1.png';
import banner2 from '../assets/Banner 2.png';
import banner3 from '../assets/Banner 3.png';
import banner4 from '../assets/Banner 4.png';
import banner5 from '../assets/Banner 5.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const DashboardPageContainer = styled.div`
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
    cursor: pointer;
    
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

const ErrorMessage = styled.p`
    color: #f13b2e;
    margin-bottom: 15px;
    text-align: center;
    padding: 10px;
    background-color: #fee;
    border-radius: 4px;
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
    background-color: transparent;

    @media (max-width: 768px) {
        flex: 1;
    }
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
    background-repeat: no-repeat;
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
    margin: 8px 0 15px;
    font-size: 32px;
    font-weight: 700;
    letter-spacing: 1px;
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

const ServicesSection = styled.section`
    background-color: transparent;
    margin-bottom: 30px;
`;

const ServicesGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 15px;
    text-align: center;

    @media (max-width: 1200px) {
        grid-template-columns: repeat(6, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(4, 1fr);
    }
`;

const ServiceItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
        transform: translateY(-3px);
    }

    img {
        width: 52px;
        height: 52px;
        margin-bottom: 8px;
    }

    p {
        font-size: 11px;
        color: #1a1a1a;
        margin: 0;
        line-height: 1.3;
        text-align: center;
    }
`;

const BannersSection = styled.section`
    background-color: transparent;
    margin-bottom: 30px;

    h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #1a1a1a;
        font-size: 16px;
        font-weight: 600;
    }
`;

const BannersCarousel = styled.div`
    display: flex;
    overflow-x: auto;
    gap: 20px;
    padding-bottom: 10px;
    scrollbar-width: thin;
    scrollbar-color: #ccc transparent;

    &::-webkit-scrollbar {
        height: 6px;
    }

    &::-webkit-scrollbar-thumb {
        background-color: #ccc;
        border-radius: 3px;
    }
`;

const BannerImage = styled.img`
    flex-shrink: 0;
    width: 280px;
    height: 140px;
    border-radius: 12px;
    object-fit: cover;
    transition: transform 0.2s ease;

    &:hover {
        transform: scale(1.02);
    }
`;

function DashboardPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [balance, setBalance] = useState(null);
    const [services, setServices] = useState([]);
    const [banners, setBanners] = useState([]);
    const [error, setError] = useState('');
    const [showBalance, setShowBalance] = useState(false);

    const serviceIcons = {
        'Pajak PBB': pbbIcon,
        'Listrik': listrikIcon,
        'Pulsa': pulsaIcon,
        'PDAM Berlangganan': pdamIcon,
        'PGN Berlangganan': pgnIcon,
        'TV Berlangganan': televisiIcon,
        'Musik Berlangganan': musikIcon,
        'Voucher Game': gameIcon,
        'Voucher Makanan': voucherMakananIcon,
        'Qurban': kurbanIcon,
        'Zakat': zakatIcon,
        'Paket Data': paketDataIcon,
    };

    const bannerImages = [banner1, banner2, banner3, banner4, banner5];

    useEffect(() => {
        const fetchDashboardData = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const profileResponse = await fetch(`${API_BASE_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const profileData = await profileResponse.json();
                if (profileResponse.ok) {
                    setProfile(profileData.data);
                } else {
                    setError(profileData.message || 'Failed to fetch profile');
                }

                const balanceResponse = await fetch(`${API_BASE_URL}/balance`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const balanceData = await balanceResponse.json();
                if (balanceResponse.ok) {
                    setBalance(balanceData.data.balance);
                } else {
                    setError(balanceData.message || 'Failed to fetch balance');
                }

                const servicesResponse = await fetch(`${API_BASE_URL}/services`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const servicesData = await servicesResponse.json();
                if (servicesResponse.ok) {
                    console.log('Services API Response:', servicesData);
                    setServices(servicesData.data);
                } else {
                    setError(servicesData.message || 'Failed to fetch services');
                }

                const bannersResponse = await fetch(`${API_BASE_URL}/banner`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const bannersData = await bannersResponse.json();
                if (bannersResponse.ok) {
                    setBanners(bannersData.data);
                } else {
                    setError(bannersData.message || 'Failed to fetch banners');
                }

            } catch (err) {
                setError('Network error or failed to load dashboard data.');
                console.error('Dashboard API error:', err);
            }
        };

        fetchDashboardData();
    }, [navigate]);

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };

    return (
        <DashboardPageContainer>
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
                {error && <ErrorMessage>{error}</ErrorMessage>}

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

                <ServicesSection>
                    <ServicesGrid>
                        {services.map((service) => (
                            <ServiceItem
                                key={service.service_code}
                                onClick={() => navigate(`/payment/${service.service_code}`)}
                            >
                                <img src={serviceIcons[service.service_name] || logo} alt={service.service_name} />
                                <p>{service.service_name}</p>
                            </ServiceItem>
                        ))}
                    </ServicesGrid>
                </ServicesSection>

                <BannersSection>
                    <h3>Temukan promo menarik</h3>
                    <BannersCarousel>
                        {banners.map((banner, index) => (
                            <BannerImage key={banner.banner_name} src={bannerImages[index % bannerImages.length]} alt={banner.banner_name} />
                        ))}
                    </BannersCarousel>
                </BannersSection>
            </Main>
        </DashboardPageContainer>
    );
}

export default DashboardPage;
