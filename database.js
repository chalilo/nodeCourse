const fs = require('fs')

class DB{
    constructor(filepath){
        this.file = filepath
    }
    async leerArchivo(){
        try{
            const data = await fs.promises.readFile(`${this.file}`,'utf-8')
            return JSON.parse(data)
        }catch(e){
            console.log("[ERROR]: ",e);
        }
    }
    async anadirMsj(obj){
        try{
            const data = await fs.promises.readFile(`${this.file}`,'utf-8')
            let alt = JSON.parse(data)
            let fullTime = new Date()
            let time = [fullTime.getDate(),fullTime.getMonth(),fullTime.getFullYear(), fullTime.getHours(), fullTime.getMinutes(), fullTime.getSeconds()]
            alt.push({time: time, email: obj.email, mensaje: obj.mensaje})
            const dataFinal = JSON.stringify(alt)
            await fs.promises.writeFile(`${this.file}`,dataFinal)
            return alt
        }catch(e){
            console.log("[ERROR]: ",e);
        }
    }
}

module.exports = DB