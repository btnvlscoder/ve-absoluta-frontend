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
                  <img src={caso.ruta_archivo || caso.url_imagen} alt="Evidencia" className="thumbnail" />
                </td>
                <td>{new Date(caso.fecha_analisis || caso.fecha).toLocaleDateString()}</td>
                <td>{caso.confianza_global}%</td>
                <td>
                    <span className={`badge ${
                        (caso.veredicto_final && caso.veredicto_final.trim().toUpperCase() === 'REAL') 
                        ? 'badge-real' 
                        : 'badge-fake'
                    }`}>
                        {caso.veredicto_final}
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