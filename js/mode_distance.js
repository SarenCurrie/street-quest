// Stores all created markers.
var markersPos = [];



/**
 * Initializes the gameplay mode.
 * @param playerLocation The player's location.
 */
function mode_distance_init(playerLocation) {
	loadQuests(function(response) {
		// Parse JSON string into object
		var questLog = JSON.parse(response);
		questLog.forEach(function(e,i){
			var x = Math.random() < 0.5 ? -1 : 1;
			var y = Math.random() < 0.5 ? -1 : 1;
			spawnQuestPoint(playerLocation, 'Quest Start', questLog[i].action[0].icon, x*10*(Math.floor(Math.random() * 24) + 1), y*10*(Math.floor(Math.random() * 24) + 1), function(err, marker) {
				if (err) {
					console.log(err);
					return;
				}
				markersPos.push({
					marker: marker,
					lat: marker.getPosition().lat(),
					lng: marker.getPosition().lng()
				});
				marker.addListener('click', function() {
					if (questInRange(playerCircle, marker)) {
						checkPosition(questLog, marker, markersPos, map);
					}
				});
				e.positions[0] = marker;
			});
		});
	});
}

/**
 * Updates the gameplay elements according to the player's current location.
 * This gets called whenever the player's location changes.
 * @param playerLocation The player's location.
 */
function mode_distance_update(playerLocation) {
	// Currently, we don't do anything special
	// when the location gets updated.
}

/**
 * Loads all quests from a file resource.
 * @param callback Callback that gets invoked with the quest json string.
 */
function loadQuests(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', './js/quests.json', true);
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

/**
 * Checks if a quest point is inside the interaction radius of the player.
 * @param circle The player's circle.
 * @param questpoint The quest point to check.
 * @returns {boolean}
 */
function questInRange(circle,questpoint) {
	google.maps.Circle.prototype.contains = function(latLng) {
		return google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= INTERACTION_RADIUS;
	};

	if ( ! circle.contains(questpoint.getPosition())){
		ui.makeDialog("Too far away!",["You're too far away to interact with that questpoint."]);
		return false;
	} else {
		return true;
	}
}
