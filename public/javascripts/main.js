function whenDone(response) {
    if (response.error) {
        let message = '';
        for (let key in response.errors) {
            message += `<p>${response.errors[key].message}</p>`;
        }
        $('#error').html(message).show();
    }
}

function whenFail() {
    $('#error').html('Something went wrong when sending data to server').show();
}
$('form#createUserForm').submit(function (e) {
    let form = $(this);

    // jQuery ajax
    $.ajax({
        url: form.attr('action'),
        method: form.attr('method'),
        data: form.serialize()
    }).done(function (response) {
        whenDone(response);
    }).fail(function () {
        whenFail();
    });

    // Dont trigger the form action
    e.preventDefault();
});

var usersDataTable = $('#usersDataTable').DataTable({
    ajax: {
        url: '/users/list_users',
        type: 'post',
        dataSrc: ''
    },
    columns: [
        { 
            data: 'username',
        },
        {
            data: 'password'
        },
        {
            data: 'first_name'
        },
        {
            data: 'last_name'
        }
    ]
});