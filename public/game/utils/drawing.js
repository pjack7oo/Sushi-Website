
import * as plates from '../objects/plates.js';
import * as cutStation from '../objects/cuttingstation.js';
import * as rollMatt from '../objects/rollingmatt.js';
import * as shapes from './shapes.js';
import * as ingredients from '../objects/ingredients.js';
import * as rollControl from '../objects/rolls.js';
import * as ioControl from './iocontrol.js';
import * as customers from '../objects/customers.js';
import * as riceCooker from '../objects/riceCooker.js';
import * as ingredientMenu from '../objects/ingredientmenu.js';
import * as ingredientBox  from '../objects/ingredientbox.js';
import * as clock       from   '../objects/clock.js';
import { drawTable } from '../objects/table.js'
import * as levelControl from '../objects/level.js';
import * as player from '../objects/player.js';



var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var validCanvas = false;
var gridActive  = false;// for faster drawing during building



export function getCanvasValidity() {
    return validCanvas;
}
function render(lagOffset) //probably will be removed
{
    clear(context);
    for (var item in activeIngredients) {
        itemRender(context, lagOffset, activeIngredients[item].renderType);
    }
    // sprites.forEach(function(sprite){
    //     ctx.save();
    //     //Call the sprite's `render` method and feed it the
    //     //canvas context and lagOffset
    //     sprite.render(ctx, lagOffset);
    //     ctx.restore();
    // });
}

function itemRender(ctx, lagOffset, item) {
    item.x = (item.x - item.oldX) * lagOffset + item.oldX;
    item.y = (item.y - item.oldY) * lagOffset + item.oldY;

    drawShape(ctx, item);

    item.oldX = item.x;
    item.oldY = item.y;
}


export function Invalidate() {
    validCanvas = false;
}

export function drawTextBox(ctx, x, y, w, h, text, font = "10px Verdana", textColor = 'Black', intColor = '#add8e6', outColor = 'Gray') {
    drawRoundRect(ctx, x, y, w, h, 5, true, true, intColor, outColor);
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    //ctx.fillText(text,x+ w/2,y+h/1.75);
    printAtWordWrap(ctx, text, x + w / 2, y + h / 2, 30, 174, textColor, font, "center");
    Invalidate();
}

export function printAtWordWrap(context, text, x, y, lineHeight, maxWidth, textColor, font, alignment = "center") {
    context.font = font;
    context.textAlign = alignment;
    context.fillStyle = textColor;
    
    var lines = text.split("\n");

    for (var i = 0; i < lines.length; i++) {

        var words = lines[i].split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = context.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        context.fillText(line, x, y);
        y += lineHeight;
    }
}

export function drawRoundRectWPoint(ctx, x, y, w, h, radius, fill, stroke = true, intColor = 'Blue', outColor = 'Gray') {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x - radius + w / 2 + 20, y + h);
    ctx.lineTo(x + w / 2, y + h + 10);
    ctx.lineTo(x + radius + w / 2 - 20, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = intColor;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = outColor;
        ctx.stroke();
    }
}

export function drawRoundRect(ctx, x, y, w, h, radius, fill, stroke = true, intColor = 'Blue', outColor = 'Gray', lineWidth = 1) {
    if (typeof stroke == "undefined") {
        stroke = true;
    }
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);

    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) {
        ctx.fillStyle = intColor;
        ctx.fill();
    }
    if (stroke) {
        ctx.strokeStyle = outColor;
        ctx.stroke();
    }
}

export function clear(ctx) {
    ctx.fillStyle = 'White';
    ctx.fillRect(0, 0, 600, 500);
}

export function clearArea(ctx, x, y, w, h, color = "white") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

