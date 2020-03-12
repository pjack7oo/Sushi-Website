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

// var request = new XMLHttpRequest();
// request.open('GET', './actualRolls.json', false);
// request.send(null);
// export var rollList = JSON.parse(request.responseText);
// console.log(rollList);
var rollList; // = require(""); 
export function rollListInit()
{
    // $.getJSON("./actualRolls.json", function(json){
    //     rollList = json;
    // });
    LoadJSON(function(response){
        rollList = JSON.parse(response);
        console.log(rollList);
        
    })
}

function LoadJSON(callback)
{
    var xobj = new XMLHttpRequest();

    xobj.overrideMimeType("application/json");
    xobj.open("GET", './game/objects/actualRolls.json', true);
    xobj.onreadystatechange = function() {
        if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
        }
    };
    xobj.send(null);

}


export function Roll()
{
    this.nori = true;
    this.name = '';
    this.inner = [];
    this.outer = [];
    this.radius = 10;
    this.renderType = shapes.Box;
    this.canEnterMatt = false;
    this.canEnterCuttingStation = true;
    this.canEnterPlate = false;
    this.isCut = false;
    this.canSell = false;
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
       
        for (let roll of madeRolls)
        {
            if (roll.isCut){
                drawRollWithCoords(ctx,roll.renderType.x + roll.radius*2 , roll.renderType.y + roll.radius*2, roll.radius, roll);
            }
            else{
                drawing.drawShape(ctx, roll.renderType);
            }
            
        }
    }
    
}

export function drawRollWithCoords(ctx, x, y, radius, roll){
    //drawing.drawRectangle(ctx, x, y, w, h, true, "red", "white", 5);
    if (roll.isCut)
    {
        drawRoll(ctx, x + radius, y - radius, radius, roll);
        drawRoll(ctx, x + radius, y + radius, radius, roll);
        drawRoll(ctx, x - radius, y + radius, radius, roll);
        drawRoll(ctx, x - radius, y - radius, radius, roll);
    }
    
}

export function drawRoll(ctx, x, y, radius, roll)
{
    if (roll.outer.length == 1)
    {
        drawing.drawCircle(ctx, x, y, radius,  true, 'black', 'white', 4.25);
    }
    
    drawing.drawRollPieCuts(ctx, x, y, radius -3, roll);
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
        let rl = rollList.rolls.length;
        
        for (let i = 0; i < rl;i++)
        {
            //console.log(rollList[i].inner.length + rollList[i].outer.length);//
            
            if (((roll.inner.length + roll.outer.length) === (rollList.rolls[i].inner.length + rollList.rolls[i].outer.length)))
            {
                acceptedRolls.push(i);
                console.log(i);
            }
        }
        if (acceptedRolls.length == 0)
        {
            console.log("fail");
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
            if (roll.inner.length > rollList.rolls[acceptedRolls[i]].inner.length)
            {
                rollsToDel.push(i);
                continue;
            }
            let rIl = roll.inner.length;
            for(let k = 0; k < rIl; k++)
            {
                if (roll.inner[k] != rollList.rolls[acceptedRolls[i]].inner[k])
                {
                    rollsToDel.push(i);
                    break;
                }
            }
            
            if (roll.outer.length > rollList.rolls[acceptedRolls[i]].outer.length)
            {
                rollsToDel.push(i);
                continue;
            }
            let rOl = roll.outer.length;
            for(let k = 0; k < rOl; k++)
            {
                
                if (roll.outer[k] != rollList.rolls[acceptedRolls[i]].outer[k])
                {
                    rollsToDel.push(i);
                    break;
                }
            }
        }
    }
    rollsToDel = eliminateDuplicates(rollsToDel);
    let unique = [...new Set(rollsToDel)];
    // console.log(unique);
    // console.log(rollsToDel);
    
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
        return rollList.rolls[cleanArray[0]].name;
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