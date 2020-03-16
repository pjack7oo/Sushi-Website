
export const shapeType = {
    RECTANGLE: 'Rectangle',
    CIRCLE   : 'Circle',
    IMAGE    : 'Image',
    ROUNDRECT: 'RoundRect',
    ROLL     : 'Roll'
}

export class Box {
    constructor() {
        this.type = shapeType.RECTANGLE;
        this.x = 0;
        this.y = 0;
        this.w = 1;
        this.h = 1;
        this.intColor = '#444444';
        this.outColor = '#444444';
        this.fill = true;
        this.lineWidth = 1;
        this.image;
    }
}

export class RoundRect {
    constructor(x, y, w, h, radius, intColor, outColor, fill, stroke) {
        this.type = shapeType.ROUNDRECT;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.radius = radius;
        this.intColor = intColor;
        this.outColor = outColor;
        this.fill = fill;
        this.stroke = stroke
        this.lineWidth = 1;
        this.image;
    }
}

export class Circle {
    constructor() {
        this.type = shapeType.CIRCLE;
        this.radius = 1;
        this.x = 0;
        this.y = 0;
        this.intColor = '#444444';
        this.outColor = '#444444';
        this.fill = true;
        this.lineWidth = 1;
        this.image;
    }
}

export class Triangle {
    constructor(p1, p2, p3, image = null) {
        this.type = shapeType.TRIANGLE;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.intColor = '#444444';
        this.outColor = '#444444';
        this.fill = true;
        this.lineWidth = 1;
        this.image = image;
    }
}

export class Quad {
    constructor(p1, p2, p3, p4, image = null) {
        this.type = shapeType.TRIANGLE;
        this.p1 = p1;
        this.p2 = p2;
        this.p3 = p3;
        this.p4 = p4;
        this.intColor = intColor;
        this.outColor = outColor;
        this.fill = true;
        this.lineWidth = 1;
        this.image = image;
    }
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Button {
    constructor() {
        this.type = shapeType.RECTANGLE;
        this.x = 0;
        this.y = 0;
        this.w = 100;
        this.h = 50;
        this.radius = 10;
        this.text = '';
        this.textColor = 'Black';
        this.font = '25px Arial';
        this.fontLoc = 'Center';
        this.intColor = 'Red';
        this.outColor = 'Gray';
        this.active = false;
        this.activeColor = "Green";
        this.fill = true;
        this.lineWidth = 1;
        this.callBack = null;
        this.name = '';
    }
}

export function createButton(x, y, w, h, text, fill, lineWidth, callBack, name, type  = undefined, fontLoc = undefined, font = "25px Arial", intColor = 'Red', outColor = 'Gray')
{

    var button = new Button;
    if (type != undefined) {
        button.type = type;
    }
    if (fontLoc != undefined) {
        button.fontLoc = fontLoc;
    }
    button.x         = x;
    button.y         = y;
    button.w         = w;
    button.h         = h;
    button.text      = text;
    button.font      = font;
    button.intColor  = intColor;
    button.outColor  = outColor;
    button.fill      = fill;
    button.lineWidth = lineWidth;
    button.callBack  = callBack;
    button.name      = name;
    
    return button;
}


export function createCircle(x, y, radius, fill, intColor, outColor, lineWidth = 1)
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

export function createBox(x, y, w, h, fill, intColor, outColor, able = true, lineWidth = 4, hasImage = false, image = false)
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
    rect.intColor = intColor;
    rect.outColor = outColor;
    rect.lineWidth = lineWidth;
    rect.canEnterMatt = able;
    if (hasImage)
    {
        rect.image = image;
    }
    return rect;
}

export function Contains(mShape, oShape)
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

export function inCircle(x, y, circle)
{
    let dx = Math.abs(x-circle.x);
    if ( dx > circle.radius) return false;
    let dy = Math.abs(y-circle.y);
    if ( dy > circle.radius) return false;
    if ( dx + dy <= circle.radius) return true;
    return (dx*dx + dy*dy <= circle.radius*circle.radius);
}

export function containsRoll(roll, plate)
{   
    let box = roll.renderType;
    if (!inCircle(box.x, box.y, plate.renderType))                 return false;
    if (!inCircle(box.x,box.y + box.w, plate.renderType))          return false;
    if (!inCircle(box.x + box.w, box.y, plate.renderType))         return false;
    if (!inCircle(box.x + box.w, box.y + box.h, plate.renderType)) return false;
    
    return true;
}

export function inRect(x, y, Rectangle)
{
    if ((x >= Rectangle.x) && (y >= Rectangle.y) &&
        (x <= Rectangle.x + Rectangle.w  && (y <= Rectangle.y + Rectangle.h)))
        {
            return true;
        }
        else 
        {
            return false;
        }
}
