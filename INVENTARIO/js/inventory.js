document.addEventListener('DOMContentLoaded', () => {

    const openModal = document.getElementById('openModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.querySelector('.modal-content');
    const inventoryForm = document.getElementById('inventoryForm');
    const tableBody = document.querySelector('.orders-table tbody');
    const btnExportarExcel = document.getElementById('btnExportarExcel');

    openModal.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('modal-open');

        setTimeout(() => {
            modalContent.classList.add('activo');
        }, 10);
    });

    closeModal.addEventListener('click', () => {
        modalContent.classList.remove('activo');

        setTimeout(() => {
            modalOverlay.classList.remove('modal-open');
        }, 300);
    });


    // Lógica para Guardar Inventario (Nuevo)
    inventoryForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Evitar recarga de página

        // Obtener valores
        const platillo = document.getElementById('platilloSelect').value;
        const fecha = document.getElementById('inputFecha').value;
        const stock = document.getElementById('inputStock').value;
        const precio = document.getElementById('inputPrecio').value;
        const imgInput = document.getElementById('imgInput');
        
        let imgSrc = ''; // Por defecto vacío

        // Procesar imagen si se subió una
        if (imgInput.files && imgInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imgSrc = e.target.result;
                agregarFila(fecha, platillo, stock, precio, imgSrc);
            }
            reader.readAsDataURL(imgInput.files[0]);
        } else {
            agregarFila(fecha, platillo, stock, precio, '');
        }
    });

     function agregarFila(fecha, platillo, stock, precio, imagen) {
        // Crear nueva fila
        const tr = document.createElement('tr');
        
        // Imagen
        const tdImg = document.createElement('td');
        const img = document.createElement('img');
        img.src = imagen ? imagen : ''; // Si no hay imagen, src vacío
        img.className = 'product-img-placeholder';
        img.alt = '';
          if (!imagen) {
            img.onerror = function() {
                this.src = ''; // Deja vacío si no hay imagen
            };
        }
        tdImg.appendChild(img);
        tr.appendChild(tdImg);

        
       
        // Platillo
        const tdPlatillo = document.createElement('td');
        tdPlatillo.textContent = platillo;
        tr.appendChild(tdPlatillo);

        // Fecha
        const tdFecha = document.createElement('td');
        tdFecha.textContent = fecha;
        tr.appendChild(tdFecha);

        // Stock Diario
        const tdStock = document.createElement('td');
        tdStock.textContent = stock;
        tr.appendChild(tdStock);

        // Stock Acumulado (Simulado por ahora, igual al diario)
        //  if (!imagen) {
       //     img.onerror = function() {
       //         this.src = ''; // Deja vacío si no hay imagen
      //      };
     //   }

          // Precio
        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = precio;
        tr.appendChild(tdPrecio);

        // Accion
        const tdAccion = document.createElement('td');
        tdAccion.innerHTML = '<div class="acciones-tabla"><button class="btn-accion editar"><img src="img/editar.png"></button><button class="btn-accion eliminar"><img src="img/borrar.png"></button></div>';
        tr.appendChild(tdAccion);

        // Insertar al inicio de la tabla
        tableBody.insertBefore(tr, tableBody.firstChild);

        // Cerrar Modal
        modalContent.classList.remove('activo');
        setTimeout(() => {
            modalOverlay.classList.remove('modal-open');
            inventoryForm.reset();
        }, 300);
    }

 // Lógica para Exportar a Excel (CSV)
    document.getElementById('btnExportarExcel').addEventListener('click', function() {
    let table = document.querySelector(".orders-table");
    let rows = table.querySelectorAll("tr");
    let csv = [];

    // Recorrer las filas
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");
        
        // Recorrer las columnas (col.length - 1 para excluir la columna de "Acciones")
        for (let j = 0; j < cols.length - 1; j++) {
            let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, ""); // Quitar saltos de línea
            row.push('"' + data + '"'); // Encerrar en comillas para evitar errores con comas
        }
        csv.push(row.join(","));
    }

    // Crear archivo y descargar
    let csvString = "\ufeff" + csv.join("\n"); // \ufeff es para que Excel lea tildes y ñ bien
    let blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    let link = document.createElement("a");
    
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Inventario_TienLan.csv");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

//fin del excel
    
    const buscador = document.getElementById("buscador");

    buscador.addEventListener("keyup", function () {
        let filtro = this.value.toLowerCase();
        let filas = document.querySelectorAll(".orders-table tbody tr");

        filas.forEach(fila => {
            let texto = fila.innerText.toLowerCase();
            fila.style.display = texto.includes(filtro) ? "" : "none";
        });
    });

});



function filtrar() {
    let desde = document.getElementById("fromDate").value;
    let hasta = document.getElementById("toDate").value;

    let filas = document.querySelectorAll(".orders-table tbody tr");

    filas.forEach(fila => {
        let fechaTexto = fila.children[0].innerText.trim();
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