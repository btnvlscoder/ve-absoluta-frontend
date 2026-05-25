import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './MainLayout'; // Tu nuevo cascarón con el Sidebar

// Vistas
import DashboardGlobal from './DashboardGlobal';
import AnalisisView from './AnalisisView'; // El que acabas de renombrar
import HistorialCasos from './HistorialCasos';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* MainLayout envuelve todas las rutas para que el menú siempre esté visible */}
        <Route path="/" element={<MainLayout />}>
          
          {/* Rutas internas que se inyectan en el <Outlet /> del MainLayout */}
          <Route index element={<DashboardGlobal />} />
          <Route path="analisis" element={<AnalisisView />} />
          <Route path="historial" element={<HistorialCasos />} />
          
          {/* Ruta por defecto por si alguien escribe una URL que no existe */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;