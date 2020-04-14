import * as ioControl from './iocontrol.js';
import * as shapes    from './shapes.js';

var riceCooker = {'cookTime': 10, 'riceCount': 5};
var upgrades = {'riceCooker': riceCooker};
var testObject = {'level': 2, 'money': 1500, 'upgrades': upgrades, 'saveNum': 1};
var retrievedItem;

export function saveINIT() {
    ioControl.addButton(shapes.createButton(200, 400, 100, 50, "Save", true, 1, save, 'SaveGame'));
    ioControl.addButton(shapes.createButton(300, 400, 100, 50, "Load", true, 1, load, 'LoadGame'));
}

function save() {
    
    localStorage.setItem('testObject', encrypt(testObject));
    console.log('Saved', testObject);
    
}

function load() {
    retrievedItem = localStorage.getItem('testObject');
    retrievedItem = decrypt(retrievedItem);
    retrievedItem = JSON.parse(retrievedItem);
    console.log(retrievedItem);
    
}


function encrypt(data) {
    var iterations = 10000,
        keyLen     = 64
    let encrypt= CryptoJS.AES.encrypt(JSON.stringify(data), "SaveGame");
    return encrypt;
}

function decrypt(data) {
    let decrypt = CryptoJS.AES.decrypt(data, "SaveGame");
    decrypt = decrypt.toString(CryptoJS.enc.Utf8);
    return decrypt;
}