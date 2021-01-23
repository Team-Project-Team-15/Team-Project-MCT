let playerName = {},
    continueButton;

const isEmpty = function(fieldValue) {
    return !fieldValue || !fieldValue.length;
};

const getDOMElements = function() {
    playerName.field = document.querySelector('.js-name-field');
    playerName.input = document.querySelector('.js-name-input');
    playerName.errorMessage = document.querySelector('.js-name-error');
    continueButton = document.querySelector('.js-continue-button');
}

const addErrors = function(formField, errorField, errorMessage) {
    errorField.style.display = 'flex';
    errorField.innerHTML = errorMessage;
    continueButton.disabled = true;
}

const removeErrors = function(formField, errorField) {
    formField.classList.remove('has-error');
    errorField.style.display = 'none';
    continueButton.disabled = false;
}
 
const enableListeners = function() {
    playerName.input.addEventListener('blur', function() {
        if (isEmpty(playerName.input.value)) {
            addErrors(playerName.input, playerName.errorMessage, 'A name is required.');
        } else {
            if (!isEmpty(playerName.input.value)) {
                removeErrors(playerName.field, playerName.errorMessage);
            }
        }
    });

    continueButton.addEventListener('click', function() {
        localStorage.setItem("playerName", playerName.input.value)
        window.location.href = "start.html";
    })
}

document.addEventListener('DOMContentLoaded', function() {
    console.info('DOM LOADED')
    getDOMElements();
    enableListeners();
})