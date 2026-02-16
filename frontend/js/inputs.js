function advanceCursor() {
  var c = selectedCol + 1;
  var r = selectedRow;
  if (c >= gridSize) { c = 0; r++; }
  if (r >= gridSize) { r = gridSize - 1; c = gridSize - 1; }
  selectedRow = r;
  selectedCol = c;
}

function retreatCursor() {
  var c = selectedCol - 1;
  var r = selectedRow;
  if (c < 0) { c = gridSize - 1; r--; }
  if (r < 0) { r = 0; c = 0; }
  selectedRow = r;
  selectedCol = c;
}

// Hidden input handler
document.getElementById('hiddenInput').addEventListener('keydown', function(e) {
  if (selectedRow < 0 || selectedCol < 0) return;

  if (e.key === 'Backspace') {
    e.preventDefault();
    if (grid[selectedRow][selectedCol] === '') {
      retreatCursor();
    }
    grid[selectedRow][selectedCol] = '';
    clearPaths();
    renderBoard();
    saveState();
    return;
  }

  if (e.key === 'ArrowUp') { e.preventDefault(); if (selectedRow > 0) selectedRow--; renderBoard(); renderSVG(); return; }
  if (e.key === 'ArrowDown') { e.preventDefault(); if (selectedRow < gridSize - 1) selectedRow++; renderBoard(); renderSVG(); return; }
  if (e.key === 'ArrowLeft') { e.preventDefault(); if (selectedCol > 0) selectedCol--; renderBoard(); renderSVG(); return; }
  if (e.key === 'ArrowRight') { e.preventDefault(); if (selectedCol < gridSize - 1) selectedCol++; renderBoard(); renderSVG(); return; }

  if (e.key === 'Tab') {
    e.preventDefault();
    if (e.shiftKey) retreatCursor(); else advanceCursor();
    renderBoard();
    renderSVG();
    return;
  }

  if (e.key === 'Escape') { e.preventDefault(); deselectTile(); return; }

  if (/^[a-zA-Z]$/.test(e.key)) {
    e.preventDefault();
    grid[selectedRow][selectedCol] = e.key.toUpperCase();
    clearPaths();
    advanceCursor();
    renderBoard();
    saveState();
    return;
  }

  // Invalid key
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    playErrorBuzz();
    shakeTile(selectedRow, selectedCol);
  }
});

// Click outside board deselects
document.addEventListener('mousedown', function(e) {
  var wrapper = document.querySelector('.board-wrapper');
  if (!wrapper.contains(e.target) && selectedRow >= 0) {
    deselectTile();
  }
});

// Search filter input
document.getElementById('searchInput').addEventListener('input', function(e) {
  searchText = e.target.value;
  highlightedIdx = -1;
  renderPathList();
  renderSVG();
});

// Rerender SVG on resize
window.addEventListener('resize', function() { renderSVG(); });
