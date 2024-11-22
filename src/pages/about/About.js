
import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-banner">
        <div className="about-banner-overlay">
          <h1>Giới thiệu về Những Chú Heo</h1>
          <p>Chúng tôi cung cấp giải pháp thức ăn chăn nuôi chất lượng cao và bền vững.</p>
        </div>
      </div>

      <section className="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>Giới thiệu về công ty</h2>
            <p>
            Những Chú Heo là công ty chuyên cung cấp các sản phẩm thức ăn chăn nuôi chất lượng cao, sản xuất từ nguyên liệu tự nhiên. Chúng tôi cam kết mang đến các giải pháp dinh dưỡng an toàn và hiệu quả cho vật nuôi.
            </p>
          </div>
          <div className="about-image">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXTP_4NPFXf5llS9LHn32B7bdBkcbCpsxbdJmW1MBcAZpyOPyBhvrqWErKWbwhs_5zKsg&usqp=CAU" alt="About Us" />
          </div>
        </div>
      </section>

      <section className="history">
        <h2>Lịch sử phát triển</h2>
        <p>
        Những Chú Heo được thành lập vào năm 2010 và đã nhanh chóng trở thành một trong những công ty hàng đầu trong ngành thức ăn chăn nuôi tại Việt Nam. Chúng tôi không ngừng phát triển và mở rộng thị trường, mang lại giá trị bền vững cho ngành nông nghiệp.
        </p>
        <ul>
          <li>2010: Thành lập công ty Những Chú Heo tại Việt Nam.</li>
          <li>2012: Mở rộng quy mô sản xuất và đầu tư vào công nghệ hiện đại.</li>
          <li>2015: Chúng tôi đã phát triển một loạt sản phẩm thức ăn chất lượng cao, đáp ứng nhu cầu thị trường.</li>
          <li>2018: Mở rộng thị trường quốc tế, xuất khẩu sản phẩm sang các quốc gia trong khu vực Đông Nam Á.</li>
          <li>2020: Tập trung vào sản phẩm hữu cơ và giải pháp chăn nuôi bền vững.</li>
        </ul>

        <div className="achievements">
          <h3>Thành tựu</h3>
          <ul>
            <li>Được bình chọn là công ty thức ăn chăn nuôi hàng đầu tại Việt Nam 3 năm liên tiếp (2024-2027).</li>
            <li>Đạt giải thưởng "Sản phẩm chất lượng cao" tại triển lãm ngành chăn nuôi quốc tế.</li>
            <li>Phát triển sản phẩm thức ăn hữu cơ đạt chứng nhận tiêu chuẩn quốc tế.</li>
          </ul>
        </div>

        <div className="certificates">
          <h3>Chứng nhận</h3>
          <div className="certificate-images">
            <img src="https://via.placeholder.com/150x100.png?text=TT1" alt="ISO 9001" />
            <img src="https://via.placeholder.com/150x100.png?text=TT2" alt="HACCP" />
            <img src="https://via.placeholder.com/150x100.png?text=TT3" alt="Organic Certification" />
          </div>
        </div>
      </section>

      <section className="mission">
        <h2>Sứ mệnh và cam kết</h2>
        <p>
          Chúng tôi cam kết mang đến cho khách hàng các sản phẩm thức ăn chăn nuôi an toàn, dinh dưỡng cao, và hiệu quả sản xuất tốt nhất. Với công nghệ hiện đại và đội ngũ nhân viên chuyên nghiệp, chúng tôi luôn nỗ lực cải tiến và nâng cao chất lượng sản phẩm.
        </p>
      </section>

      <section className="contact">
        <h2>Liên hệ với chúng tôi</h2>
        <ul>
          <li>Email: support@gmail.vn</li>
          <li>Hotline: 1800-1234</li>
          <li>Địa chỉ: Số 123, Đường ABC, Hà Nội, Việt Nam</li>
        </ul>
      </section>
    </div>
  );
};

export default About;
