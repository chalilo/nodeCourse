const express = require('express')
const routerProductos = require('./productos.js')
const routerCarrito = require('./carrito.js')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api',routerProductos)
app.use('/api/carrito',routerCarrito)

app.all('*',(req,res) => {
    let ruta = JSON.stringify(req.params[0])
    ruta = ruta.slice(1,ruta.length - 1)
    let method = JSON.stringify(req.method)
    method = method.slice(1,method.length - 1)
    res.status(404).send({error:-2,descripcion:`Ruta '${ruta}' metodo '${method}' no implementada`})
})

app.listen(8080,() => {
    console.log("Started");
})