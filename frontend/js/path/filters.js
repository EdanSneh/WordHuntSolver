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

  var btnRow = document.createElement('div');
  btnRow.className = 'filter-btn-row';

  sorted.forEach(function(len) {
    var btn = document.createElement('button');
    btn.className = 'btn-len' + (activeLengths.has(len) ? ' active' : '');
    btn.textContent = len + ' tiles';
    btn.addEventListener('click', function() { toggleLength(len); });
    btnRow.appendChild(btn);
  });
  container.appendChild(btnRow);

  var linkRow = document.createElement('div');
  linkRow.className = 'filter-link-row';

  var selectAllBtn = document.createElement('button');
  selectAllBtn.className = 'btn-len-link';
  selectAllBtn.textContent = 'Select All';
  selectAllBtn.addEventListener('click', function() {
    sorted.forEach(function(len) { activeLengths.add(len); });
    highlightedIdx = -1;
    renderLengthFilters();
    renderPathList();
    renderSVG();
  });
  linkRow.appendChild(selectAllBtn);

  var clearAllBtn = document.createElement('button');
  clearAllBtn.className = 'btn-len-link';
  clearAllBtn.textContent = 'Clear All';
  clearAllBtn.addEventListener('click', function() {
    activeLengths.clear();
    highlightedIdx = -1;
    renderLengthFilters();
    renderPathList();
    renderSVG();
  });
  linkRow.appendChild(clearAllBtn);

  container.appendChild(linkRow);
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
  if (!activeLengths.has((path.tiles || []).length)) return false;
  if (searchText) {
    var word = getPathWord(path).toUpperCase();
    var query = searchText.toUpperCase();
    var revQuery = query.split('').reverse().join('');
    if (word.indexOf(query) === -1 && word.indexOf(revQuery) === -1) return false;
  }
  return true;
}
