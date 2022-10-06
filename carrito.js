const express = require("express");

const router = express.Router();

const DB = require("./database.js");

const carritos = new DB(__dirname + "/data/carritos.json");

//Testing//
router.get("/", async (req, res) => {
  const data = await carritos.getAll();
  res.send(data);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const search = await carritos.getById(id);
  if (search) {
    res.send(search);
  } else {
    res.send({ error: "ID no encontrada" });
  }
});
////

router.post("/", async (req, res) => {
  const { items } = req.body;
  const timestampC = Date.now();
  const carrito = { timestamp: timestampC, items };
  const added = await carritos.addToDB(carrito);
  res.send({ mensaje: "Carrito añadido", added });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const deleted = await carritos.deleteById(id);
  if (deleted) {
    res.send(deleted);
  } else {
    res.send({ error: "Carrito no existe" });
  }
});

router.get("/:id/productos", async (req, res) => {
  const { id } = req.params;
  const search = await carritos.getById(id);
  if (search.items) {
    if (search.items.length >= 1) {
      res.send(search.items);
    } else {
      res.send({ error: "Carrito vacio" });
    }
  }else if (search && !search.items){
    res.send({error: "Carrito no definido"})
  } else{
    res.send({error: "Carrito no existe"})
  }
});

router.post("/:id/productos", async(req, res) => {
  const { id } = req.params;
  const { items } = req.body;
  let search = await carritos.getById(id)
  if(search.items){
    const spreadOrig = [...search.items]
    const joinedItems = {items:[...spreadOrig,...items]}
    const edited = await carritos.editObj(id,joinedItems)
    res.send(edited)
  } else if(search && !search.items){
    const edited = await carritos.editObj(id,{items})
    res.send(edited)
  } else{
    res.send({error: "Carrito no existe"})
  }
});

router.delete("/:id/productos/:id_prod", async(req, res) => {
  const { id, id_prod } = req.params;
  const deleted = await carritos.deleteFromItems(id,id_prod)
  res.send(deleted)
});

module.exports = router;
