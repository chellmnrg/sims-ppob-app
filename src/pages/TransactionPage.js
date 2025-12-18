import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TransactionPage.css';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';
import backgroundSaldo from '../assets/Background Saldo.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

function TransactionPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [balance, setBalance] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
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
    }, [navigate]);

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
                    <div className="balance-section" style={{ backgroundImage: `url(${backgroundSaldo})` }}>
                        <p className="balance-label">Saldo anda</p>
                        <h2 className="balance-amount">Rp {balance !== null ? balance.toLocaleString('id-ID') : '...'}</h2>
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

