//let mongoose = require('mongoose');
const Goal = require('../models/goal');


async function getAllGoals(req, res) {
    let goals = await Goal.find({ user_id: req.user.id });
    res.json(goals);
}

async function getGoal(req, res) {
    let goal = await Goal.findOne({ user_id: req.user.id, _id: req.params.goal });
    res.json(goal);
}

async function createGoal(req, res) {
    //console.log("Body",req.body);
    let goal = new Goal({...req.body});
    goal.user_id = req.user.id;
    console.log("Object",goal);
    try {
        await goal.save();    
    } catch (error) {
        console.log(error)
    }
    res.json(goal);
}

async function updateGoal(req, res) {
    
}


module.exports = {
    
    getAllGoals, // Get
    getGoal, // Get
    createGoal, // Post
    updateGoal, // Post
    
};
