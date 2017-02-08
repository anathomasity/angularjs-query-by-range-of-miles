myApp.factory('eventsFactory', function($http){

	var factory = {};

	var performers = [];

	factory.getEvents = function(info, callback){

		$http.post('/events', info).then(function(data){

			for(day in data.data){

				for(var event = 0; event < data.data[day].length; event++){

					// CALCULATE THE DISTANCE BETWEEN THE TWO LAT/LNG POINTS
					var radlat1 = Math.PI * data.data[day][event].address.coords.lat/180
					var radlat2 = Math.PI * info.pos.lat/180
					var theta = data.data[day][event].address.coords.lng-info.pos.lng
					var radtheta = Math.PI * theta/180
					var result = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
					result = Math.acos(result)
					result = result * 180/Math.PI
					result = result * 60 * 1.1515

					//If the event is not whitin the specified range, remove it.
					if(result > info.range){
						data.data[day].splice(event, 1);
						event --;
					}
				}
			}
			callback(data.data);
		})
	};


	return factory;
})