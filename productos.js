const express = require('express')

const router = express.Router()

let productos = [{ id: 1, title: "Fender Telecaster Player Plus", price: 1299990, thumbnail: "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge599_0147333336v1.jpg" }, { id: 2, title: "Fender Stratocaster American Proffesional II", price: 1899990, thumbnail: "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge562-1_0113902761v1.jpg" }, { id: 3, title: "Fender Jazzmaster 60s Vintera", price: 1399990, thumbnail: "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge502_0149753383v1.jpg" }]

router.get('/productos', (req, res) => {
    res.send(productos)
})

router.get('/productos/:id', (req, res) => {
    const { id } = req.params
    let search = productos.find(prod => prod.id == id)
    if (search) {
        res.send(search)
    } else {
        res.send({ error: "Producto no encontrado" })
    }
})

router.post('/productos', (req, res) => {
    const { title, price, thumbnail } = req.body
    const lastId = productos.length >= 1 ? productos[productos.length - 1].id : 0
    const prod = { id: lastId + 1, title, price: parseInt(price), thumbnail }
    productos.push(prod)
    res.send(productos[lastId])
})

router.put('/productos/:id', (req, res) => {
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

router.delete('/productos/:id', (req, res) => {
    const { id } = req.params
    const search = productos.find(prod => prod.id == id)
    if (search) {
        productos = productos.filter(prod => prod.id != id)
        res.send({eliminado: search,productos})
    } else{
        res.send({error: "Producto no encontrado"})
    }
})

module.exports = router