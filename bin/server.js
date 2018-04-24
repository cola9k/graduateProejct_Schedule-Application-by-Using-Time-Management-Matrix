var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended:false
}));;

app.get('/endpoint', function(req, res){
	var obj = {};
	obj.title = 'title';
	obj.data = 'data';

	console.log('params: ' + JSON.stringify(req.params));
	console.log('body: ' + JSON.stringify(req.body));
	console.log('query: ' + JSON.stringify(req.query));

	res.header('Content-type','application/json');
	res.header('Charset','utf8');
	res.send(req.query.callback + '('+ JSON.stringify(obj) + ');');
});

app.post('/endpoint', function(req, res){
	var obj = {};
	console.log('body: ' + JSON.stringify(req.body));
	res.send(req.body);
});


app.listen(process.env.PORT,function(){
	console.log("port"+process.env.PORT);
});
