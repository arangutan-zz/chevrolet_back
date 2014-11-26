var Cliente = require('../models/cliente');
var Vendedor = require('../models/vendedor');
var Concesionario = require('../models/concesionario');
var Dashboard = require('../models/dashboard');
var Agenda = require('../models/agenda');
var dashboard_f = require('./dashb_funciones.js');

var obtenerFechaString = function(){
	var d = new Date();
	return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()
}


var siguienteTurnoParametrizado = function(io, socket, data){
	Concesionario.findOne({atendiendo : true })
		.exec(function (err,concesionario) {
			if (err) {console.log("error");};
			if (concesionario) {

				if (concesionario.cupos - concesionario.cupos_usados > 0) {/*Le quedan cupos por asignar*/
					
					/*
						1. Mira si tiene vendedores en cola
						2. Aumenta sus cupos asignados
						3. Notifica al vendedor
						4. Quita de la cola
					*/

					console.log( "Nombre del concesionario "+concesionario.name+" tiene "+concesionario.cupos+" cupos y por asignar le quedan "+ (concesionario.cupos - concesionario.cupos_usados));

					if (concesionario.cola_vendedores.length > 0) {
						
						concesionario.cupos_usados = concesionario.cupos_usados + 1;

						concesionario.save(function (err,concesionario) {
							Vendedor.findOne({_id : concesionario.cola_vendedores[0]},function (err,vendedor) {
							if (vendedor) {
			    					io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: concesionario, user: data.user});
	    							io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: concesionario, user: data.user, vendedor:vendedor});
	    							eliminarPrimerVendedorCola(concesionario._id);
								}else{
									io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: concesionario, user: data.user});
	    							io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: concesionario, user: data.user, vendedor:null});
	    							eliminarPrimerVendedorCola(concesionario._id);
								}
							});
						})

						

					}else{
						console.log(concesionario.name+': no tiene vendedores en cola y tiene '+ (concesionario.cupos - concesionario.cupos_usados) +' turnos faltantes');
					}


				}else{/*No le quedan cupos por asignar*/
					/*
						1. Modifica los cupos asignados a 0 del concesionario para cuando le vuelva a tocar.
						2. Busca el siguiente concesionario
						3. Modifica al anterior que ya no esta atendiendo por el nuevo en atender
						4. Mira si tiene vendedores en cola
						5. Aumenta sus cupos asignados
						6. Notifica al vendedor
						7. Quita de la cola

					*/


					Concesionario.count({}, function( err, count){
						console.log( "Numero de consecionarios: "+ count +" van en el turno "+ (concesionario.turno+1));

						if (concesionario.turno + 1 > count) {
							/*Vuelve a empezar*/

							Concesionario.findOne({turno : 1},function(err,c_primer){
									 c_primer.atendiendo = true;
				    			concesionario.atendiendo = false;
							concesionario.cupos_usados = 0;
							console.log( "Nombre del concesionario "+c_primer.name+" tiene "+c_primer.cupos+" cupos y por asignar le quedan "+ (c_primer.cupos - c_primer.cupos_usados));

				    			concesionario.save(function(err,c_aten){
					    			c_primer.save(function(err,c_primer){

										if (c_primer.cola_vendedores.length > 0) {
											

											c_primer.cupos_usados = 1 + c_primer.cupos_usados;

											c_primer.save(function (err,c_primer) {
												// body...
												Vendedor.findOne({_id : c_primer.cola_vendedores[0]},function (err,vendedor) {
													if (vendedor) {
								    					io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user});
						    							io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user, vendedor:vendedor});
						    							eliminarPrimerVendedorCola(c_primer._id);
													}else{
														io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user});
						    							io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user, vendedor:null});
						    							eliminarPrimerVendedorCola(c_primer._id);
													}
												})

											})
										}else{
											console.log(c_primer.name+': no tiene vendedores en cola');
										}



					    				//return c_primer;
					    			});
					    		});

							});


						}else{
							/*Calcula el siguiente turno*/

							Concesionario.findOne({turno : concesionario.turno + 1},function(err,c_siguiente){
					    		c_siguiente.atendiendo = true;
					    		concesionario.atendiendo = false;
							concesionario.cupos_usados = 0;
							console.log( "Nombre del concesionario "+c_siguiente.name+" tiene "+c_siguiente.cupos+" cupos y por asignar le quedan "+ (c_siguiente.cupos - c_siguiente.cupos_usados));
					    		concesionario.save(function(err,c_aten){
					    			c_siguiente.save(function(err,c_siguiente){

										//return c_siguiente;

					    				if (c_siguiente.cola_vendedores.length > 0) {
											
					    					c_siguiente.cupos_usados = c_siguiente.cupos_usados + 1 ;

					    					c_siguiente.save(function (err, c_siguiente) {
					    						// body...

												Vendedor.findOne({_id : c_siguiente.cola_vendedores[0]},function (err,vendedor) {
													if (vendedor) {
								    					io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user});
						    							io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user, vendedor:vendedor});
						    							eliminarPrimerVendedorCola(c_siguiente._id);
													}else{
														io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user});
						    							io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user, vendedor:null});
						    							eliminarPrimerVendedorCola(c_siguiente._id);
													}
												})

											})
										}else{
											console.log(c_siguiente.name+': no tiene vendedores en cola');
										}


					    			});
					    		});
					    	});

						}

					});
				}
			};
		})
}



