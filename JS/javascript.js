const d = document,
  $main = d.querySelector("main");

const getHTML = (opciones) => {
  let { url, success, error } = opciones;
  const xhr = new XMLHttpRequest();

  xhr.addEventListener("readystatechange", (e) => {
    if (xhr.readyState !== 4) return;

    if (xhr.status >= 200 && xhr.status < 300) {
      let html = xhr.responseText;
      // console.log(html);
      success(html);
    } else {
      let mensaje = xhr.statusText || "Ocurrió un Errorsuco";
      error(`Error ${xhr.status}: ${mensaje}`);
    }
  });

  xhr.open("GET", url);
  xhr.setRequestHeader("Content-type", "text/html; charset=utf-8");
  xhr.send();
};

d.addEventListener("DOMContentLoaded", (e) => {
  getHTML({
    url: "recursos/inicio.html",
    success: (html) => ($main.innerHTML = html),
    error: (err) => ($main.innerHTML = `<h1>${err}</h1>`),
  });
});

d.addEventListener("click", (e) => {
  if (e.target.matches(".menu a")) {
    e.preventDefault();
    getHTML({
      url: e.target.href,
      success: (html) => ($main.innerHTML = html),
      error: (err) => ($main.innerHTML = `<h1>${err}</h1>`),
    });
  }
});
