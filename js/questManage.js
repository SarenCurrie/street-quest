function checkPosition(questlog, positionToCheck) {
  questlog.forEach(function(quest){
    var arrayLength = quest.positions.length;
    for (var i = 0; i < arrayLength; i++){
      if (positionToCheck.lng() == quest.positions[i].lng && positionToCheck.lat() == quest.positions[i].lat){
        // we are in a quest, do that action
        // check what the progress is for the current quest
        if (quest.action[quest.progress].name === "visitmutiple"){
          if (i == quest.progress){
            if (quest.action[quest.progress].visitedno == quest.action[quest.progress].nextPoint.length){
              ui.makeDialog(quest.action[i].npcName, quest.action[i].completion_dialog);
            } else {
              ui.makeDialog(quest.action[i].npcName, quest.action[i].visited_dialog);
            }
          }
          else if (quest.action[i].visited == true){
            ui.makeDialog(quest.action[i].npcName, quest.action[i].visited_dialog);
          } else {
            quest.action[i].visited = true;
            quest.action[quest.progress].visitedno++;
            ui.makeDialog(quest.action[i].npcName, quest.action[i].dialog);
          }
        }
        return;
      }
    }
  });
  questlog.forEach(function(quest){
    if  (quest.active == false){
      quest.active = true;

      ui.makeDialog(quest.action[0].npcName, quest.action[0].dialog, function () {
        quest.action[0].visited = true;
        quest.positions[0] = {
          lat:positionToCheck.lat(),
          lng:positionToCheck.lng()
        };
      });
    }
  });
  return;
}
