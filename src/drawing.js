var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var boxes = [];
var innerIngredients = [];
var outerIngredients = [];
var isInner = true;
var fromMatt = false;

var cuttingStationItem = null;
var madeRolls = [];
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

const cuttingStation = {
    type: shapeType.RECTANGLE,
    x: 410,
    y: 300,
    w: 150,
    h: 100,
    Intcolor: '#C19A6B',
    Outcolor: '#C19A6B',
    fill: true,
    lineWidth: 1,
    image: null
}

const CaliforniaRoll = {
    name: 'California Roll',
    inner: [ingredients.AVOCADO, ingredients.CRAB, ingredients.CUCUMBER],
    outer: [ingredients.RICE],
    nori: true
}
const AlaskaRoll = {
    name: 'Alaska Roll',
    inner: [ingredients.AVOCADO, ingredients.CUCUMBER],
    outer: [ingredients.RICE],
    nori: true
}

var rollList = [CaliforniaRoll, AlaskaRoll];

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

    addBox(shapeType.RECTANGLE, 25, 90, 25, 25, ingredients.AVOCADO,true, 'Yellow', 'Green');

    addBox(shapeType.RECTANGLE, 25, 125, 40, 25, ingredients.CRAB,true, 'white', 'Red',2);
    
    addBox(shapeType.RECTANGLE, 25, 150, 40, 25, ingredients.CUCUMBER,true, 'Green', 'Green');
    //console.log(boxes.length);

}

function containsIngredients()
{
    if(innerIngredients.length > 0 || outerIngredients > 0)
    {
        return true;
    }
    else
    {
        return false;
    }
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

    if (madeRolls.length > 0)
    {
        for(let i = 0; i < madeRolls.length; i++)
        {
            drawShape(gctx,madeRolls[i].box);
            console.log("test");
            
            ret = moveItem(mouse, madeRolls[i].box);
        
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

function inCircle(x, y, circle)
{
    dx = Math.abs(x-circle.x);
    dy = Math.abs(y-circle.y);
    return (dx*dx + dy*dy <= circle.radius*circle.radius);
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
    if (mySelect != null)
    {
        checkMatt();
        checkCuttingStation();
    }
    mySelect = null;
    canvas.onmousemove = null;
    
    Invalidate();
}

function checkCuttingStation()
{
    if (mySelect.name == null)
    {
        console.log("tre");
        
        cuttingStationItem = getRoll(mySelect);
        delete madeRolls[madeRolls.findIndex(findRoll)];
        madeRolls.sort();
        madeRolls.pop();
    }
}
function getRoll(box)
{
    for (let i = 0; i <madeRolls.length;i++)
    {
        if (box.x == madeRolls[i].box.x && box.y == madeRolls[i].box.y)
        {
            return madeRolls[i];
        }
    }
    return null;
}
function findRoll(box)
{
    return (mySelect.x == box.x && mySelect.y == box.y);
}

function checkMatt()
{   
    if (mySelect.canEnterMatt == false)
    {
        Invalidate();
        return;
    }
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
            if (fromMatt)
            {
                fromMatt = false;
                mySelect = null;
                canvas.onmousemove = null;
    
                Invalidate();
                return;
            }
            outerIngredients.push(mySelect);
            delete boxes[boxes.findIndex(findIngredient)];
            boxes.sort();
            boxes.pop();
            console.log(outerIngredients);
            
        }
    }
    if (mySelect != null){
        if (!Contains(rollingMatt,mySelect))
        {
            if (isInner && fromMatt)
            {
                boxes.push(mySelect);
                delete innerIngredients[innerIngredients.findIndex(findIngredient)];
                innerIngredients.sort();
                innerIngredients.pop();
                //console.log(innerIngredients);
            }
            else if (!isInner && fromMatt)
            {
                boxes.push(mySelect);
                delete outerIngredients[outerIngredients.findIndex(findIngredient)];
                outerIngredients.sort();
                outerIngredients.pop();
            }
        }
    }
}

function Invalidate()
{
    validCanvas = false;
}

function Plate()
{
    this.roll = null;
    this.circle = null;
}

function Roll()
{
    this.nori = true;
    this.name = '';
    this.inner = [];
    this.outer = [];
    this.box = new Box;
}

function createRoll(nori, inner, outer, itemBox)
{
    var roll   = new Roll;
    roll.nori  = nori;
    roll.inner = inner;
    roll.outer = outer;
    roll.inner.sort();
    roll.outer.sort();
    roll.name  = getRollName(roll);
    roll.box = itemBox;
    return roll;
}

function assembleRoll()
{
    //later this will have timer to completion of roll
    let box1 = createBox(shapeType.RECTANGLE,rollingMatt.x, rollingMatt.y, rollingMatt.w, rollingMatt.h / 4, 
        null, true, 'Green', 'Green',3,false,null,false);
    
    var inner = [];
    var outer = [];
    for (var i = 0; i < innerIngredients.length;i++)
    {
        inner.push(innerIngredients[i].name);
    }
    for (var i = 0; i < outerIngredients.length;i++)
    {
        outer.push(outerIngredients[i].name);
    }  
    var roll = createRoll(true,inner, outer,box1);
    innerIngredients.splice(0, innerIngredients.length);
    outerIngredients.splice(0,outerIngredients.length); 
    madeRolls.push(roll);
    console.log(madeRolls);
    Invalidate();
}



function getRollName(roll, acceptedRolls = [])
{
    var rollsToDel = [];
    if (acceptedRolls.length == 0)
    {
        for (let i = 0; i <rollList.length;i++)
        {
            if (((roll.inner.length + roll.outer.length) === (rollList[i].inner.length + rollList[i].outer.length)))
            {
                acceptedRolls.push(i);
                console.log(i);
            }
        }
        if (acceptedRolls.length == 0)
        {
            return 'Unknown Roll'
        }
        getRollName(roll, acceptedRolls);
    }
    else
    {
        console.log(acceptedRolls.length);
        for (let i = 0; i < acceptedRolls.length; i++)
        {
            for(let k = 0; k < roll.inner.length; k++)
            {
                if (roll.inner[k] != rollList[acceptedRolls[i]].inner[k])
                {
                    rollsToDel.push(i);
                    break;
                }
            }
            
            if (roll.outer.length > rollList[acceptedRolls[i]].outer.length)
                {
                    rollsToDel.push(i);
                    continue;
                }
            for(let k = 0; k < roll.outer.length; k++)
            {
                
                if (roll.outer[k] != rollList[acceptedRolls[i]].outer[k])
                {
                    rollsToDel.push(i);
                    break;
                }
            }
        }
    }
    eliminateDuplicates(rollsToDel);
    for (let i = 0; i < rollsToDel.length; i++)
    {
        delete acceptedRolls[rollsToDel[i]];
    }
    var cleanArray = acceptedRolls.filter(function() {return true});
    if (cleanArray.length == 0)
    {
        return 'Unknown Roll'
    }
    else if (cleanArray.length == 1)
    {
        return rollList[cleanArray[0]].name;
    }
    else
    {
        getRollName(roll, cleanArray);
    }
}

function eliminateDuplicates(arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};
  
    for (i = 0; i < len; i++) {
      obj[arr[i]] = 0;
    }
    for (i in obj) {
      out.push(i);
    }
    return out;
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
    this.canEnterMatt = true;
}

