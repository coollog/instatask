var DoTask = function(map, selfMarker, task) {
  this.map = map;
  this.selfMarker = selfMarker;
  this.task = task;

  this.taskMarker = new google.maps.Marker({
    position: new google.maps.LatLng(task.latitude, task.longitude),
    map: map.map,
    title: "Task place",
    label: "The task",
    animation: google.maps.Animation.DROP
  });
};

DoTask.prototype.initMap = function() {
  this.map.drawRoute(this.task.latitude, this.task.longitude);
};