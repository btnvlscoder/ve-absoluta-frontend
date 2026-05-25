import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Database, ShieldCheck, AlertTriangle } from 'lucide-react';
import { API_BASE_URL } from '../utils/constants'; 
import './DashboardGlobal.css';

const DashboardGlobal = () => {
  const [stats, setStats] = useState({ total: 0, reales: 0, fake: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Consultamos el nuevo endpoint
        const response = await axios.get(`${API_BASE_URL}/analizar/estadisticas`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error cargando estadísticas:", err);
        setError("Error de conexión con el motor central VE ABSOLUTA.");
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="dashboard-loading">Cargando telemetría global...</div>;
  if (error) return <div className="dashboard-error">{error}</div>;

  // Datos para el gráfico de torta
  const pieData = [
    { name: 'Contenido Real', value: stats.reales },
    { name: 'Generado por IA', value: stats.fake },
  ];

  // Colores idénticos a tu referencia (Verde y Rojo neón)
  const COLORS = ['#4ade80', '#f87171']; 

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard Global de Amenazas</h1>
        <p>Visión general de la integridad digital analizada por VE ABSOLUTA.</p>
      </div>

      {/* --- SECCIÓN 1: TARJETAS KPI --- */}
      <div className="kpi-grid">
        <div className="kpi-card total">
          <div className="kpi-icon"><Database size={32} /></div>
          <div className="kpi-data">
            <h3>Total Analizado</h3>
            <p className="kpi-value">{stats.total}</p>
            <p className="kpi-subtitle">Registros en base de datos</p>
          </div>
        </div>

        <div className="kpi-card real">
          <div className="kpi-icon"><ShieldCheck size={32} /></div>
          <div className="kpi-data">
            <h3>Total Reales</h3>
            <p className="kpi-value">{stats.reales}</p>
            <p className="kpi-subtitle">Firmas ópticas verificadas</p>
          </div>
        </div>

        <div className="kpi-card fake">
          <div className="kpi-icon"><AlertTriangle size={32} /></div>
          <div className="kpi-data">
            <h3>Detecciones IA</h3>
            <p className="kpi-value">{stats.fake}</p>
            <p className="kpi-subtitle">Contenido manipulado</p>
          </div>
        </div>
      </div>

      {/* --- SECCIÓN 2: GRÁFICOS --- */}
      <div className="charts-grid">
        <div className="chart-wrapper pie-chart-section">
          <h3>Distribución de Integridad</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70} // Efecto Donut
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
                itemStyle={{ color: '#e2e8f0' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Aquí podríamos poner el gráfico de barras después */}
        <div className="chart-wrapper bar-chart-placeholder">
           <h3>Nivel de Amenaza (Últimos 7 días)</h3>
           <div style={{color: '#94a3b8', textAlign: 'center', paddingTop: '100px'}}>Implementación pendiente</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardGlobal;