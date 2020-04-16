import * as ioControl     from './iocontrol.js';
import * as shapes        from './shapes.js';
import * as riceCooker    from '../objects/riceCooker.js';
import * as rollingMatt   from '../objects/rollingmatt.js';
import * as player        from '../objects/player.js';
//import * as plates      from '../objects/plates.js';
import * as level         from '../objects/level.js';
import * as ingredientBox from '../objects/ingredientbox.js';
import * as cuttingSt     from '../objects/cuttingstation.js';
import * as customers     from '../objects/customers.js';



var gameData = {};
var saveUrl = "http://localhost:5000/api/account/save",
    dataUrl = "http://localhost:5000/api/account/data";
var riceCookerUpgrades = {};
var upgrades = {};
var testObject = {'level': 2, 'money': 1500, 'upgrades': upgrades, 'saveNum': 1};
var retrievedItem;
var dataWasSaved = false;

export function saveINIT(x, y) {

    ioControl.addButton(shapes.createButton(x, y, 100, 50, "SaveLocal", true, 1, save, 'SaveGame',shapes.shapeType.RECTANGLE,"center", "18px Arial"));
    y+=50;
    ioControl.addButton(shapes.createButton(x,y, 100, 50, "LoadLocal", true, 1, load, 'LoadGame',shapes.shapeType.RECTANGLE,"center", "18px Arial"));
    y+=50;
    ioControl.addButton(shapes.createButton(x,y, 100, 50, "Upload", true, 1, sendDataToServer, 'UploadGame',shapes.shapeType.RECTANGLE,"center", "18px Arial"));
    y+=50;
    ioControl.addButton(shapes.createButton(x,y, 100, 50, "DownLoad", true, 1, getDataFromServer, 'downloadGame',shapes.shapeType.RECTANGLE,"center", "18px Arial"));
}

export function save() {
    getGameData();
    localStorage.setItem('gameData', encrypt(gameData));
    console.log('Saved', gameData);
    dataWasSaved = true;
    
}

function load() {
    let retrievedItem = localStorage.getItem('gameData');
    retrievedItem = decrypt(retrievedItem);
    // retrievedItem = JSON.parse(retrievedItem);
    gameData = JSON.parse(retrievedItem);
    loadData();
}

function getGameData() {
    let riceCookerUpgrades     = riceCooker.getData(),
        rollingMattUpgrades    = rollingMatt.getData(),
        ingredientBoxUpgrades  = ingredientBox.getData(),
        cuttingStationUpgrades = cuttingSt.getData(),
        playerData             = player.getData(),
        customerData           = customers.getData(),
        levelData              = level.getData();

    upgrades.riceCooker = riceCookerUpgrades;
    upgrades.rollingMatt = rollingMattUpgrades;
    upgrades.ingredientBox = ingredientBoxUpgrades;
    upgrades.cuttingStation = cuttingStationUpgrades;
    gameData.upgrades = upgrades;
    gameData.customers = customerData;
    gameData.player   = playerData;
    gameData.level    = levelData;
    gameData.date     = new Date();
}

function loadData() {
    riceCooker.setData(gameData.upgrades.riceCooker);
    rollingMatt.setData(gameData.upgrades.rollingMatt);
    ingredientBox.setData(gameData.upgrades.ingredientBox);
    cuttingSt.setData(gameData.upgrades.cuttingStation);
    customers.setData(gameData.customers);
    player.setData(gameData.player)
    level.setData(gameData.level);
}

function sendDataToServer() {
    var session = JSON.parse(localStorage.getItem("sushicat-session"));
    var localData = localStorage.getItem('gameData');
    
    
    if (localData == null || localData == undefined){
        return;
    }
    
    var username = session.userProfileModel.username;
    var decryptedData = decrypt(localData);
    var data = JSON.parse(decryptedData);
    console.log(decryptedData);
    
    
    $.ajax({
        type: 'POST',
        url : saveUrl,
        data:"username=" + username + "&money=" + data.player.money + "&date=" + data.date + "&gameData=" + decryptedData,
        success: function(response) {
            console.log("success sendData");
            if (response.success === true) {

            } else {
                if (response.extras.msg) {
                    switch(response.extras.msg) {
                        default:
                        //TODO Display errors
                            break;
                    }
                }
            }
        },
        error: function (e) {
            console.log(e.message);
        }
    });
}

function getDataFromServer () {
    var session = JSON.parse(localStorage.getItem("sushicat-session"));
    if (session ==undefined || session == null) {
        //TODO show error that not logged in to website ingame
        return;
    }
    var username = session.userProfileModel.username;

    $.ajax({
        type: 'POST',
        url: dataUrl,
        data: "username=" + username,
        
        success: function(response) {
            console.log("successfully retrieved data");
            console.log(response);
           if (response.success == true){
            var data  = JSON.parse(response.extras.userSave.gameData);
            var encryptedData = encrypt(data);
            localStorage.setItem("gameData",encryptedData);
            
            
            
            
            load();
            console.log("successfully loaded data");
           }
            
            //todo load data into local storage
        },
        error: function(error) {
            console.log(error);
        }
    })
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