$(document).ready(function() {
    let goal;
    $.ajax({url: "/goals/1", type: "POST", async: false ,  success: function(result){
        goal = result;
    }});
    console.log(goal);

    const MonthNames = ["", "Jan", "Fev", "Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
    let table = document.getElementById("goalsList");

    let row, cell;
    let mgrowth = Math.pow(goal.growth, 1/12);

    
    row = table.insertRow(0);    
    cell = row.insertCell(0);
    cell.innerHTML = "Mes";
    let i;
    for(i=0 ; i < goal.labels.length ; ++i) {
        cell = row.insertCell(i + 1);  // i + offset das cell anteriores
        cell.innerHTML = goal.labels[i];
    }   
    cell = row.insertCell(i + 1); // I sai incrementado
    cell.innerHTML = "Saldo";
    
    let totalMovsRow;
    for(let x = 0 ; x < goal.rows.length ; ++x) {
        totalMovsRow = 0;
        row = table.insertRow(x+1);
        cell = row.insertCell(0);
        cell.innerHTML = MonthNames[goal.rows[x].month]+"-"+goal.rows[x].year;
        let i=0;
        for( i=0 ; i < goal.labels.length ; ++i) {
            cell = row.insertCell(i + 1);  // i + offset das cell anteriores
            cell.innerHTML = goal.rows[x].movs[i].toFixed(2);
            totalMovsRow += goal.rows[x].movs[i];
            cell.style.textAlign = 'right';
        }
        cell = row.insertCell(i + 1); // I sai incrementado

        cell.innerHTML = (goal.amtStart-totalMovsRow).toFixed(2);
        cell.style.textAlign = 'right';
        goal.amtStart = goal.amtStart * mgrowth;
    }
    console.log(goal);
});