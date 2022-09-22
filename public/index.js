async function getResponse() {
  const response = await fetch("/public/list.hbs");
  return response.text();
}

const socket = io.connect();

socket.on("productosGet", async (data) => {
  const templateTxt = await getResponse();
  var template = Handlebars.compile(templateTxt);
  const displayProd = document.getElementById("productosDisplay");
  displayProd.innerHTML = template({ productos: data });
});

function anadirProducto(ev) {
  const title = document.getElementById("title").value;
  const price = document.getElementById("price").value;
  const thumbnail = document.getElementById("thumbnail").value;
  document.getElementById("title").value = "";
  document.getElementById("price").value = "";
  document.getElementById("thumbnail").value = "";
  socket.emit("productoNuevo", { title, price, thumbnail });
  return false;
}

function enviarMensaje(ev) {
  const email = document.getElementById("email").value;
  const mensaje = document.getElementById("mensaje").value;
  socket.emit("msjNuevo", { email, mensaje });
  return false;
}

function renderHtml(data) {
  const html = data
    .map((el) => {
      return `<p><strong style="color: blue">${el.email}</strong> <span style="color: brown">${el.time[0]}/${el.time[1]}/${el.time[2]} ${el.time[3]}:${el.time[4]}:${el.time[5]}</span> <i>${el.mensaje}</i</p>`;
    })
    .join("");
    return html
}

socket.on("mensajesGet", (data) => {
  const messageBox = document.getElementById("messageBox");
  messageBox.innerHTML = renderHtml(data);
  console.log(data);
});
