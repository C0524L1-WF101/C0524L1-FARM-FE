import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAvatar } from '../../AvatarContext'; // Import hook từ AvatarContext
import "../profile/Profile.css";
import ToastNotification from '../../component/ToastNotification';

const UserProfile = () => {
  const { userId } = useParams();  // Lấy userId từ URL params
  const { avatar, updateAvatar } = useAvatar();  // Lấy và cập nhật avatar từ context
  const [user, setUser] = useState(null);  // State để lưu thông tin người dùng
  const [newAvatar, setNewAvatar] = useState(null);  // State để lưu ảnh đại diện mới
  const [isEditing, setIsEditing] = useState(false);  // State để kiểm tra chế độ chỉnh sửa
  const [toast, setToast] = useState({ message: "", type: "", show: false });  // Thông báo toast

  // Fetch dữ liệu người dùng khi trang được tải
  useEffect(() => {
    fetch(`http://localhost:3000/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))  // Lưu dữ liệu người dùng vào state
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  // Xử lý khi thay đổi ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);  // Lưu ảnh đại diện mới vào state
      };
      reader.readAsDataURL(file);
    }
  };

  // Lưu thông tin profile sau khi chỉnh sửa
  const handleSaveProfile = () => {
    fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        avatar: newAvatar || user.avatar,  // Lưu avatar mới hoặc giữ avatar cũ
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        updateAvatar(newAvatar || data.avatar);  // Cập nhật avatar trong context
        setToast({ message: "Profile saved successfully!", type: "success", show: true });
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
        setToast({ message: "Error saving profile!", type: "error", show: true });
      });
  };

  // Bật chế độ chỉnh sửa
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Hủy bỏ chế độ chỉnh sửa
  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewAvatar(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  if (!user) {
    return <div>Loading...</div>;  // Hiển thị khi dữ liệu người dùng chưa được tải
  }

  return (
    <div className="user-profile">
      {/* Avatar container */}
      <div className="avatar-container">
        <img
          src={newAvatar || user.avatar || "https://www.svgrepo.com/show/343494/profile-user-account.svg"}
          alt="User Avatar"
          className="avatar"
        />
      </div>

      <h1>User Profile</h1>
      <div className="info">
        {/* Hiển thị thông tin người dùng */}
        {!isEditing ? (
          <>
            <p><strong>ID:</strong> {user.id}</p>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role}</p>
            <p><strong>Date of Birth:</strong> {user.dob}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>ID Number:</strong> {user.idNumber}</p>
          </>
        ) : (
          // Form chỉnh sửa thông tin
          <div>
            <div>
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={user.username}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={user.password}
                onChange={handleInputChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Nút chỉnh sửa profile */}
      {!isEditing ? (
        <button onClick={handleEditProfile}>Edit Profile</button>
      ) : (
        <div>
          <button onClick={handleCancelEdit}>Cancel</button>
          <button onClick={handleSaveProfile}>Save Profile</button>
        </div>
      )}

      {/* Chế độ chỉnh sửa: Upload avatar mới */}
      {isEditing && (
        <div className="avatar-upload">
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
      )}

      {/* Toast Notification */}
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
