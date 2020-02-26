import * as drawing from './utils/drawing.js';
import * as rollControl from './objects/rolls.js';
import * as ingrd from '../game/objects/ingredients.js';
import * as cutSt from './objects/cuttingstation.js';
import * as plates from './objects/plates.js';
import * as ioControl from './utils/iocontrol.js';
import * as ingredients from './objects/ingredients.js';


var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var start = Date.now();
var interval = 20;
var height;
var width;

// var activeIngredients = [];
// var innerIngredients = [];
// var outerIngredients = [];

 










var ghostcanvas;
/**@type {CanvasRenderingContext2D} */
var gctx;

var offsetX, offsetY;
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

context.fillStyle = 'Gray';
init();

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
    
    plates.createPlate();
    console.log(plates.plateHolder);
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
    //console.log(activeIngredients);
    //gameLoop();
}

function update() //used to update logic of parts of game like getting customers based on tim and randomness
{
    //requestAnimationFrame(update, canvas);

    var current = performance.now();

    
    
    cutSt.checkCutRoll();
    
    
    drawing.draw();
}
