// Global variables
var gSaveString;
var gTable;
var gTableRows;

// Hardcoded data
var altClassName = "alt";

function doClick() {
  // Set the variables
  gTable = document.getElementById("c2table");
  gSaveString = document.getElementById("saveString");

  // If savestring is blank, do nothing
  if (gSaveString.value == "") return;

  // Remove all the rows in the table
  clearTable();

  // Try to parse the save string
  var game;
  try {
    game = JSON.parse(LZString.decompressFromBase64(saveString.value));
  } catch(err) {}

  // If the data couldn't be parsed due to it not being a save string, throw errors
  if (game == null || game.talents == undefined) {
    addRowToTable(["Not a Trimps", "save", "string."])
    gSaveString.value = "";
    return;
  }

  // Game data needed for unlocks and calculations
  var hasMesmer = game.talents.mesmer.purchased;
  var HZReached = game.global.highestLevelCleared+1;
  var radHZReached = game.global.highestRadonLevelCleared;
  var prisonClear = game.global.prisonClear;
  var totalC2 = game.global.totalSquaredReward;

  console.log(prisonClear);

  // Initialize default challenges that are already available when unlocking C2
  var challenges = ["Discipline", "Metal", "Size", "Balance", "Meditate"];

  // Check if there are more basic C2s unlocked
  if (prisonClear >= 1) challenges.push("Electricity");
  if(HZReached >= 130) challenges.push("Slow");
  if(HZReached >= 145) challenges.push("Nom");
  if(HZReached >= 150) challenges.push("Mapology");
  if(HZReached >= 165) challenges.push("Toxicity");
  if(HZReached >= 180) { challenges.push("Watch"); challenges.push("Lead"); }
  if(HZReached >= 70) challenges.push("Trapper");

  // Check if there are more special C2s unlocked
  challenges.push("Trimp"); // Already unlocked when having C2s unlocked
  if(HZReached >= 120) challenges.push("Coordinate");
  if(HZReached >= 425) challenges.push("Obliterated");
  if(totalC2 >= 4500) challenges.push("Eradicated");

  for (var i = 0 ; i < challenges.length ; i++)
  {
    var challenge = challenges[i];
    if (game.c2[challenge] == "undefined") continue;

    var challengeZone = Math.min(game.c2[challenge], getC2HZE(radHZReached))
    var percent = getC2Percent(challenge, challengeZone, hasMesmer);

    addRowToTable([challenge, challengeZone, percent + "%"]);
  }

  addRowToTable(["Total:", "", totalC2 + "%"]);
};

function getC2Percent(challenge, HZE, isMesmer) {

  var zonesForBonus = 0; // zones needed for percentage increase
  var currentBonus = 0; // current percentage increases by

  var zonesForBonusIncrease = 0; // zones needed for bonus increase
  var bonusIncrease = 0; // bonus increases by how much

  var currentZone = 0; // current zone
  var currentPercent = 0; // current C2 percentage

  switch (challenge)
  {
    case "Trimp":
      zonesForBonus = 10;
      zonesForBonusIncrease = 40;
      bonusIncrease = 3;
      currentBonus = 3;
      break;

    case "Trapper":
      zonesForBonus = 10;
      zonesForBonusIncrease = 50;
      bonusIncrease = 2;
      currentBonus = 1;
      break;

    case "Coordinate":
      zonesForBonus = 3;
      zonesForBonusIncrease = 30;
      bonusIncrease = 1;
      currentBonus = 1;
      break;

    case "Obliterated":
      zonesForBonus = 1;
      zonesForBonusIncrease = 10;
      bonusIncrease = 1;
      currentBonus = 1;
      break;

    case "Eradicated":
      zonesForBonus = 1;
      zonesForBonusIncrease = 2;
      bonusIncrease = 2;
      currentBonus = 10;
      break;

    default:
      zonesForBonus = 10;
      zonesForBonusIncrease = 100;
      bonusIncrease = isMesmer?3:1;
      currentBonus = isMesmer?3:1;
      break;
  }

  for (i = 0; i < Math.floor(HZE/zonesForBonus); i++)
  {
    currentZone += zonesForBonus;

    var zonesAffected = currentZone - 701;
    var weirdBonus = 0;
    if (zonesAffected > 0 && zonesAffected < zonesForBonus)
    {
      weirdBonus = 	Math.floor((currentBonus * (zonesForBonus-zonesAffected) +
      currentBonus * 5 * zonesAffected) / zonesForBonus);
    }


    currentPercent += weirdBonus > 0 ? weirdBonus : currentBonus * (currentZone > 701 ? 5 : 1);
    if (currentZone%zonesForBonusIncrease == 0) currentBonus += bonusIncrease;
  }

  return currentPercent;
}


function getC2HZE(radiumHZE = 0){
  var zone = 701;
  zone += (radiumHZE > 100) ? 100 + (Math.floor(radiumHZE / 50) * 10) : Math.floor(radiumHZE / 10) * 10;
  return zone;
}

function clearTable()
{
  gTable.innerHTML = "";
  gTableRows = 0;
}

function addCellToRow(row, text, i, className)
{
  var cell = row.insertCell(i);
  cell.innerHTML = text;
  cell.className = className;
}

function addRowToTable(data)
{
  var row = gTable.insertRow(-1);

  gTableRows++;

  for (var i = 0; i < data.length; i++)
  {
    addCellToRow(row, data[i], i, gTableRows % 2 == 0 ? altClassName : "");
  }
}
