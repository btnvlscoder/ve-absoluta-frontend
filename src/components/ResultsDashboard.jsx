import React from 'react';
import './ResultsDashboard.css';
import HeatmapViewer from './HeatmapViewer';
import ForensicRadarChart from './ForensicRadarChart';

const ResultsDashboard = ({ result, imagePreview }) => {
  
  if (!result) {
    return <div className="loading-state">Esperando resultados del análisis...</div>;
  }

  return (
    <div className="results-dashboard">
      
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
      
      {/* 3. DETALLE DIRECTO (Backend manda, Frontend solo muestra) */}
      <div className="peritaje-directo">
        <h3>Dictamen Pericial</h3>
        
        {/* Verificamos si desglose_pericial existe para no romper el render */}
        {result.desglose_pericial ? (
          <>
            <div className="analisis-box">
              <h4>Inteligencia Artificial (ViT)</h4>
              <p>{result.desglose_pericial.analisis_ia_vit?.detalle || "Sin detalle IA"}</p>
            </div>
            <div className="analisis-box">
              <h4>Integridad Digital (ELA)</h4>
              <p>{result.desglose_pericial.analisis_ela?.detalle || "Sin detalle ELA"}</p>
            </div>
          </>
        ) : (
          <p>No se recibió el desglose pericial del backend.</p>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;