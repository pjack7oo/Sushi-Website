import * as shapes  from '../utils/shapes.js';
import * as drawing from '../utils/drawing.js';

var customers = [];

function Customer()
{
    //this.renderType   = shapes.;
    this.type         = shapes.shapeType.IMAGE;
    this.x            = -30;
    this.y            = -20;
    this.w            = 150;
    this.h            = 250;
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

}

export function drawCustomers(ctx)
{
    for (var customer in customers)
    {
        drawing.drawShape(ctx, customers[customer]);
    }
}

function startTime(customer)
{
    customer.startTime = performance.now();
}

export function updateCustomers()
{
    for (var customer in customers)
    {
        if (customers[customer].isThinking)
        {
            let currentTime = performance.now(),
                elapsedTime = currentTime - customers[customer].startTime,
                precentage  = (elapsedTime / customers[customer].temperTime)*100;
            
            
            if (precentage >= 100)
            {
                customers[customer].isThinking = false;
                startTime(customers[customer]);
            }
        }
    }
}