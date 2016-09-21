function mode_distance_init(playerLocation) {
	loadJSON(function(response) {
		// Parse JSON string into object
		var questLog = JSON.parse(response);
		spawnQuestPoint(playerLocation, 'Quest Start', questLog[0].action[0].icon, -100, 100, function(err, marker) {
			if (err) {
				console.log(err);
				return;
			}
			marker.addListener('click', function() {
				if (questInRange(playerCircle, marker)) {
					checkPosition(questLog, marker);
				}
			});
		});
	});
}

function mode_distance_update(playerLocation) {
	// Currently, we don't do anything special
	// when the location gets updated.
}

function loadJSON(callback) {
	var xobj = new XMLHttpRequest();
	xobj.overrideMimeType("application/json");
	xobj.open('GET', './js/quests.json', true); // Replace 'my_data' with the path to your file
	xobj.onreadystatechange = function () {
		if (xobj.readyState == 4 && xobj.status == "200") {
			// Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
			callback(xobj.responseText);
		}
	};
	xobj.send(null);
}

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
