import * as ingredients from "../objects/ingredients.js";
import * as rollMatt from "../objects/rollingmatt.js";
import * as drawing from "./drawing.js";
import * as cutStation from "../objects/cuttingstation.js";
import * as rollControl from "../objects/rolls.js";
import * as plates from "../objects/plates.js";
import * as customers from "../objects/customers.js";
import * as ingredientBox from "../objects/ingredientbox.js";
import { shapeType, inCircle } from "./shapes.js";
import * as riceCooker from "../objects/riceCooker.js";
import * as shapes from "../utils/shapes.js";
import * as teaKettle from "../objects/teakettle.js";

//moving shapes around code from https://dzone.com/articles/making-and-moving-selectable
var ghostcanvas;
/**@type {CanvasRenderingContext2D} */
var gctx;
var canvas = document.getElementById("canvas");
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext("2d");
var isDrag = false;
var fromMatt = false;

var offsetX, offsetY;
var mySelect = [];
var mySelectColor = "Red";
var mySelectWidth = 3;

var buttons = [];

export function addButton(button) {
  buttons.push(button);
}

export function clearButtons() {
  buttons = [];
}

export function drawIoButtons() {
  drawing.drawButtons(context, buttons);
}

export function delButton(name) {
  let buttonsLength = buttons.length;
  var buttonToRemove = undefined;
  for (let i = 0; i < buttonsLength; i++) {
    if (buttons[i].name == name) {
      buttonToRemove = i;
    }
  }
  if (buttonToRemove != undefined) {
    buttons.splice(buttonToRemove, 1);
  }
}

export function doKeyPress(e) {
  // the R key
  switch (e.keyCode) {
    default:
      break;

    case 82: // R key
      if (rollMatt.containsIngredients()) {
        rollMatt.assembleRoll();
      }
      break;

    case 70: // F key
      console.log("flip");
      rollMatt.flip();
      drawing.Invalidate();
      break;

    case 67: // C key
      cutStation.cutRoll();
      break;
  }
}

export function changeFromMatt(change) {
  fromMatt = change;
}

export function getFromMatt() {
  return fromMatt;
}

export function getButtons() {
  return buttons;
}

export function getMouse(e) {
  // var element = canvas, offsetX = 0, offsetY = 0, mx, my;

  // if(element.offsetParent !== undefined)
  // {
  //     do {
  //        offsetX += element.offsetLeft;
  //        offsetY += element.offsetTop;
  //     } while ((element = element.offsetParent));
  // }

  // offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  // offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  // mx = e.pageX - offsetX;
  // my = e.pageY - offsetY;

  var rect = canvas.getBoundingClientRect();

  return {
    x: e.clientX - rect.left - 10,
    y: e.clientY - Math.floor(rect.top) - 10,
  };
}

export function initGhost(height, width) {
  ghostcanvas = document.createElement("canvas");
  ghostcanvas.height = height;
  ghostcanvas.width = width;
  gctx = ghostcanvas.getContext("2d");
}

