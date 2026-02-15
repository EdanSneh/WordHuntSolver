var API_URL = 'http://localhost:8000';

async function solve() {
  var btn = document.getElementById('solveBtn');

  var hasEmpty = false;
  for (var r = 0; r < gridSize; r++) {
    for (var c = 0; c < gridSize; c++) {
      if (!grid[r][c]) {
        hasEmpty = true;
        shakeTile(r, c);
      }
    }
  }
  if (hasEmpty) {
    playErrorBuzz();
    showError('Please fill all tiles before solving.');
    return;
  }

  btn.disabled = true;
  btn.innerHTML = 'Solving<span class="spinner"></span>';

  try {
    var resp = await fetch(API_URL + '/solve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ grid: grid, size: gridSize })
    });
    if (!resp.ok) {
      throw new Error('Server error: ' + resp.status + ' ' + resp.statusText);
    }
    var data = await resp.json();
    paths = Array.isArray(data) ? data : (data.paths || []);
    words = data.words || [];
    highlightedIdx = -1;
    activeLengths.clear();
    searchText = '';
    document.getElementById('searchInput').value = '';
    renderLengthFilters();
    updateSearchFilterVisibility();
    renderPathList();
    renderWordList();
    renderSVG();
    playSuccessChime();
    saveToHistory(grid.map(function(row) { return row.slice(); }), gridSize, words.length);
  } catch (err) {
    showError('Solve failed: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Solve';
  }
}

function showError(msg) {
  var existing = document.querySelector('.error-toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(function() { toast.remove(); }, 4000);
}
