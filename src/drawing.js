var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var fps = 60;
var start = Date.now();
var frameDuration = 1000/fps;
var lag = 0;


var activeIngredients = [];
var innerIngredients = [];
var outerIngredients = [];
var isInner = true;
var fromMatt = false;


var madeRolls = [];
var moveablePlates = [];
var interval = 20;
var height;
var width;

//moving shapes around code from https://dzone.com/articles/making-and-moving-selectable

var isDrag = false;
var mx, my; //coordinates

var validCanvas = false;
var validLogic = true;

var mySelect;
var mySelect2;

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
    intcolor: '#444444',
    outcolor: '#444444',
    fill: true,
    lineWidth: 1,
    image: null,
    startTime: 0,
    isActive: false
}

const cuttingStation = {
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

const plateHolder = {
    type: shapeType.RECTANGLE,
    x: 300,
    y: 150,
    w: 100,
    h: 100,
    intcolor: '#FF0000',
    outcolor: '#8B0000',
    fill: true,
    lineWidth: 1,
    image: null,
    plate: Plate,
    startTime: 0,
    isActive: false,
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

    setInterval(update, interval); //draw every interval milliseconds

    canvas.onmousedown = myDown;
    canvas.onmouseup   = myUp;
    //canvas.ondblclick  = myDbkClick; // temp dbl click for making new boxes

    canvas.setAttribute("tabindex", 0);
    canvas.addEventListener('keydown', doKeyPress,true);
    // add custom init
    createPlate();

    
    
    
    // addBox(shapeType.RECTANGLE, 200, 200, 40, 40, ingredients.RICE, true, 'White', 'White');
    createRice(100,100);
    // addBox(shapeType.RECTANGLE, 25, 90, 25, 25, ingredients.AVOCADO,true, 'Yellow', 'Green');
    createAvocado(100, 200);
    // addBox(shapeType.RECTANGLE, 25, 125, 40, 25, ingredients.CRAB,true, 'white', 'Red',2);
    createCrab(100, 220);
    // addBox(shapeType.RECTANGLE, 25, 150, 40, 25, ingredients.CUCUMBER,true, 'Green', 'Green');
    createCucumber(100, 240);
    //console.log(activeIngredients);
    //gameLoop();
    
}

function gameLoop()
{
    requestAnimationFrame(gameLoop, canvas);

    var current = performance.now(), elapsed = current - start;
    start = current;

    //lag += elapsed;

    if (validLogic == false)
    {
        validLogic = true;
    }

    var lagOffset = lag / frameDuration;
    //render(lagOffset);
    //draw();
}

function update() //used to update logic of parts of game like getting customers based on tim and randomness
{
    //requestAnimationFrame(update, canvas);

    var current = performance.now();

    
    
    checkCutRoll();
    validLogic = true;
    
    draw();
}

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

function checkCutRoll()
{
    if (cuttingStation.isActive == true){
        let currentTime     = performance.now(),
            elapsedTime     = currentTime - cuttingStation.startTime,
            precentComplete = elapsedTime / (8000 / cuttingStation.cuttingSpeed) * 100;
            
        if (precentComplete >= 100)
        {
            cuttingStation.isActive = false;
            cuttingStation.startTime = 0;
            cuttingStation.item.isCut = true;
            cuttingStation.item.canEnterPlate = true;
            cuttingStation.item.canEnterCuttingStation = false;
            downSizeRoll(cuttingStation.item);
            madeRolls.push(cuttingStation.item);
            cuttingStation.item = null;
            console.log('Cut roll');
            console.log(madeRolls);
                
            Invalidate();
        }
    }
    
        //drawProgressBar(cuttingStation.x, cuttingStation.y, cuttingStation.w, 20, precentComplete); //TODO implement drawProgressBar
        //todo implement cutAnimation
}

function downSizeRoll(roll)
{
    roll.renderType.w = 30;
    roll.renderType.h = 30;
}

function cutRoll()
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
    Invalidate();
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

    if (e.keyCode == 67)
    {
        cutRoll();
        
    }


}

