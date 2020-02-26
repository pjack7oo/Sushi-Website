import * as drawing from '../utils/drawing.js';
import * as shapes from '../utils/shapes.js'
import * as rollControl from './rolls.js'

export var isInner = true;
export var innerIngredients = [];
export var outerIngredients = [];

export const rollingMatt = {
    type: shapes.shapeType.RECTANGLE,
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

export function drawIngredients(context)
{
    if (isInner && innerIngredients.length > 0)
    {
        drawing.drawShapes(context, innerIngredients);
    }
    else if (!isInner && outerIngredients.length > 0)
    {
        drawing.drawShapes(context, outerIngredients);
    }
}

export function containsIngredients()
{
    return (innerIngredients.length > 0 || outerIngredients.length > 0);
}


export function flip()
{
    isInner = !isInner;
}

export function assembleRoll()
{
    //later this will have timer to completion of roll
    let box1 = shapes.createBox(rollingMatt.x, rollingMatt.y, rollingMatt.w, rollingMatt.h / 4, 
        true, 'Green', 'Green',3,false,null,false);
    
    let inner = [];
    let outer = [];
    let il    = innerIngredients.length;
    let ol    = outerIngredients.length;
    for (var i = 0; i < il; i++)
    {
        inner.push(innerIngredients[i].name);
    }

    for (var i = 0; i < ol; i++)
    {
        outer.push(outerIngredients[i].name);
    }  
    var roll = rollControl.createRoll(true, inner, outer, box1);
    innerIngredients.splice(0, innerIngredients.length);
    outerIngredients.splice(0,outerIngredients.length); 
    rollControl.pushRoll(roll);
    console.log(madeRolls);
    drawing.Invalidate();
}