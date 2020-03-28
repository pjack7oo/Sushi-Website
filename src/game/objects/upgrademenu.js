import * as ioControl from '../utils/iocontrol.js';
import * as levelControl from './level.js';
import * as drawing      from '../utils/drawing.js';
import * as shapes       from '../utils/shapes.js';
import * as player       from './player.js';

var activeInterval;
var canvas, context;

export function upgradeScreen()
{

    ioControl.clearButtons();
    ioControl.addButton(shapes.createButton(350,200,100,50,"Next-Level", true, 1, startNextLevel, "StartLevel-Next"));
    canvas.addEventListener('click', ioControl.buttonClick, false);
    

    upgradeUpdate();
}
export function upgradeInit(canvs) {
    canvas = canvs;
    context = canvas.getContext('2d');

}

function upgradeUpdate() {
    activeInterval = requestAnimationFrame(upgradeUpdate);
    
    upgradeDraw();
}

function upgradeDraw()
{
    drawing.clear(context);
    drawing.drawTextBox(context, 225, 0, 150, 100, "Upgrade Menu", "30px Arial", "Red", "white", "Red");
    riceCookerUpgradesDraw();
    
    ioControl.drawIoButtons();
}

function startNextLevel() {
    cancelAnimationFrame(activeInterval);

    levelControl.startLevel();
}

function checkPrice(cost, callback) {
    if (player.getCurrentMoney >= cost) {
        player.addMoney(-cost);
        callback();
    }
}

function riceCookerUpgradesSetup() {
    ioControl.addButton(shapes.createButton(100,200,100,50,"500", true, 1, startNextLevel, "Upgrade Cook Time"));
    setupMaxStorageUpgrade(100,250,checkPrice)
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