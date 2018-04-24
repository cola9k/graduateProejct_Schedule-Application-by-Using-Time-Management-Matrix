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

// webview
app.get('/graph', function(req, res) {
  fs.readFile('mattchart.html', function(error, data) {
    res.writeHead(200, {
      'Conternt-type': 'text/html'
    });
    res.end(data);
  });
});

app.get('/test',function(req,res){
    var data = {
        "Data":""
    };
    
    connection.query("SELECT * from thingswork",function(err, rows, fields){
      console.log("rr:"+rows);
        if(rows.length != 0){
            data["Data"] = rows;
            res.json(data);
        }else{
            data["Data"] = 'No data Found..';
            res.json(data);
        }
    });
});

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
  var content = req.body.content;
  var importance = req.body.importance;
  var time = req.body.time;
  // 데이터 값 객체 배열 mysql-ctl cli생성
  var data = [content,importance,time];

  var query = connection.query('INSERT INTO thingswork (content,importance,time) VALUES (?,?,?)', data,
    function(err, results) {
      if (err) {
        console.error(err);
        throw err;
      }
      res.end();
    });
});

// DATE WORK 수정
app.post('/date_update', function(req, res) {
  var title = req.body.title;
  var place = req.body.place;
  var start_time = req.body.start_time;
  var end_time = req.body.end_time;
  // 데이터 값 객체 배열 mysql-ctl cli생성
  var data = [title, place, start_time, end_time];
  var req_id = req.body.id; // 요청된 id값 받아옴
  console.log("date 수정:");
  console.log(req_id + "," + title + "," + place + "," + start_time + "," + end_time);
  var query = connection.query('UPDATE datework SET title=' + "'" + title + "'" + ', place=' + "'" + place + "'" + ', start_time=' + "'" + start_time + "'" + ', end_time=' + "'" + end_time + "'" + ' WHERE id=' + req_id, data,
    function(err, results) {
      if (err) {
        console.log("Datework update err:" + err);
        throw err;
      }
      console.log("성공");
      res.end();
    });
});

// THINGS WORK 데이터 수정
app.post('/things_update', function(req, res) {
  var content = req.body.content;
  var importance = req.body.importance;
  var time = req.body.time;

  // 데이터 값 객체 배열 mysql-ctl cli생성
  var data = [content, importance, time];
  var req_id = req.body.id; // 요청된 id값 받아옴
  console.log("thingswork 수정:");
  console.log(req_id + "," + content + "," + importance + "," + time);
  console.log('UPDATE thingswork SET content=' + "'"+content + "'" + ', importance=' + "'" + importance + "'" + ', time=' + "'" + time + "'" + ' WHERE id=' + req_id);
  var query = connection.query('UPDATE thingswork SET content=' + "'" + content + "'" + ', importance=' + importance + ', time=' + "'" + time + "'" + ' WHERE id=' + req_id, data,
    function(err, results) {
      if (err) {
        console.log("Thingswork update err:" + err);
        throw err;
      }
      console.log("성공");
      res.end();
    });
});

// DATE WORK 삭제
app.post('/date_delete', function(req, res) {
  var d_id = req.body.id;
  console.log("date 삭제:");
  console.log(d_id);
  connection.query('DELETE FROM datework WHERE id=' + d_id, d_id,
    function(err, results) {
      if (err) {
        console.log("Datework update err:" + err);
        throw err;
      }
      console.log("성공");
      res.end();
    });
});

// THINGS WORK 삭제
app.post('/things_delete', function(req, res) {
  var d_id = req.body.id;
  console.log("things 삭제:");
  console.log(d_id);
  connection.query('DELETE FROM thingswork WHERE id=' + d_id, d_id,
    function(err, results) {
      if (err) {
        console.log("thingswork update err:" + err);
        throw err;
      }
      console.log("성공");
      res.end();
    });
});

app.listen(process.env.PORT, function() {
  console.log("connect!!");
});
