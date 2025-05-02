import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ProductsTable = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить товар?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/products/${productId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        fetchProducts();
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-table-container">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Поиск по названию или категории..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <Link to="/admin/products/new" className="btn btn-primary">
          Добавить товар
        </Link>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Категория</th>
            <th>Количество</th>
            <th>Цена</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td className={product.quantity <= 0 ? 'text-danger' : ''}>
                {product.quantity}
              </td>
              <td>{product.price}</td>
              <td>
                <Link
                  to={`/admin/products/edit/${product.id}`}
                  className="btn btn-sm btn-warning me-2"
                >
                  Редактировать
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="btn btn-sm btn-danger"
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

export default ProductsTable;