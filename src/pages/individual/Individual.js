import React, { useEffect, useState } from "react";
import { pigAPI, barnAPI } from '../../services/api';
import { Button, Modal, Form } from "react-bootstrap";
import ToastNotification from '../../component/ToastNotification';
import { useFormik } from "formik";
import * as Yup from "yup";
import './Individual.css'


const Individual = () => {
  const [pigs, setPigs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [barns, setBarns] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    nameBarn: "",
    createdAt: "",
    closeAt: "",
    status: "",
    weight: "",
  });
  const [editingPig, setEditingPig] = useState(null);
  const [selectedPig, setSelectedPig] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPigs();
    fetchBarns();
  }, []);

  const fetchBarns = async () => {
    try {
      const data = await barnAPI.getAllBarns();
      setBarns(data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách chuồng:", error);
    }
  };

  const fetchPigs = async () => {
    try {
      const data = await pigAPI.getAllPigs();
      const sortedPigs = data.sort((a, b) => {
        const numA = parseInt(a.name.match(/\d+/)[0]);
        const numB = parseInt(b.name.match(/\d+/)[0]); 
        return numA - numB; 
      });
      setPigs(sortedPigs);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách lợn:", error);
    }
  };

  const handleShowModal = (pig = null) => {
    if (pig) {
      setEditingPig(pig);
      formik.setValues({
        name: pig.name || "",
        nameBarn: pig.nameBarn || "",
        createdAt: pig.createdAt || "",
        closeAt: pig.closeAt || "",
        status: pig.status || "",
        weight: pig.weight || "",
      });
    } else {
      setEditingPig(null);
      formik.resetForm(); // Reset form về giá trị ban đầu
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowConfirmDelete = () => {
    if (!selectedPig) {
      setToast({ show: true, message: "Bạn chưa chọn cá thể nào", type: "error" });
      return;
    }
    setShowConfirmDelete(true);
  };

  const handleCloseConfirmDelete = () => {
    setShowConfirmDelete(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const filteredPigs = pigs.filter(
    (pig) =>
      pig.name.toLowerCase().includes(search.toLowerCase()) ||
      pig.nameBarn.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => {
    const numA = parseInt(a.name.match(/\d+/)[0]);
    const numB = parseInt(b.name.match(/\d+/)[0]);
    return numA - numB;
  });

  const handleSubmit = async () => {
    try {
      if (editingPig) {
        await pigAPI.updatePig(editingPig.id, formData);
        setToast({ show: true, message: "Cập nhật thành công!", type: "success" });
      } else {
        await pigAPI.createPig(formData);
        setToast({ show: true, message: "Thêm mới thành công!", type: "success" });
      }
      fetchPigs();
      handleCloseModal();
    } catch (error) {
      setToast({ show: true, message: "Lỗi khi lưu thông tin!", type: "error" });
      console.error("Lỗi khi lưu thông tin:", error);
    }
  };

  const handleDelete = async () => {
    if (!selectedPig) {
      setToast({ show: true, message: "Bạn chưa chọn cá thể nào", type: "error" });
      return;
    }
    try {
      await pigAPI.deletePig(selectedPig.id);
      fetchPigs();
      setToast({ show: true, message: "Xóa thành công!", type: "success" });
      setSelectedPig(null);
    } catch (error) {
      setToast({ show: true, message: "Lỗi khi xóa lợn!", type: "error" });
      console.error("Lỗi khi xóa lợn:", error);
    }
    handleCloseConfirmDelete();
  };

  const handleEdit = () => {
    if (!selectedPig) {
      setToast({ show: true, message: "Bạn chưa chọn cá thể nào", type: "error" });
      return;
    }
    formik.setValues({
      name: selectedPig.name || "",
      nameBarn: selectedPig.nameBarn || "",
      createdAt: selectedPig.createdAt || "",
      closeAt: selectedPig.closeAt || "",
      status: selectedPig.status || "",
      weight: selectedPig.weight || "",
    });
    setEditingPig(selectedPig);
    setShowModal(true);
  };

  const handleRowClick = (pig) => {
    setSelectedPig(pig);
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, show: false }));
  };

  const validationSchema = Yup.object({
  name: Yup.string()
    .matches(/^L\d{3}$/, "Tên phải theo định dạng L001, L002, ...")
    .required("Tên là bắt buộc")
    .test(
      "unique-name",
      "Tên đã tồn tại, vui lòng nhập tên khác",
      function (value) {
        if (editingPig && editingPig.name === value) {
          // Không kiểm tra nếu tên không thay đổi
          return true;
        }
        return !pigs.some((pig) => pig.name === value);
      }
    ),
  nameBarn: Yup.string().required("Chuồng là bắt buộc"),
  createdAt: Yup.date().required("Ngày nuôi là bắt buộc"),
  closeAt: Yup.date(),
  status: Yup.string().required("Trạng thái là bắt buộc"),
  weight: Yup.number()
    .typeError("Cân nặng phải là số")
    .positive("Cân nặng phải lớn hơn 0")
    .required("Cân nặng là bắt buộc"),
});

  
  const formik = useFormik({
    initialValues: {
      name: "",
      nameBarn: "",
      createdAt: "",
      closeAt: "",
      status: "",
      weight: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (editingPig) {
          await pigAPI.updatePig(editingPig.id, values);
          setToast({ show: true, message: "Cập nhật thành công!", type: "success" });
        } else {
          await pigAPI.createPig(values);
          setToast({ show: true, message: "Thêm mới thành công!", type: "success" });
        }
        fetchPigs();
        handleCloseModal();
      } catch (error) {
        setToast({ show: true, message: "Lỗi khi lưu thông tin lợn!", type: "error" });
        console.error("Lỗi khi lưu thông tin lợn:", error);
      }
    },
  });

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className=" title-container">Quản Lý Cá Thể</h2>
        <Form.Control
          type="text"
          placeholder="Tìm theo tên hoặc chuồng"
          value={search}
          onChange={handleSearchChange}
          style={{ width: "300px" }}
        />
      </div>

      <div className="table-responsive shadow">
        <table className="table table-bordered table-hover custom-table">
          <thead>
            <tr>
              <th>Tên</th>
              <th>Chuồng</th>
              <th>Ngày nhập chuồng</th>
              <th>Ngày xuất chuồng</th>
              <th>Trạng thái</th>
              <th>Cân nặng (Kg)</th>
            </tr>
          </thead>
          <tbody>
            {filteredPigs.map((pig, index) => (
              <tr
                key={pig.id}
                onClick={() => handleRowClick(pig)}
                className={`table-row ${selectedPig?.id === pig.id ? 'table-active' : ''}`}
                style={{
                  cursor: "pointer",
                }}
              >
                <td>{pig.name}</td>
                <td>{pig.nameBarn}</td>
                <td>{new Date(pig.createdAt).toLocaleDateString('vi-VN')}</td>
                <td>{pig.closeAt ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(pig.closeAt)) : 'Đang trong chuồng'}</td>
                <td>{pig.status}</td>
                <td>{pig.weight}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-5">
        <Button variant="primary" className="me-3-shadow" onClick={() => handleShowModal()}>
          Thêm mới
        </Button>
        <Button variant="warning" className="me-3-shadow" onClick={handleEdit}>
          Chỉnh Sửa
        </Button>
        <Button variant="danger"   className="me-3-shadow" onClick={handleShowConfirmDelete}>
          Xóa
        </Button>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingPig ? "Chỉnh sửa lợn" : "Thêm mới"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={formik.handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Chuồng</Form.Label>
              <Form.Control
                as="select"
                name="nameBarn"
                value={formik.values.nameBarn}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.nameBarn}
              >
                <option value="">Chọn chuồng</option>
                {barns.map((barn) => (
                  <option key={barn.id} value={barn.name}>
                    {barn.name}
                  </option>
                ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.nameBarn}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày nuôi</Form.Label>
              <Form.Control
                type="date"
                name="createdAt"
                value={formik.values.createdAt}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.createdAt}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.createdAt}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày xuất</Form.Label>
              <Form.Control
                type="date"
                name="closeAt"
                value={formik.values.closeAt}
                onChange={formik.handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.status}
              >
                <option value="">Chọn trạng thái</option>
                <option value="Khỏe mạnh">Khỏe mạnh</option>
                <option value="Yếu">Yếu</option>
                <option value="Cần chăm sóc">Cần chăm sóc</option>
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                {formik.errors.status}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cân nặng</Form.Label>
              <Form.Control
                type="text"
                name="weight"
                value={formik.values.weight}
                onChange={formik.handleChange}
                isInvalid={!!formik.errors.weight}
              />
              <Form.Control.Feedback type="invalid">
                {formik.errors.weight}
              </Form.Control.Feedback>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" className="shadow" onClick={handleCloseModal}>
                Hủy bỏ
              </Button>
              <Button variant="primary" className="shadow" type="submit">
                Lưu
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>


      <Modal show={showConfirmDelete} onHide={handleCloseConfirmDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa cá thể <strong>{selectedPig?.name}</strong> không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmDelete}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastNotification
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={handleToastClose}
      />
    </div>
  );
};

export default Individual;

