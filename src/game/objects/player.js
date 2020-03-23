import * as ingredientBox from './ingredientbox.js';
import * as ingredients   from './ingredients.js';

var money = 1000;
var currentLevel = 0;

export function getCurrentMoney() {
    return money;
}

export function hasEnoughMoney(cost) {
    return (money >= cost);
}

export function addMoney(amount) {
    money += amount;
}

export function getCrab() {
    if (hasEnoughMoney(20)) {
        ingredientBox.fillBoxes(ingredients.ingredients.CRAB);
        money -=20;
    }
    
}

export function getAvocado() {
    if (hasEnoughMoney(30)) {
        ingredientBox.fillBoxes(ingredients.ingredients.AVOCADO);
        money -=30;
    }
    
}

export function getCucumber() {
    if (hasEnoughMoney(20)) {
        ingredientBox.fillBoxes(ingredients.ingredients.CUCUMBER);
        money -=20;
    }
    
}

export function getRice() {
    //ingredientBox.fillBoxes(ingredients.ingredients.CRAB);
}