var siguienteTurno = function(io, socket, data){
	//console.log("entro a calcular turno");
	Concesionario.findOne({atendiendo : true})
		//.where({'pictures.0': {$exists: true}})
		.exec(function(err,c_atendiendo){
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

								if (c_primer.cola_vendedores.length > 0) {
									
									Vendedor.findOne({_id : c_primer.cola_vendedores[0]},function (err,vendedor) {
										if (vendedor) {
					    					 io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user});
			    							 io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user, vendedor:vendedor});
			    							 eliminarPrimerVendedorCola(c_primer._id);
    										}else{
									         io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user});
			    							 io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user, vendedor:null});
                                                                                 //eliminarPrimerVendedorCola(c_primer._id);
										}
									})
								}else{
									console.log(c_primer.name+': no tiene vendedores en cola');
								}



			    				//return c_primer;
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

								//return c_siguiente;

			    				if (c_siguiente.cola_vendedores.length > 0) {
									
									Vendedor.findOne({_id : c_siguiente.cola_vendedores[0]},function (err,vendedor) {
										if (vendedor) {
					    						io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user});
			    								io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user, vendedor:vendedor});
			    								eliminarPrimerVendedorCola(c_siguiente._id);
										}else{
			    								io.sockets.emit('notify_tv', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user, vendedor:null});
					    						io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user});
			    								eliminarPrimerVendedorCola(c_siguiente._id);
										}
									})
								}else{
									console.log(c_siguiente.name+': no tiene vendedores en cola');
								}


			    			});
			    		});
			    	});
			    }

			})
		}
	});
}

// var siguienteTurnoSinTv = function(io, socket, data){
// 	console.log("entro a calcular turno");
// 	Concesionario.findOne({atendiendo : true},function(err,c_atendiendo){
// 		if (err) {console.log("error");};
// 		if (c_atendiendo) {
//
// 			Concesionario.count({}, function( err, count){
//
// 			    console.log( "Nummero de consecionarios: "+ count +" van en el turno "+ c_atendiendo.turno);
//
// 			    if (c_atendiendo.turno + 1 > count) {
// 			    	console.log("volver a empezar");
//
// 			    	Concesionario.findOne({turno : 1},function(err,c_primer){
// 			    		c_primer.atendiendo = true;
// 			    		c_atendiendo.atendiendo = false;
// 			    		c_atendiendo.save(function(err,c_aten){
// 			    			c_primer.save(function(err,c_primer){
// 			    				io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_primer, user: data.user});
//
// 			    				//return c_primer;
// 			    			});
// 			    		});
// 			    	});
//
// 			    } else{
// 			    	console.log("siguiente");
//
// 			    	Concesionario.findOne({turno : c_atendiendo.turno + 1},function(err,c_siguiente){
// 			    		c_siguiente.atendiendo = true;
// 			    		c_atendiendo.atendiendo = false;
// 			    		c_atendiendo.save(function(err,c_aten){
// 			    			c_siguiente.save(function(err,c_siguiente){
// 			    				io.sockets.emit('notify_sellers', {tablet_id: socket.id, car: data.car, client: data.cliente, turno: c_siguiente, user: data.user});
// 			    				//return c_siguiente;
// 			    			});
// 			    		});
// 			    	});
// 			    }
//
// 			})
// 		}
// 	});
// }
//
//
// var cancelarTurno = function(){
// 	console.log("entro a cancelar turno");
//
// 	Concesionario.findOne({atendiendo : true},function(err,c_atendiendo){
// 		if (err) {console.log("error");};
// 		if (c_atendiendo) {
//
// 			Concesionario.count({}, function( err, count){
//
// 			    console.log( "Nummero de consecionarios: "+ count +" van en el turno "+ c_atendiendo.turno);
//
// 			    if (c_atendiendo.turno + 1 > count) {
// 			    	console.log("volver a empezar");
//
// 			    	Concesionario.findOne({turno : 1},function(err,c_primer){
// 			    		c_primer.atendiendo = true;
// 			    		c_atendiendo.atendiendo = false;
// 			    		c_atendiendo.save(function(err,c_aten){
// 			    			c_primer.save(function(err,c_primer){
// 			    				console.log(c_primer);
// 			    			});
// 			    		});
// 			    	});
//
// 			    } else{
// 			    	console.log("siguiente");
//
// 			    	Concesionario.findOne({turno : c_atendiendo.turno + 1},function(err,c_siguiente){
// 			    		c_siguiente.atendiendo = true;
// 			    		c_atendiendo.atendiendo = false;
// 			    		c_atendiendo.save(function(err,c_aten){
// 			    			c_siguiente.save(function(err,c_siguiente){
// 			    				console.log(c_siguiente);
// 			    			});
// 			    		});
// 			    	});
// 			    }
//
// 			})
// 		} else{
//
// 		};
// 	});
// }


