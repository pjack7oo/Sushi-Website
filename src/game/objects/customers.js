import * as shapes  from '../utils/shapes.js';
import * as drawing from '../utils/drawing.js';
import * as rolls   from  './rolls.js';

var customers = [];

function Customer()
{
    //this.renderType   = shapes.;
    this.type         = shapes.shapeType.IMAGE;
    this.x            = -30;
    this.y            = -20;
    this.w            = 150;
    this.h            = 250;
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
    if (customer.isThinking)
    {
        drawing.drawSpeechBubble(customer.x + 50, customer.y + 20, 50, 50, '...', '10px Arial', 'black');
    }
}

function startTime(customer)
{
    customer.startTime = performance.now();
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
            }
        }
    }
}