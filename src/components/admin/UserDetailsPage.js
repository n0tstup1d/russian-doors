import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Badge, Button } from 'react-bootstrap';
import './UserDetail.css';

const UserDetailsPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/user/${userId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
        });
        
        if (!res.ok) {
          throw new Error(`Ошибка ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        setUser(data);
        
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setError('Не удалось загрузить данные пользователя');
      }
    };
    fetchUser();
  }, [userId]);

  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  if (!user) {
    return <div className="text-center mt-5"><span className="spinner-border" /></div>;
  }

  return (
    <>
    <div className="non"></div>
    <Container className="my-5 profile-container">
      <Card className="shadow-lg profile-card">
        <Card.Body>
          <div className="text-center mb-4">
            <div className="profile-avatar">
              <i className="bi bi-person-circle fs-1 text-primary"></i>
            </div>
            <h2 className="mt-3">{user.email}</h2>
            <Badge bg="secondary" pill className="mb-3">
              Пользователь с {new Date(user.createdAt).getFullYear()}
            </Badge>
          </div>

          <div className="user-info mt-4">
            <Card className="p-4 mb-3">
              <h4>Основная информация</h4>
              <hr/>
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Телефон:</strong> {user.phone || 'Не указан'}</p>
              <p><strong>Дата регистрации:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
              <Badge bg={user.isAdmin ? 'danger' : 'primary'}>
                {user.isAdmin ? 'Администратор' : 'Пользователь'}
              </Badge>
            </Card>

            {user.additionalInfo && (
              <Card className="p-4">
                <h4>Дополнительная информация</h4>
                <hr/>
                {/* Добавьте дополнительные поля по необходимости */}
              </Card>
            )}
          </div>
        </Card.Body>
      </Card>
      <div className="mt-4 text-center">
            <Button 
            variant="light" 
            onClick={() => navigate(-1)}
            className="back-button border"
            >
            <i className="bi bi-arrow-left me-2"></i>
            Вернуться назад
            </Button>
        </div>
    </Container>
    <div className="non"></div>
    </>
  );
};

export default UserDetailsPage;