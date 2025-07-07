// ...existing JS from <script> in index.html...
// --- Color Conversion Utilities ---
// Helper functions for color conversions
function hexToRgb(hex) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return [num >> 16 & 255, num >> 8 & 255, num & 255];
}
function rgbToHex([r, g, b]) {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}
function rgbToRgba([r, g, b], a = 1) {
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
function rgbToHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) { h = s = 0; }
  else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}
function rgbToHsla([r, g, b], a = 1) {
  const [h, s, l] = rgbToHsl([r, g, b]);
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}
function rgbToCmyk([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return [Math.round(c * 100), Math.round(m * 100), Math.round(y * 100), Math.round(k * 100)];
}
function rgbToDecimal([r, g, b]) {
  return r * 65536 + g * 256 + b;
}
function rgbToHwb([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const w = min;
  const bl = 1 - max;
  const [h] = rgbToHsl([r * 255, g * 255, b * 255]);
  return [h, Math.round(w * 100), Math.round(bl * 100)];
}
function rgbToHsv([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  let h;
  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(v * 100)];
}
function rgbToHsi([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const i = (r + g + b) / 3;
  let min = Math.min(r, g, b);
  let s = i === 0 ? 0 : 1 - min / i;
  let h = 0;
  if (s !== 0) {
    h = Math.acos(0.5 * ((r - g) + (r - b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b)));
    if (b > g) h = 2 * Math.PI - h;
    h = h * 180 / Math.PI;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(i * 100)];
}
function rgbToHsp([r, g, b]) {
  // HSP: Highly Sensitive Poo (perceived brightness)
  const p = Math.sqrt(0.299 * r * r + 0.587 * g * g + 0.114 * b * b);
  return Math.round(p);
}
function rgbToYuv([r, g, b]) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const u = -0.14713 * r - 0.28886 * g + 0.436 * b;
  const v = 0.615 * r - 0.51499 * g - 0.10001 * b;
  return [Math.round(y), Math.round(u), Math.round(v)];
}
function rgbToYCbCr([r, g, b]) {
  const y  =  16 + (65.738 * r + 129.057 * g + 25.064 * b) / 256;
  const cb = 128 - (37.945 * r + 74.494 * g - 112.439 * b) / 256;
  const cr = 128 + (112.439 * r - 94.154 * g - 18.285 * b) / 256;
  return [Math.round(y), Math.round(cb), Math.round(cr)];
}
function rgbToYiq([r, g, b]) {
  const y = 0.299 * r + 0.587 * g + 0.114 * b;
  const i = 0.596 * r - 0.274 * g - 0.322 * b;
  const q = 0.211 * r - 0.523 * g + 0.312 * b;
  return [y.toFixed(1), i.toFixed(1), q.toFixed(1)];
}
// LAB and LCH via XYZ
function rgbToXyz([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
  g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
  b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) * 100;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) * 100;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) * 100;
  return [x, y, z];
}
function xyzToLab([x, y, z]) {
  const ref = [95.047, 100.0, 108.883];
  x /= ref[0]; y /= ref[1]; z /= ref[2];
  [x, y, z] = [x, y, z].map(v => v > 0.008856 ? Math.cbrt(v) : (7.787 * v) + 16 / 116);
  const l = (116 * y) - 16;
  const a = 500 * (x - y);
  const b = 200 * (y - z);
  return [Math.round(l), Math.round(a), Math.round(b)];
}
function labToLch([l, a, b]) {
  const c = Math.sqrt(a * a + b * b);
  let h = Math.atan2(b, a) * 180 / Math.PI;
  if (h < 0) h += 360;
  return [Math.round(l), Math.round(c), Math.round(h)];
}
// Named color lookup
const namedColors = (() => {
  const names = {
    "black": "#000000", "white": "#ffffff", "red": "#ff0000", "lime": "#00ff00", "blue": "#0000ff", "yellow": "#ffff00", "cyan": "#00ffff", "magenta": "#ff00ff", "silver": "#c0c0c0", "gray": "#808080", "maroon": "#800000", "olive": "#808000", "green": "#008000", "purple": "#800080", "teal": "#008080", "navy": "#000080", "orange": "#ffa500", "aliceblue": "#f0f8ff", "antiquewhite": "#faebd7", "aqua": "#00ffff", "aquamarine": "#7fffd4", "azure": "#f0ffff", "beige": "#f5f5dc", "bisque": "#ffe4c4", "blanchedalmond": "#ffebcd", "blueviolet": "#8a2be2", "brown": "#a52a2a", "burlywood": "#deb887", "cadetblue": "#5f9ea0", "chartreuse": "#7fff00", "chocolate": "#d2691e", "coral": "#ff7f50", "cornflowerblue": "#6495ed", "cornsilk": "#fff8dc", "crimson": "#dc143c", "darkblue": "#00008b", "darkcyan": "#008b8b", "darkgoldenrod": "#b8860b", "darkgray": "#a9a9a9", "darkgreen": "#006400", "darkkhaki": "#bdb76b", "darkmagenta": "#8b008b", "darkolivegreen": "#556b2f", "darkorange": "#ff8c00", "darkorchid": "#9932cc", "darkred": "#8b0000", "darksalmon": "#e9967a", "darkseagreen": "#8fbc8f", "darkslateblue": "#483d8b", "darkslategray": "#2f4f4f", "darkturquoise": "#00ced1", "darkviolet": "#9400d3", "deeppink": "#ff1493", "deepskyblue": "#00bfff", "dimgray": "#696969", "dodgerblue": "#1e90ff", "firebrick": "#b22222", "floralwhite": "#fffaf0", "forestgreen": "#228b22", "fuchsia": "#ff00ff", "gainsboro": "#dcdcdc", "ghostwhite": "#f8f8ff", "gold": "#ffd700", "goldenrod": "#daa520", "greenyellow": "#adff2f", "honeydew": "#f0fff0", "hotpink": "#ff69b4", "indianred": "#cd5c5c", "indigo": "#4b0082", "ivory": "#fffff0", "khaki": "#f0e68c", "lavender": "#e6e6fa", "lavenderblush": "#fff0f5", "lawngreen": "#7cfc00", "lemonchiffon": "#fffacd", "lightblue": "#add8e6", "lightcoral": "#f08080", "lightcyan": "#e0ffff", "lightgoldenrodyellow": "#fafad2", "lightgray": "#d3d3d3", "lightgreen": "#90ee90", "lightpink": "#ffb6c1", "lightsalmon": "#ffa07a", "lightseagreen": "#20b2aa", "lightskyblue": "#87cefa", "lightslategray": "#778899", "lightsteelblue": "#b0c4de", "lightyellow": "#ffffe0", "limegreen": "#32cd32", "linen": "#faf0e6", "mediumaquamarine": "#66cdaa", "mediumblue": "#0000cd", "mediumorchid": "#ba55d3", "mediumpurple": "#9370db", "mediumseagreen": "#3cb371", "mediumslateblue": "#7b68ee", "mediumspringgreen": "#00fa9a", "mediumturquoise": "#48d1cc", "mediumvioletred": "#c71585", "midnightblue": "#191970", "mintcream": "#f5fffa", "mistyrose": "#ffe4e1", "moccasin": "#ffe4b5", "navajowhite": "#ffdead", "oldlace": "#fdf5e6", "olivedrab": "#6b8e23", "orangered": "#ff4500", "orchid": "#da70d6", "palegoldenrod": "#eee8aa", "palegreen": "#98fb98", "paleturquoise": "#afeeee", "palevioletred": "#db7093", "papayawhip": "#ffefd5", "peachpuff": "#ffdab9", "peru": "#cd853f", "pink": "#ffc0cb", "plum": "#dda0dd", "powderblue": "#b0e0e6", "rosybrown": "#bc8f8f", "royalblue": "#4169e1", "saddlebrown": "#8b4513", "salmon": "#fa8072", "sandybrown": "#f4a460", "seagreen": "#2e8b57", "seashell": "#fff5ee", "sienna": "#a0522d", "skyblue": "#87ceeb", "slateblue": "#6a5acd", "slategray": "#708090", "snow": "#fffafa", "springgreen": "#00ff7f", "steelblue": "#4682b4", "tan": "#d2b48c", "thistle": "#d8bfd8", "tomato": "#ff6347", "turquoise": "#40e0d0", "violet": "#ee82ee", "wheat": "#f5deb3", "whitesmoke": "#f5f5f5", "yellowgreen": "#9acd32"
  };
  const lookup = {};
  for (const [name, hex] of Object.entries(names)) lookup[hex.toLowerCase()] = name;
  return { names, lookup };
})();
function rgbToNamed([r, g, b]) {
  const hex = rgbToHex([r, g, b]).toLowerCase();
  return namedColors.lookup[hex] || '(none)';
}
// --- UI Logic ---
const colorInput = document.getElementById('colorInput');
const colorPreview = document.getElementById('colorPreview');
const formatsDiv = document.getElementById('formats');
const themeToggle = document.getElementById('themeToggle');
// --- Global alpha state ---
let globalAlpha = 1; // Default alpha is 1 (opaque)
// Theme toggle
function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
}
themeToggle.onclick = () => {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  setTheme(current === 'dark' ? 'light' : 'dark');
};
// Initial theme
setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
// Color update logic
function animatePreview() {
  colorPreview.style.animation = 'none';
  // Force reflow
  void colorPreview.offsetWidth;
  colorPreview.style.animation = 'previewPop 0.7s cubic-bezier(.4,0,.2,1)';
}
function animatePicker() {
  colorInput.style.animation = 'none';
  void colorInput.offsetWidth;
  colorInput.style.animation = 'popIn 0.6s cubic-bezier(.4,0,.2,1)';
}
function updateColor(hex) {
  const rgb = hexToRgb(hex);
  // Use globalAlpha for preview and formats
  if (globalAlpha < 1) {
    colorPreview.style.background = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${globalAlpha})`;
  } else {
    colorPreview.style.background = hex;
  }
  animatePreview();
  animatePicker();
  // All formats
  const xyz = rgbToXyz(rgb);
  const lab = xyzToLab(xyz);
  const lch = labToLch(lab);
  const formats = [
    { name: 'HEX', code: rgbToHex(rgb) },
    { name: 'RGB', code: `rgb(${rgb.join(', ')})` },
    { name: 'RGBA', code: rgbToRgba(rgb, globalAlpha) },
    { name: 'HSL', code: `hsl(${rgbToHsl(rgb).join(', ')}%)` },
    { name: 'HSLA', code: rgbToHsla(rgb, globalAlpha) },
    { name: 'CMYK', code: rgbToCmyk(rgb).join(', ') },
    { name: 'Named Color', code: rgbToNamed(rgb) },
    { name: 'Decimal RGB', code: rgbToDecimal(rgb) },
    { name: 'LAB', code: `lab(${lab.join(', ')})` },
    { name: 'LCH', code: `lch(${lch.join(', ')})` },
    { name: 'HWB', code: `hwb(${rgbToHwb(rgb).join(', ')})` },
    { name: 'HSV', code: `hsv(${rgbToHsv(rgb).join(', ')})` },
    { name: 'HSI', code: `hsi(${rgbToHsi(rgb).join(', ')})` },
    { name: 'HSP', code: rgbToHsp(rgb) },
    { name: 'YUV', code: rgbToYuv(rgb).join(', ') },
    { name: 'YCbCr', code: rgbToYCbCr(rgb).join(', ') },
    { name: 'YIQ', code: rgbToYiq(rgb).join(', ') },
  ];
  formatsDiv.innerHTML = '';
  formats.forEach(({ name, code }, i) => {
    const card = document.createElement('div');
    card.className = 'format-card';
    card.style.animationDelay = (i * 0.04) + 's';
    const title = document.createElement('div');
    title.className = 'format-title';
    title.textContent = name;
    const codeDiv = document.createElement('div');
    codeDiv.className = 'format-code';
    codeDiv.textContent = code;
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-btn';
    copyBtn.innerHTML = 'Copy';
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.innerHTML = 'Copied!';
        setTimeout(() => copyBtn.innerHTML = 'Copy', 1200);
      });
    };
    card.appendChild(title);
    card.appendChild(codeDiv);
    card.appendChild(copyBtn);
    formatsDiv.appendChild(card);
  });
}
colorInput.addEventListener('input', e => updateColor(e.target.value));
// Initial render
updateColor(colorInput.value);
// Modern Color Wheel Popup
(function(){
  // Create modal HTML
  const modal = document.createElement('div');
  modal.id = 'colorWheelModal';
  modal.style = 'display:none;position:fixed;z-index:1000;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.25);backdrop-filter:blur(2px);align-items:center;justify-content:center;';
  modal.innerHTML = `
    <div style="background:var(--card,#fff);border-radius:1.3rem;box-shadow:0 8px 32px 0 rgba(31,38,135,0.18);padding:2rem 1.5rem;min-width:340px;display:flex;flex-direction:column;align-items:center;gap:1.2rem;position:relative;backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);">
      <div style="display:flex;flex-direction:row;gap:1.5rem;align-items:flex-start;">
        <canvas id="colorWheelCanvas" width="200" height="200" style="border-radius:50%;box-shadow:0 2px 8px 0 rgba(0,0,0,0.10);cursor:crosshair;"></canvas>
        <div style="display:flex;flex-direction:column;gap:0.7rem;align-items:center;">
          <label style="font-size:1rem;font-weight:600;">Lightness</label>
          <input type="range" id="wheelLightness" min="0" max="100" value="50" style="width:110px;">
          <label style="font-size:1rem;font-weight:600;">Alpha</label>
          <input type="range" id="wheelAlpha" min="0" max="100" value="100" style="width:110px;">
          <label style="font-size:1rem;font-weight:600;">Format</label>
          <select id="wheelFormat" style="padding:0.3rem 0.7rem;border-radius:0.5rem;font-size:1rem;">
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
            <option value="rgba">RGBA</option>
            <option value="hsl">HSL</option>
            <option value="hsla">HSLA</option>
          </select>
          <div id="wheelPreview" style="width:38px;height:38px;border-radius:0.7rem;border:2px solid #4f8cff;margin-top:0.5rem;"></div>
        </div>
      </div>
      <div style="display:flex;gap:1.2rem;align-items:center;">
        <button id="wheelOk" style="background:#4f8cff;color:#fff;border:none;border-radius:1.2rem;padding:0.7rem 1.3rem;font-size:1.1rem;font-weight:600;cursor:pointer;">OK</button>
        <button id="wheelCancel" style="background:#fff3;color:#4f8cff;border:1.5px solid #4f8cff;border-radius:1.2rem;padding:0.6rem 1.1rem;font-size:1.1rem;font-weight:600;cursor:pointer;">Cancel</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Add open button
  const openBtn = document.createElement('button');
  openBtn.textContent = '🎨 Color Wheel';
  openBtn.className = 'custom-picker-btn color-wheel-btn-animated';
  openBtn.style.marginTop = '0.5rem';
  openBtn.style.background = 'linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%)';
  openBtn.style.boxShadow = '0 4px 16px 0 rgba(79,140,255,0.18), 0 1.5px 0 0 #fff6 inset';
  openBtn.style.border = 'none';
  openBtn.style.color = '#fff';
  openBtn.style.fontWeight = '700';
  openBtn.style.letterSpacing = '0.03em';
  openBtn.style.fontSize = '1.13rem';
  openBtn.style.borderRadius = '1.3rem';
  openBtn.style.padding = '0.7rem 1.7rem';
  openBtn.style.transition = 'background 0.22s, transform 0.18s, box-shadow 0.18s';
  openBtn.style.position = 'relative';
  openBtn.style.overflow = 'hidden';
  openBtn.onmouseenter = function() {
    openBtn.style.transform = 'scale(1.07)';
    openBtn.style.boxShadow = '0 8px 32px 0 rgba(79,140,255,0.22), 0 1.5px 0 0 #fff6 inset';
  };
  openBtn.onmouseleave = function() {
    openBtn.style.transform = 'scale(1)';
    openBtn.style.boxShadow = '0 4px 16px 0 rgba(79,140,255,0.18), 0 1.5px 0 0 #fff6 inset';
  };
  openBtn.onmousedown = function() {
    openBtn.style.transform = 'scale(0.96)';
    openBtn.style.background = 'linear-gradient(90deg, #6f6fff 0%, #4f8cff 100%)';
  };
  openBtn.onmouseup = function() {
    openBtn.style.transform = 'scale(1.07)';
    openBtn.style.background = 'linear-gradient(90deg, #4f8cff 0%, #6f6fff 100%)';
  };
  // DnD style: add a subtle drag handle
  const dragHandle = document.createElement('span');
  dragHandle.style.display = 'inline-block';
  dragHandle.style.width = '18px';
  dragHandle.style.height = '18px';
  dragHandle.style.marginRight = '0.7rem';
  dragHandle.style.verticalAlign = 'middle';
  dragHandle.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><circle cx="4" cy="5" r="1.5" fill="#fff8"/><circle cx="4" cy="9" r="1.5" fill="#fff8"/><circle cx="4" cy="13" r="1.5" fill="#fff8"/><circle cx="9" cy="5" r="1.5" fill="#fff8"/><circle cx="9" cy="9" r="1.5" fill="#fff8"/><circle cx="9" cy="13" r="1.5" fill="#fff8"/><circle cx="14" cy="5" r="1.5" fill="#fff8"/><circle cx="14" cy="9" r="1.5" fill="#fff8"/><circle cx="14" cy="13" r="1.5" fill="#fff8"/></svg>';
  openBtn.prepend(dragHandle);
  // Insert after color input
  const colorInputDiv = document.querySelector('.color-input');
  colorInputDiv.appendChild(openBtn);

  // Color wheel logic
  const colorWheelCanvas = document.getElementById('colorWheelCanvas');
  const wheelLightness = document.getElementById('wheelLightness');
  const wheelAlpha = document.getElementById('wheelAlpha');
  const wheelFormat = document.getElementById('wheelFormat');
  const wheelPreview = document.getElementById('wheelPreview');
  const wheelOk = document.getElementById('wheelOk');
  const wheelCancel = document.getElementById('wheelCancel');
  let wheelSelected = {h:220,s:1,l:0.5,a:1};

  openBtn.onclick = function() {
    modal.style.display = 'flex';
    drawColorWheel();
    updateWheelPreview();
    updateModalBg();
  };
  wheelCancel.onclick = function() {
    modal.style.display = 'none';
  };
  wheelOk.onclick = function() {
    const rgb = hslToRgb([wheelSelected.h, wheelSelected.s, wheelSelected.l]);
    let val;
    if(wheelFormat.value==='hex') val = rgbToHex(rgb);
    else if(wheelFormat.value==='rgb') val = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    else if(wheelFormat.value==='rgba') val = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${wheelSelected.a.toFixed(2)})`;
    else if(wheelFormat.value==='hsl') val = `hsl(${Math.round(wheelSelected.h)},${Math.round(wheelSelected.s*100)}%,${Math.round(wheelSelected.l*100)}%)`;
    else if(wheelFormat.value==='hsla') val = `hsla(${Math.round(wheelSelected.h)},${Math.round(wheelSelected.s*100)}%,${Math.round(wheelSelected.l*100)}%,${wheelSelected.a.toFixed(2)})`;
    document.getElementById('colorInput').value = rgbToHex(rgb);
    globalAlpha = wheelSelected.a; // <-- Set global alpha from wheel
    document.getElementById('colorInput').dispatchEvent(new Event('input', {bubbles:true}));
    modal.style.display = 'none';
    // Optionally: copy val to clipboard
    navigator.clipboard.writeText(val);
  };
  wheelLightness.oninput = function() {
    wheelSelected.l = this.value/100;
    drawColorWheel();
    updateWheelPreview();
    updateModalBg();
  };
  wheelAlpha.oninput = function() {
    wheelSelected.a = this.value/100;
    updateWheelPreview();
    updateModalBg();
  };
  wheelFormat.oninput = function() {
    updateWheelPreview();
    updateModalBg();
  };
  colorWheelCanvas.onmousedown = function(e) {
    function pick(ev) {
      const rect = colorWheelCanvas.getBoundingClientRect();
      let x = ev.clientX - rect.left - colorWheelCanvas.width/2;
      let y = ev.clientY - rect.top - colorWheelCanvas.height/2;
      const r = Math.sqrt(x*x + y*y);
      if (r > colorWheelCanvas.width/2) return;
      let h = Math.atan2(y, x) * 180 / Math.PI;
      if (h < 0) h += 360;
      let s = r/(colorWheelCanvas.width/2);
      wheelSelected.h = h;
      wheelSelected.s = s;
      drawColorWheel();
      updateWheelPreview();
      updateModalBg();
    }
    pick(e);
    window.onmousemove = pick;
    window.onmouseup = ()=>window.onmousemove=window.onmouseup=null;
  };
  function updateModalBg() {
    const rgb = hslToRgb([wheelSelected.h, wheelSelected.s, wheelSelected.l]);
    const a = wheelSelected.a;
    modal.firstElementChild.style.background = `linear-gradient(120deg, rgba(${rgb[0]},${rgb[1]},${rgb[2]},${a}) 80%, var(--card) 100%)`;
    modal.firstElementChild.style.transition = 'background 0.18s';
  }
  function drawColorWheel() {
    const ctx = colorWheelCanvas.getContext('2d');
    const w = colorWheelCanvas.width, h = colorWheelCanvas.height;
    const l = wheelSelected.l;
    for(let y=0;y<h;y++){
      for(let x=0;x<w;x++){
        let dx = x-w/2, dy = y-h/2;
        let r = Math.sqrt(dx*dx+dy*dy);
        if(r>w/2) {ctx.clearRect(x,y,1,1);continue;}
        let angle = Math.atan2(dy,dx)*180/Math.PI;
        if(angle<0) angle+=360;
        let s = r/(w/2);
        let rgb = hslToRgb([angle,s,l]);
        ctx.fillStyle = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
        ctx.fillRect(x,y,1,1);
      }
    }
    // Draw picker circle
    const px = Math.round(wheelSelected.s*(w/2)*Math.cos(wheelSelected.h*Math.PI/180)+w/2);
    const py = Math.round(wheelSelected.s*(h/2)*Math.sin(wheelSelected.h*Math.PI/180)+h/2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(px,py,10,0,2*Math.PI);
    ctx.stroke();
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(px,py,13,0,2*Math.PI);
    ctx.stroke();
  }
  function updateWheelPreview() {
    const rgb = hslToRgb([wheelSelected.h, wheelSelected.s, wheelSelected.l]);
    let val;
    if(wheelFormat.value==='hex') val = rgbToHex(rgb);
    else if(wheelFormat.value==='rgb') val = `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
    else if(wheelFormat.value==='rgba') val = `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${wheelSelected.a.toFixed(2)})`;
    else if(wheelFormat.value==='hsl') val = `hsl(${Math.round(wheelSelected.h)},${Math.round(wheelSelected.s*100)}%,${Math.round(wheelSelected.l*100)}%)`;
    else if(wheelFormat.value==='hsla') val = `hsla(${Math.round(wheelSelected.h)},${Math.round(wheelSelected.s*100)}%,${Math.round(wheelSelected.l*100)}%,${wheelSelected.a.toFixed(2)})`;
    wheelPreview.style.background = (wheelFormat.value==='rgba'||wheelFormat.value==='hsla') ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${wheelSelected.a})` : rgbToHex(rgb);
    wheelPreview.title = val;
  }
  // HSL to RGB helper
  function hslToRgb([h,s,l]) {
    h = h/360;
    let r, g, b;
    if(s===0){r=g=b=l*255;return [r,g,b].map(Math.round);}
    const hue2rgb = (p,q,t)=>{
      if(t<0)t+=1;if(t>1)t-=1;
      if(t<1/6)return p+(q-p)*6*t;
      if(t<1/2)return q;
      if(t<2/3)return p+(q-p)*(2/3-t)*6;
      return p;
    };
    const q = l<0.5?l*(1+s):l+s-l*s;
    const p = 2*l-q;
    r = hue2rgb(p,q,h+1/3);
    g = hue2rgb(p,q,h);
    b = hue2rgb(p,q,h-1/3);
    return [r*255,g*255,b*255].map(Math.round);
  }
  // RGB to HEX helper
  function rgbToHex([r,g,b]) {
    return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
  }
})();
