import * as drawing from '../utils/drawing.js';
import * as shapes from '../utils/shapes.js'
import * as rollControl from './rolls.js'
import { getFromMatt, changeFromMatt } from '../utils/iocontrol.js';
import * as ingredients from './ingredients.js'
import * as ingredientBox from './ingredientbox.js';
import * as  riceCooker  from './riceCooker.js';
import * as player       from './player.js';

var canvas = document.getElementById('canvas');

var mypick;
var isInner = true;
export var innerIngredients = [];
export var outerIngredients = [];
var noriImage = new Image();
noriImage.src = './game/images/nori.jpg'
export const rollingMatt = {
    type: shapes.shapeType.RECTANGLE,
    x: 300,
    y: 400,
    w: 100,
    h: 100,
    intColor: '#444444',
    outColor: '#444444',
    fill: true,
    lineWidth: 1,
    image: null,
    startTime: 0,
    isActive: false,
    speed: 5,//seconds
    speedUpgradeCost: 500
}

export function getSpeedUpgradeCost() {
    return rollingMatt.speedUpgradeCost;
}

export function upgradeSpeed() {
    if (player.hasEnoughMoney(rollingMatt.speedUpgradeCost)) {
        player.removeMoney(rollingMatt.speedUpgradeCost);
        rollingMatt.speed -= 0.5;
        rollingMatt.speedUpgradeCost += 500;
        return true;
    }
    return false;
}

function drawIngredients(context)
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

function checkForRice()
{
    let length = outerIngredients.length;
    for(let i = 0;i<length;i++)
    {
        if (outerIngredients[i].name == ingredients.ingredients.RICE){
            return true;
        }
    }
    return false;
}

export function clearMatt() {
    innerIngredients = [];
    outerIngredients = [];
}

export function assembleRoll()
{
    //later this will have timer to completion of roll
    let box1;
    if (checkForRice){
        box1 = shapes.createBox(rollingMatt.x, rollingMatt.y, rollingMatt.w, rollingMatt.h / 4, 
            true, 'White', 'White',3,false,null,false);
    } 
    else {
        box1 = shapes.createBox(rollingMatt.x, rollingMatt.y, rollingMatt.w, rollingMatt.h / 4, 
            true, 'Green', 'Green',3,false,null,false);
    }
    
    
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
            
            console.log(getFromMatt());
            
            if (getFromMatt())
            {
                changeFromMatt(false);
                mySelect = null;
                canvas.onmousemove = null;
    
                drawing.Invalidate();
                return;
            }
            innerIngredients.push(mySelect);
            //ingredients.removeIngredient(mySelect);
            if (mySelect.name == ingredients.ingredients.RICE) {
                riceCooker.removeRice(mySelect);
            }
            else {
                ingredientBox.removeIngredient(mySelect);
            }
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
            if (mySelect.name == ingredients.ingredients.RICE) {
                riceCooker.removeRice(mySelect);
            }
            else {
                ingredientBox.removeIngredient(mySelect);
            }
            
            
        }
    }
    else {
        mySelect.renderType.resetCord();
    }
    if (mySelect != null){
        
        
        if (!shapes.Contains(rollingMatt,mySelect))
        {
            
            
            if (isInner && getFromMatt())
            {
                changeFromMatt(false);
                //ingredients.addIngredient(mySelect);
                if (mySelect.name == ingredients.ingredients.RICE) {
                    riceCooker.addRice(mySelect);
                }
                else {
                    ingredientBox.addIngredient(mySelect);
                }
                removeMattIngredient(isInner, mySelect);
                
            }
            else if (!isInner && getFromMatt())
            {
                changeFromMatt(false);
                //ingredients.addIngredient(mySelect);
                if (mySelect.name == ingredients.ingredients.RICE) {
                    riceCooker.addRice(mySelect);
                }
                else {
                    ingredientBox.addIngredient(mySelect);
                }
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

export function drawRollingMatt(context) {
    drawing.drawShape(context, rollingMatt);
    drawing.drawRoundRect(context, rollingMatt.x, rollingMatt.y - 25, rollingMatt.w, 25, 10, true, true, "Gray", "black");
    context.fillStyle = 'Red';
    context.textAlign = "center";
    context.font = "30px Arial";
    if (!rollingMatt.isActive)
    {
        drawing.drawRectImage(rollingMatt.x + 10, rollingMatt.y + 10, rollingMatt.w- 20, rollingMatt.h - 20, noriImage);
    }
    
    if (isInnerIngredient()) {
        context.fillText('Inner', rollingMatt.x + rollingMatt.w/2, rollingMatt.y - 10);
    }
    else {
        context.fillText('Outer', rollingMatt.x + rollingMatt.w/2, rollingMatt.y - 10);
    }
    drawIngredients(context);
}