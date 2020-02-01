Port = 3000

const express = require("express");
const app = express();
const mysql = require("mysql");
const myConnection = require("express-myconnection");
const bodyParser = require("body-parser");

const config = require("./db");
const dbOptions = {
    host: config.database.host,
    user: config.database.user,
    password: config.database.password,
    port: config.database.port,
    database: config.database.db
};

const routes = require("./routes/index");
const publicDir = (__dirname +"/public/") ; // set static dir for images

app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Headers','Content-Type','Authorization');
    next();
});

app.use(express.static(publicDir))
app.use(myConnection(mysql,dbOptions,"pool"))
app.use(bodyParser.urlencoded({extended : true}))
app.use(bodyParser.json())

app.use(function (err,res,res,next) {
    if (err.name === 'UnauthorizedError')
        res.status(401).send(JSON.stringify({success:false,message:"Invalid Json Web Token"}));
    else
        next(err);
})

app.use("/",routes)
app.listen(Port,()=>{
    console.log(" BackEnd running on port :"+Port)
})