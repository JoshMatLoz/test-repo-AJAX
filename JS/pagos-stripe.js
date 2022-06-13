import CLAVES_STRIPE from "./claves-stripe.js";
// console.log(CLAVES_STRIPE);

const d = document,
  $mariscos = d.getElementById("mariscos"),
  $plantilla = d.getElementById("plantilla-mariscos").content,
  $fragmento = d.createDocumentFragment(),
  fetchOptions = {
    headers: {
      Authorization: `Bearer ${CLAVES_STRIPE.secreta}`,
    },
  };

let productos, precios;

const formatoMoneda = (num) => `$${num.slice(0, -2)}.${num.slice(-2)}`;

Promise.all([
  fetch("https://api.stripe.com/v1/products", fetchOptions),
  fetch("https://api.stripe.com/v1/prices", fetchOptions),
])
  .then((responses) => Promise.all(responses.map((res) => res.json())))
  .then((json) => {
    // console.info(json);
    productos = json[0].data;
    precios = json[1].data;
    // console.log(productos, precios);

    precios.forEach((el) => {
      let datosProducto = productos.filter(
        (producto) => producto.id === el.product
      );
      console.log(datosProducto);
      $plantilla.querySelector(".marisco").setAttribute("data-precio", el.id);
      $plantilla.querySelector("img").src = datosProducto[0].images[0];
      $plantilla.querySelector("img").alt = datosProducto[0].name;
      $plantilla.querySelector("figcaption").innerHTML = `
      ${datosProducto[0].name}
      <br>
      ${formatoMoneda(el.unit_amount_decimal)} ${el.currency}`;

      let $clon = d.importNode($plantilla, true);
      $fragmento.appendChild($clon);
    });

    $mariscos.appendChild($fragmento);
  })
  .catch((err) => {
    console.error(err);
    let mensaje = err.statusText || "Ocurrió Errorsuco con la API de Stripe";
    $mariscos.innerHTML = `<p>Error ${error.status}: ${mensaje}</p>`;
  });

d.addEventListener("click", (e) => {
  // console.log(e.target);
  if (e.target.matches(".marisco *")) {
    // alert("A comprar");
    let precio = e.target.parentElement.getAttribute("data-precio");
    // console.log(precio);
    Stripe(CLAVES_STRIPE.publica)
      .redirectToCheckout({
        lineItems: [{ price: precio, quantity: 1 }],
        mode: "payment",
        successUrl:
          "http://127.0.0.1:5500/Ejercicios%20AJAX/recursos/stripe_exito.html",
        cancelUrl:
          "http://127.0.0.1:5500/Ejercicios%20AJAX/recursos/stripe_fallo.html",
      })
      .then((res) => {
        console.info(res);
        if (res.error) {
          $mariscos.insertAdjacentHTML("afterend", res.error.message); //propiedades de STRIPE
        }
      });
  }
});
