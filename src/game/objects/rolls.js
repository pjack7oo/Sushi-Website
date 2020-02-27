//roll object and its functions
import * as drawing from '../utils/drawing.js';
import * as ingrd from './ingredients.js';
import * as shapes from '../utils/shapes.js';

var madeRolls = [];
var mySelect = null;

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
    this.renderType = shapes.Box;
    this.canEnterMatt = false;
    this.canEnterCuttingStation = true;
    this.canEnterPlate = false;
    this.isCut = false;
}

export function getMadeRolls()
{
    return madeRolls;
}

export function downSizeRoll(roll)
{
    roll.renderType.w = 30;
    roll.renderType.h = 30;
}

export function drawRolls(ctx)
{
    let l = madeRolls.length;
    if(l > 0)
    {
       
        for (var i = 0; i < l; i++)
        {
            drawing.drawShape(ctx, madeRolls[i].renderType);
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

function getRoll(box)
{
    for (let i = 0; i <madeRolls.length;i++)
    {
        if (box.x == madeRolls[i].box.x && box.y == madeRolls[i].box.y)
        {
            return madeRolls[i];
        }
    }
    return null;
}

export function removeRoll(roll)
{
    mySelect = roll;

    delete madeRolls[madeRolls.findIndex(findRoll)];
    madeRolls.sort();
    madeRolls.pop();
}

function findRoll(box)
{
    return (mySelect.renderType.x == box.renderType.x && mySelect.renderType.y == box.renderType.y);
}

function getRollName(roll, acceptedRolls = [])
{
    var rollsToDel = [];
    if (acceptedRolls.length == 0)
    {
        let rl = rollList.length;
        for (let i = 0; i < rl;i++)
        {
            if (((roll.inner.length + roll.outer.length) === (rollList[i].inner.length + rollList[i].outer.length)))
            {
                acceptedRolls.push(i);
                console.log(i);
            }
        }
        if (acceptedRolls.length == 0)
        {
            return 'Unknown Roll'
        }
        getRollName(roll, acceptedRolls);
    }
    else
    {
        console.log(acceptedRolls.length);
        let aRl = acceptedRolls.length;
        for (let i = 0; i < aRl; i++)
        {   
            if (roll.inner.length > rollList[acceptedRolls[i]].inner.length)
            {
                rollsToDel.push(i);
                continue;
            }
            let rIl = roll.inner.length;
            for(let k = 0; k < rIl; k++)
            {
                if (roll.inner[k] != rollList[acceptedRolls[i]].inner[k])
                {
                    rollsToDel.push(i);
                    break;
                }
            }
            
            if (roll.outer.length > rollList[acceptedRolls[i]].outer.length)
            {
                rollsToDel.push(i);
                continue;
            }
            let rOl = roll.outer.length;
            for(let k = 0; k < rOl; k++)
            {
                
                if (roll.outer[k] != rollList[acceptedRolls[i]].outer[k])
                {
                    rollsToDel.push(i);
                    break;
                }
            }
        }
    }
    rollsToDel = eliminateDuplicates(rollsToDel);
    let unique = [...new Set(rollsToDel)];
    console.log(unique);
    console.log(rollsToDel);
    
    let rTDl = rollsToDel.length;
    for (let i = 0; i < rTDl; i++)
    {
        delete acceptedRolls[rollsToDel[i]];
    }
    var cleanArray = acceptedRolls.filter(function() {return true});
    if (cleanArray.length == 0)
    {
        return 'Unknown Roll'
    }
    else if (cleanArray.length == 1)
    {
        return rollList[cleanArray[0]].name;
    }
    else
    {
        getRollName(roll, cleanArray);
    }
}

function eliminateDuplicates(arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};
  
    for (i = 0; i < len; i++) {
      obj[arr[i]] = 0;
    }
    for (i in obj) {
      out.push(i);
    }
    return out;
  }