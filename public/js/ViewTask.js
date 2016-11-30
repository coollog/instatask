var ViewTask = function(map, taskId) {
  this.map = map;
  this.taskId = taskId;

  this.marker = null;

  // Init.
  this.attachFinishListener($('#finish'));
  this.initMap();
  $('viewTask').show();
  $('#finished').show();
};
ViewTask.prototype.initMap = function() {
  this.getTask((task) => {
    var latitude = parseFloat(task.latitude);
    var longitude = parseFloat(task.longitude);

    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      title: "This is a marker!",
      map: this.map.map,
      animation: google.maps.Animation.DROP
    });
  });
};
ViewTask.prototype.deinitMap = function() {
  if (this.marker) {
    this.marker.setMap(null);
  }
};
ViewTask.prototype.getTask = function(callback) {
  $.post('/getTask', {
    _id: this.taskId
  }).done(callback);
};
ViewTask.prototype.attachFinishListener = function(finishButton) {
  finishButton.click(function() {
  $.get('/finishworking')
    .done(function() {
      $('#main').html('FINISHED');
    });
  });
};