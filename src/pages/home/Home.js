import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ToastNotification from '../../component/ToastNotification.js';
import './Home.css';

const Home = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [imageTransition, setImageTransition] = useState(false); // Thêm state để quản lý hiệu ứng chuyển ảnh

    // Danh sách các ảnh lớn
    const largeImages = [
        "https://nutimilk.com.vn/wp-content/uploads/2020/12/img_sec6.jpg",
        "https://www.igocanada.ca/wp-content/uploads/2023/06/mua-trang-trai-o-canada.jpg",
        "https://danviet.mediacdn.vn/2019/11/18/00002-1574077052131698069410.png",
    ];

    // Hàm chuyển ảnh với hiệu ứng mượt mà
    useEffect(() => {
        const interval = setInterval(() => {
            setImageTransition(true); // Bắt đầu hiệu ứng chuyển ảnh
            setTimeout(() => {
                setCurrentImageIndex((prevIndex) => (prevIndex + 1) % largeImages.length);
                setImageTransition(false); // Kết thúc hiệu ứng sau khi thay đổi ảnh
            }, 1000); // Thời gian hiệu ứng fadeout (1s)
        }, 4000); // Chuyển ảnh sau mỗi 4 giây

        return () => clearInterval(interval); // Hủy interval khi component bị unmount
    }, [largeImages.length]);

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

            {/* Hình ảnh lớn mô tả các khu vực Trang trại */}
            <div className="large-image-container mb-4">
                <div className="large-image">
                    {/* Thêm class 'hidden' khi đang chuyển ảnh */}
                    <img
                        src={largeImages[currentImageIndex]}
                        alt="Trang trại"
                        className={imageTransition ? "hidden" : ""}
                    />
                </div>
                <div className="small-images">
                    <div className="small-image">
                        <img src="https://media.vneconomy.vn/images/upload/2022/03/23/lua-mi-2.jpg" alt="Khu vực 1" />
                    </div>
                    <div className="small-image">
                        <img src="https://api.toploigiai.vn/storage/uploads/tim-hieu-thong-tin-va-chia-se-voi-ban-ve-hoat-dong-san-xuat-nong-nghiep-o-khu-vuc-bac-my_2" alt="Khu vực 2" />
                    </div>
                    <div className="small-image">
                        <img src="https://img.meta.com.vn/data/image/2023/06/26/cac-loai-may-nong-nghiep-1.jpg" alt="Khu vực 3" />
                    </div>
                    <div className="small-image">
                        <img src="https://baodongnai.com.vn/file/e7837c02876411cd0187645a2551379f/dataimages/201507/original/images1078436_6_nong_nghiep.jpg" alt="Khu vực 4" />
                    </div>
                </div>
            </div>

            {/* Hiển thị Tin tức Hot */}
            <div className="mb-4">
                <h2 className="text-center">Tin tức Hot</h2>
                <div className="row">
                    {news.filter(item => item.isHot).map(item => (
                        <div className="col-md-4 mb-3" key={item.id}>
                            <div className="card">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        {item.imageUrl ? (
                                            <div className="card-img">
                                                <img src={item.imageUrl} alt={item.title} />
                                            </div>
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center" style={{ height: '150px', backgroundColor: '#f0f0f0' }}>
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

            {/* Hiển thị các chủ đề tin tức */}
            <div className="row">
                {['Tin tức & Sự kiện', 'Thị trường', 'Hoạt động doanh nghiệp', 'Khoa học kĩ thuật', 'Nhà nông làm giàu'].map((category) => (
                    <div className="col-md-12 mb-3" key={category}>
                        <h5>{category}</h5>
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3">
                            {news.filter(item => item.category === category && !item.isHot).slice(0, 6).map(item => (
                                <div className="col mb-2" key={item.id}>
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

                                            <div className="col-md-6">
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

export default Home;
