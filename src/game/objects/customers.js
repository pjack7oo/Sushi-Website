import * as shapes from '../utils/shapes.js';

var customers = [];

function Customer()
{
    this.renderType   = shapes.Box;
    this.temperTime   = 60;
    this.startTime    = 0;
    this.want         = [];
    this.boostedMoral = false;
    this.image        = null;
    this.reviewer     = false;
}

function getRandomCustomer()
{
    
}