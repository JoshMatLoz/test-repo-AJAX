const d = document;

function formularioValidaciones() {
  const $formulario = d.querySelector(".formulario-contacto"),
    $entradas = d.querySelectorAll(".formulario-contacto [required]");

  // console.log($entradas);
  $entradas.forEach((entrada) => {
    const $span = d.createElement("span");
    $span.id = entrada.name;
    $span.textContent = entrada.title;
    $span.classList.add("formulario-contacto-error", "none");
    entrada.insertAdjacentElement("afterend", $span);
  });

  d.addEventListener("keyup", (e) => {
    if (e.target.matches(".formulario-contacto [required]")) {
      let $entrada = e.target,
        patron = $entrada.pattern || $entrada.dataset.pattern;
      // console.log($entrada, patron);
      if (patron && $entrada.value !== "") {
        let expReg = new RegExp(patron);
        return !expReg.exec($entrada.value)
          ? d.getElementById($entrada.name).classList.add("is-active")
          : d.getElementById($entrada.name).classList.remove("is-active");
      }

      if (!patron) {
        return $entrada.value === ""
          ? d.getElementById($entrada.name).classList.add("is-active")
          : d.getElementById($entrada.name).classList.remove("is-active");
      }
    }
  });

  d.addEventListener("submit", (e) => {
    e.preventDefault();
    // alert("Enviando Formulario");

    const $cargador = d.querySelector(".formulario-contacto-cargar"),
      $respuesta = d.querySelector(".formulario-contacto-respuesta");

    $cargador.classList.remove("none");

    fetch("PHP/send_mail.php", {
      method: "POST",
      body: new FormData(e.target),
      mode: "cors", //Politicas de transferencias cruzadas
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((json) => {
        console.log(json);
        $cargador.classList.add("none");
        $respuesta.classList.remove("none");
        $respuesta.innerHTML = `<p>${json.message}</p>`;
        $formulario.reset();
      })
      .catch((err) => {
        console.log(err);
        let mensaje =
          err.statusText ||
          "Ocurrió un Errorsuco al enviar, intenta nuevamente";
        $respuesta.innerHTML = `<p>Error ${err.status}: ${mensaje}</p>`;
      })
      .finally(() =>
        setTimeout(() => {
          $respuesta.classList.add("none");
          $respuesta.innerHTML = "";
        }, 3000)
      );
  });
}

d.addEventListener("DOMContentLoaded", (e) => {
  formularioValidaciones();
});
