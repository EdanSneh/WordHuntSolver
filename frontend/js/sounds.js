var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playErrorBuzz() {
  var osc = audioCtx.createOscillator();
  var gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = 200;
  gain.gain.value = 0.08;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
  osc.stop(audioCtx.currentTime + 0.15);
}

function playSuccessChime() {
  [523, 659, 784].forEach(function(freq, i) {
    var osc = audioCtx.createOscillator();
    var gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.value = freq;
    gain.gain.value = 0.1;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    var t = audioCtx.currentTime + i * 0.12;
    osc.start(t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc.stop(t + 0.25);
  });
}
