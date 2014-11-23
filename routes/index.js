var express = require('express');
var router = express.Router();
var dashboard_f = require('../bin/dashb_funciones.js');

var funciones = require('../bin/funciones.js');
var io = require('../bin/www');

var LlamarVendedor = require('../models/init_llamarvendedor');

var request = require('request');
var crontab =  require('node-crontab');

var enter = 0;
var out = 0;

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Chevrolet' });
});


/* GET home page. */
router.get('/user/:name/:dni/:email/:cel', function(req, res) {
	//res.render('index', { title: 'Chevrolet' });

	//res.send(req.params.name+'-'+req.params.dni+'-'+req.params.email+'-'+req.params.cel);


});


router.get('/tombola', function(req, res) {
	res.render('tombola', { title: 'Chevrolet' });

	//res.send(req.params.name+'-'+req.params.dni+'-'+req.params.email+'-'+req.params.cel);


});


router.get('/descargar', function(req,res){
  res.render('descargar', {title: 'Descargar App'})
});



router.get('/init', function(req,res){
console.log("ABC");
  dashboard_f.crear_dashboard();
  res.json({mensaje:'se inicio correctamente'});

var jobId = crontab.scheduleJob("* * * * *", function(){ //This will call this function every 1 minute
    request('http://10.102.0.16/local/people-counter/.api?live-sum.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            enter = JSON.parse(body)["in"];
            console.log("Entrada cámara 1: "+JSON.parse(body)["in"]);
            out = JSON.parse(body)["out"];
            console.log("Salida cámara 1: "+JSON.parse(body)["out"]);
        }
    })

    request('http://10.102.0.17/local/people-counter/.api?live-sum.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            enter += JSON.parse(body)["in"];
            console.log("Entrada cámara 2: "+JSON.parse(body)["in"]);
            out += JSON.parse(body)["out"];
            console.log("Salida cámara 2: "+JSON.parse(body)["out"]);

        }
    })
	console.log('este es el dato de entrada para guardar : '+enter);
	console.log('este es el dato de salida para guardar : '+out);
    dashboard_f.guardar_in_out(enter, out)

});

  //res.render('descargar', {title: 'Descargar App'})
});

router.get('/estado_llamar_vendedor', function(req,res){

  // var obj = new LlamarVendedor({
  //   activo: true
  // }).save(function(err,model) {
  
  // });

  //res.json({activo:true});
  LlamarVendedor.find({},function (err,model) {

    if (model) {
      res.json(model[0]);
    }
  })

  //dashboard_f.crear_dashboard();

  //res.render('descargar', {title: 'Descargar App'})
});

router.get('/prueba_llamar_vendedor', function(req,res){


  for (var i = 0; i < 100; i++) {

    //funciones
    
  };

  // var obj = new LlamarVendedor({
  //   activo: true
  // }).save(function(err,model) {
  
  // });

  //res.json({activo:true});
  LlamarVendedor.find({},function (err,model) {

    if (model) {
      res.json(model[0]);
    }
  })

  //dashboard_f.crear_dashboard();

  //res.render('descargar', {title: 'Descargar App'})
});



module.exports = router;
