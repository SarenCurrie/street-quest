var map;
var geocoder;
var playerMarker;
var playerCircle;
// If the location accuracy is higher than this (in meters),
// tracking will be disabled.
var MAXIMUM_LOCATION_ACCURACY = 20;
// Players should be able to interact with quest points and
// collect items even if they are not exactly next to it
// to avoid having to enter buildings etc.
var INTERACTION_RADIUS = 40;
// support game modes
var MODE_NOGOALS = 0;
var MODE_DISTANCE = 1;
// gameplay mode the game currently uses
var mode = {
	mode: -1,
	init: function(playerLocation) {},
	update: function(playerLocation) {}
};

function initMap() {
	if (!navigator.geolocation){
		output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
		return;
	}

	navigator.geolocation.getCurrentPosition(function(position) {
		console.log(position);


		var mapOptions = {
			center: {lat: position.coords.latitude, lng: position.coords.longitude},
			zoom: 17,
			disableDefaultUI: true,
			disableDoubleClickZoom: true,
			styles: [{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]}]
		};

		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		geocoder = new google.maps.Geocoder;

		playerCircle = new google.maps.Circle({
			strokeColor: '#43A047',
			strokeOpacity: 0.7,
			strokeWeight: 2,
			fillColor: '#43A047',
			fillOpacity: 0.25,
			map: map,
			center: {lat: position.coords.latitude, lng: position.coords.longitude},
			radius: INTERACTION_RADIUS
		});
		playerMarker = new google.maps.Marker({
			position: {lat: position.coords.latitude, lng: position.coords.longitude},
			map: map,
			title: 'Player',
			draggable: true
		});
		playerMarker.addListener('dragend',function(e){
			var location = {
				lat: e.latLng.lat(),
				lng: e.latLng.lng(),
				accuracy: playerCircle.getRadius()
			};
			locationUpdated(latLngToBrowserLocation(location));
		});

		// TODO: add way to switch modes on startup
		mode.mode = MODE_NOGOALS;
		switch(mode.mode) {
			case MODE_NOGOALS:
				mode.init = mode_nogoals_init;
				mode.update = mode_nogoals_update;
				break;
			case MODE_DISTANCE:
				mode.init = mode_distance_init;
				mode.update = mode_distance_update;
				break;
		}

		var playerLocation = browserLocationToLatLng(position);
		ui.init();
		mode.init(playerLocation);

		getPlayerData().lastLocation = browserLocationToLatLng(position);
		ui.updatePlayerStats(getPlayerData());
		locationUpdated(position);
		var locationOptions = {enableHighAccuracy: true};
		navigator.geolocation.watchPosition(locationUpdated, null, locationOptions);
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

/**
 * Converts an object with 'lat', 'lng', and 'accuracy' fields to a browser location object.
 * @param latlng The object to convert.
 * @returns {{coords: {latitude: *, longitude: *, accuracy: (*|Number)}}}
 */
function latLngToBrowserLocation(latlng) {
	return {coords: {latitude: latlng.lat, longitude: latlng.lng, accuracy: latlng.accuracy}};
}

/**
 * Converts a browser location to a lat lng object.
 * @param location The location to convert.
 * @returns {{lat: *, lng: *, accuracy: (*|Number)}}
 */
function browserLocationToLatLng(location) {
	return {lat: location.coords.latitude, lng: location.coords.longitude, accuracy: location.coords.accuracy};
}

/**
 * Returns the current player position.
 */
function getPlayerPosition() {
	return {lat: playerMarker.getPosition().lat(), lng: playerMarker.getPosition().lng(), accuracy: playerCircle.getRadius()};
}

/**
 * Callback that gets invoked whenever the player's position has changed.
 * @param newLocation The new location of the player.
 */
function locationUpdated(newLocation) {
	var position = browserLocationToLatLng(newLocation);
	mode.update(position);
	playerMarker.setPosition(position);
	playerCircle.setCenter(position);
	playerCircle.setRadius(INTERACTION_RADIUS);
	if (position.accuracy > MAXIMUM_LOCATION_ACCURACY) {
		// Filter all location updates that have low accuracy.
		ui.showLowGpsWarning(position.accuracy, MAXIMUM_LOCATION_ACCURACY);
		return;
	}
	ui.hideLowGpsWarning();
	trackNewLocation(position);
}

/**
 * Calculates the distance between the player's current and last position and adds it to the traveled distance.
 * @param position The current position of the player.
 */
function trackNewLocation(position) {
	var player = getPlayerData();
	var distance = distanceBetween(player.lastLocation, position);
	if (distance < 5) {
		// Skip all location updates that just come from
		// the GPS location jumping around a few meters.
		return;
	}
	player.lastLocation = position;
	player.traveledDistance += distance;
	console.log("distance: " + distance);
	console.log("total distance: " + player.traveledDistance);
	player.save();
	ui.updatePlayerStats(player);
}

