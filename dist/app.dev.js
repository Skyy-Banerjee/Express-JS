"use strict";

var express = require('express');

var app = express();
var port = 5000;

var _require = require('./data'),
    products = _require.products; // app.get('/', (req, res) => {
//     res.json([{name: 'Skyy'}, {name: 'Soumadip'}])
// });
// app.get('/', (req, res) => {
//    res.json(products)
// });


app.get('/', function (req, res) {
  res.send('<h1>Home Page</h1> <a href="/api/products">Products</a>');
}); //All prodcts without desc

app.get('/api/products', function (req, res) {
  var newProducts = products.map(function (product) {
    var id = product.id,
        name = product.name,
        image = product.image;
    return {
      id: id,
      name: name,
      image: image
    };
  });
  res.json(newProducts);
}); //Single product

app.get('/api/products/:productID', function (req, res) {
  // console.log(req);
  // console.log(req.params);
  var productID = req.params.productID;
  var singleProduct = products.find(function (product) {
    return product.id === 1;
  });
  res.json(singleProduct);
});
app.listen(port, function () {
  console.log("App listening on port: ".concat(port, "..."));
});