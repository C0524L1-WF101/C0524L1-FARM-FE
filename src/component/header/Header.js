import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const [buttonColor, setButtonColor] = useState('');

  // Lấy userId từ localStorage
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId) {
      // Fetch thông tin người dùng để lấy avatar
      fetch(`http://localhost:3000/users/${userId}`)
        .then((response) => response.json())
        .then((data) => setAvatar(data.avatar))
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId]);

  const handleLogoClick = () => {
    navigate('/home');
  };

  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handlePersonalInfo = () => {
    if (userId) {
      navigate(`/profile/${userId}`);
    }
    setIsMenuOpen(false);
  };

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleLogoutConfirm = () => {
    setButtonColor('green');
    setTimeout(() => {
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      navigate('/login');
      setIsLogoutModalOpen(false);
    }, 300);
  };

  const handleLogoutCancel = () => {
    setButtonColor('red');
    setTimeout(() => {
      setIsLogoutModalOpen(false);
    }, 300);
  };

  return (
    <header className="header">
      <div className="header__logo" onClick={handleLogoClick}>
        <img src="https://images.vexels.com/content/227456/preview/cute-pig-flat-b98ea3.png" alt="Logo" />
      </div>
      <div className="header__user-avatar" onClick={handleAvatarClick}>
        <img 
          src={avatar || "https://www.svgrepo.com/show/343494/profile-user-account.svg"} 
          alt="User Avatar" 
        />
        {isMenuOpen && (
          <div className="header__dropdown-menu">
            <div className="header__dropdown-item" onClick={handlePersonalInfo}>
              Thông tin cá nhân
            </div>
            <div className="header__dropdown-item logout" onClick={handleLogoutClick}>
              Đăng xuất
            </div>
          </div>
        )}
      </div>

      {isLogoutModalOpen && (
        <div className="logout-modal">
          <div className="logout-modal__content">
            <p>Bạn có muốn đăng xuất?</p>
            <button
              onClick={handleLogoutConfirm}
              className={`modal-btn confirm ${buttonColor === 'green' ? 'green' : ''}`}
            >
              Muốn
            </button>
            <button
              onClick={handleLogoutCancel}
              className={`modal-btn cancel ${buttonColor === 'red' ? 'red' : ''}`}
            >
              Không
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
