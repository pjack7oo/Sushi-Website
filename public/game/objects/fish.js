import * as ioControl from '../utils/iocontrol.js';
import * as drawing   from '../utils/drawing.js';


const fishTypes = Object.freeze({
    SALMON: "Salmon",
    TUNA  : "Tuna",
    EEL   : 'Eel'
});
var salmonImage = new Image(150,100);
salmonImage.src = './game/images/Salmon.png';
var tunaImage = new Image(150,100);
tunaImage.src = './game/images/Tuna.png';
var eelImage  = new Image(150,100);
eelImage.src  = './game/images/Eel.png';

export class Fish {
    constructor(fishType, x ,y, w, h, intColor, outColor, cost) {
        this.fishType = fishType;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.intColor = intColor;
        this.outColor = outColor;
        this.cost = cost;
        if (this.fishType == fishTypes.SALMON) {
            this.image = salmonImage;
            
        } else if (this.fishType == fishTypes.TUNA) {
            this.image = tunaImage;
        } else if (this.fishType == fishTypes.EEL) {
            this.image = eelImage;
        }
    }
    draw() {
        //console.log("drawing fish");
        
        
        drawing.drawRectImage(this.x, this.y, this.w, this.h, this.image, true, this.w, this.h);
        
    }
}


function createFish(name) {

}



export function createSalmon(cost) {
    let salmon = new Fish(fishTypes.SALMON,0,0,150,100,'rgb(20,24,36)','DarkBlue',cost);
    
    
    return salmon;
}

export function createEel(cost) {
    let eel = new Fish(fishTypes.EEL,0,0,150,100,'rgb(20,24,36)','DarkBlue',cost);
    return eel;
}

export function createTuna(cost) {
    let tuna = new Fish(fishTypes.TUNA,0,0,150,100,'rgb(20,24,36)','DarkBlue',cost);
    return tuna;
}