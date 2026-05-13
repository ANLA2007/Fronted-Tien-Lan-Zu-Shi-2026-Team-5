console.log("JS Porcion conectado");


// ABRIR MODAL
function abrirModal() {

    const modal = document.getElementById("modalPorcion");

    modal.style.display = "flex";
}


// CERRAR MODAL
function cerrarModal() {

    const modal = document.getElementById("modalPorcion");

    const nombre = document.getElementById("nombrePlatillo");

    const categoria = document.getElementById("categoriaPlatillo");

    const precio = document.getElementById("precioPlatillo");

    const descripcion = document.getElementById("descripcionPlatillo");

    const error = document.getElementById("errorPlatillo");


    modal.style.display = "none";

    nombre.value = "";

    categoria.value = "";

    precio.value = "";

    descripcion.value = "";

    error.innerHTML = "";
}


// GUARDAR PLATILLO
function guardarPlatillo() {

    const nombre = document.getElementById("nombrePlatillo").value.trim();

    const categoria = document.getElementById("categoriaPlatillo").value.trim();

    const precio = document.getElementById("precioPlatillo").value.trim();

    const descripcion = document.getElementById("descripcionPlatillo").value.trim();

    const estado = document.getElementById("estadoPlatillo").value;

    const error = document.getElementById("errorPlatillo");


    // VALIDAR INPUTS
    if (
        nombre === "" ||
        categoria === "" ||
        precio === "" ||
        descripcion === ""
    ) {

        error.innerHTML = "⚠️ Completa todos los campos";

        return;
    }


    // LIMPIAR ERROR
    error.innerHTML = "";


    // OBTENER TABLA
    const tbody = document.querySelector(".table-porcion tbody");


    // CREAR FILA
    const fila = document.createElement("tr");


    // CONTENIDO
    fila.innerHTML = `

        <td>${nombre}</td>

        <td>${categoria}</td>

        <td>$${precio}</td>

        <td>${descripcion}</td>

        <td>
            <span class="${estado === 'Activo'
                ? 'estado-activo'
                : 'estado-inactivo'}">
                ${estado}
            </span>
        </td>

        <td>

            <div class="acciones-tabla">

                <button class="btn-editar">
                    Editar
                </button>

                <button class="btn-eliminar"
                    onclick="eliminarPlatillo(this)">
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
function eliminarPlatillo(boton) {

    const fila = boton.closest("tr");

    fila.remove();
}


// BUSCAR PLATILLO
const buscador = document.querySelector(".search-porcion");

buscador.addEventListener("keyup", function () {

    const texto = this.value.toLowerCase();

    const filas = document.querySelectorAll(".table-porcion tbody tr");


    filas.forEach(fila => {

        const nombrePlatillo =
            fila.cells[0].textContent.toLowerCase();


        if (nombrePlatillo.includes(texto)) {

            fila.style.display = "";

        } else {

            fila.style.display = "none";
        }
    });

});


// CERRAR MODAL
window.onclick = function(event) {

    const modal = document.getElementById("modalPorcion");

    if (event.target === modal) {

        cerrarModal();
    }
}