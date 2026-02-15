var gridSize = 4;
var grid = [];

function initGrid() {
  grid = [];
  for (var r = 0; r < gridSize; r++) {
    grid.push([]);
    for (var c = 0; c < gridSize; c++) {
      grid[r].push('');
    }
  }
  selectedRow = -1;
  selectedCol = -1;
  clearPaths();
  renderBoard();
  saveState();
}

function renderBoard() {
  var board = document.getElementById('board');
  board.className = 'board size-' + gridSize;
  board.innerHTML = '';
  for (var r = 0; r < gridSize; r++) {
    for (var c = 0; c < gridSize; c++) {
      var tile = document.createElement('div');
      tile.className = 'tile';
      if (r === selectedRow && c === selectedCol) tile.classList.add('selected');
      tile.textContent = grid[r][c];
      tile.dataset.row = r;
      tile.dataset.col = c;
      (function(row, col) {
        tile.addEventListener('mousedown', function(e) {
          e.preventDefault();
          e.stopPropagation();
          selectTile(row, col);
        });
      })(r, c);
      board.appendChild(tile);
    }
  }
}

function setGridSize(size) {
  gridSize = size;
  document.querySelectorAll('.btn-size').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.size) === size);
  });
  initGrid();
}

function clearBoard() {
  initGrid();
}
