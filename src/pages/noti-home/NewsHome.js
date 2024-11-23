import React, { useState, useEffect } from 'react';
import './NewsHome.css';
import { newsAPI } from '../../services/api';
import ToastNotification from '../../component/ToastNotification';

const NewsHome = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [news, setNews] = useState([]); 
    const [images, setImages] = useState([]);  
    const [imagePreviews, setImagePreviews] = useState([]);  
    const [isEditing, setIsEditing] = useState(false);
    const [editingNewsId, setEditingNewsId] = useState(null);
    const [toast, setToast] = useState({ message: '', type: '', show: false });
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newsToDelete, setNewsToDelete] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [expandedPost, setExpandedPost] = useState(null); // Lưu bài viết đang mở rộng

    const fetchNews = async () => {
        try {
            const data = await newsAPI.getAllNews();
            setNews(Array.isArray(data) ? data : []);  
        } catch (error) {
            console.error('Lỗi khi lấy tin tức:', error);
            setNews([]);  
        }
    };

    useEffect(() => {
        fetchNews();
    }, []);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
        const previews = files.map((file) => URL.createObjectURL(file));
        setImagePreviews(previews);
    };
    const showToast = (message, type) => {
        setToast({ message, type, show: true });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, show: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            showToast('Xin vui lòng nhập đầy đủ thông tin!');
            return;
        }

        const imageBase64Promises = images.map((image) => convertImageToBase64(image));
        const imageBase64 = await Promise.all(imageBase64Promises);

        const newPost = {
            title,
            content,
            images: imageBase64,
            createdAt: new Date().toLocaleString()
        };

        try {
            if (isEditing) {
                const updatedNews = await newsAPI.updateNews(editingNewsId, newPost);
                setNews(news.map((item) => (item.id === editingNewsId ? updatedNews : item)));
                setIsEditing(false);
                setEditingNewsId(null);
            } else {
                const savedNews = await newsAPI.createNews(newPost);
                setNews([...news, savedNews]);
            }

            setTitle('');
            setContent('');
            setImages([]);
            setImagePreviews([]);
            setShowModal(false);
            showToast("Đăng bài thành công", "success");
        } catch (error) {
            console.error('Lỗi khi đăng bài:', error);
            showToast('Đăng bài không thành công.');
        }
    };

    const convertImageToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    const handleEditNews = (item) => {
        setTitle(item.title || "");
        setContent(item.content || "");
        setImagePreviews(item.images || []);  
        setIsEditing(true);
        setEditingNewsId(item.id);
        setShowModal(true);
    };

    const handleDeleteNews = (item) => {
        setNewsToDelete(item);
        setShowDeleteModal(true);
    };

    const confirmDeleteNews = async () => {
        if (newsToDelete) {
            try {
                await newsAPI.deleteNews(newsToDelete.id);
                setNews(news.filter((item) => item.id !== newsToDelete.id));
                showToast('Đã xóa bài viết thành công');
                setShowDeleteModal(false);
            } catch (error) {
                console.error('Lỗi khi xóa bài viết:', error);
                showToast('Không thể xóa bài viết');
            }
        }
    };

    const filteredNews = (news || []).filter(item => {
        return (
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const truncateContent = (content, length = 100) => {
        if (content.length > length) {
            return content.substring(0, length) + '...';
        }
        return content;
    };

    // Hiển thị chi tiết hoặc thu gọn bài viết
    const handleToggleExpand = (item) => {
        if (expandedPost === item.id) {
            setExpandedPost(null); // Thu gọn nếu bài viết đang mở rộng
        } else {
            setExpandedPost(item.id); // Mở rộng bài viết
        }
    };

    return (
        <div className="news-home">
            <div className='d-flex align-items-center justify-content-between'>
                <h2 className='title-news'>Đăng tin tức mới</h2>
    
                <div className='d-flex align-content-center justify-content-center'>
                    <div className="search-container ">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm bài viết"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
        
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        {isEditing ? 'Chỉnh sửa bài viết' : 'Đăng bài mới'}
                    </button>
                </div>
            </div>

            {/* Modal đăng bài */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{isEditing ? 'Chỉnh sửa bài viết' : 'Đăng bài viết mới'}</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit} className="news-form">
                                <div className="form-group">
                                    <label htmlFor="title">Tiêu đề:</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="form-control"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="content">Nội dung:</label>
                                    <textarea
                                        id="content"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        className="form-control"
                                        rows="5"
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="images">Chọn ảnh:</label>
                                    <input
                                        type="file"
                                        id="images"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="form-control"
                                        multiple
                                    />
                                </div>

                                {imagePreviews.map((preview, index) => (
                                    <img key={index} src={preview} alt={`preview-${index}`} className="img-fluid mt-3" />
                                ))}

                                <button type="submit" className="btn btn-primary mt-3">
                                    {isEditing ? 'Cập nhật bài viết' : 'Đăng bài'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal xác nhận xóa */}
            <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} style={{ display: showDeleteModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Xác nhận xóa</h5>
                            <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Bạn có chắc chắn muốn xóa bài viết này không?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Hủy</button>
                            <button className="btn btn-danger" onClick={confirmDeleteNews}>Xóa</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danh sách bài viết */}
            <div >
                <h3 className='title-news'>Các bài viết đã đăng:</h3>
                {filteredNews.length === 0 ? (
                    <p>Chưa có bài viết nào.</p>
                ) : (
                    <ul className="list-group">
                        {filteredNews.map((item) => (
                            <li key={item.id} className="list-group-item">
                                <h5>{item.title}</h5>
                                <p>{expandedPost === item.id ? item.content : truncateContent(item.content)}</p>
                                <button
                                    className="btn btn-link"
                                    onClick={() => handleToggleExpand(item)}  // Hiển thị chi tiết hoặc thu gọn
                                >
                                    {expandedPost === item.id ? 'Thu gọn' : 'Xem chi tiết'}
                                </button>
                                {item.images && Array.isArray(item.images) && item.images.map((image, idx) => (
                                    <img key={idx} src={image} alt={`post-image-${idx}`} className="img-fluid mt-2" />
                                ))}
                                <p className="post-time text-muted">{item.createdAt}</p>
                                <button
                                    className="btn-warning-1"
                                    onClick={() => handleEditNews(item)}
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    className="btn-warning-2"
                                    onClick={() => handleDeleteNews(item)}
                                >
                                    Xóa
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                
            </div>
            <ToastNotification
                message={toast.message}
                type={toast.type}
                show={toast.show}
                onClose={handleCloseToast}
            />
        </div>
            
    );
};


export default NewsHome;
