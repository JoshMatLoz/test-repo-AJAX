const d = document,
  $shows = d.getElementById("shows"),
  $plantilla = d.getElementById("plantilla-show").content,
  $fragmento = d.createDocumentFragment();

d.addEventListener("keypress", async (e) => {
  if (e.target.matches("#buscador")) {
    console.log(e.key);
    if (e.key === "Enter") {
      try {
        $shows.innerHTML = `<img class="cagador" src="recursos/circles.svg" alt="Cagando...">`;

        let query = e.target.value.toLowerCase(),
          api = `http://api.tvmaze.com/search/shows?q=${query}`,
          res = await fetch(api),
          json = await res.json();

        console.log(api, res, json);
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        if (json.length === 0) {
          $shows.innerHTML = `<h2>No existe el show buscado: <mark>${query}</mark></h2>`;
        } else {
          json.forEach((el) => {
            //Dentro de la plantilla h3 en su contenido pon el nombre del show
            $plantilla.querySelector("h3").textContent = el.show.name;
            $plantilla.querySelector("div").innerHTML = el.show.summary
              ? el.show.summary
              : "Sin descripcion";
            $plantilla.querySelector("img").src = el.show.image
              ? el.show.image.medium
              : "http://static.tvmaze.com/images/no-img/no-img-portrait-text.png";
            $plantilla.querySelector("img").alt = el.show.name;
            $plantilla.querySelector("img").alt = el.show.name;
            $plantilla.querySelector("a").href = el.show.url
              ? el.show.url
              : "#";
            $plantilla.querySelector("a").target = el.show.url
              ? "_blank"
              : "_self";
            $plantilla.querySelector("a").textContent = el.show.url
              ? "Ver gas..."
              : "";

            let $clon = d.importNode($plantilla, true);
            $fragmento.appendChild($clon);
          });
          $shows.innerHTML = "";
          $shows.appendChild($fragmento);
        }
      } catch (error) {
        console.log(error);
        let mensaje = error.statusText || "ERRORSUCO";
        $shows.innerHTML = `<p>Error ${error.status}: ${mensaje}</p><br>${error}`;
      }
    }
  }
});
