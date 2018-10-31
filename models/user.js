var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "An username is required"],
            validate: {
                validator: validateSpecialChar(v),
                message: wrongFormat(v)
            },
            max: 100
        },
        password: {
            type: String,
            required: [true, "A password is required"],
            max: 100,
            validate: {
                validator: validateSpecialChar(v),
                message: wrongFormat(v)
            }
        },
        first_name: {
            type: String,
            required: [true, "Please insert your first name"],
            max: 100,
            validate: {
                validator: validateWord(v),
                message: wrongFormat(v)
            }
        },
        last_name: { 
            type: String, 
            required: [true, "Please insert your last name"], 
            max: 100,
            validate: {
                validator: validateWord(v),
                message: wrongFormat(v)
            } 
        },
        date_of_birth: { 
            type: Date, 
            required: [true, "Please insert your date of birth"] 
        }
    }
);

function validateSpecialChar(validate) {
    return /^[\w\@\*]+$/.test(username);
}
function validateWord(validate) {
    return /^[\w]+$/.test(validate);
}
function validateDate(date) {
    return /^(0[1-9]|1\d|2\d|3[01])\/(0[1-9]|1[0-2])\/(19|20)\d{2}$/.validate(date);
}
function wrongFormat(input) {
    return `${input} is in a wrong format!`;
}

// Virtual for author's full name
UserSchema
    .virtual('name')
    .get(function () {
        return this.first_name + ', ' + this.last_name;
    });

//Export model
module.exports = mongoose.model('User', UserSchema);