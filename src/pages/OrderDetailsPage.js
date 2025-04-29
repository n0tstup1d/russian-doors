import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Button, Card, ListGroup, Badge, Alert } from 'react-bootstrap';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}`);
        if (!response.ok) throw new Error('Заказ не найден');
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const getStatusVariant = (status) => {
    switch (status.toLowerCase()) {
      case 'установлено': return 'success';
      case 'доставлено': return 'primary';
      case 'в обработке': return 'warning';
      case 'отменен': return 'danger';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "Самовывоз") return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  if (loading) return <div className="text-center mt-5"><span className="spinner-border" /></div>;
  if (error) return <Alert variant="danger" className="m-3">{error}</Alert>;

  return (
    <Container className="my-5">
      <Button variant="outline-secondary" onClick={() => navigate(-1)} className="mb-4">
        ← Назад к списку заказов
      </Button>

      <Card className="shadow">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h3>Заказ #{order.id.slice(0, 8)}</h3>
          <Badge pill bg={getStatusVariant(order.status)}>
            {order.status}
          </Badge>
        </Card.Header>

        <Card.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Дата оформления:</strong> {formatDate(order.createdAt)}
            </ListGroup.Item>
            
            <ListGroup.Item>
              <strong>Доставка:</strong> 
              {order.date === "Самовывоз" ? "Самовывоз" : formatDate(order.date)}
              {order.date && order.date !== "Самовывоз" && new Date() > new Date(order.date) && ' ✓'}
            </ListGroup.Item>

            {order.installationRequired && order.installationDate && (
              <ListGroup.Item>
                <strong>Установка:</strong> {formatDate(order.installationDate)}
                {new Date() > new Date(order.installationDate) && ' ✓'}
              </ListGroup.Item>
            )}

            <ListGroup.Item>
              <strong>Адрес:</strong> {order.address || 'Самовывоз'}
            </ListGroup.Item>

            <ListGroup.Item>
              <strong>Сумма:</strong> {parseFloat(order.total).toFixed(2)}₽
              {order.installationRequired && ' (включая установку)'}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>

        <Card.Body>
          <h5>Состав заказа:</h5>
          <ListGroup>
            {order.items.map(item => (
              <ListGroup.Item key={`${item.productId}-${item.quantity}`}>
                <div className="d-flex justify-content-between">
                  <span>{item.name}</span>
                  <span>
                    {item.quantity} × {item.price}
                  </span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default OrderDetailsPage;