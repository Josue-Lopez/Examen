var productos = require('./productos');
var express = require('express');
var app = express();

app.listen(3000, function (){
    console.log('Aplicacion escuchando en puerto 3000!');
});

app.use(function (req, res, next){
    console.log('Middleware de index.js');
    next();
});

app.use('/api', productos);

app.get('/', function(req, res){
    res.send('Examen I - Josue Samuel Lopez Soriano - 61421582');
});