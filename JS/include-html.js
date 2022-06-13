document.addEventListener("DOMContentLoaded", (e) => {
  const includeHTML = (el, url) => {
    const xhr = new XMLHttpRequest();

    xhr.addEventListener("readystatechange", (e) => {
      if (xhr.readyState !== 4) return;

      if (xhr.status >= 200 && xhr.status < 300) {
        el.outerHTML = xhr.responseText;
      } else {
        let mensaje =
          xhr.statusText ||
          "Error al cargar el archivo, verifica que estes haciendo la peticion por http o https";
        el.outerHTML = `<div><p>Error ${xhr.status}: ${mensaje}</p></div>`;
      }
    });

    xhr.open("GET", url);
    xhr.setRequestHeader("content-type", "text/html; charset=utf8");
    xhr.send();
  };

  document.querySelectorAll("[data-include]").forEach((el) => {
    includeHTML(el, el.getAttribute("data-include"));
  });
});
