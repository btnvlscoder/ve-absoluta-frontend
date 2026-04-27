import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardamos el archivo que eligió el usuario en el input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Función para conectar con el backend
  const handleUpload = async () => {
    if (!file) {
      alert("Sube una imagen primero po'");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file); // El nombre 'file' debe ser igual al del Controller en Kotlin

    try {
      // Mandamos la imagen a url render que es donde corre nuestro Spring Boot
      const response = await axios.post('https://ve-absoluta-backend.onrender.com/api/v1/deteccion/upload', formData);
      setResult(response.data); // Guardamos la respuesta 
    } catch (error) {
      console.error("Algo falló en la subida:", error);
      alert("Error al conectar con el servidor. Revisa si el backend está arriba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>VE ABSOLUTA - Detector de IA</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input type="file" onChange={handleFileChange} />
        <button 
          onClick={handleUpload} 
          disabled={loading}
          style={{ padding: '8px 16px', cursor: loading ? 'wait' : 'pointer' }}
        >
          {loading ? 'Procesando en GPU...' : 'Analizar Imagen'}
        </button>
      </div>

      {/* Si hay resultado, lo mostramos abajo */}
      {result && (
        <div style={{ 
          marginTop: '20px', 
          border: '1px solid #ccc', 
          padding: '20px', 
          display: 'inline-block',
          textAlign: 'left',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9'
        }}>
          <h3 style={{ marginTop: '0' }}>Resultado del Análisis:</h3>
          <p>Predicción: <strong>{result.prediccion}</strong></p>
          <p>Confianza: <strong>{Math.round(result.confianza * 100)}%</strong></p>
          
          <hr style={{ borderColor: '#ddd', margin: '15px 0' }} />
          
          <p style={{ fontSize: '0.8em', color: 'gray', margin: '0' }}>
            Registro ID: #{result.id} | Archivo: {result.nombreArchivo}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;