import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './ForensicRadarChart.css';

const ForensicRadarChart = ({ metricas }) => {
  if (!metricas || metricas.length === 0) {
    return <div className="radar-placeholder">Esperando telemetría forense...</div>;
  }

const interpretarRadar = (data) => {
    // Calculamos un "score" de anomalía global en lugar de depender solo de picos altos
    const totalAnomalia = data.reduce((acc, m) => acc + m.valor, 0) / data.length;
    const picosCriticos = data.filter(m => m.valor >= 0.5); // Bajamos el umbral de 0.8 a 0.5
    
    // Si hay picos claros (>0.5) o el promedio general es inusualmente alto
    if (picosCriticos.length >= 2 || totalAnomalia > 0.35) {
      return {
        severidad: "critico",
        texto: `Se detectaron desviaciones estructurales significativas. La dispersión en ${picosCriticos[0]?.parametro || 'vectores forenses'} es incompatible con la huella técnica esperada.`
      };
    } else if (picosCriticos.length > 0 || totalAnomalia > 0.15) {
      return {
        severidad: "sospechoso",
        texto: `La evidencia presenta irregularidades leves en ${picosCriticos[0]?.parametro || 'la firma digital'}. Puede tratarse de compresión, filtros o manipulación parcial.`
      };
    } else {
      return {
        severidad: "seguro",
        texto: "Integridad matemática validada. Todos los vectores de ruido y frecuencia convergen dentro de los parámetros esperados."
      };
    }
  };

  const diagnostico = interpretarRadar(metricas);

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
              stroke={diagnostico.severidad === 'critico' ? '#ef4444' : diagnostico.severidad === 'sospechoso' ? '#f59e0b' : '#38bdf8'} 
              strokeWidth={2} 
              fill={diagnostico.severidad === 'critico' ? '#ef4444' : diagnostico.severidad === 'sospechoso' ? '#f59e0b' : '#38bdf8'} 
              fillOpacity={0.4} 
            />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Caja de diagnóstico con estilo dinámico */}
      <div className={`radar-interpretation status-${diagnostico.severidad}`}>
        <h4 className="uppercase font-bold text-sm tracking-wider mb-1">Diagnóstico de Integridad</h4>
        <p>{diagnostico.texto}</p>
      </div>
    </div>
  );
};

export default ForensicRadarChart;