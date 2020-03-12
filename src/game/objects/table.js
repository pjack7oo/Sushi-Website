import * as shapes from '../utils/shapes.js';
import * as drawing from '../utils/drawing.js';

let tableImage = new Image();
tableImage.src = "./game/images/wood-grain-texture.jpg";
let counterImage = new Image();
counterImage.src = './game/images/TexturesCom_Marble.png'

const table = {
    type: shapes.shapeType.IMAGE,
    x: 0,
    y: 140,
    w: 600,
    h: 260,
    image: tableImage
}

export function drawTable(context) {
    drawing.drawShape(context, table);
    let p1 = new shapes.Point(0 , 130),
        p2 = new shapes.Point(50, 130),
        p3 = new shapes.Point(0 , 200);
    let leftTriangle = new shapes.Triangle(p1, p2, p3, counterImage);

    drawing.drawTriangleImage(leftTriangle, 90);  
    //context.drawImage(counterImage, 0,120, 600,30);
    drawing.drawRectImage(0,120, 600, 30, counterImage, true, 600, 600);
    
    //drawing.drawTriangle(context, p1, p2, p3, true, true, 'Blue', 'Blue', 2);
    //context.drawImage(image,)
}
