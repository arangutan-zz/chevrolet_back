var express = require('express');
var router = express.Router();
var dashboard_f = require('../bin/dashb_funciones.js');
var Dashboard = require('../models/dashboard');
var Concesionario = require('../models/concesionario');

/* GET home page. */
router.get('/:concesionario_name', function(req, res) {
  Concesionario.findOne({username: req.params.concesionario_name},function(err,consecionario){
    if (err) return handleError(err);

    if (consecionario) {
      res.render('concesionario',{id_consecionario:consecionario._id});
    }else {
      res.json({mensaje:'no existe este concesionario'});
    }
  });

});


router.get('/llenar', function(req, res) {

	Concesionario.update({username:'aca va el username'}, { $set: { cupos: 6,cupos_usados: 0}}, function(err,obj){
			//elmininarVendedorCola(data.consecionario_id, data.vendedor_id);
		if (err) {
			console.log('error');
		};
		if (obj) {
			console.log('se actualizo perfectamente'):
		};
	});

});

module.exports = router;
