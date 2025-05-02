import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        console.error('Ошибка загрузки пользователей:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Вы уверены, что хотите удалить пользователя?')) {
      try {
        await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        console.error('Ошибка удаления:', error);
      }
    }
  };

  const toggleAdmin = async (userId, isAdmin) => {
    try {
      await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ isAdmin: isAdmin ? 0 : 1 }), // Отправляем 1/0 вместо boolean
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isAdmin: isAdmin ? 0 : 1 } : user
      ));
    } catch (error) {
      console.error('Ошибка обновления:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="users-table">
      <div className="toolbar">
        <input
          type="text"
          placeholder="Поиск по email или телефону..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Телефон</th>
            <th>Дата регистрации</th>
            <th>Администратор</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td>{user.isAdmin ? 'Да' : 'Нет'}</td>
              <td>
                <button 
                className={`btn ${user.isAdmin ? 'btn-danger' : 'btn-success'}`}
                onClick={() => toggleAdmin(user.id, user.isAdmin)}
                >
                {user.isAdmin ? 'Убрать адм.' : 'Сделать адм.'}
                </button>
              </td>
              <td>
                <Link 
                  to={`/admin/user/${user.id}`}
                  className="btn btn-info"
                >
                  Профиль
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(user.id)}
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

export default UsersTable;