export const generarNarrativaPericial = (datosCrudos) => {
    // Si algún dato no llega, asignamos valores seguros por defecto para evitar caídas
    const { 
        vit_prediccion = "REAL", 
        vit_confianza = 0, 
        vit_sector = "indeterminado", 
        ela_max_diff = 0, 
        sensor_variance = 0 
    } = datosCrudos || {};
    
    let estadoGlobal = "AUTÉNTICO";
    let colorBadge = "green";
    
    let dictamenNeural = "";
    let dictamenEstructural = "";
    let conclusionForense = "";

    // --- 1. BLOQUE NEURAL (Vision Transformer) ---
    if (vit_prediccion === "FAKE") {
        if (vit_confianza > 85) {
            dictamenNeural = `El modelo neuronal identifica patrones sintéticos críticos con alta certeza (${vit_confianza.toFixed(1)}%). Las texturas en la zona ${vit_sector} son matemáticamente incompatibles con una captura física.`;
            estadoGlobal = "CRÍTICO";
            colorBadge = "red";
        } else if (vit_confianza > 65) {
            dictamenNeural = `El escaneo detecta indicios moderados de alteración (${vit_confianza.toFixed(1)}%) en el sector ${vit_sector}, sugiriendo una posible manipulación superficial.`;
            estadoGlobal = "SOSPECHOSO";
            colorBadge = "orange";
        } else {
            dictamenNeural = `Anomalías leves detectadas (${vit_confianza.toFixed(1)}%), pero no alcanzan el umbral forense para determinar síntesis total.`;
        }
    } else {
        dictamenNeural = `El modelo clasifica la estructura visual como natural (${vit_confianza.toFixed(1)}%), sin detectar artefactos propios de IA generativa.`;
    }

    // --- 2. BLOQUE ESTRUCTURAL (Laplaciano y ELA) ---
    const tieneHuellaFisica = sensor_variance > 60;
    const careceHuellaFisica = sensor_variance < 40;
    const tieneDegradacionSevera = ela_max_diff > 65;

    if (tieneHuellaFisica) {
        dictamenEstructural = `Análisis de hardware positivo: Se confirma fuerte presencia de ruido estático (Varianza Laplaciana: ${sensor_variance.toFixed(1)}), comprobando que la matriz base proviene de un sensor óptico real.`;
    } else if (careceHuellaFisica) {
        dictamenEstructural = `Análisis de hardware negativo: Ausencia de ruido térmico de lente (Varianza Laplaciana: ${sensor_variance.toFixed(1)}). La imagen es inusualmente plana, característico de renders digitales.`;
    } else {
        dictamenEstructural = `Análisis de hardware moderado: Varianza detectada de ${sensor_variance.toFixed(1)}. Compatible con cámaras de smartphones modernos con reducción de ruido automática.`;
    }

    // --- 3. RESOLUCIÓN DE CONFLICTOS (Cruce Pericial) ---
    if (vit_prediccion === "FAKE" && tieneHuellaFisica) {
        conclusionForense = "CONFLICTO IDENTIFICADO: La matriz base posee huella de cámara real, pero la red neuronal detecta síntesis. Esto es altamente compatible con un injerto digital, Face-Swap o fotomontaje parcial sobre una escena auténtica.";
        estadoGlobal = "ALTERACIÓN PARCIAL";
        colorBadge = "orange";
    } 
    else if (vit_prediccion === "FAKE" && careceHuellaFisica) {
        conclusionForense = "SÍNTESIS PURA: La alerta crítica de la red neuronal sumada a la ausencia total de huella óptica confirman que este archivo fue generado íntegramente por algoritmos generativos.";
        estadoGlobal = "SINTÉTICO (IA)";
        colorBadge = "red";
    } 
    else if (vit_prediccion === "REAL" && tieneDegradacionSevera) {
        conclusionForense = "DEGRADACIÓN POR COMPRESIÓN: La evidencia no contiene IA, pero presenta anomalías en su compresión (Delta ELA: ${ela_max_diff}). Esto indica transmisión repetida por redes sociales (ej. WhatsApp), perdiendo sus metadatos originales.";
        estadoGlobal = "DEGRADADO";
        colorBadge = "yellow";
    } 
    else if (vit_prediccion === "REAL" && (tieneHuellaFisica || (!careceHuellaFisica && !tieneDegradacionSevera))) {
        conclusionForense = "INTEGRIDAD CONFIRMADA: La IA y la matemática estructural coinciden. La evidencia mantiene su pureza óptica original sin alteraciones detectables.";
        estadoGlobal = "AUTÉNTICO";
        colorBadge = "green";
    }

    // Retornamos el objeto listo para que el Dashboard lo pinte
    return {
        badge: { texto: estadoGlobal, color: colorBadge },
        textos: [
            { titulo: "Análisis Neuronal (ViT)", contenido: dictamenNeural },
            { titulo: "Análisis Estructural (Laplaciano/ELA)", contenido: dictamenEstructural },
            { titulo: "Conclusión Forense", contenido: conclusionForense }
        ]
    };
};