import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../profile/Profile.css";
import ToastNotification from '../../component/ToastNotification';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  useEffect(() => {
    fetch(`http://localhost:3000/users/${userId}`)
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteAvatar = () => {
    if (!user.avatar) {
      setDeleteMessage("Không có ảnh để xóa");
      setToast({ message: "Không có ảnh để xóa", type: "error", show: true });

      setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
        setDeleteMessage("");
      }, 1500);
    } else {
      fetch(`http://localhost:3000/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
          avatar: null,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          setDeleteMessage("");
          setToast({ message: "Avatar deleted successfully!", type: "success", show: true });
        })
        .catch((error) => {
          console.error("Error deleting avatar:", error);
          setToast({ message: "Error deleting avatar!", type: "error", show: true });
        });
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setDeleteMessage("");
    setNewAvatar(null);
  };

  const handleSaveProfile = () => {
    fetch(`http://localhost:3000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...user,
        avatar: newAvatar || user.avatar,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
        setToast({ message: "Profile saved successfully!", type: "success", show: true });
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error saving profile:", error);
        setToast({ message: "Error saving profile!", type: "error", show: true });
      });
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="user-profile">
      <div className="avatar-container">
        <img
          src={newAvatar || user.avatar || "https://www.svgrepo.com/show/343494/profile-user-account.svg"}
          alt="User Avatar"
          className="avatar"
        />
      </div>
      <h1>User Profile</h1>
      <div className="info">
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      {!isEditing ? (
        <button onClick={handleEditProfile}>Edit Profile</button>
      ) : (
        <div>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      )}

      {deleteMessage && <p className="delete-message">{deleteMessage}</p>}

      {isEditing && (
        <div className="avatar-upload">
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </div>
      )}

      {isEditing && (
        <div className="avatar-upload">
          <button onClick={handleDeleteAvatar} style={{ backgroundColor: "#dc3545" }}>
            Delete Avatar
          </button>
        </div>
      )}

      {isEditing && (
        <div className="save-profile">
          <button onClick={handleSaveProfile}>Save Profile</button>
        </div>
      )}

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
