import React from 'react';
import { Container, ListGroup } from 'react-bootstrap';

const SizeGuidePage = () => {
  return (
    <Container className="my-5">
      <h2 className="mb-4">📏 Как правильно измерить дверное полотно</h2>
      
      <div className="bg-light p-4 rounded-3 shadow-sm">
        <ListGroup variant="flush">
          <ListGroup.Item>
            1. Измерьте ширину в 3-х точках (верх, середина, низ)
          </ListGroup.Item>
          <ListGroup.Item>
            2. Измерьте высоту с обеих сторон
          </ListGroup.Item>
          <ListGroup.Item>
            3. Укажите размеры в формате: <strong>Ширина x Высота</strong>
          </ListGroup.Item>
          <ListGroup.Item className="text-muted">
            Пример: 800x2100 мм
          </ListGroup.Item>
        </ListGroup>

        <div className="mt-4 text-center">
          <img 
            src="/images/measure-guide.png" 
            alt="Инструкция по замерам"
            className="img-fluid"
            style={{ maxWidth: '600px' }}
          />
        </div>
      </div>
    </Container>
  );
};

export default SizeGuidePage;