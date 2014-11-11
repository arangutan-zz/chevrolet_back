var Cliente = require('../models/cliente');
var Vendedor = require('../models/vendedor');
var Concesionario = require('../models/concesionario');
var Dashboard = require('../models/dashboard');
var Vendido = require('../models/carro_mas_vendido');
var Consultado = require('../models/carro_mas_consultado');
var Agenda = require('../models/agenda');


var obtenerFechaString = function(){
  var d = new Date();
  return d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()
}


var crear_dashboard =  function(){
  var dashboard = new Dashboard({
    day: obtenerFechaString(),
    fecha:  Date()
  }).save(function (err, obj) {
    if (err) return console.error(err);
      console.log(obj);
  });
}

var calcular_vendedor_mas_ventas = function(fecha){

  Vendedor.find({ 'ventas.day': fecha })
      .select('name num_ventas')
      .sort({'num_ventas': 'desc'})
      .exec(function(err,vendedores){
    if (err) {return console.log("error");};

    if (vendedores) {
      console.log(vendedores);

    } else{

    };
  });
}

var calcular_consecionario_mas_ventas = function(fecha){
  Vendedor.aggregate(
    { $group:
      { _id: '$concesionario', total_sells: { $sum: "$num_ventas" } }
    },
    function (err, res) {
      if (err) return handleError(err);
      console.log(res);
    }
  );
}



var aumentar_vendidos = function(carro,id_user,id_vendidos){

  var fecha = obtenerFechaString();

  Dashboard.findOne({day : fecha}, function(err, dashboard){
    if (err) {return console.log("error");};

    if (dashboard){
      dashboard.total_sells = dashboard.total_sells + 1;

      dashboard.save(function(err,dashb){
        //no se pudo guardar
      });

    }else{
      //no se encontro para aumentar
    }

  });



  var consultado = new Vendido({
    dia: fecha,
    carro:  carro,
    usuario: id_user,
    vendedor: id_vendidos
  }).save(function (err, obj) {
    if (err) return console.error(err);
      console.log(obj);
  });

}


var obtener_carro_mas_vendido_especifico = function(fecha){
  Vendido.aggregate(
    {
      $match: {dia: ''+fecha}
    },
    { $group:
      { _id: '$carro', total_sells: { $sum: 1 } }
    },
    {
      $sort: {total_sells: -1}
    },
    function(err,res){
      console.log(res);
  })
}

var obtener_carro_mas_consultado_especifico = function(fecha){
  Consultado.aggregate(
    {
      $match: {dia: ''+fecha}
    },
    { $group:
      { _id: '$carro', total_sells: { $sum: 1 } }
    },
    {
      $sort: {total_sells: -1}
    },
    {
      $limit : 1
    },
    function(err,res){
      console.log(res);
  })
}


var obtener_carro_mas_vendido = function(){
  Vendido.aggregate(
    { $group:
      { _id: '$carro', total_sells: { $sum: 1 } }
    },
    {
      $sort: {total_sells: -1}
    },
    function(err,res){
      console.log(res);
  })
}



var aumentar_llamadas = function(carro,id_user){

  console.log('el carro consultado es '+carro);

  var fecha = obtenerFechaString();
  console.log('la fecha es '+fecha );

  Dashboard.findOne({day : fecha}, function(err, dashboard){
    if (err) {return console.log("error");};

    if (dashboard){
      dashboard.calls = dashboard.calls + 1;

      dashboard.save(function(err,dashb){
        //no se pudo guardar
      });

    }else{
      //no se encontro para aumentar
    }

  });

  var consultado = new Consultado({
    dia: fecha,
    carro:  carro,
    id_user: id_user
  }).save(function (err, obj) {
    if (err) return console.error(err);
      console.log(obj);
  });

}


exports.crear_dashboard = crear_dashboard;
exports.aumentar_llamadas = aumentar_llamadas;
exports.aumentar_vendidos = aumentar_vendidos;
exports.calcular_consecionario_mas_ventas = calcular_consecionario_mas_ventas;
exports.calcular_vendedor_mas_ventas = calcular_vendedor_mas_ventas;
exports.obtener_carro_mas_vendido_especifico = obtener_carro_mas_vendido_especifico;
exports.obtener_carro_mas_vendido = obtener_carro_mas_vendido;
exports.obtener_carro_mas_consultado_especifico = obtener_carro_mas_consultado_especifico;
