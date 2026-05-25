import React from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="layout-container">
      <Sidebar />
      <div className="main-content">
        {/* Aquí se inyectarán las diferentes pantallas (Dashboard, Nuevo Análisis, etc.) */}
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;