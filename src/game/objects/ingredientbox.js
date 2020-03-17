import * as drawing from '../utils/drawing.js';
import * as ingredients from '../objects/ingredients.js';



const mainIngredientTypes = {
    VEGETABLES: "Vegetables",
    FISH      : "Fish"
}

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
        this.typeStorage2 = [];
        this.typeStorage3 = [];
    
        this.maxStorage   = 4;
    }

    drawBox(context) {
        drawing.drawRectangle(context, this.x, this.y, this.w, this.h, true, "#B87C4B", "#966047", 5 );
    }

    fill(type) {
        if (this.typeStorage1name != name)//todo
    }
}

var IngredientBox1 = IngredientBox, IngredientBox2 = IngredientBox;

export function initIngredientBoxes() {
    IngredientBox1 = new IngredientBox(30, 300, 200, 100, mainIngredientTypes.FISH, "#B87C4B", "#966047");
    IngredientBox2 = new IngredientBox(30, 400, 200, 100, mainIngredientTypes.VEGETABLES, "#B87C4B", "#966047");
}



export function drawIngredientBoxes(context) {
    IngredientBox1.drawBox(context);
    IngredientBox2.drawBox(context);
}