console.log("JS Usuarios conectado");

const modal = document.getElementById("modalUsuario");
const nombreInput = document.getElementById("nombreUsuario");
const correoInput = document.getElementById("correoUsuario");
const passInput = document.getElementById("passwordUsuario");
const estadoInput = document.getElementById("estadoUsuario");
const error = document.getElementById("errorUsuario");
const tbody = document.querySelector(".table-usuarios tbody");
const buscador = document.querySelector(".search-usuarios");

// VARIABLE PARA EDITAR
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

    correoInput.value = "";

    passInput.value = "";

    estadoInput.value = "Activo";

    error.innerHTML = "";
}

// GUARDAR USUARIO
function guardarUsuario() {

    const nombre = nombreInput.value.trim();

    const correo = correoInput.value.trim();

    const pass = passInput.value.trim();

    const estado = estadoInput.value;

    // VALIDAR CAMPOS
    if (
        nombre === "" ||
        correo === "" ||
        pass === ""
    ) {
        error.innerHTML = "⚠️ Completa todos los campos";
        return;
    }

    // VALIDAR REPETIDOS
    const filas = document.querySelectorAll(".table-usuarios tbody tr");

    for (let fila of filas) {

        const nombreTabla =
            fila.cells[0].textContent.trim().toLowerCase();

        const correoTabla =
            fila.cells[1].textContent.trim().toLowerCase();

        if (fila !== filaEditando) {

            if (correoTabla === correo.toLowerCase()) {
                error.innerHTML =
                    "⚠️ Ya existe un usuario con ese correo";
                return;
            }

            if (nombreTabla === nombre.toLowerCase()) {
                error.innerHTML =
                    "⚠️ Ya existe un usuario con ese nombre";
                return;
            }
        }
    }

    error.innerHTML = "";

    let claseEstado = "";

    if (estado === "Activo") {
        claseEstado = "estado-activo";
    } else {
        claseEstado = "estado-inactivo";
    }

    // EDITAR FILA
    if (filaEditando) {

        filaEditando.innerHTML = `

            <td>${nombre}</td>

            <td>${correo}</td>

            <td>••••••••</td>

            <td>
                <span class="${claseEstado}">
                    ${estado}
                </span>
            </td>

            <td>

                <div class="acciones-tabla">

                    <button 
                        class="btn-accion editar"
                        onclick="editarUsuario(this)"
                    >
                        <img src="img/editar.png">
                    </button>

                    <button 
                        class="btn-accion eliminar"
                        onclick="eliminarUsuario(this)"
                    >
                        <img src="img/borrar.png">
                    </button>

                </div>

            </td>
        `;

        cerrarModal();

        return;
    }

    // CREAR FILA
    const fila = document.createElement("tr");

    fila.innerHTML = `

        <td>${nombre}</td>

        <td>${correo}</td>

        <td>••••••••</td>

        <td>
            <span class="${claseEstado}">
                ${estado}
            </span>
        </td>

        <td>

            <div class="acciones-tabla">

                <button 
                    class="btn-accion editar"
                    onclick="editarUsuario(this)"
                >
                    <img src="img/editar.png">
                </button>

                <button 
                    class="btn-accion eliminar"
                    onclick="eliminarUsuario(this)"
                >
                    <img src="img/borrar.png">
                </button>

            </div>

        </td>
    `;

    // AGREGAR FILA
    tbody.appendChild(fila);

    // CERRAR MODAL
    cerrarModal();
}

// EDITAR USUARIO
function editarUsuario(boton) {

    filaEditando = boton.closest("tr");

    const nombre =
        filaEditando.cells[0].textContent.trim();

    const correo =
        filaEditando.cells[1].textContent.trim();

    const estado =
        filaEditando.cells[3]
            .querySelector("span")
            .textContent
            .trim();

    nombreInput.value = nombre;
    correoInput.value = correo;
    passInput.value = "";
    estadoInput.value = estado;

    modal.style.display = "flex";
}

// ELIMINAR USUARIO
function eliminarUsuario(boton) {

    const fila = boton.closest("tr");

    fila.remove();
}

// BUSCAR
buscador.addEventListener("keyup", function () {

    const texto = this.value.toLowerCase();

    const filas =
        document.querySelectorAll(".table-usuarios tbody tr");

    filas.forEach(fila => {

        const nombre =
            fila.cells[0].textContent.toLowerCase();

        const correo =
            fila.cells[1].textContent.toLowerCase();

        if (nombre.includes(texto) || correo.includes(texto)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
});

// CERRAR MODAL
window.onclick = function (event) {

    if (event.target === modal) {
        cerrarModal();
    }
};