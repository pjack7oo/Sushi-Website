
export const shapeType = {
    RECTANGLE: 'Rectangle',
    CIRCLE   : 'Circle',
    IMAGE    : 'Image'
}

export function Box() {
    this.type = shapeType.RECTANGLE;
    this.x = 0;
    this.y = 0;
    this.w = 1;
    this.h = 1;
    this.intcolor = '#444444';
    this.outcolor = '#444444';
    this.fill = true;
    this.lineWidth = 1;
    this.image;
}

export function  Circle()
{
    this.type = shapeType.CIRCLE;
    this.radius = 1;
    this.x      = 0;
    this.y      = 0;
    this.intColor = '#444444';
    this.outColor = '#444444';
    this.fill = true;
    this.lineWidth = 1;
    this.image;
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

export function createBox(x, y, w, h, fill, intcolor, outcolor, able = true, lineWidth = 4, hasImage = false, image = false)
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