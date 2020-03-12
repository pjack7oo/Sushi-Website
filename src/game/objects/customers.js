import * as shapes  from '../utils/shapes.js';
import * as drawing from '../utils/drawing.js';
import * as rolls   from  './rolls.js';

var customers = [];

function Customer()
{
    //this.renderType   = shapes.;
    this.type         = shapes.shapeType.IMAGE;
    this.x            = 0;
    this.y            = 50;
    this.w            = 100;
    this.h            = 200;
    this.xOffset      = -30;
    this.yOffset      = -20;
    this.temperTime   = 6000;
    this.startTime    = 0;
    this.isThinking   = true; 
    this.want         = [];
    this.boostedMoral = false;
    this.image        = new Image();
    this.image.src    = './game/images/Cat.png';
    this.reviewer     = false;
    this.money        = 10;
}

export function getRandomCustomer()
{
    var customer = new Customer();
    startTime(customer);
    customers.push(customer);
    drawing.Invalidate();
    
}

function getWantedRoll(customer)
{
    var roll = rolls.CaliforniaRoll;
    customer.want.push(roll);
}

export function drawCustomers(ctx)
{
    for (var customer of customers)
    {
    
        drawCustomer(ctx, customer);
    }

}

function drawCustomer(ctx, customer)
{
    drawing.drawShape(ctx, customer);
    drawing.drawRectangle(ctx,customer.x, customer.y, customer.w, customer.h, false, "white", "blue", 1); //temp bounding box
    if (customer.isThinking)
    {
        drawing.drawSpeechBubble(customer.x, customer.y - 50, customer.w, 50,
             '...', '10px Arial', 'black');
    }
    else{
        drawWantedRolls(ctx, customer.x, customer.y - 50 , customer.w, 50, customer)

    }
}

function drawWantedRolls(ctx, x, y, w, h, customer)
{
    drawing.drawRoundRectWPoint(ctx, x, y, w, h+15, 
        10,true, true, '#add8e6', 'grey');
    
    drawing.printAtWordWrap(ctx, customer.want[0].name, x + w/2, y + h+13, 15, w, 'Black', '15px Arial');
    customer.want[0].isCut = true;
    rolls.drawRollWithCoords(ctx, x + w/2, y + h/2, 10, customer.want[0]);
    
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
                if (checkCustomerBounding(customer, plate.renderType)){
                    checkCustomerOrder(customer, plate);
                
                }
            } 
        }
    }
}

function checkCustomerOrder(customer, plate)
{
    for (let wantedRoll of customer.want ){
        console.log(wantedRoll);
        console.log(plate.roll.name);
        
        if (plate.roll.name == wantedRoll.name){
            console.log(true);
        
        }
    }
}
function checkCustomerBounding(customer, circle)
{
    if (!shapes.inRect(circle.x - circle.radius, circle.y, customer)) return false;
    if (!shapes.inRect(circle.x, circle.y - circle.radius, customer)) return false;
    if (!shapes.inRect(circle.x + circle.radius, circle.y, customer)) return false;
    if (!shapes.inRect(circle.x, circle.y + circle.radius, customer)) return false;
    return true;
}

export function updateCustomers()
{
    for (var customer of customers)
    {
        if (customer.isThinking)
        {
            let currentTime = performance.now(),
                elapsedTime = currentTime - customer.startTime,
                precentage  = (elapsedTime / customer.temperTime)*100;
            
            
            if (precentage >= 100)
            {
                customer.isThinking = false;
                startTime(customer);
                drawing.Invalidate();
                getWantedRoll(customer);
            }
        }
    }
}