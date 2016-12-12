var CreateTask = function(map) {
  this.map = map;
  this.marker = null;

  this.viewTask = null;

  // Init.
  this.attachSubmitListener($('#taskSubmit'));
};

CreateTask.prototype.show = function() {
  if (this.viewTask) {
    this.viewTask.initMap();
  } else {
    this.initMap();
  }
};
CreateTask.prototype.hide = function() {
  if (this.viewTask) {
    this.viewTask.deinitMap();
  } else {
    this.deinitMap();
  }
};
CreateTask.prototype.initMap = function() {
  this.viewTask = null;

  this.map.init((latitude, longitude) => {
    var markerPos = new google.maps.LatLng(latitude, longitude);

    if (this.marker) {
      this.marker.setMap(this.map.map);
      this.marker.setPosition(markerPos);
    } else {
      this.marker = new google.maps.Marker({
        position: markerPos,
        map: this.map.map,
        title: "Set Task Location",
        draggable: true
      });
    }
  });

  $('postTask').show();
};
CreateTask.prototype.deinitMap = function() {
  $('postTask').hide();
  this.marker.setMap(null);
  if (this.viewTask) {
    this.viewTask.deinitMap();
  }
}
CreateTask.prototype.attachSubmitListener = function(submitButton) {
  var self = this;

  submitButton.click(() => {
//       $(this).hide();

    var title = $('input[name=title]').val();
    var description = $('textarea[name=description]').val();
    var payment = $('input[name=payment]').val();
    var latitude = this.marker.getPosition().lat();
    var longitude = this.marker.getPosition().lng();

    $.post('/postTask', {
      title: title,
      description: description,
      payment: payment,
      latitude: latitude,
      longitude: longitude
    }).done((data) => {
      this.changeToView(data._id);//taskController.changeToView(data._id);
    });
  });
};
CreateTask.prototype.changeToView = function(_id) {
  this.deinitMap();
  this.viewTask = new ViewTask(this.map, _id, this);
};

