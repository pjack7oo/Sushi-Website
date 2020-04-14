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

export function removeMoney(amount) {
    money -= amount;
}

export function getData() {
    var playerData = {};
    playerData.money = money;
    return playerData;
}

export function setData(data) {
    money = data.money;
}

export function getCrab() {
    let name = ingredients.ingredients.CRAB, 
        cost = ingredients.getIngredientCost(name);
    if (hasEnoughMoney(cost) && !ingredientBox.isFullStorage(name)) {
        ingredientBox.fillBoxes(name);
        money -=cost;
    }
}

export function getAvocado() {
    let name = ingredients.ingredients.AVOCADO, 
        cost = ingredients.getIngredientCost(name);
    if (hasEnoughMoney(cost) && !ingredientBox.isFullStorage(name)) {
        ingredientBox.fillBoxes(name);
        money -=cost;
    }
    
}

export function getCucumber() {
    let name = ingredients.ingredients.CUCUMBER, 
        cost = ingredients.getIngredientCost(name);
    if (hasEnoughMoney(cost) && !ingredientBox.isFullStorage(name)) {
        ingredientBox.fillBoxes(name);
        money -=cost;
    }
    
}

export function getRice() {
    //ingredientBox.fillBoxes(ingredients.ingredients.CRAB);
}

export function getTuna() {
    let name = ingredients.ingredients.TUNA, 
        cost = ingredients.getIngredientCost(name);
    if (hasEnoughMoney(cost) && !ingredientBox.isFullStorage(name)) {
        ingredientBox.fillBoxes(name);
        money -=cost;
    }
}

export function getSalmon() {
    let name = ingredients.ingredients.SALMON, 
        cost = ingredients.getIngredientCost(name);
        
    if (hasEnoughMoney(cost) && !ingredientBox.isFullStorage(name)) {
        ingredientBox.fillBoxes(name);
        money -=cost;
    }
}

export function getEel() {
    let name = ingredients.ingredients.EEL, 
        cost = ingredients.getIngredientCost(name);
    if (hasEnoughMoney(cost) && !ingredientBox.isFullStorage(name)) {
        ingredientBox.fillBoxes(name);
        money -=cost;
    }
}