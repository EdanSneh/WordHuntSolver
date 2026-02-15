var paths = [];
var highlightedIdx = -1;

function renderSVG() {
  var svg = document.getElementById('svgOverlay');
  var wrapper = document.querySelector('.board-wrapper');
  var wrapperRect = wrapper.getBoundingClientRect();
  svg.setAttribute('width', wrapperRect.width);
  svg.setAttribute('height', wrapperRect.height);
  svg.setAttribute('viewBox', '0 0 ' + wrapperRect.width + ' ' + wrapperRect.height);
  svg.innerHTML = '';

  paths.forEach(function(path, idx) {
    if (!path.tiles || path.tiles.length < 2) return;
    if (!isPathVisible(path)) return;
    var color = hslColor(path.color, path.darkness);
    var isHighlighted = idx === highlightedIdx;

    var points = path.tiles.map(function(tc) {
      var pt = getTileCenter(tc[0], tc[1]);
      return pt.x + ',' + pt.y;
    }).join(' ');

    var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', points);
    polyline.setAttribute('stroke', color);
    polyline.setAttribute('stroke-width', isHighlighted ? '7' : '3.5');
    polyline.setAttribute('stroke-opacity', isHighlighted ? '1' : '0.75');
    if (isHighlighted) polyline.classList.add('highlighted');
    svg.appendChild(polyline);

    var startPt = getTileCenter(path.tiles[0][0], path.tiles[0][1]);
    var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', startPt.x + 12);
    label.setAttribute('y', startPt.y - 10);
    label.setAttribute('fill', color);
    label.setAttribute('font-size', isHighlighted ? '13' : '11');
    label.setAttribute('font-weight', '700');
    label.textContent = path.label || '';
    svg.appendChild(label);
  });
}

function renderPathList() {
  var list = document.getElementById('pathList');
  if (paths.length === 0) {
    list.innerHTML = '<li class="no-paths">No paths yet. Fill the board and click Solve.</li>';
    return;
  }
  list.innerHTML = '';
  paths.forEach(function(path, idx) {
    if (!isPathVisible(path)) return;
    var li = document.createElement('li');
    li.className = 'path-item' + (idx === highlightedIdx ? ' active' : '');
    (function(i) {
      li.addEventListener('click', function() {
        highlightedIdx = highlightedIdx === i ? -1 : i;
        renderPathList();
        renderSVG();
      });
    })(idx);

    var swatch = document.createElement('span');
    swatch.className = 'color-swatch';
    swatch.style.background = hslColor(path.color, path.darkness);

    var labelSpan = document.createElement('span');
    labelSpan.className = 'path-label';
    labelSpan.textContent = path.label || '\u2014';

    var wordSpan = document.createElement('span');
    wordSpan.className = 'path-word';
    var word = (path.tiles || []).map(function(tc) {
      return (grid[tc[0]] && grid[tc[0]][tc[1]]) ? grid[tc[0]][tc[1]] : '?';
    }).join('');
    wordSpan.textContent = word;

    var brSpan = document.createElement('span');
    brSpan.className = 'path-brightness';
    brSpan.textContent = path.darkness;

    li.appendChild(swatch);
    li.appendChild(labelSpan);
    li.appendChild(wordSpan);
    li.appendChild(brSpan);
    list.appendChild(li);
  });
}

function clearPaths() {
  paths = [];
  highlightedIdx = -1;
  activeLengths.clear();
  searchText = '';
  document.getElementById('searchInput').value = '';
  renderLengthFilters();
  updateSearchFilterVisibility();
  renderPathList();
  renderSVG();
}
