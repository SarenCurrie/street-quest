var ITEM_RADIUS = 5;
var MINIMUM_DISTANCE_AWAY_FROM_PLAYER = 30;
// How far away points should spawn at a maximum.
var MAXIMUM_POINT_DISTANCE = 100;
// How many points can be displayed at the same time.
var MAXIMUM_VISIBLE_POINTS = 20;
// We have to make sure to use a high zIndex
// for spawned points to make them clickable
// at all times.
var ZINDEX_POINT = 2000;

var spawned_points = {};
var visible_points = 0;
var collected_count = 0;
var next_item_index = 0;

function mode_nogoals_init(playerLocation) {
	mode_nogoals_update(playerLocation);
}

function mode_nogoals_update(playerLocation) {
	remove_outdated_points(playerLocation);
	for (var i=visible_points; i < MAXIMUM_VISIBLE_POINTS; i++) {
		spawn_random_point(playerLocation);
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

function remove_point(point) {
	point.map_point.setMap(null);
	delete spawned_points[point.index];
	visible_points--;
}

/**
 * Spawns a new random point close to the player.
 * @param playerLocation The location of the player.
 */
function spawn_random_point(playerLocation) {
	var dNorth = MINIMUM_DISTANCE_AWAY_FROM_PLAYER + Math.random() * 30;
	var dEast = MINIMUM_DISTANCE_AWAY_FROM_PLAYER + Math.random() * 30;
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
			// TODO: we have to restrict which points can
			// be collected. The player must be kinda close
			// to the point in order to collect it.
			collected_count++;
			remove_point(point);
		});
	};
	addPointListener(point);
	spawned_points[point.index] = point;
	visible_points++;
}
