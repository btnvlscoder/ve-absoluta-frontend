import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; 
import Header from './Header';
import ControlPanel from './ControlPanel';
import ResultsDashboard from './ResultsDashboard';
import { API_BASE_URL, MAX_FILE_SIZE_BYTES, SERVER_LIMIT_BYTES, formatFileSize, showError } from '../utils/constants';

const AnalisisView = () => {
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
    if (!file) {
      alert('Sube una imagen primero');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showError(`El archivo excede el tamaño máximo permitido (10MB).`);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/analizar/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
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
        {result && (
          <ResultsDashboard 
            result={result} 
            imagePreview={imagePreview} 
          />
        )}
      </div>
    </div>
  );
};

export default AnalisisView;