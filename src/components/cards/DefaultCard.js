import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function DefaultCards({ addToCart }) {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [data, setData] = useState({ 
        categories: [],
        products: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Загрузка данных из JSON
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
            {/* Стили */}
            <style>{`
                .background-pattern {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    opacity: 0.05;
                    background: none;
                    z-index: -1;
                }

                .main-gradient {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    background: none;
                    z-index: -2;
                }

                .card {
                    background: white;
                    // background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(2px);
                    border: 1px solid rgba(0, 0, 0, 0.1);
                    transition: transform 0.2s;
                }

                .card:hover {
                    transform: translateY(-3px);
                }

                .accordion-item {
                    background-color: rgba(255, 255, 255, 0.8);
                    
                }

                .list-group-item.active {
                    background: linear-gradient(135deg, #8A2BE2 0%, #FF69B4 100%);
                    border-color: transparent;
                    color: white !important;
                    font-weight: 600;
                }

                .list-group-item:hover {
                    background-color: #f8f9fa !important;
                    transform: scale(1.02);
                    transition: all 0.2s ease;
                }

                .accordion-button:not(.collapsed) {
                    background: linear-gradient(135deg, #8A2BE2 0%, #FF69B4 100%);
                    color: white !important;
                }

                /* Удаление фокуса */
                .accordion-button:focus,
                .list-group-item:focus {
                    outline: none !important;
                    box-shadow: none !important;
                }
            `}</style>

            {/* Фоновые элементы */}
            <div className="main-gradient" />
            <div className="background-pattern" />

            {/* Мобильное меню */}
            <div className="d-md-none bg-light p-2 border-bottom">
                <button 
                    className="btn btn-outline-dark"
                    onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                    {showMobileMenu ? '✕ Закрыть' : '☰ Каталог'}
                </button>
            </div>

            <div className="row g-0 h-100">
                {/* Боковое меню */}
                <div 
                    className={`col-md-3 bg-light ${showMobileMenu ? 'd-block' : 'd-none d-md-block'}`}
                    style={{ 
                        height: 'calc(100vh - 56px)',
                        overflowY: 'auto',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)'
                    }}
                >
                    <div className="p-3">
                        <h4 className="mb-3 d-none d-md-block">Категории</h4>
                        <div className="accordion">
                            {data.categories.map((mainCat, i) => (
                                <div key={i} className="accordion-item">
                                    <h2 className="accordion-header">
                                        <button className="accordion-button collapsed" 
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#collapse${i}`}>
                                            {mainCat.name}
                                        </button>
                                    </h2>
                                    <div id={`collapse${i}`} className="accordion-collapse collapse">
                                        <div className="accordion-body p-0">
                                            <div className="list-group">
                                                {mainCat.subcategories.map((sub, j) => (
                                                    <button
                                                        key={j}
                                                        onClick={() => {
                                                            setSelectedCategory(prev => 
                                                                prev === sub ? null : sub
                                                            );
                                                            setShowMobileMenu(false);
                                                        }}
                                                        className={`list-group-item list-group-item-action ps-4 ${
                                                            selectedCategory === sub ? 'active' : ''
                                                        }`}>
                                                        {sub}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Основной контент */}
                <div 
                    className="col-md-9" 
                    style={{ 
                        height: 'calc(100vh - 56px)',
                        overflowY: 'auto',
                        padding: '15px'
                    }}
                >
                    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
                        {filteredProducts.map(product => (
                            <div key={product.id} className="col">
                                <div className="card h-100 shadow-sm">
                                    <img 
                                        src={product.image} 
                                        className="card-img-top" 
                                        alt={product.name}
                                        style={{ 
                                            height: '200px',
                                            objectFit: 'cover' 
                                        }}
                                    />
                                    <div className="card-body">
                                        <h5 className="card-title">{product.name}</h5>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="badge bg-secondary">
                                                {product.subcategory}
                                            </span>
                                            <span className="text-dark fw-bold">{product.price}</span>
                                        </div>
                                        <div className="d-grid gap-2">
                                            <button className="btn btn-outline-dark btn-sm">
                                                Подробнее
                                            </button>
                                            <button 
                                                className="btn btn-outline-dark btn-sm"
                                                onClick={() => addToCart(product)}
                                            >
                                                В корзину
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}