import * as shapes from "../utils/shapes.js";
import * as drawing from "../utils/drawing.js";

import * as rollControl from "./rolls.js";
//const drawing = require('../utils/drawing.js');
var moveablePlates = [];

export const plateHolder = {
  type: shapes.shapeType.RECTANGLE,
  x: 240,
  y: 270,
  w: 100,
  h: 100,
  intColor: "#FF0000",
  outColor: "#8B0000",
  fill: true,
  lineWidth: 1,
  image: null,
  plate: null,
  startTime: 0,
  isActive: false,
};

export class Plate {
  constructor() {
    this.roll = null;
    this.renderType = shapes.Circle;
    this.canEnterMatt = false;
    this.canEnterCuttingStation = false;
    this.canEnterPlate = false;
    this.canSell = false;
    this.id = 0;
  }
}

// export function getData() {

// }

// export function setData(data) {

// }

export function clearMoveablePlates() {
  moveablePlates = [];
}

export function createPlate() {
  var plate = new Plate();
  plate.renderType = shapes.createCircle(
    plateHolder.x + plateHolder.w / 2,
    plateHolder.y + plateHolder.h / 2,
    40,
    true,
    "#DCE0DC",
    "gold",
    3
  );
  plateHolder.plate = plate;
}

export function getMoveablePlates() {
  return moveablePlates;
}

export function drawPlateHolder(context) {
  if (plateHolder.plate != null) {
    drawing.drawShape(context, plateHolder.plate.renderType);
  }
}

export function drawPlates(ctx) {
  let l = moveablePlates.length;
  if (l > 0) {
    for (var i = 0; i < l; i++) {
      drawing.drawShape(ctx, moveablePlates[i].renderType);
      //drawing.drawShape(ctx, plates[i].roll.renderType);
      drawRollOnPlate(ctx, moveablePlates[i], moveablePlates[i].roll);
    }
  }
}

function drawRollOnPlate(ctx, plate, roll) {
  //correctRollOnPlate(plate, roll);
  // drawing.drawShape(ctx, roll.renderType);
  rollControl.drawRollWithCoords(
    ctx,
    plate.renderType.x,
    plate.renderType.y,
    roll.radius,
    roll
  );
}

export function addRollToPlate(mySelect) {
  if (mySelect != null) {
    if (mySelect.canEnterPlate == true && plateHolder.plate.roll == null) {
      if (shapes.containsRoll(mySelect, plateHolder.plate)) {
        correctRollOnPlate(plateHolder.plate, mySelect);
        plateHolder.plate.roll = mySelect;
        plateHolder.plate.canSell = true;
        rollControl.removeRoll(mySelect);
        plateHolder.plate.id = moveablePlates.length;
        moveablePlates.push(plateHolder.plate);
        plateHolder.plate = null;
        createPlate();
        console.log(moveablePlates);
      }
    }
  }
}

export function removePlate(plate) {
  moveablePlates.splice(plate.id, 1);
}

function correctRollOnPlate(plate, roll) {
  roll.renderType.x = plate.renderType.x - roll.renderType.w / 2;
  roll.renderType.y = plate.renderType.y - roll.renderType.h / 2;
}
