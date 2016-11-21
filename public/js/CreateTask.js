var CreateTask = function(map) {
  this.map = map;
  this.marker = null;

  // Init.
  this.attachSubmitListener($('#taskSubmit'));
};


CreateTask.prototype.initMap = function() {
  this.map.init((latitude, longitude) => {
    this.marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map.map,
      title: "Set Task Location",
      draggable: true
    });
  });

  $('postTask').show();
};
CreateTask.prototype.deinitMap = function() {
  $('postTask').hide();
  this.marker.setMap(null);
}
CreateTask.prototype.attachSubmitListener = function(submitButton) {
  var self = this;

  submitButton.click(() => {
//       $(this).hide();

    var title = $('input[name=title]').val();
    var description = $('textarea[name=description]').val();
    var payment = $('input[name=payment]').val();
    var latitude = self.marker.getPosition().lat();
    var longitude = self.marker.getPosition().lng();

    $.post('/postTask', {
      title: title,
      description: description,
      payment: payment,
      latitude: latitude,
      longitude: longitude
    }).done((data) => {
      self.changeToView(data._id);
    });
  });
};
CreateTask.prototype.changeToView = function(_id) {
  this.deinitMap();
  var viewTask = new ViewTask(this.map, _id);
};

