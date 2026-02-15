var activeLengths = new Set();
var searchText = '';

function renderLengthFilters() {
  var container = document.getElementById('lengthFilters');
  var lengths = new Set(paths.map(function(p) { return (p.tiles || []).length; }));
  var sorted = Array.from(lengths).sort(function(a, b) { return a - b; });

  if (sorted.length === 0) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = '';

  var allBtn = document.createElement('button');
  allBtn.className = 'btn-len' + (activeLengths.size === 0 ? ' active' : '');
  allBtn.textContent = 'All';
  allBtn.addEventListener('click', function() {
    activeLengths.clear();
    highlightedIdx = -1;
    renderLengthFilters();
    renderPathList();
    renderSVG();
  });
  container.appendChild(allBtn);

  sorted.forEach(function(len) {
    var btn = document.createElement('button');
    btn.className = 'btn-len' + (activeLengths.has(len) ? ' active' : '');
    btn.textContent = len + ' tiles';
    btn.addEventListener('click', function() { toggleLength(len); });
    container.appendChild(btn);
  });
}

function toggleLength(len) {
  if (activeLengths.has(len)) {
    activeLengths.delete(len);
  } else {
    activeLengths.add(len);
  }
  highlightedIdx = -1;
  renderLengthFilters();
  renderPathList();
  renderSVG();
}

function updateSearchFilterVisibility() {
  var container = document.getElementById('searchFilter');
  if (paths.length === 0) {
    container.classList.add('hidden');
  } else {
    container.classList.remove('hidden');
  }
}

function getPathWord(path) {
  return (path.tiles || []).map(function(tc) {
    return (grid[tc[0]] && grid[tc[0]][tc[1]]) ? grid[tc[0]][tc[1]] : '?';
  }).join('');
}

function isPathVisible(path) {
  if (activeLengths.size > 0 && !activeLengths.has((path.tiles || []).length)) return false;
  if (searchText) {
    var word = getPathWord(path).toUpperCase();
    var query = searchText.toUpperCase();
    var revQuery = query.split('').reverse().join('');
    if (word.indexOf(query) === -1 && word.indexOf(revQuery) === -1) return false;
  }
  return true;
}
