import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/orders', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    }
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Вы уверены, что хотите удалить заказ?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        fetchOrders();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const filteredOrders = orders.filter(order =>
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.date.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="orders-table-container">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Поиск по ID или дате..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>ID заказа</th>
            <th>Дата доставки</th>
            <th>Дата установки</th>
            <th>Товары</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.date).toLocaleDateString()}</td>
              <td>{order.installationDate ? new Date(order.installationDate).toLocaleDateString() : 'Нет'}</td>
              <td>
                <ul className="items-list">
                  {order.items.map(item => (
                    <li key={item.productId}>
                      {item.name} (x{item.quantity})
                    </li>
                  ))}
                </ul>
              </td>
              <td>
                <Link 
                  to={`/admin/user/${order.userId}`}
                  className="btn btn-info btn-sm"
                >
                  Клиент
                </Link>
                <button 
                  onClick={() => handleDelete(order.id)}
                  className="btn btn-danger btn-sm"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;