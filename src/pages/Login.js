import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook để điều hướng

  const handleLogin = async (e) => {
    e.preventDefault();

    // Gửi yêu cầu GET đến API để kiểm tra người dùng
    try {
      const response = await fetch(`http://localhost:3000/users`);
      const users = await response.json();
      
      const user = users.find(
        (user) => user.username === username && user.password === password
      );
      
      if (user) {
        alert('Đăng nhập thành công!');
        navigate('/news'); // Điều hướng tới trang tin tức
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (error) {
      setError('Lỗi kết nối tới server');
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleShowLoginBox = () => {
    setIsVisible(true);
  };

  return (
    <div style={styles.container}>
      {!isVisible && (
        <button onClick={handleShowLoginBox} style={styles.showLoginButton}>
          Đăng nhập
        </button>
      )}
      {isVisible && (
        <div style={styles.loginBox}>
          <button onClick={handleClose} style={styles.closeButton}>
            &times;
          </button>
          <h2>Đăng nhập</h2>
          <form onSubmit={handleLogin}>
            <div style={styles.inputGroup}>
              <label htmlFor="username">Tên đăng nhập:</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
            </div>
            <div style={styles.inputGroup}>
              <label htmlFor="password">Mật khẩu:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button type="submit" style={styles.button}>
              Đăng nhập
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundImage: `url('https://datafiles.nghean.gov.vn/nan-ubnd/4179/quantritintuc20236/at1638225017565486257.jpg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    flexDirection: 'column',
    position: 'relative',
  },
  loginBox: {
    maxWidth: '350px',
    width: '100%',
    padding: '20px',
    textAlign: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '15px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#888',
  },
  showLoginButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: '15px',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    boxSizing: 'border-box',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
};

export default Login;
