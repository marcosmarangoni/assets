const User = require('../models/user');
const securityService = require('../services/securityService');
//const emailTemplate = require('../public/resetPasswordEmail.html');
const fs = require('fs');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'assetslookup@gmail.com',
    pass: '4ss3tsl00kup'
  },
});

/**
 * Middleware to authenticate the user with JWT
 * It appends the user to the request (request.user)
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
async function authenticate(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(403).send({ message: 'No credentials sent!' });
    }
    const token = req.headers.authorization;
    const decodedJWT = securityService.decodeJWT(token);
    console.log(decodedJWT);
    const user = await User.findOne({ username: decodedJWT.username });
    req.user = user;
    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

/**
 * POST - /api/signup
 * Handle the create user view form parameters.
 * @param {Request} request 
 * @param {Response} response 
 * @returns Return the jwt token if the informations are valid.    
 *          Return 500 (Server Error) if informations are not valid.
 */
async function signUp(request, response) {
  let userParams = {
    username: request.body.username,
    password: request.body.password,
    first_name: request.body.first_name,
    last_name: request.body.last_name
  };
  const user = new User(userParams);
  try {
    const savedUser = await user.save();
    const { _id, username } = savedUser;
    let token = securityService.jwtSignIn(_id, username);
    response.send({ token });
  } catch (error) {
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
    const user = await User.findOne({ username: loginParams.username });
    if (encryptedPassword === user.password) {
      const { _id, username, password } = user;
      let token = securityService.jwtSignIn(_id, username);
      response.send({ token: token });
    }
    else throw new Error('Password doesnt match');
  } catch (error) {
    response.status(401).send({ message: 'Email or password are wrong' });
  }
}

async function forgotPassword(request, response) {
  const username = request.body.username;
  try {
    const user = await User.findOne({ username });
    const forgotPasswordToken = securityService.generateSecretKey(20);
    let emailTemplate = fs.readFileSync(`${__dirname}/../public/resetPasswordEmail.html`).toString();
    emailTemplate = emailTemplate.replace('{RESET_PASSWORD_LINK}', 'https://localhost:4000/api/reset_password?token=' + forgotPasswordToken);
    const mailOptions = {
      from: 'assetslookup@gmail.com',
      to: username,
      subject: 'Assets LookUP! Reset Password',
      html: emailTemplate
    };
    let emailResponse =  await transporter.sendMail(mailOptions);
    console.log('[EMAIL]', emailResponse);
    await user.updateOne({ forgot_password_token: forgotPasswordToken });
    response.send({ message: 'EMAIL_SENT' });
  } catch (error) {
    response.status(500).send({ error: true, message: error });
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
  remove,
  authenticate,
  forgotPassword
};