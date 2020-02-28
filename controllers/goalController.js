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
    let goal = new Goal({ ...req.body });
    goal.user_id = req.user.id;
    try {
        let goal2 = await goal.save();
        console.log("After",goal2);
    } catch (error) {
        console.log(error)
    }
    res.json(goal);
}

async function deleteGoal(req, res) {
    try {
        await Goal.findOneAndDelete({ user_id: req.user.id, _id: req.body._id });
        res.send({delete:true});
    } catch (error) {
        res.send(error);
    }
}

async function updateGoal(req, res) {
    try {
        let goal = new Goal({ ...req.body });
        goal.user_id = req.user.id;
        await Goal.findOneAndUpdate({ user_id: req.user.id, _id: goal._id }, { $set: goal });
        res.send(goal);  
    } catch (error) {
        res.send(error);
    }
    
}


module.exports = {

    getAllGoals, // Get
    getGoal, // Get
    createGoal, // Post
    updateGoal, // Put
    deleteGoal // Delete

};
