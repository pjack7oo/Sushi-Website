import * as shapes from '../utils/shapes.js'
import * as drawing from '../utils/drawing.js';
//const drawing = require('../utils/drawing.js');
var moveablePlates = [];

export const plateHolder = {
    type: shapes.shapeType.RECTANGLE,
    x: 300,
    y: 150,
    w: 100,
    h: 100,
    intcolor: '#FF0000',
    outcolor: '#8B0000',
    fill: true,
    lineWidth: 1,
    image: null,
    plate: null,
    startTime: 0,
    isActive: false,
}

export function Plate()
{
    this.roll = null;
    this.renderType = shapes.Circle;
    this.canEnterMatt = false;
    this.canEnterCuttingStation = false;
    this.canEnterPlate = false;
}

export function createPlate()
{
    var plate = new Plate;
    plate.renderType = shapes.createCircle(plateHolder.x + plateHolder.w /2, plateHolder.y + plateHolder.h /2, 40, true, 'white', 'gold', 3);
    plateHolder.plate = plate; 
}

export function getMoveablePlates()
{
    return moveablePlates;
}

export function drawPlateHolder(context)
{
    if (plateHolder.plate != null)
    {
        //console.log(plateHolder.plate.renderType);
            
        drawing.drawShape(context, plateHolder.plate.renderType);
    }
}

export function drawPlates(ctx, plates)
{
    let l = plates.length;
    for (var i = 0; i < l; i++)
    {
        drawShape(ctx, plates[i].renderType);
        drawShape(ctx, plates[i].roll.renderType);
    }
}

export function addRollToPlate(mySelect)
{
    if (mySelect != null)
    {
        if (mySelect.canEnterPlate == true)
        {
            if (shapes.containsRoll(mySelect,plateHolder.plate))
            {
                correctRollOnPlate(plateHolder.plate, mySelect);
                plateHolder.plate.roll = mySelect;
                removeRoll(mySelect);
                
                moveablePlates.push(plateHolder.plate);
                console.log(moveablePlates);
                
            }
        }
    }
}

export function correctRollOnPlate(plate, roll)
{
    roll.renderType.x = plate.renderType.x - roll.renderType.w /2;
    roll.renderType.y = plate.renderType.y - roll.renderType.h / 2;
}

