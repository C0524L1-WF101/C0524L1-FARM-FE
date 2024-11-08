import React, { useState } from "react";

const Staff = () => {
  const initialStaff = [
    {
      id: "NV001",
      name: "Nguyen Van A",
      username: "nguyenvan a",
      email: "a@email.com",
      dob: "1990-01-01",
      gender: "Nam",
      idNumber: "123456789",
    },
    {
      id: "NV002",
      name: "Tran Thi B",
      username: "tranthi b",
      email: "b@email.com",
      dob: "1992-05-12",
      gender: "Nu",
      idNumber: "987654321",
    },
  ];
  const [staff, setStaff] = useState(initialStaff);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    email: "",
    dob: "",
    gender: "",
    idNumber: "",
  });
  const filteredStaff = staff.filter((staff) =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setFormData({
      id: "",
      name: "",
      username: "",
      email: "",
      dob: "",
      gender: "",
      idNumber: "",
    });
    setSelectedStaff(null); 
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value); 
  };

  const handleSave = () => {
    if (selectedStaff) {
     
      setStaff(
        staff.map((emp) =>
          emp.id === selectedStaff.id ? formData : emp
        )
      );
      setSelectedStaff(null);
    } else {
   
      setStaff([...staff, formData]);
    }

    setFormData({
      id: "",
      name: "",
      username: "",
      email: "",
      dob: "",
      gender: "",
      idNumber: "",
    });
  };

  return (
    <div>
      <h2>Quản Lý nhân viên</h2>
      <div>
        <input
          type="text"
          placeholder="Tìm kiếm"
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
          onClick={handleAdd}
          style={{
            padding: "8px 12px",
            marginLeft: "10px",
            backgroundColor: " #1e90ff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Tìm Kiếm
        </button>

        <table
          border={1}
          style={{
            marginTop: "20px",
            marginBottom: "30px",
            width: "75%",
            height: "100px",
          }}
        >
          <thead>
            <tr style={{ textAlign: "center" }}>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Mã
              </td>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Họ và tên
              </td>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Tên tài khoản
              </td>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Email
              </td>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Ngày sinh
              </td>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Giới tính
              </td>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Số CMND
              </td>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Chỉnh sửa
              </td>
              <td
                style={{
                  padding: "8px",
                  backgroundColor: " #1e90ff",
                  color: "white",
                  border: "1px solid black",
                }}
              >
                Xóa
              </td>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((item) => (
              <tr>
                <td style={{textAlign:'center'}}>{item.id}</td>
                <td style={{textAlign:'center'}}>{item.name}</td>
                <td style={{textAlign:'center'}}>{item.username}</td>
                <td style={{textAlign:'center'}}>{item.email}</td>
                <td style={{textAlign:'center'}}>{item.dob}</td>
                <td style={{textAlign:'center'}}>{item.gender}</td>
                <td style={{textAlign:'center'}}>{item.idNumber}</td>
                <td>
                  <button
                    style={{
                      border: "none",
                      padding: "8px",
                      backgroundColor: " #1e90ff",
                      color: "white",
                      borderRadius: "10px",
                      width: "100%",
                    }}
                  >
                    Chỉnh sửa
                  </button>
                </td>
                <td>
                  <button
                    style={{
                      border: "none",
                      padding: "8px",
                      backgroundColor: " #1e90ff",
                      color: "white",
                      borderRadius: "10px",
                      width: "100%",
                    }}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "15px",
          backgroundColor: "#e6e6fa",
          width: "970px",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>
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
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
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
              backgroundColor: " #1e90ff",
              color: "white",
              borderRadius: "10px",
              width: "500px",
              marginLeft: "200px",
            }}
          >
            {selectedStaff ? "Lưu" : "Thêm"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Staff;
