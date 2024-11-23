import React, { useState, useEffect } from "react";
import { userAPI } from "../services/api.js";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ToastNotification from "../component/ToastNotification.js";
import { Modal, Button } from "react-bootstrap";

const Staff = () => {
  const [newAvatar, setNewAvatar] = useState(null);
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "", show: false });
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
  const showToast = (message, type) => {
    setToast({ message, type, show: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const users = await userAPI.getAllUsers();
      setStaff(users);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    }
  };

  const handleAdd = () => {
    setSelectedStaff(null);
    setShowModal(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = staff.filter(
    (staff) =>
      staff.name && staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const validationSchema = Yup.object({
    id: Yup.string()
      .required("Mã nhân viên là bắt buộc.")
      .matches(/^NV\d{3}$/, "Mã Nhân Viên phải có dạng NV001, NV002,...")
      .test("id", "Mã nhân viên đã tồn tại ", (value) => {
        if (!value) return true;
        if (!Array.isArray(staff)) {
          return true;
        }
        return !staff.some(
          (staffMember) =>
            staffMember.id &&
            staffMember.id.toLowerCase() === value.toLowerCase() &&
            (!selectedStaff || staffMember.id !== selectedStaff.id)
        );
      }),

    name: Yup.string()
      .required("Tên là bắt buộc.")
      .test("name", "Tên nhân viên đã tồn tại.", (value) => {
        if (!value) return true;
        if (!Array.isArray(staff)) {
          return true;
        }

        return !staff.some(
          (staffMember) =>
            staffMember.name &&
            staffMember.name.toLowerCase() === value.toLowerCase() &&
            (!selectedStaff || staffMember.id !== selectedStaff.id)
        );
      }),

    username: Yup.string().required("Tên tài khoản là bắt buộc."),
    email: Yup.string()
      .email("Email không hợp lệ.")
      .required("Email là bắt buộc."),
    dob: Yup.date().required("Ngày sinh là bắt buộc."),
    gender: Yup.string().required("Giới tính là bắt buộc."),
    idNumber: Yup.string().required("Số CMND là bắt buộc."),
    password: Yup.string().required("Mật Khẩu là bắt buộc."),
    wage: Yup.string().required("Nhập Lương là bắt buộc."),
  });

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("id", values.id);
      formData.append("name", values.name);
      if (newAvatar) {
        formData.append("avatar", newAvatar);
      }
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("dob", values.dob);
      formData.append("gender", values.gender);
      formData.append("idNumber", values.idNumber);
      formData.append("password", values.password);
      formData.append("wage", values.wage);
      formData.append("role", values.role);

      if (selectedStaff) {
        await userAPI.updateUser(selectedStaff.id, formData);
        showToast("Cập Nhật Thành Công", "success");
      } else {
        await userAPI.createUser(formData);
        showToast("Khởi tạo Thành Công", "success");
      }
      fetchStaff(); // Reload the staff list
      setSelectedStaff(null); // Reset selected staff
      setNewAvatar(null); // Reset avatar
      setShowModal(false);
    } catch (error) {
      showToast("Lỗi khi lưu người dùng", "error");
    }
  };
  const handleCancel = () => {
    setSelectedStaff(null);
    setNewAvatar(null);
    setShowModal(false);
  };
  const handleDeleteConfirm = (id) => {
    setDeleteModal({ show: true, id });
  };

  const handleDelete = async (id) => {
    try {
      await userAPI.deleteUser(id);
      showToast("Xóa Thành Công", "success");
      fetchStaff(); // Reload danh sách nhân viên
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      showToast("Lỗi khi xóa nhân viên", "error");
    } finally {
      setDeleteModal({ show: false, id: null }); // Đóng modal sau khi xử lý xong
    }
  };

  const handleEdit = (data) => {
    setSelectedStaff(data);
    setNewAvatar(data.avatar);
    setShowModal(true);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewAvatar(reader.result); // Lưu URL của ảnh để hiển thị
      };
      reader.readAsDataURL(file); // Đọc file dưới dạng URL
    } else {
      setNewAvatar(null); // Đảm bảo reset avatar nếu không có file nào được chọn
    }
  };
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  return (
    <div className="container">
      <div
        style={{
          color: "#007bff",
          textShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          marginBottom: "10px",
        }}
      >
        <b style={{ fontSize: "35px", marginRight: "50%" }}>
          {" "}
          Quản Lý Nhân Viên
        </b>
        <input
          type="text"
          placeholder="Tìm Kiếm"
          value={searchTerm}
          onChange={handleSearch}
          style={{
            padding: "8px",
            width: "23%",
            color: "black",
            borderRadius: "4px",
            border: "1px solid #ddd",
            height: "35px",
          }}
        />
      </div>

      <>
        <div>
          <button
            className="btn-add-staff"
            onClick={handleAdd}
            style={{
              width: "200px",
              padding: "8px 10px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Thêm Nhân Viên Mới
          </button>

          <div
            style={{
              display: "grid", // Sử dụng grid layout
              gridTemplateColumns: "repeat(3, 1fr)", // Chia thành 3 cột bằng nhau
              gap: "20px", // Khoảng cách giữa các thẻ nhân viên
              marginTop: "20px",
              marginLeft: "5px",
            }}
          >
            {filteredUsers.map((item) => (
              <div
                key={item.id}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  padding: "20px",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.5)",
                  backgroundColor: "#ffffff",
                  marginBottom: "20px",
                  display: "flex", // Dùng flex để chia thành hai cột
                  gap: "15px", // Khoảng cách giữa hai cột
                }}
              >
                <div
                  style={{
                    flex: "0 0 25%", // Chiếm 30% chiều rộng của thẻ
                    textAlign: "center", // Căn giữa ảnh và tên
                  }}
                >
                  <img
                    src={item.avatar}
                    alt={`${item.name}'s Avatar`}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      
                    }}
                  />
                </div>
                <div
                  style={{
                    flex: "1",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between", // Canh giữa các phần
                    textAlign: "center", // Căn giữa text
                    paddingTop: "10px",
                    paddingRight: "5px",
                  }}
                >
                  <h5 style={{ color: "#007bff", marginBottom: "10px" }}>
                    {item.name}
                  </h5>
                  <p style={{ color: "black" }}>
                    <strong>Chức Vụ:</strong> {item.role}
                  </p>
                  <p>
                    <strong>Ngày Sinh:</strong>{" "}
                    {formatDate(item.dob)}
                  </p>
                  <p style={{ color: "black" }}>
                    <strong> Username:</strong> {item.username}
                  </p>
                  <p style={{ color: "black" }}>
                    <strong>Giới tính:</strong> {item.gender}
                  </p>
                  <p style={{ color: "black" }}>
                    <strong>CMND:</strong> {item.idNumber}
                  </p>
                  <p style={{ color: "black" }}>
                    <strong> Lương:</strong> {item.wage} VNĐ
                  </p>
                 
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                      className="btn-edit-staff"
                      onClick={() => handleEdit(item)}
                      style={{
                        backgroundColor: "#4CAF50", // Màu xanh lá
                        color: "white",
                        padding: "10px 15px",
                        borderRadius: "5px",
                        margin: "0 5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Chỉnh Sửa
                    </button>
                    <button
                      onClick={() => handleDeleteConfirm(item.id)}
                      style={{
                        backgroundColor: "#f44336", // Màu đỏ
                        color: "white",
                        padding: "10px 15px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedStaff ? "Cập nhật Nhân Viên" : "Thêm Nhân Viên"}
            </Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              id: selectedStaff ? selectedStaff.id : "",
              name: selectedStaff ? selectedStaff.name : "",
              username: selectedStaff ? selectedStaff.username : "",
              email: selectedStaff ? selectedStaff.email : "",
              dob: selectedStaff ? selectedStaff.dob : "",
              gender: selectedStaff ? selectedStaff.gender : "",
              idNumber: selectedStaff ? selectedStaff.idNumber : "",
              password: selectedStaff ? selectedStaff.password : "",
              wage: selectedStaff ? selectedStaff.wage : "",
              role: selectedStaff ? selectedStaff.role : "staff",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ setFieldValue, values }) => (
              <Form encType="multipart/form-data">
                <Modal.Body>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <label htmlFor="avatar">
                      <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{
                          display: "none",
                        }}
                      />
                      <img
                        src={newAvatar || "/default-avatar.png"}
                        alt="avatar"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    </label>
                  </div>

                  <div className="form-group">
                    <label>Mã Nhân Viên</label>
                    <Field
                      type="text"
                      className="form-control"
                      name="id"
                    />
                    <ErrorMessage
                      name="id"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tên</label>
                    <Field
                      type="text"
                      className="form-control"
                      name="name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tên Tài Khoản</label>
                    <Field
                      type="text"
                      className="form-control"
                      name="username"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>
                    <Field
                      type="email"
                      className="form-control"
                      name="email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Ngày Sinh</label>
                    <Field
                      type="date"
                      className="form-control"
                      name="dob"
                    />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Giới Tính</label>
                    <Field as="select" className="form-control" name="gender">
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Số CMND</label>
                    <Field
                      type="text"
                      className="form-control"
                      name="idNumber"
                    />
                    <ErrorMessage
                      name="idNumber"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Mật Khẩu</label>
                    <Field
                      type="password"
                      className="form-control"
                      name="password"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Lương</label>
                    <Field
                      type="text"
                      className="form-control"
                      name="wage"
                    />
                    <ErrorMessage
                      name="wage"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="form-group">
                    <label>Chức Vụ</label>
                    <Field as="select" className="form-control" name="role">
                      <option value="staff">Nhân viên</option>
                      <option value="admin">Quản trị viên</option>
                    </Field>
                  </div>
                </Modal.Body>

                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCancel}>
                    Hủy
                  </Button>
                  <Button type="submit" variant="primary">
                    {selectedStaff ? "Cập nhật" : "Thêm"}
                  </Button>
                </Modal.Footer>
              </Form>
            )}
          </Formik>
        </Modal>

        <Modal
          show={deleteModal.show}
          onHide={() => setDeleteModal({ show: false, id: null })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Xóa Nhân Viên</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Bạn có chắc chắn muốn xóa nhân viên này không?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setDeleteModal({ show: false, id: null })}>
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(deleteModal.id)}
            >
              Xóa
            </Button>
          </Modal.Footer>
        </Modal>
      </>
      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={handleCloseToast}
      />
    </div>
  );
};

export default Staff;
