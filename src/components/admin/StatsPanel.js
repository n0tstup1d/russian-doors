import { useEffect, useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { ru } from 'date-fns/locale';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatsPanel = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center mt-5">Загрузка...</div>;

  const salesData = {
    labels: stats.recentOrders.map(o => format(new Date(o.createdAt), 'dd MMM')),
    datasets: [{
      label: 'Продажи',
      data: stats.recentOrders.map(o => parseFloat(o.total)),
      backgroundColor: '#7448c2',
      borderRadius: 5
    }]
  };

  return (
    <div className="stats-container">
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="stat-card bg-primary text-white">
            <h5>Всего заказов</h5>
            <h2>{stats.totalOrders}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-success text-white">
            <h5>Выручка</h5>
            <h2>{stats.totalRevenue.toLocaleString()} ₽</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-warning text-dark">
            <h5>Товаров</h5>
            <h2>{stats.totalProducts}</h2>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card bg-danger text-white">
            <h5>Низкий остаток</h5>
            <h2>{stats.lowStock}</h2>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <h5 className="card-title">Последние заказы</h5>
          <Bar 
            data={salesData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                title: { display: true }
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

export default StatsPanel;