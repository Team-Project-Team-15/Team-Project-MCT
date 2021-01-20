const getDOMElements = function() {
    cooldownTimerHtml = document.querySelector('.js-cooldown-timer');
    levelHtml = document.querySelector('.js-level');
    levelRemainingHtml = document.querySelector('.js-level-remaining');
    params = (new URL(document.location)).searchParams;
    level = parseInt(params.get('level'));
    minutes = params.get('minutes');
    seconds = params.get('seconds');
}

const drawItems = function() {
    levelHtml.textContent = "LEVEL " + String(level);
    levelRemainingHtml.textContent = String(minutes) + ":" + String(seconds);
}

const cooldown = function() {
    duration = 5;
    var cooldown = duration, minutes, seconds;
    var startCooldown = setInterval(() => {
        minutes = parseInt(cooldown / 60, 10);
        seconds = parseInt(cooldown % 60, 10);
  
        minutes = minutes < 10 ? minutes : minutes;
        seconds = seconds < 10 ? seconds : seconds;
  
        cooldownTimerHtml.textContent = seconds + "...";
        if(--cooldown < 0) {
          cooldownTimerHtml.textContent = "0";
          window.location.replace("start.html?inProgress&level="+ (level + 1));
          clearInterval(startCooldown);
        }
    }, 1000);
}

document.addEventListener('DOMContentLoaded', function() {
    console.info('DOM LOADED');
    getDOMElements();
    cooldown();
    drawItems();
  })