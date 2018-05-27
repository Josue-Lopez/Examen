var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var router = express.Router();
router.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://jlopez:unitecedu@ds058579.mlab.com:58579/inventario', function (error){
    if (error)
        console.error(error);
    else
        console.log('Conectado a MongoDB');
});

var productoEsquema = mongoose.Schema({
    _id: Number,
    descripcion: String,
    marca: String,
    no_estante: Number,
    fecha_ingreso: {type: Date, default: Date.now}
});

productoEsquema.methods.info = function () {
    var msj = "ID: " + this.id;
    console.log(msj);
};

var Producto = mongoose.model('producto', productoEsquema);

//AGREGAR PRODUCTO
router.post('/AddProducto', function(req, res){
    var producto1 = new Producto ({
        _id: req.body.id,
        descripcion: req.body.descripcion,
        marca: req.body.marca,
        no_estante: req.body.no_estante,
        fecha_ingreso: new Date()
    });

    Producto.findById(req.body.id, function (err, producto){
        if (err)
            res.status(500).send('Error en la base de datos1');
        else{
            if (producto != null){
                res.send('El ID ya esiste en la base de datos');
            }
            else{
                producto1.save(function (error, producto1){
                    if (error){
                        res.status(500).send('Error en la base de datos2');
                    }
                    else{
                        res.status(200).json('Agregado exitosamente');
                    }
                });
            }
        }

    });
});

//OBTENER PRODUCTOS
router.get('/GetProductos', function(req, res){
    Producto.find(function (err, producto){
        if (err)
        res.status(500).send('Error en la base de datos');
        else
        res.status(200).json(producto);
    });
});

//OBTENER PRODUCTO POR ID
router.get('/GetProductoID/:id', function(req, res){
    Producto.findById(req.params.id,function (err, producto){
        if (err)
        res.status(500).send('Error en la base de datos');
        else
        res.status(200).json(producto);
    });
});

//OBTENER PRODUCTO POR MARCA
router.get('/GetProductoMarca', function(req, res){
    Producto.find({marca: req.query.marca},function (err, producto){
        if (err)
        res.status(500).send('Error en la base de datos');
        else
        res.status(200).json(producto);
    });
});

//OBTENER PRODUCTO ENTRE FECHAS
router.get('/GetProductoFechas', function(req, res){
    Producto.find({$and : [{fecha_ingreso: {$gte: req.query.desde}}, {fecha_ingreso: {$lte: req.query.hasta}}]},function (err, producto){
        if (err)
        res.status(500).send('Error en la base de datos');
        else
        res.status(200).json(producto);
    });
});

//ELIMINAR PRODUCTO POR ID
router.delete('/DeleteProducto/:id',function(req,res){
    Producto.findById(req.params.id,function(err, producto) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else{
            if (producto != null) {
                producto.remove(function (error, result) {
                    if (error)
                        res.status(500).send('Error en la base de datos');
                    else {
                        res.status(200).send('Eliminado exitosamente');
                    }
                });
            }
            else
                res.status(404).send('No se encontro esa persona');
        }
    });
});

module.exports = router;    