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

