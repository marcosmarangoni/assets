"use strict";
$(document).ready(function() {
    let goalDiv = document.getElementById("confGoalDiv");
    document.getElementById("btnAddSet").addEventListener("click", addSet);

    let set = 0;
    function addSet() {        
        $(goalDiv).append(
            '<div class="col">\
            <h2>Fluxo de Valores</h2>\
            </div>\
            <div class="row">\
                <div class="col">\
                    Nome: <input type="text" id="nome_'+set+'" name="nome_'+set+'" class="form-control">\
                </div>\
                <div class="col">\
                    Comportamento: <select id="comportamento_'+set+'" name="comportamento_'+set+'" class="form-control">\
                            <option value="once" selected >Movimento Unico</option>\
                            <option value="yearly">Movimento Anual</option>\
                            <option value="montly">Movimento Mensal</option>\
                        </select>\
                </div>\
            </div>\
            <div class="row">\
                <div class="col">\
                    M&ecirc;s-Ano Inicial: <input type="text" id="datestart_'+set+'" name="datestart_'+set+'" class="form-control">\
                </div>\
                <div class="col">\
                    M&ecirc;s-Ano Final: <input type="text" id="dateend_'+set+'" name="dateend_'+set+'" class="form-control">\
                </div>\
            </div>\
            <div class="row">\
                <div class="col">\
                    Montante Inicial: <input type="text" id="valorinicial_'+set+'" name="valorinicial_'+set+'" class="form-control">\
                    <label class="form-check-label" for="valorinicial_'+set+'">(R$)</label><br />\
                    <input type="checkbox" id="patvalue_'+set+'" name="patvalue_'+set+'" onChange=\'disable(this,"valorinicial_'+set+'")\' >\
                    <label for id="patvalue_'+set+'">Utilizar Valor de Patrim&ocirc;nio</label>\
                </div>\
                <div class="col">\
                    Crescimento: <input type="text" id="cresrate_'+set+'" name="cresrate_'+set+'" class="form-control">\
                    <label class="form-check-label" for="cresrate_'+set+'">(%) anual</label><br />\
                    <input type="checkbox" id="patrate_'+set+'" name="patrate_'+set+'" onChange=\'disable(this,"cresrate_'+set+'")\' >\
                    <label for id="patrate_'+set+'">Utilizar Retorno do Patrim&ocirc;nio</label>\
                </div>\
            </div>\
            <div class="row">\
                <div class="col">\
                    <input type="checkbox" id="disable_'+set+'" name="disable_'+set+'"  onChange=\'disable(this,"All_'+set+'")\' >\
                    <label for id="disable_'+set+'">Desabilitar</label>\
                </div>\
            </div>');
            ++set;
            // Fazer o Disable dos campos

            $("[name^='date']").datepicker({ format: "mm-yyyy",minViewMode: "months"});     
            $("[name^='valorinicial']").inputmask("decimal", {digits:2, max:1000000, allowMinus:false});
            $("[name^='cresrate']").inputmask("decimal", {digits:2, max:200, allowMinus:false});
            
        }
    addSet();
    
});
function disable(check,input) {
    let t = input.split('_');
    let bool = false;
    if(check.checked) {bool = true;}
    
    if(t[0]=="All") {
      document.getElementById("nome_"+t[1]).disabled = bool;  
      document.getElementById("datestart_"+t[1]).disabled = bool;  
      document.getElementById("dateend_"+t[1]).disabled = bool;  
      document.getElementById("valorinicial_"+t[1]).disabled = bool;  
      document.getElementById("cresrate_"+t[1]).disabled = bool;  
    } else {
        document.getElementById(t[0]+"_"+t[1]).disabled = bool;  
    }
}

function validate() {
    let list = document.getElementById("FormNewGoal").getElementsByTagName("input");
    let date,y,m,inputName;
    for(let i = 0; i < list.length; ++i) {
        if(list[i].disabled==false) {
            inputName = list[i].id.split('_');
            switch(inputName[0]) {
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
                case "valorinicial":
                case "cresrate":
                    if(isNaN(Number(list[i].value)) || list[i].value=="") {
                        list[i].classList.add("is-invalid");
                        list[i].focus();
                        return false;
                    } else {list[i].classList.remove("is-invalid");}
                    break;
            }
        }
    }
    console.log("passou"+new Date());
    //alert("a");
    //return false;
}