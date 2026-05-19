import React, { useState } from 'react';
import './HeatmapViewer.css';

const HeatmapViewer = ({ result }) => {
  const [vista, setVista] = useState('raw');

  const obtenerImagenActiva = () => {
    if (vista === 'threshold' && result.heatmap_threshold) return result.heatmap_threshold;
    if (vista === 'rollout' && result.heatmap_rollout) return result.heatmap_rollout;
    return result.heatmap_base64 || result.heatmap; 
  };

  return (
    <div className="heatmap-container">
      <h3 className="heatmap-title">Evidencia Analítica (Heatmap)</h3>
      
      <div className="controls-wrapper">
        <button 
          onClick={() => setVista('raw')} 
          className={`layer-btn ${vista === 'raw' ? 'active' : 'inactive'}`}
        >
          Capa Base
        </button>
        <button 
          onClick={() => setVista('threshold')} 
          className={`layer-btn ${vista === 'threshold' ? 'active' : 'inactive'}`}
        >
          Umbral
        </button>
        <button 
          onClick={() => setVista('rollout')} 
          className={`layer-btn ${vista === 'rollout' ? 'active' : 'inactive'}`}
        >
          Rollout
        </button>
      </div>

      <div className="heatmap-wrapper">
        {obtenerImagenActiva() ? (
          <img src={obtenerImagenActiva()} alt={`Heatmap - ${vista}`} className="heatmap-img" />
        ) : (
          <span className="heatmap-loading">Cargando capas visuales...</span>
        )}
      </div>
    </div>
  );
};

export default HeatmapViewer;