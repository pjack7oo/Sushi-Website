import * as shapes from "../utils/shapes.js";
import * as drawing from "../utils/drawing.js";
import * as ioControl from "../utils/iocontrol.js";
import * as progBar from "../utils/progressBar.js";
import * as player from "./player.js";
import * as upgradeMenu from "./upgrademenu.js";
import { Timer } from "../utils/timer.js";

var trayImage = new Image();
trayImage.src = "./game/images/Tray.png";
var cupImage = new Image();
cupImage.src = "./game/images/Full_teacup.png";
var teaKettleDoneImage = new Image();
teaKettleDoneImage.src = "./game/images/teapot_with_steam.png";
var teaKettleSteepingImage = new Image();
teaKettleSteepingImage.src = "./game/images/teapot.png";

export class Cup {
  constructor(x, y) {
    this.renderType = new shapes.createBox(x, y, 40, 40, true, "Gray", "Gray");

    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
    this.w = 40;
    this.h = 40;
    this.radius = 20;
    this.renderType.type = shapes.shapeType.IMAGE;
    this.renderType.image = cupImage;
    this.canEnterMatt = false;
    this.canEnterCuttingStation = false;
    this.canEnterPlate = false;
  }
  draw(context) {
    //drawing.drawCircle(context, this.renderType.x, this.renderType.y, this.renderType.radius, true, 'White', "Gold", 2);

    drawing.drawImage(context, this.renderType);
  }

  checkCup(mouse) {
    let ret = ioControl.moveItem(mouse, this);
    return ret;
  }

  resetPos() {
    this.renderType.x = this.oldX;
    this.renderType.y = this.oldY;
  }
}

export class TeaKettle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 170;
    this.h = 80;
    this.trayImage = trayImage;
    this.image = teaKettleDoneImage;
    this.activeImage = teaKettleSteepingImage;
    this.cup = Cup;
    this.cup2 = null;
    this.active = false;
    this.startTime = 0;
    this.steepingTime = 10; //seconds
    this.steepingTimeCost = 500;
    this.storageCount = 1;
    this.storageCountCost = 500;
    this.progress = 0;
    this.bar = null;
    this.timer = new Timer(this.steepingTime, function () {});
  }
  draw(context) {
    drawing.drawRoundRectImage(
      this.x,
      this.y,
      this.w,
      this.h,
      this.trayImage,
      true,
      this.w,
      this.h
    );

    if (this.isActive) {
      drawing.drawRoundRectImage(
        this.x + 5,
        this.y + 10,
        this.w - 100,
        this.h - 10,
        this.activeImage,
        true,
        this.w - 100,
        this.h - 20
      );
    } else {
      drawing.drawRoundRectImage(
        this.x + 5,
        this.y + 10,
        this.w - 100,
        this.h - 10,
        this.image,
        true,
        this.w - 100,
        this.h - 20
      );
    }

    if (this.cup instanceof Cup) {
      this.cup.draw(context);
    }
    if (this.cup2 instanceof Cup) {
      this.cup2.draw(context);
    }
    if (this.isActive) {
      progBar.drawColorProgressbar(this.progress, this.bar, false);
    }
  }
  checkTea() {
    if (this.isActive == true) {
      let currentTime = performance.now(),
        elapsedTime = currentTime - this.startTime,
        percentComplete = (elapsedTime / (this.steepingTime * 1000)) * 100;
      this.progress = percentComplete;
      drawing.Invalidate();

      if (percentComplete >= 100) {
        this.isActive = false;
        this.startTime = 0;
        this.progress = 0;
        if (teaKettle.cup == null) {
          this.cup = new Cup(teaKettle.x + teaKettle.w / 2, teaKettle.y + 10);
        }
        if (teaKettle.cup2 == null && teaKettle.storageCount == 2) {
          teaKettle.cup2 = new Cup(
            teaKettle.x + teaKettle.w / 2 + 30,
            teaKettle.y + 10
          );
        }

        drawing.Invalidate();
      }
    }
  }
}
var teaKettle = TeaKettle;
var bar;
function startTimer() {
  teaKettle.isActive = true;
  teaKettle.startTime = performance.now();
}

export function startTea() {
  if (teaKettle.cup == null && teaKettle.cup2 == null) {
    startTimer();
  } else if (teaKettle.cup == null && teaKettle.storageCount == 1) {
    startTimer();
  }
}
export function teaKettleInit() {
  teaKettle = new TeaKettle(340, 260);
  teaKettle.cup = new Cup(teaKettle.x + teaKettle.w / 2, teaKettle.y + 10);

  teaKettle.bar = new progBar.progressbar(
    teaKettle.x,
    teaKettle.y - 20,
    teaKettle.w,
    20
  );
}
export function resetTeaKettle() {
  teaKettle.cup = new Cup(teaKettle.x + teaKettle.w / 2, teaKettle.y + 10);
  if (teaKettle.storageCount == 2) {
    teaKettle.cup2 = new Cup(
      teaKettle.x + teaKettle.w / 2 + 30,
      teaKettle.y + 10
    );
  }
}

export function getData() {
  var teaKettleData = {};
  teaKettleData.steepingTime = teaKettle.steepingTime;
  teaKettleData.storageCount = teaKettle.storageCount;
  return teaKettleData;
}

export function setData(data) {
  teaKettle.steepingTime = data.steepingTime;
  teaKettle.storageCount = data.storageCount;
}

export function drawTeaKettle(context) {
  teaKettle.draw(context);
}

export function getSteepTimeUpgradeCost() {
  return teaKettle.steepingTimeCost;
}

export function getStorageUpgradeCost() {
  return teaKettle.storageCountCost;
}
export function upgradeSteepTime() {
  if (player.hasEnoughMoney(teaKettle.steepingTimeCost)) {
    player.removeMoney(teaKettle.steepingTimeCost);
    teaKettle.steepingTime--;
    teaKettle.steepingTimeCost += 500;
    return true;
  }
  return false;
}

export function upgradeStorageCount() {
  if (player.hasEnoughMoney(teaKettle.storageCountCost)) {
    player.removeMoney(teaKettle.storageCountCost);
    teaKettle.storageCount++;
    teaKettle.storageCountCost += 500;

    upgradeMenu.removeUpgradeButton("Tea kettle Upgrade Storage");
    return true;
  }
  return false;
}

export function getSteepTime() {
  return teaKettle.steepingTime;
}

export function getStorageCount() {
  return teaKettle.storageCount;
}
export function checkCup(mouse) {
  if (teaKettle.cup instanceof Cup) {
    let ret = teaKettle.cup.checkCup(mouse);
    if (ret) {
      return ret;
    }
  }
  if (teaKettle.cup2 instanceof Cup) {
    let ret = teaKettle.cup2.checkCup(mouse);
    return ret;
  }
  return false;
}

export function checkTeaTimer() {
  teaKettle.checkTea();
}

export function removeCup(cup) {
  if (teaKettle.cup.renderType.x == cup.renderType.x && teaKettle.cup.renderType.y == cup.renderType.y) {
    teaKettle.cup = null;
  } else if (teaKettle.cup2.renderType.x == cup.renderType.x && teaKettle.cup2.renderType.y == cup.renderType.y) {
    teaKettle.cup2 = null;
  }
}
