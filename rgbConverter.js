// RGB Hexadecimal/Decimal Converter Module
// Handles all logic for the RGB/Hex/Decimal converter UI

export function initRGBConverter({
  colorInput,
  updateColor,
  updateRGBInputsFromHex,
  highlightGridSwatch,
  rgbToHex,
  hexToRgb,
  namedColors
}) {
  // Get all DOM elements for the converter
  const rHex = document.getElementById('rHex');
  const gHex = document.getElementById('gHex');
  const bHex = document.getElementById('bHex');
  const rDec = document.getElementById('rDec');
  const gDec = document.getElementById('gDec');
  const bDec = document.getElementById('bDec');
  const rMinus = document.getElementById('rMinus');
  const rPlus = document.getElementById('rPlus');
  const gMinus = document.getElementById('gMinus');
  const gPlus = document.getElementById('gPlus');
  const bMinus = document.getElementById('bMinus');
  const bPlus = document.getElementById('bPlus');
  const allMinus = document.getElementById('allMinus');
  const allPlus = document.getElementById('allPlus');
  const hexDisplay = document.getElementById('hexDisplay');
  const decDisplay = document.getElementById('decDisplay');
  const hexString = document.getElementById('hexString');
  const hexStringDisplay = document.getElementById('hexStringDisplay');
  const namedColorSelect = document.getElementById('namedColorSelect');

  function clamp(val) { return Math.max(0, Math.min(255, val)); }

  // Sync hex/dec inputs
  function syncHexDecInputs() {
    rHex.value = (+rDec.value).toString(16).padStart(2,'0').toUpperCase();
    gHex.value = (+gDec.value).toString(16).padStart(2,'0').toUpperCase();
    bHex.value = (+bDec.value).toString(16).padStart(2,'0').toUpperCase();
  }
  function syncDecHexInputs() {
    rDec.value = parseInt(rHex.value,16)||0;
    gDec.value = parseInt(gHex.value,16)||0;
    bDec.value = parseInt(bHex.value,16)||0;
  }
  // Helper to update the background of the converter card
  function updateConverterBg(hex) {
    const card = document.querySelector('.rgb-converter-card');
    if (card) {
      card.style.transition = 'background 0.3s';
      card.style.background = hex;
    }
    // Also update the live swatch and value display
    const swatch = document.getElementById('rgbLiveSwatch');
    const hexVal = document.getElementById('rgbLiveHex');
    const rgbVal = document.getElementById('rgbLiveRgb');
    const decVal = document.getElementById('rgbLiveDec');
    if (swatch && hexVal && rgbVal && decVal) {
      swatch.style.background = hex;
      hexVal.textContent = hex.toUpperCase();
      const rgb = hexToRgb(hex);
      rgbVal.textContent = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
      decVal.textContent = rgb[0]*65536 + rgb[1]*256 + rgb[2];
    }
  }
  // Update background whenever color changes from converter
  function updateAllFromRGB() {
    syncHexDecInputs();
    const rgb = [parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0];
    const hex = rgbToHex(rgb);
    colorInput.value = hex;
    updateColor(hex);
    highlightGridSwatch(hex);
    updateRGBInputsFromHex(hex);
    updateConverterBg(hex);
  }
  // Hex input events
  [rHex,gHex,bHex].forEach((el,i)=>{
    el.addEventListener('input',()=>{
      el.value = el.value.replace(/[^0-9a-fA-F]/g,'').slice(0,2);
      syncDecHexInputs();
      updateAllFromRGB();
    });
  });
  // Dec input events
  [rDec,gDec,bDec].forEach((el,i)=>{
    el.addEventListener('input',()=>{
      el.value = el.value.replace(/[^0-9]/g,'').slice(0,3);
      if(+el.value>255) el.value=255;
      syncHexDecInputs();
      updateAllFromRGB();
    });
  });
  // + and - buttons
  rPlus.addEventListener('click', () => { rDec.value = clamp(+rDec.value + 1); updateAllFromRGB(); updateConverterBg(rgbToHex([parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0])); });
  rMinus.addEventListener('click', () => { rDec.value = clamp(+rDec.value - 1); updateAllFromRGB(); updateConverterBg(rgbToHex([parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0])); });
  gPlus.addEventListener('click', () => { gDec.value = clamp(+gDec.value + 1); updateAllFromRGB(); updateConverterBg(rgbToHex([parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0])); });
  gMinus.addEventListener('click', () => { gDec.value = clamp(+gDec.value - 1); updateAllFromRGB(); updateConverterBg(rgbToHex([parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0])); });
  bPlus.addEventListener('click', () => { bDec.value = clamp(+bDec.value + 1); updateAllFromRGB(); updateConverterBg(rgbToHex([parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0])); });
  bMinus.addEventListener('click', () => { bDec.value = clamp(+bDec.value - 1); updateAllFromRGB(); updateConverterBg(rgbToHex([parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0])); });
  allPlus.addEventListener('click', () => {
    rDec.value = clamp(+rDec.value + 1);
    gDec.value = clamp(+gDec.value + 1);
    bDec.value = clamp(+bDec.value + 1);
    updateAllFromRGB();
    updateConverterBg(rgbToHex([parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0]));
  });
  allMinus.addEventListener('click', () => {
    rDec.value = clamp(+rDec.value - 1);
    gDec.value = clamp(+gDec.value - 1);
    bDec.value = clamp(+bDec.value - 1);
    updateAllFromRGB();
    updateConverterBg(rgbToHex([parseInt(rDec.value)||0,parseInt(gDec.value)||0,parseInt(bDec.value)||0]));
  });
  // Display buttons: only update, do not reset values
  hexDisplay.onclick = () => { updateAllFromRGB(); };
  decDisplay.onclick = () => { updateAllFromRGB(); };
  // Hex string input
  hexString.addEventListener('input',()=>{
    hexString.value = hexString.value.replace(/[^0-9a-fA-F]/g,'').slice(0,6);
  });
  hexStringDisplay.onclick = ()=>{
    let hex = '#'+hexString.value.padStart(6,'0');
    colorInput.value = hex;
    updateColor(hex);
    updateRGBInputsFromHex(hex);
    highlightGridSwatch(hex);
    updateConverterBg(hex);
  };
  // Named color dropdown
  function populateNamedColorSelect() {
    namedColorSelect.innerHTML = '<option value="">-- Select --</option>';
    Object.entries(namedColors.names).forEach(([name,hex])=>{
      const opt = document.createElement('option');
      opt.value = hex;
      opt.textContent = name.charAt(0).toUpperCase()+name.slice(1);
      namedColorSelect.appendChild(opt);
    });
  }
  namedColorSelect.onchange = function() {
    if(this.value) {
      colorInput.value = this.value;
      updateColor(this.value);
      updateRGBInputsFromHex(this.value);
      highlightGridSwatch(this.value);
      updateConverterBg(this.value);
    }
  };
  populateNamedColorSelect();
  // When color input changes, update converter fields and background
  colorInput.addEventListener('input', e => {
    updateColor(e.target.value);
    updateRGBInputsFromHex(e.target.value);
    highlightGridSwatch(e.target.value);
    updateConverterBg(e.target.value);
  });
  // On page load, sync converter fields, highlight, and background
  updateRGBInputsFromHex(colorInput.value);
  highlightGridSwatch(colorInput.value);
  updateConverterBg(colorInput.value);
}
