var fs = require("fs");
var RollSchema = require("./models/rolls.js"),
  RollImageSchema = require("./models/rollImage.js");

var callrollImage = "./public/Images/californiaRoll.png";
var alsakarollImage = "./public/Images/alaskaroll.png";
var bostonRollImage = "./public/Images/bostonRoll.png";
var classicRollImage = "./public/Images/classicRoll.png";
var dragonRollImage = "./public/Images/dragonRoll.png";
var eelAvocadoRollImage = "./public/Images/eel-avocado-roll.png";
var salmonRollImage = "./public/Images/salmonRoll.png";
var mangoRollImage = "./public/Images/mangoRoll.png";
var spicyTatakiRollImage = "./public/Images/SpicyTataki.png";
var tigerRollImage = "./public/Images/TigerRoll.png";
var calliforniaRoll = new RollSchema({
  name: "California Roll",
  type: "Roll",
  inner: ["Avocado", "Crab", "Cucumber"],
  outer: ["Rice"],
  nori: true,
  description: "Standard roll follow basic instructions",
  image: { data: fs.readFileSync(callrollImage), contentType: "image/png" },
});
var AlaskaRoll = new RollSchema({
  name: "Alaska Roll",
  type: "Roll",
  inner: ["Avocado", "Salmon"],
  outer: ["Rice"],
  nori: true,
  description: "Standard roll follow basic instructions",
  image: { data: fs.readFileSync(alsakarollImage), contentType: "image/png" },
});
var BostonRoll = new RollSchema({
  name: "Boston Roll",
  type: "Roll",
  inner: ["Crab", "Cucumber", "Salmon"],
  outer: ["Rice"],
  nori: true,
  description:
    "Standard roll follow basic instructions. Optionally top with sesame seeds or roe.",
  image: { data: fs.readFileSync(bostonRollImage), contentType: "image/png" },
});
var DragonRoll = new RollSchema({
  name: "Dragon Roll",
  type: "Roll",
  inner: ["Crab", "Cucumber", "Eel"],
  outer: ["Avocado", "Rice"],
  nori: true,
  description:
    "Standard roll follow basic instructions except to layer the Avocado on the outside after rolling.",
  image: { data: fs.readFileSync(dragonRollImage), contentType: "image/png" },
});
var EelAvocadoRoll = new RollSchema({
  name: "Eel Avocado Roll",
  type: "Roll",
  inner: ["Eel"],
  outer: ["Avocado", "Rice"],
  nori: true,
  description:
    "Standard roll follow basic instructions except to layer the Avocado on the outside after rolling.",
  image: {
    data: fs.readFileSync(eelAvocadoRollImage),
    contentType: "image/png",
  },
});
var MangoRoll = new RollSchema({
  name: "Mango Roll",
  type: "Roll",
  inner: ["Avocado", "Crab", "Tempura shrimp"],
  outer: ["Rice", "Mango slices"],
  nori: true,
  description:
    "Layer the Mango slices on the outside after rolling. You can use creamy mango paste to help the mango stick.",
  image: { data: fs.readFileSync(mangoRollImage), contentType: "image/png" },
});
var SpiceTatakiRoll = new RollSchema({
  name: "Spice Tataki Roll",
  type: "Roll",
  inner: ["Spicy Tuna"],
  outer: ["Avocado", "Tuna", "Rice"],
  nori: true,
  description: "Layer the Avocado and Tuna on the outside after rolling.",
  image: {
    data: fs.readFileSync(spicyTatakiRollImage),
    contentType: "image/png",
  },
});
var TigerRoll = new RollSchema({
  name: "Tiger Roll",
  type: "Roll",
  inner: ["Avocado", "Cucumber", "Tempura shrimp"],
  outer: ["Rice"],
  nori: true,
  description: "Standard roll follow basic instructions.",
  image: { data: fs.readFileSync(tigerRollImage), contentType: "image/png" },
});

var SalmonRoll = new RollSchema({
  name: "Salmon Roll",
  type: "Roll",
  inner: ["Salmon"],
  outer: ["Rice"],
  nori: true,
  description: "Standard roll follow basic instructions.",
  image: { data: fs.readFileSync(salmonRollImage), contentType: "image/png" },
});

var classicRoll = new RollSchema({
  name: "Classic Roll",
  type: "Roll",
  inner: ["Avocado", "Cucumber", "Tuna"],
  outer: ["Rice"],
  nori: true,
  description: "Standard roll follow basic instructions.",
  image: { data: fs.readFileSync(classicRollImage), contentType: "image/png" },
});

function upload(db) {
  db.once("open", function () {
    AlaskaRoll.save();
    BostonRoll.save();
    calliforniaRoll.save();
    classicRoll.save();
    DragonRoll.save();
    EelAvocadoRoll.save();
    MangoRoll.save();
    SalmonRoll.save();
    SpiceTatakiRoll.save();
    TigerRoll.save();
  });
}

module.exports = upload;
