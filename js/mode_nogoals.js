var ITEM_RADIUS = 5;
var MINIMUM_DISTANCE_AWAY_FROM_PLAYER = 30;
var MAXIMUM_DISTANCE_AWAY_FROM_PLAYER = 50;
// After this threshold, points get removed again.
var MAXIMUM_POINT_DISTANCE = 100;
// How many points can be displayed at the same time.
var MAXIMUM_VISIBLE_POINTS = 20;
// We have to make sure to use a high zIndex
// for spawned points to make them clickable
// at all times.
var ZINDEX_POINT = 2000;
// After this threshold, we spawn new points close
// to the player. This allows players to not move
// at all and still collect a few points.
var SPAWN_CLOSE_POINTS_AFTER_TIMEOUT_SECS = 20;
// How many points to spawn when the player does not
// collect points.
var AMOUNT_OF_LAZY_POINTS = 1;

var spawned_points = {};
var visible_points = 0;
var next_item_index = 0;
var lazy_timeout = null;

/**
 * Initializes the gameplay mode.
 * @param playerLocation The player's location.
 */
function mode_nogoals_init(playerLocation) {
	spawn_close_points();
}

/**
 * Updates the gameplay elements according to the player's current location.
 * This gets called whenever the player's location changes.
 * @param playerLocation The player's location.
 */
function mode_nogoals_update(playerLocation) {
	remove_outdated_points(playerLocation);
	for (var i=visible_points; i < MAXIMUM_VISIBLE_POINTS; i++) {
		spawn_random_point(MINIMUM_DISTANCE_AWAY_FROM_PLAYER, MAXIMUM_DISTANCE_AWAY_FROM_PLAYER, playerLocation);
	}
}

/**
 * Removes all created points that are too far away of the
 * player. This keeps the total amount of spawned points
 * reasonable small.
 * @param playerLocation The location of the player.
 */
function remove_outdated_points(playerLocation) {
	for (var key in spawned_points) {
		var point = spawned_points[key];
		var pointPos = {lat: point.map_point.getCenter().lat(), lng: point.map_point.getCenter().lng()};
		if (distanceBetween(playerLocation, pointPos) > MAXIMUM_POINT_DISTANCE) {
			remove_point(point);
		}
	}
}

/**
 * Removes a point from the map.
 * @param point The point to remove.
 */
function remove_point(point) {
	point.map_point.setMap(null);
	delete spawned_points[point.index];
	visible_points--;
}

/**
 * Marks a point as collected.
 * @param point Point to be collected.
 */
function collect_point(point) {
	getPlayerData().gold++;
	getPlayerData().save();
	ui.updatePlayerStats(getPlayerData());
	remove_point(point);

	// Start a timeout after which we spawn new points close to the player.
	// So players can still play the game without moving at all, but
	// get much fewer points.
	clearTimeout(lazy_timeout);
	lazy_timeout = setTimeout(spawn_close_points, SPAWN_CLOSE_POINTS_AFTER_TIMEOUT_SECS * 1000);
}

/**
 * Spawns a few points close to the player.
 */
function spawn_close_points() {
	for (var i=0; i < AMOUNT_OF_LAZY_POINTS; i++) {
		spawn_random_point(0, 20, getPlayerPosition());
	}
}

/**
 * Spawns a new random point close to the player.
 * @param minimumDistanceAway Minimum distance between player and spawned points.
 * @param maximumDistanceAway Maximum distance between player and spawned points.
 * @param playerLocation The location of the player.
 */
function spawn_random_point(minimumDistanceAway, maximumDistanceAway, playerLocation) {
	var dNorth = minimumDistanceAway + Math.random() * maximumDistanceAway;
	var dEast = minimumDistanceAway + Math.random() * maximumDistanceAway;
	if (Math.random() > 0.5) {
		dNorth *= -1;
	}
	if (Math.random() > 0.5) {
		dEast *= -1;
	}

	// We don't care if the spawned point is easily accessible by foot.
	// It is not necessary to collect all points, and old points get removed
	// when they are too far away, so there will be no leak.
	var pos = addDistanceToPosition(playerLocation, dNorth, dEast);
	var map_point = new google.maps.Circle({
		strokeColor: '#FF0000',
		strokeOpacity: 0.7,
		strokeWeight: 2,
		fillColor: '#FF0000',
		fillOpacity: 0.25,
		map: map,
		center: pos,
		radius: ITEM_RADIUS,
		zIndex: ZINDEX_POINT
	});

	var point = {
		index: next_item_index++,
		map_point: map_point
	};

	var addPointListener = function(point) {
		point.map_point.addListener('click', function () {
			var pointPos = {lat: point.map_point.getCenter().lat(), lng: point.map_point.getCenter().lng()};
			if (!pointInRange(playerCircle, pointPos)) {
				ui.makeDialog("Too far away!",["You are too far away to collect this."]);
				return;
			}
			collect_point(point);
		});
	};
	addPointListener(point);
	spawned_points[point.index] = point;
	visible_points++;
}

/**
 * Checks if a given point is close enough to the player to collect it.
 * @param playerCircle The interaction circle of the player.
 * @param pos The position of the point to check.
 * @returns {boolean}
 */
function pointInRange(playerCircle, pos) {
	google.maps.Circle.prototype.contains = function(latLng) {
		var pointPos = {lat: this.getCenter().lat(), lng: this.getCenter().lng()};
		return distanceBetween(pointPos, latLng) <= INTERACTION_RADIUS;
	};
	return playerCircle.contains(pos);
}
