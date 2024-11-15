import React, { useState, useEffect } from "react";
import { userAPI } from "../services/api.js";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ToastNotification from "../component/ToastNotification.js";

const Staff = () => {
  const [newAvatar, setNewAvatar] = useState(null);
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", show: false });

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
    setIsAdding(true);
    setSelectedStaff(null);
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

      if (selectedStaff) {
        await userAPI.updateUser(selectedStaff.id, formData);
        showToast("Cập Nhật Thành Công", "success");
      } else {
        await userAPI.createUser(formData);
        showToast("Khởi tạo Thành Công", "success");
      }
      fetchStaff(); // Reload the staff list
      setIsAdding(false); // Close the form after submit
      setSelectedStaff(null); // Reset selected staff
      setNewAvatar(null); // Reset avatar
    } catch (error) {
      showToast("Lỗi khi lưu người dùng", "error");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedStaff(null);
    setNewAvatar(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa nhân viên này?"
    );
    if (confirmDelete) {
      try {
        await userAPI.deleteUser(id);
        showToast("Xóa Thành Công", "success");
        fetchStaff();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    }
  };

  const handleEdit = (data) => {
    setSelectedStaff(data);
    setIsAdding(true);
    setNewAvatar(data.avatar);
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

  return (
    <div>
      <h1
        style={{
          color: "#ff8c00",
          fontSize: "42px",
          textShadow: "0px 4px 8px rgba(0,0,0,0.2)",
          marginBottom: "30px",
        }}
      >
        Quản Lý Nhân Viên
      </h1>
      {!isAdding ? (
        <>
          <div>
            <input
              type="text"
              placeholder="Tìm Kiếm"
              value={searchTerm}
              onChange={handleSearch}
              style={{
                padding: "8px",
                width: "70%",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <button
              className="btn-add-staff"
              onClick={handleAdd}
              style={{
                width: "200px",
                padding: "8px 12px",
                marginLeft: "10px",
                backgroundColor: "#ff8c00",
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
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                marginTop: "20px",
                marginLeft: "5px",
              }}
            >
              {filteredUsers.map((item) => (
                <div
                  key={item.id}
                  style={{
                    width: "300px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.4)",
                    textAlign: "center",
                    backgroundColor: "#ffffff",
                    marginRight: "30px",
                  }}
                >
                  <img
                    src={item.avatar}
                    alt={`${item.name}'s Avatar`}
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "50%",
                      marginBottom: "15px",
                    }}
                  />

                  <h1 style={{ fontSize: "18px", margin: "10px 0 10px" }}>
                    {item.name}
                  </h1>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0 20px ",
                    }}
                  >
                    {item.role}
                  </h2>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0  20px",
                    }}
                  >
                    Mã NV: {item.id}
                  </h2>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0  20px",
                    }}
                  >
                    UserName: {item.username}
                  </h2>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0 20px",
                    }}
                  >
                    Email: {item.email}
                  </h2>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0  20px",
                    }}
                  >
                    DoB: {item.dob}
                  </h2>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0  20px",
                    }}
                  >
                    Giới tính: {item.gender}
                  </h2>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0  20px",
                    }}
                  >
                    CMND: {item.idNumber}
                  </h2>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0  20px",
                    }}
                  >
                    password: {item.password}
                  </h2>
                  <h2
                    style={{
                      fontSize: "14px",
                      color: "#666",
                      margin: "8px 0  20px",
                    }}
                  >
                    Lương: {item.wage} VNĐ
                  </h2>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      padding: "5px 15px",
                      marginRight: "10px",
                      backgroundColor: "#ff8c00",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      padding: "5px 15px",
                      backgroundColor: "#f44336",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Xóa
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
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
            role: selectedStaff?.role || "employee",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <Field
              type="text"
              name="id"
              placeholder="Mã nhân viên"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            />
            <ErrorMessage name="id" component="div" style={{ color: "red" }} />

            <Field
              type="text"
              name="name"
              placeholder="Tên"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            />
            <ErrorMessage
              name="name"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              type="text"
              name="username"
              placeholder="Tên tài khoản"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            />
            <ErrorMessage
              name="username"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              type="email"
              name="email"
              placeholder="Email"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            />
            <ErrorMessage
              name="email"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              type="date"
              name="dob"
              placeholder="Ngày sinh"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            />
            <ErrorMessage name="dob" component="div" style={{ color: "red" }} />

            <Field
              as="select"
              name="gender"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            >
              <option value="">Giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </Field>
            <ErrorMessage
              name="gender"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              type="text"
              name="idNumber"
              placeholder="Số CMND"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            />
            <ErrorMessage
              name="idNumber"
              component="div"
              style={{ color: "red" }}
            />

            <div>
              <Field
                as="select"
                name="role"
                style={{
                  padding: "8px",
                  width: "100%",
                  marginBottom: "15px",
                  borderRadius: "5px",
                  border: "1px solid #ddd",
                }}
              >
                <option value="employee">Nhân viên</option>
                <option value="admin">Quản trị viên</option>
              </Field>
              <ErrorMessage name="role" component="div" />
            </div>

            <Field
              type="password"
              name="password"
              placeholder="Mật khẩu"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            />
            <ErrorMessage
              name="password"
              component="div"
              style={{ color: "red" }}
            />

            <Field
              type="text"
              name="wage"
              placeholder="Lương"
              style={{
                padding: "10px",
                width: "100%",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "10px",
              }}
            />
            <ErrorMessage
              name="wage"
              component="div"
              style={{ color: "red" }}
            />

            <div className="avatar-input">
              <input type="file" name="avatar" onChange={handleFileChange} />
              {newAvatar && (
                <img
                  src={newAvatar}
                  alt="Avatar Preview"
                  style={{ width: "100px", height: "100px" }}
                />
              )}
            </div>

            <div>
              <button
                type="submit"
                style={{
                  backgroundColor: "#ff8c00",
                  color: "white",
                  padding: "10px 20px",
                  marginRight: "10px",
                  marginTop: "10px",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Thêm
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: "#f44336",
                  color: "white",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Hủy
              </button>
            </div>
          </Form>
        </Formik>
      )}

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
