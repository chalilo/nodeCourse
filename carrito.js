const express = require("express");

const router = express.Router();

let carritos = [];

//Testing//
router.get("/", (req, res) => {
  res.send(carritos);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const busqueda = carritos.find((el) => el.id == id);
  if (busqueda) {
    res.send({ Carrito: busqueda });
  } else {
    res.send({ error: "Busqueda fallida, id no existente" });
  }
});
////

router.post("/", (req, res) => {
  const { items } = req.body;
  const timestampC = Date.now();
  const carrito = { id: 0, timestamp: timestampC, items };
  if (carritos.length <= 0) {
    carrito.id = 1;
  } else if (
    carritos.length >= 1 &&
    carritos[carritos.length - 1].id == carritos.length
  ) {
    carrito.id = carritos.length + 1;
  } else {
    carrito.id = carritos[carritos.length - 1] + 1;
  }
  carritos.push(carrito);
  res.send({ "Id carrito": carrito.id, carrito });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const busqueda = carritos.find((el) => el.id == id);
  if (busqueda) {
    carritos = carritos.filter((el) => el.id != id);
    res.send({ "Carrito borrado": busqueda });
  } else {
    res.send({ error: "Busqueda fallida, id no existente" });
  }
});

router.get("/:id/productos", (req, res) => {
  const { id } = req.params;
  const busqueda = carritos.find((el) => el.id == id);
  if (busqueda) {
    res.send(busqueda.items);
  } else {
    res.send({ error: "Busqueda fallida, id no existente" });
  }
});

router.post("/:id/productos", (req, res) => {
  const { id } = req.params;
  const { items } = req.body;
  const busqueda = carritos.find((el) => el.id == id);
  if (busqueda) {
    //busqueda.items.push(items)
    carritos = carritos.map((el) => {
      if (el.id == id) {
        el.items.push(items);
        return el;
      } else {
        return el;
      }
    });
    res.send({ mensaje: `Items añadidos a carrito ${id}`, items });
  } else {
    res.send({ error: "Busqueda fallida, id no existente" });
  }
});

router.delete("/:id/productos/:id_prod", (req, res) => {
  const { id, id_prod } = req.params;
  const busquedaC = carritos.find((el) => el.id == id);
  const busquedaP = busquedaC.items.find((el) => el.id == id_prod);
  if (busquedaC && busquedaP) {
    carritos = carritos.map((el) => {
      if (el.id == id) {
        el.items = el.items.filter((el) => el.id != id_prod);
        return el;
      } else {
        return el;
      }
    });
    res.send({
      mensaje: `Producto con id ${id_prod}, borrado de carrito ${id}`,
    });
  } else if (busquedaC && !busquedaP) {
    res.send({ error: "Producto no encontrado en carrito" });
  } else {
    res.send({ error: "Busqueda fallida, id no existente" });
  }
});

module.exports = router;
