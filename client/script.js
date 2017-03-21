$(document).ready(function () {
    
    $(".chirp").on('click', postChirp);
    $('.chirp').prop('disabled', true);
    $('#textbox').on('input', function () {
        $('.chirp').prop('disabled', $(this).val().length === 0);
    });

    $('#textbox').focus();

    function deleteChirp(id) {
        $.ajax({
            method: 'DELETE',
            url: 'http://localhost:3000/api/chirps/' + id,
            contentType: 'application/json'
             }).then(function (success) {
            // for (var i = 0; i < success.length; i++) {
            //     $('#list-content').remove('<li class="list-group-item">' + success[i].user + ':' + success[i].message + '/' + success[i].timestamp + '<button type="button" class="btn btn-info pull-right btn-xs" id="delete">Delete</button>' + '</div>');
            // };
            window.location.reload();
            console.log('deleting');
         });
    };
    
    function getChirps() { 
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/api/chirps',
        contentType: 'application/json',
            }).then(function (success) {
            for (var i = 0; i < success.length; i++) {
                prependChirp(success[i]);
            };
        });
    };

    function prependChirp(chirp) {
        $chirpLi = $('<li class="list-group-item">' + chirp.userName + ':' + chirp.message + '/' + chirp.timestamp + '</li>');
        $deleteButton = $('<button type="button" class="btn btn-info pull-right btn-xs">Delete</button>');
        $chirpLi.append($deleteButton);
        $deleteButton.click(function() {
            deleteChirp(chirp.id);
        });
        $('#list-content').prepend($chirpLi);
    }

    function postChirp() {
        console.log('posted');
        var chirpies = {
            message: $('#textbox').val(),
            userId: $('#user-selector').val()
            // timestamp: new Date()
        }

        $.ajax({
            method: 'POST',
            url: "http://localhost:3000/api/chirps",
            contentType: 'application/json',
            data: JSON.stringify(chirpies),
        }).then(function () {
            // console.log('working');
            // $('#list-content').prepend('<li class="list-group-item">' + chirps.user + ':' + chirps.message + '/' + chirps.timestamp + '<button type="button" class="btn btn-info pull-right btn-xs" id="delete">Delete</button>' + '</li>'); 
            $('#textbox').val('');
            $('.chirp').prop('disabled', true);
            window.location.reload();
        });
    };

  getChirps();
  getUsers();

  function getUsers() { 
    $.ajax({
        method: 'GET',
        url: 'http://localhost:3000/api/users',
        contentType: 'application/json'
    }).then(function(userTable){
        for (var i = 0; i < userTable.length; i++) {
            var user = userTable[i];
            function insertUserOption(user) {
            $('#user-selector').append('<option value="' + user.id + '">' + user.name + '</option>');
            
        }
        insertUserOption(user);
    };
        
    });
  }
});

