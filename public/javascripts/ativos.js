"use strict";
/* Formatting function for row details - modify as you need */
function formatTable ( d ) {
    // d is the original data object for the row
    let t =  '<table cellpadding="4" cellspacing="0" style="width:100%;">\
        <tr><th>Movimento</th><th>Data</th><th>Valor</th><th>A&ccedil;&otilde;es</th></tr>';
    let tipo;
    d.trades.forEach(element => { 
        var disabled = "";
        switch(element.tipo) {
            case "c": 
                tipo = "Compra";
                break;
            case "v":
                tipo = "Venda"
                break;
            case "p":
                tipo = "Patrimonio"
                disabled = " disabled ";
                break;
            case "d":
                tipo = "Dividendo"
                break;
        }
        console.log(element.date);
        let tempdata = element.date.split('T');
        let dateArray = tempdata[0].split('-');
        let date = new Date(dateArray[0],(dateArray[1]-1),dateArray[2],0,0,0,0);
        t += '<tr><td>'+tipo+'</td>'+            
                    '<td class="text-right">'+formatDate(date)+'</td>\
                    <td class="text-right">'+Number(element.value).toFixed(2)+'</td>\
                    <td class="text-center"><button '+disabled+' onClick="fillEditTradeModal(\''+
                        (d._id)+'\',\''+element.trade_id+'\',\''+
                        dateArray[0]+'-'+dateArray[1]+'-'+dateArray[2]+'\',\''+element.value+'\',\''+element.tipo+'\')" \
                    class="btn btn-sm">Edit Trade</button></td></tr>';
    });
    t += '</table>';
    return t;
}

// Edit Trade
function fillEditTradeModal(objid, tradeid, date, value, tipo) {
    $('#f3txtid').val(objid);
    $('#f3txttradeid').val(tradeid);
    $('#f3txttradeid').val(tradeid);
    $('#f3txtdate').val(date);
    $('#f3txtvalor').val(value);
    $('#f3seltipo').val(tipo);
    $('#EditTradeModal').modal('show');
}

