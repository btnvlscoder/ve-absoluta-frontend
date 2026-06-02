import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import './ForensicRadarChart.css';

const ForensicRadarChart = ({ metricas }) => {
  if (!metricas || metricas.length === 0) {
    return <div className="radar-placeholder">Esperando telemetría forense...</div>;
  }

  const interpretarRadar = (data) => {
    // Clasificamos los picos de anomalía
    const criticos = data.filter(m => m.valor >= 0.8);
    const sospechosos = data.filter(m => m.valor >= 0.6 && m.valor < 0.8);
    const totalAnomalos = criticos.length + sospechosos.length;

    // Generamos la narrativa dinámica
    if (criticos.length >= 2 || totalAnomalos >= 3) {
      return {
        severidad: "critico",
        texto: `Desviación matemática severa. Se identificaron múltiples vectores anómalos (destacando ${criticos[0]?.parametro || sospechosos[0]?.parametro}). La dispersión estructural es incompatible con la física de un sensor real, indicando manipulación profunda o síntesis.`
      };
    } else if (totalAnomalos > 0) {
      return {
        severidad: "sospechoso",
        texto: `Irregularidades estructurales localizadas. Se detectó actividad inusual en ${sospechosos[0]?.parametro || criticos[0]?.parametro}. Esto es consistente con compresión agresiva (ej. redes sociales), filtros digitales o alteraciones parciales.`
      };
    } else {
      return {
        severidad: "seguro",
        texto: "Integridad matemática validada. Los vectores de frecuencia, ruido y entropía convergen dentro de los parámetros estadísticos esperados para una captura óptica natural."
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