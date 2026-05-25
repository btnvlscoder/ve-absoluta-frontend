<<<<<<< HEAD
import React, { useState } from 'react';
import axios from 'axios';
<<<<<<< HEAD
import './App.css'; // Tu CSS principal

import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import HeatmapViewer from './components/HeatmapViewer';
import TechnicalBreakdown from './components/TechnicalBreakdown';
=======
import './index.css'; 
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ResultsDashboard from './components/ResultsDashboard';

const API_BASE_URL = 'https://ve-absoluta-backend.onrender.com/api/v1';
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const SERVER_LIMIT_BYTES = 1 * 1024 * 1024;

const formatFileSize = (bytes) => (bytes / 1024 / 1024).toFixed(2);
>>>>>>> 6dc108a9540a1400c1cdf1af368075ce9c836e55

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const showError = (message) => alert(`Alerta Forense: ${message}`);

  const handleUpload = async () => {
<<<<<<< HEAD
    if (!file) return alert("Sube una imagen primero");
    if (file.size > 10485760) return alert("🚨 Alerta Forense: El archivo excede el tamaño máximo permitido (10MB).");
=======
    if (!file) {
      alert('Sube una imagen primero');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showError(`El archivo excede el tamaño máximo permitido (10MB).`);
      return;
    }
>>>>>>> 6dc108a9540a1400c1cdf1af368075ce9c836e55

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
<<<<<<< HEAD
      const response = await axios.post('https://ve-absoluta-backend.onrender.com/api/v1/analizar/upload', formData, {
=======
      const response = await axios.post(`${API_BASE_URL}/analizar/upload`, formData, {
>>>>>>> 6dc108a9540a1400c1cdf1af368075ce9c836e55
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
<<<<<<< HEAD
      console.error("Algo falló en la subida:", error);
      alert("Fallo en la comunicación con el servidor. Revisa la consola para más detalles.");
=======
      console.error('Error en la subida:', error);

      if (error.response?.status === 413) {
        showError(`La imagen es demasiado pesada (${formatFileSize(file.size)} MB). Límite: 1 MB.`);
      } else if (error.message === 'Network Error' && file.size > SERVER_LIMIT_BYTES) {
        showError(`La imagen pesa ${formatFileSize(file.size)} MB y excede el límite del servidor.`);
      } else if (error.response?.data?.mensaje) {
        showError(error.response.data.mensaje);
      } else if (error.request) {
        alert('El motor principal no responde. Verifica que el backend esté encendido.');
      } else {
        alert('Error de red inesperado.');
      }
>>>>>>> 6dc108a9540a1400c1cdf1af368075ce9c836e55
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const prediccionFinal = result?.veredicto_final || result?.prediccion;
  const confianzaFinal = result?.confianza_global || result?.confianza;
  const isFake = prediccionFinal === 'FAKE';
  const certezaValor = Math.round(confianzaFinal > 1 ? confianzaFinal : confianzaFinal * 100);

  return (
    <div className="app-container">
      <div className="app-content">
        
        <Header />
        
=======
  return (
    <div className="app-container">
      <div className="app-content">
        <Header />
>>>>>>> 6dc108a9540a1400c1cdf1af368075ce9c836e55
        <ControlPanel 
          onFileChange={handleFileChange} 
          onUpload={handleUpload} 
          loading={loading} 
        />
<<<<<<< HEAD

        {result && (
          <div className="results-dashboard">
            
            <div className="results-header">
              <h2 className="results-title">Reporte de Evidencia Forense</h2>
              <div style={{ textAlign: 'right' }}>
                <span className="certeza-label">Nivel de Certeza</span>
                <div className={`certeza-value ${isFake ? 'text-fake' : 'text-real'}`}>
                  {certezaValor}% - {prediccionFinal}
                </div>
              </div>
            </div>

            <div className="images-container">
              <div className="original-image-box">
                <h3 className="original-title">Evidencia Recibida</h3>
                <div className="original-wrapper">
                  {imagePreview && <img src={imagePreview} alt="Original" className="original-img" />}
                </div>
              </div>

              <HeatmapViewer result={result} />
            </div>

            <TechnicalBreakdown desglose={result.desglose_pericial} id={result.id} nombreArchivo={result.nombreArchivo} />
            
          </div>
=======
        {result && (
          <ResultsDashboard 
            result={result} 
            imagePreview={imagePreview} 
          />
>>>>>>> 6dc108a9540a1400c1cdf1af368075ce9c836e55
        )}
      </div>
    </div>
=======
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
>>>>>>> e0b60773553b89d567eabe5c0b62b3046eaae579
  );
};

export default App;