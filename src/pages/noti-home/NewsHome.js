import React, { useState, useEffect } from 'react';
import './NewsHome.css';
import { postAPI } from '../../services/api';

const NewsHome = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([]);  // Lưu nhiều ảnh
    const [imagePreviews, setImagePreviews] = useState([]);  // Lưu ảnh preview
    const [isEditing, setIsEditing] = useState(false);
    const [editingPostId, setEditingPostId] = useState(null);
    
    // Modal xác nhận xóa
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);

    // Tìm kiếm bài viết
    const [searchTerm, setSearchTerm] = useState('');

    // Hàm lấy danh sách bài viết từ API
    const fetchPosts = async () => {
        try {
            const data = await postAPI.getAllPosts();
            setPosts(data);
        } catch (error) {
            console.error('Lỗi khi lấy bài viết:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Hàm xử lý khi người dùng chọn nhiều ảnh
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);  // Chuyển đổi files thành mảng
        setImages(files);
        const previews = files.map((file) => URL.createObjectURL(file));  // Tạo preview cho tất cả ảnh
        setImagePreviews(previews);
    };

    // Hàm xử lý khi người dùng nhấn nút Đăng bài
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            alert('Xin vui lòng nhập đầy đủ thông tin!');
            return;
        }

        // Chuyển đổi các ảnh sang base64
        const imageBase64Promises = images.map((image) => convertImageToBase64(image));
        const imageBase64 = await Promise.all(imageBase64Promises);  // Chờ tất cả ảnh chuyển đổi xong

        const newPost = { 
            title, 
            content, 
            images: imageBase64,  // Lưu danh sách ảnh dưới dạng base64
            createdAt: new Date().toLocaleString()  // Thêm thời gian đăng bài
        };

        try {
            if (isEditing) {
                const updatedPost = await postAPI.updatePost(editingPostId, newPost);
                setPosts(posts.map((post) => (post.id === editingPostId ? updatedPost : post)));
                setIsEditing(false);
                setEditingPostId(null);
            } else {
                const savedPost = await postAPI.createPost(newPost);
                setPosts([...posts, savedPost]);
            }

            setTitle('');
            setContent('');
            setImages([]);
            setImagePreviews([]);
            setShowModal(false);
            alert('Đăng bài thành công!');
        } catch (error) {
            console.error('Lỗi khi đăng bài:', error);
            alert('Đăng bài không thành công.');
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

    const handleEditPost = (post) => {
        setTitle(post.title);
        setContent(post.content);
        setImagePreviews(post.images);  // Hiển thị preview của nhiều ảnh
        setIsEditing(true);
        setEditingPostId(post.id);
        setShowModal(true);
    };

    // Mở modal xác nhận xóa
    const handleDeletePost = (post) => {
        setPostToDelete(post);
        setShowDeleteModal(true);
    };

    // Xác nhận xóa bài viết
    const confirmDeletePost = async () => {
        if (postToDelete) {
            try {
                await postAPI.deletePost(postToDelete.id);
                setPosts(posts.filter((post) => post.id !== postToDelete.id));
                alert('Đã xóa bài viết thành công');
                setShowDeleteModal(false); // Đóng modal sau khi xóa
            } catch (error) {
                console.error('Lỗi khi xóa bài viết:', error);
                alert('Không thể xóa bài viết');
            }
        }
    };

    // Lọc bài viết theo từ khóa tìm kiếm
    const filteredPosts = posts.filter(post => {
        return (
            post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="news-home">
            <h2>Đăng bài viết mới</h2>

            {/* Ô tìm kiếm */}
            <div className="search-container">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm bài viết"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                {isEditing ? 'Chỉnh sửa bài viết' : 'Đăng bài mới'}
            </button>

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
                                        multiple  // Cho phép chọn nhiều ảnh
                                    />
                                </div>

                                {/* Hiển thị tất cả ảnh preview */}
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
                            <button className="btn btn-danger" onClick={confirmDeletePost}>Xóa</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="posts-list mt-4">
                <h3>Các bài viết đã đăng:</h3>
                {filteredPosts.length === 0 ? (
                    <p>Chưa có bài viết nào.</p>
                ) : (
                    <ul className="list-group">
                        {filteredPosts.map((post, index) => (
                            <li key={post.id} className="list-group-item">
                                <h5>{post.title}</h5>
                                <p>{post.content}</p>
                                {/* Hiển thị tất cả ảnh của bài viết */}
                                {post.images && post.images.map((image, idx) => (
                                    <img key={idx} src={image} alt={`post-image-${idx}`} className="img-fluid mt-2" />
                                ))}
                                <p className="post-time text-muted">{post.createdAt}</p> {/* Hiển thị thời gian đăng bài */}
                                <button
                                    className="btn btn-warning btn-sm mt-2"
                                    onClick={() => handleEditPost(post)}
                                >
                                    Chỉnh sửa
                                </button>
                                <button
                                    className="btn btn-danger btn-sm mt-2 ms-2"
                                    onClick={() => handleDeletePost(post)}
                                >
                                    Xóa
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default NewsHome;
