var express = require('express');
var mysql = require('mysql');
var connection = mysql.createConnection({
  user: 'cola9k',
  password: '',
  database: 'daily_db'
});
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var fs = require('fs');
var path = require('path');
var http = require('http');
var app = express();
console.log(process.env.PORT);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

// DATE WORK SELECT
app.post('/date_select', function(req, res) {
  connection.query('select * from datework', function(err, results) {
    if (err) {
      console.log('err:' + err.meesage);
    }
    else {
      console.log("select datework:");
      console.log(results);
      res.send(results);
    }
  });
});

// THINGS WORK SELECT
app.post('/things_select', function(req, res) {

  console.log("그래프확인");
  connection.query('select * from thingswork', function(err, results) {
    if (err) {
      console.log('err:' + err.meesage);
    }
    else {
      console.log("select thingswork:");
      console.log(results);
      res.send(results);
    }
  });
});

// DATE WORK 데이터 삽입
app.post('/date_insert', function(req, res) {
  var title = req.body.title;
  var place = req.body.place;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  // 데이터 값 객체 배열 mysql-ctl cli생성
  var data = [title, place, start_time, end_time];

  var query = connection.query('INSERT INTO datework (title,place,start_time,end_time) VALUES (?,?,?,?)', data,
    function(err, results) {
      if (err) {
        console.error(err);
        throw err;
      }
      res.end();
    });
});

// THINGS WORK 데이터 삽입
app.post('/things_insert', function(req, res) {
  var title = req.body.title;
  var time = req.body.time;
  var importance = req.body.importancee;
  // 데이터 값 객체 배열 mysql-ctl cli생성
  var data = [title, time, importance];

  var query = connection.query('INSERT INTO thingswork (title,time,importancee) VALUES (?,?,?)', data,
    function(err, results) {
      if (err) {
        console.error(err);
        throw err;
      }
      res.end();
    });
});
app.get('/graph',function(req,res){
   fs.readFile('mattchart.html', function(error, data)
 {
  res.writeHead(200, {'Conternt-type':'text/html'});
  res.end(data);
 });
});


app.listen(process.env.PORT, function() {
  console.log("connect!!");
});
