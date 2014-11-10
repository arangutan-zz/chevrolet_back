
var io = require('www');

io.sockets.on('connection', function (socket) {

	/*When the customer is new the system*/
    socket.on('call_seller_new', function (data) {


    	var cliente = new Cliente({
    		name: data.nombre,
			dni:  data.dni,
			celphone:  data.correo,
			correo :  data.correo
    	}).save(function (err, obj) {
			if (err) return console.error(err);
		  	//console.log(obj);
		});
  


        console.log(data);
        io.sockets.emit('notify_sellers', {tablet_id: socket.id, car

        	: data.car, client: cliente});
    });


    /*When the customer is old the system, but want to see the same car o a diferente car*/

     socket.on('call_seller_old', function (data) {


     	siguienteTurno();

     	Cliente.findOne({ dni: data.dni },function (err, cliente) {
			if (err) return handleError(err);

			if (cliente) {
				socket.emit('responseold',"Hola "+cliente.name+" ya estamos consiguiendo un vendedor para que te colabore");
				io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: cliente});
			}else{
				socket.emit('responseold',"no existe un cliente con este dni");
			}
		});

    });


    socket.on('seller_acepted', function (data) {

		io.to(data.tablet_id).emit('founded', 'ya va en camino');
    });

});



var siguienteTurno = function(){
	console.log("entro a calcular turno");
	Concesionario.findOne({atendiendo : true},function(err,c_atendiendo){
		if (err) {console.log("error");};
		if (c_atendiendo) {

			Concesionario.count({}, function( err, count){

			    console.log( "Nummero de consecionarios: "+ count +" van en el turno "+ c_atendiendo.turno);

			    if (c_atendiendo.turno + 1 > count) {
			    	console.log("volver a empezar");

			    	Concesionario.findOne({turno : 1},function(err,c_primer){
			    		c_primer.atendiendo = true;
			    		c_atendiendo.atendiendo = false;
			    		c_atendiendo.save(function(err,c_aten){
			    			c_primer.save(function(err,c_primer){
			    				console.log(c_primer);
			    			});
			    		});
			    	});


			    } else{
			    	console.log("siguiente");

			    	Concesionario.findOne({turno : c_atendiendo.turno + 1},function(err,c_siguiente){
			    		c_siguiente.atendiendo = true;
			    		c_atendiendo.atendiendo = false;
			    		c_atendiendo.save(function(err,c_aten){
			    			c_siguiente.save(function(err,c_siguiente){
			    				console.log(c_siguiente);
			    			});
			    		});
			    	});
			    }

			})
		} else{

		};
	});
}


var cancelarTurno = function(){
	console.log("entro a cancelar turno");

	Concesionario.findOne({atendiendo : true},function(err,c_atendiendo){
		if (err) {console.log("error");};
		if (c_atendiendo) {

			Concesionario.count({}, function( err, count){

			    console.log( "Nummero de consecionarios: "+ count +" van en el turno "+ c_atendiendo.turno);

			    if (c_atendiendo.turno + 1 > count) {
			    	console.log("volver a empezar");

			    	Concesionario.findOne({turno : 1},function(err,c_primer){
			    		c_primer.atendiendo = true;
			    		c_atendiendo.atendiendo = false;
			    		c_atendiendo.save(function(err,c_aten){
			    			c_primer.save(function(err,c_primer){
			    				console.log(c_primer);
			    			});
			    		});
			    	});

			    } else{
			    	console.log("siguiente");

			    	Concesionario.findOne({turno : c_atendiendo.turno + 1},function(err,c_siguiente){
			    		c_siguiente.atendiendo = true;
			    		c_atendiendo.atendiendo = false;
			    		c_atendiendo.save(function(err,c_aten){
			    			c_siguiente.save(function(err,c_siguiente){
			    				console.log(c_siguiente);
			    			});
			    		});
			    	});
			    }

			})
		} else{

		};
	});
}