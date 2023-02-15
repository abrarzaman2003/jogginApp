var express = require('express');
var cors = require('cors')
var ip = require('ip');
var bodyParser = require('body-parser');
const {fireStoreAddRoute, fireStoreGetAllRouteHeaders, fireStoreGetRoute} = require('./firebase.js');

var app = express();

console.log("server ip address: " , ip.address());

app.use(cors());
app.use(bodyParser.json());

app.get('/', function (req, res) {
   console.log(req.params.id);
})

app.post("/api/addRoute", (req, res) => {
    console.log("inside the get", (req.body));
    if (fireStoreAddRoute(req.body)){
        res.status(200).send("successfull added route");
    }else{
        res.status(400).send("an error occurred")
    }
});

// called during the initialization of the history page
app.get("/api/getAllRoutes", (req,res)=>{
    console.log("getting all routes... ");
    fireStoreGetAllRouteHeaders().then((result)=>{
        res.status(200).send(result);
        console.log(result);
    }).catch((error)=>console.error(error));
    
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Joggin App Server listening at http://%s:%s", host, port)
})
