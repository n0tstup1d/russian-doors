//OrderHistoryPage.js
import React, { useEffect, useState } from 'react';
import { Table, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/orders?userId=${userId}`);
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Ошибка загрузки истории:', error);
      }
    };
    fetchOrders();
  }, [userId]);

  return (
    <div className="container my-5">
      <h2>История заказов</h2>
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>№ Заказа</th>
            <th>Дата</th>
            <th>Сумма</th>
            <th>Статус</th>
            <th>Детали</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id.slice(0, 8)}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>{order.total}₽</td>
              <td>
                <Badge bg={
                  order.status === 'completed' ? 'success' : 
                  order.status === 'canceled' ? 'danger' : 'warning'
                }>
                  {order.status}
                </Badge>
              </td>
              <td>
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/orders/${order.id}`)}
                >
                  Подробнее
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderHistoryPage;