import { obtenerInventarios, crearInventario } from "../SERVICES/inventario.service.js";
import { obtenerPorciones } from "../../PLATILLO/SERVICES/porcion.service.js";

const tablaBody        = document.getElementById("tablaInventario");
const paginacionInfo   = document.querySelector(".pagination-info");
const paginacionCtrls  = document.querySelector(".pagination-controls");
const modalOverlay     = document.getElementById("modalOverlay");
const modalContent     = document.querySelector(".modal-content");
const selectPlatillo   = document.getElementById("platilloSelect");
const platilloTrigger  = selectPlatillo.querySelector(".custom-select-trigger");
const platilloValor    = selectPlatillo.querySelector(".custom-select-value");
const platilloOpciones = selectPlatillo.querySelector(".custom-select-options");
const inputFecha       = document.getElementById("inputFecha");
const inputStock       = document.getElementById("inputStock");
const inputPrecio      = document.getElementById("inputPrecio");
const modalError       = document.getElementById("modalError");
const buscador         = document.getElementById("buscador");
const modalTitle       = document.querySelector(".modal-header h2");
const btnGuardar       = document.getElementById("btnGuardar");


const editModal    = document.getElementById("editModal");
const cancelEdit   = document.getElementById("cancelEdit");
const deleteModal  = document.getElementById("deleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");

let paginaActual  = 1;
const TAMANIO_PAG = 10;
let modoEdicion   = false;
let idEdicion     = null;
let porcionesCache = [];
let platilloIdSeleccionado = "";


async function cargarPorciones() {
    try {
        const respuesta = await obtenerPorciones(1, 100);
        porcionesCache  = respuesta.data ?? [];

        platilloOpciones.innerHTML = "";
        porcionesCache.forEach(p => {
            const li = document.createElement("li");
            li.dataset.value = p.id;
            li.textContent   = p.portionName;
            li.addEventListener("click", () => {
                seleccionarPlatillo(p.id, p.portionName);
                cerrarDropdownPlatillo();
            });
            platilloOpciones.appendChild(li);
        });

        setPlaceholderPlatillo("Selecciona un platillo");
    } catch (err) {
        platilloOpciones.innerHTML = `<li class="disabled">Error cargando platillos</li>`;
        setPlaceholderPlatillo("Error cargando platillos");
        console.error("Error cargando porciones:", err);
    }
}

function setPlaceholderPlatillo(texto) {
    platilloValor.textContent = texto;
    platilloValor.classList.add("placeholder");
}

function seleccionarPlatillo(id, nombre) {
    platilloIdSeleccionado = id ? String(id) : "";

    if (!platilloIdSeleccionado) {
        setPlaceholderPlatillo("Selecciona un platillo");
    } else {
        platilloValor.textContent = nombre;
        platilloValor.classList.remove("placeholder");
    }

    platilloOpciones.querySelectorAll("li").forEach(li => {
        li.classList.toggle("selected", li.dataset.value === platilloIdSeleccionado);
    });
}

function cerrarDropdownPlatillo() {
    selectPlatillo.classList.remove("abierto");
}

platilloTrigger.addEventListener("click", () => {
    selectPlatillo.classList.toggle("abierto");
});

document.addEventListener("click", (e) => {
    if (!selectPlatillo.contains(e.target)) cerrarDropdownPlatillo();
});

function getNombrePlatillo(portionId, portionName) {
    if (portionName && !portionName.startsWith("Platillo #")) return portionName;
    const porcion = porcionesCache.find(p => p.id === portionId);
    return porcion ? porcion.portionName : `Platillo #${portionId}`;
}


