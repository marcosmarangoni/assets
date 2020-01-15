/**
 * GET Method to render the create user page.
 * @param {Request} request 
 * @param {Response} response 
 * @returns Return html with sign up html
 */
async function signUp(request, response) {
    response.render('users/signup', request.data);
}

/**
 * Login get.
 * @param {Request} request 
 * @param {Response} response 
 * @returns Return html with log in html
 */
async function logIn(request, response){
    response.render('users/login');
}

/**
 * List get.
 * @param {Request} request 
 * @param {Response} response 
 * @returns Return an html with all users
 */
async function list(request, response){
    response.render('users/datatable');
}

module.exports = {
    signUp,
    logIn,
    list
}
