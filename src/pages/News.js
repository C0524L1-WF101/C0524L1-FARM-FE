import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import "./News.css";
import ToastNotification from "../component/ToastNotification.js";
const News = () => {
  const [notifications, setNotifications] = useState([]);
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [action, setAction] = useState("");
  const [toast, setToast] = useState({ message: "", type: "", show: false });

  const showToast = (message, type) => {
    setToast({ message, type, show: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  useEffect(() => {
    fetch("http://localhost:3000/notifications")
      .then((response) => response.json())
      .then((data) => setNotifications(data))
      .catch((error) => console.error("Error loading data:", error));
  }, []);

  const addNotification = () => {
    if (!content.trim()) {
      alert("Content cannot be empty!");
      return;
    }

    const newNotification = {
      content,
      date: new Date().toISOString(),
    };

    fetch("http://localhost:3000/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNotification),
    })
      .then((response) => response.json())
      .then((data) => {
        setNotifications([...notifications, data]);
        setContent("");
        showToast("Khởi tạo Thành Công", "success");
      })
      .catch((error) => console.error("Error adding notification:", error));
    showToast("Lỗi khi lưu người dùng", "error");
  };

  const editNotification = () => {
    if (!content.trim()) {
      alert("Content cannot be empty!");
      return;
    }

    const updatedNotification = {
      content,
      date: new Date().toISOString(),
    };

    fetch(`http://localhost:3000/notifications/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedNotification),
    })
      .then((response) => response.json())
      .then((data) => {
        setNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === editingId
              ? { ...notification, ...data }
              : notification
          )
        );
        setShowEditModal(false);
        setEditingId(null);
        setContent("");
        showToast("Cập Nhật Thành Công", "success");
      })
      .catch((error) => console.error("Error editing notification:", error));
  };

  const deleteNotification = () => {
    fetch(`http://localhost:3000/notifications/${notificationToDelete}`, {
      method: "DELETE",
    })
      .then(() => {
        setNotifications(
          notifications.filter(
            (notification) => notification.id !== notificationToDelete
          )
        );
        setShowDeleteModal(false);
        setNotificationToDelete(null);
        showToast("Xóa Thành Công", "success");
      })
      .catch((error) => console.error("Error deleting notification:", error));
    showToast("Lỗi khi xóa nhân viên", "error");
  };

  const handleModalConfirm = (action) => {
    if (action === "add") addNotification();
    else if (action === "edit") editNotification();
    else if (action === "delete") deleteNotification();

    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  return (
    <div className="news-home-container">
      <h1 className="news-home-header">Quản lý thông báo</h1>
      <textarea
        className="news-home-textarea"
        placeholder="Nhập nội dung thông báo"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        className="btn-add-notification"
        onClick={() => {
          setAction("add");
          setShowAddModal(true);
        }}
      >
        Thêm Thông báo mới
      </button>

      <div className="notification-list">
        {notifications.map((notification) => (
          <div key={notification.id} className="notification-item">
            <p>{notification.content}</p>
            <small>
              Đăng vào: {new Date(notification.date).toLocaleString()}
            </small>
            <button
              className="btn-edit-notification"
              onClick={() => {
                setEditingId(notification.id);
                setContent(notification.content);
                setAction("edit");
                setShowEditModal(true);
              }}
            >
              Sửa
            </button>
            <button
              className="btn-delete-notification"
              onClick={() => {
                setNotificationToDelete(notification.id);
                setAction("delete");
                setShowDeleteModal(true);
              }}
            >
              Xóa
            </button>
          </div>
        ))}
      </div>
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
  <Modal.Header className="modal-header-custom" closeButton>
    <Modal.Title>Xác nhận Thêm Thông báo</Modal.Title>
  </Modal.Header>
  <Modal.Body className="modal-body-custom">
    Bạn có chắc chắn muốn thêm thông báo này không?
  </Modal.Body>
  <Modal.Footer className="modal-footer-custom">
    <Button className="button-secondary" onClick={() => setShowAddModal(false)}>
      Hủy
    </Button>
    <Button className="button-primary" onClick={() => handleModalConfirm("add")}>
      Thêm Thông báo
    </Button>
  </Modal.Footer>
</Modal>

<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header className="modal-header-custom" closeButton>
    <Modal.Title>Xác nhận chỉnh sửa thông báo</Modal.Title>
  </Modal.Header>
  <Modal.Body className="modal-body-custom">
    <textarea
      className="news-home-textarea"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  </Modal.Body>
  <Modal.Footer className="modal-footer-custom">
    <Button className="button-secondary" onClick={() => setShowEditModal(false)}>
      Hủy
    </Button>
    <Button className="button-primary" onClick={() => handleModalConfirm("edit")}>
      Cập Nhật Thông Báo
    </Button>
  </Modal.Footer>
</Modal>

<Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
  <Modal.Header className="modal-header-custom" closeButton>
    <Modal.Title>Xác nhận xóa thông báo</Modal.Title>
  </Modal.Header>
  <Modal.Body className="modal-body-custom">
    Bạn có chắc chắn muốn xóa thông báo này không?
  </Modal.Body>
  <Modal.Footer className="modal-footer-custom">
    <Button className="button-secondary" onClick={() => setShowDeleteModal(false)}>
      Hủy
    </Button>
    <Button className="button-danger" onClick={() => handleModalConfirm("delete")}>
      Xóa Thông Báo
    </Button>
  </Modal.Footer>
</Modal>


      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default News;
