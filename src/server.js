const express = require('express')
const route = require('./route')
const path = require('path')

const server = express()

server.set('view engine', 'ejs')

server.use(express.static("public"))

server.set('views', path.join(__dirname, 'views'))

server.use(express.urlencoded({extended: true}))

server.use(route)

server.use(function(req, res, next) {
    res.status(404);
  
    // respond with html page
    if (req.accepts('html')) {
      res.render('notfound', { url: req.url });
      return;
    }
});

server.listen(3000, () => console.log("Running"))