function myDown(e)
{
    var mouse = getMouse(e);
    clear(gctx);

    for (var i = 0; i < activeIngredients.length; i++)
    {
        drawShape(gctx, activeIngredients[i]);

        // var imageData = gctx.getImageData(mouse.x, mouse.y, 1, 1).data;
        // var index = (mouse.x + mouse.y * imageData.width) * 4;
        fromMatt = false;
        ret = moveItem(mouse, activeIngredients[i]);
        
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
            drawShape(gctx,madeRolls[i]);
            
            ret = moveItem(mouse, madeRolls[i]);
        
            if(ret)
            {
                return;
            }
        }
    }

    if (moveablePlates.length > 0)
    {
        for(let i = 0; i < moveablePlates.length; i++)
        {
            drawShape(gctx,moveablePlates[i]);
            
            ret = moveCircle(mouse, moveablePlates[i]);
            
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
    if (inBounds(mouse, item.renderType))
    {
        mySelect   = item;
        offsetX    = mouse.x - mySelect.renderType.x;
        offsetY    = mouse.y - mySelect.renderType.y;
        mySelect.renderType.x = mouse.x - offsetX;
        mySelect.renderType.y = mouse.y - offsetY;
        mySelect.renderType.oldX = mouse.x - offsetX;
        mySelect.renderType.oldY = mouse.y - offsetY;
        
        isDrag = true;
        canvas.onmousemove = myMove; 
        Invalidate();
        clear(gctx);
        return true;
    }
    return false;
}

function moveCircle(mouse, item)
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
    if ( dx > circle.radius) return false;
    dy = Math.abs(y-circle.y);
    if ( dy > circle.radius) return false;
    if ( dx + dy <= circle.radius) return true;
    return (dx*dx + dy*dy <= circle.radius*circle.radius);
}

function containsRoll(roll, plate)
{   
    let box = roll.renderType;
    if (!inCircle(box.x, box.y, plate.renderType))                 return false;
    if (!inCircle(box.x,box.y + box.w, plate.renderType))          return false;
    if (!inCircle(box.x + box.w, box.y, plate.renderType))         return false;
    if (!inCircle(box.x + box.w, box.y + box.h, plate.renderType)) return false;
    
    return true;
}
function myMove(e)
{
    if (isDrag)
    {

        var mouse = getMouse(e);
        if (mySelect2 != null)
        {
            correctRollOnPlate(mySelect, mySelect2);
        }
        mySelect.renderType.x = mouse.x - offsetX;
        mySelect.renderType.y = mouse.y - offsetY;

        Invalidate();
    }
}

function correctRollOnPlate(plate, roll)
{
    roll.renderType.x = plate.renderType.x - roll.renderType.w /2;
    roll.renderType.y = plate.renderType.y - roll.renderType.h / 2;
}

