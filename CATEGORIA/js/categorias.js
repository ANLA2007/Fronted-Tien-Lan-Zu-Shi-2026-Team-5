console.log("JS Categorías conectado");


// ABRIR MODAL
function abrirModal() {

    const modal = document.getElementById("modalCategoria");

    modal.style.display = "flex";
}


// CERRAR MODAL
function cerrarModal() {

    const modal = document.getElementById("modalCategoria");

    const nombre = document.getElementById("nombreCategoria");

    const descripcion = document.getElementById("descripcionCategoria");

    const error = document.getElementById("errorCategoria");


    modal.style.display = "none";

    nombre.value = "";

    descripcion.value = "";

    error.innerHTML = "";
}


// GUARDAR CATEGORÍA
function guardarCategoria() {

    const nombre = document.getElementById("nombreCategoria").value.trim();

    const estado = document.getElementById("estadoCategoria").value;

    const descripcion = document.getElementById("descripcionCategoria").value.trim();

    const error = document.getElementById("errorCategoria");


    // VALIDAR CAMPOS
    if (
        nombre === "" ||
        descripcion === ""
    ) {

        error.innerHTML = "⚠️ Completa todos los campos";

        return;
    }


    // LIMPIAR ERROR
    error.innerHTML = "";


    // TABLA
    const tbody = document.querySelector(".table-categorias tbody");


    // CREAR FILA
    const fila = document.createElement("tr");


    // CLASE ESTADO
    let claseEstado = "";

    if (estado === "Activo") {

        claseEstado = "estado-activo";

    } else {

        claseEstado = "estado-inactivo";
    }


    // CONTENIDO FILA
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

                <button class="btn-editar"
                    onclick="cambiarEstado(this)">
                    Editar
                </button>

                <button class="btn-eliminar"
                    onclick="eliminarCategoria(this)">
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
function eliminarCategoria(boton) {

    const fila = boton.closest("tr");

    fila.remove();
}


// CAMBIAR ESTADO
function cambiarEstado(boton) {

    const estado = boton.closest("tr").querySelector("span");


    if (estado.innerText === "Activo") {

        estado.innerText = "Inactivo";

        estado.classList.remove("estado-activo");

        estado.classList.add("estado-inactivo");

    } else {

        estado.innerText = "Activo";

        estado.classList.remove("estado-inactivo");

        estado.classList.add("estado-activo");
    }
}


// BUSCADOR
const buscador = document.querySelector(".search-categoria");

buscador.addEventListener("keyup", function () {

    const texto = this.value.toLowerCase();

    const filas = document.querySelectorAll(".table-categorias tbody tr");


    filas.forEach(fila => {

        const nombreCategoria =
            fila.cells[0].textContent.toLowerCase();


        if (nombreCategoria.includes(texto)) {

            fila.style.display = "";

        } else {

            fila.style.display = "none";
        }
    });

});


// CERRAR MODAL 
window.onclick = function(event) {

    const modal = document.getElementById("modalCategoria");

    if (event.target === modal) {

        cerrarModal();
    }
}