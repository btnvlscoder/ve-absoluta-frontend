import React from 'react';
import './ResultsDashboard.css';
import HeatmapViewer from './HeatmapViewer';
import ForensicRadarChart from './ForensicRadarChart';

const ResultsDashboard = ({ result, imagePreview }) => {
  // Verificación de seguridad básica
  if (!result || !result.desglose_pericial) return null;

  return (
    <div className="results-dashboard">
      
      <div className="images-container">
        {/* Imagen Original */}
        <div className="original-image-box">
          <h3>Evidencia Recibida</h3>
          {imagePreview && <img src={imagePreview} alt="Original" />}
        </div>
        
        {/* Heatmap */}
        <HeatmapViewer result={result} />
      </div>

      <div className="radar-section">
        <ForensicRadarChart metricas={result.metadata?.metricas_heuristicas} />
      </div>
      

      <div className="peritaje-directo">
        <h3>Dictamen Pericial</h3>
        <div className="analisis-box">
          <h4>Inteligencia Artificial (ViT)</h4>
          <p>{result.desglose_pericial.analisis_ia_vit.detalle}</p>
        </div>
        <div className="analisis-box">
          <h4>Integridad Digital (ELA)</h4>
          <p>{result.desglose_pericial.analisis_ela.detalle}</p>
        </div>
      </div>
      
    </div>
  );
};

export default ResultsDashboard;