import * as ingredients from '../objects/ingredients.js';
import * as rollMatt    from '../objects/rollingmatt.js'
import * as drawing     from './drawing.js';
import * as cutStation  from '../objects/cuttingstation.js'

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

export function doKeyPress(e)
{
    // the R key
    switch(e.keyCode)
    {
        default:
            break;
        
        case 82: // R key
            if (ingredients.containsIngredients())
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

function getMouse(e) 
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

    
    if (isInner && il > 0)
    {
        for(var i = 0; i < il; i++)
        {
            drawing.drawShape(gctx, innerIngredients[i]);
            fromMatt = true;           
            let ret = moveItem(mouse, innerIngredients[i]);
            if(ret)
        {
            return;
        }
        }
    }
    else if (!isInner && ol > 0)
    {
        for(var i = 0; i < ol; i++)
        {
            drawing.drawShape(gctx, outerIngredients[i]);
            fromMatt = true;
            let ret = moveItem(mouse, outerIngredients[i]);
            if(ret)
        {
            return;
        }
        }
    }
    let mRl = madeRolls.length;
    if (mRl > 0)
    {
        for(let i = 0; i < mRl; i++)
        {
            drawing.drawShape(gctx,madeRolls[i]);
            
            let ret = moveItem(mouse, madeRolls[i]);
        
            if(ret)
            {
                return;
            }
        }
    }
    let mPl = moveablePlates.length;
    if (mPl > 0)
    {
        for(let i = 0; i < mPl; i++)
        {
            drawing.drawShape(gctx,moveablePlates[i]);
            
            let ret = moveCircle(mouse, moveablePlates[i]);
            
            if(ret)
            {
                return;
            }
        }
    }

    mySelect = null;

    drawing.clear(gctx);

    drawing.Invalidate();
}

function myUp()
{
    isDrag = false;
    if (mySelect != null)
    {
        checkMatt();
        checkCuttingStation();
        addRollToPlate();
         
    }
    mySelect = null;
    canvas.onmousemove = null;
    
    Invalidate();
}

function inBounds(mouse, shape)
{
    return ((mouse.x >= shape.x) && (mouse.y >= shape.y) && 
            (mouse.x < shape.x + shape.w) && (mouse.y < shape.y + shape.h));
}

export function moveItem(mouse, item)
{
    if (inBounds(mouse, item.renderType))
    {
        mySelect[0]   = item;
        offsetX    = mouse.x - mySelect[0].renderType.x;
        offsetY    = mouse.y - mySelect[0].renderType.y;
        mySelect[0].renderType.x = mouse.x - offsetX;
        mySelect[0].renderType.y = mouse.y - offsetY;
        mySelect[0].renderType.oldX = mouse.x - offsetX;
        mySelect[0].renderType.oldY = mouse.y - offsetY;
        
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
        mySelect   = item;
        mySelect2  = item.roll; 
        offsetX    = mouse.x - mySelect.renderType.x;
        offsetY    = mouse.y - mySelect.renderType.y;
        mySelect.renderType.x = mouse.x - offsetX;
        mySelect.renderType.y = mouse.y - offsetY;
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