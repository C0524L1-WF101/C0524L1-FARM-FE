import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './NewsDetail.css'

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

    // Hàm xử lý xuống dòng hoặc chia thành đoạn văn
    const parseContent = (content) => {
        return content.split('\n').map((item, index) => {
            return (
                <p key={index} style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
                    {item}
                </p>
            );
        });
    };

    if (loading) {
        return <div>Đang tải bài viết...</div>;
    }

    if (!news) {
        return <div>Bài viết không tồn tại!</div>;
    }

    // Định dạng ngày đăng sử dụng toLocaleDateString
    const formattedDate = new Date(news.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <div className="container mt-4">
            <h1>{news.title}</h1>
            {/* Hiển thị hình ảnh của bài viết */}
            {news.imageUrl && (
                <img 
                    src={news.imageUrl} 
                    alt={news.title} 
                    style={{ width: '100%', height: 'auto', objectFit: 'cover', marginBottom: '20px' }} 
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