var buscarVendedorDni = function(dni){

	//console.log(dni);

	var vende;

	Vendedor.findOne({cedula : dni},function (err,vendedor){
		if (err) return handleError(err);
		vende = vendedor;
	});


	return vende;
}


var cambiarEstadoCompraNew = function(data,socket,io){

	var cliente = new Cliente({
		name: data.name_user,
		dni:  data.dni_user,
		celphone:  data.celphone_user,
		correo :  data.email_user,
		comprado : data.car,
		estado : 'comprador'
	});

		/*Search the seller*/

	Vendedor.findOne({cedula : data.dni_seller},function (err,vendedor){


		if (err) return handleError(err);

		if (vendedor) {


			vendedor.ventas.push({
				day: obtenerFechaString(),
				date : Date(),
				carro : data.car
			});

			vendedor.num_ventas = vendedor.num_ventas + 1 ;

			cliente.save(function (err, cliente) {
				if (err) {
					console.log('entro al error');
					console.error(err);
					return console.log(err);
				}
				vendedor.save(function(err, vendedor_s){
					if (vendedor_s) {
							socket.emit('mensaje_compra',{cod: 1, msg: 'Muchas Gracias por su compra'});
							dashboard_f.aumentar_vendidos(data.car,cliente._id,vendedor_s._id,io);
					}

				});

			});



		} else{
			socket.emit('mensaje_compra',{cod: 2, msg: 'No se encontro vendedor con esta cedula'});
		};

	});

}


var cambiarEstadoCompra = function(data,socket,io){


	Cliente.findOne({ dni: data.dni_user },function (err, cliente) {
		if (err) return handleError(err);

		var obj = {};

		if (cliente) {

			cliente.comprado = data.car;
			cliente.estado = "comprador";


			cliente.save(function(err,cliente){
				if (err) console.log(err);


				/*Search the seller*/

				Vendedor.findOne({cedula : data.dni_seller},function (err,vendedor){
					if (err) return handleError(err);

					if (vendedor) {
						//vendedor.where('tags').in(['game', 'fun', 'holiday'])
						vendedor.ventas.push({
							day: obtenerFechaString(),
							date : Date(),
							carro : data.car
						});

						vendedor.num_ventas = vendedor.num_ventas + 1 ;

						vendedor.save(function(err, vendedor_s){

							socket.emit('mensaje_compra',{cod: 1, msg: 'Muchas Gracias por su compra'});

							dashboard_f.aumentar_vendidos(data.car,cliente._id,vendedor_s._id,io);

						});



					} else{
						socket.emit('mensaje_compra',{cod: 2, msg: 'No se encontro vendedor con esta cedula'});
					};

				});




				//socket.emit('mensaje_compra',{cod: 1, msg: 'Muchas Gracias por su compra'});
			});


		}else{
			//console.log("no se encontro usuario con esta cedula");

		}


	});
}


