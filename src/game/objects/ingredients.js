//ingredients and functions to create and manage them

export function Ingredient()
{
    this.name = ingredients;
    this.renderType = null;
    this.canEnterMatt = true;
    this.canEnterCuttingStation = false;
    this.canEnterPlate = false;
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
    var box = createBox(x, y, 75, 75, true, 'white', 'white');
    var rice = createIngredient(ingredients.RICE, box);
    activeIngredients.push(rice);
}

export function createCucumber(x,y)
{
    var box = createBox(x, y, 50, 10, true, 'green', 'green');
    var cucumber = createIngredient(ingredients.CUCUMBER, box);
    activeIngredients.push(cucumber);
}

export function createCrab(x,y)
{
    var box = createBox(x, y, 50, 20, true, 'white', 'red');
    var crab = createIngredient(ingredients.CRAB, box);
    activeIngredients.push(crab);
}

export function createAvocado(x,y)
{
    var box = createBox(x, y, 50, 20, true, 'yellow', 'green');
    var avocado = createIngredient(ingredients.AVOCADO, box);
    activeIngredients.push(avocado);
}