function  Circle()
{
    this.type = shapeType.CIRCLE;
    this.radius = 1;
    this.x = 0;
    this.y = 0;
    this.Intcolor = '#444444';
    this.Outcolor = '#444444';
    this.fill = true;
    this.lineWidth = 1;
    this.image;
}

function addCircle(x, y, radius, fill, intColor, outColor, lineWidth = 1)
{
    var circle = new Circle;
    circle.radius    = radius;
    circle.x         = x;
    circle.y         = y;
    circle.Intcolor  = intColor;
    circle.outColor  = outColor;
    circle.fill      = fill;
    circle.lineWidth = lineWidth;
    return circle;
}

function createBox(type ,x, y, w, h, ingrType, fill, Intcolor, Outcolor, lineWidth = 4, hasImage = false, image = false, able = true)
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
    rect.canEnterMatt = able;
    if (hasImage)
    {
        rect.image = image;
    }
    return rect;
}

function addBox(type ,x, y, w, h, ingrType, fill, Intcolor, Outcolor, lineWidth = 4, hasImage = false, image = false) 
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
        drawShape(context,rollingMatt); //rollingMatt
        drawShape(context,cuttingStation);
        context.fillStyle = 'Red';
        context.font = "30px Arial";
        if (isInner){
            context.fillText('Inner',300,300);
        }
        else
        {
            context.fillText('Outer',300,300);
        }
        

        //draw all shapes
        if (cuttingStationItem != null)
        {
            drawShape(context,cuttingStationItem.box);
        }
        if(madeRolls.length > 0)
        {
            drawRolls(context, madeRolls);
        }
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

function drawRolls(ctx, rolls)
{
    for (var i = 0; i < rolls.length; i++)
    {
        drawShape(ctx, rolls[i].box);
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