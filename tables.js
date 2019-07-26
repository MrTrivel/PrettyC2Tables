function getBasicC2(HZE, isMesmer, challenge = "standard") {
  
  var zonesForBonus = 0; // zones needed for percentage increase
	var currentBonus = 0; // current percentage increases by
  
  var zonesForBonusIncrease = 0; // zones needed for bonus increase
  var bonusIncrease = 0; // bonus increases by how much
  
  var currentZone = 0; // current zone
  var currentPercent = 0; // current C2 percentage
  
  switch (challenge)
  {
  	case "standard":
    {
    	zonesForBonus = 10;
      zonesForBonusIncrease = 100;
      bonusIncrease = isMesmer?3:1;
      currentBonus = isMesmer?3:1;
      break;
    }
  	case "Trimp":
    {
    	zonesForBonus = 10;
      zonesForBonusIncrease = 40;
      bonusIncrease = 3;
      currentBonus = 3;
      break;
    }
  	case "Trapper":
    {
    	zonesForBonus = 10;
      zonesForBonusIncrease = 50;
      bonusIncrease = 2;
      currentBonus = 1;
      break;
    }
  	case "Coordinate":
    {
    	zonesForBonus = 3;
      zonesForBonusIncrease = 30;
      bonusIncrease = 1;
      currentBonus = 1;
      break;
    }
  	case "Obliterated":
    {
    	zonesForBonus = 1;
      zonesForBonusIncrease = 10;
      bonusIncrease = 1;
      currentBonus = 1;
      break;
    }
  	case "Eradicated":
    {
    	zonesForBonus = 1;
      zonesForBonusIncrease = 2;
      bonusIncrease = 2;
      currentBonus = 10;
      break;
    }
  }
  
  for (i = 0; i < Math.floor(HZE/zonesForBonus); i++)
  {
  	currentZone += zonesForBonus;
    currentPercent += currentBonus;
    if (currentZone%zonesForBonusIncrease == 0) currentBonus += bonusIncrease;
  }
    
	return currentPercent;
}

function doClick() {
    var foo = document.getElementById("foo");
    var result = document.getElementById("result");
    var table = document.getElementById("c2table");
    
    var easyC2 = ["Discipline", "Metal", "Size", "Balance", "Meditate"];
    var specialC2s = ["Trimp"];
    
		var game = JSON.parse(LZString.decompressFromBase64(foo.value));
    console.log(foo.value);
    console.log(game);
    foo.value = "";
    
    var hasMesmer = game.talents.mesmer.purchased;
    var HZReached = game.global.highestLevelCleared+1;
    var prisonClear = game.global.prisonClear;
    var totalC2 = game.global.totalSquaredReward;
    
    if(HZReached >= 70) specialC2s.push("Trapper");
    if (prisonClear == 1) easyC2.push("Electricity");
    if(HZReached >= 120) specialC2s.push("Coordinate");
    if(HZReached >= 130) easyC2.push("Slow");
    if(HZReached >= 145) easyC2.push("Nom");
    if(HZReached >= 150) easyC2.push("Mapology");
    if(HZReached >= 165) easyC2.push("Toxicity");
    if(HZReached >= 180) { easyC2.push("Watch"); easyC2.push("Lead"); }
    if(HZReached >= 425) specialC2s.push("Obliterated");
    if(totalC2 >= 4500) specialC2s.push("Eradicated");
    
    for (var i = 0; i < easyC2.length; i++) {
     var key = easyC2[i];
     var isAlt = i%2;
     
     var row = table.insertRow(-1);
     
     var cellChallenge = row.insertCell(0);
     var cellHZE = row.insertCell(1);
     var cellC2Percent = row.insertCell(2);
     
     
     if (game['c2'][key] !== undefined)
     {
     		var className = isAlt==1?"alt":"";
     		cellChallenge.innerHTML = easyC2[i];
     cellChallenge.className = className;
        cellHZE.innerHTML = game['c2'][key];
     cellHZE.className = className;
        cellC2Percent.innerHTML = getBasicC2(game['c2'][key], hasMesmer) + "%";
     cellC2Percent.className =className;
     }
      
    }
    for (var j = 0; j < specialC2s.length; j++) {
     var key2 = specialC2s[j];
     var isAlt2 = (i+j)%2;
     
     var row2 = table.insertRow(-1);
     var cellChallenge2 = row2.insertCell(0);
     var cellHZE2 = row2.insertCell(1);
     var cellC2Percent2 = row2.insertCell(2);
     
     if (game['c2'][key2] !== undefined)
     {
     
     		var className = isAlt2==1?"alt":"";
     		cellChallenge2.innerHTML = easyC2[j];
     cellChallenge2.className = className;
        cellHZE2.innerHTML = game['c2'][key2];
     cellHZE2.className = className;
        cellC2Percent2.innerHTML = getBasicC2(game['c2'][key2], hasMesmer, specialC2s[j]) + "%";
		cellC2Percent2.className = className;
     }
    }
    
    var rowTotal = table.insertRow(-1);
    var cellTotal = rowTotal.insertCell(0);
    var cellBlank = rowTotal.insertCell(1);
    var cellC2PercentT = rowTotal.insertCell(2);
    
    var isAlt3 = (i+j)%2;
     		var className = isAlt3==1?"alt":"";
    
    cellTotal.innerHTML = "Total:";
    cellC2PercentT.innerHTML = totalC2 + "%";
     cellTotal.className = className;
     cellBlank.className = className;
     cellC2PercentT.className = className;
};

