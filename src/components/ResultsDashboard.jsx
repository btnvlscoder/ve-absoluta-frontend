// ResultsDashboard.jsx (Versión final limpia)
import React from 'react';
import './ResultsDashboard.css';
import HeatmapViewer from './HeatmapViewer';
import ForensicRadarChart from './ForensicRadarChart';
import PeritajeReport from './PeritajeReport'; 

const ResultsDashboard = ({ result, imagePreview }) => {
  return (
    <div className="results-dashboard">
      {/* ... cabecera ... */}
      
      <div className="images-container">
        <HeatmapViewer result={result} />
        {/* Aquí podrías poner la imagen original */}
      </div>

      <div className="radar-section">
        <ForensicRadarChart metricas={result.metadata?.metricas_heuristicas} />
      </div>
      
      {/* Todo el texto viene del backend, nosotros solo lo pintamos */}
      <PeritajeReport 
        desglose={result.desglose_pericial} 
        id={result.id} 
        nombreArchivo={result.nombreArchivo} 
      />
    </div>
  );
};
export default ResultsDashboard;