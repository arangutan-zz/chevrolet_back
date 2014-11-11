$(function(){

    var repeater = {};
    var user_data = {};
    var carro = 'Tahoe';

    var socket = io.connect('http://192.168.1.106:3001');

    $('#send').on('click',function(){
        //socket.emit('call_seller_new', { car: 'Camaro',nombre: $('#nombre').val() ,dni: $('#cedula').val() , correo:  $('#correo').val() , telefono: $('#telefono').val()});
        var car = $('#carro').val().trim();
        var datos = { nombre: $('#nombre').val() ,dni: $('#cedula').val() , correo:  $('#correo').val() , telefono: $('#telefono').val() , carro: car
    };
        socket.emit('create_user',datos);
    });


    $('#send_o').on('click',function(){
        //socket.emit('call_seller_old', { car: 'Camaro' , dni: $('#cedula_o').val()});

        //console.log('santiago');

        var car = $('#carro').val().trim();

        var datos = { dni: $('#cedula_o').val(), carro : car};

        socket.emit('find_user',datos);


        //socket.emit('desocupar_vendedor', { carro: 'Spark' , username: 'autonal'});
    });


    socket.on('founded', function (data) {
        console.log(data);
        alert(data);
        repeater.kill();
    });


    /*Recibe los datos del usuario del server cuando se inicia sesion*/
    /*Se puede crear usuario el servidor devuelve el usuario creado*/
    /*Se puede recordar usuario el servidor devuelve el usuario ya creado*/
    socket.on('user_data', function (data) {

        /*
        1: Usuario Creado correctamente o encontrado correctamente
        2: Usuario no se encontro
        3: Usuario que se esta registrando, ya esta registrado
        4: Usuario no fue atendido y se marco como que no estaba atentido
        */

        console.log(data);
        switch(data.estado){
            case 1:
                console.log('entro aca');

                user_data = data.user;
                call_seller();

            break;
            case 2:
                alert(data.msg);
            break;
            case 3:
                alert(data.msg);
            break;
            case 4:
                alert(data.msg);
            break;
        }


    });


    var call_seller =  function(){

        socket.emit('call_seller', {car:carro, user: user_data});
        socket.emit('carro_consulta', {car:carro, user: user_data});

        repeater = TimersJS.multi(10000, 4, function(repetition) {
            socket.emit('call_seller', {car:carro, user: user_data});

        }, function() {
            socket.emit('user_pass',{user_id: user_data.dni})
        });
    }


});
