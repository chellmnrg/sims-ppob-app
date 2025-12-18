import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const TransactionPageContainer = styled.div`
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

        &:hover,
        &.active {
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

const TransactionListSection = styled.section`
    background-color: transparent;
`;

const SectionTitle = styled.h3`
    margin: 0 0 20px;
    font-size: 18px;
    font-weight: 600;
    color: #1a1a1a;
`;

const NoTransactions = styled.p`
    text-align: center;
    color: #999;
    padding: 40px;
`;

const TransactionList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const TransactionItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #eee;

    @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
    }
`;

const TransactionLeft = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

const TransactionAmount = styled.span`
    font-size: 20px;
    font-weight: 700;

    &.positive {
        color: #4caf50;
    }

    &.negative {
        color: #f13b2e;
    }
`;

const TransactionDate = styled.span`
    font-size: 12px;
    color: #999;
`;

const TransactionRight = styled.div`
    text-align: right;

    @media (max-width: 768px) {
        text-align: left;
    }
`;

const TransactionDesc = styled.span`
    font-size: 14px;
    color: #1a1a1a;
`;

const ShowMoreBtn = styled.button`
    display: block;
    margin: 30px auto 0;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    background-color: transparent;
    color: #f13b2e;
    border: none;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
        opacity: 0.8;
    }

    &:disabled {
        color: #999;
        cursor: not-allowed;
    }
`;

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
        <TransactionPageContainer>
            <Header>
                <HeaderLeft href="/dashboard">
                    <Logo src={logo} alt="SIMS PPOB Logo" />
                    <span>SIMS PPOB</span>
                </HeaderLeft>
                <Nav>
                    <a href="/topup">Top Up</a>
                    <a href="/transaction" className="active">Transaction</a>
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

                <TransactionListSection>
                    <SectionTitle>Semua Transaksi</SectionTitle>

                    {transactions.length === 0 && !loading ? (
                        <NoTransactions>Belum ada transaksi</NoTransactions>
                    ) : (
                        <TransactionList>
                            {transactions.map((tx, index) => (
                                <TransactionItem key={index}>
                                    <TransactionLeft>
                                        <TransactionAmount className={tx.transaction_type === 'TOPUP' ? 'positive' : 'negative'}>
                                            {tx.transaction_type === 'TOPUP' ? '+' : '-'} Rp.{Math.abs(tx.total_amount).toLocaleString('id-ID')}
                                        </TransactionAmount>
                                        <TransactionDate>{formatDate(tx.created_on)}</TransactionDate>
                                    </TransactionLeft>
                                    <TransactionRight>
                                        <TransactionDesc>{tx.description}</TransactionDesc>
                                    </TransactionRight>
                                </TransactionItem>
                            ))}
                        </TransactionList>
                    )}

                    {hasMore && transactions.length > 0 && (
                        <ShowMoreBtn onClick={loadMore} disabled={loading}>
                            {loading ? 'Loading...' : 'Show more'}
                        </ShowMoreBtn>
                    )}
                </TransactionListSection>
            </Main>
        </TransactionPageContainer>
    );
}

export default TransactionPage;
