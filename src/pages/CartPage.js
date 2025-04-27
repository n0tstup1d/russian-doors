import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../components/CartContext/CartProvider';
import { Button, Container, Card, Row, Col, ListGroup, Badge, Alert } from 'react-bootstrap';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    incrementItem, 
    decrementItem, 
    total // Добавлено
  } = useContext(CartContext);
  
  const navigate = useNavigate();

  // Безопасное значение total
  const safeTotal = total || 0;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Корзина пуста!');
      return;
    }
    navigate('/checkout');
  };

  // Функция для форматирования цены
  const formatPrice = (price) => {
    const numericPrice = typeof price === 'string' 
      ? parseFloat(price.replace(/[^\d.]/g, '')) 
      : Number(price);
      
    return isNaN(numericPrice) ? '0.00' : numericPrice.toFixed(2);
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">🛒 Ваша корзина</h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="alert alert-info w-75 mx-auto">
            <h4>😔 Корзина пуста</h4>
            <Link to="/catalog" className="btn btn-primary mt-3">
              Перейти к покупкам
            </Link>
          </div>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {cartItems.map((item) => (
              <Col xs={12} key={`${item.productId}-${item.selectedSize}`}>
                <Card className="shadow-sm">
                  <Card.Body className="d-flex flex-column flex-md-row align-items-center">
                    <div className="me-md-4 mb-3 mb-md-0">
                      <Card.Img
                        src={item.image}
                        alt={item.name}
                        style={{ 
                          width: '150px', 
                          height: '150px',
                          objectFit: 'cover',
                          borderRadius: '10px'
                        }}
                      />
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <Card.Title className="mb-0">{item.name}</Card.Title>
                        <Button 
                          variant="danger" 
                          size="sm"
                          onClick={() => removeFromCart(item.productId, item.selectedSize)}
                        >
                          &times;
                        </Button>
                      </div>
                      
                      {item.selectedSize && (
                        <ListGroup.Item className="mb-2">
                          Размер: <strong>{item.selectedSize}</strong>
                        </ListGroup.Item>
                      )}
                      
                      <ListGroup horizontal className="mb-3">
                        <ListGroup.Item className="d-flex align-items-center">
                          <span className="me-2">Цена:</span>
                          <Badge bg="secondary">
                            {formatPrice(item.price)}₽
                          </Badge>
                        </ListGroup.Item>
                        
                        <ListGroup.Item className="d-flex align-items-center">
                          <div className="btn-group">
                            <Button
                              variant="outline-dark"
                              size="sm"
                              onClick={() => decrementItem(item.productId, item.selectedSize)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <Button variant="light" size="sm" disabled>
                              {item.quantity}
                            </Button>
                            <Button
                              variant="outline-dark"
                              size="sm"
                              onClick={() => incrementItem(item.productId, item.selectedSize)}
                            >
                              +
                            </Button>
                          </div>
                        </ListGroup.Item>
                        
                        <ListGroup.Item className="d-flex align-items-center">
                          <span className="me-2">Сумма:</span>
                          <Badge bg="success">
                            {formatPrice(item.price * item.quantity)}₽
                          </Badge>
                        </ListGroup.Item>
                      </ListGroup>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          <div className="mt-5 p-4 bg-light rounded-3 shadow">
            <h4 className="mb-3">
              Итого: 
              <span className="text-primary">
                {typeof safeTotal === 'number' 
                  ? safeTotal.toFixed(2)
                  : '0.00'}₽
              </span>
            </h4>
            <Button 
              variant="success" 
              size="lg" 
              onClick={handleCheckout}
              className="w-100"
            >
              Оформить заказ →
            </Button>
          </div>
        </>
      )}
    </Container>
  );
};

export default CartPage;