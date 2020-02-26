//roll object and its functions
import * as drawing from '../utils/drawing.js';
import * as ingrd from './ingredients.js';

var madeRolls = [];

export const CaliforniaRoll = {
    name: 'California Roll',
    inner: [ingrd.ingredients.AVOCADO, ingrd.ingredients.CRAB, ingrd.ingredients.CUCUMBER],
    outer: [ingrd.ingredients.RICE],
    nori: true
}

export const AlaskaRoll = {
    name: 'Alaska Roll',
    inner: [ingrd.ingredients.AVOCADO, ingrd.ingredients.CUCUMBER],
    outer: [ingrd.ingredients.RICE],
    nori: true
}

export var rollList = [CaliforniaRoll, AlaskaRoll];

export function Roll()
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

export function downSizeRoll(roll)
{
    roll.renderType.w = 30;
    roll.renderType.h = 30;
}

export function drawRolls(ctx, rolls)
{
    let l = rolls.length;
    if(l > 0)
    {
       
        for (var i = 0; i < l; i++)
        {
            drawing.drawShape(ctx, rolls[i].renderType);
        }
    }
    
}


export function createRoll(nori, inner, outer, itemBox)
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

export function pushRoll(roll)
{
    madeRolls.push(roll);
}