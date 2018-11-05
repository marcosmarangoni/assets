const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
      username: {
        type: String,
        required: [true, 'An username is required'],
        unique: [true, 'Please select another username'],
        validate: {
          validator: (v) =>
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
          message: (props) => `${props.value} is in a wrong format!`,
        },
        max: [50, 'Sorry you reached the maximum number of characters'],
      },
      password: {
        type: String,
        required: [true, 'A password is required'],
        validate: {
          validator: (v) => /^[\w@*]+$/.test(v),
          message: (props) => `${props.value} is in a wrong format!`,
        },
        max: [30, 'Sorry you reached the maximum number of characters'],
      },
      first_name: {
        type: String,
        required: [true, 'Please insert your first name'],
        validate: {
          validator: (v) => /^[\w']+$/.test(v),
          message: (props) => `${props.value} is in a wrong format!`,
        },
        max: [30, 'Sorry you reached the maximum number of characters'],
      },
      last_name: {
        type: String,
        required: [true, 'Please insert your last name'],
        validate: {
          validator: (v) => /^[\w']+$/.test(v),
          message: (props) => `${props.value} is in a wrong format!`,
        },
        max: [30, 'Sorry you reached the maximum number of characters'],
      },
      date_of_birth: {
        type: Date,
        required: [true, 'Please insert your date of birth'],
      },
    }
);

// Virtual for author's full name
UserSchema
    .virtual('name')
    .get(function() {
      return this.first_name + ', ' + this.last_name;
    });

// Export model
module.exports = mongoose.model('user', UserSchema);
