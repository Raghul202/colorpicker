// Color Grid Palette Module
// Handles rendering and interaction for the color grid palette

// Web-safe color palette
export const colorGridColors = [
  '#000000','#000033','#000066','#000099','#0000cc','#0000ff','#003300','#003333','#003366','#003399','#0033cc','#0033ff','#006600','#006633','#006666','#006699',
  '#0066cc','#0066ff','#009900','#009933','#009966','#009999','#0099cc','#0099ff','#00cc00','#00cc33','#00cc66','#00cc99','#00cccc','#00ccff','#00ff00','#00ff33',
  '#00ff66','#00ff99','#00ffcc','#00ffff','#330000','#330033','#330066','#330099','#3300cc','#3300ff','#333300','#333333','#333366','#333399','#3333cc','#3333ff',
  '#336600','#336633','#336666','#336699','#3366cc','#3366ff','#339900','#339933','#339966','#339999','#3399cc','#3399ff','#33cc00','#33cc33','#33cc66','#33cc99',
  '#33cccc','#33ccff','#33ff00','#33ff33','#33ff66','#33ff99','#33ffcc','#33ffff','#660000','#660033','#660066','#660099','#6600cc','#6600ff','#663300','#663333',
  '#663366','#663399','#6633cc','#6633ff','#666600','#666633','#666666','#666699','#6666cc','#6666ff','#669900','#669933','#669966','#669999','#6699cc','#6699ff',
  '#66cc00','#66cc33','#66cc66','#66cc99','#66cccc','#66ccff','#66ff00','#66ff33','#66ff66','#66ff99','#66ffcc','#66ffff','#990000','#990033','#990066','#990099',
  '#9900cc','#9900ff','#993300','#993333','#993366','#993399','#9933cc','#9933ff','#996600','#996633','#996666','#996699','#9966cc','#9966ff','#999900','#999933',
  '#999966','#999999','#9999cc','#9999ff','#99cc00','#99cc33','#99cc66','#99cc99','#99cccc','#99ccff','#99ff00','#99ff33','#99ff66','#99ff99','#99ffcc','#99ffff',
  '#cc0000','#cc0033','#cc0066','#cc0099','#cc00cc','#cc00ff','#cc3300','#cc3333','#cc3366','#cc3399','#cc33cc','#cc33ff','#cc6600','#cc6633','#cc6666','#cc6699',
  '#cc66cc','#cc66ff','#cc9900','#cc9933','#cc9966','#cc9999','#cc99cc','#cc99ff','#cccc00','#cccc33','#cccc66','#cccc99','#cccccc','#ccccff','#ccff00','#ccff33',
  '#ccff66','#ccff99','#ccffcc','#ccffff','#ff0000','#ff0033','#ff0066','#ff0099','#ff00cc','#ff00ff','#ff3300','#ff3333','#ff3366','#ff3399','#ff33cc','#ff33ff',
  '#ff6600','#ff6633','#ff6666','#ff6699','#ff66cc','#ff66ff','#ff9900','#ff9933','#ff9966','#ff9999','#ff99cc','#ff99ff','#ffcc00','#ffcc33','#ffcc66','#ffcc99',
  '#ffcccc','#ffccff','#ffff00','#ffff33','#ffff66','#ffff99','#ffffcc','#ffffff'
];

export function renderColorGridPalette({
  colorGridPalette,
  colorInput,
  updateColor,
  updateRGBInputsFromHex,
  highlightGridSwatch
}) {
  colorGridPalette.innerHTML = '';
  colorGridColors.forEach(hex => {
    const swatch = document.createElement('button');
    swatch.className = 'color-grid-swatch';
    swatch.style.background = hex;
    swatch.setAttribute('aria-label', `Palette color ${hex}`);
    swatch.tabIndex = 0;
    swatch.onclick = () => {
      colorInput.value = hex;
      updateColor(hex);
      updateRGBInputsFromHex(hex);
      highlightGridSwatch(hex);
    };
    colorGridPalette.appendChild(swatch);
  });
}

export function initColorGrid({ colorInput, updateColor, updateRGBInputsFromHex, highlightGridSwatch }) {
  const colorGridPalette = document.getElementById('colorGridPalette');
  renderColorGridPalette({
    colorGridPalette,
    colorInput,
    updateColor,
    updateRGBInputsFromHex,
    highlightGridSwatch
  });
}
