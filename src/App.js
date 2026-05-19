import React, { useState } from 'react';
import axios from 'axios';
import './index.css'; 
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ResultsDashboard from './components/ResultsDashboard';

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

  const handleUpload = async () => {
    if (!file) return alert("Sube una imagen primero");
    if (file.size > 10485760) return alert("Alerta Forense: El archivo excede el tamaño máximo permitido (10MB).");

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://ve-absoluta-backend.onrender.com/api/v1/analizar/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data); 
    } catch (error) {
      console.error("Algo falló en la subida:", error);
      if (error.response && error.response.status === 413) {
        alert(`Alerta Forense: La imagen es demasiado pesada (${(file.size / 1024 / 1024).toFixed(2)} MB). Límite: 1 MB.`);
      } else if (error.message === 'Network Error' && file.size > 1048576) { 
        alert(`Alerta Forense: La imagen pesa ${(file.size / 1024 / 1024).toFixed(2)} MB y excede el límite del servidor.`);
      } else if (error.response?.data?.mensaje) {
        alert(`Alerta Forense: ${error.response.data.mensaje}`);
      } else if (error.request) {
        alert("El motor principal no responde. Verifica que el backend esté encendido.");
      } else {
        alert("Error de red inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        
        <Header />
        
        <ControlPanel 
          onFileChange={handleFileChange} 
          onUpload={handleUpload} 
          loading={loading} 
        />

        {/* El orquestador visual toma el control aquí */}
        {result && (
          <ResultsDashboard 
            result={result} 
            imagePreview={imagePreview} 
          />
        )}
        
      </div>
    </div>
  );
}

export default App;