import React from 'react';
import './ResultsDashboard.css';
import HeatmapViewer from './HeatmapViewer';
import ForensicRadarChart from './ForensicRadarChart';

const ResultsDashboard = ({ result, imagePreview }) => {
  
  if (!result) {
    return <div className="loading-state">Esperando resultados del análisis...</div>;
  }

  return (
    <div className="results-dashboard">\
      {/* 1. SECCIÓN DE CABECERA Y VEREDICTO*/}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Reporte de Evidencia Forense</h2>
        <div className="veredicto-badge">
          <span>Nivel de Certeza</span>
          <span className={`certeza ${result.veredicto_final === 'REAL' ? 'seguro' : 'critico'}`}>
            {result.confianza_global}% - {result.veredicto_final}
          </span>
        </div>
      </div>
      
      {/* 2. IMAGEN ORIGINAL (Lado a Lado) */}
      <div className="images-container">
        <div className="original-image-box">
          <h3>Evidencia Recibida</h3>
          {imagePreview ? (
            <img src={imagePreview} alt="Original" className="original-img" />
          ) : (
            <p>No hay imagen original cargada</p>
          )}
        </div>
        
        {/* HEATMAP */}
        <HeatmapViewer result={result} />
      </div>

      <div className="radar-section">
        <ForensicRadarChart metricas={result.metadata?.metricas_heuristicas} />
      </div>
      
      {/* 3. DETALLE DIRECTO DESDE EL BACKEND*/}
      <div className="peritaje-directo">
        <h3 className="peritaje-titulo">Dictamen Pericial Detallado</h3>
        {result.desglose_pericial && (
          <div className="peritaje-grid"> 
            <div className="analisis-box">
              <h4>Inteligencia Artificial (ViT)</h4>
              <p>{result.desglose_pericial.analisis_ia_vit?.detalle || "Sin datos"}</p>
            </div>
            <div className="analisis-box">
              <h4>Integridad Digital (ELA)</h4>
              <p>{result.desglose_pericial.analisis_ela?.detalle || "Sin datos"}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;