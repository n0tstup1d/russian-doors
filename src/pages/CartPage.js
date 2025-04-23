import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Добавлен useNavigate
import { CartContext } from '../components/CartContext/CartProvider';
import { Button, Card, Container, Row, Col, ListGroup, Badge } from 'react-bootstrap';
import { getAuthToken } from '../services/authServices';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    incrementItem, 
    decrementItem,
    setCartItems
  } = useContext(CartContext);
  
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = getAuthToken();

  useEffect(() => {
    fetch('/api/products.json')
      .then(res => res.json())
      .then(data => setProducts(data.products));
  }, []);

  useEffect(() => {
    const calculateTotal = () => {
      return cartItems.reduce((acc, item) => {
        const product = products.find(p => p.id === item.productId);
        return acc + ((parseFloat(product?.price) || 0) * item.quantity);
      }, 0);
    };
    setTotal(calculateTotal());
  }, [cartItems, products]);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/update-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items: cartItems })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      // Очистка корзины
      setCartItems([]);
      navigate('/checkout-success');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center">🛒 Ваша корзина</h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <div className="alert alert-info w-75 mx-auto">
            <h4>😔 Корзина пуста</h4>
            <p>Начните покупки в нашем каталоге!</p>
            <Link to="/catalog" className="btn btn-primary">
              Перейти к каталогу
            </Link>
          </div>
        </div>
      ) : (
        <>
          <Row className="g-4">
            {cartItems.map(item => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;

              return (
                <Col key={item.productId} xs={12}>
                  <Card className="shadow-sm">
                    <Card.Body className="d-flex flex-column flex-md-row align-items-center">
                      <div className="me-md-4 mb-3 mb-md-0">
                        <Card.Img
                          src={product.image}
                          alt={product.name}
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
                          <Card.Title className="mb-0">{product.name}</Card.Title>
                          <Button 
                            variant="danger" 
                            size="sm" 
                            onClick={() => removeFromCart(item.productId)}
                          >
                            &times;
                          </Button>
                        </div>

                        <ListGroup horizontal className="mb-3">
                          <ListGroup.Item className="d-flex align-items-center">
                            <span className="me-2">Цена:</span>
                            <Badge bg="secondary">{product.price}₽</Badge>
                          </ListGroup.Item>
                          
                          <ListGroup.Item className="d-flex align-items-center">
                            <span className="me-2">Количество:</span>
                            <div className="btn-group">
                              <Button
                                variant="outline-dark"
                                size="sm"
                                onClick={() => decrementItem(item.productId)}
                              >
                                -
                              </Button>
                              <Button variant="light" size="sm" disabled>
                                {item.quantity}
                              </Button>
                              <Button
                                variant="outline-dark"
                                size="sm"
                                onClick={() => incrementItem(item.productId)}
                              >
                                +
                              </Button>
                            </div>
                          </ListGroup.Item>
                          
                          <ListGroup.Item className="d-flex align-items-center">
                            <span className="me-2">Сумма:</span>
                            <Badge bg="success">{(parseFloat(product.price) * item.quantity).toFixed(2)}₽</Badge>
                          </ListGroup.Item>
                        </ListGroup>

                        <Badge bg="info" className="me-2">
                          {product.category}
                        </Badge>
                        <Badge bg="warning" text="dark">
                          {product.subcategory}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          <div className="mt-5 p-4 bg-light rounded-3 shadow-sm">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                Итого: <span className="text-primary">{total.toFixed(2)}₽</span>
              </h4>
              <div className="d-flex gap-3">
                <Link to="/catalog" className="btn btn-outline-secondary">
                  Продолжить покупки
                </Link>
                <Link to="/checkout" className="btn btn-success" onClick={handleCheckout}>
                  Оформить заказ →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </Container>
  );
};

export default CartPage;