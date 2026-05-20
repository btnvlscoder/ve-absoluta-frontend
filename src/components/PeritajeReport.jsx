import React from 'react';
import './PeritajeReport.css';

const PeritajeReport = ({ desglose, id, nombreArchivo }) => {
  if (!desglose) return null;

  // Función para determinar el color según el estado
  const getColor = (estado) => {
    switch (estado) {
      case 'SEGURO': return '#22c55e'; // Verde
      case 'ADVERTENCIA': return '#eab308'; // Amarillo/Ámbar
      case 'CRÍTICO': return '#ef4444'; // Rojo
      default: return '#64748b'; // Gris
    }
  };

  const ReportCard = ({ title, data }) => (
    <div className="report-card" style={{ borderLeft: `5px solid ${getColor(data.estado)}` }}>
      <div className="card-header">
        <span className="card-title">{title}</span>
        <span className="card-status" style={{ color: getColor(data.estado) }}>
          {data.estado}
        </span>
      </div>
      <p className="card-detail">{data.detalle}</p>
    </div>
  );

  return (
    <div className="peritaje-container">
      <h3 className="peritaje-main-title">Dictamen Pericial de Veritas AI</h3>
      <div className="report-meta">
        <span>Archivo: {nombreArchivo}</span> | <span>ID Registro: #{id}</span>
      </div>
      
      <ReportCard 
        title="Inteligencia Artificial (ViT)" 
        data={desglose.analisis_ia_vit} 
      />
      <ReportCard 
        title="Integridad de Archivo (ELA)" 
        data={desglose.analisis_ela} 
      />
    </div>
  );
};

export default PeritajeReport;