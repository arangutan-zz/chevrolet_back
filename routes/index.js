var express = require('express');
var router = express.Router();

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


module.exports = router;
