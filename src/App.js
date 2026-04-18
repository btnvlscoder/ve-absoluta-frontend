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

  // f() para conectar con el backend
  const handleUpload = async () => {
    if (!file) {
      alert("Sube una imagen primero po'");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file); // El nombre 'file' debe ser igual al del Controller en Kotlin

    try {
      // Mandamos la imagen al puerto 8080 que es donde corre nuestro Spring Boot
      const response = await axios.post('http://localhost:8080/api/v1/deteccion/upload', formData);
      setResult(response.data); // Guardamos la respuesta 
    } catch (error) {
      console.error("Algo falló en la subida:", error);
      alert("Error al conectar con el servidor. Revisa si el backend está arriba.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>VE ABSOLUTA - Detector de IA</h1>
      
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? 'Analizando...' : 'Analizar Imagen'}
      </button>

      {/* Si hay resultado, lo mostramos abajo */}
      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h3>Resultado del Análisis:</h3>
          <p>Predicción: <strong>{result.prediction}</strong></p>
          <p>Confianza: {Math.round(result.confidence * 100)}%</p>
        </div>
      )}
    </div>
  );
}

export default App;