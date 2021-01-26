const getDOMElements = function() {
    levelHtml = document.querySelector('.js-level');
    totalTimeHtml = document.querySelector('.js-total-time');
    returnBtnHtml = document.querySelector('.js-return-btn')
    params = (new URL(document.location)).searchParams;
    level = params.get('level');
    time = params.get('time');
}

const drawItems = function() {
    levelHtml.textContent = "LEVEL " + String(level);
    totalTimeHtml.textContent = String(time);
}

const btn = function() {
    returnBtnHtml.addEventListener('click', function() {
        window.location.replace("index.html");
    })
}

document.addEventListener('DOMContentLoaded', function() {
    console.info('DOM LOADED');
    getDOMElements();
    drawItems();
    btn();
  })