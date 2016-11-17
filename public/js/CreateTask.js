var CreateTask = function(map) {
  this.map = map;
  this.marker = null;

  // Init.
  this.attachSubmitListener($('#taskSubmit'));
  //this.initMap();
};


CreateTask.prototype.initMap = function() {
  var self = this;

  self.map.init(function(latitude, longitude) {
    self.marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: self.map.map,
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

  submitButton.click(function() {
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
    }).done(function(data) {
      self.changeToView(data._id);
    });
  });
};
CreateTask.prototype.changeToView = function(_id) {
  this.deinitMap();
  var viewTask = new ViewTask(this.map, _id);
};

