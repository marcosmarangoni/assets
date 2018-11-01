const User = require('../models/user');

// POST method
exports.create_user = function(req, res) {
  const userParams = {
    username: req.body.email,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    date_of_birth: '01-01-1990',
  };
  const user = new User(userParams);
  user.save(function(err){
    if(err){
      res.render('users/create', {error:true})
    }
    res.render('users/create', {error:false});
  });
};

exports.read_user = function(req, res) {
  res.send('NOT IMPLEMENTED: READ_USER');
};

exports.update_user = function(req, res) {
  res.send('NOT IMPLEMENTED: READ_USER');
};

exports.remove_user = function(req, res) {
  res.send('NOT IMPLEMENTED: REMOVE_USER');
};

exports.users_list = function(req, res) {
  res.send('NOT IMPLEMENTED: USER_LIST');
};
