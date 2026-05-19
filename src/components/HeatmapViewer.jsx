import React, { useState } from 'react';
import './HeatmapViewer.css';

const HeatmapViewer = ({ result }) => {
  const [vista, setVista] = useState('raw');

  // Definimos la justificación pericial para cada vista
  const forensicContext = {
    raw: {
      titulo: "Capa Base (Activación Semántica)",
      justificacion: "Visualización cruda de las regiones de activación del modelo Vision Transformer. Permite observar la correlación espacial global entre el sujeto y el entorno."
    },
    threshold: {
      titulo: "Análisis de Umbral (Filtro de Ruido)",
      justificacion: "Se ha aplicado un filtro de umbral para aislar únicamente las activaciones con mayor peso estadístico, eliminando el ruido de fondo y resaltando posibles áreas de manipulación por IA."
    },
    rollout: {
      titulo: "Attention Rollout (Propagación)",
      justificacion: "Visualización de la propagación de atención a través de las capas convolucionales. Crucial para detectar discontinuidades en la continuidad de las texturas y bordes del objeto analizado."
    }
  };

  const obtenerImagenActiva = () => {
    if (vista === 'threshold' && result.heatmap_threshold) return result.heatmap_threshold;
    if (vista === 'rollout' && result.heatmap_rollout) return result.heatmap_rollout;
    return result.heatmap_base64 || result.heatmap; 
  };

  return (
    <div className="heatmap-container">
      <h3 className="heatmap-title">Evidencia Analítica (Heatmap)</h3>
      
      <div className="controls-wrapper">
        <button onClick={() => setVista('raw')} className={`layer-btn ${vista === 'raw' ? 'active' : ''}`}>Capa Base</button>
        <button onClick={() => setVista('threshold')} className={`layer-btn ${vista === 'threshold' ? 'active' : ''}`}>Umbral</button>
        <button onClick={() => setVista('rollout')} className={`layer-btn ${vista === 'rollout' ? 'active' : ''}`}>Rollout</button>
      </div>

      <div className="heatmap-wrapper">
        {obtenerImagenActiva() ? (
          <img src={obtenerImagenActiva()} alt={`Heatmap - ${vista}`} className="heatmap-img" />
        ) : (
          <span className="heatmap-loading">Cargando capas visuales...</span>
        )}
      </div>

      {/* 🚀 EL DETALLE EXACTO DEL PERITAJE */}
      <div className="forensic-context">
        <h4 className="context-title">{forensicContext[vista].titulo}</h4>
        <p className="context-text">{forensicContext[vista].justificacion}</p>
      </div>
    </div>
  );
};

export default HeatmapViewer;