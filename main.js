const fs = require('fs');

class Contenedor {
    constructor(nombreArchivo) {
        this.archivo = `./data/${nombreArchivo}`
    };
    async save(obj) {
        await fs.promises.readFile(`${this.archivo}`, 'utf-8')
        .then(async (data)=>{
            let parsed = JSON.parse(data)
            const usuario = obj
            if (parsed.length === 0) {
                usuario.id = parsed.length + 1
            } else if (parsed[parsed.length - 1].id === parsed.length + 1) {
                usuario.id = parsed.length + 1
            } else {
                usuario.id = parsed[parsed.length - 1].id + 1
            }
            parsed.push(usuario)
            let stringified = JSON.stringify(parsed)
            console.log(usuario);
            await fs.promises.writeFile(this.archivo, stringified)
        })
    }
    async getById(number) {
        await fs.promises.readFile(`${this.archivo}`, 'utf-8')
        .then((data)=>{
            const parsed = JSON.parse(data);
            const found = parsed.find((el) => el.id === number)
            if (found) {
                console.log(found);
            } else {
                console.log('Id no encontrada');
            }
        }).catch((err)=>console.log(err))
    }
    async getAll() {
        await fs.promises.readFile(`${this.archivo}`, 'utf-8')
        .then((data)=>{
            console.log(JSON.parse(data));
        }).catch((err)=>console.log(err))
    }
    async deleteById(number) {
        await fs.promises.readFile(`${this.archivo}`, 'utf-8')
        .then(async (data)=>{
            const parsed = JSON.parse(data)
            const found = parsed.find((el) => el.id === number)
            if (found) {
                const arrayMap = parsed.filter((el) => {
                    return el.id != number
                })
                const stringified = JSON.stringify(arrayMap)
                await fs.promises.writeFile(this.archivo, stringified)
                console.log(`Se elimino objetivo con id : ${number}`);
            } else {
                console.log('Id no encontrada');
            }
        }).catch((err)=>console.log(err))
    }
    async deleteAll() {
        await fs.promises.readFile(`${this.archivo}`,'utf-8')
        .then(async ()=>{
            await fs.promises.writeFile(this.archivo, '[]')
            .then(()=>{console.log("Archivo borrado");})
            .catch((err)=>console.log(err))
        }).catch((err)=>console.log(err))
    }
}

const start = async () => {
    const db = new Contenedor("baseUsuarios.json")
    const usuario = { nombre: 'Camilo', edad: 21, correo: 'camilocoderexample@gmail.com' }
    //db.save(usuario)
    //db.getById(1)
    //db.getAll()
    //db.deleteById(1)
    //db.deleteAll()
}

start()