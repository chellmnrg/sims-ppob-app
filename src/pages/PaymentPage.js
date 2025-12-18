import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './PaymentPage.css';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';
import backgroundSaldo from '../assets/Background Saldo.png';

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
    }, [navigate, serviceCode]);

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
        <div className="payment-page">
            <header className="payment-header">
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

            <main className="payment-main">
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
                    <div className="balance-section" style={{ backgroundImage: `url(${backgroundSaldo})` }}>
                        <p className="balance-label">Saldo anda</p>
                        <h2 className="balance-amount">Rp {balance !== null ? balance.toLocaleString('id-ID') : '...'}</h2>
                    </div>
                </section>

                <section className="payment-form-section">
                    <p className="form-label">Pembayaran</p>
                    <div className="service-info">
                        <img src={getServiceIcon()} alt={service?.service_name} className="service-icon" />
                        <h2 className="service-name">{service?.service_name || 'Loading...'}</h2>
                    </div>

                    {error && <p className="error-message">{error}</p>}

                    <div className="input-wrapper">
                        <span className="input-icon">💳</span>
                        <input
                            type="text"
                            value={service ? `Rp${service.service_tariff.toLocaleString('id-ID')}` : ''}
                            disabled
                            className="payment-input"
                        />
                    </div>

                    <button
                        className="payment-submit-btn"
                        onClick={handlePayment}
                        disabled={!service}
                    >
                        Bayar
                    </button>
                </section>
            </main>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {modalType === 'confirm' && (
                            <>
                                <img src={getServiceIcon()} alt="" className="modal-service-icon" />
                                <p>Beli {service?.service_name} senilai</p>
                                <h3>Rp{service?.service_tariff.toLocaleString('id-ID')} ?</h3>
                                <button className="modal-confirm-btn" onClick={confirmPayment} disabled={loading}>
                                    {loading ? 'Processing...' : 'Ya, lanjutkan Bayar'}
                                </button>
                                <button className="modal-cancel-btn" onClick={closeModal}>Batalkan</button>
                            </>
                        )}
                        {modalType === 'success' && (
                            <>
                                <div className="modal-icon success">✓</div>
                                <p>Pembayaran {service?.service_name} sebesar</p>
                                <h3>Rp{service?.service_tariff.toLocaleString('id-ID')}</h3>
                                <p className="success-text">berhasil!</p>
                                <button className="modal-back-btn" onClick={closeModal}>Kembali ke Beranda</button>
                            </>
                        )}
                        {modalType === 'error' && (
                            <>
                                <div className="modal-icon error">✗</div>
                                <p>Pembayaran {service?.service_name} sebesar</p>
                                <h3>Rp{service?.service_tariff.toLocaleString('id-ID')}</h3>
                                <p className="error-text">gagal</p>
                                <button className="modal-back-btn" onClick={closeModal}>Kembali ke Beranda</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PaymentPage;

