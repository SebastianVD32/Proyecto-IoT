/* Utilidad: clase temporal para “nudge” */
function nudge(el, cls, ms = 280) {
  if (!el) return;
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), ms);
}

/* =========================
   TEMPERATURA (termómetro)
   ========================= */
(function () {
  const fill = document.getElementById('thermo-fill');
  const bulb = document.getElementById('thermo-bulb');
  const iconRoot = document.getElementById('weather-icon');
  const tempRead = document.getElementById('temp-readout');
  const condLbl = document.getElementById('condition-label');
  const cardT = document.getElementById('card-temp');

  if (!fill || !bulb || !iconRoot || !tempRead || !condLbl || !cardT) return;

  const MIN_C = -5, MAX_C = 45;

  // Íconos del clima con clases animadas
  const WX_ICONS = {
    soleado:
      `<svg viewBox="0 0 128 128" class="wx-sun" aria-hidden="true">
         <g class="rays" stroke="#FFD54F" stroke-width="10" stroke-linecap="round">
           <line x1="64" y1="6"  x2="64" y2="26"/>
           <line x1="64" y1="102" x2="64" y2="122"/>
           <line x1="6"  y1="64" x2="26" y2="64"/>
           <line x1="102" y1="64" x2="122" y2="64"/>
           <line x1="23" y1="23" x2="37" y2="37"/>
           <line x1="91" y1="91" x2="105" y2="105"/>
           <line x1="23" y1="105" x2="37" y2="91"/>
           <line x1="91" y1="37" x2="105" y2="23"/>
         </g>
         <circle cx="64" cy="64" r="26" fill="#FFD54F"/>
       </svg>`,
    parcial:
      `<svg viewBox="0 0 128 128" aria-hidden="true">
         <circle cx="44" cy="44" r="22" fill="#FFD54F"/>
         <g class="wx-cloud"><path d="M30 90h64a20 20 0 0 0 0-40c-2 0-4 0-6 1a30 30 0 0 0-58 8A22 22 0 0 0 30 90Z" fill="#B0BEC5"/></g>
       </svg>`,
    nublado:
      `<svg viewBox="0 0 128 128" aria-hidden="true">
         <g class="wx-cloud"><path d="M28 96h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 96Z" fill="#B0BEC5"/></g>
       </svg>`,
    lluvia:
      `<svg viewBox="0 0 128 128" class="wx-rain" aria-hidden="true">
         <g class="wx-cloud"><path d="M28 80h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 80Z" fill="#B0BEC5"/></g>
         <g fill="#64B5F6">
           <path class="drop d1" d="M42 92l-7 18h7l7-18h-7z"/>
           <path class="drop d2" d="M64 92l-7 18h7l7-18h-7z"/>
           <path class="drop d3" d="M86 92l-7 18h7l7-18h-7z"/>
         </g>
       </svg>`,
    tormenta:
      `<svg viewBox="0 0 128 128" class="wx-storm" aria-hidden="true">
         <g class="wx-cloud"><path d="M28 80h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 80Z" fill="#B0BEC5"/></g>
         <polygon class="bolt" points="54,80 82,80 68,100 84,100 52,124 62,104 48,104" fill="#FFD54F"/>
       </svg>`,
    niebla:
      `<svg viewBox="0 0 128 128" aria-hidden="true">
         <g class="wx-cloud"><path d="M28 80h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 80Z" fill="#B0BEC5"/></g>
         <g stroke="#CFD8DC" stroke-width="10" stroke-linecap="round">
           <line x1="18" y1="96" x2="110" y2="96"/>
           <line x1="10" y1="114" x2="118" y2="114"/>
         </g>
       </svg>`,
    nieve:
      `<svg viewBox="0 0 128 128" class="wx-snow" aria-hidden="true">
         <g class="wx-cloud"><path d="M28 80h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 80Z" fill="#B0BEC5"/></g>
         <g fill="#E3F2FD">
           <circle class="flake f1" cx="48" cy="96" r="7"/>
           <circle class="flake f2" cx="70" cy="104" r="7"/>
           <circle class="flake f3" cx="92" cy="96" r="7"/>
         </g>
       </svg>`
  };

  function colorForTemp(t) {
    // sin verde: azul -> celeste -> amarillo -> naranja -> rojo
    if (t <= 0) return '#4fc3f7';
    if (t <= 10) return '#29b6f6';
    if (t <= 20) return '#FFD54F';
    if (t <= 30) return '#FFA726';
    return '#EF5350';
  }

  function setCondition(condition) {
    const key = (condition || '').toLowerCase();
    iconRoot.innerHTML = WX_ICONS[key] || WX_ICONS['nublado'];
    condLbl.textContent = key ? key.charAt(0).toUpperCase() + key.slice(1) : '—';
  }

  function renderThermometer(tempC) {
    const t = Math.max(MIN_C, Math.min(MAX_C, Number(tempC)));
    const tubeTop = 22, tubeHeight = 156;
    const pct = (t - MIN_C) / (MAX_C - MIN_C);
    const fillH = Math.max(0, Math.min(tubeHeight, tubeHeight * pct));
    const fillY = tubeTop + (tubeHeight - fillH);

    fill.setAttribute('y', fillY.toFixed(1));
    fill.setAttribute('height', fillH.toFixed(1));
    cardT.style.setProperty('--thermo-color', colorForTemp(t));

    tempRead.textContent = `${t.toFixed(1)} °C`;

    nudge(cardT, 'thermo-nudge', 280);
  }

  // API pública
  window.updateTemperature = function (tempC, condition) {
    renderThermometer(tempC);
    setCondition(condition);
  };
})();

