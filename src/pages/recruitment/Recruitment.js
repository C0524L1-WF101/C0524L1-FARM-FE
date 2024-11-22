
import React from 'react';
import './Recruitment.css';

const Recruitment = () => {
    return (
        <div className="recruitment-container">
            <div className="recruitment-banner">
                <div className="recruitment-banner-overlay">
                    <h1>Tuyển dụng Những Chú Heo </h1>
                    <p>Gia nhập đội ngũ Những Chú Heo để cùng nhau phát triển và xây dựng một tương lai bền vững.</p>
                </div>
            </div>

            <section className="company-introduction">
                <div className="company-intro-content">
                    <div className="company-intro-text">
                        <h2>Giới thiệu về Những Chú Heo</h2>
                        <p>
                            Những Chú Heo cam kết mang đến cho nhân viên một môi trường làm việc chuyên nghiệp, sáng tạo, và năng động. Với sứ mệnh cung cấp thức ăn chăn nuôi chất lượng cao, chúng tôi luôn tìm kiếm những tài năng phù hợp để cùng phát triển.
                        </p>
                    </div>
                    <div className="company-intro-image">
                        <img src="https://s.widget-club.com/images/YyiR86zpwIMIfrCZoSs4ulVD9RF3/97985b19ab0985679f67c0cb86a1e160/53535a1a5eecadf30efb1082a3ff6127.jpg?q=70&w=500" alt="Workplace" />
                    </div>
                </div>
            </section>

            <section className="job-opportunities">
                <h2>Các cơ hội tuyển dụng</h2>
                <div className="job-list">
                    <div className="job-item">
                        <h3>Nhân viên Kinh doanh</h3>
                        <p>Vị trí tuyển dụng: Nhân viên Kinh doanh</p>
                        <p>Yêu cầu: Kinh nghiệm 1-2 năm trong lĩnh vực bán hàng, khả năng giao tiếp tốt, nhiệt huyết với công việc.</p>
                    </div>
                    <div className="job-item">
                        <h3>Kỹ sư Công nghệ</h3>
                        <p>Vị trí tuyển dụng: Kỹ sư Công nghệ</p>
                        <p>Yêu cầu: Tốt nghiệp đại học chuyên ngành kỹ thuật, kiến thức vững về công nghệ chăn nuôi và sản xuất thức ăn chăn nuôi.</p>
                    </div>
                    <div className="job-item">
                        <h3>Nhân viên Marketing</h3>
                        <p>Vị trí tuyển dụng: Nhân viên Marketing</p>
                        <p>Yêu cầu: Có kinh nghiệm trong marketing trực tuyến, khả năng sáng tạo và chiến lược tốt.</p>
                    </div>
                </div>
            </section>

            <section className="benefits">
                <h2>Chính sách đãi ngộ</h2>
                <p>
                    Tại Những Chú Heo, chúng tôi cam kết mang đến cho nhân viên một môi trường làm việc đầy thử thách nhưng cũng đầy cơ hội. Các chế độ đãi ngộ tại công ty bao gồm:
                </p>
                <ul>
                    <li>Chế độ lương thưởng cạnh tranh, thưởng hiệu suất công việc.</li>
                    <li>Bảo hiểm y tế, bảo hiểm xã hội đầy đủ.</li>
                    <li>Cơ hội thăng tiến và đào tạo nâng cao kỹ năng nghề nghiệp.</li>
                    <li>Môi trường làm việc thân thiện, sáng tạo và chuyên nghiệp.</li>
                </ul>
            </section>

            <section className="training">
                <h2>Chính sách đào tạo và phát triển</h2>
                <p>
                    Chúng tôi luôn chú trọng đến việc phát triển năng lực của nhân viên. Những Chú Heo cung cấp các khóa đào tạo chuyên môn và kỹ năng mềm để giúp nhân viên nâng cao năng lực và thăng tiến trong sự nghiệp.
                </p>
            </section>

            <section className="contact">
                <h2>Liên hệ với chúng tôi</h2>
                <ul>
                    <li>Email: recruitment@gmail.vn</li>
                    <li>Hotline: 1800-5678</li>
                    <li>Địa chỉ: Số 123, Đường XYZ, Hà Nội, Việt Nam</li>
                </ul>
            </section>
        </div>
    );
};

export default Recruitment;
