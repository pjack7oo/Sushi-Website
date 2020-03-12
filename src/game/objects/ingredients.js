//ingredients and functions to create and manage them
import * as drawing from '../utils/drawing.js';
import * as shapes  from '../utils/shapes.js';

export var activeIngredients = [];

var mySelect;

export const ingredients = {
    AVOCADO: 'Avocado',
    CUCUMBER: 'Cucumber',
    CRAB: 'Crab',
    RICE: 'Rice'
}


export function Ingredient()
{
    this.name = ingredients;
    this.renderType = null;
    this.canEnterMatt = true;
    this.canEnterCuttingStation = false;
    this.canEnterPlate = false;
    this.canSell       = false;
    
}

export function getIngredientColor(ingredient)
{
    var color = new Object();
    color.intColor = '';
    color.outColor = '';
    
    switch(ingredient)
    {
        default:
            color.intColor = "White";
            color.outColor = "White";
            break;
        case ingredients.AVOCADO:
            color.intColor = "#F2E880";
            color.outColor = "#356211";
            break;
        case ingredients.CRAB:
            color.intColor = "White";
            color.outColor = "Red";
            break;
        case ingredients.CUCUMBER:
            color.intColor = "#E9FF96";
            color.outColor = "#67AB05";
            break;
    }
    
    
    return color
}

function createIngredient(name, renderType)
{
    var ingredient = new Ingredient();
    ingredient.name = name;
    ingredient.renderType = renderType;
    return ingredient;
}

export function createRice(x,y)
{
    var box = shapes.createBox(x, y, 75, 75, true, 'white', 'white');
    var rice = createIngredient(ingredients.RICE, box);
    activeIngredients.push(rice);
}

export function createCucumber(x,y)
{
    var box = shapes.createBox(x, y, 50, 10, true, "#E9FF96", "#67AB05");
    var cucumber = createIngredient(ingredients.CUCUMBER, box);
    activeIngredients.push(cucumber);
}

export function createCrab(x,y)
{
    var box = shapes.createBox(x, y, 50, 20, true, 'white', 'red');
    var crab = createIngredient(ingredients.CRAB, box);
    activeIngredients.push(crab);
}

export function createAvocado(x,y)
{
    var box = shapes.createBox(x, y, 50, 20, true, "#F2E880", "#356211");
    var avocado = createIngredient(ingredients.AVOCADO, box);
    activeIngredients.push(avocado);
}

export function drawActiveIngredients(context)
{
    drawing.drawShapes(context, activeIngredients);
}

export function removeIngredient(ingredient)
{   
    mySelect = ingredient;
    delete activeIngredients[activeIngredients.findIndex(findIngredient)];
    activeIngredients.sort();
    activeIngredients.pop();
    mySelect = null;
}

export function addIngredient(ingredient)
{
    activeIngredients.push(ingredient);
}

function findIngredient(ingredient)
{
    //console.log((mySelect.name === ingredient.name && mySelect.x == ingredient.x && mySelect.y == ingredient.y));
    return (mySelect.name === ingredient.name && mySelect.renderType.x == ingredient.renderType.x && mySelect.renderType.y == ingredient.renderType.y);
}
