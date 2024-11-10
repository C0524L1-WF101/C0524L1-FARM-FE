import React, { useState, useEffect } from "react";
import { userAPI } from "../services/api.js";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    avatar: "",
    username: "",
    email: "",
    dob: "",
    gender: "",
    avatar: "",
    idNumber: "",
  });
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

  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setFormData({
      id: "",
      name: "",
      avatar: "",
      username: "",
      email: "",
      dob: "",
      gender: "",
      idNumber: "",
    });
    setIsAdding(true);
    setSelectedStaff(null);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const filteredUsers = staff.filter(staff =>
    staff.name && staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSave = async () => {
    try {
      if (selectedStaff) {
        await userAPI.updateUser(setSelectedStaff.id, formData);
      } else {
        await userAPI.createUser(formData);
      }
      setIsAdding(false);
      fetchStaff();
      setSelectedStaff(null);
      setFormData({
        id: "",
        name: "",
        avatar: "",
        username: "",
        email: "",
        dob: "",
        gender: "",
        idNumber: "",
      });
    } catch (error) {
      console.error("Lỗi khi lưu người dùng:", error);
    }
  };
  

  const handleCancel = () => {
    setIsAdding(false);
    setFormData({
      id: "",
      name: "",
      avatar: "",
      username: "",
      email: "",
      dob: "",
      gender: "",
      idNumber: "",
    });
    setSelectedStaff(null);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa nhân viên này?"
    );
    if (confirmDelete) {
      try {
        await userAPI.deleteUser(id);
        fetchStaff();
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
      }
    }
  };
 

  return (
    <div>
      <h1 style={{ color: "#ff8c00", fontSize: "30px" }}>Quản Lý nhân viên</h1>
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
                  style={{
                    width: "300px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "20px",
                    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <input
              style={{
                padding: "8px",
                width: "900px",
                marginBottom: "25px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              type="text"
              placeholder="Mã"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              required
            />
            <input
              style={{
                padding: "8px",
                width: "900px",
                marginBottom: "25px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              type="text"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <input
              style={{
                padding: "8px",
                width: "900px",
                marginBottom: "25px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              type="text"
              placeholder="Ảnh đại diện"
              value={formData.avatar}
              onChange={(e) =>
                setFormData({ ...formData, avatar: e.target.value })
              }
              required
            />
            <input
              style={{
                padding: "8px",
                width: "900px",
                marginBottom: "25px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              type="text"
              placeholder="Tên tài khoản"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              required
            />
            <input
              style={{
                padding: "8px",
                width: "900px",
                marginBottom: "25px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <input
              style={{
                padding: "8px",
                width: "900px",
                marginBottom: "25px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              type="date"
              placeholder="Ngày sinh"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              required
            />
            <select
              style={{
                padding: "8px",
                width: "900px",
                marginBottom: "25px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              required
            >
              <option value="">Giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nu">Nữ</option>
            </select>
            <input
              style={{
                padding: "8px",
                width: "900px",
                marginBottom: "25px",
                borderRadius: "5px",
                border: "1px solid #ddd",
              }}
              type="text"
              placeholder="Số CMND"
              value={formData.idNumber}
              onChange={(e) =>
                setFormData({ ...formData, idNumber: e.target.value })
              }
              required
            />
            <button
              type="submit"
              style={{
                border: "none",
                padding: "8px",
                backgroundColor: "#ff8c00",
                color: "white",
                borderRadius: "10px",
                width: "200px",
                marginLeft: "150px",
              }}
            >
              {selectedStaff ? "Lưu" : "Thêm"}
              
            </button>
            <button
              onClick={handleCancel}
              type="submit"
              style={{
                border: "none",
                padding: "8px",
                backgroundColor: "#ff8c00",
                color: "white",
                borderRadius: "10px",
                width: "200px",
                marginLeft: "200px",
              }}
            >
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Staff;
