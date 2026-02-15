var COLORS = {
  RED:    'hsl(0, 90%, 50%)',
  ORANGE: 'hsl(30, 90%, 50%)',
  YELLOW: 'hsla(55, 82%, 52%, 0.88)',
  GREEN:  'hsla(120, 92%, 29%, 1.00)',
  CYAN:   'hsla(180, 87%, 40%, 1.00)',
  BLUE:   'hsl(220, 90%, 50%)',
  PURPLE: 'hsl(275, 90%, 50%)',
  PINK:   'hsl(330, 90%, 50%)'
};

function hslColor(colorEnum) {
  return COLORS[colorEnum] || 'hsl(0, 90%, 50%)';
}

function darknessToOpacity(darkness, minD, maxD) {
  // Relative scale: minD -> 0.15, maxD -> 1.0
  if (maxD <= minD) return 1;
  var t = (darkness - minD) / (maxD - minD);
  return 0.15 + t * 0.85;
}
