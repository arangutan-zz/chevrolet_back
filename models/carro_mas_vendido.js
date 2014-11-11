var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CarroVendidoSchema   = new Schema({
	dia: String,
	carro: String,
	usuario: {type: mongoose.Schema.Types.ObjectId, ref: 'Cliente'},
	vendedor: {type: mongoose.Schema.Types.ObjectId, ref: 'Vendedor'}
});

module.exports = mongoose.model('Vendido', CarroVendidoSchema);
