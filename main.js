const { json } = require('express')
const express = require('express')
const handlebars = require('express-handlebars')
const fs = require('fs')
const DB = require('./database.js')
const {Server: HTTPServer } = require('http')
const {Server: SocketServer} = require('socket.io')

let productos = [{ id: 1, title: "Fender Telecaster Player Plus", price: 1299990, thumbnail: "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge599_0147333336v1.jpg" }, { id: 2, title: "Fender Stratocaster American Proffesional II", price: 1899990, thumbnail: "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge562-1_0113902761v1.jpg" }, { id: 3, title: "Fender Jazzmaster 60s Vintera", price: 1399990, thumbnail: "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge502_0149753383v1.jpg" }]

const app = express()

const database = new DB(__dirname + "/data/mensajes.json")

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const httpServer = new HTTPServer(app)
const io = new SocketServer(httpServer)

io.on('connection', async(socket) => {
    const mensajes = await database.leerArchivo()
    socket.emit('productosGet',productos)
    socket.on('productoNuevo', (data) => {
        const lastId = productos.length >= 1 ? productos[productos.length - 1].id : 0
        const prod = { id: lastId + 1, title: data.title, price: parseInt(data.price), thumbnail: data.thumbnail }
        productos.push(prod)
        io.sockets.emit('productosGet',productos)
    })
    socket.emit('mensajesGet', mensajes)
    socket.on('msjNuevo', async(data) => {
        await database.anadirMsj(data)
        const mensajes = await database.leerArchivo()
        io.sockets.emit('mensajesGet',mensajes)
        
    })
})

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.engine('hbs',handlebars.engine({
    extname: 'hbs',
    layoutsDir: __dirname + '/views',
    partialsDir: __dirname + '/views/partials',
    defaultLayout: false
}))

app.set('views', __dirname +'/views')
app.set('view engine', "hbs")

app.get('/', (req,res) => {
    res.render('index',{productos})
})

app.use("/public",express.static(__dirname +"/public"))

//Utilidades extra

app.get('/productos/:id', (req, res) => {
    const { id } = req.params
    let search = productos.find(prod => prod.id == id)
    if (search) {
        res.send(search)
    } else {
        res.send({ error: "Producto no encontrado" })
    }
})

app.post('/productos', (req, res) => {
    const { title, price, thumbnail } = req.body
    const lastId = productos.length >= 1 ? productos[productos.length - 1].id : 0
    const prod = { id: lastId + 1, title, price: parseInt(price), thumbnail }
    productos.push(prod)
    return res.redirect('/')
})

app.put('/productos/:id', (req, res) => {
    const { id } = req.params
    const { title, price, thumbnail } = req.body
    let search = productos.find(prod => prod.id == id)
    if (search) {
        search.title = title ? title : search.title
        search.price = price ? price : search.price
        search.thumbnail = thumbnail ? thumbnail : search.thumbnail
        productos = productos.map(obj => {
            if (obj.id == id) {
                return search
            } else {
                return obj
            }
        })
        res.send(search)
    } else {
        res.send({ error: "Producto no encontrado" })
    }
})

app.delete('/productos/:id', (req, res) => {
    const { id } = req.params
    const search = productos.find(prod => prod.id == id)
    if (search) {
        productos = productos.filter(prod => prod.id != id)
        res.send({eliminado: search,productos})
    } else{
        res.send({error: "Producto no encontrado"})
    }
})

httpServer.listen(8080,()=>{console.log("Server iniciado")})