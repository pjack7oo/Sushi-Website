import * as ingredients from '../objects/ingredients.js';
import * as rollMatt    from '../objects/rollingmatt.js';
import * as drawing     from './drawing.js';
import * as cutStation  from '../objects/cuttingstation.js';
import * as rollControl from '../objects/rolls.js';
import * as plates      from '../objects/plates.js';
import * as customers   from '../objects/customers.js';
import { shapeType, inCircle} from './shapes.js';

//moving shapes around code from https://dzone.com/articles/making-and-moving-selectable
var ghostcanvas;
/**@type {CanvasRenderingContext2D} */
var gctx;
var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');
var isDrag   = false;
var fromMatt = false;

var offsetX, offsetY;
var mySelect = [];
var mySelectColor = 'Red';
var mySelectWidth = 3;

export function doKeyPress(e)
{
    // the R key
    switch(e.keyCode)
    {
        default:
            break;
        
        case 82: // R key
            if (rollMatt.containsIngredients())
            {
                rollMatt.assembleRoll();
            }
            break;
        
        case 70: // F key
            console.log('flip');
            rollMatt.flip();
            drawing.Invalidate();
            break;
        
        case 67: // C key
            cutStation.cutRoll();
            break;
    }
}

export function changeFromMatt(change)
{
    fromMatt = change;
}

export function getFromMatt()
{
    return fromMatt;
}


export function getMouse(e) 
{
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

    return {x: e.clientX - rect.left, y: e.clientY - Math.floor(rect.top)};
}

export function initGhost(height, width)
{
    ghostcanvas = document.createElement('canvas');
    ghostcanvas.height = height;
    ghostcanvas.width  = width;
    gctx = ghostcanvas.getContext('2d');
}

export function myDown(e)
{
    var mouse = getMouse(e);
    drawing.clear(gctx);

    let al = ingredients.activeIngredients.length,
        il = rollMatt.innerIngredients.length,
        ol = rollMatt.outerIngredients.length;

    for (var i = 0; i < al; i++)
    {
        drawing.drawShape(gctx, ingredients.activeIngredients[i]);

        // var imageData = gctx.getImageData(mouse.x, mouse.y, 1, 1).data;
        // var index = (mouse.x + mouse.y * imageData.width) * 4;
        fromMatt = false;
        let ret = moveItem(mouse, ingredients.activeIngredients[i]);
        
        if(ret)
        {
            return;
        } 
    }

    
    if (rollMatt.isInnerIngredient() && il > 0)
    {
        if (checkShapes(rollMatt.getInnerIngredients(), mouse))
        {
            fromMatt = true;
            return;
        }
    }
    else if (!rollMatt.isInnerIngredient() && ol > 0)
    {
        if (checkShapes(rollMatt.getOuterIngredients(), mouse))
        {
            fromMatt = true;
            return;
        }
    }
    if (checkShapes(rollControl.getMadeRolls(), mouse))
    {
        return;
    }
    if (checkShapes(plates.getMoveablePlates(), mouse))
    {
        
        
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

function checkShapes(shapes, mouse)
{
    let l = shapes.length;
    if (l > 0)
    {
        for (let i = 0; i < l; i++)
        {
            drawing.drawShape(gctx, shapes[i]);
            let ret;
            if (shapes[i].renderType.type == shapeType.CIRCLE)
            {
                ret = moveCircle(mouse, shapes[i]);
            }
            else
            {
                ret = moveItem(mouse, shapes[i]);
            }
            

            
            
            if(ret)
            {
                return ret;
            }
        }  
    }
    

}

export function myUp()
{
    isDrag = false;
    if (mySelect != null)
    {
        rollMatt.checkMatt(mySelect[0]);
        cutStation.checkCuttingStation(mySelect[0]);
        plates.addRollToPlate(mySelect[0]);
        customers.giveCustomerPlate(mySelect[0]);
         
    }
    mySelect[0] = null;
    canvas.onmousemove = null;
    
    drawing.Invalidate();
}

export function checkButtons(mouse, buttons)
{
    for (let button of buttons)
    {
        if (inBounds(mouse,button)) {
            button.callBack();
        }
    }
    
}

function inBounds(mouse, shape)
{
    return ((mouse.x >= shape.x) && (mouse.y >= shape.y) && 
            (mouse.x < shape.x + shape.w) && (mouse.y < shape.y + shape.h));
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

export function moveItem(mouse, item)
{
    if (inBounds(mouse, item.renderType))
    {
        mySelect[0]= item;
        offsetX    = mouse.x - mySelect[0].renderType.x;
        offsetY    = mouse.y - mySelect[0].renderType.y;
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

export function moveCircle(mouse, item)
{
    if (inCircle(mouse.x, mouse.y, item.renderType))
    {
        mySelect[0]   = item;
        // mySelect2  = item.roll; 
        offsetX    = mouse.x - mySelect[0].renderType.x;
        offsetY    = mouse.y - mySelect[0].renderType.y;
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

function myMove(e)
{
    if (isDrag)
    {

        var mouse = getMouse(e);
        if (mySelect[1] != null)
        {
            correctRollOnPlate(mySelect[0], mySelect[1]);
        }
        mySelect[0].renderType.x = mouse.x - offsetX;
        mySelect[0].renderType.y = mouse.y - offsetY;

        drawing.Invalidate();
    }
}


export function drawMySelect(ctx)
{
    if (mySelect[0] != null)
    {
        context.strokeStyle = mySelectColor;
        context.lineWidth = mySelectWidth;
        context.strokeRect(mySelect[0].renderType.x, mySelect[0].renderType.y, mySelect[0].renderType.w, mySelect[0].renderType.h);
    }
}