var map;
var geocoder;
var playerCircle;
function initMap() {
	if (!navigator.geolocation){
		output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
		return;
	}

	navigator.geolocation.getCurrentPosition(function(position) {
		console.log(position);
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat: position.coords.latitude, lng: position.coords.longitude}, //Uni
			zoom: 17
		});
		geocoder = new google.maps.Geocoder;

		playerCircle = new google.maps.Circle({
			strokeColor: '#0055EE',
			strokeOpacity: 0.7,
			strokeWeight: 2,
			fillColor: '#0055EE',
			fillOpacity: 0.25,
			map: map,
			center: {lat: position.coords.latitude, lng: position.coords.longitude},
			radius: position.coords.accuracy
		});
		var marker = new google.maps.Marker({
			position: {lat: position.coords.latitude, lng: position.coords.longitude},
			map: map,
			title: 'Player',
			draggable: true
		});

		marker.addListener('dragend',function(e){
			var location = {
				lat: e.latLng.lat(),
				lng: e.latLng.lng()
			}
			playerCircle.setCenter(location);
		});

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

		loadJSON(function(response) {
			// Parse JSON string into object
			var questLog = JSON.parse(response);
			spawnQuestPoint({lat: position.coords.latitude, lng: position.coords.longitude}, 'Quest Start', questLog[0].action[0].icon, -100, 100, function(err, marker) {
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
		ui.init();
	});
}

/**
 * Spawns a new quest point with an offset to a given position.
 * The final marker will most likely be placed somewhere else, but close to the requested destination.
 * You can get the final position from the marker that gets returned in the callback.
 * @param position The position from where the offset is calculated.
 * @param title The title to give to the marker.
 * @param icon The icon to display as marker.
 * @param dx Offset in North direction.
 * @param dy Offset in South direction.
 * @param callback Callback that gets executed after the position was calculated.
 */
function spawnQuestPoint(position, title, icon, dx, dy, callback) {
	var pos = addDistanceToPosition(position, dx, dy);
	adjustPosition(pos, geocoder, function(err, newPosition) {
		if (err) {
			callback(err, null);
			return;
		}
		var marker = new google.maps.Marker({
			map: map,
			position: newPosition,
			title: title,
			icon: icon
		});
		callback(null, marker);
	});
}

function questInRange(circle,questpoint) {
	google.maps.Circle.prototype.contains = function(latLng) {
		return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
	}

	if ( ! circle.contains(questpoint.getPosition())){
		ui.makeDialog("Too far away!",["You're too far away to interact with that questpoint."]);
		return false;
	} else {
		return true;
	}
}
