import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

const AccountPageContainer = styled.div`
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

        &:hover,
        &.active {
            color: #f13b2e;
        }
    }
`;

const Main = styled.main`
    flex: 1;
    padding: 30px 120px;
    display: flex;
    justify-content: center;

    @media (max-width: 1200px) {
        padding-left: 60px;
        padding-right: 60px;
    }

    @media (max-width: 768px) {
        padding-left: 20px;
        padding-right: 20px;
    }
`;

const ProfileCard = styled.div`
    background-color: transparent;
    max-width: 500px;
    width: 100%;
    text-align: center;
`;

const ProfilePhotoContainer = styled.div`
    position: relative;
    display: inline-block;
    margin-bottom: 15px;
`;

const ProfilePhotoLarge = styled.img`
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #ddd;
`;

const EditPhotoBtn = styled.label`
    position: absolute;
    bottom: 5px;
    right: 5px;
    width: 32px;
    height: 32px;
    background-color: #fff;
    border: 2px solid #ddd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 14px;
    transition: border-color 0.2s ease;

    &:hover {
        border-color: #f13b2e;
    }
`;

const ProfileName = styled.h2`
    margin: 10px 0 30px;
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
`;

const ErrorMessage = styled.p`
    color: #f13b2e;
    margin-bottom: 15px;
    font-size: 14px;
`;

const SuccessMessage = styled.p`
    color: #4caf50;
    margin-bottom: 15px;
    font-size: 14px;
`;

const FormGroup = styled.div`
    margin-bottom: 20px;
    text-align: left;

    label {
        display: block;
        margin-bottom: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #1a1a1a;
    }
`;

const InputWrapper = styled.div`
    position: relative;
`;

const InputIcon = styled.span`
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;
    color: #999;
`;

const FormInput = styled.input`
    width: 100%;
    padding: 15px 15px 15px 45px;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    background-color: #fff;
    transition: border-color 0.2s ease;
    box-sizing: border-box;

    &:focus:not(:disabled) {
        border-color: #f13b2e;
    }

    &:disabled {
        background-color: #f9f9f9;
        color: #666;
    }
`;

const EditBtn = styled.button`
    width: 100%;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    background-color: transparent;
    color: #f13b2e;
    border: 1px solid #f13b2e;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 15px;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f13b2e;
        color: #fff;
    }
`;

const LogoutBtn = styled.button`
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

    &:hover {
        background-color: #d32f2f;
    }
`;

const SaveBtn = styled.button`
    width: 100%;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    background-color: #f13b2e;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    margin-bottom: 15px;
    transition: background-color 0.2s ease;

    &:hover:not(:disabled) {
        background-color: #d32f2f;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`;

const CancelBtn = styled.button`
    width: 100%;
    padding: 15px;
    font-size: 16px;
    font-weight: 600;
    background-color: transparent;
    color: #999;
    border: 1px solid #ddd;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
        border-color: #999;
        color: #666;
    }
`;

function AccountPage() {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('userToken');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/profile`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok) {
                    setProfile(data.data);
                    setFirstName(data.data.first_name);
                    setLastName(data.data.last_name);
                    setEmail(data.data.email);
                }
            } catch (err) {
                console.error('Error fetching profile:', err);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleEdit = () => {
        setIsEditing(true);
        setError('');
        setSuccess('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFirstName(profile?.first_name || '');
        setLastName(profile?.last_name || '');
        setError('');
        setSuccess('');
    };

    const handleSave = async () => {
        if (!firstName.trim() || !lastName.trim()) {
            setError('Nama depan dan belakang harus diisi');
            return;
        }

        setLoading(true);
        setError('');
        const token = localStorage.getItem('userToken');

        try {
            const response = await fetch(`${API_BASE_URL}/profile/update`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.data);
                setIsEditing(false);
                setSuccess('Profile berhasil diperbarui');
            } else {
                setError(data.message || 'Gagal memperbarui profile');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 100 * 1024) {
            setError('Ukuran file maksimal 100KB');
            return;
        }

        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setError('Format file harus JPEG atau PNG');
            return;
        }

        setLoading(true);
        setError('');
        const token = localStorage.getItem('userToken');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/profile/image`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setProfile(data.data);
                setSuccess('Foto profile berhasil diperbarui');
            } else {
                setError(data.message || 'Gagal upload foto');
            }
        } catch (err) {
            setError('Network error');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        navigate('/login');
    };

    return (
        <AccountPageContainer>
            <Header>
                <HeaderLeft href="/dashboard">
                    <Logo src={logo} alt="SIMS PPOB Logo" />
                    <span>SIMS PPOB</span>
                </HeaderLeft>
                <Nav>
                    <a href="/topup">Top Up</a>
                    <a href="/transaction">Transaction</a>
                    <a href="/account" className="active">Akun</a>
                </Nav>
            </Header>

            <Main>
                <ProfileCard>
                    <ProfilePhotoContainer>
                        <ProfilePhotoLarge
                            src={profile?.profile_image && !profile.profile_image.includes('null') ? profile.profile_image : profilePhoto}
                            alt="Profile"
                        />
                        <EditPhotoBtn>
                            ✏️
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </EditPhotoBtn>
                    </ProfilePhotoContainer>
                    <ProfileName>{profile ? `${profile.first_name} ${profile.last_name}` : 'User'}</ProfileName>

                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    {success && <SuccessMessage>{success}</SuccessMessage>}

                    <FormGroup>
                        <label>Email</label>
                        <InputWrapper>
                            <InputIcon>@</InputIcon>
                            <FormInput
                                type="email"
                                value={email}
                                disabled
                            />
                        </InputWrapper>
                    </FormGroup>

                    <FormGroup>
                        <label>Nama Depan</label>
                        <InputWrapper>
                            <InputIcon>👤</InputIcon>
                            <FormInput
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={!isEditing}
                            />
                        </InputWrapper>
                    </FormGroup>

                    <FormGroup>
                        <label>Nama Belakang</label>
                        <InputWrapper>
                            <InputIcon>👤</InputIcon>
                            <FormInput
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={!isEditing}
                            />
                        </InputWrapper>
                    </FormGroup>

                    {!isEditing ? (
                        <>
                            <EditBtn onClick={handleEdit}>Edit Profile</EditBtn>
                            <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>
                        </>
                    ) : (
                        <>
                            <SaveBtn onClick={handleSave} disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </SaveBtn>
                            <CancelBtn onClick={handleCancel}>Batalkan</CancelBtn>
                        </>
                    )}
                </ProfileCard>
            </Main>
        </AccountPageContainer>
    );
}

export default AccountPage;
