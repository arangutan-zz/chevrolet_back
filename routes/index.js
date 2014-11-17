var express = require('express');
var router = express.Router();
var dashboard_f = require('../bin/dashb_funciones.js');
var LlamarVendedor = require('../models/init_llamarvendedor');

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

  dashboard_f.crear_dashboard();
  res.json({mensaje:'se inicio correctamente'});
  //res.render('descargar', {title: 'Descargar App'})
});

router.get('/estado_llamar_vendedor', function(req,res){

  var obj = new LlamarVendedor({
    activo: true
  }).save(function(err,model) {
  
  });

  //res.json({activo:true});
 // LlamarVendedor.find({},function (err,model) {

 //   if (model) {
 //     res.json(model[0]);
 //   }
 // })

  //dashboard_f.crear_dashboard();

  //res.render('descargar', {title: 'Descargar App'})
});


module.exports = router;
