var TaskController = function(map) {
  this.createTask = new CreateTask(map);
  this.findTasks = new FindTasks(map);
  this.findTasks.initMap();
  this.currentPage = "employee";

  ////////might need to disable one side when the other side is ongoing
  this.init();
};

TaskController.prototype.init = function() {
  $('switchType').show();

  $('#showEmployer').click(() => {
    this.showEmployerPage();
  });

  $('#showEmployee').click(() => {
    this.showEmployeePage();
  });
}

TaskController.prototype.showEmployerPage = function() {
  if(this.currentPage != "employer"){
    this.findTasks.deinitMap();
    this.createTask.initMap();
    this.currentPage = "employer";
  }
};

TaskController.prototype.showEmployeePage = function() {
  if(this.currentPage != "employee"){
    this.createTask.deinitMap();
    this.findTasks.initMap();
    this.currentPage = "employee";
  }
};

TaskController.prototype.acceptTask = function(_id) {
  this.findTasks.acceptTask(_id);
}
