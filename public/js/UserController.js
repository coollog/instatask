var UserController = function() {
  this.currentView = 'login';

  this.init();
};

UserController.prototype.init = function() {
  $('login').show();

  $('#login').click(() => {
    this.login();
  });
  $('#register').click(() => {
    this.register();
  });
};

UserController.prototype.deinit = function() {
  $('error').hide();
  $('login').hide();
  $('register').hide();
};

UserController.prototype.login = function() {
  var email = $('login input[name=email]').val();
  var pass = $('login input[name=pass]').val();

  $.post('/login', {
    email: email,
    pass: pass
  }).done((data) => {
    if (data.error) {
      $('error').html(data.error).show();
      return;
    }

    this.success();
  });
};

UserController.prototype.register = function() {
  var email = $('register input[name=email]').val();
  var pass = $('register input[name=pass]').val();
  var pass2 = $('register input[name=pass2]').val();
  var name = $('register input[name=name]').val();
  var phone = $('register input[name=phone]').val();

  $.post('/register', {
    email: email,
    pass: pass,
    pass2: pass2,
    name: name,
    phone: phone
  }).done((data) => {
    if (data.error) {
      $('error').html(data.error).show();
      return;
    }

    this.success();
  });
};

UserController.prototype.switchToRegister = function() {
  if (this.currentView == 'register') return;

  $('login').hide();
  $('register').show();
  $('error').hide();

  this.currentView = 'register';
};

UserController.prototype.switchToLogin = function() {
  if (this.currentView == 'login') return;

  $('register').hide();
  $('login').show();
  $('error').hide();

  this.currentView = 'login';
};

UserController.prototype.success = function() {
  var taskController;

  var map = new Map($('#map')[0]);
  new TaskController(map);
  $('#map').show();

  this.deinit();
}