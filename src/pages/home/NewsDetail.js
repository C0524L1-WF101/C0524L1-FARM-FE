import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './NewsDetail.css'; // Import CSS

const NewsDetail = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [news, setNews] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(`http://localhost:3000/news/${id}`);
                const data = await response.json();
                setNews(data);
                setLoading(false);
            } catch (error) {
                console.error("Lỗi tải bài viết:", error);
                setLoading(false);
            }
        };

        fetchNews();
    }, [id]);

    // Hàm xử lý nội dung bài viết, chia thành các đoạn văn
    const parseContent = (content) => {
        return content.split('\n').map((item, index) => {
            return (
                <p key={index} className="news-detail__paragraph">{item}</p>
            );
        });
    };

    if (loading) {
        return <div>Đang tải bài viết...</div>;
    }

    if (!news) {
        return <div>Bài viết không tồn tại!</div>;
    }

    // Định dạng ngày đăng
    const formattedDate = new Date(news.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <div className="news-detail__container">
            <h1 className="news-detail__title">{news.title}</h1>
            {news.imageUrl && (
                <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    className="news-detail__image" 
                />
            )}
            <p><strong>Ngày đăng:</strong> {formattedDate || 'Chưa có thông tin ngày đăng'}</p>
            <p><strong>Nguồn:</strong> {news.source}</p>
            <div className="mt-4">
                {/* Dùng parseContent để tách nội dung bài viết thành các đoạn <p> */}
                {parseContent(news.content)}
            </div>
        </div>
    );
};

export default NewsDetail;