export function draw() {
    if (validCanvas == false) {
        clear(context);

        //background
        customers.drawCustomers(context);

        drawTable(context);
        rollMatt.drawRollingMatt(context);
        
        drawShape(context, plates.plateHolder);



        // context.fillStyle = 'Red';
        // context.textAlign = "left";
        // context.font = "30px Arial";
        // if (rollMatt.isInnerIngredient()) {
        //     context.fillText('Inner', 300, 300);
        // }
        // else {
        //     context.fillText('Outer', 300, 300);
        // }


        //draw all shapes

        plates.drawPlateHolder(context);//plateholder

        cutStation.drawCuttingStation(context);//cuttingStation
        riceCooker.drawRiceCooker(context); //ricecooker

        rollControl.drawRolls(context);
        ingredientBox.drawIngredientBoxes(context);
        //ingredients.drawActiveIngredients(context);
        // rollMatt.drawIngredients(context);
        //drawShapes(context, ingredients.activeIngredients);

        // if (isInner && innerIngredients.length > 0)
        // {
        //     drawShapes(context, innerIngredients);
        // }
        // else if (!isInner && outerIngredients.length > 0)
        // {
        //     drawShapes(context, outerIngredients);
        // }
        
        plates.drawPlates(context);
        
        ioControl.drawMySelect(context);
        ingredientMenu.drawMenu();
        ioControl.drawIoButtons();
        riceCooker.drawRice(context);
        // if (mySelect != null)
        // {
        //     context.strokeStyle = mySelectColor;
        //     context.lineWidth = mySelectWidth;
        //     context.strokeRect(mySelect.renderType.x, mySelect.renderType.y, mySelect.renderType.w, mySelect.renderType.h);
        // }
        clock.drawClock(context);
        printAtWordWrap(context,"Level: ",300, 20, 10, 100, "Blue", "20px Arial", "center");
        printAtWordWrap(context,levelControl.getCurrentLevel().toString(),330, 20, 10, 30, "Blue", "20px Arial");
        printAtWordWrap(context,"Money: ",0, 20, 10, 100, "Green", "20px Arial", "left");
        printAtWordWrap(context,player.getCurrentMoney().toString(),70, 20, 10, 100, "Green", "20px Arial", "left");
        //draw on top like stats
        drawGrid();
        validCanvas = true;
    }
}

export function drawTriangleImage(triangle, degrees)
{
    context.save();
    context.beginPath();
    drawTriangle(context, triangle.p1, triangle.p2, triangle.p3, false, false);
    context.clip();

    
    // context.translate(triangle.p1.x + 100, triangle.p1.y + 100);
    // context.rotate(degrees*Math.PI/180);
    context.drawImage(triangle.image, triangle.p1.x, triangle.p1.y);

    context.beginPath();
    drawTriangle(context, triangle.p1, triangle.p2, triangle.p3, false, false);
    context.clip();
    context.closePath();
    context.restore();
}

export function drawRectImage(x, y, w, h, image, scale = false, sx = 0, sy = 0) {
    context.save();
    context.beginPath();
    cutRect(x, y, w, h);
    context.closePath();
    context.clip();

    
    // context.translate(triangle.p1.x + 100, triangle.p1.y + 100);
    // context.rotate(degrees*Math.PI/180);
    if (scale) {
        context.drawImage(image, x ,y, sx, sy);
    }
    else {
        context.drawImage(image, x ,y);
    }
    

    context.beginPath();
    cutRect(x, y, w, h);
    context.clip();
    context.closePath();
    context.restore();
}

export function drawRoundRectImage(x, y, w, h, image, scale = false, sx = 0, sy = 0) {
    context.save();
    context.beginPath();
    drawRoundRect(context, x, y, w, h,10, false, false, 'Brown', 'Brown');
    context.closePath();
    context.clip();

    
    // context.translate(triangle.p1.x + 100, triangle.p1.y + 100);
    // context.rotate(degrees*Math.PI/180);
    if (scale) {
        context.drawImage(image, x ,y, sx, sy);
    }
    else {
        context.drawImage(image, x ,y);
    }
    

    context.beginPath();
    drawRoundRect(context, x, y, w, h, 10, false, false, 'Brown', 'Brown');
    context.clip();
    context.closePath();
    context.restore();
}

function cutRect(x, y, w, h) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + w, y);
    context.lineTo(x + w, y + h);
    context.lineTo(x, y + h);
    context.lineTo(x, y);
    context.closePath();
}

export function drawShapes(ctx, shapes) {
    for (var i = 0; i < shapes.length; i++) {

        drawShape(ctx, shapes[i].renderType);
    }
}

