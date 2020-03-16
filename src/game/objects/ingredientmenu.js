import * as ioControl from '../utils/iocontrol.js';
import * as shapes    from '../utils/shapes.js';
import * as drawing   from '../utils/drawing.js';
import * as ingredients from './ingredients.js';


/**@type {CanvasRenderingContext2D} */
var context;
const stateTypes = {
    SUBMENU: "SubMenu",
    FISH   : "Fish",
    INGREDIENTS: "Ingredients"
}
var active = false;
var state = stateTypes.SUBMENU;

var ingredientButtons = [];

export function ingredientsMenuInit(ctx) {
    active = false;
    createStartMenuButton();
    canvas.addEventListener('click', buttonClickMenu, false);
    context = ctx;
}

function buttonClickMenu(e) {
    ioControl.checkButtonsGiven(e, ingredientButtons);
    ioControl.buttonClick(e);
}

function createStartMenuButton() {
    ioControl.addButton(shapes.createButton(550, 250, 50, 25, "Ingredients", true, 1, changeMenu, "IngredientsMenu-Activate", 
                        shapes.shapeType.ROUNDRECT,'center' ,"9px Arial" , "#ADD8E6", "Gray"));    
}

function createMenuButtons() {
    ioControl.addButton(shapes.createButton(572, 252, 25, 25, "X", true, 1, changeMenu, "IngredientsMenu-X",   
                        shapes.shapeType.ROUNDRECT, 'center',  "15px Arial" ,"#ADD8E6", "Gray"));
    ioControl.addButton(shapes.createButton(410, 252, 25, 25, "<<", true, 1, undo, "IngredientsMenu-<<",   
                        shapes.shapeType.ROUNDRECT, 'center',  "15px Arial" ,"#ADD8E6", "Gray"));

}

function createSubMenuButtons() {
    clearButtons();
    ingredientButtons.push(shapes.createButton(410,260,50,25,"Fish", true , 1, setFishButtons, "FishMenu", 
                            shapes.shapeType.ROUNDRECT, 'Center', "15px Arial", "green", "Gray" ));
    ingredientButtons.push(shapes.createButton(470,260, 50, 25, "Vegtables", true, 1, "VegtablesMenu",
                            shapes.shapeType.ROUNDRECT, 'Center', "15px Arial", "green", "Gray" ));
    drawing.Invalidate();
}

function clearButtons() {
    ingredientButtons = [];
}

function setFishButtons() {
    clearButtons();
    ingredientButtons.push(shapes.createButton(410,260,50,25,"Crab", true , 1, ingredients.createCrab, "Create-Crab",
                            shapes.RoundRect, "center", "15px Arial", "white", 'Red')); //TODO need to make object for storing ingredients
}

function removeMenuButton() {
    if (active) {
        ioControl.delButton("IngredientsMenu-Activate");
    }
    else {
        ioControl.delButton("IngredientsMenu-X");
        ioControl.delButton("IngredientsMenu-<<");
        //ioControl.clearButtons();
    }
}

function undo() {
    if (state = stateTypes.FISH) {
        state = stateTypes.SUBMENU;
        createSubMenuButtons();
    }
}

function changeState() {
    active = !active;
}

function changeMenu() {
    if (active) {
        active = false;
        removeMenuButton();
        createStartMenuButton();
        
    }
    else {
        active = true;
        removeMenuButton();
        createMenuButtons();
        createSubMenuButtons();
    }
}

export function updateMenu() {
    if (active) {

    
    }
}

function drawMenuButtons() {
    drawing.drawButtons(context, ingredientButtons);
}

export function drawMenu() {
    if (active) {
        drawMenuArea();
        drawMenuButtons();
    }
}

function drawMenuArea() {
    context.fillStyle = "White";
    drawing.drawRoundRect(context, 405,250, 195, 150, 10, true, true, "White", "black");
    // context.fillRect( 405, 250, 195,150);
    
    
}

//TODO make scrollBar