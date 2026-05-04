import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Guardamos el archivo que eligió el usuario en el input
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null); // Limpiamos el resultado anterior al elegir nueva foto
  };

  // Función para conectar con el backend
  const handleUpload = async () => {
    if (!file) {
      alert("Sube una imagen primero po'");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Mandamos la imagen a url render que es donde corre nuestro Spring Boot
      const response = await axios.post('https://ve-absoluta-backend.onrender.com/api/v1/analizar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setResult(response.data); 
    } catch (error) {
      console.error("Algo falló en la subida:", error);
      
      // Escuchamos el GlobalExceptionHandler de Kotlin
      if (error.response && error.response.data && error.response.data.mensaje) {
        // Si el backend nos mandó un error estructurado, lo mostramos
        alert(`🚨 Alerta Forense: ${error.response.data.mensaje}`);
      } else if (error.request) {
        // Si la petición salió pero el servidor nunca respondió (está apagado o cayó)
        alert("El motor principal no responde. Verifica que el backend esté encendido.");
      } else {
        // Error de configuración de Axios o red
        alert("Error de red inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>VE ABSOLUTA - Detector de IA</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <input type="file" onChange={handleFileChange} accept="image/jpeg, image/png, image/webp" />
        <button 
          onClick={handleUpload} 
          disabled={loading}
          style={{ padding: '8px 16px', cursor: loading ? 'wait' : 'pointer', marginLeft: '10px' }}
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
          backgroundColor: '#f9f9f9',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: '0', color: '#333' }}>Resultado del Análisis:</h3>
          <p style={{ fontSize: '1.1em' }}>
            Predicción: <strong style={{ color: result.prediccion === 'FAKE' ? '#d9534f' : '#28a745' }}>
              {result.prediccion}
            </strong>
          </p>
          <p style={{ fontSize: '1.1em' }}>
            Confianza: <strong>{Math.round(result.confianza * 100)}%</strong>
          </p>
          
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