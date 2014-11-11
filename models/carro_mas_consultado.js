var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CarroConsultadoSchema = new Schema({
	dia: String,
	carro: String,
	id_user: {type: mongoose.Schema.Types.ObjectId, ref: 'Cliente'}
});


module.exports = mongoose.model('Consultado', CarroConsultadoSchema);
