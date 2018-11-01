const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const DemoSchema = new Schema({
    name: String,
    weigth: Number
});

const Demo = mongoose.model('Demo', DemoSchema);
module.exports = Demo;