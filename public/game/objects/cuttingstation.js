import * as roll from "./rolls.js";
import * as drawing from "../utils/drawing.js";
import * as ioControl from "../utils/iocontrol.js";
import * as shapes from "../utils/shapes.js";
import * as progBar from "../utils/progressBar.js";
import { rollingMatt } from "./rollingmatt.js";
import * as player from "./player.js";
import {Fish} from './fish.js';
import * as ingredientBox from './ingredientbox.js';

const shapeType = {
  RECTANGLE: "Rectangle",
  CIRCLE: "Circle"
};
var boardImage = new Image();
boardImage.src = "./game/images/TexturesCom_CloseupBambooCuttingBoard_M.png";

export const cuttingStation = {
  type: shapeType.RECTANGLE,
  x: 410,
  y: 400,
  w: 150,
  h: 100,
  intColor: "#C19A6B",
  outColor: "#C19A6B",
  fill: true,
  lineWidth: 1,
  image: boardImage,
  item: null,
  startTime: 0,
  isActive: false,
  cuttingSpeed: 8, //seconds ,
  cuttingSpeedCost: 500,
  progress: 0
};
var bar = new progBar.progressbar(
  cuttingStation.x,
  cuttingStation.y - 60,
  cuttingStation.w,
  20
);

export function getData() {
  var cuttingStationData = {};
  cuttingStationData.cuttingSpeed     = cuttingStation.cuttingSpeed;
  cuttingStationData.cuttingSpeedCost = cuttingStation.cuttingSpeedCost;
  return cuttingStationData;
}

export function setData(data) {
  cuttingStation.cuttingSpeed = data.cuttingSpeed;
  cuttingStation.cuttingSpeedCost = data.cuttingSpeedCost;
}

export function getCuttingSpeedCost() {
  return cuttingStation.cuttingSpeedCost;
}

export function upgradeCuttingSpeed() {
  if (player.hasEnoughMoney(cuttingStation.cuttingSpeedCost)) {
    player.removeMoney(cuttingStation.cuttingSpeedCost);
    cuttingStation.cuttingSpeed--;
    cuttingStation.cuttingSpeedCost += 500;
    return true;
  }
  return false;
}

export function buyNewCuttingBoard() {
  if (player.hasEnoughMoney(2000)) {
    //todo buy cutting board
  }
}
export function getSecondBoardCost() {
  return 2000;
}

export function checkCutRoll() {
  if (cuttingStation.isActive == true) {
    let currentTime = performance.now(),
      elapsedTime = currentTime - cuttingStation.startTime,
      percentComplete =
        (elapsedTime / (cuttingStation.cuttingSpeed * 1000)) * 100;
    cuttingStation.progress = percentComplete;
    drawing.Invalidate();

    if (percentComplete >= 100) {
        if (cuttingStation.item instanceof Fish) {
            cuttingStation.isActive = false;
            cuttingStation.startTime = 0;
            ingredientBox.fillBoxes(cuttingStation.item.fishType);
            cuttingStation.item = null;
            drawing.Invalidate();
        }
        else {
            cuttingStation.isActive = false;
            cuttingStation.startTime = 0;
            cuttingStation.item.isCut = true;
            cuttingStation.item.canEnterPlate = true;
            cuttingStation.item.canEnterCuttingStation = false;
            cuttingStation.item.renderType.w = cuttingStation.item.radius * 4;
            cuttingStation.item.renderType.h = cuttingStation.item.radius * 4;
            // cuttingStation.item.renderType.x -= cuttingStation.item.radius*2;
            // cuttingStation.item.renderType.y -= cuttingStation.item.radius*2;
            //roll.downSizeRoll(cuttingStation.item);
            roll.pushRoll(cuttingStation.item);
            cuttingStation.item = null;

            console.log("Cut roll");

            drawing.Invalidate();
        }
      
    }
  }

  //drawProgressBar(cuttingStation.x, cuttingStation.y, cuttingStation.w, 20, precentComplete);
  //todo implement cutAnimation
}

export function drawCuttingStation(context) {
  drawing.drawRoundRectImage(
    cuttingStation.x,
    cuttingStation.y,
    cuttingStation.w,
    cuttingStation.h,
    cuttingStation.image
  );

  if (cuttingStation.item != null) {
    if (cuttingStation.isActive) {
      drawing.drawTextBox(
        context,
        cuttingStation.x,
        cuttingStation.y - 40,
        cuttingStation.w,
        40,
        "Cutting!"
      );
      progBar.drawColorProgressbar(cuttingStation.progress, bar, false);
    } else {
      drawing.drawTextBox(
        context,
        cuttingStation.x,
        cuttingStation.y - 40,
        cuttingStation.w,
        40,
        "Ready to cut! Press C key"
      );
    }
    //drawing.drawRoundRectImage(cuttingStation.x, cuttingStation.y, cuttingStation.w, cuttingStation.h, cuttingStation.image);
    if (cuttingStation.item instanceof Fish) {
        cuttingStation.item.draw();
    }
    else {
        drawing.drawShape(context, cuttingStation.item.renderType);
    }
    
    drawing.Invalidate();
  }
}

export function cutRoll() {
  if (cuttingStation.item == null) {
    return;
  }
  if (cuttingStation.isActive == false) {
    cuttingStation.isActive = true;
    cuttingStation.startTime = performance.now();
  }
  drawing.Invalidate();
}

export function checkCuttingStation(mySelect) {
  //console.log(cuttingStation.item);

  if (mySelect != null) {
    if (mySelect.canEnterCuttingStation == false) {
      drawing.Invalidate();
      return;
    }
    if (mySelect.isCut == true) {
      drawing.Invalidate();
      return;
    }
    if (
      shapes.Contains(cuttingStation, mySelect.renderType) &&
      cuttingStation.item == null
    ) {
      cuttingStation.item = mySelect;
      console.log(cuttingStation.item);
      roll.removeRoll(mySelect);
    }
  }
}

export function hasNoItem() {
  return cuttingStation.item == null;
}

export function insertFish(Fish) {
  if (hasNoItem()) {
    cuttingStation.item = Fish;
    cuttingStation.item.x = cuttingStation.x;
    cuttingStation.item.y = cuttingStation.y;
  }
}

export function resetCuttingStation() {
  cuttingStation.item = null;
  cuttingStation.isActive = false;
  cuttingStation.startTime = 0;
}
