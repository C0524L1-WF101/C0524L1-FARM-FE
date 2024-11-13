import React from 'react';
import { useState, useEffect } from "react";
import { newsAPI, pigAPI } from '../../services/api.js';
import ToastNotification from '../../component/ToastNotification.js'

const Home = () => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');


    const [news, setNews] = useState([]);
    const [pigs, setPigs] = useState([]);
    const [newPig, setNewPig] = useState({
        name: "",
        weight: "",
        age: "",
        farmLocation: "",
    });
    const [editingPigId, setEditingPigId] = useState(null);

    useEffect(() => {
        const fetchPigs = async () => {
            try {
                const pigData = await pigAPI.getAllPigs();
                setPigs(pigData);
            } catch (error) {
                console.error("Lỗi tải danh sách lợn:", error);
            }
        };

        fetchPigs();
    }, []);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const newsData = await newsAPI.getAllNews();
                setNews(newsData);
            } catch (error) {
                console.error("Lỗi tải tin tức:", error);
            }
        };

        fetchNews();
    }, []);

    const showToastMessage = (message, type) => {
        setToastMessage(message);
        setToastType(type);
        setShowToast(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewPig({
            ...newPig,
            [name]: value,
        });
    };

    const handleAddOrUpdatePig = async () => {
        try {
            if (editingPigId) {
                // Cập nhật lợn
                const updatedPig = await pigAPI.updatePig(editingPigId, newPig);
                setPigs(pigs.map(pig => (pig.id === editingPigId ? updatedPig : pig)));
                showToastMessage('Cập nhật lợn thành công!', 'success');
            } else {
                // Thêm lợn mới
                const addedPig = await pigAPI.createPig(newPig);
                setPigs([...pigs, addedPig]);
                showToastMessage(' Thêm lợn mới!', 'success');
            }

            // Reset form và trạng thái chỉnh sửa
            setNewPig({ name: "", weight: "", age: "", farmLocation: "" });
            setEditingPigId(null);
        } catch (error) {
            console.error("Lỗi khi thêm hoặc cập nhật lợn:", error);
            showToastMessage('Failed to delete post. Please try again.', 'error');
        }
    };

    const handleEditPig = (pig) => {
        setNewPig(pig);
        setEditingPigId(pig.id);
    };

    const handleDeletePig = async (id) => {
        try {
            await pigAPI.deletePig(id);
            setPigs(pigs.filter(pig => pig.id !== id));
            showToastMessage(' Xóa thành công', 'success');
        } catch (error) {
            console.error("Lỗi khi xóa lợn:", error);
            showToastMessage('Failed to delete post. Please try again.', 'error');
        }
    };

    return (
        <div className="container mt-2">
            <h1>Tin tức</h1>
            <ul>
                {news.map((item) => (
                    <li key={item.id}>
                        {item.title} - {item.createdAt}
                    </li>
                ))}
            </ul>

            <h1>Danh sách lợn</h1>
            <ul>
                {pigs.map((pig) => (
                    <li key={pig.id}>
                        <p>Vị trí trang trại: {pig.farmLocation}</p>
                        <p>Tên: {pig.name}</p>
                        <p>Tuổi: {pig.age}</p>
                        <p>Cân nặng: {pig.weight}</p>
                        <button onClick={() => handleEditPig(pig)}>Sửa</button>
                        <button onClick={() => handleDeletePig(pig.id)}>Xóa</button>
                    </li>
                ))}
            </ul>

            <h2>{editingPigId ? "Cập nhật Lợn" : "Thêm Lợn Mới"}</h2>
            <form onSubmit={(e) => e.preventDefault()}>
                <label>
                    Tên lợn:
                    <input
                        type="text"
                        name="name"
                        value={newPig.name}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Cân nặng (kg):
                    <input
                        type="number"
                        name="weight"
                        value={newPig.weight}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Tuổi:
                    <input
                        type="number"
                        name="age"
                        value={newPig.age}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <label>
                    Vị trí trang trại:
                    <input
                        type="text"
                        name="farmLocation"
                        value={newPig.farmLocation}
                        onChange={handleChange}
                    />
                </label>
                <br />
                <button onClick={handleAddOrUpdatePig}>
                    {editingPigId ? "Cập nhật" : "Thêm Lợn"}
                </button>
            </form>
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