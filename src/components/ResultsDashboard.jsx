// ResultsDashboard.jsx (Restaurado y Limpio)
import React from 'react';
import './ResultsDashboard.css';
import HeatmapViewer from './HeatmapViewer';
import ForensicRadarChart from './ForensicRadarChart';
import PeritajeReport from './PeritajeReport'; 

const ResultsDashboard = ({ result, imagePreview }) => {
  return (
    <div className="results-dashboard">
      
      {/* Contenedor de Imágenes (Lado a Lado) */}
      <div className="images-container">
        
        {/* Aquí restauramos la Evidencia Recibida */}
        <div className="original-image-box">
          <h3 className="original-title">Evidencia Recibida</h3>
          <div className="original-wrapper">
            {imagePreview && <img src={imagePreview} alt="Original" className="original-img" />}
          </div>
        </div>

        {/* Aquí el Heatmap */}
        <HeatmapViewer result={result} />
      </div>

      {/* Gráfico de Araña */}
      <div className="radar-section">
        <ForensicRadarChart metricas={result.metadata?.metricas_heuristicas} />
      </div>
      
      {/* Reporte Único (Sin duplicados) */}
      <PeritajeReport 
        desglose={result.desglose_pericial} 
        id={result.id} 
        nombreArchivo={result.nombreArchivo} 
      />
      
    </div>
  );
};

export default ResultsDashboard;