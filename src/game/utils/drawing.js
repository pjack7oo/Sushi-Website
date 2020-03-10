
import * as plates      from '../objects/plates.js';
import * as cutStation  from '../objects/cuttingstation.js';
import * as rollMatt    from '../objects/rollingmatt.js';
import * as shapes      from './shapes.js';
import * as ingredients from '../objects/ingredients.js';
import * as rollControl from '../objects/rolls.js';
import * as ioControl   from './iocontrol.js';
import * as customers   from '../objects/customers.js';


var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var validCanvas = false;

function render(lagOffset) //probably will be removed
{
    clear(context);
    for (var item in activeIngredients)
    {
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

function itemRender(ctx, lagOffset, item)
{
    item.x = (item.x - item.oldX) * lagOffset + item.oldX;
    item.y = (item.y - item.oldY) * lagOffset + item.oldY;

    drawShape(ctx, item);

    item.oldX = item.x;
    item.oldY = item.y;
}


export function Invalidate()
{
    validCanvas = false;
}

export function drawTextBox(ctx, x, y, w, h, text, font = "10px Verdana",  textColor = 'Black', intColor = '#add8e6' , outColor = 'Gray')
{
    drawRoundRect(ctx, x, y, w, h, 5, true, true, intColor, outColor);
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    ctx.fillText(text,x+ w/2,y+h/2);
    Invalidate();
}

export function drawRoundRectWPoint(ctx, x, y, w, h, radius, fill, stroke = true,intColor = 'Blue' , outColor = 'Gray')
{
    if (typeof stroke == "undefined")
    {
        stroke = true;
    }
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x - radius + w/2 +20, y + h);
    ctx.lineTo(x + w/2, y + h + 10);
    ctx.lineTo(x + radius + w/2 - 20, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (fill) 
    {
        ctx.fillStyle = intColor;
        ctx.fill();
    }
    if (stroke) 
    {
        ctx.strokeStyle = outColor;
        ctx.stroke();
    }
}

function drawRoundRect(ctx, x, y, w, h, radius, fill, stroke = true,intColor = 'Blue' , outColor = 'Gray')
{
    if (typeof stroke == "undefined")
    {
        stroke = true;
    }
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
    if (fill) 
    {
        ctx.fillStyle = intColor;
        ctx.fill();
    }
    if (stroke) 
    {
        ctx.strokeStyle = outColor;
        ctx.stroke();
    }
}

export function clear(ctx)
{
    ctx.fillStyle = 'Gray';
    ctx.fillRect(0,0,600,400);
}

export function draw() 
{
    if (validCanvas == false)
    {
        clear(context);

        //background
        drawShape(context, rollMatt.rollingMatt); //rollingMatt
        drawShape(context, cutStation.cuttingStation);
        drawShape(context, plates.plateHolder);

        
        
        context.fillStyle = 'Red';
        context.textAlign = "left";
        context.font = "30px Arial";
        if (rollMatt.isInnerIngredient()){
            context.fillText('Inner',300,300);
        }
        else
        {
            context.fillText('Outer',300,300);
        }
        

        //draw all shapes
        customers.drawCustomers(context);
        plates.drawPlateHolder(context);//plateholder
        
        cutStation.drawCuttingStation(context);//cuttingStation

        rollControl.drawRolls(context);
        
        ingredients.drawActiveIngredients(context);
        rollMatt.drawIngredients(context);
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
        // if (mySelect != null)
        // {
        //     context.strokeStyle = mySelectColor;
        //     context.lineWidth = mySelectWidth;
        //     context.strokeRect(mySelect.renderType.x, mySelect.renderType.y, mySelect.renderType.w, mySelect.renderType.h);
        // }

        //draw on top like stats

        validCanvas = true;
    }
}

export function drawShapes(ctx, shapes)
{
    for (var i = 0; i < shapes.length; i++)
    {   
        
        drawShape(ctx, shapes[i].renderType);
    }
}

export function drawShape(ctx, shape)
{
    
    switch(shape.type)
    {
        case shapes.shapeType.RECTANGLE:
            drawRectangle(ctx, shape.x, shape.y, shape.w, shape.h, 
                shape.fill, shape.intcolor, shape.outcolor, shape.lineWidth);
            break;
        case shapes.shapeType.CIRCLE:
            drawCircle(ctx,shape.x, shape.y, shape.radius, 
                shape.fill, shape.intColor, shape.outColor, shape.lineWidth);
            break;
        case shapes.shapeType.IMAGE:
            drawImage(ctx, shape);
            break;
        case shapes.shapeType.ROLL:
                
            break;
        default:
            break;
    }
}

function drawImage(ctx, object)
{
    ctx.drawImage(object.image, object.x, object.y, object.w, object.h);
    
}

export function drawRectangle(ctx, x, y, w, h, fill, intcolor, outcolor, lineWidth){
    ctx.strokeStyle = outcolor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x,y,w,h);
    if (fill)
    {
        ctx.fillStyle = intcolor;
        ctx.fillRect(x,y,w,h);
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

export function drawSpeechBubble(x, y, w, h, text, font = "10px Verdana",  textColor = 'Black', intColor = '#add8e6' , outColor = 'Gray')
{
    drawRoundRectWPoint(context, x , y, w, h, 10, true, true, intColor, outColor);
    context.font = font;
    context.textAlign = "center";
    context.fillStyle = textColor;
    context.fillText(text,x+ w/2,y+h/2);
    Invalidate();

}

export function drawRollInSpeechBubble(x, y , w, h, roll, intColor, outColor)
{
    drawRoundRectWPoint(context, x , y, w, h, 10, true, true, intColor, outColor);
    roll.renderType.x = x + w/2;
    roll.renderType.y = y + h/2;
    drawShape(context, roll.renderType);

}