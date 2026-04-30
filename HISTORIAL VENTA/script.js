function buscar() {
    let input = document.getElementById("buscador").value.toLowerCase().trim();
    let filas = document.querySelectorAll("#tablaVentas tbody tr");

    filas.forEach(fila => {
        let cliente = fila.children[2].innerText.toLowerCase();

        if (cliente.includes(input)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none";
        }
    });
}

function filtrar() {
    let desde = document.getElementById("fromDate").value;
    let hasta = document.getElementById("toDate").value;

    let filas = document.querySelectorAll("#tablaVentas tbody tr");

    filas.forEach(fila => {
        let fechaTexto = fila.children[1].innerText.trim();
        let fechaFila = new Date(fechaTexto);

        let mostrar = true;

        if (desde && fechaFila < new Date(desde)) {
            mostrar = false;
        }

        if (hasta && fechaFila > new Date(hasta)) {
            mostrar = false;
        }

        fila.style.display = mostrar ? "" : "none";
    });
}

// NUEVA VENTA
let total = 0;

function agregarSeleccionados() {
    let select = document.getElementById("menuSelect");
    let opciones = select.selectedOptions;

    for (let opcion of opciones) {
        let [nombre, precio] = opcion.value.split("|");

        agregarProducto(nombre, parseFloat(precio));
    }

    // Limpiar selección para no duplicar
    select.selectedIndex = -1;
}

function agregarProducto(nombre, precio) {
    let tabla = document.getElementById("detalle");

    let fila = document.createElement("tr");

    fila.innerHTML = `
        <td>${nombre}</td>
        <td><input type="number" value="1" min="1" onchange="calcular()"></td>
        <td>${precio}</td>
        <td class="subtotal">${precio}</td>
    `;

    tabla.appendChild(fila);
    calcular();
}

function calcular() {
    total = 0;

    document.querySelectorAll("#detalle tr").forEach(fila => {
        let cantidad = fila.children[1].children[0].value;
        let precio = fila.children[2].innerText;

        let subtotal = cantidad * precio;
        fila.children[3].innerText = subtotal;

        total += subtotal;
    });

    document.getElementById("total").innerText = total.toFixed(2);
}

function calcular() {
    total = 0;

    document.querySelectorAll("#detalle tr").forEach(fila => {
        let cantidad = fila.children[1].children[0].value;
        let precio = fila.children[2].innerText;

        let subtotal = cantidad * precio;
        fila.children[3].innerText = subtotal;

        total += subtotal;
    });

    document.getElementById("total").innerText = total;
}