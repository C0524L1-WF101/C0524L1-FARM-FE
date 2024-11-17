import React, { useState, useEffect } from "react";
import ToastNotification from '../../component/ToastNotification.js';

const Home = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true); // Biến trạng thái cho việc tải tin tức
    const [error, setError] = useState(null); // Biến trạng thái để lưu lỗi nếu có

    // Lấy tin tức từ API hoặc json-server mà không cần xác thực
    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:3000/news'); // Đảm bảo URL chính xác
                if (!response.ok) {
                    throw new Error('Không thể tải tin tức'); // Kiểm tra xem có lỗi không
                }
                const newsData = await response.json();
                setNews(newsData);  // Lưu tin tức vào state
                setLoading(false); // Đặt trạng thái là không còn loading
            } catch (error) {
                console.error("Lỗi tải tin tức:", error);
                setError(error.message); // Lưu lỗi vào state
                setLoading(false); // Đặt trạng thái là không còn loading
            }
        };

        fetchNews();
    }, []);  // Fetch khi component mount (không cần đăng nhập)

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    // Nếu đang tải dữ liệu
    if (loading) {
        return <div>Đang tải tin tức...</div>;
    }

    // Nếu có lỗi
    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div className="container mt-2">
            <h1>Tin tức</h1>
            <div className="row">
                <div className="col-md-8">
                    {/* Tin tức đáng chú ý */}
                    <div className="mb-4">
                        <h4>Tin tức đáng chú ý</h4>
                        {news.filter(item => item.id.startsWith('News')).map((item) => (
                            <div className="card mb-3" key={item.id}>
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        {item.imageUrl ? (
                                            <img src={item.imageUrl} className="img-fluid rounded-start" alt={item.title} style={{ height: '300px', objectFit: 'cover' }} />
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px', backgroundColor: '#f8f9fa' }}>
                                                <span className="text-muted">Không có ảnh</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Các chủ đề tin tức */}
                    <div className="row">
                        {['Tin tức & Sự kiện', 'Thị trường', 'Hoạt động doanh nghiệp', 'Khoa học kĩ thuật', 'Nhà nông làm giàu'].map((category) => (
                            <div className="col-md-12 mb-4" key={category}>
                                <h4>{category}</h4>
                                <div className="list-group">
                                    {news.filter(item => item.category === category && item.id.startsWith('new')).map(item => (
                                        <a href="#" className="list-group-item list-group-item-action" key={item.id}>
                                            <h5>{item.title}</h5>
                                            <p>{item.description}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Quảng cáo</h5>
                            <p className="card-text">Đây là không gian quảng cáo.</p>
                            <img src="https://via.placeholder.com/300x500" alt="ads" className="img-fluid" />
                        </div>
                    </div>
                </div>
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
