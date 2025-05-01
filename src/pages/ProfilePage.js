import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Alert, Tab, Tabs, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import OrderHistoryPage from './OrderHistoryPage';
import './css/Profile.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Исправленный ключ токена
        const token = localStorage.getItem('authToken');
        const response = await fetch('http://localhost:5000/api/user', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Ошибка загрузки данных');
        }
        
        const data = await response.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        setError(err.message);
      }
    };
    
    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Исправленный ключ токена
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      setUser(formData);
      setEditMode(false);
      setSuccess('Данные успешно обновлены!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error('Пароли не совпадают');
      }
      // Исправленный ключ токена
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      
      setSuccess('Пароль успешно изменен!');
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!user) return <div className="text-center mt-5"><span className="spinner-border" /></div>;

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
            <Badge bg="secondary" pill>Пользователь с {new Date(user.createdAt).getFullYear()}</Badge>
          </div>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
          {success && <Alert variant="success" onClose={() => setSuccess('')} dismissible>{success}</Alert>}
          <Tabs defaultActiveKey="profile" className="mb-4">
            <Tab eventKey="profile" title="Профиль">
              <Form onSubmit={handleSubmit} className="mt-4">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Телефон</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    pattern="\+7\d{10}"
                    required
                  />
                  <Form.Text className="text-muted">
                    Формат: +71234567890
                  </Form.Text>
                </Form.Group>
                <div className="d-flex gap-2 mt-4">
                  {editMode ? (
                    <>
                      <Button variant="primary" type="submit">Сохранить</Button>
                      <Button variant="outline-secondary" onClick={() => setEditMode(false)}>
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline-primary" onClick={() => setEditMode(true)}>
                      Редактировать профиль
                    </Button>
                  )}
                </div>
              </Form>
            </Tab>
            <Tab eventKey="orders" title="Мои заказы">
              <div className="mt-4">
                <OrderHistoryPage />
              </div>
            </Tab>
            <Tab eventKey="password" title="Смена пароля">
              <Form onSubmit={handlePasswordSubmit} className="mt-4 password-form">
                <Form.Group className="mb-3">
                  <Form.Label>Текущий пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="oldPassword"
                    value={passwordForm.oldPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Новый пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="newPassword"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    minLength="6"
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Подтвердите пароль</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    minLength="6"
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Сменить пароль
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </Container>
    
    <div className="non"></div>
    </>
  );
};

export default ProfilePage;