export function myDown(e) {
  var mouse = getMouse(e);
  drawing.clear(gctx);

  let il = rollMatt.innerIngredients.length,
    ol = rollMatt.outerIngredients.length;

  // for (var i = 0; i < al; i++) {
  //   drawing.drawShape(gctx, ingredients.activeIngredients[i]);

  //   // var imageData = gctx.getImageData(mouse.x, mouse.y, 1, 1).data;
  //   // var index = (mouse.x + mouse.y * imageData.width) * 4;
  //   fromMatt = false;
  //   let ret = moveItem(mouse, ingredients.activeIngredients[i]);

  //   if (ret) {
  //     return;
  //   }
  // }

  if (rollMatt.isInnerIngredient() && il > 0) {
    if (checkShapes(rollMatt.getInnerIngredients(), mouse)) {
      fromMatt = true;
      return;
    }
  } else if (!rollMatt.isInnerIngredient() && ol > 0) {
    if (checkShapes(rollMatt.getOuterIngredients(), mouse)) {
      fromMatt = true;
      return;
    }
  }
  if (checkShapes(rollControl.getMadeRolls(), mouse)) {
    return;
  }
  if (checkShapes(plates.getMoveablePlates(), mouse)) {
    return;
  }
  if (teaKettle.checkCup(mouse)) {
    return;
  }

  if (ingredientBox.checkClickOnShapes(e, gctx)) {
    return;
  }
  if (riceCooker.checkRiceShape(mouse, gctx)) {
    return;
  }
  // let mRl = rollControl.madeRolls.length;
  // if (mRl > 0)
  // {
  //     for(let i = 0; i < mRl; i++)
  //     {
  //         drawing.drawShape(gctx,madeRolls[i]);

  //         let ret = moveItem(mouse, madeRolls[i]);

  //         if(ret)
  //         {
  //             return;
  //         }
  //     }
  // }
  // let mPl = moveablePlates.length;
  // if (mPl > 0)
  // {
  //     for(let i = 0; i < mPl; i++)
  //     {
  //         drawing.drawShape(gctx,moveablePlates[i]);

  //         let ret = moveCircle(mouse, moveablePlates[i]);

  //         if(ret)
  //         {
  //             return;
  //         }
  //     }
  // }

  mySelect[0] = null;

  drawing.clear(gctx);

  drawing.Invalidate();
}

function checkShapes(shapes, mouse) {
  let l = shapes.length;
  if (l > 0) {
    for (let i = 0; i < l; i++) {
      //drawing.drawShape(gctx, shapes[i]);
      let ret;
      if (shapes[i].renderType.type == shapeType.CIRCLE) {
        ret = moveCircle(mouse, shapes[i]);
      } else {
        ret = moveItem(mouse, shapes[i]);
      }

      if (ret) {
        return ret;
      }
    }
  }
}

export function myUp() {
  isDrag = false;
  if (mySelect != null) {
    rollMatt.checkMatt(mySelect[0]);
    cutStation.checkCuttingStation(mySelect[0]);
    plates.addRollToPlate(mySelect[0]);
    customers.giveCustomerPlate(mySelect[0]);
    if (mySelect[0] instanceof teaKettle.Cup) {
      //console.log(mySelect[0] instanceof teaKettle.Cup);

      customers.giveCustomerTea(mySelect[0]);
    }
  }
  mySelect[0] = null;
  canvas.onmousemove = null;

  drawing.Invalidate();
}

function checkButtons(mouse) {
  for (let button of buttons) {
    if (inBounds(mouse, button)) {
      // console.log(true);

      button.callBack();
    }
  }
}

function checkUpgradeButtons(mouse) {
  for (let button of buttons) {
    if (inBounds(mouse, button)) {
      //console.log(true);
      if (button.containsArgs) {
        button.callBack(argv[0], argv[1]);
      }
      button.callBack();
    }
  }
}

export function checkButtonsGiven(e, buttons) {
  var mouse = getMouse(e);
  for (let button of buttons) {
    if (inBounds(mouse, button)) {
      //console.log(true);

      button.callBack();
    }
  }
}
export function buttonClick(e) {
  var mousePos = getMouse(e);

  checkButtons(mousePos);
}

function inBounds(mouse, shape) {
  return (
    mouse.x >= shape.x &&
    mouse.y >= shape.y &&
    mouse.x < shape.x + shape.w &&
    mouse.y < shape.y + shape.h
  );
}

// function inCircle(mouse, circle)
// {
//     let dx = Math.abs(x-circle.x);
//     if ( dx > circle.radius) return false;
//     let dy = Math.abs(mouse.y-circle.y);
//     if ( dy > circle.radius) return false;
//     if ( dx + dy <= circle.radius) return true;
//     return (dx*dx + dy*dy <= circle.radius*circle.radius);
// }

