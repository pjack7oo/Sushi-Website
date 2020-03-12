var currentLevel = 0;
var levelCustomers = [];
var availableCustomerCount = 0;
var startTime = 0;
var levelActive = false;


var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');
//level number determines number of customers in the level
function setUpLevel(level) {
    startTime = performance.now();
    levelActive = true;
}

function levelUpdate(context) {
    requestAnimationFrame(levelUpdate);

    if (checkLevelEnd) {
        nextLevelScreen(context);
    }

    levelDraw(context);
}

function levelDraw(context) {

}

function getCustomer() {

}

function checkLevelEnd() {
    if (levelCustomers.length == 0 && !levelActive) {
        console.log("level is over");
        return true;
    }
    else {
        return false;
    }
}

//display money made and button to continue to next level
function nextLevelScreen(context) {
    requestAnimationFrame(nextLevelScreen);

    canvas.removeEventListener('click', buttonClick, false);
}