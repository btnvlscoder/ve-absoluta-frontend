import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // Nuevo estado para ver la foto original
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Creamos una URL temporal para mostrar la imagen en el panel antes de subirla
      setImagePreview(URL.createObjectURL(selectedFile));
      setResult(null); 
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Sube una imagen primero");
      return;
    }

    if (file.size > 10485760) {
      alert("🚨 Alerta Forense: El archivo excede el tamaño máximo permitido (10MB).");
      return; 
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('https://ve-absoluta-backend.onrender.com/api/v1/analizar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      setResult(response.data); 
    } catch (error) {
      console.error("Algo falló en la subida:", error);
      if (error.response && error.response.status === 413) {
        alert(`🚨 Alerta Forense: La imagen es demasiado pesada (${(file.size / 1024 / 1024).toFixed(2)} MB). Límite: 1 MB.`);
      } else if (error.message === 'Network Error' && file.size > 1048576) { 
        alert(`🚨 Alerta Forense: La imagen pesa ${(file.size / 1024 / 1024).toFixed(2)} MB y excede el límite del servidor.`);
      } else if (error.response && error.response.data && error.response.data.mensaje) {
        alert(`🚨 Alerta Forense: ${error.response.data.mensaje}`);
      } else if (error.request) {
        alert("El motor principal no responde. Verifica que el backend esté encendido.");
      } else {
        alert("Error de red inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Variables calculadas para soportar la transición entre el JSON viejo y el nuevo
  const prediccionFinal = result?.veredicto_final || result?.prediccion;
  const confianzaFinal = result?.confianza_global || result?.confianza;
  const isFake = prediccionFinal === 'FAKE';

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#e2e8f0', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* CABECERA */}
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ color: '#22d3ee', fontSize: '2.5rem', letterSpacing: '2px', margin: '0 0 10px 0' }}>VE ABSOLUTA</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', margin: 0 }}>Terminal de Auditoría Forense Sintética</p>
        </header>
        
        {/* PANEL DE CONTROL (INPUT Y BOTÓN) */}
        <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <input 
            type="file" 
            onChange={handleFileChange} 
            accept="image/jpeg, image/png, image/webp"
            style={{ color: '#cbd5e1' }}
          />
          <button 
            onClick={handleUpload} 
            disabled={loading}
            style={{ 
              backgroundColor: loading ? '#475569' : '#0ea5e9', 
              color: 'white', 
              padding: '12px 24px', 
              border: 'none', 
              borderRadius: '8px', 
              fontWeight: 'bold',
              cursor: loading ? 'wait' : 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {loading ? 'Analizando en Nodo GPU...' : 'Ejecutar Análisis'}
          </button>
        </div>

        {/* PANEL DE RESULTADOS */}
        {result && (
          <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}>
            
            {/* Título de Resultados */}
            <div style={{ padding: '20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, color: '#e2e8f0' }}>Reporte de Evidencia</h2>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Nivel de Certeza</span>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', color: isFake ? '#ef4444' : '#22c55e' }}>
                  {Math.round(confianzaFinal * 100)}% - {prediccionFinal}
                </div>
              </div>
            </div>

            {/* Comparador de Imágenes */}
            <div style={{ display: 'flex', gap: '20px', padding: '20px', backgroundColor: '#0f172a' }}>
              {/* Imagen Original */}
              <div style={{ flex: 1, backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ textAlign: 'center', margin: '0 0 15px 0', color: '#94a3b8', fontSize: '1rem' }}>Evidencia Recibida</h3>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: '6px' }}>
                  {imagePreview && <img src={imagePreview} alt="Original" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />}
                </div>
              </div>

              {/* Mapa de Calor ViT */}
              <div style={{ flex: 1, backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', border: '1px solid #334155' }}>
                <h3 style={{ textAlign: 'center', margin: '0 0 15px 0', color: '#22d3ee', fontSize: '1rem' }}>Mapa de Atención (Heatmap)</h3>
                <div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', borderRadius: '6px' }}>
                  {result.heatmap_base64 ? (
                    <img src={result.heatmap_base64} alt="Heatmap" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                  ) : (
                    <span style={{ color: '#475569' }}>{result.heatmap_base64 === undefined ? 'Heatmap no disponible en la API actual' : 'Generando...'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Metadatos (JSON antiguo) o Desglose Pericial (JSON nuevo) */}
            <div style={{ padding: '20px' }}>
              {result.desglose_pericial ? (
                // Vista del Nuevo Súper JSON
                <div>
                  <h4 style={{ color: '#38bdf8', borderBottom: '1px solid #334155', paddingBottom: '10px' }}>Análisis Detallado</h4>
                  <p style={{ margin: '10px 0', color: '#cbd5e1' }}><strong>ViT:</strong> {result.desglose_pericial.analisis_ia_vit?.detalle}</p>
                  <p style={{ margin: '10px 0', color: '#cbd5e1' }}><strong>ELA:</strong> {result.desglose_pericial.analisis_ela?.detalle}</p>
                </div>
              ) : (
                // Vista del JSON antiguo (para que no se rompa mientras actualizas Spring Boot)
                <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                  Registro ID: #{result.id} | Archivo Procesado: {result.nombreArchivo}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default App;