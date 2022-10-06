const express = require("express");

const router = express.Router();

const DB = require("./database.js");

const productos = new DB(__dirname + "/data/productos.json");

/*let productos = [
  {
    id: 1,
    timestamp: timestamp,
    title: "Fender Telecaster Player Plus",
    price: 1299990,
    stock: 20,
    description: "Guitarra electrica marca Fender",
    thumbnail:
      "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge599_0147333336v1.jpg",
  },
  {
    id: 2,
    timestamp: timestamp,
    title: "Fender Stratocaster American Proffesional II",
    price: 1899990,
    stock: 15,
    description: "Guitarra electrica marca Fender",
    thumbnail:
      "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge562-1_0113902761v1.jpg",
  },
  {
    id: 3,
    timestamp: timestamp,
    stock: 12,
    title: "Fender Jazzmaster 60s Vintera",
    description: "Guitarra electrica marca Fender",
    price: 1399990,
    thumbnail:
      "https://www.fender.cl/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/g/e/ge502_0149753383v1.jpg",
  },
];*/

router.get("/productos", async (req, res) => {
  const data = await productos.getAll();
  res.send(data);
});

router.get("/productos/:id", async (req, res) => {
  const { id } = req.params;
  const search = await productos.getById(id);
  if (search) {
    res.send(search);
  } else {
    res.send({ error: "Producto no encontrado" });
  }
});

router.post("/productos", async (req, res) => {
  const admin = true;
  if (admin) {
    const timestampProduct = Date.now();
    const { title, price, thumbnail, description, stock } = req.body;
    const prod = {
      timestamp: timestampProduct,
      title,
      description,
      thumbnail,
      price: parseInt(price),
      stock: parseInt(stock),
    };
    const addedToDB = await productos.addToDB(prod);
    res.send(addedToDB);
  } else {
    res.send({
      error: -1,
      descripcion: 'Ruta "/productos" metodo "POST" no autorizada',
    });
  }
});

router.put("/productos/:id", async (req, res) => {
  const admin = true;
  if (admin) {
    const { id } = req.params;
    const { title, price, thumbnail, description, stock } = req.body;
    const newPropsArr = [
      { title },
      { price },
      { thumbnail },
      { description },
      { stock },
    ];
    const definedPropsArr = newPropsArr.map((el) => {
      if (el) {
        return el;
      }
    });
    let definedPropsObj = {};
    definedPropsArr.forEach((el) => {
      definedPropsObj = { ...definedPropsObj, ...el };
    });
    const joined = await productos.editObj(id, definedPropsObj);
    if (joined) {
      res.send(joined);
    } else{
      res.send({error: "Producto no encontrado"})
    }
  } else {
    res.send({
      error: -1,
      descripcion: 'Ruta "/productos/id" metodo "PUT" no autorizada',
    });
  }
});

router.delete("/productos/:id", async(req, res) => {
  const admin = true;
  if (admin) {
    const { id } = req.params;
    const deleted = await productos.deleteById(id)
    if (deleted){
      res.send(deleted)
    } else{
      res.send({error: "Producto no encontrado"})
    }
  } else {
    res.send({
      error: -1,
      descripcion: 'Ruta "/productos/id" metodo "DELETE" no autorizada',
    });
  }
});

module.exports = router;