updateTemperature(22, 'tormenta'); // °C y condición

/* =====================
   HUMEDAD (gota)
   ===================== */
(function () {
  const fill = document.getElementById('hum-fill');
  const wave = document.getElementById('hum-wave');
  const readout = document.getElementById('hum-readout');
  const status = document.getElementById('hum-status');
  const cardHum = document.getElementById('card-hum');
  if (!fill || !wave || !readout || !status || !cardHum) return;

  const SVG_HEIGHT = 190; // viewBox 0..190

  function labelForHum(p) {
    if (p < 30) return 'Seco';
    if (p < 60) return 'Confort';
    if (p < 80) return 'Húmedo';
    return 'Muy húmedo';
  }

  function gradientForHum(p) {
    const sat = Math.round(60 + 30 * (p / 100));
    const col1 = `hsl(210 ${sat}% 70%)`, col2 = `hsl(210 ${sat}% 55%)`;
    const svg = cardHum.querySelector('.drop-svg');
    const stops = svg.querySelectorAll('#hum-gradient stop');
    if (stops.length === 2) { stops[0].setAttribute('stop-color', col1); stops[1].setAttribute('stop-color', col2); }
  }

  function renderHumidity(percent) {
    const p = Math.max(0, Math.min(100, Number(percent) || 0));
    readout.textContent = `${p.toFixed(0)}%`;
    status.textContent = labelForHum(p);

    const fillHeight = (SVG_HEIGHT * p) / 100;
    const fillY = SVG_HEIGHT - fillHeight;

    // sobre-dimensionar para evitar cortes
    fill.setAttribute('y', (fillY - 1).toFixed(1));
    fill.setAttribute('height', (fillHeight + 2).toFixed(1));

    const amp = Math.max(0, 8 * (1 - p / 100));
    const waveY = Math.min(SVG_HEIGHT - 34, Math.max(44, fillY + 6));
    const d = `M-20 ${waveY} C20 ${waveY - amp}, 110 ${waveY + amp}, 150 ${waveY} V${SVG_HEIGHT} H-20 Z`;
    wave.setAttribute('d', d);
    wave.style.opacity = p >= 98 ? 0 : 0.12;

    gradientForHum(p);
  }

  window.updateHumidity = renderHumidity;
})();

updateHumidity(100);             

/* ====== RADIACIÓN UV: lógica (Sol pulsante + lista de tips) ====== */
(function () {
  const root = document.getElementById('card-uv');
  const value = document.getElementById('uv-value');
  const level = document.getElementById('uv-level');
  const advice = document.getElementById('uv-advice');

  if (!root || !value || !level || !advice) {
    console.warn('[uv] Elementos UV no encontrados. Verifica IDs en el HTML.');
    return;
  }

  // Catálogo por nivel UV
  function uvCategory(uv) {
    if (uv < 3) return {
      key: 'bajo', name: 'Bajo', color: '#FFF59D',
      tips: [
        'Protección mínima necesaria.',
        'Gafas de sol opcionales.',
      ]
    };
    if (uv < 6) return {
      key: 'mod', name: 'Moderado', color: '#FFB74D',
      tips: [
        'Usa gafas de sol.',
        'Considera bloqueador SPF 30+.',
      ]
    };
    if (uv < 8) return {
      key: 'alto', name: 'Alto', color: '#EF5350',
      tips: [
        'SPF 50+ y reaplicar cada 2h.',
        'Gorra o sombrero recomendable.',
        'Evita el sol del mediodía.',
      ]
    };
    if (uv < 10) return {
      key: 'muy', name: 'Muy alto', color: '#AB47BC',
      tips: [
        'Reduce exposición directa.',
        'Busca sombra y usa manga larga.',
        'SPF 50+ obligatorio.',
      ]
    };
    return {
      key: 'ext', name: 'Extremo', color: '#6A1B9A',
      tips: [
        'Evita exposición directa.',
        'Protección completa: sombrero, gafas, ropa UV.',
        'SPF 50+ y reaplicar con frecuencia.',
      ]
    };
  }

  // Render UI
  function renderUV(uv) {
    const u = Math.max(0, Number(uv) || 0);
    const cat = uvCategory(u);

    // Color del sol/rayos
    root.style.setProperty('--uv-color', cat.color);

    // Valor visible
    value.textContent = `${u.toFixed(1)} UV`;

    // Etiquetas
    level.textContent = cat.name;

    // Recomendaciones como lista
    advice.innerHTML = `<ul>${cat.tips.map(t => `<li>${t}</li>`).join('')}</ul>`;

    // data-uv para CSS (alarga rayos según nivel)
    root.setAttribute('data-uv', cat.key);
  }

  // API pública
  window.updateUV = renderUV;

  // Ejemplo inicial (ajusta o elimina)
  renderUV(6);
})();