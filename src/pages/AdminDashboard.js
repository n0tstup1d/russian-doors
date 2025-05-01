import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { ru } from 'date-fns/locale';
import './css/AdminDashboard.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [period, setPeriod] = useState('all');
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/stats?period=${period}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        
        
        // Если статус ответа не OK, выбрасываем ошибку
        if (!res.ok) throw new Error(`Ошибка HTTP: ${res.status}`);
        
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Ошибка:', error);
        setStats({});
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [period]);
  

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
  return (
    <div className="admin-dashboard-container">
      <div className="sidebar">
        <h3 className="sidebar-title">Панель управления</h3>
        <ul className="sidebar-menu">
          <li className="active">
            <i className="fas fa-chart-line"></i> Статистика
          </li>
          <li>
            <i className="fas fa-boxes"></i> Заказы
          </li>
          <li>
            <i className="fas fa-store"></i> Товары
          </li>
          <li>
            <i className="fas fa-users"></i> Пользователи
          </li>
        </ul>
        <button className="logout-btn" onClick={() => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('isAdmin');
          window.location.href = '/';
        }}>
          <i className="fas fa-sign-out-alt"></i> Выход
        </button>
      </div>

      <div className="content">
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
      </div>
    </div>
  );
};

export default AdminDashboard;