function checkPosition(questlog, markerToCheck, markersPos, map) {
  var hit = false;
  console.log('Doing magic! (^ . ^) ~ ~ * . *');
  questlog.forEach(function(quest){
    var arrayLength = quest.positions.length;
    for (var i = 0; i < arrayLength; i++){
      if (quest.positions[i] == null) {
        continue;
      }
      if (markerToCheck.getPosition().lng() == quest.positions[i].getPosition().lng()
      && markerToCheck.getPosition().lat() == quest.positions[i].getPosition().lat()){
        // we are in a quest, do that action
        // check what the progress is for this quest
        console.log('Matching point found.');
        // first things first, if any of the points we need to go to haven't been made, make them right now! ahh!
        if (quest.action[i].completed != true){ // these should be changed into something that's not boolean comparisons lol
        if (quest.action[i].create_points){
          for (var j = 0; j < quest.action[i].create_points[quest.action[i].progress].length; j++){
            if (quest.positions[quest.action[i].create_points[quest.action[i].progress][j]] == null){
              var initialMarkerPos = {lat: markerToCheck.getPosition().lat(), lng: markerToCheck.getPosition().lng()};
              var spawnQuestPointTmp = function (i,j) {
                var icon = quest.action[quest.action[i].create_points[quest.action[i].progress][j]].icon;
                var title = quest.action[quest.action[i].create_points[quest.action[i].progress][j]].name;
                spawnQuestPoint(initialMarkerPos, title, icon, -100 + (Math.floor(Math.random() * 6) + 1) * 10, 100 + (Math.floor(Math.random() * 6) + 1 ) * 10, function (err, marker) {
                  if (err) {
                    console.log(err);
                    return;
                  }
                  // Insert newly created markers into questlog.
                  quest.positions[quest.action[i].create_points[quest.action[i].progress][j]] = marker;
                  marker.addListener('click', function () {
                    if (questInRange(playerCircle, marker)) {
                      checkPosition(questlog, marker);
                    }
                  });
                });
              };
              spawnQuestPointTmp(i,j);
            }
          }
        }
      }
      // then, check if we've been here before
      if (quest.action[i].visited != true){
        quest.action[i].visited = true;
        console.log('This should print the introduction.');
        ui.makeDialog(quest.action[i].npcName, quest.action[i].intro_dialog);
        // if this is the first time we've been here, see if anything else needs doing
        if (quest.action[i].to_visit.length == 1 && quest.action[i].to_visit[0].length == 0){
          quest.action[i].completed = true;
          quest.action[i].progress += 1;
        }
        // if we've been here, and we've finished here, then say that's the case, using the u r done dialog
      } else if (quest.action[i].completed == true){
        console.log('This should print the final text.');
        ui.makeDialog(quest.action[i].npcName, quest.action[i].completion_dialog[quest.action[i].progress]);
      }
      else{
        // if we're here, that means we've been here before, but something is not done. check the places we have left to go
        for (var j = 0; j < quest.action[i].to_visit[quest.action[i].progress].length; j++){
          // check if we have been to a place, if not, say something about going there or whatever
          if (quest.action[quest.action[i].to_visit[quest.action[i].progress][j]].visited == false){
            console.log('This text shows if a location has not been visited.')
            ui.makeDialog(quest.action[i].npcName, quest.action[i].been_here_not_visited_dialog[quest.action[i].progress][j]);
            return;
            // now check if we've been there, but havan't finished the task they gave
          }
          if (quest.action[quest.action[i].to_visit[quest.action[i].progress][j]].completed == false && quest.action[i].been_here_not_completed_dialog) {
            console.log('This text shows if a location has not had the task completed.');
            ui.makeDialog(quest.action[i].npcName, quest.action[i].been_here_not_completed_dialog[quest.action[i].progress][j]);
            return;
          }
        }
        // if none of these returned, we've actually completed the allocated task things, good job!
        // print the completion dialog for this section, give the reward, delete relevant points, and increment the progress for this node
        console.log('This text indicates completion, and should transfer into the next phase.');
        ui.makeDialog(quest.action[i].npcName, quest.action[i].completion_dialog[quest.action[i].progress]);
        quest.action[i].progress += 1;
        // if there is no more places to go, we've completed this segement
        if (quest.action[i].progress >= quest.action[i].to_visit.length){
          quest.action[i].completed = true;
        }

        // raise the dead! hopefully we can bring them back ;o
        if (i == 0){ // if we finished the start
          console.log('Putting quest points back.');
          markersPos.forEach(function(markerInfo){
            if (!(markerInfo.lng  == markerToCheck.getPosition().lng() && markerInfo.lat  == markerToCheck.getPosition().lat())){
              markerInfo.marker.setMap(map);
            }
          });
        }

        // get a reward
        var player = getPlayerData();
        if(quest.action[i].rewards){
          player.gold += 10;
          player.addItems(quest.action[i].rewards[quest.action[i].progress-1]);
          player.save();
          ui.updatePlayerStats(player);
        }
        if(quest.action[i].remove_points){
          for (var j=0; j < quest.action[i].remove_points[quest.action[i].progress-1].length; j++) {
            quest.positions[quest.action[i].remove_points[quest.action[i].progress-1][j]].setMap(null);
            quest.positions[quest.action[i].remove_points[quest.action[i].progress-1][j]] = null;
          }
        }
      }
      hit = true;
      return;
    }
  }});
  // you clicked a point that isnt associated with a quest, oh boy, allocate and call this again
  console.log('Unasscoiated! Uh oh!');
  if (!hit){
    questlog.some(function(quest){
      if  (quest.active == false){
        console.log('Found inactive quest!');
        quest.active = true;
        quest.positions[0] = markerToCheck;
        checkPosition(questlog, markerToCheck);
        // delete all the other markers from the map (maybe)
        // this should only occur if all the markers are show anyway
        console.log('Removing other quest points.');
        markersPos.forEach(function(markerInfo){
          if (!(markerInfo.lng  == markerToCheck.getPosition().lng() && markerInfo.lat  == markerToCheck.getPosition().lat())){
            markerInfo.marker.setMap(null);
          }
        });
        return true;
      }  });
    }
  }
