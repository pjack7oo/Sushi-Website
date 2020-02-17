var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var boxes = [];

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

var offsetx, offsety;
var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;

context.fillStyle = 'Gray';
context.fillRect(0,0,600,400);
init();

const shape = {
    RECTANGLE,
    CIRCLE
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

    // add custom init

    addBox(200, 200, 40, 40, true, 'Orange', 'Orange');

    addBox(25, 90, 25, 25, true, 'Blue', 'Green');

}

function Invalidate()
{
    validCanvas = false;
}

function Box() {
    this.type = shape.RECTANGLE;
    this.x = 0;
    this.y = 0;
    this.w = 1;
    this.h = 1;
    this.radius = 1;
    this.Intcolor = '#444444';
    this.Outcolor = '#444444';
    this.fill = true;
    this.lineWidth = 1;
    this.image;
}


function addBox(type ,x, y, w, h, fill, Intcolor, Outcolor, lineWidth = 4, hasImage = false, image = false,) 
{
    var rect= new Box;
    rect.type = type;
    rect.x = x;
    rect.y = y;
    rect.w = w;
    rect.h = h;
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
        clear(ctx);

        //background

        //draw all boxes
        drawShapes(boxes);

    }
}

function drawShapes(boxes)
{
    for (var i = 0; i < boxes.length; i++)
    {
        drawShape(context, boxes[i]);
    }
}

function drawShape(ctx, shape)
{
    switch(shape)
    {
        case shape.type.RECTANGLE:
            drawRectangle(ctx, shape.x, shape.y, shape.w, shape.h, 
                shape.fill, shape.Intcolor, shape.Outcolor, shape.lineWidth);
        case shape.type.CIRCLE:
            
    }
}

function drawRectangle(ctx ,x, y, w, h, fill, Intcolor, Outcolor, lineWidth){
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