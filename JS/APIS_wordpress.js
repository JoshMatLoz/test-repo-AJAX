const d = document,
  w = window,
  $sitio = d.getElementById("sitio"),
  $publicaciones = d.getElementById("publicaciones"),
  $cagador = d.querySelector(".cagador"),
  $plantilla = d.getElementById("plantilla-publicacion").content,
  $fragmento = d.createDocumentFragment(),
  DOMINIO = "https://css-tricks.com",
  // DOMINIO = "https://www.mientrastantoenmexico.mx",
  // DOMINIO = "https://www.amywinehouse.com",
  // DOMINIO = "https://wordpress.com/";
  SITIO = `${DOMINIO}/wp-json`,
  API_WP = `${SITIO}/wp/v2`,
  PUBLICACIONES = `${API_WP}/posts?_embed`,
  PAGINAS = `${API_WP}/pages`,
  CATEGORIAS = `${API_WP}/categories`;

let page = 1,
  perPage = 2;
function obtenDatosSitio() {
  fetch(SITIO)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      // console.log(json);
      $sitio.innerHTML = `
      <h3>Sitio Web</h3>
      <h2>
        <a href="${json.url}" target="_blank">${json.name}</a>
      </h2>
      <p>${json.description}</p>
      <p>${json.timezone_string}</p>
      `;
    })
    .catch((err) => {
      console.log(err);
      $sitio.innerHTML = `${err}`;
    });
}

function obtenPublicaciones() {
  $cagador.style.display = "block";
  fetch(`${PUBLICACIONES}&page=${page}&per_page=${perPage}`)
    .then((res) => (res.ok ? res.json() : Promise.reject(res)))
    .then((json) => {
      // console.log(json);

      json.forEach((el) => {
        let categories = "",
          tags = "";

        el._embedded["wp:term"][0].forEach(
          (el) => (categories += `<li>${el.name}</li>`)
        );
        el._embedded["wp:term"][1].forEach(
          (el) => (tags += `<li>${el.name}</li>`)
        );

        $plantilla.querySelector(".img-publicacion").src = el._embedded[
          "wp:featuredmedia"
        ][0]
          ? el._embedded["wp:featuredmedia"][0].source_url
          : "";
        $plantilla.querySelector(".img-publicacion").alt = el.title.rendered;
        $plantilla.querySelector(".titulo-publicacion").innerHTML =
          el.title.rendered;
        $plantilla.querySelector(".autor-publicacion").innerHTML = `
        <img src="${el._embedded.author[0].avatar_urls["48"]}" alt="${el._embedded.author[0].name}">
        <figcaption>${el._embedded.author[0].name}</figcaption>
        `;
        $plantilla.querySelector(".fecha-publicacion").innerHTML = new Date(
          el.date
        ).toLocaleString();
        $plantilla.querySelector(".link-publicacion").href = el.link;
        $plantilla.querySelector(".extracto-publicacion").innerHTML =
          el.excerpt.rendered.replace("[&hellip;]", "...");
        $plantilla.querySelector(".categorias-publicacion").innerHTML = `
          <p>Categorias:</p>
          <ul>${categories}</ul>
        `;
        $plantilla.querySelector(".etiquetas-publicacion").innerHTML = `
          <p>Etiquetas:</p>
          <ul>${tags}</ul>
        `;
        $plantilla.querySelector(".contenido-publicacion > article").innerHTML =
          el.content.rendered;

        let $clon = d.importNode($plantilla, true);
        $fragmento.appendChild($clon);
      });
      $publicaciones.appendChild($fragmento);
      $cagador.style.display = "none";
    })
    .catch((err) => {
      console.log(err);
      $publicaciones.innerHTML = `${err}`;
      $cagador.style.display = "none";
    });
}

d.addEventListener("DOMContentLoaded", (e) => {
  obtenDatosSitio();
  obtenPublicaciones();
});

w.addEventListener("scroll", (e) => {
  const { scrollTop, clientHeight, scrollHeight } = d.documentElement;
  // console.info(scrollTop, clientHeight, scrollHeight);

  if (scrollTop + clientHeight >= scrollHeight) {
    //scrolltop  --> cuanto me he alejado del margen top
    //clientheight --> la altura del viewport o la ventana visible del navegador desde la barra de marcadores hasta donde termina el navegador
    //scrollheight --> el total que tengo de distancia de scroll
    // console.log("CAGAR MAS CONTENIDO");
    page++;
    obtenPublicaciones();
  }
});
