import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ToastNotification from '../../component/ToastNotification.js';
import './Tiding.css';

const Tiding = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
            {/* Tin tức Hot */}
            <div className="hot-news mb-5" >
                <h2 className="text-center" >Tin tức Hot</h2>
                <div className="row" >
                    {news.filter(item => item.isHot).map(item => (
                        <div className="col-md-4 mb-3" key={item.id}>
                            <div className="card custom-card">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        {item.imageUrl ? (
                                            <div className="card-img">
                                                <img src={item.imageUrl} alt={item.title} />
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center">
                                                <span className="text-muted">Không có ảnh</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <Link to={`/news/${item.id}`} className="home-custom-title">
                                                {item.title}
                                            </Link>
                                            <p className="card-text">{item.description}</p>
                                            <small className="text-muted">Nguồn: {item.source}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Các chủ đề tin tức */}
            <div className="categories mb-5" >
                {['Tin tức & Sự kiện', 'Thị trường', 'Hoạt động doanh nghiệp', 'Khoa học kĩ thuật', 'Nhà nông làm giàu'].map((category) => (
                    <div className="category-section" key={category} >
                        <h3>{category}</h3>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                            {news.filter(item => item.category === category && !item.isHot).slice(0, 6).map(item => (
                                <div className="col mb-2" key={item.id} >
                                    <div className="card">
                                        <div className="row g-0">
                                            <div className="col-md-4">
                                                {item.imageUrl ? (
                                                    <div className="card-img">
                                                        <img src={item.imageUrl} alt={item.title} />
                                                    </div>
                                                ) : (
                                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '120px', backgroundColor: '#f0f0f0' }}>
                                                        <span className="text-muted">Không có ảnh</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-8">
                                                <div className="card-body">
                                                    <Link to={`/news/${item.id}`} className="home-custom-title">
                                                        {item.title}
                                                    </Link>
                                                    <p className="card-text">{item.description}</p>
                                                    <small className="text-muted">Nguồn: {item.source}</small>
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

            <ToastNotification
                message={toastMessage}
                type={toastType}
                show={showToast}
                onClose={() => setShowToast(false)}
            />
        </div>
    );
};

export default Tiding;
