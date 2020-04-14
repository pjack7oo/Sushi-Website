import * as shapes from '../utils/shapes.js';
import * as drawing from '../utils/drawing.js';
import * as ioControl from '../utils/iocontrol.js';

var trayImage = new Image();
trayImage.src = './game/images/Tray.png';

export class Cup {
    constructor(x,y) {
        this.renderType = new shapes.createCircle(x,y, 20, true,
            'White', "Gold",2);
        this.x = x;
        this.y = y;
        this.w = 20;
        this.h = 20;
        this.radius = 20
        this.image  = null;
        this.canEnterMatt = false;
    }
    draw(context) {
        drawing.drawCircle(context, this.renderType.x, this.renderType.y, this.renderType.radius, true, 'White', "Gold", 2);
    }

    checkCup(mouse) {
        let ret = ioControl.moveCircle(mouse, this);
        return ret;
    }

}

export class TeaKettle {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.w = 170;
        this.h = 80;
        this.trayImage = trayImage;
        this.image = trayImage;//TODO set to kettle image
        this.cup = Cup;
    }
    draw(context) {
        drawing.drawRoundRectImage(this.x, this.y, this.w, this.h, this.trayImage, true, this.w, this.h);
        drawing.drawRoundRectImage(this.x + 5, this.y+10, this.w-100, this.h- 10, this.image, true, this.w-100, this.h -20);
        if (this.cup instanceof Cup) {
            this.cup.draw(context);
        }
        

    }
}
var teaKettle = TeaKettle;

export function teaKettleInit() {
    teaKettle = new TeaKettle(340,260);
    teaKettle.cup = new Cup(teaKettle.x + teaKettle.w/2 + teaKettle.w/4, teaKettle.y + teaKettle.h/2);
}

export function drawTeaKettle(context) {
    teaKettle.draw(context);
}

export function checkCup(mouse) {
    if (teaKettle.cup instanceof Cup) {
        let ret = teaKettle.cup.checkCup(mouse);
    return ret;
    }
    return false;
}

export function removeCup() {
    teaKettle.cup = Cup;
}