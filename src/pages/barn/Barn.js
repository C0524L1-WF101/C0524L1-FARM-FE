import React, { useEffect, useState } from 'react';
import { barnAPI } from '../../services/api';
import { Modal, Button, Form } from 'react-bootstrap';
import ToastNotification from '../../component/ToastNotification';
import '../barn/Barn.css';
import { v4 as uuidv4 } from 'uuid';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const Barn = () => {
    const [barns, setBarns] = useState([]);
    const [filteredBarns, setFilteredBarns] = useState([]); 
    const [searchTerm, setSearchTerm] = useState(''); 
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [toast, setToast] = useState({ message: '', type: '', show: false });
    const [deleteModal, setDeleteModal] = useState({ show: false, id: null });
    const [selectedBarn, setSelectedBarn] = useState(null); 

    useEffect(() => {
        fetchBarns();
    }, []);

    const fetchBarns = async () => {
        try {
            const data = await barnAPI.getAllBarns();
            setBarns(data);
            setFilteredBarns(data); 
        } catch (error) {
            showToast("Lỗi khi lấy danh sách chuồng nuôi", "error");
        }
    };

    useEffect(() => {
        handleSearch();
    }, [searchTerm, barns]);

    const handleSearch = () => {
        const filtered = barns.filter(barn =>
            barn.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            barn.empoly.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredBarns(filtered);
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

    const handleShowModal = (barn = null) => {
        if (barn) {
            setEditMode(true);
            formik.setValues(barn);
        } else {
            setEditMode(false);
            formik.resetForm();
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        formik.resetForm();
        setSelectedBarn(null); 
    };

    const handleRowClick = (barn) => {
        setSelectedBarn(barn); 
    };

    const handleShowDeleteModal = () => {
        if (!selectedBarn) {
            showToast("Bạn chưa chọn chuồng nuôi nào", "error");
            return;
        }
        setDeleteModal({ show: true, id: selectedBarn.id });
    };

    const handleCloseDeleteModal = () => {
        setDeleteModal({ show: false, id: null });
    };

    const handleConfirmDelete = async () => {
        try {
            await barnAPI.deleteBarn(deleteModal.id);
            fetchBarns();
            showToast("Xóa chuồng nuôi thành công", "success");
            setSelectedBarn(null);
        } catch (error) {
            showToast("Lỗi khi xóa chuồng nuôi", "error");
        } finally {
            handleCloseDeleteModal();
        }
    };

    const validationSchema = Yup.object({
        name: Yup.string()
            .required("Mã Chuồng Nuôi là bắt buộc")
            .matches(/^C\d{2}$/, "Mã Chuồng Nuôi phải có dạng C01, C02,...")
            .test(
                "unique-name",
                "Mã chuồng nuôi đã bị trùng !",
                (value) => editMode || !barns.some((barn) => barn.name === value)
            ),
        empoly: Yup.string()
            .required("Mã Nhân Viên là bắt buộc")
            .matches(/^NV\d{3}$/, "Mã Nhân Viên phải có dạng NV001, NV002,..."),
        createdAt: Yup.date().required("Ngày Tạo Chuồng là bắt buộc"),
        quantity: Yup.number()
            .required("Số Lượng Cá Thể là bắt buộc")
            .positive("Số Lượng Cá Thể phải lớn hơn 0")
            .integer("Số Lượng Cá Thể phải là số nguyên"),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            empoly: '',
            createdAt: '',
            closeAt: '',
            quantity: ''
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                if (editMode) {
                    await barnAPI.updateBarn(values.id, values);
                    showToast("Chỉnh sửa thành công", "success");
                } else {
                    const newBarn = { id: uuidv4(), ...values };
                    await barnAPI.createBarn(newBarn);
                    showToast("Khởi tạo thành công", "success");
                }
                fetchBarns();
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
                            <th>Mã Chuồng Nuôi</th>
                            <th>Mã Nhân Viên</th>
                            <th>Ngày Tạo Chuồng</th>
                            <th>Ngày Đóng Chuồng</th>
                            <th>Số Lượng Cá Thể</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBarns.map((barn) => (
                            <tr 
                                key={barn.id} 
                                className={`table-row ${selectedBarn?.id === barn.id ? 'table-active' : ''}`}
                                onClick={() => handleRowClick(barn)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td>{barn.name}</td>
                                <td>{barn.empoly}</td>
                                <td>{barn.createdAt}</td>
                                <td>{barn.closeAt || 'Đang hoạt động'}</td>
                                <td>{barn.quantity}</td>
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
                    onClick={() => selectedBarn ? handleShowModal(selectedBarn) : showToast("Bạn chưa chọn chuồng nuôi nào", "error")}
                >
                    Chỉnh sửa
                </Button>
                <Button variant="danger" className="mx-2 shadow" onClick={handleShowDeleteModal}>Xóa</Button>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered className="no-border-header">
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? "Chỉnh sửa thông tin chuồng nuôi" : "Khởi tạo chuồng nuôi"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Mã Chuồng Nuôi</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                isInvalid={formik.touched.name && formik.errors.name}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group controlId="formEmpoly">
                            <Form.Label>Mã Nhân Viên</Form.Label>
                            <Form.Control
                                type="text"
                                name="empoly"
                                value={formik.values.empoly}
                                onChange={formik.handleChange}
                                isInvalid={formik.touched.empoly && formik.errors.empoly}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.empoly}</Form.Control.Feedback>
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
                            <Form.Label>Số Lượng Cá Thể</Form.Label>
                            <Form.Control
                                type="number"
                                name="quantity"
                                value={formik.values.quantity}
                                onChange={formik.handleChange}
                                isInvalid={formik.touched.quantity && formik.errors.quantity}
                            />
                            <Form.Control.Feedback type="invalid">{formik.errors.quantity}</Form.Control.Feedback>
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
                    Bạn có chắc chắn muốn xóa chuồng nuôi <strong>{selectedBarn?.name}</strong> không?
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

export default Barn;
