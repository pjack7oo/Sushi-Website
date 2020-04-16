import * as ioControl from '../utils/iocontrol.js';
import * as levelControl from './level.js';
import * as drawing      from '../utils/drawing.js';
import * as shapes       from '../utils/shapes.js';
import * as player       from './player.js';
import * as riceCooker   from './riceCooker.js';
import * as storage      from './ingredientbox.js';
import * as rollingMatt  from './rollingmatt.js';
import * as cuttingStation from './cuttingstation.js';
import * as teaKettle      from './teakettle.js';
import * as game         from '../game.js';
import {save} from '../utils/save.js';
var activeInterval;
var canvas, context;
var upgradeButtons = [];

export function upgradeScreen()
{
    canvas.removeEventListener('click', ioControl.buttonClick, false);
    ioControl.clearButtons();
    ioControl.addButton(shapes.createButton(400,400,100,50,"Next-Level", true, 1, startNextLevel, 
                        "StartLevel-Next", shapes.shapeType.ROUNDRECT, 'center', "20px Arial"));
    ioControl.addButton(shapes.createButton(200,400,100,50,"Exit", true, 1, exitUpgrade, 
                        "Exit to main screen", shapes.shapeType.ROUNDRECT, 'center', "20px Arial"));
    ioControl.addButton(shapes.createButton(300, 400, 100, 50, "Save", true, 1, save, 'SaveGame',
                        shapes.shapeType.ROUNDRECT, 'center', "20px Arial"));
    canvas.addEventListener('click', upgradeMenuClick, false);

    riceCookerUpgradesSetup(50,200);
    storageBoxUpgradesSetup(50,10);
    rollingMattUpgradesSetup(450,10);
    cuttingBoardUpgradesSetup(251,200);
    canvas.onmousemove = function(e) {
        checkButtons(e);
    }
    //drawing.toggleGrid();
    
    upgradeUpdate();
}

export function upgradeInit(canvs) {
    canvas = canvs;
    context = canvas.getContext('2d');

}

function exitUpgrade() {
    cancelAnimationFrame(activeInterval);
    //drawing.toggleGrid();
    ioControl.clearButtons();
    canvas.removeEventListener('click', upgradeMenuClick, false);
    game.startScreen();
}

function upgradeMenuClick(e) {
    ioControl.buttonClick(e);
    ioControl.checkButtonsGiven(e, upgradeButtons);
}

function checkButtons(e) {
    let mouse = ioControl.getMouse(e);
    
    
    for (let button of upgradeButtons) {
        button.checkHover(mouse);
    }
}

function updateButtons() {
    for(let button of upgradeButtons) {
        button.update();
        button.checkAvailable(player.getCurrentMoney());
    }
}

function upgradeUpdate() {
    activeInterval = requestAnimationFrame(upgradeUpdate);
    
    updateButtons();
    upgradeDraw();
}

function upgradeDraw()
{
    drawing.clear(context);
    drawing.drawRectangle(context, 0,0,700,500,true,"LightBlue", "LightBlue",1);
    drawing.drawTextBox(context, 275, 0, 150, 100, "Upgrade Menu", "30px Arial", "Red", "white", "Red");
    drawing.printAtWordWrap(context,"Money: ",300, 115, 10, 100, "Green", "20px Arial", "left");
    drawing.printAtWordWrap(context,player.getCurrentMoney().toString(),370, 115, 10, 100, "Green", "20px Arial", "left");
    
    riceCookerUpgradesDraw(50,200);
    storageBoxUpgradesDraw(50,10);
    rollingMattUpgradesDraw(450,10);
    cuttingBoardUpgradesDraw(251,200);
    teaKettleUpgradesDraw(451,200);

    ioControl.drawIoButtons();
    drawing.drawUpgradeButtons(context, upgradeButtons);

    drawing.drawGrid();
    
}

function startNextLevel() {
    cancelAnimationFrame(activeInterval);
    //drawing.toggleGrid();
    ioControl.clearButtons();
    canvas.removeEventListener('click', upgradeMenuClick, false);
    levelControl.startLevel();
    
}



function riceCookerUpgradesSetup(x,y) { //0 200
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x+140,y+25,58,50, 10, riceCooker.getCookTimeUpgradeCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", riceCooker.riceCookerUpgradeCookTime, riceCooker.getCookTimeUpgradeCost, "Rice Cooker Upgrade Cook Time"));
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x+140,y+85,58,50, 10, riceCooker.getRiceCountUpgradeCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", riceCooker.riceCookerUpgradeRiceCount, riceCooker.getRiceCountUpgradeCost, "Rice Cooker Upgrade Rice Count"));
}
function storageBoxUpgradesSetup(x,y) { //0 10
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x+140,y +25,58,50, 10, storage.getIngredientBox1UpgradeCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", storage.upgradeIngredientBox1Storage, storage.getIngredientBox1UpgradeCost, "Storage Box Upgrade Max Storage 1"));
        upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x+140,y +85,58,50, 10, storage.getIngredientBox2UpgradeCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", storage.upgradeIngredientBox2Storage, storage.getIngredientBox2UpgradeCost, "Storage Box Upgrade Max Storage 2"));
    
}


