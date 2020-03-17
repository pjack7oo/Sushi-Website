import * as shapes from '../utils/shapes.js';
import * as drawing from '../utils/drawing.js';
import * as ingredientBox from './ingredientbox.js';

let tableImage = new Image();
tableImage.src = "./game/images/wood-grain-texture.jpg";
let counterImage = new Image();
counterImage.src = './game/images/TexturesCom_Marble.png'

const table = {
    type: shapes.shapeType.IMAGE,
    x: 0,
    y: 200,
    w: 600,
    h: 300,
    image: tableImage
}

export function drawTable(context) {
    drawing.drawShape(context, table);
    let p1 = new shapes.Point(0 , 200),
        p2 = new shapes.Point(50, 200),
        p3 = new shapes.Point(0 , 300);
    let leftTriangle = new shapes.Triangle(p1, p2, p3, counterImage);
    p1 = new shapes.Point(550, 200),
    p2 = new shapes.Point(600, 200),
    p3 = new shapes.Point(600 ,300);
    let rightTriangle = new shapes.Triangle(p1, p2, p3, counterImage);
    p1 = new shapes.Point(26, 250),
    p2 = new shapes.Point(0, 300),
    p3 = new shapes.Point(0 ,310);
    let p4 = new shapes.Point(30, 260);
    drawing.drawAnyQuad(p1, p2, p3, p4, true, true, "black", "black");
    p1 = new shapes.Point(574, 250),
    p2 = new shapes.Point(600, 300),
    p3 = new shapes.Point(600 ,310);
    p4 = new shapes.Point(570, 260);
    drawing.drawAnyQuad(p1, p2, p3, p4, true, true, "black", "black");
    
    drawing.drawRectangle(context, 0, 250, 600,10,true,"black", "black");
    drawing.drawTriangleImage(leftTriangle, 90);  
    drawing.drawTriangleImage(rightTriangle, 90);  
    //context.drawImage(counterImage, 0,120, 600,30);
    drawing.drawRectImage(0,200, 600, 50, counterImage, true, 600, 600);
    
    
    //drawing.drawTriangle(context, p1, p2, p3, true, true, 'Blue', 'Blue', 2);
    //context.drawImage(image,)
}
