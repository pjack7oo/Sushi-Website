import * as drawing from "../utils/drawing.js";
import { drawIngredientBoxes } from "../objects/ingredientbox.js";

class TimedTextBox {
  constructor(
    x,
    y,
    w,
    h,
    txt,
    duration,
    alignment,
    fill,
    stroke,
    intColor,
    outColor,
    lineHeight = 0,
    maxWidth = 0
  ) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = txt;
    this.duration = duration;
    this.fill = fill;
    this.stroke = stroke;
    this.intColor = intColor;
    this.outColor = outColor;
    this.startTime = performance.now();
    this.active = true;
    this.id = 0;
    this.alignment = alignment;
    this.maxWidth = maxWidth;
    this.lineHeight = lineHeight;
  }

  draw(context) {
    if (this.active) {
      if (this.alignment == "center") {
      }
      drawing.drawTextBox(
        context,
        this.x,
        this.y,
        this.w,
        this.h,
        this.text,
        this.fill,
        this.stroke,
        -5,
        "20px Verdana",
        "Black",
        "White",
        "Red",
        this.alignment,
        this.lineHeight,
        this.maxWidth
      );
    }
  }

  checkTime() {
    if (this.active == true) {
      let currentTime = performance.now(),
        elapsedTime = currentTime - this.startTime,
        percentComplete = (elapsedTime / (this.duration * 1000)) * 100;

      drawing.Invalidate();

      if (percentComplete >= 100) {
        this.active = false;
        this.startTime = 0;
        boxToRemove = this;
        timedBoxes.splice(timedBoxes.findIndex(findbox), 1);
        delete this;
        drawing.Invalidate();
      }
    }
  }
}
function findbox(timedBox) {
  return timedBox.id == boxToRemove.id;
}

var timedBoxes = [];
var boxToRemove = null;
export function createTimedBox(
  x,
  y,
  w,
  h,
  txt,
  duration = 20,
  alignment = "center",
  fill = false,
  stroke = true,
  intColor = "White",
  outColor = "Red",
  lineHeight = 0,
  maxWidth = 0
) {
  let timedBox = new TimedTextBox(
    x,
    y,
    w,
    h,
    txt,
    duration,
    alignment,
    fill,
    stroke,
    intColor,
    outColor,
    lineHeight,
    maxWidth
  );
  timedBox.id = timedBoxes.length;
  timedBoxes.push(timedBox);
}

export function checkTimedBoxes() {
  for (let timedBox of timedBoxes) {
    timedBox.checkTime();
  }
}

export function drawTimedBoxes(context) {
  for (let timedBox of timedBoxes) {
    timedBox.draw(context);
  }
}
