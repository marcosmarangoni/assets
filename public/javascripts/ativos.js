
/* Formatting function for row details - modify as you need */
function format ( d ) {
    // `d` is the original data object for the row
    let t =  '<table cellpadding="4" cellspacing="0" border="0" style="padding-left:50px;">';
    let tipo;
    d.forEach(element => {
        switch(element.tipo) {
            case "c": 
                tipo = "Compra";
                break;
            case "v":
                tipo = "Venda"
                break;
            case "p":
                tipo = "Patrimonio"
                break;
            case "d":
                tipo = "Dividendo."
                break;
        }
        t +=   '<tr><td>'+tipo+'</td>'+            
                    '<td>'+element.date+'</td>'+
                    '<td>'+Number(element.value).toFixed(2)+'</td></tr>';
    });
    t += '</table>';
    return t;
}
 
$(document).ready(function() {

    var ativosList = $('#ativosList').DataTable({
        ajax: {
            url: '/ativos',
            type: 'post',
            dataSrc: ''
        },
        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": '+',
            },
            { 
                data: 'codigo',
            },
            {
                data: 'saldo',
                className: 'dt-body-right', // Nao funciona no Bootstrap 4
            },
            {
                data: 'unitario',
                className: 'dt-body-right',
                render: $.fn.dataTable.render.number( '.', ',', 2, 'R$' ),
            },
            {
                data: 'retorno',
                className: 'dt-body-right',
                render: $.fn.dataTable.render.number( '.', ',', 2),
            }
        ]
    });


    // Add event listener for opening and closing details
    $('#ativosList tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = ativosList.row( tr );
 
        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data().trade) ).show();
            tr.addClass('shown');
        }
    } );
} );