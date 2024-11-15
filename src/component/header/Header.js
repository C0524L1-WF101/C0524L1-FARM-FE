import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css';
import { Modal, Button, Form } from 'react-bootstrap'; // Import các component của Bootstrap

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [buttonColor, setButtonColor] = useState('');
  const [showContactModal, setShowContactModal] = useState(false); // Modal Liên hệ
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: '',
    message: ''
  });
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy userId và username từ localStorage
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');

  useEffect(() => {
    setIsLoggedIn(!!username);
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

  const navItems = [
    { path: '/home', label: 'Trang chủ' },
    { path: '/contact', label: 'Liên hệ' }
  ];

  const handleShowContactModal = () => setShowContactModal(true);

  const handleCloseContactModal = () => setShowContactModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setShowContactModal(false);
  };

  return (
    <header className="header">
      <div className="header__top p-3 align-items-center">
        <div className="header__logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          <img src="https://images.vexels.com/content/227456/preview/cute-pig-flat-b98ea3.png" alt="Logo" width="50" />
        </div>
        <div className="header__nav ">
          {navItems.map(item => (
            <button
              key={item.path}
              className={`header__nav-button ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => item.path === '/contact' ? handleShowContactModal() : navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div>
          {!isLoggedIn && (
            <button className="btn btn-primary" onClick={handleLoginClick}>Đăng nhập</button>
          )}
        </div>

        {isLoggedIn && (
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
                <div className="header__dropdown-item" onClick={handlePersonalInfo}>Thông tin cá nhân</div>
                <div className="header__dropdown-item logout text-danger" onClick={handleLogoutClick}>Đăng xuất</div>
              </div>
            )}
          </div>
        )}
      </div>

     
      {/* Modal xác nhận đăng xuất */}
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

      <Modal show={showContactModal} onHide={handleCloseContactModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Liên hệ với chúng tôi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập họ và tên"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Địa chỉ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nội dung tin nhắn</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Nhập nội dung tin nhắn"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">Gửi</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </header>
  );
};

export default Header;
