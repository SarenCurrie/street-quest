function toDegrees(radians) {
	return radians * 180 / Math.PI;
}

function toRadians(degrees) {
	return degrees * Math.PI / 180;
}

/**
 * Adds a distance expressed in meters in north and east direction to an existing position.
 * @param position An object containing 'lat' and 'lng' coordinates.
 * @param north The amount of meters to add in north direction.
 * @param east The amount of meters to add in east direction.
 * @returns {lat: *, lng: *}  new position object that is moved from the original position by the specified north and
 * east offset.
 */
function addDistanceToPosition(position, north, east) {
	// from: http://stackoverflow.com/questions/7477003/calculating-new-longtitude-latitude-from-old-n-meters
	var EARTH_RADIUS_METERS = 6371000;
	var lat = position.lat + toDegrees(north / EARTH_RADIUS_METERS);
	var lon = position.lng + (toDegrees(east / EARTH_RADIUS_METERS) / Math.cos(toRadians(position.lat)));
	return {"lat": lat, "lng": lon}
}

/**
 * Adjusts a position to be accessible by foot.
 * It uses a reverse geolocation lookup to find the closest address to the given location.
 * This should usually be enough to get close enough to the position by foot.
 * @param position An object containing 'lat' and 'lng' coordinates.
 * @param geocoder A Google Maps geocoder.
 * @param callback Callback to receive results.
 */
function adjustPosition(position, geocoder, callback) {
	geocoder.geocode({'location': position}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				callback(null, results[0].geometry.location);
			} else {
				callback('no results', null);
			}
		} else {
			callback(status, null);
		}
	});
}

/**
 * Calculates the distance between two positions (lat / lng pairs).
 * @param pos1 First position.
 * @param pos2 Second position.
 * @returns {number} distance in meters
 */
function distanceBetween(pos1, pos2) {
	return google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(pos1), new google.maps.LatLng(pos2));
}
