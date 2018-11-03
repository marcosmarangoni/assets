const User = require('../models/user');

/**
 * GET Method to render the create user page.
 * @param {Request} request 
 * @param {Response} response 
 */
async function create(request, response) {
    response.render('users/create', request.data);
}

/**
 * POST Method to handle the create user view form parameters.
 * @param {Request} request 
 * @param {Response} response 
 */
async function createUser(request, response) {
    const userParams = {
        username: request.body.email,
        password: request.body.password,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
        date_of_birth: '01-01-1990',
    };
    const user = new User(userParams);
    try {
        await user.save();
        response.send();
    } catch (error) {
        response.send({ error: true, errors: error.errors })
    }
}

async function readUser(request, response) {
    response.send('NOT IMPLEMENTED: READ_USER');
}

async function updateUser(request, response) {
    response.send('NOT IMPLEMENTED: UPDATE_USER');
}

async function removeUser(request, response) {
    response.send('NOT IMPLEMENTED: REMOVE_USER');
}

async function listUsers(request, response) {
    response.send('NOT IMPLEMENTED: USER_LIST');
}

// Public objects
module.exports = {
    /**
     * Get methods
     */
    create,
    readUser,
    updateUser,
    removeUser,
    listUsers,
    /**
     * Post methods
     */
    createUser,
}
