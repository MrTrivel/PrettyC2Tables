// Global variables
var gSaveString;
var gTable;
var gTableRows;

// Hardcoded data
var altClassName = "alt";

function initializeGlobalVariables()
{
  gTable = document.getElementById("c2table");
  gSaveString = document.getElementById("saveString");
}


function doClick() {

  initializeGlobalVariables();

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
    return;
  }

  // Game data needed for unlocks and calculations
  var hasMesmer = game.talents.mesmer.purchased;
  var HZReached = game.global.highestLevelCleared+1;
  var radHZReached = game.global.highestRadonLevelCleared;
  var prisonClear = game.global.prisonClear;
  var totalC2 = game.global.totalSquaredReward;

  // Check if C2s are even unlocked
  if (HZReached < 65)
  {
    addRowToTable(["C<sup>2</sup> has not", "been", "unlocked."]);
    return;
  }

  // Initialize default challenges that are already available when unlocking C2 or C3
  var challengesU1 = ["Discipline", "Metal", "Size", "Balance", "Meditate"];
  var challengesU2 = ["Unlucky", "Downsize", "Transmute", "Unbalance", "Duel", "Trappapalooza"];

  // Check if there are more basic C2s unlocked
  if (prisonClear >= 1) challengesU1.push("Electricity");
  if(HZReached >= 130) challengesU1.push("Slow");
  if(HZReached >= 145) challengesU1.push("Nom");
  if(HZReached >= 150) challengesU1.push("Mapology");
  if(HZReached >= 165) challengesU1.push("Toxicity");
  if(HZReached >= 180) { challengesU1.push("Watch"); challengesU1.push("Lead"); }
  if(HZReached >= 70) challengesU1.push("Trapper");

  // Check if there are more special C2s unlocked
  challengesU1.push("Trimp"); // Already unlocked when having C2s unlocked
  if(HZReached >= 120) challengesU1.push("Coordinate");
  if(HZReached >= 425) challengesU1.push("Obliterated");
  if(totalC2 >= 4500) challengesU1.push("Eradicated");

  // Check if there are more C3s unlocked
  if(radHZReached >= 69) challengesU2.push("Wither");
  if(radHZReached >= 84) challengesU2.push("Quest");


  // Calculate and add them to the table
  var c2Percent = calcChallenges(game, challengesU1, hasMesmer, radHZReached);
  addRowToTable(["Total C<sup>2</sup>:", "", c2Percent + "%"]);

  if (radHZReached >= 64)
  {
    var c3Percent = calcChallenges(game, challengesU2, hasMesmer, radHZReached);
    addRowToTable(["Total C<sup>3</sup>:", "", c3Percent + "%"]);
    addRowToTable(["Total C<sup>∞</sup>:", "", Math.round(totalC2) + "%"]);
  }
};

function calcChallenges(game, challengeData, hasMesmer, radHZReached)
{
  var totalC2Percent = 0;
  for (var i = 0 ; i < challengeData.length ; i++)
  {
    var challenge = challengeData[i];
    if (game.c2[challenge] == "undefined") continue;

    var challengeZone = Math.min(game.c2[challenge], getC2HZE(radHZReached))
    var percent = getC2Percent(challenge, challengeZone, hasMesmer);

    totalC2Percent += percent;

    addRowToTable([challenge, challengeZone, percent + "%"]);
  }
  return totalC2Percent;
}

function getC2Percent(challenge, HZE, isMesmer) {

  var zonesForBonus = 0; // zones needed for percentage increase
  var currentBonus = 0; // current percentage increases by

  var zonesForBonusIncrease = 0; // zones needed for bonus increase
  var bonusIncrease = 0; // bonus increases by how much

  var currentZone = 0; // current zone
  var currentPercent = 0; // current C2 percentage

  switch (challenge)
  {
    // U1 Cases
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

    // U2 Cases
    case "Trappapalooza":
      zonesForBonus = 10;
      zonesForBonusIncrease = 50;
      bonusIncrease = 2;
      currentBonus = 3;
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
