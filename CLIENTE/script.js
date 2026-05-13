console.log("JS conectado");

function abrirModal(){

    const modal = document.getElementById("modalCliente");

    modal.classList.add("modal-open");
}

function cerrarModal(){

    const modal = document.getElementById("modalCliente");

    modal.classList.remove("modal-open");

    document.getElementById("nombreCliente").value = "";

    document.getElementById("apellidoCliente").value = "";

    document.getElementById("telefonoCliente").value = "";

    document.getElementById("direccionCliente").value = "";

    const error = document.getElementById("errorCliente");

    error.style.display = "none";

    error.innerHTML = "";
}

function guardarCliente(){

    const nombre = document.getElementById("nombreCliente").value.trim();

    const apellido = document.getElementById("apellidoCliente").value.trim();

    const telefono = document.getElementById("telefonoCliente").value.trim();

    const direccion = document.getElementById("direccionCliente").value.trim();

    const error = document.getElementById("errorCliente");

    if(nombre === "" || apellido === "" || telefono === "" || direccion === ""){

        error.style.display = "block";

        error.innerHTML = "⚠️ Debes completar todos los campos";

        return;
    }

    error.style.display = "none";

    error.innerHTML = "";

    const tbody = document.querySelector(".table-clientes tbody");

    const fila = document.createElement("tr");

    fila.innerHTML = `

        <td>${nombre} ${apellido}</td>

        <td>${telefono}</td>

        <td>${direccion}</td>

        <td>
            <span class="estado-activo">
                Activo
            </span>
        </td>

        <td>

            <div class="acciones-tabla">

                <button class="btn-editar">
                    Editar
                </button>

                <button class="btn-eliminar"
                        onclick="eliminarCliente(this)">
                    Eliminar
                </button>

            </div>

        </td>
    `;

    tbody.appendChild(fila);

    cerrarModal();
}

function eliminarCliente(boton){

    const fila = boton.closest("tr");

    fila.remove();
}

const buscador = document.querySelector(".search-cliente");

buscador.addEventListener("keyup", function(){

    const texto = this.value.toLowerCase();

    const filas = document.querySelectorAll(".table-clientes tbody tr");

    filas.forEach(fila => {

        const contenido = fila.textContent.toLowerCase();

        if(contenido.includes(texto)){

            fila.style.display = "";

        }else{

            fila.style.display = "none";
        }
    });
});

window.onclick = function(event){

    const modal = document.getElementById("modalCliente");

    if(event.target === modal){

        cerrarModal();
    }
}