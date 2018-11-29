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
                M&ecirc;s-Ano Inicial: <input type="text" id="datestart" name="datestart['+set+']" class="form-control">\
                <div class="form-check">\
                    <input class="form-check-input" type="checkbox" id="mescorrente" name="mescorrente['+set+']">\
                    <label class="form-check-label" for="mescorrente">M&ecirc;s Corrente</label>\
                </div>\
            </div>\
            <div class="col">\
                M&ecirc;s-Ano Final: <input type="text" id="dateend" name="dateend['+set+']" class="form-control">\
            </div>\
        </div>\
        <div class="row">\
            <div class="col">\
                Montante Inicial: <input type="text" id="valor_inicial" name="valor_inicial['+set+']" class="form-control">\
                <label class="form-check-label" for="valor_inicial">(R$)</label>\
            </div>\
            <div class="col">\
                Crescimento: <input type="text" id="cres_rate" name="cres_rate['+set+']" class="form-control">\
                <label class="form-check-label" for="cres_rate">(%) anual</label>\
            </div>\
        </div>');
        ++set;
        }
    addSet();

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
});