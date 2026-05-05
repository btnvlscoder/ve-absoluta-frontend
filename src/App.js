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
      alert("Sube una imagen primero'");
      return;
    }

    // ESCUDO ANTI-CORS: Validación de tamaño en el Frontend
    // 10 MB = 10 * 1024 * 1024 bytes = 10485760 bytes
    if (file.size > 10485760) {
      alert("🚨 Alerta Forense: El archivo excede el tamaño máximo permitido (10MB). Por favor, sube una imagen más liviana.");
      return; // Cortamos la ejecución aquí, ¡el error nunca viaja al backend!
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Mandamos la imagen a url render que es donde corre nuestro Spring Boot
    const response = await axios.post('https://ve-absoluta-backend.onrender.com/api/v1/analizar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    
      setResult(response.data); 
    } catch (error) {
      console.error("Algo falló en la subida:", error);
      
      // 1. Si el servidor nos mandó un Error 413 (Payload Too Large) limpio
      if (error.response && error.response.status === 413) {
        alert(`🚨 Alerta Forense: La imagen es demasiado pesada (${(file.size / 1024 / 1024).toFixed(2)} MB). El límite actual del servidor es 1 MB.`);
      } 
      // 2. Si Tomcat dio un portazo tan fuerte que rompió el CORS (Axios tira Network Error)
      else if (error.message === 'Network Error' && file.size > 1048576) { 
        // 1048576 bytes = 1 MB (El límite actual de tu backend)
        alert(`🚨 Alerta Forense: La imagen pesa ${(file.size / 1024 / 1024).toFixed(2)} MB y excede el límite del servidor. Por favor, sube una imagen más liviana.`);
      }
      // 3. Si el backend nos mandó tu JSON bonito de Kotlin
      else if (error.response && error.response.data && error.response.data.mensaje) {
        alert(`🚨 Alerta Forense: ${error.response.data.mensaje}`);
      } 
      // 4. Si realmente el servidor está apagado
      else if (error.request) {
        alert("El motor principal no responde. Verifica que el backend esté encendido.");
      } 
      // 5. Cualquier otra cosa
      else {
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