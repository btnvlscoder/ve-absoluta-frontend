import { useMemo, useState } from "react";
import axios from "axios";
import "./index.css";

const API_BASE_URL = process.env.REACT_APP_AI_API_URL || "http://localhost:8000";
const ENDPOINT_ADVANCED = `${API_BASE_URL}/api/v1/analyze-advanced`;
const ENDPOINT_ADVANCED_FILE = `${API_BASE_URL}/api/v1/analyze-advanced-file`;

const heatColor = (value) => {
  const v = Math.max(0, Math.min(1, value));
  const hue = (1 - v) * 120; // Verde -> Rojo
  return `hsl(${hue}, 82%, 45%)`;
};

const formatMetricLabel = (key) =>
  key
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const DashboardCards = ({ result }) => {
  const score = Math.round(result?.score_global ?? 0);
  const metricas = result?.metricas ?? {};
  const pieStyle = {
    background: `conic-gradient(#0a2864 ${score * 3.6}deg, #dde6f8 0deg)`,
  };
  const topMetrics = Object.entries(metricas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="ve-grid">
      <article className="ve-panel ve-panel--score">
        <p className="ve-kicker">Score Global</p>
        <p className="ve-score-value">{score}%</p>
        <p className="ve-muted">{result.label}</p>
      </article>

      <article className="ve-panel ve-panel--status">
        <p className="ve-kicker">Estado</p>
        <p className="ve-title">{score >= 70 ? "Alerta critica" : score >= 45 ? "Revision sugerida" : "Estado estable"}</p>
        <p className="ve-muted">{result.explicacion}</p>
      </article>

      <article className="ve-panel ve-panel--pie">
        <p className="ve-kicker">Distribucion</p>
        <div className="ve-pie" style={pieStyle}>
          <div className="ve-pie__center">{score}%</div>
        </div>
      </article>

      <article className="ve-panel ve-panel--metrics">
        <p className="ve-kicker">Top Anomalias</p>
        <div className="ve-metric-list">
          {topMetrics.map(([k, v]) => (
            <div className="ve-metric-row" key={k}>
              <span>{formatMetricLabel(k)}</span>
              <strong>{Math.round(v * 100)}%</strong>
            </div>
          ))}
        </div>
      </article>
    </div>
  );
};

const HeatmapPreview = ({ heatmap }) => {
  if (!heatmap?.length) return null;
  return (
    <article className="ve-panel">
      <p className="ve-kicker">Vista de Calor</p>
      <div
        className="ve-heatmap"
        style={{ gridTemplateColumns: `repeat(${heatmap[0].length}, 1fr)` }}
      >
        {heatmap.flatMap((row, rowIndex) =>
          row.map((value, colIndex) => (
            <span
              key={`${rowIndex}-${colIndex}`}
              style={{ backgroundColor: heatColor(value) }}
            />
          ))
        )}
      </div>
    </article>
  );
};

export default function App() {
  const [inputMode, setInputMode] = useState("url");
  const [imageUrl, setImageUrl] = useState(
    "https://png.pngtree.com/thumb_back/fh260/background/20210908/pngtree-beach-coast-evening-sunset-hd-real-shots-image_830506.jpg"
  );
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const activity = useMemo(() => {
    if (!result?.metricas) return [];
    return Object.entries(result.metricas).map(([key, val]) => ({
      key,
      value: Math.round(val * 100),
    }));
  }, [result]);

  const handleAnalyze = async () => {
    setLoading(true);
    setError("");
    try {
      let response;
      if (inputMode === "url") {
        if (!imageUrl.trim()) {
          setError("Debes ingresar una URL publica de imagen.");
          setLoading(false);
          return;
        }
        response = await axios.post(ENDPOINT_ADVANCED, { url: imageUrl });
      } else {
        if (!selectedFile) {
          setError("Debes seleccionar una imagen para subir.");
          setLoading(false);
          return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);
        response = await axios.post(ENDPOINT_ADVANCED_FILE, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setResult(response.data);
    } catch (err) {
      const detail = err?.response?.data?.detail;
      setError(detail || "No se pudo analizar la imagen.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ve-dashboard-page">
      <aside className="ve-sidebar">
        <div className="ve-avatar">M</div>
        <h2>Miguel</h2>
        <p>Panel de Analisis IA</p>
        <nav>
          <a className="active" href="#inicio">Inicio</a>
          <a href="#score">Score Global</a>
          <a href="#resultado">Resultado</a>
          <a href="#heatmap">Evidencia Visual</a>
          <a href="#actividad">Actividad Reciente</a>
        </nav>
      </aside>

      <main className="ve-main">
        <header className="ve-header">
          <div>
            <h1>Dashboard VE Absoluta</h1>
            <p>Analisis estadistico en tiempo real con endpoint avanzado</p>
          </div>
          <span className="ve-chip">{result?.status || "idle"}</span>
        </header>

        <section className="ve-panel ve-input-panel">
          <label>Fuente de imagen</label>
          <div className="ve-mode-toggle">
            <button
              className={inputMode === "url" ? "active" : ""}
              onClick={() => setInputMode("url")}
              type="button"
            >
              URL
            </button>
            <button
              className={inputMode === "file" ? "active" : ""}
              onClick={() => setInputMode("file")}
              type="button"
            >
              Upload File
            </button>
          </div>
          <div className="ve-input-row">
            {inputMode === "url" ? (
              <input
                id="image-url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
              />
            ) : (
              <label className="ve-file-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />
                {selectedFile ? selectedFile.name : "Seleccionar imagen local"}
              </label>
            )}
            <button onClick={handleAnalyze} disabled={loading} type="button">
              {loading ? "Analizando..." : "Analizar"}
            </button>
          </div>
          {error && <p className="ve-error">{error}</p>}
        </section>

        {result && (
          <>
            <section id="score">
              <DashboardCards result={result} />
            </section>

            <section id="heatmap">
              <HeatmapPreview heatmap={result.heatmap_raw} />
            </section>

            <section id="actividad" className="ve-panel">
              <p className="ve-kicker">Actividad Reciente</p>
              <div className="ve-activity-grid">
                {activity.map((item) => (
                  <div key={item.key} className="ve-activity-item">
                    <span>{formatMetricLabel(item.key)}</span>
                    <strong>{item.value}%</strong>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}