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

      <div className="sidebar-footer" style={{ cursor: 'default' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', boxShadow: '0 0 8px #10b981' }}></div>
          <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Motor IA Conectado</span>
        </div>
        <span style={{ fontSize: '0.7rem', color: '#475569', marginTop: '5px', display: 'block' }}>v1.0.0-MVP</span>
      </div>
    </div>
  );
};

export default Sidebar;