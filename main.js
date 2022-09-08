const express = require('express');
const productosRouter = require('./productos.js')

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api', productosRouter)

app.use('/public', express.static(__dirname + '/public'))

const server = app.listen(8080, () => console.log(`Server started on port: ${server.address().port}`))
    .on('error', (e) => {
        console.log("[ERROR]: ", e);
    })