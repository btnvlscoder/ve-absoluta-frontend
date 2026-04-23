import { useState, useRef } from "react";
import axios from "axios";
import "./index.css";

// ── Watermark background ──────────────────────────────────────────────────────
const WatermarkBackground = () => {
  const phrases = ["VE ABSOLUTA", "VE ABSOLUT", "LUTA", "VE ABSOLUTA", "VE ABSOLUT"];
  const spans = [];
  for (let row = 0; row < 18; row++) {
    for (let col = 0; col < 6; col++) {
      spans.push(
        <span
          key={`${row}-${col}`}
          style={{ left: `${col * 18}%`, top: `${row * 5.5}%` }}
        >
          {phrases[col % phrases.length]}
        </span>
      );
    }
  }
  return <div className="ve-watermark">{spans}</div>;
};

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const ImageIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#0a2864" : "#888"} strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const TextIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#0a2864" : "#888"} strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <text x="3" y="18" fontSize="14" fontWeight="700" fontFamily="serif"
      fill={active ? "#0a2864" : "#888"} stroke="none">T</text>
    <polyline points="14 8 18 12 14 16" />
    <polyline points="18 8 22 12 18 16" />
  </svg>
);

const VideoIcon = ({ active }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke={active ? "#0a2864" : "#888"} strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7" />
    <rect x="1" y="5" width="15" height="14" rx="2" />
  </svg>
);

// ── VE Logo ───────────────────────────────────────────────────────────────────
const VELogo = () => (
  <svg width="64" height="48" viewBox="0 0 64 48" fill="none">
    <text x="0" y="40" fontSize="46" fontWeight="900"
      fontFamily="'Georgia', serif" fill="#0a2864" letterSpacing="-8">VE</text>
    <rect x="0" y="44" width="64" height="2.5" fill="#0a2864" rx="1" />
  </svg>
);

// ── Result Card ───────────────────────────────────────────────────────────────
const ResultCard = ({ result }) => {
  const pct = Math.round(result.confidence * 100);
  const isAI =
    result.prediction?.toLowerCase().includes("ia") ||
    result.prediction?.toLowerCase().includes("ai");

  return (
    <div className="ve-result">
      <p className="ve-result__label">Resultado del Análisis</p>
      <p className="ve-result__prediction">{result.prediction}</p>
      <div className="ve-result__bar-header">
        <span className="ve-result__bar-label">CONFIANZA</span>
        <span className="ve-result__bar-value">{pct}%</span>
      </div>
      <div className="ve-result__bar-track">
        <div
          className={`ve-result__bar-fill ${isAI ? "ve-result__bar-fill--ai" : "ve-result__bar-fill--real"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [mediaType, setMediaType] = useState("image");
  const [file, setFile]           = useState(null);
  const [result, setResult]       = useState(null);
  const [loading, setLoading]     = useState(false);
  const fileRef = useRef(null);

  const handleFileChange = (e) => setFile(e.target.files[0] || null);

  const handleUpload = async () => {
    if (!file) {
      alert("Sube una imagen primero po'");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/deteccion/upload",
        formData
      );
      setResult(response.data);
    } catch (error) {
      console.error("Algo falló en la subida:", error);
      alert("Error al conectar con el servidor. Revisa si el backend está arriba.");
    } finally {
      setLoading(false);
    }
  };

  const iconTypes = [
    { id: "image", Icon: ImageIcon, label: "Imagen"  }
  ];

  return (
    <div className="ve-page">
      <WatermarkBackground />

      {/* Browser window */}
      <div className="ve-browser">
        {/* Card */}
        <div className="ve-card">

          {/* Logo */}
          <div className="ve-logo-wrap">
            <VELogo />
          </div>
          <p className="ve-subtitle">Detector de Contenido IA</p>

          {/* Media type selector */}
          <div className="ve-selector">
            <div className="ve-icon-btn active">
              <ImageIcon active={true} />
              <span>Imagen</span>
            </div>
          </div>

          {/* Input row */}
          <div className="ve-input-row">
            <div className="ve-input-col">

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                accept="image/*,video/*"
              />

              <button
                className={`ve-file-btn${file ? " has-file" : ""}`}
                onClick={() => fileRef.current?.click()}
              >
                {file ? `📎 ${file.name}` : "INSERTE ARCHIVO"}
              </button>
            </div>

            {/* Round send button */}
            <button
              className="ve-send-btn"
              onClick={handleUpload}
              disabled={loading}
              title="Analizar"
            >
              {loading ? (
                <div className="ve-spinner" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="#fff" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>

          {/* Result */}
          {result && <ResultCard result={result} />}

        </div>
      </div>

      <p className="ve-footer">VE ABSOLUTA © 2025</p>
    </div>
  );
}