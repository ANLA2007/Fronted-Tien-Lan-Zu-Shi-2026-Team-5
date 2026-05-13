console.log("JS conectado");


// ABRIR MODAL
function abrirModal() {

    const modal = document.getElementById("modalRol");

    modal.style.display = "flex";
}


// CERRAR MODAL
function cerrarModal() {

    const modal = document.getElementById("modalRol");

    const input = document.getElementById("nombreRol");

    const error = document.getElementById("errorRol");


    modal.style.display = "none";

    input.value = "";

    error.innerHTML = "";
}


// GUARDAR ROL
function guardarRol() {

    const nombre = document.getElementById("nombreRol").value.trim();

    const estado = document.getElementById("estadoRol").value;

    const error = document.getElementById("errorRol");


    // VALIDAR INPUT
    if (nombre === "") {

        error.innerHTML = "⚠️ Debes ingresar un nombre para el rol";

        return;
    }


    // LIMPIAR ERROR
    error.innerHTML = "";


    // OBTENER TABLA
    const tbody = document.querySelector(".table-roles tbody");


    // CREAR FILA
    const fila = document.createElement("tr");


    // CONTENIDO
    fila.innerHTML = `

        <td>${nombre}</td>

        <td>
            <span class="estado-activo">
                ${estado}
            </span>
        </td>

        <td>

            <div class="acciones-tabla">

                <button class="btn-editar">
                    Editar
                </button>

                <button class="btn-eliminar"
                    onclick="eliminarRol(this)">
                    Eliminar
                </button>

            </div>

        </td>
    `;


    // AGREGAR FILA
    tbody.appendChild(fila);


    // CERRAR MODAL
    cerrarModal();
}


// ELIMINAR
function eliminarRol(boton) {

    const fila = boton.closest("tr");

    fila.remove();
}


// BUSCAR ROL
const buscador = document.querySelector(".search-role");

buscador.addEventListener("keyup", function () {

    const texto = this.value.toLowerCase();

    const filas = document.querySelectorAll(".table-roles tbody tr");


    filas.forEach(fila => {

        const nombreRol = fila.cells[0].textContent.toLowerCase();


        if (nombreRol.includes(texto)) {

            fila.style.display = "";

        } else {

            fila.style.display = "none";
        }
    });

});


// CERRAR MODAL 
window.onclick = function(event) {

    const modal = document.getElementById("modalRol");

    if (event.target === modal) {

        cerrarModal();
    }
}