async function cargarInventario(pagina = 1) {
    try {
        const respuesta    = await obtenerInventarios(pagina, TAMANIO_PAG);
        const inventarios  = respuesta.data ?? [];
        const totalRecords = respuesta.meta?.totalRecords ?? 0;
        const totalPages   = respuesta.meta?.totalPages   ?? 1;

        paginaActual        = pagina;
        tablaBody.innerHTML = "";

        if (inventarios.length === 0) {
            tablaBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;padding:50px;color:#aaa;font-size:15px;">
                        No hay registros de inventario.
                    </td>
                </tr>`;
            renderizarPaginacion(0, 1);
            return;
        }

        inventarios.forEach((inv) => {
            const fecha  = inv.date ? inv.date.split("T")[0] : "-";
            const nombre = getNombrePlatillo(inv.portionId, inv.portionName);

            const tr = document.createElement("tr");
            tr.dataset.id        = inv.id;
            tr.dataset.portionId = inv.portionId;
            tr.dataset.fecha     = fecha;
            tr.dataset.stock     = inv.dailyStock ?? 0;
            tr.dataset.precio    = inv.salePrice  ?? 0;
            tr.dataset.nombre    = nombre;

            tr.innerHTML = `
                <td>
                    <div class="platillo-cell">
                        <div class="platillo-icono"><i class="fa-solid fa-utensils"></i></div>
                        <span class="platillo-nombre">${nombre}</span>
                    </div>
                </td>
                <td><span class="fecha-tag">${fecha}</span></td>
                <td><span class="badge-acumulado">${inv.accumulatedStock ?? 0}</span></td>
                <td><span class="badge-diario">${inv.dailyStock ?? 0}</span></td>
                <td><span class="precio-tag">C$ ${(inv.salePrice ?? 0).toFixed(2)}</span></td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-accion editar" title="Editar">
                            <img src="../../../../ASSETS/img/editar.png" alt="Editar">
                        </button>
                        <button class="btn-accion eliminar" title="Eliminar">
                            <img src="../../../../ASSETS/img/borrar.png" alt="Eliminar">
                        </button>
                    </div>
                </td>
            `;
            tablaBody.appendChild(tr);
        });

        renderizarPaginacion(totalRecords, totalPages);

    } catch (err) {
        console.error("Error cargando inventario:", err);
    }
}


function renderizarPaginacion(totalRecords, totalPages) {
    const desde = totalRecords === 0 ? 0 : (paginaActual - 1) * TAMANIO_PAG + 1;
    const hasta = Math.min(paginaActual * TAMANIO_PAG, totalRecords);

    paginacionInfo.textContent = `Mostrando ${desde} - ${hasta} de ${totalRecords} registros`;
    paginacionCtrls.innerHTML  = "";

    const btnPrev = document.createElement("button");
    btnPrev.textContent = "‹";
    btnPrev.disabled    = paginaActual === 1;
    btnPrev.addEventListener("click", () => cargarInventario(paginaActual - 1));
    paginacionCtrls.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("active");
        btn.addEventListener("click", () => cargarInventario(i));
        paginacionCtrls.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.textContent = "›";
    btnNext.disabled    = paginaActual === totalPages;
    btnNext.addEventListener("click", () => cargarInventario(paginaActual + 1));
    paginacionCtrls.appendChild(btnNext);
}

function abrirModal(modo = "nuevo", datos = null) {
    limpiarModal();
    modoEdicion = modo === "editar";
    idEdicion   = modoEdicion ? datos.id : null;
    modalTitle.textContent = modoEdicion ? "Editar Inventario" : "Agregar Inventario";
    btnGuardar.querySelector("span") && (btnGuardar.querySelector("span").textContent = modoEdicion ? "Actualizar" : "Guardar");
    if (modoEdicion && datos) {
        seleccionarPlatillo(datos.portionId, getNombrePlatillo(datos.portionId, null));
        inputFecha.value  = datos.fecha;
        inputStock.value  = datos.stock;
        inputPrecio.value = datos.precio;
    } else {
        const hoy  = new Date();
        const yyyy = hoy.getFullYear();
        const mm   = String(hoy.getMonth() + 1).padStart(2, "0");
        const dd   = String(hoy.getDate()).padStart(2, "0");
        inputFecha.value = `${yyyy}-${mm}-${dd}`;
    }
    
    
    modalOverlay.classList.add("modal-open");
    setTimeout(() => modalContent.classList.add("activo"), 10);
}

function cerrarModal() {
    cerrarDropdownPlatillo();
    modalContent.classList.remove("activo");
    setTimeout(() => {
        modalOverlay.classList.remove("modal-open");
        limpiarModal();
    }, 300);
}

function limpiarModal() {
    seleccionarPlatillo("", "");
    inputFecha.value       = "";
    inputStock.value       = "";
    inputPrecio.value      = "";
    modalError.classList.remove("visible");
    modalError.textContent = "";
    modoEdicion            = false;
    idEdicion              = null;
    if (modalTitle) modalTitle.textContent = "Agregar Inventario";
}

function mostrarError(msg) {
    modalError.textContent = "⚠️ " + msg;
    modalError.classList.add("visible");
}

btnGuardar.addEventListener("click", async () => {
    const portionId  = parseInt(platilloIdSeleccionado);
    const fecha      = inputFecha.value;
    const dailyStock = parseInt(inputStock.value);
    const salePrice  = parseFloat(inputPrecio.value);

    if (!portionId)                          return mostrarError("Selecciona un platillo.");
    if (!fecha)                              return mostrarError("Ingresa una fecha.");
    if (isNaN(dailyStock) || dailyStock < 0) return mostrarError("Ingresa un stock válido.");
    if (isNaN(salePrice)  || salePrice  < 0) return mostrarError("Ingresa un precio válido.");

    const payload = { portionId, date: fecha, dailyStock, salePrice };

    try {
        await crearInventario(payload);
        cerrarModal();
        cargarInventario(paginaActual);
    } catch (err) {
        mostrarError(err.message);
    }
});


tablaBody.addEventListener("click", (e) => {
    if (e.target.closest(".btn-accion.editar")) {
        editModal.classList.add("modal-open");
    }
    if (e.target.closest(".btn-accion.eliminar")) {
        deleteModal.classList.add("modal-open");
    }
});


cancelEdit.addEventListener("click", () => editModal.classList.remove("modal-open"));
editModal.addEventListener("click", (e) => {
    if (e.target === editModal) editModal.classList.remove("modal-open");
});


cancelDelete.addEventListener("click", () => deleteModal.classList.remove("modal-open"));
confirmDelete.addEventListener("click", () => deleteModal.classList.remove("modal-open"));
deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) deleteModal.classList.remove("modal-open");
});


document.getElementById("btnExportarExcel").addEventListener("click", () => {
    const headers = ["Platillo", "Fecha", "Stock Acumulado", "Stock Diario", "Precio Venta"];
    const csv = [headers.join(",")];

    tablaBody.querySelectorAll("tr").forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length < 5) return;
        const row = [
            celdas[0].textContent.trim(),
            celdas[1].textContent.trim(),
            celdas[2].textContent.trim(),
            celdas[3].textContent.trim(),
            celdas[4].textContent.trim(),
        ].map(v => `"${v.replace(/"/g, '""')}"`);
        csv.push(row.join(","));
    });

    const blob = new Blob(["\ufeff" + csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "Inventario_TienLan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

buscador.addEventListener("keyup", function () {
    const texto = this.value.toLowerCase();
    tablaBody.querySelectorAll("tr").forEach(fila => {
        fila.style.display = fila.textContent.toLowerCase().includes(texto) ? "" : "none";
    });
});

document.getElementById("btnFiltrar").addEventListener("click", () => {
    const desde = document.getElementById("fromDate").value;
    const hasta = document.getElementById("toDate").value;

    tablaBody.querySelectorAll("tr").forEach(fila => {
        const fechaTag = fila.querySelector(".fecha-tag");
        if (!fechaTag) return;
        const fecha = fechaTag.textContent.trim();
        let mostrar = true;
        if (desde && fecha < desde) mostrar = false;
        if (hasta  && fecha > hasta) mostrar = false;
        fila.style.display = mostrar ? "" : "none";
    });
});


document.getElementById("openModal").addEventListener("click", () => abrirModal("nuevo"));
document.getElementById("closeModal").addEventListener("click", cerrarModal);
modalOverlay.addEventListener("click", e => { if (e.target === modalOverlay) cerrarModal(); });


async function iniciar() {
    await cargarPorciones();
    await cargarInventario();
}
iniciar();