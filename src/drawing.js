var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var boxes = [];
var innerIngredients = [];
var outerIngredients = [];
var isInner = true;

var interval = 20;
var height;
var width;

//moving shapes around code from https://dzone.com/articles/making-and-moving-selectable

var isDrag = false;
var mx, my; //coordinates

var validCanvas = false;

var mySelect;

var mySelectColor = 'Red';
var mySelectWidth = 3;

var ghostcanvas;
/**@type {CanvasRenderingContext2D} */
var gctx;

var offsetX, offsetY;
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

const shapeType = {
    RECTANGLE: 'Rectangle',
    CIRCLE: 'Circle'
}

const ingredients = {
    AVOCADO: 'Avocado',
    CUCUMBER: 'Cucumber',
    CRAB: 'Crab',
    RICE: 'Rice'
}

const rollingMatt = {
    type: shapeType.RECTANGLE,
    x: 300,
    y: 300,
    w: 100,
    h: 100,
    Intcolor: '#444444',
    Outcolor: '#444444',
    fill: true,
    lineWidth: 1,
    image: null
}

const CaliforniaRoll = {
    name: 'California Roll',
    inner: [ingredients.AVOCADO, ingredients.CUCUMBER, ingredients.CRAB],
    outer: [ingredients.RICE],
    nori: true
}
context.fillStyle = 'Gray';
init();

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

function init()
{
    height = canvas.height;
    width = canvas.width;
    ghostcanvas = document.createElement('canvas');
    ghostcanvas.height = height;
    ghostcanvas.width  = width;
    gctx = ghostcanvas.getContext('2d');

    canvas.onselectstart = () => { return false; }

    if (document.defaultView && document.defaultView.getComputedStyle)
    {
        stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)     || 0;
        stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)      || 0;
        styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10) || 0;
        styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)  || 0;
    }

    setInterval(draw, interval); //draw every interval milliseconds

    canvas.onmousedown = myDown;
    canvas.onmouseup   = myUp;
    canvas.ondblclick  = myDbkClick; // temp dbl click for making new boxes

    canvas.setAttribute("tabindex", 0);
    canvas.addEventListener('keydown', doKeyPress,true);
    // add custom init
    
    addBox(shapeType.RECTANGLE, 200, 200, 40, 40, ingredients.RICE, true, 'White', 'White');

    addBox(shapeType.RECTANGLE, 25, 90, 25, 25, ingredients.AVOCADO,true, 'Green', 'Green');

    //console.log(boxes.length);

}

function doKeyPress(e)
{
    // the R key
    if (e.keyCode == 82)
    {
        if (containsIngredients())
        {
            assembleRoll();
        }
    }

    // the F key
    if (e.keyCode == 70)
    {
        console.log('flip');
        if (isInner)
        {
            isInner = false;
        }
        else
        {
            isInner = true;
        }
        Invalidate();
    }
}

function myDbkClick(e)
{
    var mouse = getMouse(e);
    addBox(shapeType.RECTANGLE, mouse.x - 10, mouse.y - 10, 20, 20, 
        ingredients.RICE, true, 'Blue', 'Blue');
    Invalidate();
}
var fromMatt = false;
function myDown(e)
{
    var mouse = getMouse(e);
    clear(gctx);

    for (var i = 0; i < boxes.length; i++)
    {
        drawShape(gctx, boxes[i]);

        // var imageData = gctx.getImageData(mouse.x, mouse.y, 1, 1).data;
        // var index = (mouse.x + mouse.y * imageData.width) * 4;
        fromMatt = false;
        ret = moveItem(mouse, boxes[i]);
        
        if(ret)
        {
            return;
        } 
    }

    
    if (isInner && innerIngredients.length > 0)
    {
        for(var i = 0; i < innerIngredients.length; i++)
        {
            drawShape(gctx, innerIngredients[i]);
            fromMatt = true;           
            ret = moveItem(mouse, innerIngredients[i]);
            if(ret)
        {
            return;
        }
        }
    }
    else if (!isInner && outerIngredients.length > 0)
    {
        for(var i = 0; i < outerIngredients.length; i++)
        {
            drawShape(gctx, outerIngredients[i]);
            fromMatt = true;
            ret = moveItem(mouse, outerIngredients[i]);
            if(ret)
        {
            return;
        }
        }
    }

    mySelect = null;

    clear(gctx);

    Invalidate();
}

function moveItem(mouse, item)
{
    if (inBounds(mouse, item))
    {
        mySelect   = item;
        offsetX    = mouse.x - mySelect.x;
        offsetY    = mouse.y - mySelect.y;
        mySelect.x = mouse.x - offsetX;
        mySelect.y = mouse.y - offsetY;
        
        isDrag = true;
        canvas.onmousemove = myMove; 
        Invalidate();
        clear(gctx);
        return true;
    }
    return false;
}

function inBounds(mouse, shape)
{
    return ((mouse.x >= shape.x) && (mouse.y >= shape.y) && 
        (mouse.x < shape.x + shape.w) && (mouse.y < shape.y + shape.h));
}

function Contains(mShape, oShape)
{
    if (oShape != null){
        if ((oShape.x >= mShape.x) && (oShape.x + oShape.w < mShape.x + mShape.w) &&
            (oShape.y >= mShape.y) && (oShape.y + oShape.h < mShape.y + mShape.h))
            {
                return true;
            }
        else 
        {
            return false;
        }
    }
}
function myMove(e)
{
    if (isDrag)
    {

        var mouse = getMouse(e);

        mySelect.x = mouse.x - offsetX;
        mySelect.y = mouse.y - offsetY;

        Invalidate();
    }
}

