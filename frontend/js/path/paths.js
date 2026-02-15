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

  if (highlightedIdx >= 0 && paths[highlightedIdx]) {
    var selectedPath = paths[highlightedIdx];

    // Draw the selected hot zone path highlighted
    if (selectedPath.tiles && selectedPath.tiles.length >= 2) {
      var hotColor = hslColor(selectedPath.color, selectedPath.darkness);
      var hotPoints = selectedPath.tiles.map(function(tc) {
        var pt = getTileCenter(tc[0], tc[1]);
        return pt.x + ',' + pt.y;
      }).join(' ');

      var hotLine = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      hotLine.setAttribute('points', hotPoints);
      hotLine.setAttribute('stroke', hotColor);
      hotLine.setAttribute('stroke-width', '7');
      hotLine.setAttribute('stroke-opacity', '1');
      hotLine.classList.add('highlighted');
      svg.appendChild(hotLine);
    }

    // Draw associated word paths on top
    var wordIdSet = new Set(selectedPath.word_ids || []);
    var colorHues = [0, 30, 55, 120, 180, 220, 275, 330];
    var wordIdx = 0;
    words.forEach(function(word) {
      if (!wordIdSet.has(word.id)) return;
      if (!word.tiles || word.tiles.length < 2) return;
      var hue = colorHues[wordIdx % colorHues.length];
      var color = 'hsl(' + hue + ', 90%, 45%)';

      var points = word.tiles.map(function(tc) {
        var pt = getTileCenter(tc[0], tc[1]);
        return pt.x + ',' + pt.y;
      }).join(' ');

      var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', points);
      polyline.setAttribute('stroke', color);
      polyline.setAttribute('stroke-width', '5');
      polyline.setAttribute('stroke-opacity', '0.9');
      svg.appendChild(polyline);

      var startPt = getTileCenter(word.tiles[0][0], word.tiles[0][1]);
      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', startPt.x + 12);
      label.setAttribute('y', startPt.y - 10);
      label.setAttribute('fill', color);
      label.setAttribute('font-size', '13');
      label.setAttribute('font-weight', '700');
      label.textContent = word.label;
      svg.appendChild(label);

      wordIdx++;
    });
  } else {
    // Default: draw hot zone paths
    paths.forEach(function(path, idx) {
      if (!path.tiles || path.tiles.length < 2) return;
      if (!isPathVisible(path)) return;
      var color = hslColor(path.color, path.darkness);

      var points = path.tiles.map(function(tc) {
        var pt = getTileCenter(tc[0], tc[1]);
        return pt.x + ',' + pt.y;
      }).join(' ');

      var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', points);
      polyline.setAttribute('stroke', color);
      polyline.setAttribute('stroke-width', '3.5');
      polyline.setAttribute('stroke-opacity', '0.75');
      svg.appendChild(polyline);

      var startPt = getTileCenter(path.tiles[0][0], path.tiles[0][1]);
      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', startPt.x + 12);
      label.setAttribute('y', startPt.y - 10);
      label.setAttribute('fill', color);
      label.setAttribute('font-size', '11');
      label.setAttribute('font-weight', '700');
      label.textContent = path.label || '';
      svg.appendChild(label);
    });
  }
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
        updateHighlightedWordTiles();
        renderPathList();
        renderWordList();
        renderSVG();
        renderBoard();
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
  clearWords();
  renderPathList();
  renderSVG();
}