function rollingMattUpgradesSetup(x,y) {//400 10
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x+140,y+65,58,50, 10, rollingMatt.getSpeedUpgradeCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", rollingMatt.upgradeSpeed, rollingMatt.getSpeedUpgradeCost, "RollingMatt Upgrade Speed"));
}
function cuttingBoardUpgradesSetup(x,y) { //201 200
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x+ 140,y+25,58,50, 10, cuttingStation.getCuttingSpeedCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", cuttingStation.upgradeCuttingSpeed, cuttingStation.getCuttingSpeedCost, "Cutting Board Upgrade Speed"));
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x+ 140,y+85,58,50, 10, cuttingStation.getSecondBoardCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", cuttingStation.buyNewCuttingBoard, cuttingStation.getSecondBoardCost, "Cuttin Board Upgrade Second Board"));
}
function teaKettleUpgradesSetup(x,y) { //401 200
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x + 140,y+25,58,50, 10, riceCooker.getCookTimeUpgradeCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", riceCooker.riceCookerUpgradeCookTime, riceCooker.getCookTimeUpgradeCost, "Tea kettle Upgrade Speed"));
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,x+140,y+85,58,50, 10, riceCooker.getRiceCountUpgradeCost(),
        'Black', "25px Arial", "Gray", "Green", "Red", riceCooker.riceCookerUpgradeRiceCount, riceCooker.getRiceCountUpgradeCost, "Tea kettle Upgrade Storage"));
}

function riceCookerUpgradesDraw(x,y) {//200
    var data = riceCooker.getData();
    drawing.drawRoundRect(context, x, y, 200, 150, 5, true, true, 'Gray', "Green", 1);
    drawing.printAtWordWrap(context, "RiceCooker", x + 100, y + 18, 20, 50, "Green", "20px Arial", "center");
    drawing.printAtWordWrap(context, "Cooking Time", x + 5, y + 40, 20, 50, 'Green', "20px Arial", "left" );
    drawing.printAtWordWrap(context, "Storage count", x + 5, y + 100, 20, 50, 'Green', "20px Arial", "left" );
    drawing.drawTextBox(context, x + 100, y + 30, 30,30, data.cookTime.toString(), "20px Arial");
    drawing.drawTextBox(context, x + 100, y + 90, 30,30, data.riceCount.toString(), "20px Arial");
}
function storageBoxUpgradesDraw(x,y) {//0 10
    var data = storage.getData();
    drawing.drawRoundRect(context, x, y, 200, 150, 5, true, true, 'Gray', "Green", 1);
    drawing.printAtWordWrap(context, "Storage", x+100, y+18, 20, 50, "Green", "20px Arial", "center");
    drawing.printAtWordWrap(context, "Veg Max Storage", x+5, y+40, 20, 100, 'Green', "20px Arial", "left" );
    drawing.printAtWordWrap(context, "Fish Max Storage", x+5, y+100, 20, 100, 'Green', "20px Arial", "left" );
    drawing.drawTextBox(context, x + 100, y + 30, 30,30, data.ingredientBox1.maxStorage.toString(), "20px Arial");
    drawing.drawTextBox(context, x + 100, y + 90, 30,30, data.ingredientBox2.maxStorage.toString(), "20px Arial");
}
function rollingMattUpgradesDraw(x,y) {//400 10
    var data = rollingMatt.getData();
    drawing.drawRoundRect(context, x, y, 200, 150, 5, true, true, 'Gray', "Green", 1);
    drawing.printAtWordWrap(context, "Rolling Matt", x+100, y+18, 20, 150, "Green", "20px Arial", "center");
    drawing.printAtWordWrap(context, "Rolling Speed", x+5, y+85, 20, 50, 'Green', "20px Arial", "left" );
    drawing.drawTextBox(context, x + 100, y + 75, 30,30, data.speed.toString(), "20px Arial");
    
}
function cuttingBoardUpgradesDraw(x,y) {//201 200
    var data = cuttingStation.getData();
    drawing.drawRoundRect(context, x, y, 199, 150, 5, true, true, 'Gray', "Green", 1);
    drawing.printAtWordWrap(context, "Cutting Board", x+100, y+18, 20, 150, "Green", "20px Arial", "center");
    drawing.printAtWordWrap(context, "Cutting Speed", x+5, y+40, 20, 50, 'Green', "20px Arial", "left" );
    drawing.printAtWordWrap(context, "Second Board", x+5, y+100, 20, 50, 'Green', "20px Arial", "left" );
    drawing.drawTextBox(context, x + 100, y + 30, 30,30, data.cuttingSpeed.toString(), "20px Arial");
    
}
function teaKettleUpgradesDraw(x,y) {//401 200
    drawing.drawRoundRect(context, x, y, 199, 150, 5, true, true, 'Gray', "Green", 1);
    drawing.printAtWordWrap(context, "Tea Kettle", x+100, y+18, 20, 100, "Green", "20px Arial", "center");
    drawing.printAtWordWrap(context, "Boiling Time", x+5, y+40, 20, 50, 'Green', "20px Arial", "left" );
    drawing.printAtWordWrap(context, "Storage count", x+5, y+100, 20, 50, 'Green', "20px Arial", "left" );
}

function drawSpeedUpgrade(x,y, callback, name, cost) {
    ioControl.addButton(shapes.createButton(x,y,100,50,cost.toString(), true, 1, callback, name));
}

function setupMaxStorageUpgrade(x, y, callback, name, cost) {
    ioControl.addButton(shapes.createButton(x,y,100,50,cost.toString(), true, 1, callback, name));
}