function findIngredient(ingredient)
{
    //console.log((mySelect.name === ingredient.name && mySelect.x == ingredient.x && mySelect.y == ingredient.y));
    return (mySelect.name === ingredient.name && mySelect.x == ingredient.x && mySelect.y == ingredient.y);
}

function myUp()
{
    isDrag = false;
    if(Contains(rollingMatt,mySelect)){
        if (isInner)
        {
            if (fromMatt)
            {
                fromMatt = false;
                mySelect = null;
                canvas.onmousemove = null;
    
                Invalidate();
                return;
            }
            innerIngredients.push(mySelect);
            delete boxes[boxes.findIndex(findIngredient)];
            boxes.sort();
            boxes.pop();
            console.log(innerIngredients);
        }
        else
        {
            outerIngredients.push(mySelect);
            delete boxes[boxes.findIndex(findIngredient)];
            boxes.sort();
            boxes.pop();
            
        }
    }
    if (mySelect != null){
    if (!Contains(rollingMatt,mySelect))
    {
        if (isInner)
        {
            boxes.push(mySelect);
            delete innerIngredients[innerIngredients.findIndex(findIngredient)];
            innerIngredients.sort();
            innerIngredients.pop();
            //console.log(innerIngredients);
        }
        else
        {
            boxes.push(mySelect);
            delete outerIngredients[outerIngredients.findIndex(findIngredient)];
            outerIngredients.sort();
            outerIngredients.pop();
        }
    }
    }
    mySelect = null;
    canvas.onmousemove = null;
    
    Invalidate();
}

function Invalidate()
{
    validCanvas = false;
}

function roll()
{
    this.nori = true;
    this.name = '';
    this.inner = [];
    this.outer = [];
}

function createRoll(nori, inner, outer)
{
    var roll   = new roll;
    roll.nori  = nori;
    roll.inner = inner;
    roll.outer = outer;
    roll.name  = getRollName(roll);
}



function getRollName(roll)
{

    for(var i = 0;i < roll.inner.length; i++)
    {

    }

    for(var i = 0;i < roll.outer.length; i++)
    {

    }
}

function Box() {
    this.type = shapeType.RECTANGLE;
    this.x = 0;
    this.y = 0;
    this.w = 1;
    this.h = 1;
    this.name = ingredients.RICE;
    this.Intcolor = '#444444';
    this.Outcolor = '#444444';
    this.fill = true;
    this.lineWidth = 1;
    this.image;
}


function addBox(type ,x, y, w, h, ingrType, fill, Intcolor, Outcolor, lineWidth = 4, hasImage = false, image = false,) 
{
    var rect= new Box;
    rect.type = type;
    rect.x = x;
    rect.y = y;
    rect.w = w;
    rect.h = h;
    rect.name = ingrType;
    rect.fill = fill;
    rect.Intcolor = Intcolor;
    rect.Outcolor = Outcolor;
    rect.lineWidth = lineWidth;
    if (hasImage)
    {
        rect.image = image;
    }
    boxes.push(rect);
    
}

function addCircle()
{

}
function clear(ctx)
{
    ctx.fillStyle = 'Gray';
    ctx.fillRect(0,0,600,400);
}
function draw() 
{
    if (validCanvas == false)
    {
        clear(context);

        //background
        drawShape(context,rollingMatt);//rolling matt

        //draw all shapes
        
        drawShapes(context, boxes);
        if (isInner && innerIngredients.length > 0)
        {
            drawShapes(context, innerIngredients);
        }
        else if (!isInner && outerIngredients.length > 0)
        {
            drawShapes(context, outerIngredients);
        }

        if (mySelect != null)
        {
            context.strokeStyle = mySelectColor;
            context.lineWidth = mySelectWidth;
            context.strokeRect(mySelect.x, mySelect.y, mySelect.w, mySelect.h);
        }

        //draw on top like stats

        validCanvas = true;
    }
}

function drawShapes(ctx, boxes)
{
    for (var i = 0; i < boxes.length; i++)
    {
        drawShape(ctx, boxes[i]);
    }
}

function drawShape(ctx, shape)
{
    switch(shape.type)
    {
        case shapeType.RECTANGLE:
            drawRectangle(ctx, shape.x, shape.y, shape.w, shape.h, 
                shape.fill, shape.Intcolor, shape.Outcolor, shape.lineWidth);
            break;
        case shapeType.CIRCLE:
            drawCircle(ctx,shape.x, shape.y, shape.radius, 
                shape.fill, shape.Intcolor, shape.Outcolor, shape.lineWidth);
            break;
        default:
            break;
    }
}

function drawRectangle(ctx, x, y, w, h, fill, Intcolor, Outcolor, lineWidth){
    ctx.strokeStyle = Outcolor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x,y,w,h);
    if (fill)
    {
        ctx.fillStyle = Intcolor;
        ctx.fillRect(x,y,w,h);
    }
    
}

function drawCircle(context ,x, y, radius, fillCircle, Intcolor, Outcolor, lineWidth) {
    context.strokeStyle = Outcolor;
    context.beginPath();

    context.arc(x, y, radius, 0, Math.PI * 2, false);
    
    if (fillCircle) {
        context.fillStyle = Intcolor;
        context.fill();
    } 
    context.lineWidth = lineWidth;
    context.stroke();
}