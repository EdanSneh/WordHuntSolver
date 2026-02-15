function saveState() {
  localStorage.setItem('wh_gridSize', gridSize);
  localStorage.setItem('wh_grid', JSON.stringify(grid));
}

// Boot — restore saved state or start fresh
(function() {
  var savedSize = parseInt(localStorage.getItem('wh_gridSize'));
  var savedGrid = localStorage.getItem('wh_grid');
  if (savedSize && savedGrid) {
    try {
      var parsed = JSON.parse(savedGrid);
      if (parsed.length === savedSize && parsed[0].length === savedSize) {
        gridSize = savedSize;
        grid = parsed;
        document.querySelectorAll('.btn-size').forEach(function(b) {
          b.classList.toggle('active', parseInt(b.dataset.size) === gridSize);
        });
        renderBoard();
        return;
      }
    } catch(e) {}
  }
  initGrid();
})();
renderHistory();
