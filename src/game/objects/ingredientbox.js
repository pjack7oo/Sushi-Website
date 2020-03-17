import * as drawing from '../utils/drawing.js';
import * as ingredients from './ingredients.js';
import * as ioControl   from '../utils/iocontrol.js';



const mainIngredientTypes = Object.freeze({
    VEGETABLES: Symbol("Vegetables"),
    FISH      : Symbol("Fish")
});

class IngredientBox {
    constructor(x , y, w, h, type, intColor, outColor) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.intColor = intColor;
        this.outColor = outColor;
        this.type = type;
        if (type == mainIngredientTypes.FISH) {
            this.typeStorage1name = ingredients.ingredients.AVOCADO;
            this.typeStorage2name = ingredients.ingredients.CUCUMBER;
            this.typeStorage3name = ingredients.ingredients.CRAB;
        }
        else {
            this.typeStorage1name = ingredients.ingredients.TUNA;
            this.typeStorage2name = ingredients.ingredients.SALMON;
            this.typeStorage3name = ingredients.ingredients.EEL;
        }
        this.typeStorage1 = [];
        this.typeStorage1Missing = [0,1,2,3];
        this.typeStorage2 = [];
        this.typeStorage2Missing = [0,1,2,3];
        this.typeStorage3 = [];
        this.typeStorage3Missing = [0,1,2,3];
    
        this.maxStorage   = 4;
    }

    

    drawBox(context) {
        drawing.drawRectangle(context, this.x, this.y, this.w, this.h, true, "#B87C4B", "#966047", 5 );
        
    }

    drawBoxIngredients(context) {
        drawing.drawShapes(context, this.typeStorage1);
        drawing.drawShapes(context, this.typeStorage2);
        drawing.drawShapes(context, this.typeStorage3);
    }

    contains (type) {
        return (this.typeStorage1name == type || this.typeStorage2name == type || this.typeStorage3name == type);
    }

    fillIngredient(type) {
        if (this.typeStorage1name == type){ 
            let max = this.typeStorage1Missing.length;
            // let x = this.x + 10,
            //     y = this.y + 5 + 22*(this.typeStorage1.length);
            for (let i = 0; i <max;i++) {
                let x = this.x + 10,
                    y = this.y + 5 + 22*(this.typeStorage1Missing[i]);
                this.typeStorage1.push(ingredients.createIngredientWithXY(this.typeStorage1name, x, y ))
                y += 25;
            }
            this.typeStorage1Missing = [];
            
        }
        else if (this.typeStorage2name == type) {
            let max = this.typeStorage2Missing.length;
            for (let i = 0; i <max;i++) {
                let x = this.x + 65,
                    y = this.y + 5 + 22*(this.typeStorage2Missing[i]);
                this.typeStorage2.push(ingredients.createIngredientWithXY(this.typeStorage2name, x, y ))
                y += 25;
            }
            this.typeStorage2Missing = [];
        } else if (this.typeStorage3name == type) {
            let max = this.typeStorage3Missing.length;
            
            for (let i = 0; i <max;i++) {
                let x = this.x + 125,
                    y = this.y + 5 + 22*(this.typeStorage3Missing[i]);
                this.typeStorage3.push(ingredients.createIngredientWithXY(this.typeStorage3name, x, y ))
                y += 25;
            }
            this.typeStorage3Missing = [];
        } else {
            console.log("Fail to fill no type of " + name);
            
        }
    }

    checkIngredientShapes(e, context) {
        let mouse = ioControl.getMouse(e);
        let l = this.typeStorage1.length;
        if (l > 0) {
            for (let i = 0; i < l; i++) {
                drawing.drawShape(context, this.typeStorage1[i]);
                let ret;
                
                ret = ioControl.moveItem(mouse, this.typeStorage1[i]);
                

                if (ret) {
                    return ret;
                }
            }
        }
        l = this.typeStorage2.length;
        if (l > 0) {
            for (let i = 0; i < l; i++) {
                drawing.drawShape(context, this.typeStorage2[i]);
                let ret;
                
                ret = ioControl.moveItem(mouse, this.typeStorage2[i]);
                

                if (ret) {
                    return ret;
                }
            }
        }
        l = this.typeStorage3.length;
        if (l > 0) {
            for (let i = 0; i < l; i++) {
                drawing.drawShape(context, this.typeStorage3[i]);
                let ret;
                
                ret = ioControl.moveItem(mouse, this.typeStorage3[i]);
                

                if (ret) {
                    return ret;
                }
            }
        }
        return false;
    }
}

var ingredientBox1 = IngredientBox, ingredientBox2 = IngredientBox;

