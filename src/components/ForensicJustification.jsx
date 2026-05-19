import React from 'react';
import './ForensicJustification.css';

const ForensicJustification = ({ desglose }) => {
  if (!desglose) return null;

  return (
    <div className="forensic-justification">
      <h3 className="justification-title">Análisis Pericial Detallado</h3>
      
      <div className="justification-card">
        <div className="card-header">
          <span className="card-badge">Inteligencia Artificial (ViT)</span>
          <span className={`status ${desglose.analisis_ia_vit.estado === 'SEGURO' ? 'safe' : 'alert'}`}>
            {desglose.analisis_ia_vit.estado}
          </span>
        </div>
        <p className="card-content">{desglose.analisis_ia_vit.detalle}</p>
      </div>

      <div className="justification-card">
        <div className="card-header">
          <span className="card-badge">Integridad Digital (ELA)</span>
          <span className={`status ${desglose.analisis_ela.estado === 'SEGURO' ? 'safe' : 'alert'}`}>
            {desglose.analisis_ela.estado}
          </span>
        </div>
        <p className="card-content">{desglose.analisis_ela.detalle}</p>
      </div>
    </div>
  );
};

export default ForensicJustification;