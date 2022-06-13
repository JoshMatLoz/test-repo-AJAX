const d = document,
  $main = document.querySelector("main"),
  $links = d.querySelector(".links");

let pokeAPI = "https://pokeapi.co/api/v2/pokemon/";

async function cargaPokemonos(url) {
  try {
    $main.innerHTML = `<img class="cagador" src="recursos/circles.svg" alt="Cagando...">`;

    let res = await fetch(url),
      json = await res.json(),
      $plantilla = "",
      $antLiga,
      $sigLiga;

    console.log(json);

    if (!res.ok) throw { status: res.status, statusText: res.statusText };

    for (let i = 0; i < json.results.length; i++) {
      // console.log(json.results[i]);
      try {
        let res = await fetch(json.results[i].url),
          pokemono = await res.json();

        // console.log(res, pokemono);
        if (!res.ok) throw { status: res.status, statusText: res.statusText };

        $plantilla += `
          <figure>
            <img src="${pokemono.sprites.front_default}" alt="${pokemono.name}">
            <figcaption>${pokemono.name}</figcaption>
          </figure>
        `;
      } catch (error) {
        let mensaje = error.statusText || "ERRORSUCO";
        $plantilla += `
                  <figure>
                    <figcaption>Error ${error.status}: ${mensaje}</figcaption>
                  </figure>
                `;
      }
    } //ciclo for

    $main.innerHTML = $plantilla;
    //operador ternario, si hay contenido en la variable json se imprime la flechita
    $antLiga = json.previous ? `<a href="${json.previous}">◀️</a>` : "";
    $sigLiga = json.next ? `<a href="${json.next}">▶️</a>` : "";
    $links.innerHTML = $antLiga + " " + $sigLiga;
  } catch (error) {
    let mensaje = error.statusText || "ERRORSUCO";
    $main.innerHTML = `<p>Errorsuco ${error.status}: ${mensaje} </p>`;
  }
}

d.addEventListener("DOMContentLoaded", (e) => cargaPokemonos(pokeAPI));

d.addEventListener("click", (e) => {
  //cualquier enlace que este dentro de la clase links
  if (e.target.matches(".links a")) {
    e.preventDefault();
    cargaPokemonos(e.target.getAttribute("href"));
  }
});
