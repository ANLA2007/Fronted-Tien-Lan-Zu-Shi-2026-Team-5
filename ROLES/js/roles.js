console.log("JS Roles conectado");

const modal = document.getElementById("modalRoles");
const nombreInput = document.getElementById("nombreRol");
const estadoInput = document.getElementById("estadoRol");
const error = document.getElementById("errorRol");
const tbody = document.querySelector(".table-usuarios tbody");
const buscador = document.querySelector(".search-usuarios");

let filaEditando = null;

function abrirModal() {
    modal.style.display = "flex";
    limpiarCampos();
    filaEditando = null;
}

function cerrarModal() {
    modal.style.display = "none";
    limpiarCampos();
    filaEditando = null;
}

function limpiarCampos() {
    nombreInput.value = "";
    estadoInput.value = "Activo";
    error.innerHTML = "";
}

function guardarRol() {
    const nombre = nombreInput.value.trim();
    const estado = estadoInput.value;

    if (nombre === "") {
        error.innerHTML = "⚠️ Completa el nombre";
        return;
    }

    const filas = document.querySelectorAll(".table-usuarios tbody tr");

    for (let fila of filas) {
        const nombreTabla = fila.cells[0].textContent.trim().toLowerCase();

        if (fila !== filaEditando) {
            if (nombreTabla === nombre.toLowerCase()) {
                error.innerHTML = "⚠️ Ya existe este rol";
                return;
            }
        }
    }

    error.innerHTML = "";

    const claseEstado = estado === "Activo" ? "estado-activo" : "estado-inactivo";

    if (filaEditando) {
        filaEditando.innerHTML = `
            <td>${nombre}</td>
            <td><span class="${claseEstado}">${estado}</span></td>
            <td>
                <div class="acciones-tabla">
                    <button class="btn-accion editar" onclick="editarRol(this)">
                        <img src="img/editar.png">
                    </button>
                    <button class="btn-accion eliminar" onclick="eliminarRol(this)">
                        <img src="img/borrar.png">
                    </button>
                </div>
            </td>
        `;
        cerrarModal();
        return;
    }

    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${nombre}</td>
        <td><span class="${claseEstado}">${estado}</span></td>
        <td>
            <div class="acciones-tabla">
                <button class="btn-accion editar" onclick="editarRol(this)">
                    <img src="img/editar.png">
                </button>
                <button class="btn-accion eliminar" onclick="eliminarRol(this)">
                    <img src="img/borrar.png">
                </button>
            </div>
        </td>
    `;

    tbody.appendChild(fila);

    cerrarModal();
}

function editarRol(boton) {
    filaEditando = boton.closest("tr");

    const nombre = filaEditando.cells[0].textContent.trim();
    const estado = filaEditando.cells[1].textContent.trim();

    nombreInput.value = nombre;
    estadoInput.value = estado;

    modal.style.display = "flex";
}

function eliminarRol(boton) {
    const fila = boton.closest("tr");
    fila.remove();
}

buscador.addEventListener("keyup", function () {
    const texto = this.value.toLowerCase();

    document.querySelectorAll(".table-usuarios tbody tr").forEach(fila => {
        const nombre = fila.cells[0].textContent.toLowerCase();
        fila.style.display = nombre.includes(texto) ? "" : "none";
    });
});

window.onclick = function (event) {
    if (event.target === modal) {
        cerrarModal();
    }
};