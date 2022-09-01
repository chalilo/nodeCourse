const express = require('express')
const fs = require('fs')
const dbClase = require('./main.js')

const app = express()

class Base {
    constructor(archivo) {
        this.archivo = `./data/${archivo}`
    }
    async getAll() {
        try{
            const data = await fs.promises.readFile(`${this.archivo}`,'utf-8')
            return JSON.parse(data)
        } catch(e){
            console.log("[ERROR]: ", e);
            return []
        }
    }
    async getRandom() {
        try{
            const data = await fs.promises.readFile(`${this.archivo}`,'utf-8')
            const parsed = JSON.parse(data)
            const randomIndex = Math.round(Math.random() * (parsed.length - 1))
            return parsed[randomIndex]
        } catch(e){
            console.log("[ERROR]: ", e);
            return []
        }
    }
}

const db = new dbClase('productos.json')

app.get('/productos', async(req, res) => {
    const Data = await db.getAll()
    res.send(Data)
})

app.get('/productoRandom', async(req,res) => {
    const Data = await db.getRandom()
    res.send(Data)
})

const server = app.listen(8080, () => {
    console.log(`Servidor inicializado en puerto ${server.address().port}`);
})