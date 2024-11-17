import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer shadow">
      {/* Phần bên trái (chiếm 30%) */}
      <div className="left-section">
        <div className="top-left">
        <h6>Thông tin công ty</h6>
        <p>Bản quyền thuộc về Nhóm 3. Trang tin tức điện tử chăn nuôi tổng hợp.</p>

        </div>
        <div className="bottom-left">
        <h6>Được chứng nhận bởi</h6>
        <p>Giấy phép số: 279/GP-TTĐT của Bộ Thông tin và Truyền thông, cấp ngày 24/5/2017</p>

        </div>
      </div>
      
      {/* Phần bên phải (chiếm 70%) */}
      <div className="right-section">
        <h5>CÔNG TY CỔ PHẦN NÔNG 4 THÀNH VIÊN VIỆT NAM</h5>
        <div className="additional-info">
        <p>Trụ sở chính: Tầng 69, tòa nhà Villa Tower, 6969C đường Vào Tim Em, Phường Băng Giá, Thành phố Hà Nội, Thành phố Hồ Chí Minh, Việt Nam</p>
          <p>Điện thoại: (024) 6659.7733 | Hotline: 0901.01.10.83</p>
          <p>Email: Toasoanchannuoivietnam@gmail.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