var eliminarPrimerVendedorCola = function (id_concecionario) {
	Concesionario.update(
		{ _id: id_concecionario },
		{ $pop: { cola_vendedores: -1 } },
		function (err) {
			if(err){
					console.log(err);
			}else{
					console.log("Successfully Eliminate the First");
			}
		})
}


var elmininarVendedorCola = function (id_concecionario, id_vendedor, socket) {

		Concesionario.update(
			{ _id: id_concecionario },
			{ $pull: { cola_vendedores: id_vendedor } },
			function(err){
					if(err){
									console.log(err);
					}else{
									console.log("Successfully Eliminate");

									if (socket) {
										var obj ={
											cod: 3,
											msg: 'se elimino correctamente'
										}
										socket.emit('notify_vendedores',obj);
									}
					}
			})

}



var cambiarEstadoAtendido = function(data){

	//console.log(data);

	Cliente.findOne({ _id: data.user_id },function (err, cliente) {
		if (err) return handleError(err);

		var obj = {};

		if (cliente) {
			cliente.estado = "atendido";

			cliente.save(function(err,cliente){
				if (err) console.log(err);

				//console.log(cliente);
				//socket.emit('mensaje_compra',{cod: 1, msg: 'Muchas Gracias por su compra'});

			});

		}


	});

	/*
	Vendedor.findOne({ _id: data.vendedor_id},function (err, vendedor){
		vendedor.atendidos.push({
				day: obtenerFechaString(),
				date : Date(),
				carro : data.car
			});
		vendedor.save(function(err,vendedor){
			if (err) console.log(err);
		})
	});
	
		data.vendedor_id

		vendedor.ventas.push({
				day: obtenerFechaString(),
				date : Date(),
				carro : data.car
			});
	*/


	// Concesionario.findOne({ _id: data.vendedor_id },function (err, model) {
	// 	if (err) return handleError(err);
	//
	// 	var obj = {};
	//
	// 	if (model) {
	// 		model.carros_atendiendo.push(data.car);
	//
	// 		model.save(function(err,model){
	// 			if (err) console.log(err);
	// 			console.log(model);
	// 			//socket.emit('mensaje_compra',{cod: 1, msg: 'Muchas Gracias por su compra'});
	// 		});
	//
	// 	}
	// });


	Vendedor.update({_id:data.vendedor_id}, { $set: { disponible: false}}, function(err,obj){
			elmininarVendedorCola(data.consecionario_id, data.vendedor_id);
	});


}

var guargarVendedores = function(data){

	console.log(data);

	// Cliente.findOne({ dni: data.dni },function (err, cliente) {
	// 	if (err) return handleError(err);

	// 	var obj = {};

	// 	if (cliente) {

	// 		cliente.comprado = data.car;
	// 		cliente.estado = "comprador";


	// 		cliente.save(function(err,cliente){
	// 			if (err) console.log(err);
	// 			console.log(cliente);
	// 			//socket.emit('mensaje_compra',{cod: 1, msg: 'Muchas Gracias por su compra'});
	// 		});

	// 	}


	// });
}


var buscarVendedor = function (data,socket) {
	Vendedor.findOne({ cedula: data.cedula },function (err, model) {
		if (err) return handleError(err);

		if (model) {
			console.log(model);
			socket.emit('vendedor_encontrado',{cod: 1, data: model});
		}else{
			socket.emit('vendedor_encontrado',{cod: 2, msg: 'No se encontro vendedor'});
			//res.render('vendedor', { title: 'No existe este concesionario' });
		}
	});
}



var agregarColaConcesionario = function (id_concecionario, id_vendedor) {

	//busca si ya esta la cedula
	Concesionario.aggregate(
		{ $match : { cola_vendedores : ''+id_vendedor } },
		function (err, res) {
			if (err) return handleError(err);

			if (res.length == 0) {

				//lo inserta
				Concesionario.update(
					{ _id: id_concecionario },
					{ $push: { cola_vendedores: id_vendedor } },
					function(err){
							if(err){
											console.log(err);
							}else{
											console.log("Successfully added");
							}
					})

			}
		}
	);

}


