import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import ToastNotification from '../../component/ToastNotification';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/users`);
      const users = await response.json();
      
      const user = users.find(
        (user) => user.username === username && user.password === password
      );
      
      if (user) {
        // Lưu thông tin người dùng vào localStorage
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
        localStorage.setItem('role', user.role);
        
        setToastMessage('Đăng nhập thành công!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => navigate('/news'), 1500);
      } else {
        setToastMessage('Tên đăng nhập hoặc mật khẩu không đúng');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Lỗi kết nối tới server');
      setToastType('error');
      setShowToast(true);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleBackToHome = () => {
    navigate('/home')
  };

  const handleShowLoginBox = () => {
    setIsVisible(true);
  };

  return (
    <div className="login">
      {!isVisible && (
        <button onClick={handleShowLoginBox} className="show-login-button">
          Đăng nhập
        </button>
      )}
      {isVisible && (
        <div className="login-box">
          <button onClick={handleClose} className="close-button">
            &times;
          </button>
          <h2 style={{color:'#007bff',marginBottom:'10px'}}>Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="username">Tên đăng nhập:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
            {error && <div className="error">{error}</div>}
            <button type="submit" className="button">
              Đăng nhập
            </button>

            <button type="text" className="button" onClick={handleBackToHome} style={{backgroundColor: "rgb(255,128,0)", marginTop: "6px"}}>
              Quay lại trang chủ
            </button>
            
          </form>
        </div>
      )}

      <ToastNotification
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}

export default Login;
