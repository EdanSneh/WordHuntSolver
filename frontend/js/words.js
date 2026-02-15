var words = [];
var highlightedWordTiles = new Set();
var selectedWordIdx = -1;

function renderWordList() {
  var panel = document.getElementById('wordsPanel');
  var list = document.getElementById('wordList');
  var countEl = document.getElementById('wordCount');

  if (words.length === 0) {
    panel.classList.add('hidden');
    list.innerHTML = '<li class="no-paths">No words found yet.</li>';
    countEl.classList.add('hidden');
    return;
  }

  // Build set of associated word IDs from selected path
  var associatedIds = null;
  if (highlightedIdx >= 0 && paths[highlightedIdx]) {
    associatedIds = new Set(paths[highlightedIdx].word_ids || []);
  }

  // If a path is selected but no words match, hide panel
  if (associatedIds && associatedIds.size === 0) {
    panel.classList.add('hidden');
    list.innerHTML = '';
    countEl.classList.add('hidden');
    return;
  }

  panel.classList.remove('hidden');
  list.innerHTML = '';
  var visibleCount = 0;

  words.forEach(function(word, idx) {
    // Filter: only show associated words when a path is selected
    if (associatedIds && !associatedIds.has(word.id)) return;
    visibleCount++;

    var li = document.createElement('li');
    li.className = 'word-item';
    if (idx === selectedWordIdx) li.classList.add('selected');

    (function(i) {
      li.addEventListener('click', function() {
        selectedWordIdx = selectedWordIdx === i ? -1 : i;
        updateHighlightedWordTiles();
        renderWordList();
        renderSVG();
        renderBoard();
      });
    })(idx);

    var labelSpan = document.createElement('span');
    labelSpan.className = 'word-label';
    labelSpan.textContent = word.label;

    var lengthSpan = document.createElement('span');
    lengthSpan.className = 'word-length';
    lengthSpan.textContent = word.label.length;

    li.appendChild(labelSpan);
    li.appendChild(lengthSpan);
    list.appendChild(li);
  });
  countEl.textContent = visibleCount;
  countEl.classList.remove('hidden');
}

function updateHighlightedWordTiles() {
  highlightedWordTiles.clear();
  if (selectedWordIdx >= 0 && words[selectedWordIdx]) {
    words[selectedWordIdx].tiles.forEach(function(tile) {
      highlightedWordTiles.add(tile[0] + ',' + tile[1]);
    });
    return;
  }
  if (highlightedIdx < 0 || !paths[highlightedIdx]) return;

  var wordIds = paths[highlightedIdx].word_ids || [];
  var wordIdSet = new Set(wordIds);

  words.forEach(function(word) {
    if (wordIdSet.has(word.id)) {
      word.tiles.forEach(function(tile) {
        highlightedWordTiles.add(tile[0] + ',' + tile[1]);
      });
    }
  });
}

function clearWords() {
  words = [];
  selectedWordIdx = -1;
  highlightedWordTiles.clear();
  renderWordList();
}
