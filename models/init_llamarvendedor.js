var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var InitLlamarSchema   = new Schema({
	activo: Boolean
});


module.exports = mongoose.model('LlamarVendedor', InitLlamarSchema);
