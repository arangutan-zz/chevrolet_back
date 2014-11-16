var express = require('express');
var router = express.Router();

var Vendedor = require('../models/vendedor');
var Concesionario = require('../models/concesionario');
var Agenda = require('../models/agenda');
var Agenda = require('../models/agenda');
var DatosAgenda = require('../models/datos_agenda');

var io = require('../bin/www');

/* GET home page. */
router.get('/', function(req, res) {

	/*Create Concesionarios*/

	// var concesionario = new Concesionario({
	// 	name: 'Autoniza',
	// 	username: 'Autoniza',
	// 	turno : 1,
	// 	atendiendo : true
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });

	// var concesionario = new Concesionario({
	// 	name: 'Autonal',
	// 	username: 'autonal',
	// 	turno : 2
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });


	// var vendedor = new Vendedor({
	// 	name: 'santiago',
	// 	id_client: 'cualquier cosa',
	// 	celphone: '3008911930',
	// 	estado : 'libre',
	// 	posicion: 1
	// });

	// vendedor.save(function (err, obj) {
	//   if (err) return console.error(err);
	//   console.log(obj);
	// });


	/*Mostrar la lista de vendedores*/
	// Vendedor.find(function (err, vendedores) {
	//   if (err) return console.error(err);
	//   console.log(vendedores);

	//   for (var i = vendedores.length - 1; i >= 0; i--) {
	//   	console.log(vendedores[i].aux());
	//   };
	// });


	// var vendedor = new Vendedor({
	// 	name: 'James Rodriguez',
	// 	cedula: '111111',
	// 	celular: '123123123',
	// 	concesionario: '542c8076aa653d0000759661',
	// 	concesionario_name: 'Autoniza',
	// 	asistio: false,
	// 	disponible: false
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });
	//
	// var vendedor = new Vendedor({
	// 	name: 'Juan Guillermo Cuadrado',
	// 	cedula: '222222',
	// 	celular: '123123123',
	// 	concesionario: '542c8076aa653d0000759661',
	// 	concesionario_name: 'Autoniza',
	// 	asistio: false,
	// 	disponible: false
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });
	//
	// var vendedor = new Vendedor({
	// 	name: 'Radamel Falcao',
	// 	cedula: '333333',
	// 	celular: '123123123',
	// 	concesionario: '542c8076aa653d0000759661',
	// 	concesionario_name: 'Autoniza',
	// 	asistio: false,
	// 	disponible: false
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });
	//
	//
	//
	// /*OTRO*/
	//
	// var vendedor = new Vendedor({
	// 	name: 'Angel Di Maria',
	// 	cedula: '444444',
	// 	celular: '123123123',
	// 	concesionario: '542c8076aa653d0000759662',
	// 	concesionario_name: 'Autonal',
	// 	asistio: false,
	// 	disponible: false
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });
	//
	// var vendedor = new Vendedor({
	// 	name: 'Lionel Messi',
	// 	cedula: '555555',
	// 	celular: '123123123',
	// 	concesionario: '542c8076aa653d0000759662',
	// 	concesionario_name: 'Autonal',
	// 	asistio: false,
	// 	disponible: false
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });
	//
	// var vendedor = new Vendedor({
	// 	name: 'Ezequiel Lavezzi',
	// 	cedula: '666666',
	// 	celular: '123123123',
	// 	concesionario: '542c8076aa653d0000759662',
	// 	concesionario_name: 'Autonal',
	// 	asistio: false,
	// 	disponible: false
	// }).save(function(err,obj){
	// 	if (err) return console.error(err);
	// });



	// Vendedor.find({ concesionario: '542c8076aa653d0000759661' },function(err,vendedores){
	// 	if (err) return handleError(err);

	// 	if (vendedores) {
	// 		console.log(vendedores);
	// 	}
	// });


	// Vendedor.findOne({ cedula: '212121' },function (err, model) {

	// 	Vendedor.populate(model,{path:'concesionario'},function (err,model){
	// 		if (err) return handleError(err);

	// 			if (model) {
	// 				console.log(model);
	// 			}else{
	// 				//res.render('vendedor', { title: 'No existe este concesionario' });
	// 			}
	// 	})

	// });




	// Concesionario.findOne({ username: 'autoniza' })
	// 			 .populate('vendedors', 'nombre')
	// 			 .exec (function (err, model) {
	// 	if (err) return handleError(err);

	// 	if (model) {
	// 		console.log(model);
	// 	}else{
	// 		//res.render('vendedor', { title: 'No existe este concesionario' });
	// 	}
	// });



	//console.log(vendedor_model);


    /*------crear datos agenda--------*/
    // var agenda = new DatosAgenda({
    //   dia: '11-12-2014',
    //   delta: '15',
    //   hora_ini: '5',
    //   min_ini: '00',
    //   hora_fin: '6',
    //   min_fin: '00',
    //   cupos: 5
    // }).save(function(err,obj){
    //   if (err) return res.json(err);
    //
    // });


  	res.render('vendedor');
});


