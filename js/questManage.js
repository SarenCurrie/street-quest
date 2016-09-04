function checkPosition(questlog, markerToCheck) {
  questlog.forEach(function(quest){
    var arrayLength = quest.positions.length;
    for (var i = 0; i < arrayLength; i++){
      if (quest.positions[i] == null) {
        continue;
      }
      if (markerToCheck.getPosition().lng() == quest.positions[i].getPosition().lng()
          && markerToCheck.getPosition().lat() == quest.positions[i].getPosition().lat()){
        // we are in a quest, do that action
        // check what the progress is for the current quest
        if (quest.action[quest.progress].name === "visitmutiple"){
          if (i == quest.progress){
            if (quest.action[quest.progress].visitedno == quest.action[quest.progress].nextPoint.length){
              ui.makeDialog(quest.action[i].npcName, quest.action[i].completion_dialog);
              // remove all markers associated with the quest
              for (var i=0; i < quest.positions.length; i++) {
                quest.positions[i].setMap(null);
                quest.positions[i] = null;
              }
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
    if (!quest.active) {
      quest.active = true;

      ui.makeDialog(quest.action[0].npcName, quest.action[0].dialog, function () {
        quest.action[0].visited = true;
        var initialMarkerPos = {lat: markerToCheck.getPosition().lat(), lng: markerToCheck.getPosition().lng()};
        quest.positions[0] = markerToCheck;
        for (var i = 0; i < quest.action[0].nextPoint.length; i++) {
          // We need another function to capture the 'i' parameter to not reference the same
          // 'i' variable in each callback invocation.
          var spawnQuestPointTmp = function (i) {
            var icon = quest.action[i+1].icon;
            var title = quest.action[0].nextPoint[i];
            spawnQuestPoint(initialMarkerPos, title, icon, -100 + (i+1) * 300, 100 + i * 300, function (err, marker) {
              if (err) {
                console.log(err);
                return;
              }
              // Insert newly created markers into questlog.
              quest.positions[i+1] = marker;
              marker.addListener('click', function () {
                if (questInRange(playerCircle, marker)) {
                  checkPosition(questlog, marker);
                }
              });
            });
          };
          spawnQuestPointTmp(i);
        }
      });
    }
  });
}
