"use strict";
$(document).ready(function() {
    let goalDiv = document.getElementById("confGoalDiv");
    document.getElementById("btnAddSet").addEventListener("click", addSet);

    //let set = 0;
    function addSet() {        
        $(goalDiv).append(
            '<div class="col">\
            <h2>Fluxo de Valores</h2>\
            </div>\
            <div class="row">\
                <div class="col">\
                    Nome: <input type="text" id="nome" name="nome" class="form-control" requided>\
                </div>\
            </div>\
            <div class="row">\
                <div class="col">\
                    M&ecirc;s-Ano Inicial: <input type="text" id="datestart" name="datestart" class="form-control">\
                </div>\
                <div class="col">\
                    M&ecirc;s-Ano Final: <input type="text" id="dateend" name="dateend" class="form-control">\
                </div>\
            </div>\
            <div class="row">\
                <div class="col">\
                    Montante Inicial: <input type="text" id="valor_inicial" name="valor_inicial" class="form-control">\
                    <label class="form-check-label" for="valor_inicial">(R$)</label>\
                </div>\
                <div class="col">\
                    Crescimento: <input type="text" id="cres_rate" name="cres_rate" class="form-control">\
                    <label class="form-check-label" for="cres_rate">(%) anual</label>\
                </div>\
            </div>\
            <div class="row">\
                <div class="col">\
                    <input type="checkbox" id="disable" name="disable" >\
                </div>\
            </div>');
            
            // Fazer o Disable dos campos

            $("[name^='date']").datepicker({ format: "mm-yyyy",minViewMode: "months"});     
            $("[name='valor_inicial']").inputmask("decimal", {digits:2, max:1000000, allowMinus:false});
            $("[name='cres_rate']").inputmask("decimal", {digits:2, max:200, allowMinus:false});
            
        }
    addSet();

    /*

    $('#datestart').datepicker({
        format: "mm-yyyy",
        minViewMode: "months"
    });    
    $('#dateend').datepicker({
        format: "mm-yyyy",
        minViewMode: "months"
    });

    $('#valor_inicial').inputmask("decimal", {digits:2, max:1000000, allowMinus:false});
    $('#cres_rate').inputmask("decimal", {digits:2, max:200, allowMinus:false});
    */
});

function validate() {
    let list = document.getElementById("FormNewGoal").getElementsByTagName("input");
    let date,y,m;
    for(let i = 0; i < list.length; ++i) {
        //console.log(list[i].id);
        switch(list[i].id) {
            case "nome":
                if(list[i].value=="") {
                    list[i].classList.add("is-invalid");
                    list[i].focus();
                    return false;
                } else {list[i].classList.remove("is-invalid");}
                break;
            case "datestart":
            case "dateend":
                date = list[i].value.split('-');
                y = Number(date[1]);
                m = Number(date[0]);
                if(isNaN(y) || isNaN(m)) {
                    list[i].classList.add("is-invalid");
                    list[i].focus();
                    return false;
                } else {list[i].classList.remove("is-invalid");}
                break;
            case "valor_inicial":
            case "cres_rate":
                if(isNaN(Number(list[i].value)) || list[i].value=="") {
                    list[i].classList.add("is-invalid");
                    list[i].focus();
                    return false;
                } else {list[i].classList.remove("is-invalid");}
                break;
            
        }
        //console.log(list[i].id);
    }
    console.log("passou"+new Date());
    //alert("a");
    //return false;
}