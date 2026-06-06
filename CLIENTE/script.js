console.log("JS Cliente conectado");

const modal = document.getElementById("modalCliente");
const nombreInput = document.getElementById("nombreCliente");
const apellidoInput = document.getElementById("apellidoCliente");
const correoInput = document.getElementById("correoCliente");
const estadoInput = document.getElementById("estadoCliente");
const error = document.getElementById("errorCliente");

const tbody = document.querySelector(".table-cliente tbody");
const buscador = document.querySelector(".search-clientes");

let filaEditando = null;

// ABRIR MODAL
function abrirModal() {
    filaEditando = null;
    limpiarCampos();
    modal.style.display = "flex";
}

// CERRAR MODAL
function cerrarModal() {
    modal.style.display = "none";
    limpiarCampos();
    filaEditando = null;
}

// LIMPIAR CAMPOS
function limpiarCampos() {
    nombreInput.value = "";
    apellidoInput.value = "";
    correoInput.value = "";
    estadoInput.value = "Activo";
    error.textContent = "";
}

// GUARDAR CLIENTE
function guardarCliente() {

    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const correo = correoInput.value.trim();
    const estado = estadoInput.value;

    if (
        nombre === "" ||
        apellido === "" ||
        correo === ""
    ) {
        error.textContent = "⚠️ Completa todos los campos";
        return;
    }

    const filas = document.querySelectorAll(".table-cliente tbody tr");

    for (let fila of filas) {

        const nombreTabla = fila.cells[0].textContent.trim().toLowerCase();
        const apellidoTabla = fila.cells[1].textContent.trim().toLowerCase();
        const correoTabla = fila.cells[2].textContent.trim().toLowerCase();

        if (fila !== filaEditando) {

            if (correoTabla === correo.toLowerCase()) {
                error.textContent = "⚠️ Ya existe un cliente con ese correo";
                return;
            }

            if (
                nombreTabla === nombre.toLowerCase() &&
                apellidoTabla === apellido.toLowerCase()
            ) {
                error.textContent = "⚠️ Ese cliente ya existe";
                return;
            }
        }

            const nuevosClientes = [...clientesActuales, nuevoCliente];
    localStorage.setItem('catalogoClientes', JSON.stringify(nuevosClientes));
    }

    

    const claseEstado =
        estado === "Activo"
            ? "estado-activo"
            : "estado-inactivo";

    // EDITAR
    if (filaEditando) {

        filaEditando.innerHTML = `
            <td>${nombre}</td>
            <td>${apellido}</td>
            <td>${correo}</td>

            <td>
                <span class="${claseEstado}">
                    ${estado}
                </span>
            </td>

            <td>
                <div class="acciones-tabla">

                    <button class="btn-accion editar" onclick="editarCliente(this)">
                        <img src="img/editar.png" alt="">
                    </button>

                    <button class="btn-accion eliminar" onclick="eliminarCliente(this)">
                        <img src="img/borrar.png" alt="">
                    </button>

                </div>
            </td>
        `;

        cerrarModal();
        return;
    }

    // NUEVA FILA
    const fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${nombre}</td>
        <td>${apellido}</td>
        <td>${correo}</td>

        <td>
            <span class="${claseEstado}">
                ${estado}
            </span>
        </td>

        <td>
            <div class="acciones-tabla">

                <button class="btn-accion editar" onclick="editarCliente(this)">
                    <img src="img/editar.png" alt="">
                </button>

                <button class="btn-accion eliminar" onclick="eliminarCliente(this)">
                    <img src="img/borrar.png" alt="">
                </button>

            </div>
        </td>
    `;

    tbody.appendChild(fila);

    cerrarModal();
}

// EDITAR CLIENTE
function editarCliente(boton) {

    filaEditando = boton.closest("tr");

    nombreInput.value = filaEditando.cells[0].textContent.trim();
    apellidoInput.value = filaEditando.cells[1].textContent.trim();
    correoInput.value = filaEditando.cells[2].textContent.trim();

    estadoInput.value =
        filaEditando.cells[3]
            .querySelector("span")
            .textContent
            .trim();

    modal.style.display = "flex";
}

// ELIMINAR CLIENTE
function eliminarCliente(boton) {

    if (confirm("¿Deseas eliminar este cliente?")) {
        boton.closest("tr").remove();
    }
}

// BUSCADOR
if (buscador) {

    buscador.addEventListener("keyup", function () {

        const texto = this.value.toLowerCase();

        const filas = document.querySelectorAll(".table-cliente tbody tr");

        filas.forEach(fila => {

            const nombre = fila.cells[0].textContent.toLowerCase();
            const apellido = fila.cells[1].textContent.toLowerCase();
            const correo = fila.cells[2].textContent.toLowerCase();

            if (
                nombre.includes(texto) ||
                apellido.includes(texto) ||
                correo.includes(texto)
            ) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }

        });

    });

}

// CERRAR MODAL AL HACER CLICK FUERA
window.addEventListener("click", function (event) {

    if (event.target === modal) {
        cerrarModal();
    }

});