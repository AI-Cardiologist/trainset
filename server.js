const express = require('express');
const path = require('path');
const serveStatic = require('serve-static');
const history = require('connect-history-api-fallback');
const secure = require('ssl-express-www');
const bodyParser = require('body-parser');


let app = express();
/*
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
*/
app.use(bodyParser.json({
  limit: '50mb'
}));

app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true 
}));

app.use(secure);
app.use(history());
app.use(serveStatic(__dirname + "/dist"));

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Listening on port ' + port)
});

app.post('/post', (req, res) => {
  const fs = require('fs');
  const {Parser} = require("json2csv");
  const fields = ["filename","timestamp","value","label"];
  const opts = {fields};
  const parser = new Parser(opts);
  const csvStr = parser.parse(req.body["data"]);
  const filepath = __dirname +"/dist" +req.body["filename"];
  fs.writeFileSync(filepath, csvStr , "utf-8", (err) => {
  if(err) {
    console.log(err);
  }});

  res.send("saved: "+filepath);
});

app.on('SIGINT', () => process.exit(1));


