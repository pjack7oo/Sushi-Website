import * as ingredientBox from "./ingredientbox.js";
import * as ingredients from "./ingredients.js";
import * as cutSt from "./cuttingstation.js";
import * as timedBox from "../utils/timedBox.js";
import * as fish from "./fish.js";
var money = 2000;
var currentLevel = 0;

export function getCurrentMoney() {
  return money;
}

export function hasEnoughMoney(cost) {
  return money >= cost;
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
    let ret = ingredientBox.fillBoxes(name);
    money -= cost * ret;
  } else {
    if (!hasEnoughMoney(cost)) {
      notEnoughMoneyBox("Not enough money!");
    } else {
      notEnoughStorageBox("Not enough storage Space!");
    }
  }
}
function notEnoughMoneyBox(text) {
  timedBox.createTimedBox(
    320,
    200,
    150,
    50,
    text,
    2,
    15,
    "center",
    true,
    true,
    "white",
    "red"
  );
}
function notEnoughStorageBox(text) {
  timedBox.createTimedBox(
    320,
    200,
    170,
    50,
    text,
    2,
    15,
    "center",
    true,
    true,
    "white",
    "red"
  );
}

export function getAvocado() {
  let name = ingredients.ingredients.AVOCADO,
    cost = ingredients.getIngredientCost(name);
  if (hasEnoughMoney(cost) && !ingredientBox.isFullStorage(name)) {
    let ret = ingredientBox.fillBoxes(name);
    money -= cost * ret;
  } else {
    if (!hasEnoughMoney(cost)) {
      notEnoughMoneyBox("Not enough money!");
    }
  }
}

export function getCucumber() {
  let name = ingredients.ingredients.CUCUMBER,
    cost = ingredients.getIngredientCost(name);
  if (hasEnoughMoney(cost) && !ingredientBox.isFullStorage(name)) {
    let ret = ingredientBox.fillBoxes(name);
    money -= cost * ret;
  } else {
    if (!hasEnoughMoney(cost)) {
      notEnoughMoneyBox("Not enough money!");
    }
  }
}

export function getRice() {
  //ingredientBox.fillBoxes(ingredients.ingredients.CRAB);
}

export function getTuna() {
  let name = ingredients.ingredients.TUNA,
    cost = ingredients.getIngredientCost(name);
  let tuna = fish.createTuna(cost);
  if (
    hasEnoughMoney(cost) &&
    !ingredientBox.isFullStorage(name) &&
    cutSt.hasNoItem(0) &&
    cutSt.isntActive(0)
  ) {
    cutSt.insertFish(tuna, 0);
    //ingredientBox.fillBoxes(name);
    money -= cost;
  } else if (
    hasEnoughMoney(cost) &&
    !ingredientBox.isFullStorage(name) &&
    cutSt.hasNoItem(1) &&
    cutSt.isntActive(1) &&
    cutSt.hasSecondBoard()
  ) {
    cutSt.insertFish(tuna, 1);
    //ingredientBox.fillBoxes(name);
    money -= cost;
  } else {
    if (!hasEnoughMoney(cost)) {
      notEnoughMoneyBox("Not enough money!");
    }
  }
}

export function getSalmon() {
  let name = ingredients.ingredients.SALMON,
    cost = ingredients.getIngredientCost(name);
  let salmon = fish.createSalmon(cost);

  if (
    hasEnoughMoney(cost) &&
    !ingredientBox.isFullStorage(name) &&
    cutSt.hasNoItem(0) &&
    cutSt.isntActive(0)
  ) {
    cutSt.insertFish(salmon, 0);
    //ingredientBox.fillBoxes(name);
    money -= cost;
  } else if (
    hasEnoughMoney(cost) &&
    !ingredientBox.isFullStorage(name) &&
    cutSt.hasNoItem(1) &&
    cutSt.isntActive(1) &&
    cutSt.hasSecondBoard()
  ) {
    cutSt.insertFish(salmon, 1);
    //ingredientBox.fillBoxes(name);

    money -= cost;
  } else {
    if (!hasEnoughMoney(cost)) {
      notEnoughMoneyBox("Not enough money!");
    }
  }
}
export function getEel() {
  let name = ingredients.ingredients.EEL,
    cost = ingredients.getIngredientCost(name);
  let eel = fish.createEel(cost);
  if (
    hasEnoughMoney(cost) &&
    !ingredientBox.isFullStorage(name) &&
    cutSt.hasNoItem(0) &&
    cutSt.isntActive(0)
  ) {
    cutSt.insertFish(eel, 0);
    //ingredientBox.fillBoxes(name);
    money -= cost;
  } else if (
    hasEnoughMoney(cost) &&
    !ingredientBox.isFullStorage(name) &&
    cutSt.hasNoItem(1) &&
    cutSt.isntActive(1) &&
    cutSt.hasSecondBoard()
  ) {
    cutSt.insertFish(eel, 1);
    //ingredientBox.fillBoxes(name);
    money -= cost;
  } else {
    if (!hasEnoughMoney(cost)) {
      notEnoughMoneyBox("Not enough money!");
    }
  }
}
