import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HistorialCasos.css';
import { API_BASE_URL } from '../utils/constants';

const HistorialCasos = () => {
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analizar/historial`);
        setHistorial(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar el historial:", err);
        setError("No se pudo conectar con el servidor central.");
        setLoading(false);
      }
    };

    fetchHistorial();
  }, []);

  if (loading) return <div className="historial-loading">Cargando base de datos forense...</div>;
  if (error) return <div className="historial-error">{error}</div>;

  return (
    <div className="historial-container">
      <div className="historial-header">
        <h2>Registro de Evidencias</h2>
        <p>Total de casos analizados: {historial.length}</p>
      </div>

      <div className="table-wrapper">
        <table className="forense-table">
          <thead>
            <tr>
              <th>ID Caso</th>
              <th>Evidencia</th>
              <th>Fecha de Análisis</th>
              <th>Certeza IA</th>
              <th>Dictamen Final</th>
            </tr>
          </thead>
          <tbody>
            {historial.map((caso) => (
              <tr key={caso.id}>
                <td>#{caso.id}</td>
                <td>
                  <img 
                    // Usamos rutaArchivo tal como viene de Spring Boot
                    src={caso.rutaArchivo || '/placeholder-forense.png'} 
                    alt="Evidencia" 
                    className="thumbnail" 
                    onError={(e) => { e.target.src = '/placeholder-forense.png'; }}
                  />
                </td>
                <td>{new Date(caso.fecha).toLocaleDateString()}</td>
                
                {/* Multiplicamos por 100 y dejamos 2 decimales para la vista */}
                <td>{(caso.confianza * 100).toFixed(2)}%</td>
                
                <td>
                    <span className={`badge ${
                        // Usamos prediccion tal como viene de Spring Boot
                        (caso.prediccion && caso.prediccion.trim().toUpperCase() === 'REAL') 
                        ? 'badge-real' 
                        : 'badge-fake'
                    }`}>
                        {caso.prediccion}
                    </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistorialCasos;