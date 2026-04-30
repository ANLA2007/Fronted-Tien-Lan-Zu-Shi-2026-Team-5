console.log("JS conectado");
function abrirModal() {
    document.getElementById("modalRol").style.display = "block";
}

function cerrarModal() {
    const modal = document.getElementById("modalRol");
    const input = document.getElementById("nombreRol");
    const error = document.getElementById("errorRol");

    modal.style.display = "none";
    input.value = "";
    input.classList.remove("input-error");
    error.textContent = "";
}

// Guarda cada rol
function guardarRol() {
    const nombre = document.getElementById("nombreRol").value.trim();
    const estado = document.getElementById("estadoRol").value;
    const input = document.getElementById("nombreRol");
    const error = document.getElementById("errorRol");

    if (nombre === "") {
        error.textContent = "⚠️ Debes ingresar un nombre para el rol";
        input.classList.add("input-error");
        return;
    }

    error.textContent = "";
    input.classList.remove("input-error");

    const tabla = document.querySelector("#tablaRoles tbody");
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
        <button onclick="eliminarRol(this)">❌</button>
    `;

    cerrarModal();
}

// Eliminar rol
function eliminarRol(boton) {
    const fila = boton.parentElement.parentElement;
    fila.remove();
}

// Cambiar estado
function cambiarEstado(boton) {
    const celdaEstado = boton.parentElement.parentElement.cells[2];

    if (celdaEstado.innerText === "Activo") {
        celdaEstado.innerText = "Inactivo";
    } else {
        celdaEstado.innerText = "Activo";
    }
}

// Quitar error mientras escribe
document.addEventListener("DOMContentLoaded", () => {
    const inputNombre = document.getElementById("nombreRol");

    inputNombre.addEventListener("input", () => {
        inputNombre.classList.remove("input-error");
        document.getElementById("errorRol").textContent = "";
    });
});