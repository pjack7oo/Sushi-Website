import * as shapes from '../utils/shapes.js'
import * as drawing from '../utils/drawing.js';
import * as ingredients from '../objects/ingredients.js';

export const riceCooker = {
    type: shapes.shapeType.RECTANGLE,
    x: 10,
    y: 150,
    w: 100,
    h: 100,
    intColor: 'Gray',
    outColor: 'Red',
    fill: true,
    lineWidth: 1,
    image: null,
    startTime: 0,
    isActive: false
}

export function drawRiceCooker(ctx)
{
    let radiusX = riceCooker.w/2,
        radiusY = riceCooker.h/4;
    drawing.drawRectangle(ctx, riceCooker.x, riceCooker.y + radiusY, riceCooker.w, riceCooker.h - radiusY, 
                            true, riceCooker.intColor, riceCooker.outColor, 2);
    ctx.fillStyle = riceCooker.intColor;
    ctx.strokeStyle = riceCooker.outColor;
    ctx.lineWidth   = riceCooker.lineWidth;
    ctx.beginPath();
    ctx.ellipse(riceCooker.x + radiusX, riceCooker.y + radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
}

export function createRice()
{
    
}