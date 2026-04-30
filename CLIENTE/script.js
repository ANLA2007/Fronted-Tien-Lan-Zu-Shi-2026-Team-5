let id = 2;

// MODAL
const modal = document.getElementById("modal");
const btnAbrir = document.getElementById("btnAbrir");
const btnCerrar = document.getElementById("cerrar");
const btnGuardar = document.getElementById("guardar");

// ABRIR
btnAbrir.addEventListener("click", () => {
    modal.classList.add("modal-open");
});

// CERRAR
btnCerrar.addEventListener("click", () => {
    modal.classList.remove("modal-open");
});

// GUARDAR
btnGuardar.addEventListener("click", () => {

    let nombre = document.getElementById("nombre").value;
    let apellido = document.getElementById("apellido").value;
    let telefono = document.getElementById("telefono").value;
    let direccion = document.getElementById("direccion").value;

    if (nombre === "" || apellido === "") {
        alert("Completa los datos");
        return;
    }

    let tabla = document.getElementById("bodyClientes");

    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${id++}</td>
        <td>${nombre} ${apellido}</td>
        <td>${telefono}</td>
        <td>${direccion}</td>
    `;

    tabla.appendChild(fila);

    modal.classList.remove("modal-open");
});

// BUSCADOR (igual)
document.getElementById("buscar").addEventListener("keyup", function () {

    let filtro = this.value.toLowerCase();
    let filas = document.querySelectorAll("#tablaClientes tbody tr");

    filas.forEach(fila => {
        let texto = fila.textContent.toLowerCase();
        fila.style.display = texto.includes(filtro) ? "" : "none";
    });
});