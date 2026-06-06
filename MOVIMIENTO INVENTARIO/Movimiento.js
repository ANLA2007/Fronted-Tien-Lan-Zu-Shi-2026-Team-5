document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos
    const btnRegistrar = document.querySelector('.btn-registrar'); // El botón en tu HTML
    const modal = document.getElementById('modalAjuste');
    const form = document.getElementById('formAjuste');
    const buscador = document.getElementById('buscadorPlatillo');
    const lista = document.getElementById('listaPlatillos');

    const closeModal = document.getElementById('closeModal');

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const catalogoPlatillos = ["Arroz Cantones", "Tacos de Repollo", "Dumpling", "Sopa de Res", "Pollo Agridulce"];

    btnRegistrar.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 3. Buscador autocompletable
    buscador.addEventListener('input', () => {
        const busqueda = buscador.value.toLowerCase();
        lista.innerHTML = "";
        if (busqueda.length > 0) {
            const resultados = catalogoPlatillos.filter(p => p.toLowerCase().includes(busqueda));
            resultados.forEach(p => {
                let li = document.createElement('li');
                li.innerText = p;
                li.onclick = () => {
                    buscador.value = p;
                    lista.innerHTML = "";
                };
                lista.appendChild(li);
            });
        }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const platillo = buscador.value;
        const cantidad = document.getElementById('inputCantidad').value;
        const motivo = document.getElementById('inputMotivo').value;
        const tbody = document.querySelector('.custom-table tbody');
        const tdFecha = document.createElement('td');
        const fecha = document.getElementById('inputFecha').value;


        const nuevaFila = `
            <tr>
                <td><span class="badge badge-ajuste">AJUSTE</span></td>
                <td>Admin</td>
                <td>${platillo}</td>
                <td>${cantidad}</td>
                <td>-</td>
                <td>${cantidad}</td>
                <td>${motivo}</td>
                <td>${fecha}</td>
            </tr>`;
        
        tbody.insertAdjacentHTML('beforeend', nuevaFila);
        
        form.reset();
        modal.style.display = 'none';
    });
});
document.addEventListener('DOMContentLoaded', () => {

    const btnFiltrar = document.querySelector('.btn-filtrar');

    if(btnFiltrar) {
        btnFiltrar.addEventListener('click', aplicarFiltroFecha);
    }


const searchInput = document.getElementById('searchProduct');

searchInput.addEventListener('input', () => {
    const filtro = searchInput.value.toLowerCase();
    const filas = document.querySelectorAll('.custom-table tbody tr');

    filas.forEach(fila => {
        const nombreProducto = fila.children[2].innerText.toLowerCase();
        
        if (nombreProducto.includes(filtro)) {
            fila.style.display = "";
        } else {
            fila.style.display = "none"; 
        }
    });
});
});



function aplicarFiltroFecha() {
    const desde = document.getElementById('fromDate').value;
    const hasta = document.getElementById('toDate').value;
    const filas = document.querySelectorAll('.custom-table tbody tr');

    filas.forEach(fila => {
        let fechaTexto = fila.children[7]?.innerText.trim(); 
        
        if (!fechaTexto) {
            fila.style.display = "";
            return;
        }

        const fechaFila = parseInt(fechaTexto.replace(/-/g, ''));
        const fechaDesde = desde ? parseInt(desde.replace(/-/g, '')) : null;
        const fechaHasta = hasta ? parseInt(hasta.replace(/-/g, '')) : null;

        let mostrar = true;

        if (fechaDesde && fechaFila < fechaDesde) mostrar = false;
        if (fechaHasta && fechaFila > fechaHasta) mostrar = false;

        fila.style.display = mostrar ? "" : "none";
    });
}
document.getElementById('btnExportarExcel').addEventListener('click', function() {
    let table = document.querySelector(".custom-table");
    let rows = table.querySelectorAll("tr");
    let csv = [];

    // Recorrer todas las filas
    for (let i = 0; i < rows.length; i++) {
        let row = [], cols = rows[i].querySelectorAll("td, th");
        
        for (let j = 0; j < cols.length; j++) {
            // Limpiamos el texto y escapamos comillas dobles para que Excel no se confunda
            let data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, "").replace(/"/g, '""');
            row.push('"' + data + '"');
        }
        csv.push(row.join(","));
    }

    // Crear archivo y descargar
    let csvString = "\ufeff" + csv.join("\n");
    let blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    let link = document.createElement("a");
    
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Movimiento_Inventario_TienLan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});