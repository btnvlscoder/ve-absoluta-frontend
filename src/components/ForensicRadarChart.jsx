import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './ForensicRadarChart.css';

const ForensicRadarChart = ({ metricas }) => {
  // Fallback de seguridad en caso de que la API tarde en responder o falle
  const data = metricas || [
    { parametro: 'Patrón de Ruido', valor: 0.89, fullMark: 1 },
    { parametro: 'Frecuencia Fourier', valor: 0.81, fullMark: 1 },
    { parametro: 'Artefactos Compresión', valor: 0.0, fullMark: 1 },
    { parametro: 'Entropía Local', valor: 0.84, fullMark: 1 },
    { parametro: 'Correlación Píxeles', valor: 0.10, fullMark: 1 },
    { parametro: 'Distribución Color', valor: 0.87, fullMark: 1 },
  ];

  return (
    <div className="radar-container">
      <h3 className="radar-title">
        Análisis de Señales Forenses (Motor Heurístico)
      </h3>
      
      <div className="radar-wrapper">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis dataKey="parametro" tick={{ fill: '#cbd5e1', fontSize: 12 }} />
            <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} axisLine={false} />
            <Radar 
              name="Anomalía Física" 
              dataKey="valor" 
              stroke="#f59e0b" 
              strokeWidth={2} 
              fill="#f59e0b" 
              fillOpacity={0.4} 
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid #334155', 
                borderRadius: '8px', 
                color: '#e2e8f0' 
              }} 
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForensicRadarChart;