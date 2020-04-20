import * as roll from "./rolls.js";
import * as drawing from "../utils/drawing.js";
import * as ioControl from "../utils/iocontrol.js";
import * as shapes from "../utils/shapes.js";
import * as progBar from "../utils/progressBar.js";
import { rollingMatt } from "./rollingmatt.js";
import * as player from "./player.js";
import { Fish } from "./fish.js";
import * as ingredientBox from "./ingredientbox.js";
import * as upgradeMenu from "./upgrademenu.js";

const shapeType = {
  RECTANGLE: "Rectangle",
  CIRCLE: "Circle",
};
var boardImage = new Image();
boardImage.src = "./game/images/TexturesCom_CloseupBambooCuttingBoard_M.png";
var useSecondBoard = false;
export class CuttingStation {
  constructor(x, y, w, h) {
    this.type = shapeType.RECTANGLE;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.intColor = "#C19A6B";
    this.outColor = "#C19A6B";
    this.fill = true;
    this.lineWidth = 1;
    this.image = boardImage;
    this.item = null;
    this.startTime = 0;
    this.isActive = false;
    this.cuttingSpeed = 8;
    this.cuttingSpeedCost = 500;
    this.progress = 0;
  }
  checkCutRoll() {
    if (this.isActive == true) {
      let currentTime = performance.now(),
        elapsedTime = currentTime - this.startTime,
        percentComplete = (elapsedTime / (this.cuttingSpeed * 1000)) * 100;
      this.progress = percentComplete;
      drawing.Invalidate();

      if (percentComplete >= 100) {
        if (this.item instanceof Fish) {
          this.isActive = false;
          this.startTime = 0;
          ingredientBox.fillBoxes(this.item.fishType);
          this.item = null;
          drawing.Invalidate();
        } else {
          this.isActive = false;
          this.startTime = 0;
          this.item.isCut = true;
          this.item.canEnterPlate = true;
          this.item.canEnterCuttingStation = false;
          this.item.renderType.w = this.item.radius * 4;
          this.item.renderType.h = this.item.radius * 4;
          // cuttingStation.item.renderType.x -= cuttingStation.item.radius*2;
          // cuttingStation.item.renderType.y -= cuttingStation.item.radius*2;
          //roll.downSizeRoll(cuttingStation.item);
          roll.pushRoll(this.item);
          this.item = null;

          //console.log("Cut roll");

          drawing.Invalidate();
        }
      }
    }
  }

  checkCuttingStation(mySelect) {
    if (mySelect != null) {
      if (mySelect.canEnterCuttingStation == false) {
        drawing.Invalidate();
        return;
      }
      if (mySelect.isCut == true) {
        drawing.Invalidate();
        return;
      }
      if (shapes.Contains(this, mySelect.renderType) && this.item == null) {
        this.item = mySelect;
        //console.log(this.item);
        roll.removeRoll(mySelect);
      }
    }
  }
}
var cuttingStation = CuttingStation,
  cuttingStation2 = cuttingStation;

export function cuttingStationInit() {
  cuttingStation = new CuttingStation(350, 400, 150, 100);
  bar = new progBar.progressbar(
    cuttingStation.x,
    cuttingStation.y - 60,
    cuttingStation.w,
    20
  );
  //cuttingStation2 = new CuttingStation(510, 400, 150, 100);
}

// const cuttingStatio1n = {
//   type: shapeType.RECTANGLE,
//   x: 410,
//   y: 400,
//   w: 150,
//   h: 100,
//   intColor: "#C19A6B",
//   outColor: "#C19A6B",
//   fill: true,
//   lineWidth: 1,
//   image: boardImage,
//   item: null,
//   startTime: 0,
//   isActive: false,
//   cuttingSpeed: 8, //seconds ,
//   cuttingSpeedCost: 500,
//   progress: 0
// };
var bar = progBar.progressbar,
  bar2 = progBar.progressbar;

export function getData() {
  var cuttingStationData = {};
  cuttingStationData.cuttingSpeed = cuttingStation.cuttingSpeed;
  cuttingStationData.cuttingSpeedCost = cuttingStation.cuttingSpeedCost;
  cuttingStationData.useSecondBoard = useSecondBoard;
  return cuttingStationData;
}

