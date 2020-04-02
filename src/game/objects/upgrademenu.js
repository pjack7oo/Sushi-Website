import * as ioControl from '../utils/iocontrol.js';
import * as levelControl from './level.js';
import * as drawing      from '../utils/drawing.js';
import * as shapes       from '../utils/shapes.js';
import * as player       from './player.js';
import * as riceCooker   from './riceCooker.js';

var activeInterval;
var canvas, context;
var upgradeButtons = [];

export function upgradeScreen()
{

    ioControl.clearButtons();
    ioControl.addButton(shapes.createButton(350,200,100,50,"Next-Level", true, 1, startNextLevel, "StartLevel-Next"));
    canvas.addEventListener('click', upgradeMenuClick, false);
    riceCookerUpgradesSetup();
    canvas.onmousemove = function(e) {
        checkButtons(e);
    }

    upgradeUpdate();
}

export function upgradeInit(canvs) {
    canvas = canvs;
    context = canvas.getContext('2d');

}

function upgradeMenuClick(e) {
    ioControl.buttonClick(e);
    ioControl.checkButtonsGiven(e, upgradeButtons);
}

function checkButtons(e) {
    let mouse = ioControl.getMouse(e);
    console.log(mouse);
    
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
    drawing.drawTextBox(context, 225, 0, 150, 100, "Upgrade Menu", "30px Arial", "Red", "white", "Red");
    riceCookerUpgradesDraw();
    
    ioControl.drawIoButtons();
    drawing.drawButtons(context, upgradeButtons);
    
}

function startNextLevel() {
    cancelAnimationFrame(activeInterval);

    levelControl.startLevel();
}



function riceCookerUpgradesSetup() {
    upgradeButtons.push(new shapes.UpgradeButton(shapes.shapeType.ROUNDRECT,100,200,100,50, 10, riceCooker.getCookTimeUpgradeCost(),
        'Black', "20px Arial", "Gray", "Green", "Red", riceCooker.riceCookerUpgradeCookTime, riceCooker.getCookTimeUpgradeCost, "Rice Cooker Upgrade Cook Time"));
    
}
function storageBoxUpgradesSetup() {

}


function rollingMattUpgradesSetup() {

}
function cuttingBoardUpgradesSetup() {

}
function teaKettleUpgradesSetup() {

}

function riceCookerUpgradesDraw() {
    drawing.drawRoundRect(context, 100, 10, 150, 200, 5, true, true, 'Gray', "Green", 1);
}
function storageBoxUpgradesDraw() {

}
function rollingMattUpgradesDraw() {

}
function cuttingBoardUpgradesDraw() {

}
function teaKettleUpgradesDraw() {

}

function drawSpeedUpgrade(x,y, callback, name, cost) {
    ioControl.addButton(shapes.createButton(x,y,100,50,cost.toString(), true, 1, callback, name));
}

function setupMaxStorageUpgrade(x, y, callback, name, cost) {
    ioControl.addButton(shapes.createButton(x,y,100,50,cost.toString(), true, 1, callback, name));
}