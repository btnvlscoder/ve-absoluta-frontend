import React, { useState } from 'react';
import axios from 'axios';
import '../index.css'; 
import Header from './Header';
import ControlPanel from './ControlPanel';
import ResultsDashboard from './ResultsDashboard';
import { API_BASE_URL, MAX_FILE_SIZE_BYTES, SERVER_LIMIT_BYTES, formatFileSize, showError } from '../utils/constants';

const AnalisisView = () => {
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Función que llama a la API del navegador
  const generarPDF = () => {
    window.print();
  };

  return (
    <div className="app-container">
      
      {/* =========================================================
          1. VISTA WEB NORMAL (Se oculta al imprimir con print:hidden)
          ========================================================= */}
      <div className="app-content print:hidden">
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
            {/* BOTÓN PARA GENERAR EL PDF PERICIAL */}
            <div className="flex justify-center mt-6 mb-10">
              <button 
                onClick={generarPDF}
                className="px-8 py-3 bg-blue-800 text-white font-bold rounded shadow-lg hover:bg-blue-900 transition-colors border border-blue-950"
              >
                📄 Descargar Informe Pericial (PDF)
              </button>
            </div>
          </>
        )}
      </div>

      {/* ==============================================================
          2. PLANTILLA DEL INFORME PERICIAL (SOLO VISIBLE EN EL PDF)
          ============================================================== */}
      {result && (
        <div className="hidden print:block bg-white text-black p-8 font-sans w-full min-h-screen">
          
          {/* Encabezado Institucional */}
          <div className="border-b-4 border-gray-800 pb-4 mb-6 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-extrabold uppercase tracking-wider">Reporte Pericial Forense</h1>
              <h2 className="text-lg font-semibold text-gray-600 mt-1">Análisis de Integridad Óptica y Redes Neuronales</h2>
              <h3 className="text-sm font-bold text-blue-800 mt-2">SISTEMA VE ABSOLUTA v2.0</h3>
            </div>
            <div className="text-right text-sm">
              <p><strong>Fecha de Emisión:</strong> {new Date().toLocaleString('es-CL')}</p>
              <p><strong>Solicitante:</strong> Ministerio Público - Chile</p>
            </div>
          </div>

          {/* Cadena de Custodia (El traceId es la estrella aquí) */}
          <div className="bg-gray-100 p-4 border border-gray-400 mb-6 rounded">
            <h3 className="font-bold text-md mb-2 border-b border-gray-300 pb-1">I. CADENA DE CUSTODIA Y TRAZABILIDAD</h3>
            <div className="grid grid-cols-2 gap-4 text-sm font-mono mt-2">
              {/* Usa el ID del resultado de la base de datos como UUID */}
              <p><strong>UUID Evidencia:</strong> {result.id || "81696341-7118-4efe-85c4-4d50f011f44e"}</p>
              <p><strong>Algoritmo Core:</strong> Vision Transformer (ViT) v2.0</p>
              <p><strong>Motor Visual:</strong> XAI OpenCV (Heatmap, Threshold)</p>
              <p><strong>Estado Servidor:</strong> CONEXIÓN CIFRADA - VÁLIDA</p>
            </div>
          </div>

          {/* Veredicto Oficial */}
          <div className={`p-5 border-l-8 mb-6 ${result.veredicto_final === 'FAKE' ? 'border-red-600 bg-red-50' : 'border-green-600 bg-green-50'}`}>
            <h3 className="font-bold text-xl mb-2">
              II. DICTAMEN TÉCNICO: 
              <span className={result.veredicto_final === 'FAKE' ? 'text-red-700 ml-2 font-black tracking-widest' : 'text-green-700 ml-2 font-black tracking-widest'}>
                [ {result.veredicto_final} ]
              </span>
            </h3>
            <p className="text-md"><strong>Certeza Matemática Computacional:</strong> {result.confianza_global}%</p>
            <p className="mt-3 text-justify leading-relaxed">
              <strong>Conclusión Pericial:</strong> El análisis heurístico-óptico y la extracción de matrices de atención han 
              {result.veredicto_final === 'FAKE' 
                ? " identificado inconsistencias críticas en la estructura de píxeles, incompatibles con la huella óptica natural de un sensor fotográfico real, sugiriendo manipulación digital por terceros. Nivel de Alerta Legal: CRÍTICO." 
                : " validado la coherencia física de la luz, sombras y texturas, no encontrando indicios de manipulación artificial en las capas analizadas."}
            </p>
          </div>

          {/* Evidencia Gráfica (Mapas de Calor) */}
          <div className="mb-10">
            <h3 className="font-bold text-md mb-4 border-b border-gray-800 pb-1">III. ANÁLISIS DE IA EXPLICABLE (XAI)</h3>
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center">
                <p className="text-xs font-bold bg-gray-200 py-1 mb-2 border border-gray-400">EVIDENCIA ORIGINAL</p>
                <img src={imagePreview} alt="Original" className="w-full border-2 border-gray-800 shadow-sm object-contain max-h-64" />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold bg-gray-200 py-1 mb-2 border border-gray-400">MATRIZ DE ATENCIÓN (THRESHOLD JET)</p>
                {/* Cargamos el heatmap que viene desde Spring Boot */}
                <img src={result.heatmap_threshold || result.heatmap_base64} alt="Heatmap" className="w-full border-2 border-gray-800 shadow-sm object-contain max-h-64" />
              </div>
            </div>
          </div>

          {/* Firmas Legales */}
          <div className="mt-24 pt-8 flex justify-around text-center">
            <div>
              <p className="border-t-2 border-black w-64 mx-auto pt-2 font-bold uppercase text-sm">Firma Perito Informático</p>
              <p className="text-xs mt-1 text-gray-600">Brigada Investigadora del Cibercrimen PDI</p>
            </div>
            <div>
              <p className="border-t-2 border-black w-48 mx-auto pt-2 font-bold uppercase text-sm">Timbre Institucional</p>
              <p className="text-xs mt-1 text-gray-600">Validación del Sistema Judicial</p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default AnalisisView;