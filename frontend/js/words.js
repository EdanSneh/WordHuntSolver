var words = [];
var highlightedWordTiles = new Set();

function renderWordList() {
  var panel = document.getElementById('wordsPanel');
  var list = document.getElementById('wordList');

  if (words.length === 0) {
    panel.classList.add('hidden');
    list.innerHTML = '<li class="no-paths">No words found yet.</li>';
    return;
  }
  panel.classList.remove('hidden');
  list.innerHTML = '';

  // Build set of associated word IDs from selected path
  var associatedIds = new Set();
  if (highlightedIdx >= 0 && paths[highlightedIdx]) {
    var wids = paths[highlightedIdx].word_ids || [];
    for (var j = 0; j < wids.length; j++) {
      associatedIds.add(wids[j]);
    }
  }

  words.forEach(function(word) {
    var li = document.createElement('li');
    li.className = 'word-item';
    if (associatedIds.has(word.id)) li.classList.add('associated');

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
}

function updateHighlightedWordTiles() {
  highlightedWordTiles.clear();
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
  highlightedWordTiles.clear();
  renderWordList();
}
