import React, { useState } from 'react';
import './HeatmapViewer.css';

const VISTA_RAW = 'raw';
const VISTA_THRESHOLD = 'threshold';
const VISTA_ROLLOUT = 'rollout';

const HeatmapViewer = ({ result }) => {
  const [vista, setVista] = useState(VISTA_RAW);

  const obtenerImagenActiva = () => {
    if (vista === VISTA_THRESHOLD && result?.heatmap_threshold) return result.heatmap_threshold;
    if (vista === VISTA_ROLLOUT && result?.heatmap_rollout) return result.heatmap_rollout;
    return result?.heatmap_base64 || result?.heatmap;
  };

  const imagenActiva = obtenerImagenActiva();

  return (
    <div className="heatmap-container">
      <h3 className="heatmap-title">Evidencia Analítica (Heatmap)</h3>
      
      <div className="controls-wrapper">
        <button 
          onClick={() => setVista(VISTA_RAW)} 
          className={`layer-btn ${vista === VISTA_RAW ? 'active' : ''}`}>
          Capa Base
        </button>
        <button 
          onClick={() => setVista(VISTA_THRESHOLD)} 
          className={`layer-btn ${vista === VISTA_THRESHOLD ? 'active' : ''}`}>
          Umbral
        </button>
        <button 
          onClick={() => setVista(VISTA_ROLLOUT)} 
          className={`layer-btn ${vista === VISTA_ROLLOUT ? 'active' : ''}`}>
          Rollout
        </button>
      </div>

      <div className="heatmap-wrapper">
        {imagenActiva ? (
          <img src={imagenActiva} alt="Heatmap" className="heatmap-img" />
        ) : (
          <span className="heatmap-loading">Cargando...</span>
        )}
      </div>
    </div>
  );
};

export default HeatmapViewer;