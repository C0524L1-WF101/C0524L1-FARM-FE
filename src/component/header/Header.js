import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const [buttonColor, setButtonColor] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Lấy userId và username từ localStorage
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    // Kiểm tra đăng nhập
    setIsLoggedIn(!!username);

    // Nếu đã đăng nhập, fetch thông tin người dùng để lấy avatar
    if (userId) {
      fetch(`http://localhost:3000/users/${userId}`)
        .then((response) => response.json())
        .then((data) => setAvatar(data.avatar))
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, [userId, username]);

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
      setIsLoggedIn(false);
    }, 300);
  };

  const handleLogoutCancel = () => {
    setButtonColor('red');
    setTimeout(() => {
      setIsLogoutModalOpen(false);
    }, 300);
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="header d-flex justify-content-between align-items-center p-3 shadow">
      <div className="header__logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src="https://images.vexels.com/content/227456/preview/cute-pig-flat-b98ea3.png" alt="Logo" width="50" />
      </div>

      <div>
        {isLoggedIn ? (
          <div className="header__user-avatar" onClick={handleAvatarClick} style={{ cursor: 'pointer' }}>
            <img
              src={avatar || "https://www.svgrepo.com/show/343494/profile-user-account.svg"}
              alt="User Avatar"
              width="40"
              height="40"
              className="rounded-circle"
            />
            {isMenuOpen && (
              <div className="header__dropdown-menu shadow">
                <div className="header__dropdown-item" onClick={handlePersonalInfo}>
                  Thông tin cá nhân
                </div>
                <div className="header__dropdown-item logout text-danger" onClick={handleLogoutClick}>
                  Đăng xuất
                </div>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary" onClick={handleLoginClick}>
            Đăng nhập
          </button>
        )}
      </div>

      {isLogoutModalOpen && (
        <div className="logout-modal">
          <div className="logout-modal__content">
            <p>Bạn có muốn đăng xuất?</p>
            <button
              onClick={handleLogoutConfirm}
              className={`modal-btn confirm ${buttonColor === 'green' ? 'btn-success' : ''}`}
            >
              Muốn
            </button>
            <button
              onClick={handleLogoutCancel}
              className={`modal-btn cancel ${buttonColor === 'red' ? 'btn-danger' : ''}`}
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
