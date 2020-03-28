import * as shapes  from '../utils/shapes.js';
import * as drawing from '../utils/drawing.js';
import * as rolls   from  './rolls.js';
import * as progBar from '../utils/progressBar.js';
import * as plateControl from './plates.js';
import * as player   from './player.js';

var customers = [];
var startWaitTime = 0;
var waitTime = 4000;
var wait = false;
var colors = ["red","red","OrangeRed","OrangeRed","DarkOrange","Orange","Gold","yellow","GreenYellow","LawnGreen","Lime"];
class Customer {
    constructor() {
        //this.renderType   = shapes.;
        this.type = shapes.shapeType.IMAGE;
        this.x = 0;
        this.y = 100;
        this.w = 100;
        this.h = 200;
        this.xOffset = -30;
        this.yOffset = -20;
        this.thinkingTime = 5000;
        this.temperTime = 20000;
        this.startTime = 0;
        this.isThinking = true;
        this.want = [];
        this.boostedMoral = false;
        this.image = new Image();
        this.image.src = './game/images/Cat.png';
        this.reviewer = false;
        this.money = 10;
        this.id = 0;
        this.setProgress = (progress) => {
                this.progress =progress;
                drawing.Invalidate();
            }
        this.progress = 0;
        this.bar = null;
    }
}

export function getRandomCustomer()
{
    var customer = new Customer();
    startTime(customer);
    customer.id = customers.length -1;
    customers.push(customer);
    drawing.Invalidate();
    
}

export function getCustomerLength() {
    return customers.length;
}

export function getLevelCustomer(level) {
    var customer = new Customer();
    startTime(customer);
    console.log(customer);
    customer.bar =new progBar.progressbar(customer.x, customer.y -72, customer.w, 20);
    customer.id = customers.length;
    switch(level) {
        default:
            getWantedRoll(customer, level);
            break;
    }
    customers.push(customer);
    drawing.Invalidate();
}

function getWantedRoll(customer, level = 0)
{
    switch(level) {
        default:
            var i = Math.floor(Math.random()*1);
            console.log(i);
            
            var roll = rolls.getRoll(i);
            customer.want.push(roll);
            break;
        case 0:
            var roll = rolls.CaliforniaRoll;
            customer.want.push(roll);
            break;
    }

}

export function drawCustomers(ctx)
{
    for (var customer of customers)
    {
        
        drawCustomer(ctx, customer);
        drawCustomerBar(customer);
    }

}

function drawCustomer(ctx, customer)
{
    drawing.drawShape(ctx, customer);
    drawing.drawRectangle(ctx,customer.x, customer.y, customer.w, customer.h, false, "white", "blue", 1); //temp bounding box
    if (customer.isThinking)
    {
        drawing.drawSpeechBubble(customer.x, customer.y - 50, customer.w, 50,
             '...', '20px Arial', 'black');
    }
    else {
        drawWantedRolls(ctx, customer.x, customer.y - 50 , customer.w, 50, customer)
    }
}

function drawWantedRolls(ctx, x, y, w, h, customer)
{
    drawing.drawRoundRectWPoint(ctx, x, y, w, h+15, 
        10,true, true, '#add8e6', 'grey');
    
    drawing.printAtWordWrap(ctx, customer.want[0].name, x + w/2, y + h+5, 15, w, 'Black', '15px Arial', "center");
    customer.want[0].isCut = true;
    rolls.drawRollWithCoords(ctx, x + w/2, y + h/2, 10, customer.want[0]);
    
}

function drawCustomerBar(customer) {
    if (customer.progress > 0) {
        progBar.drawColorProgressbar(customer.progress, customer.bar, true);
    }
    
    //drawing.drawInverseBar(customer.x, customer.y - 20, customer.w, 20, customer.progress, 'Green', 'Grey');
}

function startTime(customer)
{
    customer.startTime = performance.now();
}

export function giveCustomerPlate(plate)
{
    if (plate != null)
    {
        if (plate.canSell)
        {
            for (let customer of customers)
            {   
                if (!customer.isThinking) { 
                    if (checkCustomerBounding(customer, plate.renderType)){
                        checkCustomerOrder(customer, plate);
                    
                    }
                }
            } 
        }
    }
}
var rollToRemove;
function checkCustomerOrder(customer, plate)
{
    for (let wantedRoll of customer.want ){
        console.log(wantedRoll);
        console.log(plate.roll.name);
        
        if (plate.roll.name == wantedRoll.name){
            rollToRemove = wantedRoll;
            customer.want.splice(find(isWantedRoll),1);
            plateControl.removePlate(plate);
            if (customer.want.length == 0) {
                let money = customer.money;
                customerLeave(customer);
                wait = true;
                startWaitTime = performance.now();
                drawing.Invalidate();
                player.addMoney(customer.money);
                return money;
            }
        }
        else {
            plateControl.removePlate(plate);
            customer.startTime -= 5000;
        }
    }
}

function isWantedRoll(roll) {
    return roll.name == rollToRemove.name;
}
function checkCustomerBounding(customer, circle)
{
    let rect = new Object();
    rect.x = customer.x;
    rect.y = customer.y - 50;
    rect.w = customer.w;
    rect.h = customer.h/2 + 55;
    if (!shapes.inRect(circle.x - circle.radius, circle.y, rect)) return false;
    if (!shapes.inRect(circle.x, circle.y - circle.radius, rect)) return false;
    if (!shapes.inRect(circle.x + circle.radius, circle.y, rect)) return false;
    if (!shapes.inRect(circle.x, circle.y + circle.radius, rect)) return false;
    return true;
}

export function updateCustomers() {
    let currentTime = performance.now();
    for (var customer of customers)
    {
        if (customer.isThinking)
        {
            let elapsedTime = currentTime - customer.startTime,
                percentage  = (elapsedTime / customer.thinkingTime)*100;
            
            // customer.setProgress(percentage);
            drawing.Invalidate();
            if (percentage >= 100)
            {
                customer.progress = 0;
                customer.isThinking = false;
                startTime(customer);
                drawing.Invalidate();
            }
        }
        else {
            let elapsedTime = currentTime - customer.startTime,
                percentage  = (elapsedTime / customer.temperTime)*100;
            //console.log(percentage);
            
            customer.setProgress(percentage);
            
            if (percentage >= 100)
            {
                customerLeave(customer);
                wait = true;
                startWaitTime = performance.now();
                drawing.Invalidate();
            }
        }
    }
}

export function updateGetCustomer() {
    if (wait) {
        let currentTime = performance.now(),
            elapsedTime = currentTime - startWaitTime,
            percentage  = (elapsedTime / waitTime)*100;
            
            
            if (percentage >= 100)
            {
                wait = false;
                return true;
            }
            return false;
    }
    return true;
}

function customerLeave(customer) {
    console.log(customer.id);
    
    //customers.splice(customer.id,1);
    console.log(customers.splice(customer.id,1));
    console.log(customers);
}

