import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const TopUpPageContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #fff;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 120px;
    background-color: #fff;
    border-bottom: 1px solid #eee;

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
    margin-bottom: 40px;

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

const TopUpFormSection = styled.section`
    background-color: transparent;
`;

const FormLabel = styled.p`
    margin: 0;
    font-size: 16px;
    color: #1a1a1a;
`;

const FormTitle = styled.h2`
    margin: 5px 0 25px;
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
`;

const ErrorMessage = styled.p`
    color: #f13b2e;
    margin-bottom: 15px;
    font-size: 14px;
`;

const TopUpContent = styled.div`
    display: flex;
    gap: 30px;

    @media (max-width: 900px) {
        flex-direction: column;
    }
`;

const TopUpLeft = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const TopUpRight = styled.div`
    flex: 1;
`;

const InputWrapper = styled.div`
    position: relative;
`;

const InputIcon = styled.span`
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
`;

const TopUpInput = styled.input`
    width: 100%;
    padding: 15px 15px 15px 50px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s ease;
    box-sizing: border-box;

    &:focus {
        border-color: #f13b2e;
    }

    &::placeholder {
        color: #aaa;
    }
`;

const TopUpSubmitBtn = styled.button`
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

const QuickAmounts = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @media (max-width: 900px) {
        grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
    }
`;

const QuickAmountBtn = styled.button`
    padding: 18px 12px;
    font-size: 14px;
    font-weight: 500;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #f13b2e;
        color: #f13b2e;
    }

    ${props => props.$active && `
        background-color: #f13b2e;
        color: #fff;
        border-color: #f13b2e;
    `}
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
    padding: 40px 50px;
    border-radius: 8px;
    text-align: center;
    max-width: 350px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalIconImg = styled.div`
    margin-bottom: 20px;
    img {
        width: 60px;
        height: 60px;
    }
`;

const ModalIcon = styled.div`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 28px;

    &.success {
        color: #4caf50;
        border: 3px solid #4caf50;
    }

    &.error {
        color: #f13b2e;
        border: 3px solid #f13b2e;
    }
`;

const ModalText = styled.p`
    margin: 0 0 5px;
    font-size: 16px;
    color: #1a1a1a;
`;

const ModalAmount = styled.h3`
    margin: 0 0 20px;
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
`;

const SuccessText = styled.p`
    color: #4caf50;
    font-weight: 600;
    font-size: 18px;
    margin: 0 0 20px;
`;

const ErrorText = styled.p`
    color: #f13b2e;
    font-weight: 600;
    font-size: 18px;
    margin: 0 0 20px;
`;

const ModalConfirmBtn = styled.button`
    width: 100%;
    padding: 12px;
    font-size: 16px;
    font-weight: 600;
    background-color: transparent;
    color: #f13b2e;
    border: none;
    cursor: pointer;
    margin-bottom: 5px;

    &:hover {
        text-decoration: underline;
    }
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

    &:hover {
        color: #666;
    }
`;

const ModalBackBtn = styled.button`
    width: 100%;
    padding: 12px;
    font-size: 14px;
    font-weight: 500;
    background-color: transparent;
    color: #f13b2e;
    border: none;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;


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
        <TopUpPageContainer>
            <Header>
                <HeaderLeft href="/dashboard">
                    <Logo src={logo} alt="SIMS PPOB Logo" />
                    <span>SIMS PPOB</span>
                </HeaderLeft>
                <Nav>
                    <a href="/topup" className="active">Top Up</a>
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

                <TopUpFormSection>
                    <FormLabel>Silahkan masukan</FormLabel>
                    <FormTitle>Nominal Top Up</FormTitle>

                    {error && <ErrorMessage>{error}</ErrorMessage>}

                    <TopUpContent>
                        <TopUpLeft>
                            <InputWrapper>
                                <InputIcon>💳</InputIcon>
                                <TopUpInput
                                    type="text"
                                    placeholder="masukan nominal Top Up"
                                    value={amount ? parseInt(amount).toLocaleString('id-ID') : ''}
                                    onChange={handleAmountChange}
                                />
                            </InputWrapper>

                            <TopUpSubmitBtn
                                onClick={handleTopUp}
                                disabled={!amount}
                            >
                                Top Up
                            </TopUpSubmitBtn>
                        </TopUpLeft>

                        <TopUpRight>
                            <QuickAmounts>
                                {quickAmounts.map((val) => (
                                    <QuickAmountBtn
                                        key={val}
                                        $active={amount === val.toString()}
                                        onClick={() => handleQuickAmount(val)}
                                    >
                                        Rp{val.toLocaleString('id-ID')}
                                    </QuickAmountBtn>
                                ))}
                            </QuickAmounts>
                        </TopUpRight>
                    </TopUpContent>
                </TopUpFormSection>
            </Main>

            {showModal && (
                <ModalOverlay onClick={closeModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        {modalType === 'confirm' && (
                            <>
                                <ModalIconImg>
                                    <img src={logo} alt="Logo" />
                                </ModalIconImg>
                                <ModalText>Anda yakin untuk Top Up sebesar</ModalText>
                                <ModalAmount>Rp{parseInt(amount).toLocaleString('id-ID')} ?</ModalAmount>
                                <ModalConfirmBtn onClick={confirmTopUp} disabled={loading}>
                                    {loading ? 'Processing...' : 'Ya, lanjutkan Top Up'}
                                </ModalConfirmBtn>
                                <ModalCancelBtn onClick={closeModal}>Batalkan</ModalCancelBtn>
                            </>
                        )}
                        {modalType === 'success' && (
                            <>
                                <ModalIcon className="success">✓</ModalIcon>
                                <ModalText>Top Up sebesar</ModalText>
                                <ModalAmount>Rp{parseInt(amount || '0').toLocaleString('id-ID')}</ModalAmount>
                                <SuccessText>berhasil!</SuccessText>
                                <ModalBackBtn onClick={closeModal}>Kembali ke Beranda</ModalBackBtn>
                            </>
                        )}
                        {modalType === 'error' && (
                            <>
                                <ModalIcon className="error">✗</ModalIcon>
                                <ModalText>Top Up sebesar</ModalText>
                                <ModalAmount>Rp{parseInt(amount).toLocaleString('id-ID')}</ModalAmount>
                                <ErrorText>gagal</ErrorText>
                                <ModalBackBtn onClick={closeModal}>Kembali ke Beranda</ModalBackBtn>
                            </>
                        )}
                    </ModalContent>
                </ModalOverlay>
            )}
        </TopUpPageContainer>
    );
}

export default TopUpPage;