//Able to draw Rectangles, Circle, Image, Roll
export function drawShape(ctx, shape) {

    switch (shape.type) {
        case shapes.shapeType.RECTANGLE:
            drawRectangle(ctx, shape.x, shape.y, shape.w, shape.h,
                shape.fill, shape.intColor, shape.outColor, shape.lineWidth);
            break;
        case shapes.shapeType.CIRCLE:
            drawCircle(ctx, shape.x, shape.y, shape.radius,
                shape.fill, shape.intColor, shape.outColor, shape.lineWidth);
            break;
        case shapes.shapeType.IMAGE:
            drawImage(ctx, shape);
            break;
        case shapes.shapeType.ROUNDRECT:
            drawRoundRect(ctx, shape.x, shape.y, shape.w, shape.h, shape.radius, 
                        shape.fill, shape.stroke, shape.intColor, shape.outColor, shape.lineWidth);
            break;
        default:
            break;
    }
}

export function drawButtons(ctx, buttons) {
    //let buttons = ioControl.getButtons();
    for (let button of buttons) {
        drawShape(ctx, button);
        ctx.font = button.font;
        ctx.textAlign = button.fontLoc;
        ctx.fillStyle = button.textColor;
        
        printAtWordWrap(ctx, button.text, button.x + button.w / 2 + 3, button.y + button.h / 1.5, button.h, button.w, "black", button.font, button.fontLoc);
    }

}
export function drawUpgradeButtons(ctx, buttons) {
    for (let button of buttons) {
        drawShape(ctx, button);
        ctx.font = button.font;
        ctx.textAlign = button.fontLoc;
        ctx.fillStyle = button.textColor;
        
        button.text = button.cost.toString();
        
        printAtWordWrap(ctx, button.text, button.x + button.w / 2+3, button.y + button.h / 1.5, button.h, button.w, "black", button.font, button.fontLoc);
    }
}
function drawImage(ctx, object) {
    ctx.drawImage(object.image, object.x, object.y, object.w, object.h);
}

export function drawRectangle(ctx, x, y, w, h, fill, intcolor, outcolor, lineWidth) {
    ctx.strokeStyle = outcolor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x, y, w, h);
    if (fill) {
        ctx.fillStyle = intcolor;
        ctx.fillRect(x, y, w, h);
    }

}

export function drawCircle(context, x, y, radius, fillCircle, intcolor, outcolor, lineWidth) {
    context.strokeStyle = outcolor;
    context.beginPath();

    context.arc(x, y, radius, 0, Math.PI * 2, false);

    if (fillCircle) {
        context.fillStyle = intcolor;
        context.fill();
    }
    context.lineWidth = lineWidth;
    context.stroke();
}

