const d = document,
  $formulario = d.getElementById("buscador-cancion"),
  $main = d.getElementById("main"),
  $cancion = d.querySelector(".letra-cancion"),
  $artista = d.querySelector(".info-artista"),
  $cagador = d.querySelector(".cagador");
$error = d.querySelector(".error");

$formulario.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    $cagador.style.display = "block";
    let artista = e.target.artista.value.toLowerCase(),
      cancion = e.target.cancion.value.toLowerCase(),
      $plantillaArtista = "",
      $plantillaCancion = "",
      apiArtista = `https://theaudiodb.com/api/v1/json/2/search.php?s=${artista}`,
      apiCancion = `https://api.lyrics.ovh/v1/${artista}/${cancion}`,
      fetchArtista = fetch(apiArtista),
      fetchCancion = fetch(apiCancion),
      [resArtista, resCancion] = await Promise.all([
        fetchArtista,
        fetchCancion,
      ]),
      datosArtista = await resArtista.json(),
      datosCancion = await resCancion.json();

    // console.log(resArtista, resCancion);
    console.log(datosArtista, datosCancion);

    if (datosArtista.artists === null) {
      $plantillaArtista = `<h2>No existe el artista <mark>${artista}</mark></h2>`;
    } else {
      let artist = datosArtista.artists[0];
      $plantillaArtista = `
        <h2>${artist.strArtist}</h2>
        <img src="${artist.strArtistThumb}" alt="${artist.strArtist}">
        <p>
          ${artist.intBornYear} - ${artist.intDiedYear || "Vivo"}
        </p>
        <p>${artist.strCountry}</p>
        <p>${artist.strGenre} - ${artist.strStyle}</p>
        <a href="http://${artist.strWebsite}" target="_blank">Sitio Web</a>
        <p>${artist.strBiographyEN}</p>
      `;
    }

    if (datosCancion.error) {
      $plantillaCancion = `<h2>Canción inexistente <mark >${cancion}</mark></h2>`;
    } else {
      $plantillaCancion = `
      <h2>${cancion.toUpperCase()}</h2>
      <blockquote>${datosCancion.lyrics}</blockquote>
      `;
    }

    $cagador.style.display = "none";
    $artista.innerHTML = $plantillaArtista;
    $cancion.innerHTML = $plantillaCancion;
  } catch (error) {
    console.log(error);
    $error.innerHTML = `<p>Errorsuco: ${error}</p>`;
    $cagador.style.display = "none";
  }
});
