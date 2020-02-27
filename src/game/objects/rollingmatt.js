import * as drawing from '../utils/drawing.js';
import * as shapes from '../utils/shapes.js'
import * as rollControl from './rolls.js'
import { getFromMatt, changeFromMatt } from '../utils/iocontrol.js';
import * as ingredients from './ingredients.js'

var canvas = document.getElementById('canvas');

var mypick;
var isInner = true;
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

export function getInnerIngredients()
{
    return innerIngredients;
}

export function getOuterIngredients()
{
    return outerIngredients;
}

export function flip()
{
    isInner = !isInner;
}

export function isInnerIngredient()
{
    return isInner;
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
    console.log(rollControl.getMadeRolls());
    drawing.Invalidate();
}

export function checkMatt(mySelect)
{   
    if (mySelect == null)
    {
        return;
    }
    if (mySelect.canEnterMatt == false)
    {
        drawing.Invalidate();
        return;
    }
    if(shapes.Contains(rollingMatt,mySelect.renderType)){
        if (isInner)
        {
            
            
            if (getFromMatt())
            {
                changeFromMatt(false);
                mySelect = null;
                canvas.onmousemove = null;
    
                drawing.Invalidate();
                return;
            }
            innerIngredients.push(mySelect);
            ingredients.removeIngredient(mySelect);
            console.log(innerIngredients);
        }
        else
        {
            if (getFromMatt())
            {
                changeFromMatt(false);
                mySelect = null;
                canvas.onmousemove = null;
    
                drawing.Invalidate();
                return;
            }
            outerIngredients.push(mySelect);
            ingredients.removeIngredient(mySelect);
            
            
        }
    }
    if (mySelect != null){
        
        
        if (!shapes.Contains(rollingMatt,mySelect))
        {
            
            
            
            if (isInner && getFromMatt())
            {
                ingredients.addIngredient(mySelect);
                removeMattIngredient(isInner, mySelect);
                
            }
            else if (!isInner && getFromMatt())
            {
                ingredients.addIngredient(mySelect);
                removeMattIngredient(isInner, mySelect);
            }
        }
    }
}

function removeMattIngredient(inner, ingredient)
{
    mypick = ingredient;
    if (inner)
    {
        console.log(ingredient);
        
        delete innerIngredients[innerIngredients.findIndex(findIngredient)];
        innerIngredients.sort();
        innerIngredients.pop();
    }
    else
    {
        delete outerIngredients[outerIngredients.findIndex(findIngredient)];
        outerIngredients.sort();
        outerIngredients.pop();
    }
    mypick= null;
}

function findIngredient(ingredient)
{
    //console.log((mySelect.name === ingredient.name && mySelect.x == ingredient.x && mySelect.y == ingredient.y));
    return (mypick.name === ingredient.name && mypick.renderType.x == ingredient.renderType.x && mypick.renderType.y == ingredient.renderType.y);
}