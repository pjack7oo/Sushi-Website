import * as ioControl     from './iocontrol.js';
import * as shapes        from './shapes.js';
import * as riceCooker    from '../objects/riceCooker.js';
import * as rollingMatt   from '../objects/rollingmatt.js';
import * as player        from '../objects/player.js';
//import * as plates      from '../objects/plates.js';
import * as level         from '../objects/level.js';
import * as ingredientBox from '../objects/ingredientbox.js';

var gameData = {};

var riceCookerUpgrades = {};
var upgrades = {};
var testObject = {'level': 2, 'money': 1500, 'upgrades': upgrades, 'saveNum': 1};
var retrievedItem;

export function saveINIT() {
    ioControl.addButton(shapes.createButton(200, 400, 100, 50, "Save", true, 1, save, 'SaveGame'));
    ioControl.addButton(shapes.createButton(300, 400, 100, 50, "Load", true, 1, load, 'LoadGame'));
}

function save() {
    getGameData();
    localStorage.setItem('testObject', encrypt(gameData));
    console.log('Saved', gameData);
    
}

function load() {
    retrievedItem = localStorage.getItem('testObject');
    retrievedItem = decrypt(retrievedItem);
    retrievedItem = JSON.parse(retrievedItem);
    gameData = retrievedItem;
    loadData();
    console.log(retrievedItem);
}

function getGameData() {
    let riceCookerUpgrades    = riceCooker.getData(),
        rollingMattUpgrades   = rollingMatt.getData(),
        ingredientBoxUpgrades = ingredientBox.getData(),
        playerData            = player.getData(),
        levelData             = level.getData();

    upgrades.riceCooker = riceCookerUpgrades;
    upgrades.rollingMatt = rollingMattUpgrades;
    upgrades.ingredientBox = ingredientBoxUpgrades;
    gameData.upgrades = upgrades;
    gameData.player   = playerData;
    gameData.level    = levelData;
}

function loadData() {
    riceCooker.setData(gameData.upgrades.riceCooker);
    rollingMatt.setData(gameData.upgrades.rollingMatt);
    ingredientBox.setData(gameData.upgrades.ingredientBox);

    player.setData(gameData.player)
    level.setData(gameData.level);
}


function encrypt(data) {
    
    let encrypt= CryptoJS.AES.encrypt(JSON.stringify(data), "SaveGame");
    return encrypt;
}

function decrypt(data) {
    let decrypt = CryptoJS.AES.decrypt(data, "SaveGame");
    decrypt = decrypt.toString(CryptoJS.enc.Utf8);
    return decrypt;
}