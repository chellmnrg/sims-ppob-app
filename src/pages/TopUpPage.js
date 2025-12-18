import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TopUpPage.css';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';


const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

function TopUpPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [balance, setBalance] = useState(null);
    const [amount, setAmount] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('confirm');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showBalance, setShowBalance] = useState(false);

    const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

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
            } catch (err) {
                console.error('Error fetching data:', err);
            }
        };

        fetchData();
        fetchData();
    }, [navigate]);

    const toggleBalance = () => {
        setShowBalance(!showBalance);
    };

    const handleAmountChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        setAmount(value);
    };

    const handleQuickAmount = (value) => {
        setAmount(value.toString());
    };

    const handleTopUp = () => {
        if (!amount || parseInt(amount) < 10000) {
            setError('Minimum top up Rp10.000');
            return;
        }
        if (parseInt(amount) > 1000000) {
            setError('Maximum top up Rp1.000.000');
            return;
        }
        setError('');
        setModalType('confirm');
        setShowModal(true);
    };

    const confirmTopUp = async () => {
        setLoading(true);
        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch(`${API_BASE_URL}/topup`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ top_up_amount: parseInt(amount) }),
            });

            const data = await response.json();

            if (response.ok) {
                setBalance(data.data.balance);
                setModalType('success');
            } else {
                setError(data.message || 'Top up failed');
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

    return (
        <div className="topup-page">
            <header className="topup-header">
                <a href="/dashboard" className="header-left">
                    <img src={logo} alt="SIMS PPOB Logo" className="header-logo" />
                    <span>SIMS PPOB</span>
                </a>
                <nav className="header-nav">
                    <a href="/topup" className="active">Top Up</a>
                    <a href="/transaction">Transaction</a>
                    <a href="/account">Akun</a>
                </nav>
            </header>

            <main className="topup-main">
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

                <section className="topup-form-section">
                    <p className="form-label">Silahkan masukan</p>
                    <h2 className="form-title">Nominal Top Up</h2>

                    {error && <p className="error-message">{error}</p>}

                    <div className="topup-content">
                        <div className="topup-left">
                            <div className="input-wrapper">
                                <span className="input-icon">💳</span>
                                <input
                                    type="text"
                                    placeholder="masukan nominal Top Up"
                                    value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
                                    onChange={handleAmountChange}
                                    className="topup-input"
                                />
                            </div>

                            <button
                                className={`topup-submit-btn ${!amount ? 'disabled' : ''}`}
                                onClick={handleTopUp}
                                disabled={!amount}
                            >
                                Top Up
                            </button>
                        </div>

                        <div className="topup-right">
                            <div className="quick-amounts">
                                {quickAmounts.map((val) => (
                                    <button
                                        key={val}
                                        className={`quick-amount-btn ${amount === val.toString() ? 'active' : ''}`}
                                        onClick={() => handleQuickAmount(val)}
                                    >
                                        Rp{val.toLocaleString('id-ID')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        {modalType === 'confirm' && (
                            <>
                                <div className="modal-icon-img">
                                    <img src={logo} alt="Logo" />
                                </div>
                                <p className="modal-text">Anda yakin untuk Top Up sebesar</p>
                                <h3 className="modal-amount">Rp{parseInt(amount).toLocaleString('id-ID')} ?</h3>
                                <button className="modal-confirm-btn" onClick={confirmTopUp} disabled={loading}>
                                    {loading ? 'Processing...' : 'Ya, lanjutkan Top Up'}
                                </button>
                                <button className="modal-cancel-btn" onClick={closeModal}>Batalkan</button>
                            </>
                        )}
                        {modalType === 'success' && (
                            <>
                                <div className="modal-icon success">✓</div>
                                <p className="modal-text">Top Up sebesar</p>
                                <h3 className="modal-amount">Rp{parseInt(amount || '0').toLocaleString('id-ID')}</h3>
                                <p className="success-text">berhasil!</p>
                                <button className="modal-back-btn" onClick={closeModal}>Kembali ke Beranda</button>
                            </>
                        )}
                        {modalType === 'error' && (
                            <>
                                <div className="modal-icon error">✗</div>
                                <p className="modal-text">Top Up sebesar</p>
                                <h3 className="modal-amount">Rp{parseInt(amount).toLocaleString('id-ID')}</h3>
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

export default TopUpPage;

