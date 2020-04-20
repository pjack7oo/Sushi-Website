//ingredients and functions to create and manage them
import * as drawing from "../utils/drawing.js";
import * as shapes from "../utils/shapes.js";

//export var activeIngredients = [];
var avocadoImg = new Image(),
  cucumberImg = new Image(),
  crabImg = new Image(),
  tunaImg = new Image(),
  salmonImg = new Image(),
  eelImg = new Image();

(avocadoImg.src = "./game/images/Avocado.png"),
  (cucumberImg.src = "./game/images/Cucumber_.png"),
  (crabImg.src = "./game/images/Crab_stick.png"),
  (tunaImg.src = "./game/images/Tuna_Sashimi.png"),
  (salmonImg.src = "./game/images/Salmon_Sashimi.png"),
  (eelImg.src = "./game/images/Eel_sashimi.png");
var mySelect;

export const ingredients = Object.freeze({
  AVOCADO: "Avocado",
  CUCUMBER: "Cucumber",
  CRAB: "Crab",
  RICE: "Rice",
  TUNA: "Tuna",
  SALMON: "Salmon",
  EEL: "Eel",
});

export class Ingredient {
  constructor(name, renderType) {
    this.name = name;
    this.renderType = renderType;
    this.canEnterMatt = true;
    this.canEnterCuttingStation = false;
    this.canEnterPlate = false;
    this.canSell = false;
    this.cost = 10;
    this.id = 0;
    this.image = null;
    switch (name) {
      case ingredients.AVOCADO:
        this.renderType.image = avocadoImg;
        this.renderType.type = shapes.shapeType.IMAGE;
        break;
      case ingredients.CUCUMBER:
        this.renderType.image = cucumberImg;
        this.renderType.type = shapes.shapeType.IMAGE;
        break;
      case ingredients.CRAB:
        this.renderType.image = crabImg;
        this.renderType.type = shapes.shapeType.IMAGE;
        break;
      case ingredients.TUNA:
        this.renderType.image = tunaImg;
        this.renderType.type = shapes.shapeType.IMAGE;
        break;
      case ingredients.SALMON:
        this.renderType.image = salmonImg;
        this.renderType.type = shapes.shapeType.IMAGE;
        break;
      case ingredients.EEL:
        this.renderType.image = eelImg;
        this.renderType.type = shapes.shapeType.IMAGE;
        break;
    }
  }
}

export function getIngredientColor(ingredient) {
  var color = new Object();
  color.intColor = "";
  color.outColor = "";

  switch (ingredient) {
    default:
      color.intColor = "White";
      color.outColor = "White";
      break;
    case ingredients.AVOCADO:
      color.intColor = "#F2E880";
      color.outColor = "#356211";
      break;
    case ingredients.CRAB:
      color.intColor = "White";
      color.outColor = "Red";
      break;
    case ingredients.CUCUMBER:
      color.intColor = "#E9FF96";
      color.outColor = "#67AB05";
      break;
    case ingredients.EEL:
      color.intColor = "#F29F3A";
      color.outColor = "#CC5206";
      break;
    case ingredients.SALMON:
      color.intColor = "#FF8E8E";
      color.outColor = "#FF7878";
      break;
    case ingredients.TUNA:
      color.intColor = "#D90D36";
      color.outColor = "#CF0C33";
      break;
  }

  return color;
}

export function getIngredientRenderType(ingredient, x, y) {
  var color = getIngredientColor(ingredient);
  var shape;
  switch (ingredient) {
    default:
      //console.log("no shape");

      break;
    case ingredients.AVOCADO:
      shape = shapes.createBox(
        x,
        y,
        50,
        20,
        true,
        color.intColor,
        color.outColor
      );
      break;
    case ingredients.CRAB:
      shape = shapes.createBox(
        x,
        y,
        50,
        10,
        true,
        color.intColor,
        color.outColor
      );
      break;
    case ingredients.CUCUMBER:
      shape = shapes.createBox(
        x,
        y,
        50,
        10,
        true,
        color.intColor,
        color.outColor
      );
      break;
    case ingredients.EEL:
      shape = shapes.createBox(
        x,
        y,
        50,
        20,
        true,
        color.intColor,
        color.outColor
      );
      break;
    case ingredients.SALMON:
      shape = shapes.createBox(
        x,
        y,
        50,
        20,
        true,
        color.intColor,
        color.outColor
      );
      break;
    case ingredients.TUNA:
      shape = shapes.createBox(
        x,
        y,
        50,
        20,
        true,
        color.intColor,
        color.outColor
      );
      break;
  }

  return shape;
}

export function getIngredientCost(ingredient) {
  let cost;
  switch (ingredient) {
    default:
      //console.log("no shape");

      break;
    case ingredients.AVOCADO:
      cost = 2;
      break;
    case ingredients.CRAB:
      cost = 5;
      break;
    case ingredients.CUCUMBER:
      cost = 2;
      break;
    case ingredients.EEL:
      cost = 50;
      break;
    case ingredients.SALMON:
      cost = 50;
      break;
    case ingredients.TUNA:
      cost = 50;
      break;
  }

  return cost;
}

export function clearActiveIngredients() {
  activeIngredients = [];
}

export function createIngredientWithXY(name, x, y) {
  var ingredient = new Ingredient(name, getIngredientRenderType(name, x, y));

  return ingredient;
}

function createIngredient(name, renderType) {
  var ingredient = new Ingredient(name, renderType);

  ingredient.cost = getIngredientCost(name);
  return ingredient;
}

export function createRice(x, y) {
  var box = new shapes.RoundRect(
    x,
    y,
    60,
    60,
    10,
    "White",
    "White",
    true,
    true
  );

  var rice = createIngredient(ingredients.RICE, box);
  rice.cost = 10;
  return rice;
  //activeIngredients.push(rice);
}

export function createCucumber(x, y) {
  var box = shapes.createBox(x, y, 50, 10, true, "#E9FF96", "#67AB05");
  var cucumber = createIngredientWithXY(ingredients.CUCUMBER, x, y);
  cucumber.cost = 20;
  //return cucumber;
  activeIngredients.push(cucumber);
}

export function createCrab(x, y) {
  var box = shapes.createBox(x, y, 50, 20, true, "white", "red");
  var crab = createIngredientWithXY(ingredients.CRAB, x, y);
  crab.cost = 30;
  //return crab;
  activeIngredients.push(crab);
}

export function createAvocado(x, y) {
  var box = shapes.createBox(x, y, 50, 20, true, "#F2E880", "#356211");
  var avocado = createIngredientWithXY(ingredients.AVOCADO, x, y);
  avocado.cost = 30;
  activeIngredients.push(avocado);
}

export function createTuna(x, y) {
  var tuna = createIngredientWithXY(ingredients.TUNA, x, y);
  tuna.cost = 30;
  activeIngredients.push(tuna);
}

// export function drawActiveIngredients(context)
// {
//     drawing.drawShapes(context, activeIngredients);
// }

export function removeIngredient(ingredient) {
  mySelect = ingredient;
  delete activeIngredients[activeIngredients.findIndex(findIngredient)];
  activeIngredients.sort();
  activeIngredients.pop();
  mySelect = null;
}

export function addIngredient(ingredient) {
  activeIngredients.push(ingredient);
}

function findIngredient(ingredient) {
  //console.log((mySelect.name === ingredient.name && mySelect.x == ingredient.x && mySelect.y == ingredient.y));
  return (
    mySelect.name === ingredient.name &&
    mySelect.renderType.x == ingredient.renderType.x &&
    mySelect.renderType.y == ingredient.renderType.y
  );
}
