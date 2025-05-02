import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, subDays, subMonths, subYears, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import './css/AdminDashboard.css';
import OrdersTable from '../components/admin/OrdersTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  // Основная статистика
  const [stats, setStats] = useState({});
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  const [usersPeriod, setUsersPeriod] = useState('day');
  const [usersStats, setUsersStats] = useState([]);
  const [installationsPeriod, setInstallationsPeriod] = useState('day');
  const [installationsStats, setInstallationsStats] = useState([]);
  const [deliveriesPeriod, setDeliveriesPeriod] = useState('day');
  const [selectedSection, setSelectedSection] = useState('stats');
  // Статистика доставок
  const [deliveryPeriod, setDeliveryPeriod] = useState('day');
  const [specificDate, setSpecificDate] = useState('');
  const [deliveryStats, setDeliveryStats] = useState([]);


  const chartOptions = (title) => ({
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: title }
    },
    scales: { y: { beginAtZero: true } }
  });
  
  // Данные для установок
  const getInstallationsChartData = () => {
    const periodDays = { all: 365, year: 365, month: 30, week: 7 };
    const daysCount = periodDays[installationsPeriod] || 7;
    const lastDays = [...Array(daysCount)].map((_, i) => subDays(new Date(), i)).reverse();
  
    return {
      labels: lastDays.map(d => format(d, 'dd MMM', { locale: ru })),
      datasets: [{
        label: 'Установки',
        data: lastDays.map(d => 
          installationsStats.data?.filter(item => 
            format(new Date(item.date), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
          ).length || 0
        ),
        backgroundColor: '#8a2be2',
        borderRadius: 5
      }]
    };
  };
  


  // AdminDashboard.js
useEffect(() => {
  const verifyAdmin = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/verify', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (!res.ok) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAdmin');
        window.location.href = '/admin';
      }
    } catch (error) {
      console.error('Ошибка проверки:', error);
      window.location.href = '/admin';
    }
  };
  verifyAdmin();
}, []);

  // Загрузка основной статистики
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/stats?period=${period}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Ошибка:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [period]);

  const handleExportUsers = async () => {
  try {
    // Выполняем запрос на экспорт пользователей
    const response = await fetch('http://localhost:5000/api/admin/export-users', {
      headers: { 
        'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
      }
    });

    // Проверяем статус ответа
    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    // Получаем данные как Blob и имя файла
    const blob = await response.blob();
    const filename = response.headers
      .get('Content-Disposition')
      ?.split('filename=')[1]
      || 'users_export.csv';

    // Создаем временную ссылку для скачивания
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();

    // Убираем ссылку после скачивания
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

  } catch (error) {
    console.error('Ошибка экспорта пользователей:', error);
    alert('Не удалось экспортировать данные');
  }
};

useEffect(() => {
  const fetchInstallationsStats = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/installations-stats?period=${installationsPeriod}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      const data = await res.json();
      setInstallationsStats(data);
    } catch (error) {
      console.error('Ошибка загрузки статистики установок:', error);
    }
  };
  fetchInstallationsStats();
}, [installationsPeriod]);

useEffect(() => {
  const fetchDeliveriesStats = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/deliveries-stats?period=${deliveriesPeriod}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      const data = await res.json();
      setDeliveryStats(data);
    } catch (error) {
      console.error('Ошибка загрузки статистики доставок:', error);
      setDeliveryStats({ data: [] });
    }
  };
  fetchDeliveriesStats();
}, [deliveriesPeriod]);