function findIngredient(ingredient)
{
    //console.log((mySelect.name === ingredient.name && mySelect.x == ingredient.x && mySelect.y == ingredient.y));
    return (mySelect.name === ingredient.name && mySelect.renderType.x == ingredient.renderType.x && mySelect.renderType.y == ingredient.renderType.y);
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

function checkCuttingStation()
{
    if (mySelect != null){
        if (mySelect.canEnterCuttingStation == false)
        {
            Invalidate();
            return;
        }
        if (mySelect.isCut == true)
        {
            Invalidate();
            return;
        }
        if (Contains(cuttingStation,mySelect.renderType))
        {
            cuttingStation.item = mySelect;
            console.log(cuttingStation.item);
            
            delete madeRolls[madeRolls.findIndex(findRoll)];
            madeRolls.sort();
            madeRolls.pop();
            }
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

    return (mySelect.renderType.x == box.renderType.x && mySelect.renderType.y == box.renderType.y);
}

function checkMatt()
{   
    if (mySelect.canEnterMatt == false)
    {
        Invalidate();
        return;
    }
    if(Contains(rollingMatt,mySelect.renderType)){
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
            delete activeIngredients[activeIngredients.findIndex(findIngredient)];
            activeIngredients.sort();
            activeIngredients.pop();
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
            delete activeIngredients[activeIngredients.findIndex(findIngredient)];
            activeIngredients.sort();
            activeIngredients.pop();
            console.log(outerIngredients);
            
        }
    }
    if (mySelect != null){
        if (!Contains(rollingMatt,mySelect))
        {
            if (isInner && fromMatt)
            {
                activeIngredients.push(mySelect);
                delete innerIngredients[innerIngredients.findIndex(findIngredient)];
                innerIngredients.sort();
                innerIngredients.pop();
                //console.log(innerIngredients);
            }
            else if (!isInner && fromMatt)
            {
                activeIngredients.push(mySelect);
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

function InvalidateLogic()
{
    validLogic = false;
}

function Plate()
{
    this.roll = null;
    this.renderType = Circle;
    this.canEnterMatt = false;
    this.canEnterCuttingStation = false;
    this.canEnterPlate = false;
}

function createPlate()
{
    var plate = new Plate;
    plate.renderType = createCircle(plateHolder.x + plateHolder.w /2, plateHolder.y + plateHolder.h /2, 40, true, 'white', 'gold', 3);
    plateHolder.plate = plate; 
}

function addRollToPlate()
{
    if (mySelect != null)
    {
        if (mySelect.canEnterPlate == true)
        {
            if (containsRoll(mySelect,plateHolder.plate))
            {
                correctRollOnPlate(plateHolder.plate, mySelect);
                plateHolder.plate.roll = madeRolls[madeRolls.findIndex(findRoll)];
                delete madeRolls[madeRolls.findIndex(findRoll)];
                madeRolls.sort();
                madeRolls.pop();
                
                moveablePlates.push(plateHolder.plate);
                console.log(moveablePlates);
                
            }
        }
    }
}

function Roll()
{
    this.nori = true;
    this.name = '';
    this.inner = [];
    this.outer = [];
    this.renderType = Box;
    this.canEnterMatt = false;
    this.canEnterCuttingStation = true;
    this.canEnterPlate = false;
    this.isCut = false;
}

function Ingredient()
{
    this.name = ingredients;
    this.renderType = null;
    this.canEnterMatt = true;
    this.canEnterCuttingStation = false;
    this.canEnterPlate = false;
}

function createIngredient(name, renderType)
{
    var ingredient = new Ingredient();
    ingredient.name = name;
    ingredient.renderType = renderType;
    return ingredient;
}

function createRice(x,y)
{
    var box = createBox(x, y, 75, 75, true, 'white', 'white');
    var rice = createIngredient(ingredients.RICE, box);
    activeIngredients.push(rice);
}
function createCucumber(x,y)
{
    var box = createBox(x, y, 50, 10, true, 'green', 'green');
    var cucumber = createIngredient(ingredients.CUCUMBER, box);
    activeIngredients.push(cucumber);
}
function createCrab(x,y)
{
    var box = createBox(x, y, 50, 20, true, 'white', 'red');
    var crab = createIngredient(ingredients.CRAB, box);
    activeIngredients.push(crab);
}
function createAvocado(x,y)
{
    var box = createBox(x, y, 50, 20, true, 'yellow', 'green');
    var avocado = createIngredient(ingredients.AVOCADO, box);
    activeIngredients.push(avocado);
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
    roll.renderType = itemBox;
    return roll;
}

function assembleRoll()
{
    //later this will have timer to completion of roll
    let box1 = createBox(rollingMatt.x, rollingMatt.y, rollingMatt.w, rollingMatt.h / 4, 
        true, 'Green', 'Green',3,false,null,false);
    
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
    this.oldX   = 0;
    this.oldY   = 0;
    //this.name = ingredients.RICE;
    this.intcolor = '#444444';
    this.outcolor = '#444444';
    this.fill = true;
    this.lineWidth = 1;
    this.image;
}

function  Circle()
{
    this.type = shapeType.CIRCLE;
    this.radius = 1;
    this.x      = 0;
    this.y      = 0;
    this.oldX   = 0;
    this.oldY   = 0;
    this.intColor = '#444444';
    this.outColor = '#444444';
    this.fill = true;
    this.lineWidth = 1;
    this.image;
}

function createCircle(x, y, radius, fill, intColor, outColor, lineWidth = 1)
{
    var circle = new Circle;
    
    circle.radius    = radius;
    circle.x         = x;
    circle.y         = y;
    circle.intColor  = intColor;
    circle.outColor  = outColor;
    circle.fill      = fill;
    circle.lineWidth = lineWidth;
    return circle;
}

function createBox(x, y, w, h, fill, intcolor, outcolor, able = true, lineWidth = 4, hasImage = false, image = false)
{
    var rect= new Box;
    rect.type = shapeType.RECTANGLE;
    rect.x = x;
    rect.y = y;
    rect.oldX = x;
    rect.oldY = y;
    rect.w = w;
    rect.h = h;
    rect.fill = fill;
    rect.intcolor = intcolor;
    rect.outcolor = outcolor;
    rect.lineWidth = lineWidth;
    rect.canEnterMatt = able;
    if (hasImage)
    {
        rect.image = image;
    }
    return rect;
}
//to be removed
// function addBox(type ,x, y, w, h, ingrType, fill, intcolor, outcolor, lineWidth = 4, hasImage = false, image = false) 
// {
//     var rect= new Box;
//     rect.type = type;
//     rect.x = x;
//     rect.y = y;
//     rect.w = w;
//     rect.h = h;
//     rect.fill = fill;
//     rect.Intcolor = intcolor;
//     rect.Outcolor = outcolor;
//     rect.lineWidth = lineWidth;
//     if (hasImage)
//     {
//         rect.image = image;
//     }
//     boxes.push(rect);
// }

function drawTextBox(ctx, x, y, w, h, text, font = "10px Verdana",  textColor = 'Black', intColor = '#add8e6' , outColor = 'Gray')
{
    drawRoundRect(ctx, x, y, w, h, 5, true, true, intColor, outColor);
    ctx.font = font;
    ctx.textAlign = "center";
    ctx.fillStyle = textColor;
    ctx.fillText(text,x+ w/2,y+h/2);
    Invalidate();
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
        drawShape(context, rollingMatt); //rollingMatt
        drawShape(context, cuttingStation);
        drawShape(context, plateHolder);
        context.fillStyle = 'Red';
        context.textAlign = "left";
        context.font = "30px Arial";
        if (isInner){
            context.fillText('Inner',300,300);
        }
        else
        {
            context.fillText('Outer',300,300);
        }
        

        //draw all shapes
        if (plateHolder.plate != null)
        {
            //console.log(plateHolder.plate.renderType);
            
            drawShape(context, plateHolder.plate.renderType);
        }
        if (cuttingStation.item != null)
        {
            if (cuttingStation.isActive)
            {
                drawTextBox(context, cuttingStation.x, cuttingStation.y - 40, cuttingStation.w, 40, "Cutting!");
            }
            else
            {
                drawTextBox(context, cuttingStation.x, cuttingStation.y - 40, cuttingStation.w, 40, "Ready to cut! Press C key");
            }
            drawShape(context, cuttingStation.item.renderType);
            Invalidate();
        }
        if(madeRolls.length > 0)
        {
            drawRolls(context, madeRolls);
        }

        drawShapes(context, activeIngredients);

        if (isInner && innerIngredients.length > 0)
        {
            drawShapes(context, innerIngredients);
        }
        else if (!isInner && outerIngredients.length > 0)
        {
            drawShapes(context, outerIngredients);
        }

        if (moveablePlates.length > 0)
        {
            drawPlates(context,moveablePlates);

        }
        

        if (mySelect != null)
        {
            context.strokeStyle = mySelectColor;
            context.lineWidth = mySelectWidth;
            context.strokeRect(mySelect.renderType.x, mySelect.renderType.y, mySelect.renderType.w, mySelect.renderType.h);
        }

        //draw on top like stats

        validCanvas = true;
    }
}

function drawShapes(ctx, shapes)
{
    for (var i = 0; i < shapes.length; i++)
    {   
        
        drawShape(ctx, shapes[i].renderType);
    }
}

function drawPlates(ctx, plates)
{
    for (var i = 0; i < plates.length; i++)
    {
        drawShape(ctx, plates[i].renderType);
        drawShape(ctx, plates[i].roll.renderType);
    }
}

function drawShape(ctx, shape)
{
    
    switch(shape.type)
    {
        case shapeType.RECTANGLE:
            drawRectangle(ctx, shape.x, shape.y, shape.w, shape.h, 
                shape.fill, shape.intcolor, shape.outcolor, shape.lineWidth);
            break;
        case shapeType.CIRCLE:
            drawCircle(ctx,shape.x, shape.y, shape.radius, 
                shape.fill, shape.intColor, shape.outColor, shape.lineWidth);
            break;
        default:
            break;
    }
}

function drawRolls(ctx, rolls)
{
    for (var i = 0; i < rolls.length; i++)
    {
        drawShape(ctx, rolls[i].renderType);
    }
}

function drawRectangle(ctx, x, y, w, h, fill, intcolor, outcolor, lineWidth){
    ctx.strokeStyle = outcolor;
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(x,y,w,h);
    if (fill)
    {
        ctx.fillStyle = intcolor;
        ctx.fillRect(x,y,w,h);
    }
    
}

function drawCircle(context ,x, y, radius, fillCircle, intcolor, outcolor, lineWidth) {
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