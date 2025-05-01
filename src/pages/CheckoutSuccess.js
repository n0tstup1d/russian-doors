import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Container, Alert, Button, ListGroup } from 'react-bootstrap';
import './css/non.css';

const CheckoutSuccess = () => {
  const { state } = useLocation();

  return (
    <>
    <div className="non"></div>
    <Container className="my-5 text-center">
      <Alert variant="success" className="w-75 mx-auto">
        <h2 className="alert-heading">🎉 Заказ успешно оформлен!</h2>
        
        <ListGroup>
          <ListGroup.Item>Сумма: {state?.total}₽</ListGroup.Item>
          <ListGroup.Item>Дата доставки: {state?.date || 'Самовывоз'}</ListGroup.Item> {/* Исправлено с deliveryDate на date */}
          {state?.address && <ListGroup.Item>Адрес: {state.address}</ListGroup.Item>}
          {state?.installationDate && (
            <ListGroup.Item>Дата установки: {state.installationDate}</ListGroup.Item>
          )}
        </ListGroup>

        <div className="d-flex justify-content-center gap-3">
          <Button as={Link} to="/orders" variant="primary">
            Мои заказы
          </Button>
          <Button as={Link} to="/catalog" variant="outline-primary">
            Каталог
          </Button>
        </div>
      </Alert>
    </Container>
    <div className="non"></div>
    </>
  );
};

export default CheckoutSuccess;