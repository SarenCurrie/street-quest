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
        var initialMarkerPos = {lat: positionToCheck.lat(), lng: positionToCheck.lng()};
        quest.positions[0] = initialMarkerPos;
        for (var i = 0; i < quest.action[0].nextPoint.length; i++) {
          // We need another function to capture the 'i' parameter to not reference the same
          // 'i' variable in each callback invocation.
          var spawnQuestPointTmp = function (i) {
            var icon = quest.action[i+1].icon;
            var title = quest.action[0].nextPoint[i];
            spawnQuestPoint(initialMarkerPos, title, icon, -100 + i * 200, 100 + i * 200, function (err, marker) {
              if (err) {
                console.log(err);
                return;
              }
              // Insert newly created markers into questlog.
              quest.positions[i+1] = {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()};
              marker.addListener('click', function () {
                if (questInRange(playerCircle, marker)) {
                  checkPosition(questlog, marker.getPosition());
                }
              });
            });
          };
          spawnQuestPointTmp(i);
        }
      });
    }
  });
  return;
}
