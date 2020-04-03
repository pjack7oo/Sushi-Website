import * as customers   from './customers.js';
import * as drawing from '../utils/drawing.js';
import * as ioControl from '../utils/iocontrol.js';
import * as cutSt       from './cuttingstation.js';
import * as shapes      from '../utils/shapes.js';
import * as rollControl from './rolls.js';
import * as plates      from './plates.js';
import * as ingredients from './ingredients.js';
import * as riceCooker  from './riceCooker.js';
import * as rollingMatt from './rollingmatt.js';
import * as player      from './player.js';
import * as ingredientMenu from './ingredientmenu.js';
import * as ingredientBox  from './ingredientbox.js';
import * as clock         from './clock.js';
import * as upgradeMenu   from './upgrademenu.js';



var currentLevel = 0;
// var levelCustomers = [];
var availableCustomerCount = 1;
var startTime = 0;
var maxTime   = 60000;
var levelActive = false;
var goalAmount  = 0;
var interval = 20;
var activeInterval;


var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');
//level number determines number of customers in the level
export function startLevel() {
    cancelAnimationFrame(activeInterval);
    ioControl.clearButtons();
    startTime = performance.now();
    levelActive = true;

    canvas.removeEventListener('click', ioControl.buttonClick, false);
    ioControl.clearButtons();
    console.log("start");
    
    clearInterval(activeInterval);
    rollControl.rollListInit();
    rollControl.clearMadeRolls();
    plates.clearMoveablePlates();

    plates.createPlate();
    //console.log(plates.plateHolder);
    //setInterval(update, interval); //draw every interval milliseconds

    canvas.onmousedown = ioControl.myDown;
    canvas.onmouseup   = ioControl.myUp;
    //canvas.ondblclick  = myDbkClick; // temp dbl click for making new boxes

    canvas.setAttribute("tabindex", 0);
    canvas.addEventListener('keydown', ioControl.doKeyPress, false);
    // add custom init
    //plates.createPlate();
    clock.resetClock();
    cutSt.resetCuttingStation();
    ingredientMenu.ingredientsMenuInit(context);
    rollingMatt.clearMatt();
    //ingredients.clearActiveIngredients();
    // addBox(shapeType.RECTANGLE, 200, 200, 40, 40, ingredients.RICE, true, 'White', 'White');
    riceCooker.createRice();
    // addBox(shapeType.RECTANGLE, 25, 90, 25, 25, ingredients.AVOCADO,true, 'Yellow', 'Green');
    //ingredients.createAvocado(50, 320);
    // addBox(shapeType.RECTANGLE, 25, 125, 40, 25, ingredients.CRAB,true, 'white', 'Red',2);
    //ingredients.createCrab(105, 320);
    // addBox(shapeType.RECTANGLE, 25, 150, 40, 25, ingredients.CUCUMBER,true, 'Green', 'Green');
    //ingredients.createCucumber(160, 320);
    //customers.getRandomCustomer();
    drawing.Invalidate();
    //activeInterval = setInterval(levelUpdate,interval);
    // switch(currentLevel) {
    //     default:
    //         levelUpdate(context);
    //         break
    // }
    
    levelUpdate(context);
}

function levelUpdate() {
    activeInterval = requestAnimationFrame(levelUpdate);
    
    customers.updateCustomers();
    //ingredientMenu.updateMenu();
    checkLevelTime();
    if (checkLevelEnd()) {
        nextLevel(context);
    }
    if (checkCustomerAvailable()) {
        console.log("new customer");
        
        getCustomer();
    }
    cutSt.checkCutRoll();


    levelDraw();
}

export function getCurrentLevel() {
    return currentLevel;
}

function levelDraw() {

    drawing.draw();
    
}
function checkCustomerAvailable() {
    return(customers.getCustomerLength() < availableCustomerCount);
}
function getCustomer() {
    if (customers.updateGetCustomer()) {
        customers.getLevelCustomer(currentLevel);
    }
}

function checkLevelEnd() {
    if (customers.getCustomerLength() == 0 && !levelActive) {
        console.log("level is over");
        return true;
    }
    else {
        return false;
    }
}

function checkLevelTime() {
    if (levelActive) {
        let currentTime = performance.now(),
        elapsedTime = currentTime - startTime,
        precentage  = (elapsedTime / maxTime)*100;
        //console.log(precentage);
        clock.updateClockProgress(precentage);
            
        if (precentage >= 100)
        {
           levelActive = false;
        }
    }
    
}

function nextLevel(context) {
    cancelAnimationFrame(activeInterval);
    activeInterval = undefined;
    currentLevel += 1;
    // ioControl.clearButtons();
    // ioControl.addButton(shapes.createButton(350,200,100,50,"Next", true, 1, startLevel, "StartLevel-Next"));
    // canvas.addEventListener('click', ioControl.buttonClick, false);
    // nextLevelScreen();
    upgradeMenu.upgradeScreen();
}
//display money made and button to continue to next level
function nextLevelScreen() {
    
    activeInterval = requestAnimationFrame(nextLevelScreen);
    // ioControl.addButton(shapes.createButton(350,200,100,50,"Next", true, 1, startLevel));
    // canvas.addEventListener('click', ioControl.buttonClick, false);
    nextLevelScreenUpdate();

}

function nextLevelScreenUpdate() {
    drawing.clear(context);
    ioControl.drawIoButtons();
}