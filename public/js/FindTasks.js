var FindTasks = function(map) {
  this.map = map;

  this.infoWindow = new google.maps.InfoWindow();

  this.tasks = {};
  this.markers = [];

  this.doTask = null;
  this.currentTask = null;
  this.currentTask_id = null;

  this.initMap();
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
  this.currentTask = null;
  this.currentTask_id = null;
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

  // if(this.currentTask !== null){
  //   this.changeToDo(this.currentTask);
  // }

};

FindTasks.prototype.deinitMap = function() {
  this.removeAllTasks();
  if (this.marker) this.marker.setMap(null);
  if(this.doTask !== null){
     this.doTask.deinitMap();
  }
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
  this.currentTask_id = task._id;
  marker.infoWindowContent =
    "<p>Task Name: " + task.title + "</p>" +
    "<p>Task Poster: " + task.employer + "</p>" +
    "<p>Description: " + task.description + "</p>" +
    "<p>Compensation: " + task.payment + "</p>" +
    "<button class=\"button\" onClick=\"taskController.acceptTask('" + this.currentTask_id + "')\">Accept Task</button>";
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
      this.currentTask = task;
      this.changeToDo(this.currentTask, _id);
    }
  });
};

FindTasks.prototype.changeToDo = function(task,_id) {
  this.removeAllTasks();
  console.log('About to make a new DoTask. `this` = ', this);
  this.doTask = new DoTask(this.map, this.marker, task, _id, this);
  this.doTask.initMap();
};

FindTasks.prototype.removeAllTasks = function() {
  this.markers.forEach(function(marker) {
    marker.setMap(null);
  });
};

