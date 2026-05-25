import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, LayoutDashboard, History, Settings } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <ShieldAlert size={32} className="logo-icon" />
        <h2>VE ABSOLUTA</h2>
      </div>
      
      <nav className="sidebar-nav">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard Global</span>
        </Link>
        
        <Link to="/analisis" className={`nav-link ${location.pathname === '/analisis' ? 'active' : ''}`}>
          <ShieldAlert size={20} />
          <span>Nuevo Análisis</span>
        </Link>
        
        <Link to="/historial" className={`nav-link ${location.pathname === '/historial' ? 'active' : ''}`}>
          <History size={20} />
          <span>Historial de Casos</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <Settings size={20} />
        <span>Ajustes del Sistema</span>
      </div>
    </div>
  );
};

export default Sidebar;