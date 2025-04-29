import React, { useEffect, useState } from 'react';
import { Card, Badge, Button, Container, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const getCurrentStatus = (order) => {
    const now = new Date();
    
    // Используем order.date вместо deliveryDate
    const deliveryDate = order.date === "Самовывоз" 
      ? null 
      : new Date(order.date);
      
    const installationDate = order.installationRequired 
      ? new Date(order.installationDate || null) 
      : null;
  
    if (order.date === "Самовывоз" && now > new Date(order.createdAt)) {
      return 'Готов к выдаче';
    }
  
    if (installationDate && now > installationDate) {
      return 'Установлено';
    }
  
    if (deliveryDate && now > deliveryDate) {
      return 'Доставлено';
    }
  
    return order.status;
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders?userId=${userId}&_=${Date.now()}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Ошибка загрузки заказов');
      }
      const data = await response.json();
      const processedOrders = data.map(order => ({
        ...order,
        currentStatus: getCurrentStatus(order)
      })).reverse();
      setOrders(processedOrders);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 60000);
    return () => clearInterval(interval);
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'установлено': return 'success';
      case 'доставлено': return 'primary';
      case 'в обработке': return 'warning';
      case 'отменен': return 'danger';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <div className="spinner-border text-primary" role="status" />
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📦 История заказов</h2>
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          Назад
        </Button>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {orders.length === 0 ? (
        <Alert variant="info" className="text-center">
          У вас пока нет завершенных заказов
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {orders.map(order => (
            <Col key={order.id}>
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="mb-0">
                      Заказ #{order.id.slice(0, 6)}
                    </Card.Title>
                    <Badge pill bg={getStatusVariant(order.currentStatus)}>
                      {order.currentStatus}
                    </Badge>
                  </div>
                  <Card.Text className="text-muted small mb-2">
                    Оформлен: {formatDate(order.createdAt)}
                  </Card.Text>
                  <div className="mb-3">
                    <small className="d-block">
                      Доставка: {formatDate(order.date)} {/* Исправлено с deliveryDate */}
                      {order.date && order.date !== "Самовывоз" && new Date() > new Date(order.date) && ' ✓'}
                    </small>
                    {order.installationRequired && (
                      <small className="d-block">
                        Установка: {formatDate(order.installationDate)}
                        {order.installationDate && new Date() > new Date(order.installationDate) && ' ✓'}
                      </small>
                    )}
                  </div>
                  <div className="d-flex justify-content-between align-items-end">
                    <div>
                      <h5 className="text-primary mb-0">
                        {parseFloat(order.total).toFixed(2)}₽
                      </h5>
                      <small className="text-muted">
                        {order.items?.length} товаров
                      </small>
                    </div>
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Подробнее
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OrderHistoryPage;