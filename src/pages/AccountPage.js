import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AccountPage.css';
import logo from '../assets/Logo.png';
import profilePhoto from '../assets/Profile Photo.png';

const API_BASE_URL = 'https://take-home-test-api.nutech-integrasi.com';

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
        <div className="account-page">
            <header className="account-header">
                <a href="/dashboard" className="header-left">
                    <img src={logo} alt="SIMS PPOB Logo" className="header-logo" />
                    <span>SIMS PPOB</span>
                </a>
                <nav className="header-nav">
                    <a href="/topup">Top Up</a>
                    <a href="/transaction">Transaction</a>
                    <a href="/account" className="active">Akun</a>
                </nav>
            </header>

            <main className="account-main">
                <div className="profile-card">
                    <div className="profile-photo-container">
                        <img
                            src={profile?.profile_image && !profile.profile_image.includes('null') ? profile.profile_image : profilePhoto}
                            alt="Profile"
                            className="profile-photo-large"
                        />
                        <label className="edit-photo-btn">
                            ✏️
                            <input
                                type="file"
                                accept="image/jpeg,image/png"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                        </label>
                    </div>
                    <h2 className="profile-name">{profile ? `${profile.first_name} ${profile.last_name}` : 'User'}</h2>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <div className="form-group">
                        <label>Email</label>
                        <div className="input-wrapper">
                            <span className="input-icon">@</span>
                            <input
                                type="email"
                                value={email}
                                disabled
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nama Depan</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={!isEditing}
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Nama Belakang</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={!isEditing}
                                className="form-input"
                            />
                        </div>
                    </div>

                    {!isEditing ? (
                        <>
                            <button className="edit-btn" onClick={handleEdit}>Edit Profile</button>
                            <button className="logout-btn" onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <button className="save-btn" onClick={handleSave} disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button className="cancel-btn" onClick={handleCancel}>Batalkan</button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}

export default AccountPage;

