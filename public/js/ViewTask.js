var ViewTask = function(map, taskId, createTask) {
  this.map = map;
  this.taskId = taskId;
  this.createTask = createTask;

  this.marker = null;

  // Init.
  this.attachFinishListener($('#finish'));
  this.initMap();
};
ViewTask.prototype.initMap = function() {
  $('viewTask').show();
  $('#finished').show();

  if (this.marker) {
    this.marker.setMap(this.map.map);
  } else {
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
  }
};
ViewTask.prototype.deinitMap = function() {
  $('viewTask').hide();
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
  finishButton.click(() => {
    $.get('/finishworking')
      .done(() => {
        this.changeToCreate();
      });
  });
};
ViewTask.prototype.changeToCreate = function() {
  this.deinitMap();
  this.createTask.initMap();
};