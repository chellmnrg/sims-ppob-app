import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';
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
    <div className="dashboard-page">
      <header className="dashboard-header">
        <a href="/dashboard" className="header-left">
          <img src={logo} alt="SIMS PPOB Logo" className="header-logo" />
          <span>SIMS PPOB</span>
        </a>
        <nav className="header-nav">
          <a href="/topup">Top Up</a>
          <a href="/transaction">Transaction</a>
          <a href="/account">Akun</a>
        </nav>
      </header>

      <main className="dashboard-main">
        {error && <p className="error-message">{error}</p>}

        <section className="profile-balance-section">
          <div className="profile-section">
            <img
              src={profile?.profile_image && !profile.profile_image.includes('null') ? profile.profile_image : profilePhoto}
              alt="Profile"
              className="profile-photo"
            />
            <p className="welcome-text">Selamat datang,</p>
            <h2 className="user-name">{profile ? `${profile.first_name} ${profile.last_name}` : 'User'}</h2>
          </div>
          <div className="balance-section">
            <p className="balance-label">Saldo anda</p>
            <h2 className="balance-amount">
              Rp {showBalance ? (balance !== null ? balance.toLocaleString('id-ID') : '...') : '•••••••'}
            </h2>
            <button className="toggle-balance-btn" onClick={toggleBalance} aria-label={showBalance ? "Sembunyikan Saldo" : "Lihat Saldo"}>
              <span className="balance-label">Lihat Saldo</span>
              {showBalance ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="white" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 7C14.76 7 17 9.24 17 12C17 12.86 16.79 13.66 16.42 14.38L18.66 16.62C19.96 15.35 20.88 13.78 21.26 12C19.58 7.39 15.17 4 10 4C8.42 4 6.91 4.33 5.54 4.9L7.4 6.76C8.2 6.27 9.08 6 10 6L12 7ZM2.53 2.81L1.27 4.08L4.35 7.16C2.77 8.44 1.55 10.1 1 12C2.68 16.61 7.09 20 12.26 20C13.73 20 15.12 19.7 16.41 19.16L19.23 21.98L20.5 20.71L2.53 2.81ZM12 17C9.24 17 7 14.76 7 12C7 11.13 7.23 10.32 7.6 9.61L13.6 15.61C13.11 15.86 12.57 16 12 16V17Z" fill="white" />
                </svg>
              )}
            </button>
          </div>
        </section>

        <section className="services-section">
          <div className="services-grid">
            {services.map((service) => (
              <div
                key={service.service_code}
                className="service-item"
                onClick={() => navigate(`/payment/${service.service_code}`)}
              >
                <img src={serviceIcons[service.service_name] || logo} alt={service.service_name} />
                <p>{service.service_name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="banners-section">
          <h3>Temukan promo menarik</h3>
          <div className="banners-carousel">
            {banners.map((banner, index) => (
              <img key={banner.banner_name} src={bannerImages[index % bannerImages.length]} alt={banner.banner_name} className="banner-image" />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardPage;

