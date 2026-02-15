var COLOR_HUES = {
  RED: 0, ORANGE: 30, YELLOW: 55, GREEN: 120,
  CYAN: 180, BLUE: 220, PURPLE: 275, PINK: 330
};

var DARKNESS_K = 0.1;

function hslColor(colorEnum, darkness) {
  var hue = COLOR_HUES[colorEnum] != null ? COLOR_HUES[colorEnum] : 0;
  // Log curve with tunable k: lower k = more aggressive at low values
  var t = Math.log(1 + darkness * DARKNESS_K) / Math.log(1 + 100 * DARKNESS_K);
  var lightness = 75 - t * 50;
  return 'hsl(' + hue + ', 90%, ' + lightness + '%)';
}