export function initIngredientBoxes() {
    ingredientBox1 = new IngredientBox(30, 280, 200, 110, mainIngredientTypes.FISH, "#B87C4B", "#966047");
    ingredientBox2 = new IngredientBox(30, 390, 200, 110, mainIngredientTypes.VEGETABLES, "#B87C4B", "#966047");
    ingredientBox1.fillIngredient(ingredients.ingredients.AVOCADO);
    ingredientBox1.fillIngredient(ingredients.ingredients.CRAB);
    ingredientBox1.fillIngredient(ingredients.ingredients.CUCUMBER);
}



export function drawIngredientBoxes(context) {
    ingredientBox1.drawBox(context);
    ingredientBox2.drawBox(context);
    ingredientBox1.drawBoxIngredients(context);
    ingredientBox2.drawBoxIngredients(context);
}

export function checkClickOnShapes(e, context) {
    let ret = ingredientBox1.checkIngredientShapes(e, context);
    if (ret) {
        return ret;
    }
    ret = ingredientBox2.checkIngredientShapes(e, context);
    if (ret) {
        return ret;
    }
    return false;
}

export function fillBoxes(type) {
    if (ingredientBox1.contains(type)) {
        ingredientBox1.fillIngredient(type);
        console.log(ingredientBox1);
        
    }
    else if (ingredientBox2.contains(type)) {
        ingredientBox2.fillIngredient(type);
        console.log(ingredientBox2);
    }
}
var ingredientToRemove;
export function removeIngredient(ingredient) {
    ingredientToRemove = ingredient;
    if (ingredientBox1.contains(ingredient.name)) {
        if (ingredientBox1.typeStorage1name == ingredient.name) {
            let missing = ingredientBox1.typeStorage1.findIndex(findIngredient);
            ingredientBox1.typeStorage1.splice(missing, 1);
            ingredientBox1.typeStorage1Missing.push(missing);
        }
        if (ingredientBox1.typeStorage2name == ingredient.name) {
            let missing = ingredientBox1.typeStorage2.findIndex(findIngredient);
            ingredientBox1.typeStorage2.splice(missing, 1);
            ingredientBox1.typeStorage2Missing.push(missing);
        }
        if (ingredientBox1.typeStorage3name == ingredient.name) {
            let missing = ingredientBox1.typeStorage3.findIndex(findIngredient);
            ingredientBox1.typeStorage3.splice(missing, 1);
            ingredientBox1.typeStorage3Missing.push(missing);
        }
    }
    if (ingredientBox2.contains(ingredient.name)) {
        if (ingredientBox2.typeStorage1name == ingredient.name) {
            let missing = ingredientBox2.typeStorage1.findIndex(findIngredient);
            ingredientBox2.typeStorage1.splice(missing, 1);
            ingredientBox2.typeStorage1Missing.push(missing);
        }
        if (ingredientBox2.typeStorage2name == ingredient.name) {
            let missing = ingredientBox2.typeStorage2.findIndex(findIngredient);
            ingredientBox2.typeStorage2.splice(missing, 1);
            ingredientBox2.typeStorage2Missing.push(missing);
        }
        if (ingredientBox2.typeStorage3name == ingredient.name) {
            let missing = ingredientBox2.typeStorage3.findIndex(findIngredient);
            ingredientBox2.typeStorage3.splice(missing, 1);
            ingredientBox2.typeStorage3Missing.push(missing);
        }
    }
    // ingredientBox1.typeStorage1.splice(ingredientBox1.typeStorage1.findIndex(findIngredient), 1);
    
    // ingredientBox1.typeStorage3.splice(ingredientBox1.typeStorage3.findIndex(findIngredient), 1);
    // ingredientBox2.typeStorage1.splice(ingredientBox2.typeStorage1.findIndex(findIngredient), 1);
    // ingredientBox2.typeStorage2.splice(ingredientBox2.typeStorage2.findIndex(findIngredient), 1);
    // ingredientBox2.typeStorage3.splice(ingredientBox2.typeStorage3.findIndex(findIngredient), 1);
    console.log(ingredientBox1);
    console.log(ingredientBox2);
    ingredientToRemove = null;
}



export function addIngredient(ingredient)
{
    ingredient.renderType.resetCord();
    if (ingredientBox1.contains(ingredient.name)) {
        if (ingredientBox1.typeStorage1name == ingredient.name) {
            
            ingredientBox1.typeStorage1.push(ingredient);
        }
        if (ingredientBox1.typeStorage2name == ingredient.name) {
            ingredientBox1.typeStorage2.push(ingredient);
        }
        if (ingredientBox1.typeStorage3name == ingredient.name) {
            ingredientBox1.typeStorage3.push(ingredient);
        }
    }
}

function findIngredient(ingredient)
{
    //console.log((mySelect.name === ingredient.name && mySelect.x == ingredient.x && mySelect.y == ingredient.y));
    return ( ingredientToRemove.name == ingredient.name && ingredientToRemove.renderType.x == ingredient.renderType.x && ingredientToRemove.renderType.y == ingredient.renderType.y);
}