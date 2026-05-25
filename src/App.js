import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout'; 
import DashboardGlobal from './components/DashboardGlobal';
import AnalisisView from './components/AnalisisView'; 
import HistorialCasos from './components/HistorialCasos';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardGlobal />} />
          <Route path="analisis" element={<AnalisisView />} />
          <Route path="historial" element={<HistorialCasos />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;