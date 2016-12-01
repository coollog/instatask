var FindTasks = function(map) {
  this.map = map;

  this.infoWindow = new google.maps.InfoWindow();

  this.tasks = {};
  this.markers = [];

  this.doTask = null;

  //this.initMap();
};

FindTasks.prototype.show = function() {
  if (this.doTask) {
    this.doTask.initMap();
  } else {
    this.initMap();
  }
};

FindTasks.prototype.hide = function() {
  if (this.doTask) {
    this.doTask.deinitMap();
  } else {
    this.deinitMap();
  }
}

FindTasks.prototype.initMap = function() {
  this.doTask = null;

  this.map.init((latitude, longitude) => {
    this.getTasks((tasks) => {
      tasks.forEach((task) => {
        this.tasks[task._id] = task;
        this.addMarkerForTask(task);
      });
    });

    if (this.marker) {
      this.marker.setMap(this.map.map);
    } else {
      this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(latitude, longitude),
        map: this.map.map,
        title: "My current location",
        draggable: false
        //label: "Me",
        //animation: google.maps.Animation.DROP
      });
    }
  });
};

FindTasks.prototype.deinitMap = function() {
  this.removeAllTasks();
  if (this.marker) this.marker.setMap(null);
};

FindTasks.prototype.getTasks = function(callback) {
  $.get('/get_tasks').done(callback);
};

FindTasks.prototype.addMarkerForTask = function(task) {
  var latLng = new google.maps.LatLng(task.latitude, task.longitude);
  var marker = new google.maps.Marker({
    position: latLng,
    map: this.map.map,
    icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
  });
  this.markers.push(marker);

console.log(task);
  marker.infoWindowContent =
    "<p>Task Name: " + task.title + "</p>" +
    "<p>Task Poster: " + task.employer + "</p>" +
    "<p>Description: " + task.description + "</p>" +
    "<p>Compensation: " + task.payment + "</p>" +
    "<button class=\"button\" onClick=\"taskController.acceptTask('" + task._id + "')\">Accept Task</button>";

  var findTasks = this;
  google.maps.event.addListener(marker, 'mouseover', function() {
    findTasks.showInfoWindow(this.infoWindowContent, this);
  });
};

FindTasks.prototype.showInfoWindow = function(content, marker) {
  this.infoWindow.setContent(content);
  this.infoWindow.open(this.map, marker);
};

FindTasks.prototype.acceptTask = function(_id) {
  var task = this.tasks[_id];

  var data = { _id: _id };
  $.post('/accept_task', data).done((msg) => {
    console.log(msg);
    if (msg == 'Task successfully accepted') {
      this.changeToDo(task);
    }
  });
};

FindTasks.prototype.changeToDo = function(task) {
  this.removeAllTasks();

  this.doTask = new DoTask(this.map, this.marker, task);
  this.doTask.initMap();
};

FindTasks.prototype.removeAllTasks = function() {
  this.markers.forEach(function(marker) {
    marker.setMap(null);
  });
};

