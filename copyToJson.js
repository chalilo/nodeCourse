const fs = require('fs')

const timestamp = Date.now()

const array = []

const copyToArr = async(filename)=>{
    await fs.promises.writeFile(filename,JSON.stringify(array))
    const file = await fs.promises.readFile(`${filename}`,'utf-8')
    console.log(file);
}

//copyToArr('data/productos.json')