const showLevel = function() {
    if (level) {
        levelHtml.textContent = "LEVEL " + String(level)
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.info('DOM LOADED');
    showLevel();
  })