var vendedorUltimoCola = function(data){

	console.log(data);

	//agregarColaConcesionario(data.concesionario,data.id);

	 Concesionario.update(
		{ _id: data.concesionario },
		{ $push: { cola_vendedores: data.id } },
		function(err){
				if(err){
								console.log(err);
				}else{
								console.log("Successfully added");
				}
		})
}



var activarVendedor = function (data,socket) {
	Vendedor.findOne({ cedula: data.cedula },function (err, model) {
		if (err) return handleError(err);

		if (model) {


			if (data.consulta) {
				var obj = {
					cod: 1,
					vendedor:  model
				}

				socket.emit('notify_vendedores',obj);
			}else{
				if (!data.again) {
					model.fechasAsistio.push(Date());
				}

				model.asistio = true;
				model.disponible = true;

				model.save(function(err,model){
					if (model) {
						agregarColaConcesionario(model.concesionario,model._id);

						var obj = {
							cod: 1,
							vendedor:  model
						}

						socket.emit('notify_vendedores',obj);
						//console.log(model);
					};
				});
			}




		}
		else{
			socket.emit('notify_vendedores',{cod: 2, msg: 'No se encontro vendedor'});
		}
	});
}


var obtenerDisponibles = function(data,socket){

	Vendedor.find({ concesionario: data.concesionario},function(err,vendedores){
		if (err) return console.log(err);

		if (vendedores) {
			socket.emit('vendedores',{vendedores: vendedores})
		}
	});
}


var buscarConsecionario = function(data,socket){
	Concesionario.findOne({username: data.username},function(err,consecionario){
		if (err) return handleError(err);

		if (consecionario) {
			socket.emit('consecionario_encontrado',{cod: 1, user: consecionario,});
		}else{
			socket.emit('consecionario_encontrado',{cod: 2, msg: 'no se encontro usuario'});
		}
	});
}


var desocuparVendedor =  function(data){
	Concesionario.findOne({username: data.username},function(err,consecionario){
		if (err) return handleError(err);

		if (consecionario) {

			var index = consecionario.carros_atendiendo.indexOf(data.carro);

			if (index > -1) {
			    consecionario.carros_atendiendo.splice(index, 1);

			    consecionario.save(function(err,model){
			    	console.log(consecionario);
			    });
			}
		}
	});
}


/*Concesionario*/

var seleccionar_hora =  function (data,io) {
	Agenda.findOne({_id: data.id_agenda},function (err,agenda) {
		if (agenda) {
			if (agenda.concesionario == null) {
				agenda.concesionario = data.id_concecionario;


				agenda.save(function (err,agenda) {
					if (agenda) {
						Agenda.find({dia:data.fecha})
					        .populate('cliente')
					        .populate('concesionario')
					        .exec (function (err, model) {
					        	if (err) return handleError(err);

					        		if (model) {
					            		io.sockets.emit('notify_concesionario',model);
					            		//console.log(model);
					          		}else{
					            		//res.render('vendedor', { title: 'No existe este concesionario' });
					          		}
					  			});
								
					};
				})
				

			}else{

				Agenda.find({dia:data.fecha})
			        .populate('cliente')
			        .populate('concesionario')
			        .exec (function (err, model) {
			        	if (err) return handleError(err);

			        		if (model) {
			            		io.sockets.emit('notify_concesionario',model);
			            		//console.log(model);
			          		}else{
			            		//res.render('vendedor', { title: 'No existe este concesionario' });
			          		}
			  			});

			}
		};
	})
}


exports.siguienteTurno = siguienteTurno;
exports.siguienteTurnoParametrizado = siguienteTurnoParametrizado;
//exports.siguienteTurnoSinTv = siguienteTurnoSinTv;
//exports.cancelarTurno = cancelarTurno;
exports.cambiarEstadoCompra = cambiarEstadoCompra;
exports.cambiarEstadoCompraNew = cambiarEstadoCompraNew;
exports.cambiarEstadoAtendido = cambiarEstadoAtendido;
exports.guargarVendedores = guargarVendedores;
exports.buscarVendedor = buscarVendedor;
exports.activarVendedor = activarVendedor;
exports.obtenerDisponibles = obtenerDisponibles;
exports.buscarConsecionario = buscarConsecionario;
exports.desocuparVendedor = desocuparVendedor;
exports.elmininarVendedorCola = elmininarVendedorCola;
exports.vendedorUltimoCola = vendedorUltimoCola;
exports.seleccionar_hora = seleccionar_hora;


