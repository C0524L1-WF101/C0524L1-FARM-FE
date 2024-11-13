import React, { useState, useEffect } from "react";
import { userAPI } from "../services/api.js";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import ToastNotification from '../component/ToastNotification.js';
const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '', show: false });
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
      .test("id","Mã nhân viên đã tồn tại " ,(value)=>{
        if(!value )return true;
        if(!Array.isArray(staff)){
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
    avatar: Yup.string().required("Ảnh đại diện là bắt buộc."),
    username: Yup.string().required("Tên tài khoản là bắt buộc."),
    email: Yup.string()
      .email("Email không hợp lệ.")
      .required("Email là bắt buộc."),
    dob: Yup.date().required("Ngày sinh là bắt buộc."),
    gender: Yup.string().required("Giới tính là bắt buộc."),
    idNumber: Yup.string().required("Số CMND là bắt buộc."),
  });

  const handleSubmit = async (values) => {
    try {
      if (selectedStaff) {
        await userAPI.updateUser(selectedStaff.id, values);
        showToast("Cập Nhật Thành Công", "success");
      } else {
        await userAPI.createUser(values);
        showToast("Khởi tạo Thành Công", "success");
       
      }
      fetchStaff();
      setIsAdding(false);
      setSelectedStaff(null);
      
    } catch (error) {
      showToast("Lỗi khi lưu người dùng", "error");
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setSelectedStaff(null);
  
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
  };

  return (
    <div>
      <h1 style={{ color: "#ff8c00", fontSize: "42px" ,   textShadow: "0px 4px 8px rgba(0,0,0,0.2)", marginBottom:'30px'}}>Staff</h1>
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
                    marginRight: "20px",
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
                  <h3 style={{ fontSize: "18px", margin: "10px 0 10px" }}>
                    {item.name}
                  </h3>
                  <p
                    style={{ fontSize: "14px", color: "#666", margin: "8px 0" }}
                  >
                    Mã NV: {item.id}
                  </p>
                  <p
                    style={{ fontSize: "14px", color: "#666", margin: "8px 0" }}
                  >
                    UserName: {item.username}
                  </p>
                  <p
                    style={{ fontSize: "14px", color: "#666", margin: "8px 0" }}
                  >
                    Email: {item.email}
                  </p>
                  <p
                    style={{ fontSize: "14px", color: "#666", margin: "8px 0" }}
                  >
                    DoB: {item.dob}
                  </p>
                  <p
                    style={{ fontSize: "14px", color: "#666", margin: "8px 0" }}
                  >
                    Giới tính: {item.gender}
                  </p>
                  <p
                    style={{ fontSize: "14px", color: "#666", margin: "8px 0" }}
                  >
                    CMND: {item.idNumber}
                  </p>
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
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "15px",
            backgroundColor: "#dcdcdc",
            width: "970px",
          }}
        >
          <h3 style={{ marginBottom: "20px", color: "#ff8c00" }}>
            {selectedStaff ? "Chỉnh sửa Nhân Viên" : "Thêm Nhân Viên Mới"}
          </h3>
          <Formik
            initialValues={{
              id: selectedStaff ? selectedStaff.id : "",
              name: selectedStaff ? selectedStaff.name : "",
              avatar: selectedStaff ? selectedStaff.avatar : "",
              username: selectedStaff ? selectedStaff.username : "",
              email: selectedStaff ? selectedStaff.email : "",
              dob: selectedStaff ? selectedStaff.dob : "",
              gender: selectedStaff ? selectedStaff.gender : "",
              idNumber: selectedStaff ? selectedStaff.idNumber : "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            
              <Form>
                <Field
                  type="text"
                  name="id"
                  placeholder="Mã"
                  style={{
                    padding: "8px",
                    width: "900px",
                    marginBottom: "25px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
                <ErrorMessage
                  name="id"
                  component="div"
                  style={{ color: "red" }}
                />

                <Field
                  type="text"
                  name="name"
                  placeholder="Họ và tên"
                  style={{
                    padding: "8px",
                    width: "900px",
                    marginBottom: "25px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  style={{ color: "red" }}
                />

                <Field
                  type="text"
                  name="avatar"
                  placeholder="Ảnh đại diện"
                  style={{
                    padding: "8px",
                    width: "900px",
                    marginBottom: "25px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
                <ErrorMessage
                  name="avatar"
                  component="div"
                  style={{ color: "red" }}
                />

                <Field
                  type="text"
                  name="username"
                  placeholder="Tên tài khoản"
                  style={{
                    padding: "8px",
                    width: "900px",
                    marginBottom: "25px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
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
                    padding: "8px",
                    width: "900px",
                    marginBottom: "25px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
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
                    padding: "8px",
                    width: "900px",
                    marginBottom: "25px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
                <ErrorMessage
                  name="dob"
                  component="div"
                  style={{ color: "red" }}
                />

                <Field
                  as="select"
                  name="gender"
                  style={{
                    padding: "8px",
                    width: "900px",
                    marginBottom: "25px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
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
                    padding: "8px",
                    width: "900px",
                    marginBottom: "25px",
                    borderRadius: "5px",
                    border: "1px solid #ddd",
                  }}
                />
                <ErrorMessage
                  name="idNumber"
                  component="div"
                  style={{ color: "red" }}
                />

                <button
                  type="submit"
                  style={{
                    padding: "8px 15px",
                    marginTop: "10px",
                    backgroundColor: "#ff8c00",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  {selectedStaff ? "Cập nhật" : "Thêm mới"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    padding: "8px 15px",
                    marginTop: "10px",
                    marginLeft: "10px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Hủy
                </button>
              </Form>
            
          </Formik>
        </div>
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
