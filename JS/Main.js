/* ====== Temperatura: lógica ====== */
(function () {
  // Rango operativo del termómetro
const MIN_C = -5;
const MAX_C = 45;

const fill = document.getElementById('thermo-fill');
const bulb = document.getElementById('thermo-bulb');
const iconRoot = document.getElementById('weather-icon');
const tempReadout = document.getElementById('temp-readout');
const condLabel = document.getElementById('condition-label');
const cardTemp = document.getElementById('card-temp');

if (!fill || !bulb || !iconRoot || !tempReadout || !condLabel || !cardTemp) {
    console.warn('[app.js] Elementos de la tarjeta de temperatura no encontrados. Verifica los IDs en el HTML.');
    return;
}

  // Íconos SVG según condición
const icons = {
    soleado:
    `<svg viewBox="0 0 128 128" width="100%" height="100%">
        <circle cx="64" cy="64" r="26" fill="#FFD54F"/>
        <g stroke="#FFD54F" stroke-width="8" stroke-linecap="round">
        <line x1="64" y1="8" x2="64" y2="28"/><line x1="64" y1="100" x2="64" y2="120"/>
        <line x1="8" y1="64" x2="28" y2="64"/><line x1="100" y1="64" x2="120" y2="64"/>
        <line x1="22" y1="22" x2="36" y2="36"/><line x1="92" y1="92" x2="106" y2="106"/>
        <line x1="22" y1="106" x2="36" y2="92"/><line x1="92" y1="36" x2="106" y2="22"/>
        </g>
    </svg>`,

  parcial:
  `<svg viewBox="0 0 128 128" width="100%" height="100%">
    <circle cx="44" cy="44" r="26" fill="#FFD54F"/>
    <path d="M28 90h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 90Z" fill="#B0BEC5"/>
  </svg>`,

  nublado:
  `<svg viewBox="0 0 128 128" width="100%" height="100%">
    <path d="M28 96h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 96Z" fill="#B0BEC5"/>
  </svg>`,

  lluvia:
  `<svg viewBox="0 0 128 128" width="100%" height="100%">
    <path d="M28 80h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 80Z" fill="#B0BEC5"/>
    <g fill="#64B5F6">
      <path d="M42 94l-8 20h8l8-20h-8z"/>
      <path d="M68 94l-8 20h8l8-20h-8z"/>
      <path d="M94 94l-8 20h8l8-20h-8z"/>
    </g>
  </svg>`,

  tormenta:
  `<svg viewBox="0 0 128 128" width="100%" height="100%">
    <path d="M28 80h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 80Z" fill="#B0BEC5"/>
    <polygon points="54,80 82,80 68,100 84,100 52,124 62,104 48,104" fill="#FFD54F"/>
  </svg>`,

  niebla:
  `<svg viewBox="0 0 128 128" width="100%" height="100%">
    <path d="M28 80h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 80Z" fill="#B0BEC5"/>
    <g stroke="#CFD8DC" stroke-width="10" stroke-linecap="round">
      <line x1="20" y1="92" x2="108" y2="92"/>
      <line x1="12" y1="108" x2="116" y2="108"/>
    </g>
  </svg>`,

  nieve:
  `<svg viewBox="0 0 128 128" width="100%" height="100%">
    <path d="M28 80h72a22 22 0 0 0 0-44c-3 0-5 0-8 1a32 32 0 0 0-62 9A24 24 0 0 0 28 80Z" fill="#B0BEC5"/>
    <g fill="#E3F2FD">
      <circle cx="48" cy="96" r="8"/>
      <circle cx="70" cy="104" r="8"/>
      <circle cx="92" cy="96" r="8"/>
    </g>
  </svg>`
};

  // Color por temperatura
function colorForTemp(t) {
  if (t <= 0)  return '#4fc3f7'; // azul
  if (t <= 10) return '#29b6f6'; // celeste
  if (t <= 20) return '#FFD54F'; // amarillo
  if (t <= 30) return '#FFA726'; // naranja
  return '#EF5350';              // rojo
}

  // Actualiza termómetro e info
function renderThermometer(tempC) {
    const t = Math.max(MIN_C, Math.min(MAX_C, tempC));
    const tubeTop = 22;     // y inicial del tubo
    const tubeHeight = 156; // altura total del tubo

    const pct = (t - MIN_C) / (MAX_C - MIN_C);
    const fillH = Math.max(0, Math.min(tubeHeight, tubeHeight * pct));
    const fillY = tubeTop + (tubeHeight - fillH);

    fill.setAttribute('y', fillY.toFixed(1));
    fill.setAttribute('height', fillH.toFixed(1));

    const col = colorForTemp(t);
    cardTemp.style.setProperty('--thermo-color', col);

    tempReadout.textContent = `${t.toFixed(1)} °C`;
}

function setCondition(condition) {
    const key = (condition || '').toLowerCase();
    const svg = icons[key] || icons['nublado'];
    iconRoot.innerHTML = svg;
    condLabel.textContent = key ? key.charAt(0).toUpperCase() + key.slice(1) : '—';
}

  // API pública
window.updateTemperature = function (tempC, condition) {
    renderThermometer(Number(tempC));
    setCondition(condition);
};

  /* ===== DEMO opcional (borra si no lo necesitas) ===== */
updateTemperature(22, 'tormenta'); // temp en °C y condición: soleado, parcial, nublado, lluvia, tormenta, niebla, nieve
             // primera renderizada
  // setInterval(demo, 3000); // descomenta para ver cambios automáticos
})();
