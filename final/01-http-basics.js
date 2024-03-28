const http = require('http')
/*
or..
const app = require('express')();
*/


//! Important methhods()
//app.get
//app.post
//app.put
//app.delete
//app.all
//app.use
//app.listen

const server = http.createServer((req, res) => {
  // console.log(req)
  // console.log(req.method)
  const url = req.url
  // home page
  if (url === '/') {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.write('<h1>home page</h1>')
    res.end()
  }
  // about page
  else if (url === '/about') {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.write('<h1>about page</h1>')
    res.end()
  } 
  // contact page
  else if (url === '/contact') {
    res.writeHead(200, { 'content-type': 'text/html' })
    res.write('<h1>Contact Info Page</h1>')
    res.end()
  }
  // 404
  else {
    res.writeHead(404, { 'content-type': 'text/html' })
    res.write('<h1>page not found</h1>')
    res.end()
  }
})

server.listen(5000)
