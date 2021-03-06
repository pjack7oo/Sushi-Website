import * as ioControl from "../utils/iocontrol.js";
import * as shapes from "../utils/shapes.js";
import * as drawing from "../utils/drawing.js";
import * as ingredients from "./ingredients.js";
import * as player from "./player.js";

/**@type {CanvasRenderingContext2D} */
var context;
const stateTypes = {
  SUBMENU: "SubMenu",
  FISH: "Fish",
  INGREDIENTS: "Ingredients",
};
var active = false;
var state = stateTypes.SUBMENU;

var ingredientButtons = [];

export function ingredientsMenuInit(ctx) {
  active = false;
  ioControl.clearButtons();
  createStartMenuButton();
  canvas.addEventListener("click", buttonClickMenu, false);
  context = ctx;
}

function buttonClickMenu(e) {
  ioControl.checkButtonsGiven(e, ingredientButtons);
  ioControl.buttonClick(e);
}

function createStartMenuButton() {
  ioControl.addButton(
    shapes.createButton(
      650,
      250,
      50,
      25,
      "Ingredients",
      true,
      1,
      openMenu,
      "IngredientsMenu-Activate",
      shapes.shapeType.ROUNDRECT,
      "center",
      "9px Arial",
      "#ADD8E6",
      "Gray"
    )
  );
}

function createMenuButtons() {
  ioControl.addButton(
    shapes.createButton(
      671,
      254,
      25,
      25,
      "X",
      true,
      1,
      closeMenu,
      "IngredientsMenu-X",
      shapes.shapeType.ROUNDRECT,
      "center",
      "15px Arial",
      "#ADD8E6",
      "Gray"
    )
  );
  ioControl.addButton(
    shapes.createButton(
      509,
      254,
      25,
      25,
      "<<",
      true,
      1,
      undo,
      "IngredientsMenu-<<",
      shapes.shapeType.ROUNDRECT,
      "center",
      "15px Arial",
      "#ADD8E6",
      "Gray"
    )
  );
}

function createSubMenuButtons() {
  clearButtons();
  var x = 540,
    y = 254;
  ingredientButtons.push(
    shapes.createButton(
      x,
      y,
      50,
      25,
      "Fish",
      true,
      1,
      setFishButtons,
      "FishMenu",
      shapes.shapeType.ROUNDRECT,
      "Center",
      "15px Arial",
      "green",
      "Gray"
    )
  );
  x += 60;
  ingredientButtons.push(
    shapes.createButton(
      x,
      y,
      60,
      25,
      "Vegtables",
      true,
      1,
      setVegButtons,
      "VegtablesMenu",
      shapes.shapeType.ROUNDRECT,
      "Center",
      "12px Arial",
      "green",
      "Gray"
    )
  );
  drawing.Invalidate();
}

function clearButtons() {
  ingredientButtons = [];
}

function setFishButtons() {
  clearButtons();
  var x = 510,
    y = 280;
  state = stateTypes.FISH;
  ingredientButtons.push(
    shapes.createButton(
      x,
      y,
      50,
      25,
      "Crab",
      true,
      1,
      player.getCrab,
      "Create-Crab",
      shapes.shapeType.ROUNDRECT,
      "center",
      "15px Arial",
      "White",
      "Red"
    )
  );
  x += 60;
  ingredientButtons.push(
    shapes.createButton(
      x,
      y,
      50,
      25,
      "Tuna",
      true,
      1,
      player.getTuna,
      "Create-Tuna",
      shapes.shapeType.ROUNDRECT,
      "center",
      "15px Arial",
      "White",
      "Red"
    )
  );
  x += 60;
  ingredientButtons.push(
    shapes.createButton(
      x,
      y,
      50,
      25,
      "Salmon",
      true,
      1,
      player.getSalmon,
      "Create-Salmon",
      shapes.shapeType.ROUNDRECT,
      "center",
      "15px Arial",
      "White",
      "Red"
    )
  );
  x = 510;
  y += 30;
  ingredientButtons.push(
    shapes.createButton(
      x,
      y,
      50,
      25,
      "Eel",
      true,
      1,
      player.getEel,
      "Create-Eel",
      shapes.shapeType.ROUNDRECT,
      "center",
      "15px Arial",
      "White",
      "Red"
    )
  );
  drawing.Invalidate();
}

function setVegButtons() {
  clearButtons();
  var x = 510,
    y = 280;
  state = stateTypes.INGREDIENTS;
  ingredientButtons.push(
    shapes.createButton(
      x,
      y,
      50,
      25,
      "Avocado",
      true,
      1,
      player.getAvocado,
      "Create-Avocado",
      shapes.shapeType.ROUNDRECT,
      "center",
      "12px Arial",
      "White",
      "Red"
    )
  );
  x += 60;

  ingredientButtons.push(
    shapes.createButton(
      x,
      y,
      50,
      25,
      "Cucumber",
      true,
      1,
      player.getCucumber,
      "Create-Cucumber",
      shapes.shapeType.ROUNDRECT,
      "center",
      "10px Arial",
      "White",
      "Red"
    )
  );
}

function removeMenuButton() {
  if (active) {
    ioControl.delButton("IngredientsMenu-Activate");
  } else {
    ioControl.delButton("IngredientsMenu-X");
    ioControl.delButton("IngredientsMenu-<<");
    //ioControl.clearButtons();
  }
}

function removeIOButton() {
  ioControl.clearButtons();
}

function undo() {
  if ((state = stateTypes.FISH)) {
    state = stateTypes.SUBMENU;
    createSubMenuButtons();
  }
  switch (state) {
    default:
      break;
    case stateTypes.FISH:
      state = stateTypes.SUBMENU;
      createSubMenuButtons();
      break;
    case stateTypes.INGREDIENTS:
      state = stateTypes.SUBMENU;
      createSubMenuButtons();
      break;
  }
}

function openMenu() {
  active = true;
  //console.log("Open menu");
  clearButtons();
  removeIOButton();
  createMenuButtons();
  createSubMenuButtons();
}
function closeMenu() {
  //console.log("Close menu");

  active = false;
  clearButtons();
  removeIOButton();
  createStartMenuButton();
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
  context.lineWidth = 2;
  drawing.drawRoundRect(
    context,
    505,
    250,
    195,
    150,
    10,
    true,
    true,
    "White",
    "black"
  );
  // context.fillRect( 405, 250, 195,150);
}

//TODO make scrollBar
