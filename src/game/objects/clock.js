import * as drawing from '../utils/drawing.js';

var clockProgress = 0;

var colors = ["red","OrangeRed","OrangeRed","DarkOrange","Orange","Gold","yellow","GreenYellow","LawnGreen","Lime"];
var oldnum = 0;
var i = 9;

export function drawClock (context) {
    var x      = 545,
        y      = 55,
        radius = 50;
    drawFace(context, x, y, radius);
    drawBackground(context, x, y, clockProgress/100, radius);
    drawNumbers(context, x, y, radius);
    //console.log(clockProgress/100);
    
    drawHand(context, x, y, clockProgress/100, radius*0.9, radius*0.07, radius);
    
}

export function updateClockProgress(progress) {
    clockProgress = progress;
}

export function setTime (maxTime) {
    clockMaxTime = maxTime;
}

export function resetClock () {
    oldnum = 0;
    i = 9;
}

function drawFace (context, x, y, radius) {
    
    
    // context.beginPath();

    // context.arc(x, y, 15, 0, 2*Math.PI);
    // context.fillStyle = 'White';
    // context.fill();

    var grad = context.createRadialGradient(x, y, radius*0.95, x, y, radius*1.05);
    grad.addColorStop(0, '#333');
    grad.addColorStop(0.5, 'white');
    grad.addColorStop(1, '#333');

    drawing.drawCircle(context, x, y, radius, true,'White', grad, 10);
    drawing.drawCircle(context, x, y, radius*0.1, true, '#333', '#333', 1);
}

function drawNumbers(context, x, y, radius) {
    var angle,
        num;
    
    context.fillStyle = 'Black';
    context.font = radius * 0.15 + "px arial";
    context.textBaseline = 'middle';
    context.textAlign    = 'center';
    
    for (num = 1; num < 13; num++) {
        angle = num * Math.PI / 6;
        context.translate(x, y);
        context.rotate(angle);
        context.translate(0, -radius * 0.80);
        context.rotate(-angle);
        context.fillText(num.toString(), 0, 0);
        context.rotate(angle);
        context.translate(0,  +radius * 0.80);
        context.rotate(-angle);
        context.translate(-x, -y);
    }
}

function drawHand(context, x, y, pos, length, width, radius) {
    
    pos =  pos  *360;
    pos= pos*Math.PI / 180;

    
    //pos -=1.5*Math.PI;
    //pos =  pos  *360;
    
    //pos = 45*Math.PI / 180;
    
    
    context.beginPath();
    context.translate(x,y);
    context.lineWidth = width;
    context.lineCap = 'round';
    context.moveTo(0,0);
    context.rotate(pos);
    context.lineTo(0,-length);
    context.stroke();
    context.rotate(-pos);
    context.translate(-x, -y);
    context.closePath();
}

function drawBackground (context, x, y, pos, radius) {
    

    
    
    var grad = context.createRadialGradient(x,y,radius, x,y, radius * 2);
    grad.addColorStop(0,'White');
    grad.addColorStop(.5, colors[i]);
    console.log(pos*100- oldnum);
    
    if (pos*100-oldnum > 10) {
        oldnum = pos*100;
        grad.addColorStop(.5, colors[i--]);
    }
    pos =  pos  *360;
    pos= 1.5*Math.PI+pos*Math.PI / 180;
    context.beginPath();
    context.translate(x,y);
    
    context.arc(0,0, radius*0.9,1.5*Math.PI , pos);
    context.lineTo(0,0);
    context.fillStyle = grad;
    context.fill();

    context.translate(-x, -y);
    context.closePath();
}