function formatDate(date) {
    var monthNames = [ "", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out","Nov", "Dez"];
  
    var day = date.getDate();
    var monthNum = (date.getMonth()+1);
    var year = date.getFullYear();
  
    return ('0'+day).slice(-2) + '-' + monthNames[monthNum] + '-' + year;
}

$(document).ready(function() {
    let results;
    $.ajax({url: "/ativos", type: "POST", async: false ,  success: function(result){
        results = result;
    }});
    
    // Fazendo Datalist das Classificacoes
    let datalist_1 = document.getElementById("dl_class1");
    let datalist_2 = document.getElementById("dl_class2");
    let datalist_3 = document.getElementById("dl_class3");
    let usedClass = [[],[],[]];
    results.AtivosTable.forEach(
        function(element) {
            try {
                if (!usedClass[0].includes(element.class.c1)) {
                    datalist_1.insertAdjacentHTML('beforeend',  '<option value="'+element.class.c1+'" />');
                    usedClass[0].push(element.class.c1);
                } 
                if (!usedClass[1].includes(element.class.c2)) {
                    datalist_2.insertAdjacentHTML('beforeend',  '<option value="'+element.class.c2+'" />');
                    usedClass[1].push(element.class.c2);
                } 
                if (!usedClass[2].includes(element.class.c3)) {
                    datalist_3.insertAdjacentHTML('beforeend',  '<option value="'+element.class.c3+'" />');
                    usedClass[2].push(element.class.c3);
                } 
            } catch {}
      });
      
// ************** Start of Table - DataTable *****************
    let ativosList = $('#ativosList').DataTable({
        data: results.AtivosTable,
        paging: false, 
        info: false,
        language: {
            search: "Localizar: ",
        },
        columns: [
            {
                className: 'details-control',
                orderable: false,
                data: null,
                defaultContent: '<img height="32" width="32" src="/images/plus.svg" />',
            },
            { 
                data: 'codigo',
            },
            {
                data: 'saldo',
                className: "text-right",
            },
            {
                data: 'unitario',
                className: "text-right",
                render: $.fn.dataTable.render.number( '.', ',', 2, 'R$ ' ),
            },
            {
                data: 'patrimonio',
                className: "text-right",
                render: $.fn.dataTable.render.number( '.', ',', 2, 'R$ ' ),
            },
            {
                data: 'retorno',
                className: "text-right",
                render: $.fn.dataTable.render.number( '.', ',', 2,'','%'),
            },
            {
                orderable: false,
                width: "5px", 
                className: "text-center text-nowrap",
                data: null,
                defaultContent: '<button id="btnopcoes" class="btn btn-sm">\
                        Op&ccedil;&otilde;es</button> \
                        <button id="btnaddtrade" class="btn btn-sm">Add Trade</button>',
            }
        ],
        "footerCallback": function (tfoot, data, start, end, display) {
            $(tfoot).find('th').eq(0).html( $.fn.dataTable.render.number('.', ',', 2, 'R$ ').display(results.TotalAtivos.patrimonio) );
            $(tfoot).find('th').eq(1).html( $.fn.dataTable.render.number('.', ',', 2, '% ').display(results.TotalAtivos.retorno) );

        }
    });
    $('.dataTables_filter label').css( "color", "white" );
    // ************** End of Table - DataTable *****************

    
    let dataChart = {
        labels: new Array(), 
        datasets:[{ data: new Array(), backgroundColor: new Array() }]
    };



    
    let ci = 0;
    
    results.AtivosTable.forEach(element => {
        dataChart.labels.push(element.codigo);
        dataChart.datasets[0].data.push(Number(element.patrimonio.toFixed(2)));
        dataChart.datasets[0].backgroundColor.push(colors[ci%10]);
    
        console.log(element.codigo+" - "+element.class.c1+" - "+Number(element.patrimonio.toFixed(2)));

        Class01dataChart = addItemsToGraph(Class01dataChart, element.class.c1, element.patrimonio, element.codigo);
        Class02dataChart = addItemsToGraph(Class02dataChart, element.class.c2, element.patrimonio, element.codigo);
        Class03dataChart = addItemsToGraph(Class03dataChart, element.class.c3, element.patrimonio, element.codigo);

        ++ci;
    });


    let AtivoChart = generateNewChart("AtivoChart", dataChart);
    let Class01Chart = generateNewChart("Class01Chart",Class01dataChart);
    let Class02Chart = generateNewChart("Class02Chart",Class02dataChart);
    let Class03Chart = generateNewChart("Class03Chart",Class03dataChart);

    // Add event listener for opening and closing details
    $('#ativosList tbody').on('click', 'td.details-control', function() {
        var tr = $(this).closest('tr');
        var row = ativosList.row( tr );
 
        if ( row.child.isShown() ) {
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            row.child( formatTable( row.data() ) ).show();
            tr.addClass('shown');
        }
    });

    // Filling modal Opcoes
    $('#ativosList tbody').on('click', '#btnopcoes', function () {
        $('#OptionsModal').modal('show');
        $('#f2txtativo').val(ativosList.row( $(this).parents('tr') ).data().codigo);
        $('#f2txtid').val(ativosList.row( $(this).parents('tr') ).data()._id);
        $('#f2txtsaldo').val(ativosList.row( $(this).parents('tr') ).data().saldo);
        $('#f2txtunitario').val(ativosList.row( $(this).parents('tr') ).data().unitario);
        $('#f2txtguess').val(ativosList.row( $(this).parents('tr') ).data().retorno);
        $('#f2txtclass01').val(ativosList.row( $(this).parents('tr') ).data().class.c1);
        $('#f2txtclass02').val(ativosList.row( $(this).parents('tr') ).data().class.c2);
        $('#f2txtclass03').val(ativosList.row( $(this).parents('tr') ).data().class.c3);
        
        
    });

    // Filling modal Add Trade
    $('#ativosList tbody').on('click', '#btnaddtrade', function () {
        $('#TradeModal').modal('show');
        $('#txtativo').val(ativosList.row( $(this).parents('tr') ).data().codigo);
        $('#txtid').val(ativosList.row( $(this).parents('tr') ).data()._id);
    });

    //Submiting Add Trade
    $('#btntradesubmit').click(function() {
        if($('#txtdate').val().length < 4) { return throwError($('#txtdate'));}
        if( $('#txtvalor').val() == "" ||  Number($('#txtvalor').val()) == 0 ) {
            return throwError($('#txtvalor'));}
        $('#formNewTrade').submit();
    });

    // Edit Trade
    $('#btnedittradesubmit').click(function() {
        if($('#f3txtdate').val().length < 4) { return throwError($('#f3txtdate'));}
        if( $('#f3txtvalor').val() == "" ||  Number($('#f3txtvalor').val()) == 0 ) {
            return throwError($('#f3txtvalor'));}
        $('#formEditTrade').submit();
    });

    // Opcoes
    $('#btnopcoessubmit').click(function() {
        if($('#f2txtativo').val().length < 2) { return throwError($('#f2txtativo'));}
        if( $('#f2txtsaldo').val() == "") {
            return throwError($('#f2txtsaldo'));}
        if( $('#f2txtunitario').val() == "" ||  Number($('#f2txtunitario').val()) == 0 ) {
            return throwError($('#f2txtunitario'));}
        $('#formEditAtivo').submit();
    });

});

let colors = ["#FF6666", "#FFB266", "#FFFF66", "#66FF66", "#66FFFF", "#66B2FF", "#6666FF", "#B266FF",
        "#FF66FF", "#FF66B2", "#C0C0C0"];

let Class01dataChart = {labels: ["Indefinido"], datasets:[{ data: [0], backgroundColor: [0] }]};
let Class02dataChart = {labels: ["Indefinido"], datasets:[{ data: [0], backgroundColor: [0] }]};
let Class03dataChart = {labels: ["Indefinido"], datasets:[{ data: [0], backgroundColor: [0] }]};

// Class01dataChart = addItemsToGraph(element,Class01dataChart, element.class.c1, element.patrimonio, element.codigo);
function addItemsToGraph(DataChart,classif, patrimonio, codigo) {
    let position;
    if(classif=="") { //  Se nao tiver categoria
        //console.log("Indefinido: "+codigo+" Pat: "+Number(patrimonio.toFixed(2)));
        DataChart.datasets[0].data[0] += Number(patrimonio.toFixed(2));
        DataChart.datasets[0].backgroundColor[0] = colors[0];
    } else if(DataChart.labels.includes(classif)) { // se categoria ja tiver sido add
            //console.log(codigo+": Adicionando Existente")
            position = DataChart.labels.indexOf(classif);
            DataChart.datasets[0].data[position] += Number(patrimonio.toFixed(2));
    } else { // Inseriondo nova categoria ao grafico
        //console.log(codigo+": Pushing")
            DataChart.labels.push(classif);
            DataChart.datasets[0].data.push(Number(patrimonio.toFixed(2)));
            DataChart.datasets[0].backgroundColor.push(colors[DataChart.datasets[0].backgroundColor.length]);
    }
    return DataChart;
}


function generateNewChart(element, data) {
    return new Chart(document.getElementById(element),{
        type:"doughnut",
        data: data,
        options: {
            "animation.animateRotate":false,
            legend: {
                position: 'right',
                labels: {
                    fontSize:14,
                    boxWidth: 50,
                    fontColor:'#ffffff',
                }
            },
            tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var total = dataset.data.reduce(function(previousValue, currentValue, currentIndex, array) {
                      return previousValue + currentValue;
                    });
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = ((currentValue/total) * 100);
                    return percentage.toFixed(2) + "%";
                  }
                }
            }
        }
    });

}

function throwError(obj) {
    obj.addClass("is-invalid");
    return false;
}
