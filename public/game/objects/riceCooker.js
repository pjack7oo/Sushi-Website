import * as shapes from "../utils/shapes.js";
import * as drawing from "../utils/drawing.js";
import * as ingredients from "./ingredients.js";
import * as ioControl from "../utils/iocontrol.js";
import * as player from "./player.js";
import * as progBar from "../utils/progressBar.js";
import { Timer } from "../utils/timer.js";

export const riceCooker = {
  type: shapes.shapeType.RECTANGLE,
  x: 30,
  y: 200,
  w: 100,
  h: 100,
  intColor: "Gray",
  outColor: "Red",
  fill: true,
  lineWidth: 1,
  image: null,
  startTime: 0,
  isActive: false,
  riceCount: 4,
  maxRiceCount: 4,
  rice: null,
  cookTime: 15, //seconds
  cookTimeUpgradeCost: 500,
  riceCountUpgradeCost: 500,
  timer: new Timer(15, new progBar.progressbar(30, 200, 100, 20), function () {
    resetRiceCount();
  }),
};

export function checkRiceCooker() {
  if (riceCooker.riceCount == 0 && !riceCooker.timer.isActive) {
    riceCooker.timer.startTimer();
  } else {
    riceCooker.timer.checkTime();
  }
}

export function setData(data) {
  riceCooker.cookTime = data.cookTime;
  riceCooker.riceCount = data.maxRiceCount;
  riceCooker.cookTimeUpgradeCost = data.cookTimeUpgradeCost;
  riceCooker.riceCountUpgradeCost = data.riceCountUpgradeCost;
}

export function getData() {
  var riceCookerData = {};
  riceCookerData.cookTime = riceCooker.cookTime;
  riceCookerData.maxRiceCount = riceCooker.maxRiceCount;
  riceCookerData.cookTimeUpgradeCost = riceCooker.cookTimeUpgradeCost;
  riceCookerData.riceCountUpgradeCost = riceCooker.riceCountUpgradeCost;
  return riceCookerData;
}

export function getCookTimeUpgradeCost() {
  return riceCooker.cookTimeUpgradeCost;
}

export function getRiceCountUpgradeCost() {
  return riceCooker.riceCountUpgradeCost;
}
export function riceCookerUpgradeCookTime() {
  if (player.hasEnoughMoney(riceCooker.cookTimeUpgradeCost)) {
    player.removeMoney(riceCooker.cookTimeUpgradeCost);
    riceCooker.cookTime--;
    riceCooker.cookTimeUpgradeCost += 500;
    return true;
  }
  return false;
}

export function riceCookerUpgradeRiceCount() {
  if (player.hasEnoughMoney(riceCooker.riceCountUpgradeCost)) {
    player.removeMoney(riceCooker.riceCountUpgradeCost);
    riceCooker.maxRiceCount++;
    riceCooker.riceCount++;
    riceCooker.riceCountUpgradeCost += 500;
    return true;
  }
  return false;
}

function resetRiceCount() {
  riceCooker.riceCount = riceCooker.maxRiceCount;
}

export function checkRiceShape(mouse, context) {
  //drawing.drawShape(context, riceCooker.rice);
  let ret;

  ret = ioControl.moveItem(mouse, riceCooker.rice);

  if (ret) {
    return ret;
  }

  return false;
}

export function drawRiceCooker(ctx) {
  let radiusX = riceCooker.w / 2,
    radiusY = riceCooker.h / 4;
  drawing.drawRectangle(
    ctx,
    riceCooker.x,
    riceCooker.y + radiusY,
    riceCooker.w,
    riceCooker.h - radiusY,
    true,
    riceCooker.intColor,
    riceCooker.outColor,
    2
  );
  ctx.fillStyle = riceCooker.intColor;
  ctx.strokeStyle = riceCooker.outColor;
  ctx.lineWidth = riceCooker.lineWidth;
  ctx.beginPath();
  ctx.ellipse(
    riceCooker.x + radiusX,
    riceCooker.y + radiusY,
    radiusX,
    radiusY,
    0,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.stroke();
  drawing.printAtWordWrap(
    ctx,
    riceCooker.riceCount.toString(),
    riceCooker.x + riceCooker.w / 2,
    riceCooker.y + riceCooker.h / 1.5,
    10,
    20,
    "Red",
    "20px Arial",
    "Center"
  );

  riceCooker.timer.drawProgress();
}

export function drawRice(context) {
  if (riceCooker.rice != null) {
    drawing.drawShape(context, riceCooker.rice.renderType);
  }
}

export function addRice(rice) {
  riceCooker.rice = rice;
  riceCooker.riceCount += 1;
}

export function removeRice(rice) {
  riceCooker.riceCount -= 1;
  if (riceCooker.riceCount == 0) {
    riceCooker.rice = null;
  } else if (riceCooker.riceCount > 0) {
    createRice();
  }
}

export function createRice() {
  riceCooker.rice = ingredients.createRice(riceCooker.x + 18, riceCooker.y + 9);
}
