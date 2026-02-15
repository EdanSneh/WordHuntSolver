var COLOR_HUES = {
  RED: 0, ORANGE: 30, YELLOW: 55, GREEN: 120,
  CYAN: 180, BLUE: 220, PURPLE: 275, PINK: 330
};

function hslColor(colorEnum, darkness) {
  var hue = COLOR_HUES[colorEnum] != null ? COLOR_HUES[colorEnum] : 0;
  var lightness = 65 - (darkness / 100) * 40;
  return 'hsl(' + hue + ', 90%, ' + lightness + '%)';
}
