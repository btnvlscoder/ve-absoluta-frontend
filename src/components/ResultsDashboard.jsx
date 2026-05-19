import React from 'react';
import './ResultsDashboard.css';
import HeatmapViewer from './HeatmapViewer';
import ForensicRadarChart from './ForensicRadarChart';
import TechnicalBreakdown from './TechnicalBreakdown';

const ResultsDashboard = ({ result, imagePreview }) => {
  // Calculamos las variables aquí adentro para no ensuciar el App.js
  const prediccionFinal = result?.veredicto_final || result?.prediccion;
  const confianzaFinal = result?.confianza_global || result?.confianza;
  const isFake = prediccionFinal === 'FAKE';
  const certezaValor = Math.round(confianzaFinal > 1 ? confianzaFinal : confianzaFinal * 100);

  return (
    <div className="results-dashboard">
      
      {/* Cabecera del Reporte */}
      <div className="results-header">
        <h2 className="results-title">Reporte de Evidencia Forense</h2>
        <div style={{ textAlign: 'right' }}>
          <span className="certeza-label">Nivel de Certeza</span>
          <div className={`certeza-value ${isFake ? 'text-fake' : 'text-real'}`}>
            {certezaValor}% - {prediccionFinal}
          </div>
        </div>
      </div>

      {/* Contenedor de Imágenes */}
      <div className="images-container">
        <div className="original-image-box">
          <h3 className="original-title">Evidencia Recibida</h3>
          <div className="original-wrapper">
            {imagePreview && <img src={imagePreview} alt="Original" className="original-img" />}
          </div>
        </div>

        <HeatmapViewer result={result} />
      </div>

      {/* Gráfico de Araña Multidimensional */}
      <div className="radar-section">
        <ForensicRadarChart metricas={result.metadata?.metricas_heuristicas} />
      </div>
      
      {/* Desglose Pericial en Texto */}
      <TechnicalBreakdown 
        desglose={result.desglose_pericial} 
        id={result.id} 
        nombreArchivo={result.nombreArchivo} 
      />
      
    </div>
  );
};

export default ResultsDashboard;