router.get('/:concesionario', function(req, res) {

	Concesionario.findOne({ username: req.params.concesionario },function (err, model) {
		if (err) return handleError(err);

		if (model) {
			console.log("lo encontro");
			//console.log(model);
			res.render('vendedor', { title: 'Concesionario ' + model.name , username: model.username, id: model._id });
			//console.log(vend);
		}else{
			res.render('vendedor', { title: 'No existe este concesionario' });
		}
	});

	// Vendedor.findOne({ username: req.params.concesionario },function (err, model) {
	// 	if (err) return handleError(err);

	// 	if (model) {
	// 		console.log("lo encontro");
	// 		//console.log(model);

	// 		res.render('vendedor', { title: 'Concesionario ' + model.name });
	// 		//console.log(vend);
	// 	}else{
	// 		res.render('vendedor', { title: 'No existe este concesionario' });
	// 	}
	// });

});

router.get('/:concesionario/vendedores', function(req, res) {

	Vendedor.find({ concesionario: req.params.concesionario },function(err,vendedores){
		if (err) return handleError(err);

		if (vendedores) {
			res.json(vendedores);
			//console.log(vendedores);
		}
	});

});


router.get('/:concesionario/activos', function(req, res) {

	Vendedor.find({ concesionario: req.params.concesionario , asistio : true },function(err,vendedores){
		if (err) return handleError(err);

		if (vendedores) {

			Concesionario.findOne({ _id: req.params.concesionario },function (err, model) {
				if (err) return handleError(err);

				if (model) {
					res.json({num_activos: vendedores.length, carros_atendiendo: model.carros_atendiendo });
				}
			});

			//console.log(vendedores);

		}
	});

});

router.get('/:vendedor/cambiar_estado', function(req, res) {

	Vendedor.findOne({ _id: req.params.vendedor },function(err,vendedor){
		if (err) return handleError(err);

		if (vendedor) {

			if (vendedor.asistio) {
				vendedor.asistio = false;
			}else{
				vendedor.asistio = true;
				vendedor.fechasAsistio.push(Date());
			}

			vendedor.save(function(req,obj){

				Vendedor.find({ concesionario: obj.concesionario },function (err,vendedores){
					if (err) return handleError(err);

					if (vendedores) {
						res.json(vendedores);
						//console.log(vendedores);
					}
				});

			});

		}
	});

});


router.get('/:concesionario/desocupar/:carro', function(req, res) {

	console.log(req.params.concesionario);

	Concesionario.findOne({_id: req.params.concesionario},function(err,consecionario){
		if (err) return handleError(err);

		if (consecionario) {
			console.log(consecionario);
			var index = consecionario.carros_atendiendo.indexOf(req.params.carro);

			if (index > -1) {
			    consecionario.carros_atendiendo.splice(index, 1);

			    consecionario.save(function(err,model){
			    	//console.log(consecionario);
			    	res.json(consecionario);
			    });
			}
		}
	});
});

/*Agregar carro*/
router.get('/agendar/:dia/:hora/:id_cliente/:carro', function(req, res){
  console.log(req.params.dia);
  console.log(req.params.hora);
  console.log(req.params.id_cliente);

  var agenda = new Agenda({
  	dia: req.params.dia,
  	hora: req.params.hora,
  	cliente : req.params.id_cliente,
    carro : req.params.carro
  }).save(function(err,obj){
  	if (err) return res.json(err);

    res.json({message:'se guardo correctamente'});

  });

});

router.get('/agenda_concesionario/:dia',function (req,res) {




  Agenda.find({dia:''+req.params.dia})
         .populate('cliente')
         .populate('concesionario')
         .exec (function (err, model) {
          if (err) return handleError(err);

          if (model) {
            res.json({agenda: model});
            //console.log(model);
          }else{
            //res.render('vendedor', { title: 'No existe este concesionario' });
          }
  });
});


router.get('/ver_agenda/:dia', function(req, res){
  console.log(req.params.dia);
  //console.log(io.io);

  //io.io.sockets.emit('notify_concesionario',obj);

  Agenda.aggregate(
    {$match : {dia: ''+req.params.dia}},
    { $group:
      { _id: '$hora', ocupadas: { $sum: 1 } }
    },
    function (err, model) {
      if (err) return res.json(err);

      DatosAgenda.findOne({dia:req.params.dia},function (err,datos) {
        if (datos) {
          res.json({datos_agenda:datos, ocupadas: model});
        }else {
          res.json({datos_agenda:[], ocupadas: model});
        }
      })

    }
  );


  //Agenda.update({_id:'5464bf6b786965c3c16bde79'}, { $set: { concesionario: '5464224c644e3d877f41cb7c'}}, function(err,obj){

  //});




});


module.exports = router;
