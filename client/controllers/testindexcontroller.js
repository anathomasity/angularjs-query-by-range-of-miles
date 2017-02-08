myApp.controller('indexController', function($scope, eventsFactory, $rootScope){

  var pos;

  // default range of miles to query for events
  var range = 50;

  $rootScope.search = {};
  $rootScope.search.date = new Date();
  
  $scope.Events = {
    today: [],
    tomorrow: [],
    day_after: [],
  };

  //If user has set a city preference, use that to query for events
  if($rootScope.user && $rootScope.user.city_preference){

      pos = {
        lat: $rootScope.user.city_preference.coordinates.lat,
        lng: $rootScope.user.city_preference.coordinates.lng,
      }
      $rootScope.search.city = $rootScope.user.city_preference.city;
  }

  // if user has no city preference or user is not logged in, use Geolocation
  else if (($rootScope.user && !$rootScope.user.city_preference) || !$rootScope.user){
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(success, error);
      }

  }

  //If user allows geolocation:
  function success(position) {
      $scope.userDeniedLocation = false;
      $rootScope.search.city = 'Your current location';

      pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
      };
      info.pos = pos;

      eventsFactory.getEvents(info, function(data){
          $scope.Events = data;
      })
  };

  //If user denies geolocation:
  function error(err) {

      console.log(`ERROR(${err.code}): ${err.message}`);

      $scope.$apply(function () {
          $scope.userDeniedLocation = true;
          $rootScope.search.city = '';
      });
  };

  var info = {
      range: range,
      pos: pos,
      dates: {
        today: moment($rootScope.search.date).format('YYYY MM DD'),
        tomorrow: moment($rootScope.search.date).add(1, 'days').format('YYYY MM DD'),
        day_after: moment($rootScope.search.date).add(2, 'days').format('YYYY MM DD')
      },
  };

  eventsFactory.getEvents(info, function(data){
      $scope.Events = data;
  })

})

