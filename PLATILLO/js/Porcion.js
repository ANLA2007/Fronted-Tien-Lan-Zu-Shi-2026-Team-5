console.log("JS Porcion conectado");

// Abrir modal
function abrirModal() {
    document.getElementById("modal").style.display = "block";
}

// Cerrar modal
function cerrarModal() {

    const modal = document.getElementById("modal");
    const error = document.getElementById("error");

    modal.style.display = "none";

    document.getElementById("nombre").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("precioporcion").value = "";
    document.getElementById("descripcion").value = "";

    error.textContent = "";
}

// Guardar Porcion
function guardar() {

    const nombre = document.getElementById("nombre").value.trim();
    const categoria = document.getElementById("categoria").value.trim();
    const precioporcion = document.getElementById("precioporcion").value.trim();
    const descripcion = document.getElementById("descripcion").value.trim();
    const estado = document.getElementById("estado").value;

    const error = document.getElementById("error");

// Validación
if (nombre === "" || categoria === "" || precioporcion === "" || descripcion === "") {

    error.textContent = "⚠️ Completa todos los campos";
    return;
}

    error.textContent = "";

    const tabla = document.querySelector("#tablaPlatillos tbody");
    const nuevaFila = tabla.insertRow();

    const id = tabla.rows.length;
    
    nuevaFila.insertCell(0).innerText = id;
    nuevaFila.insertCell(1).innerText = nombre;
    nuevaFila.insertCell(2).innerText = categoria;
    nuevaFila.insertCell(3).innerText = "$" + precioporcion;
    nuevaFila.insertCell(4).innerText = descripcion;
    nuevaFila.insertCell(5).innerText = estado;

    const acciones = nuevaFila.insertCell(5);

    acciones.innerHTML = `
        <button onclick="cambiarEstado(this)">🔄</button>
        <button onclick="eliminarPlatillo(this)">❌</button>
    `;

    cerrarModal();
}

// Eliminar platillo
function eliminarPlatillo(boton) {

    const fila = boton.parentElement.parentElement;
    fila.remove();
}

// Cambiar estado
function cambiarEstado(boton) {

    const celdaEstado = boton.parentElement.parentElement.cells[4];

    if (celdaEstado.innerText === "Activo") {
        celdaEstado.innerText = "Inactivo";
    } else {
        celdaEstado.innerText = "Activo";
    }
}

// Limpiar error mientras escribe
document.addEventListener("DOMContentLoaded", () => {

    const nombre = document.getElementById("nombre");
     const categoria = document.getElementById("categoria");
    const precioporcion = document.getElementById("precioporcion");
    const descripcion = document.getElementById("descripcion");

    function limpiarError() {

        document.getElementById("error").textContent = "";
    }

    nombre.addEventListener("input", limpiarError);
    precioporcion.addEventListener("input", limpiarError);
    descripcion.addEventListener("input", limpiarError);
});