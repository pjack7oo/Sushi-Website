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
    ingredientBox.fillBoxes(ingredients.ingredients.CRAB);
}

export function getAvocado() {
    ingredientBox.fillBoxes(ingredients.ingredients.AVOCADO);
}

export function getCucumber() {
    ingredientBox.fillBoxes(ingredients.ingredients.CUCUMBER);
}

export function getRice() {
    //ingredientBox.fillBoxes(ingredients.ingredients.CRAB);
}