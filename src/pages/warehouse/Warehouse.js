import React, { useState, useEffect, useRef } from 'react';
import '../warehouse/Warehouse.css';

const Warehouse = () => {
  const [foodData, setFoodData] = useState(() => {
    const savedData = localStorage.getItem('foodData');
    return savedData ? JSON.parse(savedData) : [
      { id: 1, foodType: 'Cám lúa mì', quantity: 100, unit: 'kg' },
      { id: 2, foodType: 'Cám ngô', quantity: 50, unit: 'kg' },
      { id: 3, foodType: 'Cám đậu', quantity: 200, unit: 'kg' },
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [newFoodType, setNewFoodType] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [newUnit, setNewUnit] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showStockOutModal, setShowStockOutModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);

  const prevFoodDataRef = useRef();
  useEffect(() => {
    prevFoodDataRef.current = foodData;
  }, [foodData]);

  const handleStockIn = () => {
    if (newFoodType && newQuantity && newUnit) {
      const existingFood = foodData.find(item => item.foodType === newFoodType);

      if (existingFood) {
        const updatedFoodData = foodData.map(item => {
          if (item.foodType === newFoodType) {
            item.quantity += parseInt(newQuantity);
          }
          return item;
        });
        setFoodData(updatedFoodData);
      } else {
        const newFood = {
          id: foodData.length + 1,
          foodType: newFoodType,
          quantity: parseInt(newQuantity),
          unit: newUnit,
        };
        setFoodData([...foodData, newFood]);
      }

      setNewFoodType('');
      setNewQuantity('');
      setNewUnit('');
      setShowModal(false);
    } else {
      alert('Vui lòng điền đầy đủ thông tin loại thức ăn');
    }
  };

  const handleStockOut = () => {
    if (selectedFood && newQuantity) {
      const updatedFoodData = foodData.map(item => {
        if (item.id === selectedFood.id) {
          item.quantity -= parseInt(newQuantity); // Giảm số lượng theo số nhập vào
        }
        return item;
      });

      setFoodData(updatedFoodData);
      setShowStockOutModal(false);
      setNewQuantity('');
    } else {
      alert('Vui lòng nhập số lượng hợp lệ');
    }
  };

  const cleanUpZeroQuantityFoods = () => {
    const updatedFoodData = foodData.filter(item => item.quantity > 0);
    setFoodData(updatedFoodData);
  };

  useEffect(() => {
    const hasZeroQuantityFoods = foodData.some(item => item.quantity === 0);

    if (hasZeroQuantityFoods) {
      cleanUpZeroQuantityFoods();
    }
  }, [foodData]);

  useEffect(() => {
    localStorage.setItem('foodData', JSON.stringify(foodData));
  }, [foodData]);

  const filteredFoodData = foodData.filter(food =>
    food.foodType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center">
        <h1 className='title-container'>Quản Lý Kho</h1>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm loại thức ăn"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '300px' }}
          />
        </div>
      </div>

      <table >
        <thead >
          <tr>
            <th>STT</th>
            <th>Loại thức ăn</th>
            <th>Số lượng</th>
            <th>Đơn vị</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredFoodData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.foodType}</td>
              <td>{item.quantity}</td>
              <td>{item.unit}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setSelectedFood(item);
                    setShowStockOutModal(true);
                  }}
                >
                  Xuất Kho
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between mb-3">
        <button
          className="btn btn-success"
          onClick={() => setShowModal(true)}
        >
          Nhập Kho
        </button>
      </div>

      {/* Modal Nhập Kho */}
      {showModal && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Nhập Thông Tin Loại Thức Ăn</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <div className="mb-2">
                    <label>Tên loại thức ăn</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newFoodType}
                      onChange={(e) => setNewFoodType(e.target.value)}
                      placeholder="Nhập tên loại thức ăn"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Số lượng</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      placeholder="Nhập số lượng"
                    />
                  </div>
                  <div className="mb-2">
                    <label>Đơn vị</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value)}
                      placeholder="Nhập đơn vị"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStockIn}
                >
                  Nhập Kho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xuất Kho */}
      {showStockOutModal && (
        <div className="modal show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cập Nhật Số Lượng Xuất Kho</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setShowStockOutModal(false)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <div className="mb-2">
                    <label>Số lượng xuất</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      placeholder="Nhập số lượng xuất"
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowStockOutModal(false)}
                >
                  Đóng
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStockOut}
                >
                  Cập Nhật Xuất Kho
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Warehouse;
