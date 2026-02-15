var MAX_HISTORY = 3;

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem('wh_history') || '[]');
  } catch(e) { return []; }
}

function saveToHistory(boardGrid, boardSize, wordCount) {
  var history = getHistory();
  var key = JSON.stringify(boardGrid);
  history = history.filter(function(h) { return JSON.stringify(h.grid) !== key; });
  history.unshift({ grid: boardGrid, size: boardSize, words: wordCount, time: Date.now() });
  if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);
  localStorage.setItem('wh_history', JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  var panel = document.getElementById('historyPanel');
  var list = document.getElementById('historyList');
  var history = getHistory();
  if (history.length === 0) {
    panel.classList.add('hidden');
    return;
  }
  panel.classList.remove('hidden');
  list.innerHTML = '';
  history.forEach(function(entry, idx) {
    var li = document.createElement('li');
    li.className = 'history-item';
    (function(e) {
      li.addEventListener('click', function() { restoreFromHistory(e); });
    })(entry);

    var miniGrid = document.createElement('div');
    miniGrid.className = 'mini-grid mg-' + entry.size;
    for (var r = 0; r < entry.size; r++) {
      for (var c = 0; c < entry.size; c++) {
        var cell = document.createElement('div');
        cell.className = 'mini-cell';
        cell.textContent = (entry.grid[r] && entry.grid[r][c]) || '';
        miniGrid.appendChild(cell);
      }
    }

    var info = document.createElement('div');
    info.className = 'history-info';
    var wordsSpan = document.createElement('span');
    wordsSpan.className = 'history-words';
    wordsSpan.textContent = entry.words + ' words \u00b7 ' + entry.size + '\u00d7' + entry.size;
    var dateSpan = document.createElement('span');
    dateSpan.className = 'history-date';
    dateSpan.textContent = formatHistoryTime(entry.time);
    info.appendChild(wordsSpan);
    info.appendChild(dateSpan);

    li.appendChild(miniGrid);
    li.appendChild(info);
    list.appendChild(li);
  });
}

function formatHistoryTime(ts) {
  var d = new Date(ts);
  var now = new Date();
  var diff = now - d;
  if (diff < 60000) return 'Just now';
  if (diff < 3600000) return Math.floor(diff / 60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff / 3600000) + 'h ago';
  return d.toLocaleDateString();
}

function restoreFromHistory(entry) {
  gridSize = entry.size;
  grid = entry.grid.map(function(row) { return row.slice(); });
  document.querySelectorAll('.btn-size').forEach(function(b) {
    b.classList.toggle('active', parseInt(b.dataset.size) === gridSize);
  });
  selectedRow = -1;
  selectedCol = -1;
  clearPaths();
  renderBoard();
  saveState();
}
