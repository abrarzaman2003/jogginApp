var express = require('express');
var cors = require('cors')
var ip = require('ip');
var app = express();

console.log(ip.address());

app.use(cors());
app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.get('/', function (req, res) {
   res.send('Hello World');
})
app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});
  

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log(host);
   console.log(port);
   
   console.log("Example app listening at http://%s:%s", host, port)
})