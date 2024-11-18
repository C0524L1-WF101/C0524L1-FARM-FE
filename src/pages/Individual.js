import React, { useEffect, useState } from 'react';
import { pigAPI } from '../services/api';
import { Modal, Button, Form } from 'react-bootstrap';
import ToastNotification from '../component/ToastNotification';
//\import '../barn/Barn.css';
import { v4 as uuidv4 } from 'uuid';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Pig = () => {
    const [pigs, setPigs] = useState([]);
    const [filteredPigs, setFilteredPigs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', show: false });
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [selectedPig, setSelectedPig] = useState(null);

    useEffect(() => {
        fetchPigs();
    }, []);

    const fetchPigs = async () => {
        try {
            const data = await pigAPI.getAllPigs();
            setPigs(data);
            setFilteredPigs(data);
        } catch (error) {
            showToast("Lỗi khi lấy danh sách lợn", "error");
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm, pigs]);

    const handleSearch = () => {
        const filtered = pigs.filter(pig =>
            (pig.id && pig.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (pig.name && pig.name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredPigs(filtered);
    };


    const handleSearchInputChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const showToast = (message, type) => {
        setToast({ message, type, show: true });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, show: false });
    };

    const handleShowModal = (pig = null) => {
        if (pig) {
            setEditMode(true);
            formik.setValues(pig);
        } else {
            setEditMode(false);
            formik.resetForm();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        formik.resetForm();
        setSelectedPig(null);
    };

    const handleRowClick = (pig) => {
        setSelectedPig(pig);
    };

    const handleShowDeleteModal = () => {
        if (!selectedPig) {
            showToast("Bạn chưa chọn cá thế", "error");
            return;
        }
        setDeleteModal({ show: true, id: selectedPig.id });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({ show: false, id: null });
    };

    const handleConfirmDelete = async () => {
        try {
            await pigAPI.deletePig(deleteModal.id);
            fetchPigs();
            showToast("Xóa cá thể thành công", "success");
            setSelectedPig(null);
        } catch (error) {
            showToast("Lỗi khi xóa cá thể", "error");
        } finally {
            handleCloseDeleteModal();
        }
    };

    const validationSchema = Yup.object({
        id: Yup.string()
            .required("Mã Cá thể là bắt buộc")
            .matches(/^L\d{2}$/, "Mã Nhân Viên phải có dạng L01, L02,..."),
        name: Yup.string()
            .required("Mã Chuồng Nuôi là bắt buộc")
            .matches(/^C\d{2}$/, "Mã Chuồng Nuôi phải có dạng C01, C02,...")
            .test(
                "unique-name",
                "Mã chuồng nuôi đã bị trùng !",
                (value) => editMode || !pigs.some((pig) => pig.name === value)
            ),

        createdAt: Yup.date().required("Ngày Tạo Chuồng là bắt buộc"),
        Weight: Yup.number()
            .required("Cân Nặng Cá Thể là bắt buộc")
            .positive("Cân Nặng Cá Thể phải lớn hơn 0")
            .integer("Cân Nặng Cá Thể phải là số nguyên"),
    });

    const formik = useFormik({
        initialValues: {
            id: '',
            name: '',
            createdAt: '',
            closeAt: '',
            feel: '',
            weight: ''
        },
        
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (editMode) {
                    await pigAPI.updatePig(values.id, values);
                    showToast("Chỉnh sửa thành công", "success");
                } else {
                    const newPig = { id: uuidv4(), ...values };
                    await pigAPI.createPig(newPig);
                    showToast("Khởi tạo thành công", "success");
                }
                fetchPigs();
                handleCloseModal();
            } catch (error) {
                showToast("Lỗi khi lưu chuồng nuôi", "error");
            }
        }
    });
    
    return (
        <div className="container my-4">
            <h2 className="mb-3 title-container">Quản Lý Chuồng Nuôi</h2>

            <div className="input-group mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo Mã Chuồng Nuôi hoặc Mã Nhân Viên"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                />
            </div>

            <div className="table-responsive shadow">
                <table className="table table-bordered table-hover custom-table">
                    <thead>
                        <tr>
                            <th>mã lợn </th>
                            <th>Mã chuồng nuôi</th>
                            <th>Ngày Tạo Chuồng</th>
                            <th>Ngày Đóng Chuồng</th>
                            <th> tình trạng </th>
                            <th> cân nặng </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPigs.map((pig) => (
                            <tr
                                key={pig.id}
                                className={`table-row ${selectedPig?.id === pig.id ? 'table-active' : ''}`}
                                onClick={() => handleRowClick(pig)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{pig.id}</td>
                                <td>{pig.name}</td>
                                <td>{pig.createdAt}</td>
                                <td>{pig.closeAt}</td>
                                <td>{pig.feel}</td>

                                <td>{pig.weight}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="d-flex justify-content-center mt-4">
                <Button variant="primary" className="mx-2 shadow" onClick={() => handleShowModal()}>Khởi tạo</Button>
                <Button
                    variant="warning"
                    className="mx-2 shadow"
                    onClick={() => selectedPig ? handleShowModal(selectedPig) : showToast("Bạn chưa chọn cá thể nào", "error")}
                >
                    Chỉnh sửa
                </Button>
                <Button variant="danger" className="mx-2 shadow" onClick={handleShowDeleteModal}>Xóa</Button>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered className="no-border-header">
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? "Chỉnh sửa thông tin cá thể" : "Khởi tạo cá thể"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Mã lợn </Form.Label>
                            <Form.Control
                                type="text"
                                name="id"
                                value={formik.values.id}
                                onChange={formik.handleChange}
                                isInvalid={formik.touched.id && formik.errors.id}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.id}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmpoly">
                            <Form.Label>Mã Nhân Viên</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                isInvalid={formik.touched.name && formik.errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formCreatedAt">
                            <Form.Label>Ngày Tạo Chuồng</Form.Label>
                            <Form.Control
                                type="date"
                                name="createdAt"
                                value={formik.values.createdAt}
                                onChange={formik.handleChange}
                                isInvalid={formik.touched.createdAt && formik.errors.createdAt}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.createdAt}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formCloseAt">
                            <Form.Label>Ngày Đóng Chuồng</Form.Label>
                            <Form.Control
                                type="date"
                                name="closeAt"
                                value={formik.values.closeAt}
                                onChange={formik.handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formQuantity">
                            <Form.Label>cân nặng </Form.Label>
                            <Form.Control
                                type="number"
                                name="weight"
                                value={formik.values.weight}
                                onChange={formik.handleChange}
                                isInvalid={formik.touched.weight && formik.errors.weight}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.weight}</Form.Control.Feedback>
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" className="shadow" onClick={handleCloseModal}>Hủy bỏ</Button>
                            <Button variant="primary" className="shadow" type="submit">{editMode ? "Cập nhật" : "Thêm mới"}</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={deleteModal.show} onHide={handleCloseDeleteModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa chuồng nuôi <strong>{selectedPig?.name}</strong> không?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>Hủy</Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>Xóa</Button>
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

export default Pig;
