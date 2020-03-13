import * as roll from './rolls.js';
import * as drawing from '../utils/drawing.js';
import * as ioControl from '../utils/iocontrol.js';
import * as shapes from '../utils/shapes.js';
import * as progBar from '../utils/progressBar.js';

const shapeType = {
    RECTANGLE: 'Rectangle',
    CIRCLE: 'Circle'
}
var boardImage = new Image();
boardImage.src = './game/images/TexturesCom_CloseupBambooCuttingBoard_M.png'

export const cuttingStation = {
    type: shapeType.RECTANGLE,
    x: 410,
    y: 400,
    w: 150,
    h: 100,
    intColor: '#C19A6B',
    outColor: '#C19A6B',
    fill: true,
    lineWidth: 1,
    image: boardImage,
    item: null,
    startTime: 0,
    isActive: false,
    cuttingSpeed: 1 ,
    progress: 0,
}
var bar = new progBar.progressbar(cuttingStation.x, cuttingStation.y -60, cuttingStation.w, 20);
export function checkCutRoll()
{
    if (cuttingStation.isActive == true){
        let currentTime     = performance.now(),
            elapsedTime     = currentTime - cuttingStation.startTime,
            percentComplete = elapsedTime / (8000 / cuttingStation.cuttingSpeed) * 100;
            cuttingStation.progress = percentComplete;
            drawing.Invalidate();
            

        if (percentComplete >= 100)
        {
            cuttingStation.isActive = false;
            cuttingStation.startTime = 0;
            cuttingStation.item.isCut = true;
            cuttingStation.item.canEnterPlate = true;
            cuttingStation.item.canEnterCuttingStation = false;
            cuttingStation.item.renderType.w = cuttingStation.item.radius*4;
            cuttingStation.item.renderType.h = cuttingStation.item.radius*4;
            // cuttingStation.item.renderType.x -= cuttingStation.item.radius*2;
            // cuttingStation.item.renderType.y -= cuttingStation.item.radius*2;
            //roll.downSizeRoll(cuttingStation.item);
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
    drawing.drawRoundRectImage(cuttingStation.x, cuttingStation.y, cuttingStation.w, cuttingStation.h, cuttingStation.image);
    
    if (cuttingStation.item != null)
    {
        if (cuttingStation.isActive)
        {
            drawing.drawTextBox(context, cuttingStation.x, cuttingStation.y - 40, cuttingStation.w, 40, "Cutting!");
            progBar.drawColorProgressbar(cuttingStation.progress, bar, false);
        }
        else
        {
            drawing.drawTextBox(context, cuttingStation.x, cuttingStation.y - 40, cuttingStation.w, 40, "Ready to cut! Press C key");
        }
        //drawing.drawRoundRectImage(cuttingStation.x, cuttingStation.y, cuttingStation.w, cuttingStation.h, cuttingStation.image);
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