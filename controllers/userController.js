const User = require('../models/user');
// JSon Web Tokens, provide OAuth2 tokens for security
const jwt = require('jsonwebtoken');

const crypto = require('crypto');

/**
 * GET Method to render the create user page.
 * @param {Request} request 
 * @param {Response} response 
 */
async function signUp(request, response) {
    response.render('users/signup', request.data);
}

/**
 * POST Method to handle the create user view form parameters.
 * @param {Request} request 
 * @param {Response} response 
 */
async function signUpPost(request, response) {
    let userParams = {
        email: request.body.email,
        password: request.body.password,
        first_name: request.body.first_name,
        last_name: request.body.last_name,
    };
    const user = new User(userParams);
    try {
        await user.save();
        response.send();
    } catch (error) {
        response.send({ error: true, errors: error.errors });
    }
}

/**
 * Login get.
 * @param {Request} request 
 * @param {Response} response 
 */
async function logIn(request, response){
    response.render('users/login');
}

/**
 * Check the credentials of the user and log in.
 * This post method is URL-Encoded, to protect the user credentials.
 * @param {Request} request 
 * @param {Response} response 
 */
async function logInPost(request, response){
    let loginParams = {
        email: request.body.email,
        password: request.body.password
    };
    let encryptedPassword = crypto.createHash('md5').update(loginParams.password).digest('hex');
    try {
        const user = await User.findOne({ email: loginParams.email });
        if(encryptedPassword === user.password){
            let randomToken = await crypto.randomBytes(48).toString('hex');
            user.random_token = randomToken;
            await user.save();
            let token = await jwt.sign({
                id: user._id,
                email: user.email,
                username: user.first_name
            }, randomToken);
            response.json({ token });
        }
    } catch (error) {
        response.send({ error: true, errors: error.errors });
    }
}

/**
 * List get.
 * @param {Request} request 
 * @param {Response} response 
 */
async function list(request, response){
    response.render('users/datatable');
}
/**
 * Get a list of all available users.
 * @param {Request} request 
 * @param {Response} response 
 */
async function listUsers(request, response) {
    try {
        const users = await User.find();
        response.send(users);
    } catch (error) {
        response.send({ error: true, message: error });
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

// Public objects
module.exports = {
    /**
     * Get methods
     */
    signUp,
    logIn,
    readUser,
    updateUser,
    removeUser,
    listUsers,
    list,
    /**
     * Post methods
     */
    signUpPost,
    logInPost,
};
