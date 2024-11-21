import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './Vaccine.css';
import ToastNotification from "../../component/ToastNotification";

// Custom function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

const BASE_URL = 'http://localhost:3000/vaccinationRecords';

const Vaccine = () => {
  const [records, setRecords] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: '', show: false });
  const [searchQuery, setSearchQuery] = useState('');

  const initialValues = {
    date: '',
    nameBarn: '', // Thay "pen" thành "nameBarn"
    vaccineType: '',
    quantity: '',
    vaccineAdmin: '',
    notes: ''
  };

  const validationSchema = Yup.object({
    date: Yup.string().required('Ngày là bắt buộc'),
    nameBarn: Yup.string()
      .matches(/^C\d{2}$/, 'Mã chuồng phải đúng định dạng C01, C02, ...')
      .required('Mã chuồng là bắt buộc'),
    vaccineType: Yup.string().required('Loại vaccine là bắt buộc'),
    quantity: Yup.number()
      .typeError('Số lượng phải là số')
      .positive('Số lượng phải lớn hơn 0')
      .required('Số lượng là bắt buộc'),
    vaccineAdmin: Yup.string(),
    notes: Yup.string(),
  });

  useEffect(() => {
    axios.get(BASE_URL)
      .then(response => setRecords(response.data))
      .catch(error => console.error('Lỗi khi lấy dữ liệu:', error));
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type, show: true });
  };

  const handleCloseToast = () => {
    setToast({ ...toast, show: false });
  };

  const handleSubmit = (values, { resetForm }) => {
    if (editRecord) {
      axios.put(`${BASE_URL}/${editRecord.id}`, values)
        .then(() => {
          setRecords(records.map((record) =>
            record.id === editRecord.id ? { ...record, ...values } : record
          ));
          setShowModal(false);
          showToast("Cập nhật bản ghi thành công", "success");
        })
        .catch((error) => {
          console.error('Lỗi khi chỉnh sửa bản ghi:', error);
          showToast("Lỗi khi cập nhật bản ghi", "error");
        });
    } else {
      axios.post(BASE_URL, values)
        .then((response) => {
          setRecords([...records, response.data]);
          setShowModal(false);
          showToast("Thêm bản ghi thành công", "success");
        })
        .catch((error) => {
          console.error('Lỗi khi thêm bản ghi:', error);
          showToast("Lỗi khi thêm bản ghi", "error");
        });
    }
    resetForm();
  };

  const handleDelete = () => {
    axios.delete(`${BASE_URL}/${selectedRecordId}`)
      .then(() => {
        setRecords(records.filter((record) => record.id !== selectedRecordId));
        setShowDeleteModal(false);
        showToast("Xóa bản ghi thành công", "success");
      })
      .catch((error) => {
        console.error('Lỗi khi xóa bản ghi:', error);
        showToast("Lỗi khi xóa bản ghi", "error");
      });
  };

  const filteredRecords = records.filter((record) =>
    record.vaccineType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="vaccine-management">
      <div className="search-container">
        <h1 className='text-vaccine'>Bản Ghi Tiêm Chủng</h1>
        <input
          type="text"
          placeholder="Tìm kiếm theo loại vaccine"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="add-button-container">
        <Button variant="primary" onClick={() => {
          setShowModal(true);
          setEditRecord(null);
        }}>Thêm Mới</Button>
      </div>

      <h2>Danh Sách Tiêm Chủng</h2>
      <table>
        <thead>
          <tr>
            <th className="table-header">STT</th>
            <th className="table-header">Ngày</th>
            <th className="table-header">Mã Chuồng</th> {/* Chuyển từ Pen thành Mã Chuồng */}
            <th className="table-header">Loại Vaccine</th>
            <th className="table-header">Số Lượng</th>
            <th className="table-header">Quản lý Tiêm</th>
            <th className="table-header">Ghi Chú</th>
            <th className="table-header">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={record.id}>
              <td>{index + 1}</td>
              <td>{formatDate(record.date)}</td> {/* Hiển thị ngày */}
              <td>{record.nameBarn}</td> {/* Hiển thị Mã Chuồng */}
              <td>{record.vaccineType}</td>
              <td>{record.quantity}</td>
              <td>{record.vaccineAdmin}</td>
              <td>{record.notes}</td>
              <td>
                <button onClick={() => {
                  setEditRecord(record);
                  setShowModal(true);
                }}>Chỉnh sửa</button>
                <button onClick={() => {
                  setSelectedRecordId(record.id);
                  setShowDeleteModal(true);
                }}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editRecord ? 'Chỉnh Sửa Bản Ghi' : 'Thêm Bản Ghi Mới'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={editRecord || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group>
                  <Form.Label>Ngày:</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={values.date}
                    onChange={handleChange}
                    isInvalid={touched.date && errors.date}
                  />
                  <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Mã Chuồng:</Form.Label> {/* Chuyển từ Pen thành Mã Chuồng */}
                  <Form.Control
                    type="text"
                    name="nameBarn"
                    value={values.nameBarn}
                    onChange={handleChange}
                    isInvalid={touched.nameBarn && errors.nameBarn}
                  />
                  <Form.Control.Feedback type="invalid">{errors.nameBarn}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Loại Vaccine:</Form.Label>
                  <Form.Control
                    type="text"
                    name="vaccineType"
                    value={values.vaccineType}
                    onChange={handleChange}
                    isInvalid={touched.vaccineType && errors.vaccineType}
                  />
                  <Form.Control.Feedback type="invalid">{errors.vaccineType}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Số Lượng:</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    value={values.quantity}
                    onChange={handleChange}
                    isInvalid={touched.quantity && errors.quantity}
                  />
                  <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Quản lý Tiêm:</Form.Label>
                  <Form.Control
                    type="text"
                    name="vaccineAdmin"
                    value={values.vaccineAdmin}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Ghi Chú:</Form.Label>
                  <Form.Control
                    type="text"
                    name="notes"
                    value={values.notes}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Gửi</Button>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
              </Form>
            )}
          </Formik>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xóa Bản Ghi</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc muốn xóa bản ghi này không?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Hủy</Button>
          <Button variant="danger" onClick={handleDelete}>Xóa</Button>
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

export default Vaccine;
