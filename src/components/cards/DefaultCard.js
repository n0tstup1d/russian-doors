import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { CartContext } from '../CartContext/CartProvider';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DefaultCards() {
  const { addToCart } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [data, setData] = useState({ categories: [], products: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/products.json');
        if (!response.ok) throw new Error('Ошибка загрузки');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Фильтрация товаров
  const filteredProducts = selectedCategory 
    ? data.products.filter(p => 
        p.category === selectedCategory || 
        p.subcategory === selectedCategory
      )
    : data.products;

  if (loading) return <div className="text-center mt-5">Загрузка...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Ошибка: {error}</div>;

  return (
    <div className="container-fluid vh-100 position-relative">
      {/* Модальное окно */}
      <Modal show={!!selectedProduct} onHide={() => setSelectedProduct(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img 
            src={selectedProduct?.image} 
            className="img-fluid mb-3"
            alt={selectedProduct?.name}
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
          <p className="lead">{selectedProduct?.description || 'Описание отсутствует'}</p>
          <div className="d-flex justify-content-between align-items-center">
            <span className="text-muted">Категория: {selectedProduct?.category}</span>
            <strong className="fs-5">{selectedProduct?.price}₽</strong>
          </div>
        </Modal.Body>
      </Modal>

      {/* Мобильное меню */}
      <div className="d-md-none bg-light p-2 border-bottom">
        <Button 
          variant="outline-dark"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          {showMobileMenu ? '✕ Закрыть' : '☰ Каталог'}
        </Button>
      </div>

      <div className="row g-0 h-100">
        {/* Сайдбар категорий */}
        <div 
          className={`col-md-3 bg-light ${showMobileMenu ? 'd-block' : 'd-none d-md-block'}`}
          style={{ height: 'calc(100vh - 56px)', overflowY: 'auto' }}
        >
          <div className="p-3">
            <h4 className="mb-3 d-none d-md-block">Категории</h4>
            <div className="accordion">
              {data.categories.map((mainCat, i) => (
                <div key={i} className="accordion-item">
                  <h2 className="accordion-header">
                    <Button 
                      className="accordion-button collapsed" 
                      variant="link"
                      onClick={() => document.getElementById(`collapse${i}`).classList.toggle('show')}
                    >
                      {mainCat.name}
                    </Button>
                  </h2>
                  <div id={`collapse${i}`} className="accordion-collapse collapse">
                    <div className="accordion-body p-0">
                      <div className="list-group">
                        {mainCat.subcategories.map((sub, j) => (
                          <Button
                            key={j}
                            onClick={() => {
                              setSelectedCategory(prev => prev === sub ? null : sub);
                              setShowMobileMenu(false);
                            }}
                            className={`list-group-item list-group-item-action ps-4 ${
                              selectedCategory === sub ? 'active' : ''
                            }`}
                          >
                            {sub}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Карточки товаров */}
        <div 
          className="col-md-9" 
          style={{ height: 'calc(100vh - 56px)', overflowY: 'auto', padding: '15px' }}
        >
          <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
            {filteredProducts.map(product => {
              const selectedSize = selectedSizes[product.id] || 
                                  (product.sizes ? product.sizes[0] : null);

              return (
                <div key={product.id} className="col">
                  <div className="card h-100 shadow-sm">
                    <img 
                      src={product.image} 
                      className="card-img-top" 
                      alt={product.name}
                      style={{ height: '250px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setSelectedProduct(product)}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.name}</h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="badge bg-secondary">
                          {product.subcategory}
                        </span>
                        <span className="text-dark fw-bold fs-5">
                          {product.price}</span>
                      </div>
                      
                      {/* Выбор размера для дверей */}
                      {product.category === "Двери" && product.sizes && (
                        <div className="mb-3">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label>Размер полотна:</Form.Label>
                            <a 
                              href="/size-guide" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-decoration-none text-primary"
                            >
                              Как определить?
                            </a>
                          </div>
                          <Form.Select
                            value={selectedSize}
                            onChange={(e) => {
                              if (e.target.value === "custom") {
                                setSelectedSizes(prev => ({
                                  ...prev,
                                  [product.id]: ""
                                }));
                              } else {
                                setSelectedSizes(prev => ({
                                  ...prev,
                                  [product.id]: e.target.value
                                }));
                              }
                            }}
                          >
                            {product.sizes.map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                            <option value="custom">Другое (указать)</option>
                          </Form.Select>

                          {/* Поле для кастомного размера */}
                          {selectedSize === "custom" && (
                            <Form.Control
                              type="text"
                              placeholder="Ширина x Высота (мм)"
                              className="mt-2"
                              value={selectedSizes[product.id] || ""}
                              onChange={(e) => setSelectedSizes(prev => ({
                                ...prev,
                                [product.id]: e.target.value
                              }))}
                            />
                          )}
                        </div>
                      )}

                      {/* Кнопки действий */}
                      <div className="d-grid gap-2">
                        <Button 
                          variant="outline-dark" 
                          size="sm"
                          onClick={() => setSelectedProduct(product)}
                        >
                          Подробнее
                        </Button>
                        <Button
                          variant="outline-dark" 
                          size="sm"
                          onClick={() => {
                            if (!localStorage.getItem('authToken')) {
                              navigate('/login');
                            } else {
                              addToCart({ 
                                ...product, 
                                selectedSize: selectedSizes[product.id] 
                              });
                            }
                          }}
                          disabled={product.quantity === 0}
                        >
                          {product.quantity > 0 ? 'В корзину' : 'Нет в наличии'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}