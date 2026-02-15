var paths = [];
var highlightedIdx = -1;

function drawArrowAt(svg, mx, my, angle, color) {
  var s = 14;
  var pts = [
    [-s, -s * 0.6],
    [s, 0],
    [-s, s * 0.6]
  ];
  var cosA = Math.cos(angle);
  var sinA = Math.sin(angle);
  var rotated = pts.map(function(p) {
    return [mx + p[0] * cosA - p[1] * sinA, my + p[0] * sinA + p[1] * cosA];
  });
  var d = 'M' + rotated[0][0] + ' ' + rotated[0][1] +
          'L' + rotated[1][0] + ' ' + rotated[1][1] +
          'L' + rotated[2][0] + ' ' + rotated[2][1] + 'Z';
  var arrow = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  arrow.setAttribute('d', d);
  arrow.setAttribute('fill', '#fff');
  arrow.setAttribute('stroke', color);
  arrow.setAttribute('stroke-width', '1');
  svg.appendChild(arrow);
}

function renderSVG() {
  var svg = document.getElementById('svgOverlay');
  var wrapper = document.querySelector('.board-wrapper');
  var wrapperRect = wrapper.getBoundingClientRect();
  svg.setAttribute('width', wrapperRect.width);
  svg.setAttribute('height', wrapperRect.height);
  svg.setAttribute('viewBox', '0 0 ' + wrapperRect.width + ' ' + wrapperRect.height);
  svg.innerHTML = '';

  var hasSelectedWord = selectedWordIdx >= 0 && words[selectedWordIdx];

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

    // Draw associated word paths in red (skip the already-drawn selected word)
    var wordIdSet = new Set(selectedPath.word_ids || []);
    var wordColor = 'hsl(0, 85%, 50%)';
    var dimOpacity = hasSelectedWord ? '0.2' : '0.5';

    words.forEach(function(word, idx) {
      if (!wordIdSet.has(word.id)) return;
      if (!word.tiles || word.tiles.length < 2) return;
      if (idx === selectedWordIdx) return; // drawn on top later

      var points = word.tiles.map(function(tc) {
        var pt = getTileCenter(tc[0], tc[1]);
        return pt.x + ',' + pt.y;
      }).join(' ');

      var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', points);
      polyline.setAttribute('stroke', wordColor);
      polyline.setAttribute('stroke-width', '3.5');
      polyline.setAttribute('stroke-opacity', dimOpacity);
      svg.appendChild(polyline);

      var startPt = getTileCenter(word.tiles[0][0], word.tiles[0][1]);
      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', startPt.x + 12);
      label.setAttribute('y', startPt.y - 10);
      label.setAttribute('fill', wordColor);
      label.setAttribute('font-size', '12');
      label.setAttribute('font-weight', '700');
      label.setAttribute('opacity', hasSelectedWord ? '0.25' : '0.6');
      label.textContent = word.label;
      svg.appendChild(label);
    });
  } else if (!hasSelectedWord) {
    // Default: draw hot zone paths (only if no word is selected either)
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

  // Draw selected word path on top (works with or without a path selected)
  if (hasSelectedWord) {
    var selWord = words[selectedWordIdx];
    if (selWord.tiles && selWord.tiles.length >= 2) {
      var wc = 'hsl(0, 85%, 50%)';
      var tilePts = selWord.tiles.map(function(tc) {
        return getTileCenter(tc[0], tc[1]);
      });

      // Draw the line
      var linePoints = tilePts.map(function(p) {
        return p.x + ',' + p.y;
      }).join(' ');
      var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polyline.setAttribute('points', linePoints);
      polyline.setAttribute('stroke', wc);
      polyline.setAttribute('stroke-width', '6');
      polyline.setAttribute('stroke-opacity', '1');
      polyline.classList.add('highlighted');
      svg.appendChild(polyline);

      // Draw arrows at midpoints of each segment only
      for (var k = 0; k < tilePts.length - 1; k++) {
        var mx = (tilePts[k].x + tilePts[k + 1].x) / 2;
        var my = (tilePts[k].y + tilePts[k + 1].y) / 2;
        var angle = Math.atan2(tilePts[k + 1].y - tilePts[k].y, tilePts[k + 1].x - tilePts[k].x);
        drawArrowAt(svg, mx, my, angle, wc);
      }

      var startPt = tilePts[0];
      var label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      label.setAttribute('x', startPt.x + 12);
      label.setAttribute('y', startPt.y - 10);
      label.setAttribute('fill', wc);
      label.setAttribute('font-size', '14');
      label.setAttribute('font-weight', '700');
      label.textContent = selWord.label;
      svg.appendChild(label);
    }
  }
}

function renderPathList() {
  var list = document.getElementById('pathList');
  var countEl = document.getElementById('pathCount');
  if (paths.length === 0) {
    list.innerHTML = '<li class="no-paths">No paths yet. Fill the board and click Solve.</li>';
    countEl.classList.add('hidden');
    return;
  }
  list.innerHTML = '';
  var visibleCount = 0;
  paths.forEach(function(path, idx) {
    if (!isPathVisible(path)) return;
    visibleCount++;
    var li = document.createElement('li');
    li.className = 'path-item' + (idx === highlightedIdx ? ' active' : '');
    (function(i) {
      li.addEventListener('click', function() {
        highlightedIdx = highlightedIdx === i ? -1 : i;
        selectedWordIdx = -1;
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
  countEl.textContent = visibleCount;
  countEl.classList.remove('hidden');
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
