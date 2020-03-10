import * as roll from './rolls.js';
import * as drawing from '../utils/drawing.js';
import * as ioControl from '../utils/iocontrol.js';
import * as shapes from '../utils/shapes.js';

const shapeType = {
    RECTANGLE: 'Rectangle',
    CIRCLE: 'Circle'
}

export const cuttingStation = {
    type: shapeType.RECTANGLE,
    x: 410,
    y: 300,
    w: 150,
    h: 100,
    intcolor: '#C19A6B',
    outcolor: '#C19A6B',
    fill: true,
    lineWidth: 1,
    image: null,
    item: null,
    startTime: 0,
    isActive: false,
    cuttingSpeed: 1 
}

export function checkCutRoll()
{
    if (cuttingStation.isActive == true){
        let currentTime     = performance.now(),
            elapsedTime     = currentTime - cuttingStation.startTime,
            percentComplete = elapsedTime / (8000 / cuttingStation.cuttingSpeed) * 100;
            
        if (percentComplete >= 100)
        {
            cuttingStation.isActive = false;
            cuttingStation.startTime = 0;
            cuttingStation.item.isCut = true;
            cuttingStation.item.canEnterPlate = true;
            cuttingStation.item.canEnterCuttingStation = false;
            roll.downSizeRoll(cuttingStation.item);
            roll.pushRoll(cuttingStation.item);
            cuttingStation.item = null;
            console.log('Cut roll');
                
            drawing.Invalidate();
        }
    }
    
        //drawProgressBar(cuttingStation.x, cuttingStation.y, cuttingStation.w, 20, precentComplete); //TODO implement drawProgressBar
        //todo implement cutAnimation
}

export function drawCuttingStation(context)
{
    if (cuttingStation.item != null)
    {
        if (cuttingStation.isActive)
        {
            drawing.drawTextBox(context, cuttingStation.x, cuttingStation.y - 40, cuttingStation.w, 40, "Cutting!");
        }
        else
        {
            drawing.drawTextBox(context, cuttingStation.x, cuttingStation.y - 40, cuttingStation.w, 40, "Ready to cut! Press C key");
        }
        drawing.drawShape(context, cuttingStation.item.renderType);
        drawing.Invalidate();
    }
}

export function cutRoll()
{
    if (cuttingStation.item == null )
    {
        return;
    }
    if (cuttingStation.isActive == false)
    {
        cuttingStation.isActive = true;
        cuttingStation.startTime = performance.now();
    }
    drawing.Invalidate();
}

export function checkCuttingStation(mySelect)
{
    if (mySelect != null){
        if (mySelect.canEnterCuttingStation == false)
        {
            drawing.Invalidate();
            return;
        }
        if (mySelect.isCut == true)
        {
            drawing.Invalidate();
            return;
        }
        if (shapes.Contains(cuttingStation,mySelect.renderType))
        {
            cuttingStation.item = mySelect;
            console.log(cuttingStation.item);
            roll.removeRoll(mySelect);
            
            }
    }
}