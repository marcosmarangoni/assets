const User = require('../models/user');
const securityService = require('../services/securityService');

/**
 * POST - /api/signup
 * Handle the create user view form parameters.
 * @param {Request} request 
 * @param {Response} response 
 * @returns Return the jwt token if the informations are valid.    
 *          Return 500 (Server Error) if informations are not valid.
 */
async function signUp(request, response) {

  const secretKey = securityService.generateSecretKey();

  let userParams = {
    username: request.body.username,
    password: request.body.password,
    first_name: request.body.first_name,
    last_name: request.body.last_name,
    secret_key: secretKey
  };
  const user = new User(userParams);
  try {
    const savedUser = await user.save();
    const { _id, username, password } = savedUser;
    console.log('[SAVED USER]', savedUser);
    let token = securityService.jwtSignIn(_id, username, secretKey);
    response.send({ token });
  } catch (error) {
    console.log('[ERROR]', error);
    response.status(500).send({ message: 'Erro ao tentar gravar o usuario' });
  }
}

/**
 * POST - /api/login
 * Check the credentials of the user and log in.
 * This post method is URL-Encoded, to protect the user credentials.
 * @param {Request} request 
 * @param {Response} response 
 * @returns Return the jwt token if the credentials are valid.    
 *          Return 401 (Unauthorized) if credentials are not valid.
 */
async function logIn(request, response) {
  let loginParams = {
    username: request.body.username,
    password: request.body.password
  };
  try {
    let encryptedPassword = securityService.encrypt(loginParams.password);
    // JWT encryption key.
    let secretKey = securityService.generateSecretKey();

    const user = await User.findOne({ username: loginParams.username });
    if (encryptedPassword === user.password) {
      user.secret_key = secretKey;
      await user.updateOne();
      const { _id, username, password } = user;
      let token = securityService.jwtSignIn(_id, username, secretKey);
      response.send({ token: token });
    }
    else throw new Error('Password doesnt match');
  } catch (error) {
    response.status(401).send({ message: 'Email or password are wrong' });
  }
}

/**
 * GET - /api/users/list
 * Get a list of all available users.
 * @param {Request} request 
 * @param {Response} response 
 * @returns Return the list of users.    
 *          Return 500 (Server Error) if any error in the database happens.
 */
async function list(request, response) {
  try {
    const users = await User.find();
    response.send(users);
  } catch (error) {
    response.status(500).send({ error: true, message: error });
  }
}

/**
 * GET - /api/users/read/:id
 * @param {*} request 
 * @param {*} response 
 */
async function read(request, response) {
  response.send('NOT IMPLEMENTED: READ_USER');
}

/**
 * PUT - /api/users/update/:id
 * @param {*} request 
 * @param {*} response 
 */
async function update(request, response) {
  response.send('NOT IMPLEMENTED: UPDATE_USER');
}

/**
 * DELETE - /api/users/remove/:id
 * @param {*} request 
 * @param {*} response 
 */
async function remove(request, response) {
  response.send('NOT IMPLEMENTED: REMOVE_USER');
}

module.exports = {
  signUp,
  logIn,
  list,
  read,
  update,
  remove
}