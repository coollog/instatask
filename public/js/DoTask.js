var DoTask = function(map, selfMarker, task, _id, findTask) {
  this.map = map;
  this.selfMarker = selfMarker;
  this.task = task;
  this.taskid = _id;
  console.log('Setting findTask =', findTask);
  this.findTask = findTask;
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
  var timerCounter = 0;
  var thisdoTask = this;
  var thisdoTask_findTask = this.findTask;
  console.log('thisdoTask_findTask = ', thisdoTask_findTask);
  var timer = setInterval(function() {
    timerCounter += 1;
    console.log("Going to call changeToFind. timerCounter =", timerCounter);
    // thisdoTask.changeToFind(thisdoTask_findTask);
    thisdoTask.finish();
  }, 2000);
  // timerCounter += 1;
  // console.log("Going to call changeToFind. timerCounter =", timerCounter);
  // thisdoTask.changeToFind(thisdoTask_findTask);
  

};

DoTask.prototype.deinitMap = function() {
  if (this.selfMarker) this.selfMarker.setMap(null);
  if (this.taskMarker) {
    this.taskMarker.setMap(null);
  }
  this.map.clearRoute();
};

// When the task is changed to finished, call changeToFind function
DoTask.prototype.finish = function() {
  var data = { _id: this.taskid };
  var thisdoTask = this;
  var thisdoTask_findTask = this.findTask;
  $.post('/getTask', data).done(callback => {
    if (callback.status == 'finished') {
      thisdoTask.changeToFind(thisdoTask_findTask);
      // set task to null
      thisdoTask_findTask.currentTask = null;
    };
  });
};


DoTask.prototype.changeToFind = function(_findTask) {
  var find = _findTask;
  console.log("We are here inside changeToFind");
  this.deinitMap();//deinit successful
  find.initMap();
  //this.findTask.initMap();
};