//Draw Triangle between 3 points
export function drawTriangle(context, p1, p2, p3, fill, stroke, intColor = '', outColor = '', lineWidth = 1) {
    
    context.beginPath();
    context.moveTo(p1.x,p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.lineTo(p1.x, p1.y);
    context.strokeStyle = outColor;
    context.fillStyle   = intColor;
    context.lineWidth   = lineWidth;
    if (stroke) {
        context.stroke();
    }
    if (fill) {
        context.fill();
    }
    context.closePath();
}


export function drawRollPieCuts(context, x, y, radius, roll) {

    switch (roll.inner.length) {
        default:
            drawPieCuts(context, x, y, radius * .94, roll);
            break;
        case 1:
            let color = ingredients.getIngredientColor(roll.inner[0]);
            drawCircle(context, x, y, radius * 0.98, true, color.intColor, color.outColor, 1);
            break;
        case 0:
            console.log("Cant have zero slices");
            break;
    }
}

function drawPieCuts(ctx, x, y, radius, roll) {
    var angles = getIngredientAngles(roll.inner.length),
        anglesLength = angles.length,
        beginAngle = 0,
        endAngle = 0;

    for (let i = 0; i < anglesLength; i++) {
        let color = ingredients.getIngredientColor(roll.inner[i]);
        beginAngle = endAngle;

        endAngle = endAngle + angles[i];


        ctx.beginPath();

        ctx.fillStyle = color.intColor;
        ctx.strokeStyle = color.outColor;
        ctx.lineWidth = 1;
        ctx.moveTo(x, y);
        ctx.arc(x, y, radius, beginAngle, endAngle);
        ctx.lineTo(x, y);
        ctx.stroke();

        ctx.fill();
    }
}

//TODO make every ingredient take different size of pie cut
function getIngredientAngles(count) {
    var angles = [];
    let angle = 0;
    switch (count) {
        default:
            console.log("Cant have zero inner ingredients");
            break;
        case 2:
            angles.push(Math.PI * 1);
            angles.push(Math.PI * 1);
            break;
        case 3:
            angle = 2 / 3;
            for (let i = 0; i < 3; i++) {
                angles.push(Math.PI * angle);
            }
            break;
        case 4:
            angle = 2 / 4;
            for (let i = 0; i < 4; i++) {
                angles.push(Math.PI * angle);
            }
            break;
    }
    return angles;
}

export function drawProgressBar(x, y, w, h, progress, barColor, backColor) {
    // context.strokeStyle = backColor;
    // context.strokeRect(x, y, w, h);
    // context.fillStyle = backColor;
    drawRectangle(context, x, y, w, h, true, backColor, backColor, 1);

    if (progress >  1) {
        progress = progress/100;
        drawRectangle(context, x, y, w*progress, h, true, barColor, backColor, 1);
    
    }
}

export function drawInverseBar(x, y, w, h, progress, barColor, backColor) {
    drawRectangle(context, x, y, w, h, true, backColor, backColor, 1);
    context.fillStyle = 'hsla(' + this.hue + ', 100%, 50%, 1)';
    var grad = context.createLinearGradient(0, 0, 0, 180);
    grad.addColorStop(0, "transparent");
    grad.addColorStop(1, "rgba(0,0,0,0.8)");
    context.fillStyle = grad;
    if (progress >  1) {
        progress = progress/100;
        progress = 1-progress;
        
        drawRectangle(context, x, y, w*progress, h, true, grad, backColor, 1);
    
    }
}

export function drawAnyQuad(p1, p2, p3, p4, stroke, fill, intColor, outColor, lineWidth = 1) {
    context.beginPath();
    context.moveTo(p1.x,p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.lineTo(p4.x, p4.y);
    context.lineTo(p1.x, p1.y);
    context.strokeStyle = outColor;
    context.fillStyle   = intColor;
    context.lineWidth   = lineWidth;
    if (stroke) {
        context.stroke();
    }
    if (fill) {
        context.fill();
    }
    context.closePath();
}

 



export function drawSpeechBubble(x, y, w, h, text, font = "10px Verdana", textColor = 'Black', intColor = '#add8e6', outColor = 'Gray') {
    drawRoundRectWPoint(context, x, y, w, h, 10, true, true, intColor, outColor);
    context.font = font;
    context.textAlign = "center";
    context.fillStyle = textColor;
    context.fillText(text, x + w / 2, y + h / 2);
    Invalidate();

}

export function drawRollInSpeechBubble(x, y, w, h, roll, intColor, outColor) {
    drawRoundRectWPoint(context, x, y, w, h, 10, true, true, intColor, outColor);
    roll.renderType.x = x + w / 2;
    roll.renderType.y = y + h / 2;
    drawShape(context, roll.renderType);

}
export function toggleGrid() {
    gridActive = !gridActive;
}
export function drawGrid() {
    if (gridActive) {
        context.lineWidth = 1;
        for (let i = 0; i < 24; i++) {
            if (i % 2 == 0) {
                drawVerticalBar(i*25);
            }
            else {
                drawVerticalTick(i*25);
            }
        }
        for (let i = 0; i < 24; i++) {
            if (i % 2 == 0) {
                drawHorizontalBar(i*25);
            }
            else {
                drawHorizontalTick(i*25);
            }
        }
    }
}

function drawVerticalBar(x) {
    context.beginPath();
    context.moveTo(x,0);
    context.lineTo(x, canvas.height);
    context.strokeStyle = "Black";
    context.stroke();
    context.closePath();
}

function drawVerticalTick(x) {
    let length = canvas.height / 50;
    for (let i = 0; i < length; i++) {
        context.beginPath();
        context.moveTo(x, i*50 - 10);
        context.lineTo(x, i*50 + 10);
        context.strokeStyle = "Black";
        context.stroke();
        context.closePath();
    }
}

function drawHorizontalBar(y) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(canvas.width, y);
    context.strokeStyle = "Black";
    context.stroke();
    context.closePath();
}

function drawHorizontalTick(y) {
    let length = canvas.width/ 50;
    for (let i = 0; i < length; i++) {
        context.beginPath();
        context.moveTo(i*50 - 10, y);
        context.lineTo(i*50 + 10, y);
        context.strokeStyle = "Black";
        context.stroke();
        context.closePath();
    }
}