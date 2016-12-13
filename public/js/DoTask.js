var DoTask = function(map, selfMarker, task, _id, findTask) {
  this.findTask = findTask;
  this.map = findTask.map;
  this.selfMarker = findTask.marker;
  this.task = task;
  this.taskid = _id;
  this.counter = 0;
  console.log('Setting findTask =', findTask);
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
  var timeCounter = this.counter;
  console.log('thisdoTask_findTask = ', thisdoTask_findTask);
  // var timer = setInterval(function() {
  //   timerCounter += 1;
  //   console.log("Going to call finish. timerCounter =", timerCounter);
  //   thisdoTask.finish();
  // }, 2000);
  var timer2 = setTimeout(function(){
    thisdoTask.finish();
  },25000);
  console.log("run after finish");
  console.log("this.counter is: in initMap", this.counter);
  if (this.counter == 1) {
    console.log("run in clear timer");
    console.log("this.counter is:", this.counter);
    clearInterval(timer)};
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
  var thisdoTask = this;
  var thisdoTask_findTask = this.findTask;
  var data = { _id: this.taskid };
  $.post('/getTask', data).done(callback => {
    if (callback.status == 'finished') {
      this.counter = 1;
      console.log("this.counter in finish", this.counter);
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
  this.findTask = new FindTasks(this.map);
  // find.currentTask = null;
  // find.DoTask = null;
  // find.currentTask_id = null;
  // find.initMap();
  //this.findTask.initMap();
};