// Обновлённая функция для графика
const getDeliveriesChartData = () => ({
  labels: deliveryStats.data?.map(item => {
    const date = new Date(item.date);
    return deliveriesPeriod === 'week' 
      ? `Неделя ${format(date, 'dd MMM', { locale: ru })}`
      : format(date, 'dd MMM', { locale: ru });
  }) || [],
  datasets: [{
    label: 'Доставки',
    data: deliveryStats.data?.map(item => item.count) || [],
    backgroundColor: '#20b2aa',
    borderRadius: 5
  }]
});


  useEffect(() => {
    const fetchUsersStats = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/users-stats?period=${usersPeriod}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }
        );
        const data = await res.json();
        setUsersStats(data);
      } catch (error) {
        console.error('Ошибка загрузки статистики пользователей:', error);
      }
    };
    fetchUsersStats();
  }, [usersPeriod]);

  // График регистраций
  const getUsersChartData = () => {
    if (!usersStats.registrationData) return { labels: [], datasets: [] };
  
    const periodDays = {
      all: 365,
      year: 365,
      month: 30,
      week: 7
    };
  
    const daysCount = periodDays[usersPeriod] || 7;
    const lastDays = [...Array(daysCount)].map((_, i) => subDays(new Date(), i)).reverse();
  
    return {
      labels: lastDays.map(d => format(d, 'dd MMM', { locale: ru })),
      datasets: [{
        label: 'Регистрации',
        data: lastDays.map(d => 
          usersStats.registrationData.filter(u => 
            format(new Date(u.createdAt), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
          ).length
        ),
        backgroundColor: '#c2486a',
        borderRadius: 5
      }]
    };
  };
  

  const getChartData = () => {
    const periodDays = {
      all: 365,
      year: 365,
      month: 30,
      week: 7
    };
  
    const daysCount = periodDays[period] || 7;
    const lastDays = [...Array(daysCount)].map((_, i) => subDays(new Date(), i)).reverse();
  
    return {
      labels: lastDays.map(d => format(d, 'dd MMM', { locale: ru })),
      datasets: [{
        label: 'Продажи',
        data: lastDays.map(d => {
          // Используем filteredOrders (stats содержит все данные)
          return stats.recentOrders?.filter(o => 
            format(new Date(o.createdAt), 'yyyy-MM-dd') === format(d, 'yyyy-MM-dd')
          ).reduce((sum, o) => sum + parseFloat(o.total), 0) || 0;
        }),
        backgroundColor: '#7448c2',
        borderRadius: 5
      }]
    };
  };
  const handleExport = async () => {
    try {
      const response = await fetch(`/api/admin/export?period=${period}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${period}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    }
  };
  const handleExportDeliveries = async () => {
    try {
      const url = new URL('http://localhost:5000/api/admin/export-deliveries');
      url.searchParams.append('period', deliveryPeriod);
      if (specificDate) url.searchParams.append('specificDate', specificDate);
      
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      
      const blob = await response.blob();
      const filename = response.headers.get('Content-Disposition').split('filename=')[1];
      
      const a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = filename || `deliveries_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(a.href);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
    }
  };
  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <h3 className="sidebar-title">Панель управления</h3>
        <ul className="sidebar-menu">
          <li 
            className={selectedSection === 'stats' ? 'active' : ''}
            onClick={() => setSelectedSection('stats')}
          >
            <i className="fas fa-chart-line"></i> Статистика
          </li>
          <li 
            className={selectedSection === 'orders' ? 'active' : ''}
            onClick={() => setSelectedSection('orders')}
          >
            <i className="fas fa-boxes"></i> Заказы
          </li>
          <li>
            <i className="fas fa-store"></i> Товары
          </li>
          <li>
            <i className="fas fa-users"></i> Пользователи
          </li>
        </ul>
        <button 
          className="logout-btn" 
          onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('isAdmin');
            window.location.href = '/';
          }}
        >
          <i className="fas fa-sign-out-alt"></i> Выход
        </button>
      </div>

      <div className="content">
        {selectedSection === 'stats' ? (
          <>
            <div className="toolbar">
              <div className="btn-group">
                <button 
                  className={`btn ${period === 'all' ? 'active' : ''}`}
                  onClick={() => setPeriod('all')}
                >
                  Все время
                </button>
                <button 
                  className={`btn ${period === 'year' ? 'active' : ''}`}
                  onClick={() => setPeriod('year')}
                >
                  Год
                </button>
                <button 
                  className={`btn ${period === 'month' ? 'active' : ''}`}
                  onClick={() => setPeriod('month')}
                >
                  Месяц
                </button>
                <button 
                  className={`btn ${period === 'week' ? 'active' : ''}`}
                  onClick={() => setPeriod('week')}
                >
                  Неделя
                </button>
              </div>
              <button className="btn btn-success" onClick={handleExport}>
                <i className="fas fa-download"></i> Экспорт
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card bg-primary">
                <h4>Выручка</h4>
                <p>{stats.totalRevenue || 0} ₽</p>
              </div>
              <div className="stat-card bg-success">
                <h4>Заказы</h4>
                <p>{stats.totalOrders || 0}</p>
              </div>
              <div className="stat-card bg-warning">
                <h4>Товары</h4>
                <p>{stats.totalProducts || 0}</p>
              </div>
              <div className="stat-card bg-danger">
                <h4>Низкий остаток</h4>
                <p>{stats.lowStock || 0}</p>
              </div>
            </div>

            <div className="chart-container">
              <Bar 
                data={getChartData()}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    title: { 
                      display: true, 
                      text: `Продажи за ${period === 'all' ? 'все время' : period === 'year' ? 'год' : period === 'month' ? 'месяц' : 'неделю'}` 
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { callback: value => `${value} ₽` }
                    }
                  }
                }}
              />
            </div>

            <div className="deliveries-section">
              <h3>📦 Доставки</h3>
              <div className="toolbar">
                <div className="btn-group">
                  <button className={`btn ${deliveriesPeriod === 'all' ? 'active' : ''}`} 
                    onClick={() => setDeliveriesPeriod('all')}>Все время</button>
                  <button className={`btn ${deliveriesPeriod === 'year' ? 'active' : ''}`} 
                    onClick={() => setDeliveriesPeriod('year')}>Год</button>
                  <button className={`btn ${deliveriesPeriod === 'month' ? 'active' : ''}`} 
                    onClick={() => setDeliveriesPeriod('month')}>Месяц</button>
                  <button className={`btn ${deliveriesPeriod === 'week' ? 'active' : ''}`} 
                    onClick={() => setDeliveriesPeriod('week')}>Неделя</button>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card bg-teal">
                  <h4>Всего доставок</h4>
                  <p>{deliveryStats.totalDeliveries || 0}</p>
                </div>
                <div className="stat-card bg-pink">
                  <h4>За текущий период</h4>
                  <p>{deliveryStats.currentPeriod || 0}</p>
                </div>
              </div>

              <div className="chart-container">
                <Bar data={getDeliveriesChartData()} options={chartOptions('Доставки')} />
              </div>
            </div>

            <div className="installations-section">
              <h3>⚙️ Установки</h3>
              <div className="toolbar">
                <div className="btn-group">
                  <button className={`btn ${installationsPeriod === 'all' ? 'active' : ''}`} 
                    onClick={() => setInstallationsPeriod('all')}>Все время</button>
                  <button className={`btn ${installationsPeriod === 'year' ? 'active' : ''}`} 
                    onClick={() => setInstallationsPeriod('year')}>Год</button>
                  <button className={`btn ${installationsPeriod === 'month' ? 'active' : ''}`} 
                    onClick={() => setInstallationsPeriod('month')}>Месяц</button>
                  <button className={`btn ${installationsPeriod === 'week' ? 'active' : ''}`} 
                    onClick={() => setInstallationsPeriod('week')}>Неделя</button>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card bg-purple">
                  <h4>Всего установок</h4>
                  <p>{installationsStats.totalInstallations || 0}</p>
                </div>
                <div className="stat-card bg-orange">
                  <h4>За текущий период</h4>
                  <p>{installationsStats.currentPeriod || 0}</p>
                </div>
              </div>

              <div className="chart-container">
                <Bar data={getInstallationsChartData()} options={chartOptions('Установки')} />
              </div>
            </div>

            <div className="users-section">
              <h3>👥 Регистрации пользователей</h3>
              <div className="toolbar">
                <div className="btn-group">
                  <button 
                    className={`btn ${usersPeriod === 'all' ? 'active' : ''}`}
                    onClick={() => setUsersPeriod('all')}
                  >
                    Все время
                  </button>
                  <button 
                    className={`btn ${usersPeriod === 'year' ? 'active' : ''}`}
                    onClick={() => setUsersPeriod('year')}
                  >
                    Год
                  </button>
                  <button 
                    className={`btn ${usersPeriod === 'month' ? 'active' : ''}`}
                    onClick={() => setUsersPeriod('month')}
                  >
                    Месяц
                  </button>
                  <button 
                    className={`btn ${usersPeriod === 'week' ? 'active' : ''}`}
                    onClick={() => setUsersPeriod('week')}
                  >
                    Неделя
                  </button>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card bg-info">
                  <h4>Всего пользователей</h4>
                  <p>{usersStats.totalUsers || 0}</p>
                </div>
                <div className="stat-card bg-secondary">
                  <h4>Новых регистраций</h4>
                  <p>{usersStats.newUsers || 0}</p>
                </div>
              </div>

              <div className="chart-container">
                <Bar 
                  data={getUsersChartData()}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: { display: false },
                      title: { 
                        display: true,
                        text: `Регистрации за ${usersPeriod === 'all' ? 'все время' : 
                          usersPeriod === 'year' ? 'год' : 
                          usersPeriod === 'month' ? 'месяц' : 'неделю'}`
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: { precision: 0 }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </>
        ) : selectedSection === 'orders' ? (
          <OrdersTable />
        ) : null}
      </div>
    </div>
  );
};

export default AdminDashboard;