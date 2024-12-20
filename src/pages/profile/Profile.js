import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import ToastNotification from "../../component/ToastNotification";
import "./Profile.css";

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null); // Thông tin người dùng
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái của modal
  const [newAvatar, setNewAvatar] = useState(null); // Ảnh đại diện mới
  const [password, setPassword] = useState(""); // Mật khẩu hiện tại
  const [showPassword, setShowPassword] = useState(false); // Kiểm soát hiển thị mật khẩu
  const [toast, setToast] = useState({ message: "", type: "", show: false }); // Toast thông báo

  useEffect(() => {
    fetch(`http://localhost:3000/users/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setPassword(data.password); // Gán mật khẩu
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result); // Lưu ảnh đại diện mới
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        password, // Cập nhật mật khẩu
        avatar: newAvatar || user.avatar, // Lưu avatar mới hoặc giữ avatar cũ
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setToast({ message: "Profile updated successfully!", type: "success", show: true });
        setIsModalOpen(false);
        setNewAvatar(null);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        setToast({ message: "Error updating profile!", type: "error", show: true });
      });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile-container">
      <div className="user-card">
        <h2 className="title-header">Thông tin người dùng</h2>
        <div className="avatar-container">
          <img
            src={newAvatar || user.avatar || "https://www.svgrepo.com/show/343494/profile-user-account.svg"}
            alt="User Avatar"
            className="avatar"
          />
        </div>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Role:</strong> {user.role === "admin" ? "Admin" : "Nhân viên"}</p>
        <p><strong>Ngày sinh: </strong>{new Date(user.dob).toLocaleDateString("vi-VN")}</p>
        <p><strong>Giới tính:</strong> {user.gender}</p>
        <p><strong>Mật khẩu:</strong> {"*".repeat(user.password.length)}</p> 
        <p><strong>Lương:</strong> {user.wage} VND</p>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>Edit Profile</Button>
      </div>

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="text-center mb-3">
              <img
                src={newAvatar || user.avatar || "https://www.svgrepo.com/show/343494/profile-user-account.svg"}
                alt="User Avatar"
                className="avatar avatar-edit"
              />
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Avatar</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleAvatarChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dob"
                value={user.dob}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={user.gender}
                onChange={handleInputChange}
              >
                <option value="">Chọn giới tính</option>
                <option value="Male">Nam</option>
                <option value="Female">Nữ</option>
                <option value="Other">Khác</option>
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <div className="password-input-container">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  variant="outline-secondary"
                  className="toggle-password"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </Button>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveProfile}>Save</Button>
        </Modal.Footer>
      </Modal>

      <ToastNotification 
        message={toast.message} 
        type={toast.type} 
        show={toast.show} 
        onClose={() => setToast((prev) => ({ ...prev, show: false }))} 
      />
    </div>
  );
};

export default UserProfile;
