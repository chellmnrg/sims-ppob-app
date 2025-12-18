import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TransactionPage.css';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';


const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

function TransactionPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [showBalance, setShowBalance] = useState(false);
    const limit = 5;

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

                await fetchTransactions(0);
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

    const fetchTransactions = async (currentOffset) => {
        setLoading(true);
        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch(
                `${API_BASE_URL}/transaction/history?offset=${currentOffset}&limit=${limit}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );
            const data = await response.json();

            if (response.ok) {
                const newTransactions = data.data.records || [];
                if (currentOffset === 0) {
                    setTransactions(newTransactions);
                } else {
                    setTransactions(prev => [...prev, ...newTransactions]);
                }
                setHasMore(newTransactions.length === limit);
            }
        } catch (err) {
            console.error('Error fetching transactions:', err);
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        const newOffset = offset + limit;
        setOffset(newOffset);
        fetchTransactions(newOffset);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day} ${month} ${year} ${hours}:${minutes} WIB`;
    };

    return (
        <div className="transaction-page">
            <header className="transaction-header">
                <a href="/dashboard" className="header-left">
                    <img src={logo} alt="SIMS PPOB Logo" className="header-logo" />
                    <span>SIMS PPOB</span>
                </a>
                <nav className="header-nav">
                    <a href="/topup">Top Up</a>
                    <a href="/transaction" className="active">Transaction</a>
                    <a href="/account">Akun</a>
                </nav>
            </header>

            <main className="transaction-main">
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

                <section className="transaction-list-section">
                    <h3 className="section-title">Semua Transaksi</h3>

                    {transactions.length === 0 && !loading ? (
                        <p className="no-transactions">Belum ada transaksi</p>
                    ) : (
                        <div className="transaction-list">
                            {transactions.map((tx, index) => (
                                <div key={index} className="transaction-item">
                                    <div className="transaction-left">
                                        <span className={`transaction-amount ${tx.transaction_type === 'TOPUP' ? 'positive' : 'negative'}`}>
                                            {tx.transaction_type === 'TOPUP' ? '+' : '-'} Rp.{Math.abs(tx.total_amount).toLocaleString('id-ID')}
                                        </span>
                                        <span className="transaction-date">{formatDate(tx.created_on)}</span>
                                    </div>
                                    <div className="transaction-right">
                                        <span className="transaction-desc">{tx.description}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {hasMore && transactions.length > 0 && (
                        <button className="show-more-btn" onClick={loadMore} disabled={loading}>
                            {loading ? 'Loading...' : 'Show more'}
                        </button>
                    )}
                </section>
            </main>
        </div>
    );
}

export default TransactionPage;

