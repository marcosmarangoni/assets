var Users = require('../models/user');

exports.create_user = function(req, res){
    res.render('users/create');
}

exports.read_user = function(req, res){
    res.send('NOT IMPLEMENTED: READ_USER');
}

exports.update_user = function(req, res){
    res.send('NOT IMPLEMENTED: READ_USER');
}

exports.remove_user = function(req, res){
    res.send('NOT IMPLEMENTED: REMOVE_USER');
}

exports.users_list = function(req, res){
    res.send('NOT IMPLEMENTED: USER_LIST');
}