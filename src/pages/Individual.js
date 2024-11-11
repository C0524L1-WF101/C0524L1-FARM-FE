import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import { Modal, Button, Form, Alert, Toast, ToastContainer } from 'react-bootstrap';

function BasicExample() {
  const [pigs, setPigs] = useState([]);
  const [show, setShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    date1: '',
    date2: '',
    feel: '',
    weight: '',
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchPigs();
  }, []);

  const fetchPigs = () => {
    axios.get('http://localhost:3000/pigs')
      .then((response) => setPigs(response.data))
      .catch((error) => console.error('Lỗi khi lấy dữ liệu!', error));
  };

  const handleClose = () => {
    setShow(false);
    setFormData({
      id: '',
      name: '',
      date1: '',
      date2: '',
      feel: '',
      weight: '',
    });
    setIsEdit(false);
    setError('');
  };

  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Hàm kiểm tra form
  const validateForm = () => {
    const { id, name, date1, date2, feel, weight } = formData;

    if (!id || !name || !date1 || !date2 || !feel || !weight) {
      return 'Vui lòng điền đầy đủ thông tin!';
    }

    if (isNaN(id)) {
      return 'ID phải là một số!';
    }

    if (isNaN(weight) || Number(weight) <= 0) {
      return 'Cân nặng phải là một số dương!';
    }

    if (new Date(date1) > new Date(date2)) {
      return 'Ngày nhập chuồng phải nhỏ hơn hoặc bằng ngày xuất chuồng!';
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errorMsg = validateForm();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }

    if (isEdit) {
      axios.put(`http://localhost:3000/pigs/${formData.id}`, formData)
        .then(() => {
          fetchPigs();
          handleClose();
          setToastMessage('Cập nhật thành công!');
          setShowToast(true);
        })
        .catch((error) => console.error('Lỗi khi cập nhật dữ liệu!', error));
    } else {
      axios.post('http://localhost:3000/pigs', formData)
        .then(() => {
          fetchPigs();
          handleClose();
          setToastMessage('Thêm mới thành công!');
          setShowToast(true);
        })
        .catch((error) => console.error('Lỗi khi thêm dữ liệu!', error));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa không?')) {
      axios.delete(`http://localhost:3000/pigs/${id}`)
        .then(() => {
          fetchPigs();
          setToastMessage('Xóa thành công!');
          setShowToast(true);
        })
        .catch((error) => console.error('Lỗi khi xóa dữ liệu!', error));
    }
  };

  const handleEdit = (pig) => {
    setFormData(pig);
    setIsEdit(true);
    handleShow();
  };

  // Hàm tìm kiếm
  const handleSearch = () => {
    const filteredPigs = pigs.filter((pig) =>
      pig.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pig.feel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pig.weight.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setPigs(filteredPigs);
  };

  return (
    <>
      <h2 className="text-center mb-4">Quản Lý Cá Thể</h2>

      {/* Search Input and Button */}
      <div className="input-group mb-3">
  <Form.Control
    type="text"
    placeholder="Tìm kiếm..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="form-control" // Adds Bootstrap styling
  />
  <Button 
    variant="primary"  // Makes the button blue
    onClick={handleSearch} 
    className="input-group-text" // Matches the input group style
  >
    Tìm kiếm
  </Button>
</div>


      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã chuồng nuôi</th>
            <th>Ngày nhập chuồng</th>
            <th>Ngày xuất chuồng</th>
            <th>Tình trạng</th>
            <th>Cân nặng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {pigs.map((pig) => (
            <tr key={pig.id}>
              <td>{pig.id}</td>
              <td>{pig.name}</td>
              <td>{pig.date1}</td>
              <td>{pig.date2}</td>
              <td>{pig.feel}</td>
              <td>{pig.weight}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(pig)}>Sửa</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(pig.id)}>Xóa</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button variant="primary" onClick={handleShow}>
        Thêm Mới
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? 'Chỉnh Sửa' : 'Thêm Mới'} Thông Tin Heo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập ID"
                name="id"
                value={formData.id}
                onChange={handleChange}
                disabled={isEdit}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mã chuồng nuôi</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập mã chuồng nuôi"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày nhập chuồng</Form.Label>
              <Form.Control
                type="date"
                name="date1"
                value={formData.date1}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Ngày xuất chuồng</Form.Label>
              <Form.Control
                type="date"
                name="date2"
                value={formData.date2}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Tình trạng</Form.Label>
              <Form.Control
                as="select"
                name="feel"
                value={formData.feel}
                onChange={handleChange}
                required
              >
                <option value="Tình trạng">Khỏe mạnh</option>
                <option value="Khỏe mạnh">Khỏe mạnh</option>
                <option value="Bệnh tật">Bệnh tật</option>
                <option value="Cần chăm sóc">Cần chăm sóc</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cân nặng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập cân nặng"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isEdit ? 'Cập Nhật' : 'Thêm Mới'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer className="toast-container">
  <Toast
    show={showToast}
    onClose={() => setShowToast(false)}
    delay={3000}
    autohide
    className="toast"
  >
    <Toast.Header>
      <strong className="me-auto">Thông báo</strong>
    </Toast.Header>
    <Toast.Body 
      className={toastMessage.includes('thành công') ? 'bg-success text-white' : 'bg-danger text-white'}
    >
      {toastMessage}
    </Toast.Body>
  </Toast>
</ToastContainer>

    </>
  );
}

export default BasicExample;
