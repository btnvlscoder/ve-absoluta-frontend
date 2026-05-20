import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './ForensicRadarChart.css';

const ForensicRadarChart = ({ metricas }) => {
  // 1. Si no hay métricas, devolvemos null o un mensaje.
  if (!metricas || metricas.length === 0) {
    return <div className="radar-placeholder">Esperando telemetría forense...</div>;
  }

  // 2. Interpretación dinámica (La que definimos hace un rato)
  const interpretarRadar = (data) => {
    const esSospechoso = data.some(m => m.valor > 0.65);
    return esSospechoso 
      ? "El análisis detectó irregularidades en la estructura de píxeles. Estas anomalías son consistentes con procesos de manipulación digital."
      : "La integridad matemática de la imagen es óptima. Los valores se encuentran dentro de los rangos estadísticos de una fotografía natural.";
  };

  return (
    <div className="radar-container">
      <h3 className="radar-title">Análisis de Integridad Matemática</h3>
      
      <div className="radar-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={metricas}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis dataKey="parametro" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
            <Radar 
              name="Firma Digital" 
              dataKey="valor" 
              stroke="#38bdf8" 
              strokeWidth={2} 
              fill="#38bdf8" 
              fillOpacity={0.4} 
            />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* 3. DIAGNÓSTICO INTELIGENTE */}
      <div className="radar-interpretation">
        <h4>Diagnóstico de Integridad</h4>
        <p>{interpretarRadar(metricas)}</p>
      </div>
    </div>
  );
};

export default ForensicRadarChart;