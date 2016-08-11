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
