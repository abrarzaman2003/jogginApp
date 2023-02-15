var express = require('express');
var cors = require('cors')
var ip = require('ip');
var bodyParser = require('body-parser');
const testFirebase = require('./firebase.js');
const {fireStoreAddRoute, fireStoreGetAllRouteHeaders, fireStoreGetRoute} = require('./firebase.js');

var app = express();

console.log(ip.address());

app.use(cors());
app.use(bodyParser.json());
// app.use((_, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     next();
// });


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

app.get("/api/getAllRoutes", (req,res)=>{
    console.log("getting all routes... ");
    fireStoreGetAllRouteHeaders().then((result)=>{
        res.status(200).send(result);
        console.log(result);
    }).catch((error)=>console.error(error));
    
})

app.get("/api/getRoute", (req,res)=>{
    console.log("getting route...", req.query.Id);
    fireStoreGetRoute(req.query.Id).then((result)=>{
        console.log("result: ", result);
        res.status(200).send(result);
        
    }).catch((error)=> console.error(error));
    // res.status(200).send("test");
})

// called during the initialization of the history page
  

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log(host);
   console.log(port);
   
   console.log("Example app listening at http://%s:%s", host, port)
})


//