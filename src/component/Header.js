import React, { useState, useEffect } from 'react';

const Header = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Hàm để làm mới trang
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <header style={styles.header}>
      {/* Logo */}
      <div style={styles.logo} onClick={refreshPage}>
        <img
          src="https://vn-test-11.slatic.net/p/899fa5c59d7fa86de6e3634c1ce2326d.jpg"
          alt="Logo"
          style={styles.logoImage}
        />
        <h1 style={styles.logoText}>NEWS</h1>
      </div>

      {/* Thanh tìm kiếm */}
      <div style={styles.searchBox}>
        <input type="text" placeholder="Tìm kiếm..." style={styles.searchInput} />
      </div>

      {/* Ngày tháng */}
      <div style={styles.date}>
        {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </div>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 20px',
    backgroundColor: '#0078d4',
    color: 'white',
    cursor: 'pointer', // Để biểu thị rằng logo có thể được nhấp vào
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
  },
  logoImage: {
    width: '50px',
    height: '50px',
  },
  logoText: {
    marginLeft: '10px',
    fontSize: '24px',
  },
  searchBox: {
    flex: 1,
    margin: '0 20px',
  },
  searchInput: {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: 'none',
  },
  date: {
    fontSize: '16px',
  },
};

export default Header;
