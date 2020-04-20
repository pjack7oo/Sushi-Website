import * as drawing       from './utils/drawing.js';
import * as rollControl   from './objects/rolls.js';
import * as cutSt         from './objects/cuttingstation.js';
import * as plates        from './objects/plates.js';
import * as ioControl     from './utils/iocontrol.js';
import * as ingredients   from './objects/ingredients.js';
import * as customers     from './objects/customers.js';
import * as shapes        from './utils/shapes.js';
import * as levelControl  from './objects/level.js';
import * as upgradeMenu   from  './objects/upgrademenu.js';
import * as ingredientBox from './objects/ingredientbox.js';
import * as saveControl   from './utils/save.js';
import * as teaKettle     from './objects/teakettle.js';
import * as timedBox      from './utils/timedBox.js';

var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var start = Date.now();
var interval = 20;
var height;
var width;

var buttons = [];
var activeInterval;

var bambooimg = new Image();
bambooimg.src = "./Images/Bamboo.png";

// var activeIngredients = [];
// var innerIngredients = [];
// var outerIngredients = [];


var offsetX, offsetY;
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

context.fillStyle = 'Gray';
loadGame();

function loadGame() {
    if(rollsLoaded) {
        init();
    }
    else {
        setTimeout(function() {
            loadGame();
        }, 10*1000);
    }
}

function init()
{
    height = canvas.height;
    width = canvas.width;
    // ghostcanvas = document.createElement('canvas');
    // ghostcanvas.height = height;
    // ghostcanvas.width  = width;
    // gctx = ghostcanvas.getContext('2d');
    ioControl.initGhost(height, width);

    canvas.onselectstart = () => { return false; }

    if (document.defaultView && document.defaultView.getComputedStyle)
    {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
        stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
        styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
        styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
    }
    upgradeMenu.upgradeInit(canvas);
    ingredientBox.initIngredientBoxes();
    rollControl.rollListInit();
    cutSt.cuttingStationInit();
    teaKettle.teaKettleInit();
    // rollControl.rollListInit();
    // plates.createPlate();
    // //console.log(plates.plateHolder);
    //setInterval(update, interval); //draw every interval milliseconds

    // canvas.onmousedown = ioControl.myDown;
    // canvas.onmouseup   = ioControl.myUp;
    // //canvas.ondblclick  = myDbkClick; // temp dbl click for making new boxes

    // canvas.setAttribute("tabindex", 0);
    // canvas.addEventListener('keydown', ioControl.doKeyPress, false);
    // // add custom init
    // plates.createPlate();

    
    
    
    // // addBox(shapeType.RECTANGLE, 200, 200, 40, 40, ingredients.RICE, true, 'White', 'White');
    // ingredients.createRice(100,100);
    // // addBox(shapeType.RECTANGLE, 25, 90, 25, 25, ingredients.AVOCADO,true, 'Yellow', 'Green');
    // ingredients.createAvocado(100, 200);
    // // addBox(shapeType.RECTANGLE, 25, 125, 40, 25, ingredients.CRAB,true, 'white', 'Red',2);
    // ingredients.createCrab(100, 220);
    // // addBox(shapeType.RECTANGLE, 25, 150, 40, 25, ingredients.CUCUMBER,true, 'Green', 'Green');
    // ingredients.createCucumber(100, 240);
    // customers.getRandomCustomer();
    // drawing.Invalidate();
    // //console.log(activeIngredients);
    // //update();
    // //gameLoop();
    startScreen();
    
}

function game()
{
    rollControl.rollListInit();
    plates.createPlate();
    //console.log(plates.plateHolder);
    setInterval(update, interval); //draw every interval milliseconds

    canvas.onmousedown = ioControl.myDown;
    canvas.onmouseup   = ioControl.myUp;
    //canvas.ondblclick  = myDbkClick; // temp dbl click for making new boxes

    canvas.setAttribute("tabindex", 0);
    canvas.addEventListener('keydown', ioControl.doKeyPress, false);
    // add custom init
    plates.createPlate();

    
    
    
    // addBox(shapeType.RECTANGLE, 200, 200, 40, 40, ingredients.RICE, true, 'White', 'White');
    ingredients.createRice(100,100);
    // addBox(shapeType.RECTANGLE, 25, 90, 25, 25, ingredients.AVOCADO,true, 'Yellow', 'Green');
    ingredients.createAvocado(100, 200);
    // addBox(shapeType.RECTANGLE, 25, 125, 40, 25, ingredients.CRAB,true, 'white', 'Red',2);
    ingredients.createCrab(100, 220);
    // addBox(shapeType.RECTANGLE, 25, 150, 40, 25, ingredients.CUCUMBER,true, 'Green', 'Green');
    ingredients.createCucumber(100, 240);
    //customers.getRandomCustomer();
    drawing.Invalidate();
}

