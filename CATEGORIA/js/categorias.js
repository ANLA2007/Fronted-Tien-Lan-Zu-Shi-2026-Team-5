console.log("JS Categorías conectado");

const modal = document.getElementById("modalCategoria");
const nombreInput = document.getElementById("nombreCategoria");
const estadoInput = document.getElementById("estadoCategoria");
const descripcionInput = document.getElementById("descripcionCategoria");
const error = document.getElementById("errorCategoria");
const tbody = document.querySelector(".table-categorias tbody");
const buscador = document.querySelector(".search-categoria");

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

    estadoInput.value = "Activo";

    descripcionInput.value = "";

    error.innerHTML = "";
}
//GUARDAR CATEGORÍA

function guardarCategoria() {

    const nombre = nombreInput.value.trim();

    const estado = estadoInput.value;

    const descripcion = descripcionInput.value.trim();


    // VALIDAR CAMPOS
    if (
        nombre === "" ||
        descripcion === ""
    ) {

        error.innerHTML = "⚠️ Completa todos los campos";

        return;
    }


    // VALIDAR NOMBRE REPETIDO
    const filas = document.querySelectorAll(".table-categorias tbody tr");

    for (let fila of filas) {

        const nombreTabla =
            fila.cells[0].textContent.trim().toLowerCase();

        if (
            nombreTabla === nombre.toLowerCase() &&
            fila !== filaEditando
        ) {

            error.innerHTML =
                "⚠️ Ya existe una categoría con ese nombre";

            return;
        }
    }


    // LIMPIAR ERROR
    error.innerHTML = "";


    // CLASE DEL ESTADO
    let claseEstado = "";

    if (estado === "Activo") {

        claseEstado = "estado-activo";

    } else {

        claseEstado = "estado-inactivo";
    }

//EDITAR FILA

    if (filaEditando) {

        filaEditando.innerHTML = `

            <td>${nombre}</td>

            <td>
                <span class="${claseEstado}">
                    ${estado}
                </span>
            </td>

            <td>${descripcion}</td>

            <td>

                <div class="acciones-tabla">

                    <button 
                        class="btn-accion editar"
                        onclick="editarCategoria(this)"
                    >

                        <img src="img/editar.png">

                    </button>

                    <button 
                        class="btn-accion eliminar"
                        onclick="eliminarCategoria(this)"
                    >

                        <img src="img/borrar.png">

                    </button>

                </div>

            </td>
        `;

        cerrarModal();

        return;
    }

//CREAR FILA

    const fila = document.createElement("tr");


    fila.innerHTML = `

        <td>${nombre}</td>

        <td>
            <span class="${claseEstado}">
                ${estado}
            </span>
        </td>

        <td>${descripcion}</td>

        <td>

            <div class="acciones-tabla">

                <button 
                    class="btn-accion editar"
                    onclick="editarCategoria(this)"
                >

                    <img src="img/editar.png">

                </button>

                <button 
                    class="btn-accion eliminar"
                    onclick="eliminarCategoria(this)"
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

function editarCategoria(boton) {

    filaEditando = boton.closest("tr");


    // OBTENER DATOS
    const nombre =
        filaEditando.cells[0].textContent.trim();

    const estado =
        filaEditando.cells[1]
        .querySelector("span")
        .textContent
        .trim();

    const descripcion =
        filaEditando.cells[2].textContent.trim();


    // PASAR DATOS AL MODAL
    nombreInput.value = nombre;

    estadoInput.value = estado;

    descripcionInput.value = descripcion;


    // ABRIR MODAL
    modal.style.display = "flex";
}


//ELIMINAR CATEGORÍA//

function eliminarCategoria(boton) {

    const fila = boton.closest("tr");

    fila.remove();
}

// BUSCAR//

buscador.addEventListener("keyup", function () {

    const texto = this.value.toLowerCase();

    const filas =
        document.querySelectorAll(
            ".table-categorias tbody tr"
        );


    filas.forEach(fila => {

        const nombreCategoria =
            fila.cells[0]
            .textContent
            .toLowerCase();


        if (nombreCategoria.includes(texto)) {

            fila.style.display = "";

        } else {

            fila.style.display = "none";
        }
    });
});

// CERRAR MODAL //
window.onclick = function(event) {

    if (event.target === modal) {

        cerrarModal();
    }
};