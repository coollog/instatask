var Map = function(mapElem) {
  this.map = null;

  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;

  this.mapElem = mapElem;

  this.currentLatitude = null;
  this.currentLongitude = null;
};

Map.prototype.getCurrentPosition = function(callback) {
  navigator.geolocation.getCurrentPosition((position) => {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;

    this.currentLatitude = latitude;
    this.currentLongitude = longitude;

    callback(latitude, longitude);
  });
};

Map.prototype.init = function(callback) {
  this.getCurrentPosition((latitude, longitude) => {
    if (!this.map) {
      var mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      this.map = new google.maps.Map(this.mapElem, mapOptions);

      this.directionsDisplay.setMap(this.map);
    }

    callback(latitude, longitude);
  });
};

Map.prototype.drawRoute = function(latitude, longitude) {
  if(!this.directionsDisplay.getMap()){
    this.directionsDisplay.setMap(this.map);
  }
  var src = new google.maps.LatLng(this.currentLatitude, this.currentLongitude);
  var dest = new google.maps.LatLng(latitude, longitude);

  var request = {
    origin: src,
    destination: dest,
    travelMode: 'WALKING'
  };

  this.directionsService.route(request, (result, status) => {
    if (status == 'OK') {
      this.directionsDisplay.setDirections(result);
    }
  });
};

Map.prototype.clearRoute = function() {
  if (this.directionsDisplay != null) {
        this.directionsDisplay.setMap(null);
    }
};