export function setData(data) {
  cuttingStation.cuttingSpeed = data.cuttingSpeed;
  cuttingStation.cuttingSpeedCost = data.cuttingSpeedCost;

  useSecondBoard = data.useSecondBoard;
  if (useSecondBoard == true) {
    initSecondBoard();
  }
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

function initSecondBoard() {
  useSecondBoard = true;
  cuttingStation2 = new CuttingStation(510, 400, 150, 100);
  bar2 = new progBar.progressbar(
    cuttingStation2.x,
    cuttingStation2.y - 60,
    cuttingStation2.w,
    20
  );
}
export function buyNewCuttingBoard() {
  if (player.hasEnoughMoney(2000)) {
    initSecondBoard();
    player.removeMoney(2000);
    upgradeMenu.removeUpgradeButton("Cuttin Board Upgrade Second Board");
    //todo buy cutting board
  }
}
export function getSecondBoardCost() {
  return 2000;
}
export function hasSecondBoard() {
  return useSecondBoard;
}

export function checkCutRoll() {
  cuttingStation.checkCutRoll();
  if (cuttingStation2 instanceof CuttingStation) {
    cuttingStation2.checkCutRoll();
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
  if (cuttingStation2 instanceof CuttingStation) {
    drawing.drawRoundRectImage(
      cuttingStation2.x,
      cuttingStation2.y,
      cuttingStation2.w,
      cuttingStation2.h,
      cuttingStation2.image
    );

    if (cuttingStation2.item != null) {
      if (cuttingStation2.isActive) {
        drawing.drawTextBox(
          context,
          cuttingStation2.x,
          cuttingStation2.y - 40,
          cuttingStation2.w,
          40,
          "Cutting!",
          true,
          true,
          5,
          " 20px Verdana"
        );
        progBar.drawColorProgressbar(cuttingStation2.progress, bar2, false);
      } else {
        drawing.drawTextBox(
          context,
          cuttingStation2.x,
          cuttingStation2.y - 40,
          cuttingStation2.w,
          40,
          "Ready to cut! Press C key",
          true,
          true,
          5,
          "10px Verdana"
        );
      }
      //drawing.drawRoundRectImage(cuttingStation.x, cuttingStation.y, cuttingStation.w, cuttingStation.h, cuttingStation.image);
      if (cuttingStation2.item instanceof Fish) {
        cuttingStation2.item.draw();
      } else {
        drawing.drawShape(context, cuttingStation2.item.renderType);
      }

      drawing.Invalidate();
    }
  }

  if (cuttingStation.item != null) {
    if (cuttingStation.isActive) {
      drawing.drawTextBox(
        context,
        cuttingStation.x,
        cuttingStation.y - 40,
        cuttingStation.w,
        40,
        "Cutting!",
        true,
        true,
        5,
        " 20px Verdana"
      );
      progBar.drawColorProgressbar(cuttingStation.progress, bar, false);
    } else {
      drawing.drawTextBox(
        context,
        cuttingStation.x,
        cuttingStation.y - 40,
        cuttingStation.w,
        40,
        "Ready to cut! Press C key",
        true,
        true,
        5,
        " 10px Verdana"
      );
    }
    //drawing.drawRoundRectImage(cuttingStation.x, cuttingStation.y, cuttingStation.w, cuttingStation.h, cuttingStation.image);
    if (cuttingStation.item instanceof Fish) {
      cuttingStation.item.draw();
    } else {
      drawing.drawShape(context, cuttingStation.item.renderType);
    }

    drawing.Invalidate();
  }
}

export function cutRoll() {
  if (cuttingStation2 instanceof CuttingStation) {
    if (cuttingStation2.item == null) {
    }
    if (cuttingStation2.isActive == false && cuttingStation2.item != null) {
      cuttingStation2.isActive = true;
      cuttingStation2.startTime = performance.now();
    }
  }

  if (cuttingStation.item == null) {
    return;
  }
  if (cuttingStation.isActive == false && cuttingStation.item != null) {
    cuttingStation.isActive = true;
    cuttingStation.startTime = performance.now();
  }

  drawing.Invalidate();
}

export function checkCuttingStation(mySelect) {
  //console.log(cuttingStation.item);

  cuttingStation.checkCuttingStation(mySelect);

  if (cuttingStation2 instanceof CuttingStation) {
    cuttingStation2.checkCuttingStation(mySelect);
  }
}

export function hasNoItem(num) {
  if (num == 0) {
    return cuttingStation.item == null;
  }
  if (num == 1) {
    return cuttingStation2.item == null;
  }
}

export function insertFish(Fish, num) {
  if (num == 0) {
    cuttingStation.item = Fish;
    cuttingStation.item.x = cuttingStation.x;
    cuttingStation.item.y = cuttingStation.y;
  }
  if (num == 1) {
    cuttingStation2.item = Fish;
    cuttingStation2.item.x = cuttingStation2.x;
    cuttingStation2.item.y = cuttingStation2.y;
  }
}

export function isntActive(num) {
  if (num == 0) {
    return !cuttingStation.isActive;
  } else if (num == 1) {
    return !cuttingStation2.isActive;
  }
}

export function resetCuttingStation() {
  cuttingStation.item = null;
  cuttingStation.isActive = false;
  cuttingStation.startTime = 0;
  if (useSecondBoard == true) {
    if (cuttingStation2 == null || cuttingStation2 == undefined) {
      initSecondBoard();
    } else {
      cuttingStation2.item = null;
      cuttingStation2.isActive = false;
      cuttingStation2.startTime = 0;
    }
  }
}
