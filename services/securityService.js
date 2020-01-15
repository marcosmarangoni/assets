// JSon Web Tokens, provide OAuth2 tokens for security
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Generate a secret key, or a random sized hex
 * @param {number} size Size
 */
function generateSecretKey(size = 48) {
  return crypto.randomBytes(size).toString('hex');
}

/**
 * JWT encrypt these 3 information together and a secret key to form a token
 * @param {String} id
 * @param {String} username 
 * @param {String} password 
 * @param {String} secretKey 
 */
function jwtSignIn(id, username, secretKey) {
  let token = jwt.sign({
    id: id,
    username: username,
  }, secretKey);
  return token;
}

function jwtVerify(token, secretKey) {
  try {
    jwt.verify(token, secretKey)
  } catch(error) {
    throw 'Invalid token';
  }
}

/**
 * Encrypt a string
 * @param {String} value 
 */
function encrypt(value) {
  return crypto.createHash('md5').update(value).digest('hex');
}

module.exports = {
  encrypt,
  generateSecretKey,
  jwtSignIn,
  jwtVerify
}