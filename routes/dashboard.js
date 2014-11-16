var express = require('express');
var router = express.Router();
var dashboard_f = require('../bin/dashb_funciones.js');
var Dashboard = require('../models/dashboard');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('dashboard');
});


/* GET home page. */
router.get('/datos_now', function(req, res) {

  //dashboard_f.crear_dashboard();

  Dashboard.findOne({day : dashboard_f.obtenerFechaString()}, function(err, dashboard){
    if (err) {return console.log("error");};

    if (dashboard){

        res.json(dashboard);
        //no se pudo guardar

    }else{
      res.json(dashboard);
      //no se encontro para aumentar
    }

  });


});


module.exports = router;
