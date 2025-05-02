import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import './ProductForm.css'; 

const ProductForm = () => {
  const [product, setProduct] = useState({
    name: '',
    category: '',
    subcategory: '',
    price: '',
    quantity: 0,
    description: '',
    image: '',
    sizes: []
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        
        if (!res.ok) throw new Error('Ошибка загрузки данных');
        
        const data = await res.json();
        
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
  
        if (id && data.products) {
          const existing = data.products.find(p => p.id === parseInt(id));
          if (existing) setProduct(existing);
        }
      } catch (err) {
        setError('Ошибка загрузки данных');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Добавляем недостающую функцию обработки отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5000/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(product)
      });
      navigate('/admin/products');
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      setError('Ошибка при сохранении товара');
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <>
    <div className="non"></div>
    <Container className="my-5 product-form-container">
      <Card className="shadow-lg product-form-card">
        <Card.Body>
          <div className="text-center mb-4">
            <i className="bi bi-box-seam fs-1 text-primary"></i>
            <h2 className="mt-3">{id ? 'Редактирование товара' : 'Новый товар'}</h2>
          </div>

          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Название товара</Form.Label>
              <Form.Control
                type="text"
                value={product.name}
                onChange={(e) => setProduct({...product, name: e.target.value})}
                required
                size="lg"
              />
            </Form.Group>

            <div className="row mb-4">
              <Form.Group className="col-md-6">
                <Form.Label>Категория</Form.Label>
                <Form.Select
                  value={product.category}
                  onChange={(e) => setProduct({...product, category: e.target.value})}
                  required
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label>Подкатегория</Form.Label>
                <Form.Select
                  value={product.subcategory}
                  onChange={(e) => setProduct({...product, subcategory: e.target.value})}
                >
                  <option value="">Не выбрано</option>
                  {categories
                    .find(c => c.name === product.category)
                    ?.subcategories
                    ?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                </Form.Select>
              </Form.Group>
            </div>

            <div className="row mb-4">
              <Form.Group className="col-md-6">
                <Form.Label>Цена</Form.Label>
                <Form.Control
                  type="text"
                  value={product.price}
                  onChange={(e) => setProduct({...product, price: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group className="col-md-6">
                <Form.Label>Количество на складе</Form.Label>
                <Form.Control
                  type="number"
                  value={product.quantity}
                  onChange={(e) => setProduct({...product, quantity: parseInt(e.target.value)})}
                  min="0"
                  required
                />
              </Form.Group>
            </div>

            <Form.Group className="mb-4">
              <Form.Label>Описание товара</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={4}
                value={product.description}
                onChange={(e) => setProduct({...product, description: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Ссылка на изображение</Form.Label>
              <Form.Control
                type="url"
                value={product.image}
                onChange={(e) => setProduct({...product, image: e.target.value})}
              />
            </Form.Group>

            <div className="d-grid gap-2">
              <Button variant="primary" size="lg" type="submit">
                <i className="bi bi-save me-2"></i>
                {id ? 'Сохранить изменения' : 'Создать товар'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
    <div className="non"></div>
    </>
  );
};

export default ProductForm;