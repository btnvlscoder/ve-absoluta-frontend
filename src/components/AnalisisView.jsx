import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; 
import Header from './Header';
import ControlPanel from './ControlPanel';
import ResultsDashboard from './ResultsDashboard';
import { API_BASE_URL, MAX_FILE_SIZE_BYTES, SERVER_LIMIT_BYTES, formatFileSize, showError } from '../utils/constants';

import { generarNarrativaPericial } from '../utils/interpreteForense';

const AnalisisView = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Variable para almacenar el reporte dinámico si el resultado existe
  const reporteDinamico = result && result.datos_crudos_frontend 
    ? generarNarrativaPericial(result.datos_crudos_frontend) 
    : null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Sube una imagen primero');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showError(`El archivo excede el tamaño máximo permitido (10MB).`);
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_BASE_URL}/analizar/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error en la subida:', error);

      if (error.response?.status === 413) {
        showError(`La imagen es demasiado pesada (${formatFileSize(file.size)} MB). Límite: 1 MB.`);
      } else if (error.message === 'Network Error' && file.size > SERVER_LIMIT_BYTES) {
        showError(`La imagen pesa ${formatFileSize(file.size)} MB y excede el límite del servidor.`);
      } else if (error.response?.data?.mensaje) {
        showError(error.response.data.mensaje);
      } else if (error.request) {
        alert('El motor principal no responde. Verifica que el backend esté encendido.');
      } else {
        alert('Error de red inesperado.');
      }
    } finally {
      setLoading(false);
    }
  };

  const generarPDF = () => {
    window.print();
  };

  return (
    <div className="app-container">
      
      <style>
        {`
          @media screen {
            .informe-pericial-secreto {
              display: none !important;
            }
          }

          @media print {
            .vista-app-normal {
              display: none !important;
            }
            
            .informe-pericial-secreto {
              display: block !important;
              width: 100% !important;
              background: white !important;
              color: black !important;
              font-family: Arial, sans-serif !important;
              margin: 0 !important;
              padding: 0 !important;
            }

            .informe-header { border-bottom: 3px solid #1f2937; padding-bottom: 5px; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: flex-end; }
            .informe-header h1 { font-size: 22px; font-weight: bold; text-transform: uppercase; margin: 0; }
            .informe-header h2 { font-size: 13px; color: #4b5563; margin: 3px 0 0 0; }
            
            .seccion-inf { background: #f3f4f6; padding: 10px 15px; border: 1px solid #d1d5db; margin-bottom: 15px; border-radius: 4px; }
            .seccion-inf h3 { font-size: 13px; font-weight: bold; border-bottom: 1px solid #9ca3af; padding-bottom: 5px; margin-top: 0; margin-bottom: 8px; }
            .seccion-inf p { font-size: 11px; margin: 4px 0; font-family: monospace; }
            
            /* Clases Dinámicas para la Caja de Dictamen */
            .dictamen-caja { border-left: 8px solid #9ca3af; background: #f3f4f6; padding: 12px 15px; margin-bottom: 15px; }
            .dictamen-caja.red { border-left-color: #dc2626; background: #fef2f2; }
            .dictamen-caja.green { border-left-color: #16a34a; background: #f0fdf4; }
            .dictamen-caja.orange { border-left-color: #ea580c; background: #fff7ed; }
            .dictamen-caja.yellow { border-left-color: #ca8a04; background: #fefce8; }
            .dictamen-caja h3 { font-size: 15px; margin-top: 0; margin-bottom: 8px; text-transform: uppercase; }
            
            .grid-img { display: flex; justify-content: space-between; gap: 15px; margin-top: 10px; }
            .grid-img div { width: 48%; text-align: center; }
            .grid-img img { max-width: 100%; max-height: 220px; border: 2px solid #374151; object-fit: contain; }
            .grid-img p { font-size: 9px; font-weight: bold; background: #e5e7eb; padding: 4px; margin-bottom: 5px; border: 1px solid #9ca3af; }
            
            /* Estilos para los sub-bloques del reporte dinámico */
            .sub-bloque-narrativo { margin-bottom: 10px; }
            .sub-bloque-narrativo strong { display: block; font-size: 11px; color: #1f2937; margin-bottom: 2px; text-transform: uppercase; }
            .sub-bloque-narrativo p { margin: 0; font-size: 11px; line-height: 1.4; color: #374151; }

            .caja-firmas { display: flex; justify-content: space-around; margin-top: 40px; text-align: center; }
            .caja-firmas div { border-top: 2px solid black; width: 220px; padding-top: 5px; font-weight: bold; font-size: 11px; text-transform: uppercase; }
            .caja-firmas span { display: block; font-size: 9px; font-weight: normal; color: #4b5563; margin-top: 2px; }
            
            @page { margin: 0.8cm; } 
            body { background-color: white; }
          }
        `}
      </style>

      <div className="app-content vista-app-normal">
        <Header />
        <ControlPanel 
          onFileChange={handleFileChange} 
          onUpload={handleUpload} 
          loading={loading} 
        />
        
        {result && (
          <>
            <ResultsDashboard 
              result={result} 
              imagePreview={imagePreview} 
            />
            <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '30px' }}>
              <button 
                onClick={generarPDF}
                style={{ 
                  padding: '12px 24px', 
                  backgroundColor: '#1e3a8a', 
                  color: 'white', 
                  fontWeight: 'bold', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              >
                📄 Descargar Informe Pericial (PDF)
              </button>
            </div>
          </>
        )}
      </div>

      {result && (
        <div className="informe-pericial-secreto">
          
          <div className="informe-header">
            <div>
              <h1>Reporte Pericial Forense</h1>
              <h2>Análisis de Integridad Óptica y Redes Neuronales</h2>
              <h3 style={{ fontSize: '10px', color: '#1e3a8a', marginTop: '4px', marginBottom: '0' }}>SISTEMA VE ABSOLUTA v2.0</h3>
            </div>
            <div style={{ textAlign: 'right', fontSize: '10px' }}>
              <p style={{ margin: '2px 0' }}><strong>Fecha de Emisión:</strong> {new Date().toLocaleString('es-CL')}</p>
              <p style={{ margin: '2px 0' }}><strong>Solicitante:</strong> Ministerio Público - Chile</p>
            </div>
          </div>

          <div className="seccion-inf">
            <h3>I. CADENA DE CUSTODIA Y TRAZABILIDAD</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
              <p><strong>UUID Evidencia:</strong> {result.id || "No asignado (Sesión Local)"}</p>
              <p><strong>Algoritmo Core:</strong> Vision Transformer (ViT) v2.0</p>
              <p><strong>Módulo Analítico:</strong> ELA + Filtro Laplaciano</p>
              <p><strong>Estado Orquestador:</strong> CONEXIÓN CIFRADA - VÁLIDA</p>
            </div>
          </div>

          {/* CAJA DE DICTAMEN DINÁMICO */}
          <div className={`dictamen-caja ${reporteDinamico ? reporteDinamico.badge.color : (result.veredicto_final === 'REAL' ? 'green' : 'red')}`}>
            <h3 style={{ color: '#111827' }}>
              II. DICTAMEN TÉCNICO: [ {reporteDinamico ? reporteDinamico.badge.texto : result.veredicto_final} ]
            </h3>
            <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '12px', marginBottom: '10px' }}>
              <strong>Certeza Matemática Computacional:</strong> {result.confianza_global}%
            </p>
            
            {reporteDinamico ? (
              // Renderiza los 3 bloques forenses si la pasarela de datos está activa
              <div>
                {reporteDinamico.textos.map((bloque, index) => (
                  <div key={index} className="sub-bloque-narrativo">
                    <strong>{bloque.titulo}:</strong>
                    <p>{bloque.contenido}</p>
                  </div>
                ))}
              </div>
            ) : (
              // Fallback de seguridad por si falla la conexión de datos crudos
              <p style={{ fontFamily: 'Arial, sans-serif', fontSize: '11px', lineHeight: '1.4' }}>
                Conclusión Pericial: El sistema ha finalizado el análisis estructural de píxeles, entregando un veredicto de {result.veredicto_final}. Se recomienda revisión humana cruzada con el mapa de calor adjunto.
              </p>
            )}
          </div>

          <div style={{ marginTop: '15px' }}>
            <h3 style={{ borderBottom: '2px solid black', paddingBottom: '3px', fontSize: '13px', fontWeight: 'bold', marginBottom: '10px' }}>III. AUDITORÍA VISUAL (XAI)</h3>
            <div className="grid-img">
              <div>
                <p>EVIDENCIA ORIGINAL</p>
                <img src={imagePreview} alt="Original" />
              </div>
              <div>
                <p>MATRIZ DE ATENCIÓN (CAPA BASE)</p>
                <img src={result.heatmap_base64 || result.heatmap} alt="Heatmap Base" />
              </div>
            </div>
          </div>

          <div className="caja-firmas">
            <div>
              Firma Perito Informático
              <span>Brigada Investigadora del Cibercrimen PDI</span>
            </div>
            <div>
              Timbre Institucional
              <span>Validación del Sistema Judicial</span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AnalisisView;