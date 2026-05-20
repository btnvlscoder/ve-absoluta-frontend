import React, { useState } from 'react';
import './HeatmapViewer.css'; // ¡CRÍTICO! Si falta esto, los botones se ven feos.

const HeatmapViewer = ({ result }) => {
  const [vista, setVista] = useState('raw');

  const obtenerImagenActiva = () => {
    if (vista === 'threshold' && result?.heatmap_threshold) return result.heatmap_threshold;
    if (vista === 'rollout' && result?.heatmap_rollout) return result.heatmap_rollout;
    return result?.heatmap_base64 || result?.heatmap; 
  };

  return (
    <div className="heatmap-container">
      <h3 className="heatmap-title">Evidencia Analítica (Heatmap)</h3>
      
      {/* Botones con sus clases exactas */}
      <div className="controls-wrapper">
        <button 
          onClick={() => setVista('raw')} 
          className={`layer-btn ${vista === 'raw' ? 'active' : ''}`}>
          Capa Base
        </button>
        <button 
          onClick={() => setVista('threshold')} 
          className={`layer-btn ${vista === 'threshold' ? 'active' : ''}`}>
          Umbral
        </button>
        <button 
          onClick={() => setVista('rollout')} 
          className={`layer-btn ${vista === 'rollout' ? 'active' : ''}`}>
          Rollout
        </button>
      </div>

      <div className="heatmap-wrapper">
        {obtenerImagenActiva() ? (
          <img src={obtenerImagenActiva()} alt="Heatmap" className="heatmap-img" />
        ) : (
          <span className="heatmap-loading">Cargando...</span>
        )}
      </div>
    </div>
  );
};

export default HeatmapViewer;