function startGame()
{
    // canvas.removeEventListener('click', ioControl.buttonClick, false);
    // ioControl.clearButtons();
    // console.log("start");
    
    // clearInterval(activeInterval);
    // rollControl.rollListInit();
    // plates.createPlate();
    // //console.log(plates.plateHolder);
    // //setInterval(update, interval); //draw every interval milliseconds

    // canvas.onmousedown = ioControl.myDown;
    // canvas.onmouseup   = ioControl.myUp;
    // //canvas.ondblclick  = myDbkClick; // temp dbl click for making new boxes

    // canvas.setAttribute("tabindex", 0);
    // canvas.addEventListener('keydown', ioControl.doKeyPress, false);
    // // add custom init
    // plates.createPlate();

    
    
    
    // // addBox(shapeType.RECTANGLE, 200, 200, 40, 40, ingredients.RICE, true, 'White', 'White');
    // ingredients.createRice(100,100);
    // // addBox(shapeType.RECTANGLE, 25, 90, 25, 25, ingredients.AVOCADO,true, 'Yellow', 'Green');
    // ingredients.createAvocado(100, 200);
    // // addBox(shapeType.RECTANGLE, 25, 125, 40, 25, ingredients.CRAB,true, 'white', 'Red',2);
    // ingredients.createCrab(100, 220);
    // // addBox(shapeType.RECTANGLE, 25, 150, 40, 25, ingredients.CUCUMBER,true, 'Green', 'Green');
    // ingredients.createCucumber(100, 240);
    // //customers.getRandomCustomer();
    // drawing.Invalidate();
    clearInterval(activeInterval);
    levelControl.startLevel();
}

// function buttonClick(e)
// {
//     var mousePos = ioControl.getMouse(e);
    
//     ioControl.checkButtons(mousePos);
// }

export function startScreen()
{
    ioControl.clearButtons();
    clearInterval(activeInterval);
    ioControl.addButton(shapes.createButton(50,50, 100, 50, "Start", true, 1, startGame, "StartGame-Start"));
    ioControl.addButton(shapes.createButton(50,100, 100, 50, "Upgrade", true, 1, upgradeMenu.upgradeScreen, "StartGame-Upgrade"));
    saveControl.saveINIT(50,150);
    ioControl.addButton(shapes.createButton(50,350, 100, 50, "About", true, 1, aboutSetup, "StartGame-About"));
    canvas.addEventListener('click', ioControl.buttonClick, false);

    activeInterval = setInterval(startUpdate, interval);
}

function aboutSetup() {
    ioControl.clearButtons();
    clearInterval(activeInterval);
    activeInterval = setInterval(aboutDraw, interval);


}

function aboutDraw() {
    drawing.clear(context);
    drawing.drawRectangle(context,0,0,700,500,true, 'green','green',1);
    ioControl.drawIoButtons();
    ioControl.addButton(shapes.createButton(50,50, 100, 50, "Return", true, 1, startScreen, "StartGame-Start"));
    drawing.printAtWordWrap(context, "Concept Made by: \nPiotr Jackowski\nCode by:\nPiotr Jackowski\n Art by:\nLorraine Hargrove\nPiotr Jackowski",350,50,50,250,"Orange","25px Arial","center");
}

function startUpdate()
{
    timedBox.checkTimedBoxes();
    drawing.clear(context);
    startDraw();
    timedBox.drawTimedBoxes(context);
}

function startDraw()
{
    drawing.drawRectangle(context,0,0,700,500,true,"LightGreen",'LightGreen',1);
    drawing.drawRectangle(context,0,450,700,50,true, "Brown","LightBrown",1);
    drawing.drawTriangle(context,{x:0,y:400},{x:0,y:450},{x:500,y:455},true, true, "Brown","Brown");
    drawBambooForest(0,0);
    drawBambooForest(450,0);
    drawBambooForest(100,0);
    drawBambooForest(200,0);
    drawBambooForest(300,0);
    drawBambooForest(600,0);
    drawBambooForest(800,0);
    drawing.drawTextBox(context, 275, 75, 150, 100, "Sushi Cat",false,true,-5, "50px Arial", "Red", "white", "Red");
    
    
    
    ioControl.drawIoButtons();
}

function drawBambooForest(x,y){
    drawing.drawRectImage(x-20,y,92,500,bambooimg);
    drawing.drawRectImage(x-50,y-10,92,500,bambooimg);
    drawing.drawRectImage(x,-50,y-92,500,bambooimg);
    drawing.drawRectImage(x+10,y-40,92,500,bambooimg);
    drawing.drawRectImage(x+30,y+0,92,500,bambooimg);
    drawing.drawRectImage(x+40,y-20,92,500,bambooimg);
    drawing.drawRectImage(x+45,y-30,92,500,bambooimg); 
}

function update() //used to update logic of parts of game like getting customers based on tim and randomness
{
    //requestAnimationFrame(update, canvas);

    var current = performance.now();
    customers.updateCustomers();
    
    
    cutSt.checkCutRoll();
    
    
    drawing.draw();
}
var lag = 0;
function gameLoop()
{
    requestAnimationFrame(gameLoop, canvas);

    var current = performance.now(), elapsed = current - start;
    start = current;

    lag += elapsed;

    var lagOffset = lag / frameDuration;
    //render(lagOffset);
    //draw();
}