export function moveItem(mouse, item) {
  if (inBounds(mouse, item.renderType)) {
    mySelect[0] = item;
    offsetX = mouse.x - mySelect[0].renderType.x;
    offsetY = mouse.y - mySelect[0].renderType.y;
    mySelect[0].renderType.x = mouse.x - offsetX;
    mySelect[0].renderType.y = mouse.y - offsetY;
    // mySelect[0].renderType.oldX = mouse.x - offsetX;
    // mySelect[0].renderType.oldY = mouse.y - offsetY;

    isDrag = true;
    canvas.onmousemove = myMove;
    drawing.Invalidate();
    drawing.clear(gctx);
    return true;
  }
  return false;
}

export function moveCircle(mouse, item) {
  if (inCircle(mouse.x, mouse.y, item.renderType)) {
    mySelect[0] = item;
    // mySelect2  = item.roll;
    offsetX = mouse.x - mySelect[0].renderType.x;
    offsetY = mouse.y - mySelect[0].renderType.y;
    mySelect[0].renderType.x = mouse.x - offsetX;
    mySelect[0].renderType.y = mouse.y - offsetY;
    // mySelect.renderType.oldX = mouse.x - offsetX;
    // mySelect.renderType.oldY = mouse.y - offsetY;
    isDrag = true;
    canvas.onmousemove = myMove;
    drawing.Invalidate();
    drawing.clear(gctx);
    return true;
  }
  return false;
}

function myMove(e) {
  if (isDrag) {
    var mouse = getMouse(e);
    if (mySelect[1] != null) {
      correctRollOnPlate(mySelect[0], mySelect[1]);
    }
    mySelect[0].renderType.x = mouse.x - offsetX;
    mySelect[0].renderType.y = mouse.y - offsetY;

    drawing.Invalidate();
  }
}

export function drawMySelect(context) {
  if (mySelect[0] != null) {
    if (mySelect[0] instanceof rollControl.Roll) {
      rollControl.drawRollWithCoords(
        context,
        mySelect[0].renderType.x + mySelect[0].radius * 2,
        mySelect[0].renderType.y + mySelect[0].radius * 2,
        mySelect[0].radius,
        mySelect[0]
      );
    } else {
      if (mySelect[0] instanceof ingredients.Ingredient) {
        if (mySelect[0].name == ingredients.ingredients.RICE) {
          drawing.drawRoundRect(
            context,
            mySelect[0].renderType.x,
            mySelect[0].renderType.y,
            mySelect[0].renderType.w,
            mySelect[0].renderType.h,
            mySelect[0].renderType.radius,
            true,
            true,
            mySelect[0].renderType.intColor,
            mySelectColor,
            1
          );
        } else {
          drawing.drawImage(context, mySelect[0].renderType);
        }
      } else if (mySelect[0].renderType.type == shapes.shapeType.ROUNDRECT) {
        drawing.drawRoundRect(
          context,
          mySelect[0].renderType.x,
          mySelect[0].renderType.y,
          mySelect[0].renderType.w,
          mySelect[0].renderType.h,
          mySelect[0].renderType.radius,
          true,
          true,
          mySelect[0].renderType.intColor,
          mySelectColor,
          1
        );
      } else if (mySelect[0] instanceof teaKettle.Cup) {
        drawing.drawImage(context, mySelect[0].renderType);
      } else {
        context.strokeStyle = mySelectColor;
        context.lineWidth = mySelectWidth;
        context.fillStyle = mySelect[0].renderType.intColor;
        context.strokeRect(
          mySelect[0].renderType.x,
          mySelect[0].renderType.y,
          mySelect[0].renderType.w,
          mySelect[0].renderType.h
        );
        context.fillRect(
          mySelect[0].renderType.x,
          mySelect[0].renderType.y,
          mySelect[0].renderType.w,
          mySelect[0].renderType.h
        );
      }
    }
  }
}
