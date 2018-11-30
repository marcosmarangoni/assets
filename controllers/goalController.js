let mongoose = require('mongoose');
const async = require('async');
const User = require('../models/user');
//const bodyParser = require('body-parser')

// Temporary:

let user;
async.waterfall([
    function(cb) {
        //User.findOne({email:"marcosmarangoni2@gmail.com"}).select({"first_name":1, "stats.assetamt":1, "stats.return":1 }).lean().exec(cb);        
    }],
    function (err, results) {
        if(err) {console.log(err);}
        user = results;
});

user = {_id : "5be17559311d5c0fb0f42d1d", stats: {return: 15, assetamt:15000 }};

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function index(request, response) {
    response.render('goals/index'); 
}


/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function ShowGoal(request, response) {

    response.render('goals/show'); 
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function ShowGoalData(request, response) {

    let goalConf = {
        movs: [ // 0 is the configuration of the goal
            {
            name: "",
            startMonth: "current", // Can be current or MM
            startYear: "current", // Can be current or YYYY
            endMonth: "12", // Can be current or MM
            endYear: "2025", // Can be current or YYYY
            amtStart: "assetamt", // Can be "assetamt" or any valid value
            growth: "return" }, //Can be return or any value 
            {
            name: "Savins",
            startMonth: "05",
            startYear: "2019", 
            endMonth: "10", 
            endYear: "2025", 
            amtStart: 1500,
            growth: 5 }, 
            {
            name: "Retire",
            startMonth: "05",
            startYear: "2020", 
            endMonth: "12", 
            endYear: "2025", 
            amtStart: -1000,
            growth: 3 }, 
            {
            name: "Mortage",
            startMonth: "04",
            startYear: "2020", 
            endMonth: "03", 
            endYear: "2025", 
            amtStart: -1200,
            growth: 1.5 }, 

        ]
    };

    let today = new Date();
    let labels = new Array();
    for(x=0 ;  x < goalConf.movs.length; ++x ) {
        labels.push(goalConf.movs[x].name);
        // Set StartMonth
        if(goalConf.movs[x].startMonth == "current") { goalConf.movs[x].startMonth = today.getMonth() + 1;}
        else {goalConf.movs[x].startMonth = Number(goalConf.movs[x].startMonth);}
        // Set StartYear
        if(goalConf.movs[x].startYear == "current") { goalConf.movs[x].startYear = today.getFullYear();}
        else {goalConf.movs[x].startYear = Number(goalConf.movs[x].startYear);}
        // Set EndMonth
        if(goalConf.movs[x].endMonth == "current") { goalConf.movs[x].endMonth = today.getMonth() + 1;}
        else {goalConf.movs[x].endMonth = Number(goalConf.movs[x].endMonth);}
        // Set EndYear
        if(goalConf.movs[x].endYear == "current") { goalConf.movs[x].endYear = today.getFullYear();}
        else {goalConf.movs[x].endYear = Number(goalConf.movs[x].endYear);}

        goalConf.movs[x].start = goalConf.movs[x].startYear * 100 + goalConf.movs[x].startMonth;
        goalConf.movs[x].end = goalConf.movs[x].endYear * 100 + goalConf.movs[x].endMonth;


        // Set AmtStart
        if(goalConf.movs[x].amtStart == "assetamt") { goalConf.movs[x].amtStart = user.stats.assetamt;} 
        else {goalConf.movs[x].amtStart = Number(goalConf.movs[x].amtStart); }

        // Set Interest Rate
        if(goalConf.movs[x].growth=="return") {
            goalConf.movs[x].growth = (user.stats.return / 100) + 1;
        } else {
            goalConf.movs[x].growth = (goalConf.movs[x].growth / 100) + 1;
        }
        //console.log(goalConf.movs[x]);
    }
    labels.shift(); // 0 is configuration
    
    let goal = {
        rows: [],
        amtStart: goalConf.movs[0].amtStart,
        growth: goalConf.movs[0].growth,
        labels: labels,

    };
    let startMonth = goalConf.movs[0].startMonth;
    let startYear = goalConf.movs[0].startYear;
    let endMonth = goalConf.movs[0].endMonth;
    let endYear = goalConf.movs[0].endYear;
    let nMovs = goalConf.movs.length;

    let current, obj;
    for(let m = startMonth; startYear < endYear || m <= endMonth ; ++m ) {
        if(m == 13) { m=1;++startYear; }
        current = startYear * 100 + m;
        obj = { year: startYear, month: m , movs: new Array()};
        for(i=1 ; i < nMovs ; ++i ) {
            //console.log("current: "+current+" st: "+goalConf.movs[i].start+" end: "+goalConf.movs[i].end);
            if(goalConf.movs[i].start <= current && goalConf.movs[i].end >= current) {
                if(goalConf.movs[i].startMonth == m && goalConf.movs[i].startYear != startYear) {
                    goalConf.movs[i].amtStart = (goalConf.movs[i].amtStart * goalConf.movs[i].growth);
                }
                obj.movs.push(goalConf.movs[i].amtStart);
            } else {
                obj.movs.push(0);
            }
        }

        goal.rows.push(obj)
        //console.log(goal.row);    
    }
    

    response.send(goal);
    
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function create(request, response) {
    //bodyParser.urlencoded({ extended: false })
    
    //console.log(request.body.datestart[0]);
    
    response.send(request.body);
    //response.render('goals/create'); 
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function createGoal(request, response) {
    
        response.redirect('/goals');
    
}

/************************************************************
 * 
 * @param {Request} request 
 * @param {Response} response 
 */
async function editGoal(request, response) {

    response.redirect('/ativos');
}


module.exports = {
    /*
     * Get methods
     */
    index,
    ShowGoal,
    
    /*
     * Post methods
     */
    create,
    ShowGoalData,
    
}
