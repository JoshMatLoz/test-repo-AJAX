const d = document,
  $selectorPrimario = d.getElementById("selector-primario"),
  $selectorSecundario = d.getElementById("selector-secundario");

function cargaEstados() {
  fetch("https://api.copomex.com/query/get_estados?token=pruebas")
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      console.log(json);
      let $opciones = `<option value="">Elige un Estado</option>`;
      json.response.estado.forEach(
        (el) => ($opciones += `<option value="${el}">${el}</option>`)
      );
      $selectorPrimario.innerHTML = $opciones;
    })
    .catch((err) => {
      console.log(err);
      let mensaje = err.statusText || "ERRORSUCO";
      $selectorPrimario.nextElementSibling.innerHTML = `
      Error ${err.status}: ${mensaje}
      `;
    });
}

function cargaMunicipios(estado) {
  fetch(
    `https://api.copomex.com/query/get_municipio_por_estado/${estado}?token=pruebas`
  )
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      console.log(json);
      let $opciones = `<option value="">Elige un Municipio</option>`;
      json.response.municipios.forEach(
        (el) => ($opciones += `<option value="${el}">${el}</option>`)
      );
      $selectorSecundario.innerHTML = $opciones;
    })
    .catch((err) => {
      console.log(err);
      let mensaje = err.statusText || "ERRORSUCO";
      $selectorSecundario.nextElementSibling.innerHTML = `
      Error ${err.status}: ${mensaje}
      `;
    });
}

d.addEventListener("DOMContentLoaded", cargaEstados);

$selectorPrimario.addEventListener("change", (e) =>
  cargaMunicipios(e.target.value)
);
