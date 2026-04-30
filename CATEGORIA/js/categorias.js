console.log("JS Categorías conectado");

function abrirModal() {
    document.getElementById("modalCategoria").style.display = "block";
}

function cerrarModal() {

    const modal = document.getElementById("modalCategoria");
    const input = document.getElementById("nombreCategoria");
    const error = document.getElementById("errorCategoria");

    modal.style.display = "none";

    input.value = "";

    error.textContent = "";
}

function guardarCategoria() {

    const nombre = document.getElementById("nombreCategoria").value.trim();

    const estado = document.getElementById("estadoCategoria").value;

    const error = document.getElementById("errorCategoria");

    if (nombre === "") {

        error.textContent = "⚠️ Debes ingresar una categoría";

        return;
    }

    error.textContent = "";

    const tabla = document.querySelector("#tablaCategorias tbody");

    const nuevaFila = tabla.insertRow();

    const id = tabla.rows.length;

    const fechaActual = new Date().toISOString().split('T')[0];

    nuevaFila.insertCell(0).innerText = id;
    nuevaFila.insertCell(1).innerText = nombre;
    nuevaFila.insertCell(2).innerText = estado;
    nuevaFila.insertCell(3).innerText = fechaActual;

    const celdaAcciones = nuevaFila.insertCell(4);

    celdaAcciones.innerHTML = `
        <button onclick="cambiarEstado(this)">🔄</button>
        <button onclick="eliminarCategoria(this)">❌</button>
    `;

    cerrarModal();
}

function eliminarCategoria(boton) {

    const fila = boton.parentElement.parentElement;

    fila.remove();
}

function cambiarEstado(boton) {

    const celdaEstado = boton.parentElement.parentElement.cells[2];

    if (celdaEstado.innerText === "Activo") {

        celdaEstado.innerText = "Inactivo";

    } else {

        celdaEstado.innerText = "Activo";
    }
}