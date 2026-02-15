var selectedRow = -1;
var selectedCol = -1;

function selectTile(r, c) {
  selectedRow = r;
  selectedCol = c;
  renderBoard();
  renderSVG();
  var inp = document.getElementById('hiddenInput');
  inp.value = '';
  inp.focus();
}

function deselectTile() {
  selectedRow = -1;
  selectedCol = -1;
  renderBoard();
  renderSVG();
}

function shakeTile(row, col) {
  var board = document.getElementById('board');
  var tile = board.querySelectorAll('.tile')[row * gridSize + col];
  if (!tile) return;
  tile.classList.remove('shake-error');
  void tile.offsetWidth;
  tile.classList.add('shake-error');
  setTimeout(function() { tile.classList.remove('shake-error'); }, 400);
}

function getTileCenter(row, col) {
  var board = document.getElementById('board');
  var wrapper = document.querySelector('.board-wrapper');
  var tiles = board.querySelectorAll('.tile');
  var idx = row * gridSize + col;
  var tile = tiles[idx];
  if (!tile) return { x: 0, y: 0 };
  var wrapperRect = wrapper.getBoundingClientRect();
  var tileRect = tile.getBoundingClientRect();
  return {
    x: tileRect.left - wrapperRect.left + tileRect.width / 2,
    y: tileRect.top - wrapperRect.top + tileRect.height / 2
  };
}
