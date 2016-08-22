var map;
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

		var circle = new google.maps.Circle({
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
			title: 'Hello World!',
			draggable: true
		});

		marker.addListener('dragend',function(e){
			var location = {
				lat: e.latLng.lat(),
				lng: e.latLng.lng()
			}
			circle.setCenter(location);
		});

		var questpoint0 = new google.maps.Marker({
			position: {lat : -36.84749640093485 , lng : 174.76286748815653},
			map: map,
			title: 'uni!'
		});

		var questpoint = new google.maps.Marker({
			position: {lat : -36.85052492720226 , lng : 174.76793015767214},
			map: map,
			title: 'water!'
		});

		var questpoint2 = new google.maps.Marker({
			position: {lat : -36.849797959228646 , lng : 174.76853231359598},
			map: map,
			title: 'logs!'
		});

		function loadJSON(callback) {

			var xobj = new XMLHttpRequest();
			xobj.overrideMimeType("application/json");
			xobj.open('GET', 'quests.json', true); // Replace 'my_data' with the path to your file
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
			console.log(questLog);
			doTheNextShit(questLog);
		});

		var doTheNextShit = function (questLog) {
			console.log(questLog);
			questpoint0.addListener('click', function(){
				if (questInRange(circle,questpoint0)){
					checkPosition(questLog, questpoint0.getPosition());
				}
			});
			questpoint.addListener('click', function(){
				if (questInRange(circle,questpoint)){
					checkPosition(questLog, questpoint.getPosition());
				}
			});
			questpoint2.addListener('click', function(){
				if (questInRange(circle,questpoint2)){
					checkPosition(questLog, questpoint2.getPosition());
				}
			});

			ui.init();
		}

		//questpoint2.addListener('click', questInRange(circle,questpoint2));

		/*			navigator.geolocation.watchPosition(function(position) {
		var location = {lat: position.coords.latitude, lng: position.coords.longitude};
		marker.setPosition(location);
		// circle.setRadius(position.coords.accuracy);
		circle.setCenter(location);
		map.setCenter(location);
	});*/
});
}


function questInRange(circle,questpoint) {
	google.maps.Circle.prototype.contains = function(latLng) {
		return this.getBounds().contains(latLng) && google.maps.geometry.spherical.computeDistanceBetween(this.getCenter(), latLng) <= this.getRadius();
	}

	if ( ! circle.contains(questpoint.getPosition())){
		console.log("You're too far away to interact with that questpoint.");
		return false;
	} else {
		console.log("Quest in range!");
		return true;
	}
}
