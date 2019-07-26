var foo = document.getElementById("foo"); //$("#foo");
var result = document.getElementById("result"); //$("#result");
var table = document.getElementById("c2table"); //$("#c2table");

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
    var easyC2 = ["Discipline", "Metal", "Size", "Balance", "Meditate"];
    var specialC2s = ["Trimp"];
    
		var game = JSON.parse(LZString.decompressFromBase64(foo.value));
    console.log(foo.value);
    console.log(game);
    
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
    
    var C2Table = "<thead><tr><th>Challenge</th><th>HZE</th><th>C2%</th></tr></thead>";
    for (var i = 0; i < easyC2.length; i++) {
     var key = easyC2[i];
     var isAlt = i%2;
     var rowHTML = "<tr><td>";
     if (isAlt == 1) rowHTML = '<tr class="alt"><td>'; 
     if (game['c2'][key] !== undefined) 
       C2Table += rowHTML + easyC2[i]+ "</td><td>" + game['c2'][key] + "</td><td>" + getBasicC2(game['c2'][key], hasMesmer) + "%</td></tr>";
      
    }
    for (var j = 0; j < specialC2s.length; j++) {
     var key2 = specialC2s[j];
     var isAlt2 = (i+j)%2;
     var rowHTML2 = "<tr><td>";
     if (isAlt2 == 1) rowHTML2 = '<tr class="alt"><td>'; 
     if (game['c2'][key2] !== undefined)
     	 C2Table += rowHTML2 + specialC2s[j]+ "</td><td>" + game['c2'][key2]   + "</td><td>" + getBasicC2(game['c2'][key2], hasMesmer, specialC2s[j]) + "%</td></tr>";
    }
    
    C2Table += '<tr class="total"><td>Total:</td><td></td><td>' + totalC2 + '%</td></tr>';
    table.append(C2Table);
};

