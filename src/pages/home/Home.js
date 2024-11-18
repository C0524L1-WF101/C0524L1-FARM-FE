import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ToastNotification from '../../component/ToastNotification.js';
import './Home.css'

const Home = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true); // Biến trạng thái cho việc tải tin tức
    const [error, setError] = useState(null); // Biến trạng thái để lưu lỗi nếu có

    // Fetch tin tức từ API
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:3000/news');
                if (!response.ok) {
                    throw new Error('Không thể tải tin tức');
                }
                const newsData = await response.json();
                setNews(newsData);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi tải tin tức:", error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    if (loading) {
        return <div>Đang tải tin tức...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className="home-container mt-4">
            <h1 className="mb-4 text-center">Tin tức Mới Nhất</h1>

            {/* Hiển thị Tin tức Hot */}
            <div className="mb-4">
                <h2 className="text-center">Tin tức Hot</h2>
                <div className="row">
                    {news.filter(item => item.isHot).map(item => (
                        <div className="col-md-4 mb-3" key={item.id}>
                            <div className="card" style={{ height: '100%' }}>
                                <div className="row g-0">
                                    {/* Hình ảnh nằm phía trái */}
                                    <div className="col-md-4">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} alt={item.title} className="img-fluid rounded-start" style={{ height: '150px', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px', backgroundColor: '#f0f0f0' }}>
                                                <span className="text-muted">Không có ảnh</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Nội dung tin tức (Tiêu đề, Mô tả) nằm phía phải */}
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <Link to={`/news/${item.id}`} className="home-custom-title" style={{ fontSize: '1.2rem', textDecoration: 'none', color: 'inherit' }}>
                                                {item.title}
                                            </Link>
                                            <p className="card-text" style={{ fontSize: '0.9rem' }}>{item.description}</p>
                                            <small className="text-muted" style={{ fontSize: '0.8rem' }}>Nguồn: {item.source}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Hiển thị các chủ đề tin tức */}
            <div className="row">
                {['Tin tức & Sự kiện', 'Thị trường', 'Hoạt động doanh nghiệp', 'Khoa học kĩ thuật', 'Nhà nông làm giàu'].map((category) => (
                    <div className="col-md-12 mb-3" key={category}>
                        <h5>{category}</h5>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-2">
                            {/* Lấy 4 bài viết đầu tiên trong mỗi chủ đề */}
                            {news.filter(item => item.category === category && !item.isHot).slice(0, 4).map(item => (
                                <div className="col mb-3" key={item.id}>
                                    <div className="card" style={{ height: '100%' }}>
                                        <div className="row g-0">
                                            {/* Hình ảnh nằm phía trái */}
                                            <div className="col-md-4">
                                                {item.imageUrl ? (
                                                    <img src={item.imageUrl} alt={item.title} className="img-fluid rounded-start" style={{ height: '120px', objectFit: 'cover' }} />
                                                ) : (
                                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '120px', backgroundColor: '#f0f0f0' }}>
                                                        <span className="text-muted">Không có ảnh</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Nội dung tin tức (Tiêu đề, Mô tả) nằm phía phải */}
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <Link to={`/news/${item.id}`} className="home-custom-title" style={{ fontSize: '1.1rem', textDecoration: 'none', color: 'inherit' }}>
                                                        {item.title}
                                                    </Link>
                                                    <p className="card-text" style={{ fontSize: '0.85rem' }}>{item.description}</p>
                                                    <small className="text-muted" style={{ fontSize: '0.8rem' }}>Nguồn: {item.source}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Toast Notification */}
            <ToastNotification
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Home;
