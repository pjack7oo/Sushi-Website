var canvas = document.getElementById('canvas');
/**@type {CanvasRenderingContext2D} */
var context = canvas.getContext('2d');

var boxes = [];


context.fillRect(0,0,600,400);
drawCircle(300,200,100,true,'Blue','Gray');
drawRectangle(200,300,50,50,true,'Blue','Green');
function Box() {
    this.x = 0;
    this.y = 0;
    this.w = 1;
    this.h = 1;
    this.Intcolor = '#444444';
    this.Outcolor = '#444444';
    this.fill = true;
    this.image;
}

function addBox(x, y, w, h, fill, Intcolor, Outcolor, hasImage, image) {
    var rect= new Box;
    rect.x = x;
    rect.y = y;
    rect.w = w;
    rect.h = h;
    rect.fill = fill;
    rect.Intcolor = Intcolor;
    rect.Outcolor = Outcolor;
    if (hasImage)
    {
        rect.image = image;
    }
    boxes.push(rect);
    context
}
function drawRectangle(x, y, w, h, fill, Intcolor, Outcolor){
    context.strokeStyle = Outcolor;
    context.strokeRect(x,y,w,h);
    if (fill)
    {
        context.fillStyle = Intcolor;
        context.fillRect(x,y,w,h);
    }
    context
}

function drawCircle(x, y, radius, fillCircle, Intcolor, Outcolor) {
    context.strokeStyle = Outcolor;
    context.beginPath();

    context.arc(x, y, radius, 0, Math.PI * 2, false);
    
    if (fillCircle) {
        context.fillStyle = Intcolor;
        context.fill();
    } 
    context.lineWidth = 5;
    context.stroke();
}