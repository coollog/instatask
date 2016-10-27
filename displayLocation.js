        function currentLatLong(callback) {
            var x = document.getElementById("demo");
            var latlong = [];
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            }
            else {
                x.innerHTML = "Default coordinates";
                latlong.push(41.3154);
                latlong.push(-72.9204);
                return callback(latlong);
            }

            function success(position) {
                x.innerHTML = "Your coordinates";
                latlong.push(position.coords.latitude);
                latlong.push(position.coords.longitude);
                return callback(latlong);
            }

            function error(err) {
                x.innerHTML = "Default coordinates";
                latlong.push(41.3154);
                latlong.push(-72.9204);
                return callback(latlong);
            };
        };
        var marker;

        function myMap() {
            var y = document.getElementById("test");
            var mapCanvas = document.getElementById("map");
            currentLatLong(function(latlong) {
                var mapOptions = {
                    center: new google.maps.LatLng(latlong[0], latlong[1]),
                    zoom: 17
                }
                var map = new google.maps.Map(mapCanvas, mapOptions);
                marker = new google.maps.Marker({
                    position: mapOptions.center,
                    title: "Set Task Location",
                    draggable: true
                });
                marker.setMap(map);
                google.maps.event.addListener(marker, 'dragend', function(event) {
                    y.innerHTML = this.getPosition().lat() + ", " + this.getPosition().lng();
                });
                y.innerHTML = marker.getPosition().lat() + ", " + marker.getPosition().lng();
            });
        }