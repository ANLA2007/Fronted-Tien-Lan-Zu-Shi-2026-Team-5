import { obtenerMovimientos, crearAjusteInventario } from "../SERVICES/movimientoInventario.service.js";
import { obtenerPorciones } from "../../PLATILLO/SERVICES/porcion.service.js";

const tablaBody        = document.querySelector(".custom-table tbody");
const paginacionInfo   = document.querySelector(".pagination-info");
const paginacionCtrls  = document.querySelector(".pagination-controls");

const searchInput      = document.getElementById("searchProduct");
const fromDateInput    = document.getElementById("fromDate");
const toDateInput      = document.getElementById("toDate");
const btnFiltrar       = document.querySelector(".btn-filtrar");
const btnExportar      = document.getElementById("btnExportarExcel");
const btnRegistrar     = document.querySelector(".btn-registrar");

const modalAjuste      = document.getElementById("modalAjuste");
const closeModalBtn    = document.getElementById("closeModal");
const formAjuste       = document.getElementById("formAjuste");

const buscadorPlatillo    = document.getElementById("buscadorPlatillo");
const listaPlatillos      = document.getElementById("listaPlatillos");
const inputCantidad       = document.getElementById("inputCantidad");
const inputFecha          = document.getElementById("inputFecha");
const inputMotivo         = document.getElementById("inputMotivo");
const inputJustificacion  = document.getElementById("inputJustificacion");

let paginaActual            = 1;
const TAMANIO_PAG           = 10;
let porcionesCache          = [];
let platilloIdSeleccionado  = null;

function mostrarMensajeModal(texto, tipo = "error") {
    let banner = formAjuste.querySelector("#modalMensaje");

    if (!banner) {
        banner = document.createElement("div");
        banner.id = "modalMensaje";
        banner.style.padding       = "12px 16px";
        banner.style.borderRadius  = "8px";
        banner.style.fontSize      = "13px";
        banner.style.fontWeight    = "600";
        banner.style.marginBottom  = "18px";
        banner.style.fontFamily    = "'Segoe UI', Arial, sans-serif";
        formAjuste.insertBefore(banner, formAjuste.firstChild);
    }

    banner.textContent      = texto;
    banner.style.display    = "block";
    banner.style.background = tipo === "error" ? "#fef2f2" : "#e6fdf4";
    banner.style.color      = tipo === "error" ? "#ef4444" : "#10b981";
}

function limpiarMensajeModal() {
    const banner = formAjuste.querySelector("#modalMensaje");
    if (banner) banner.style.display = "none";
}

async function cargarPorciones() {
    try {
        const respuesta = await obtenerPorciones(1, 100);
        porcionesCache  = respuesta.data ?? [];
    } catch (err) {
        console.error("Error cargando porciones:", err);
        porcionesCache = [];
    }
}

function getNombrePlatillo(portionId) {
    const porcion = porcionesCache.find(p => String(p.id) === String(portionId));
    return porcion ? porcion.portionName : `Platillo #${portionId}`;
}

function renderizarListaPlatillos(filtro = "") {
    const texto      = filtro.trim().toLowerCase();
    const filtradas  = porcionesCache.filter(p =>
        p.portionName.toLowerCase().includes(texto)
    );

    listaPlatillos.innerHTML = "";

    if (filtradas.length === 0) {
        listaPlatillos.innerHTML = `<li class="disabled">Sin resultados</li>`;
        return;
    }

    filtradas.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.portionName;
        li.addEventListener("click", () => {
            buscadorPlatillo.value     = p.portionName;
            platilloIdSeleccionado     = p.id;
            listaPlatillos.innerHTML   = "";
        });
        listaPlatillos.appendChild(li);
    });
}

buscadorPlatillo.addEventListener("input", () => {
    platilloIdSeleccionado = null;
    renderizarListaPlatillos(buscadorPlatillo.value);
});

buscadorPlatillo.addEventListener("focus", () => {
    renderizarListaPlatillos(buscadorPlatillo.value);
});

document.addEventListener("click", (e) => {
    if (!buscadorPlatillo.contains(e.target) && !listaPlatillos.contains(e.target)) {
        listaPlatillos.innerHTML = "";
    }
});

async function cargarMovimientos(pagina = 1) {
    try {
        const respuesta     = await obtenerMovimientos(pagina, TAMANIO_PAG);
        const movimientos   = respuesta.data ?? [];
        const totalRecords  = respuesta.meta?.totalRecords ?? 0;
        const totalPages    = respuesta.meta?.totalPages   ?? 1;

        paginaActual = pagina;
        renderizarTabla(movimientos);
        renderizarPaginacion(totalRecords, totalPages);

    } catch (err) {
        console.error("Error cargando movimientos:", err);
        tablaBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;padding:50px;color:#aaa;font-size:15px;">
                    No se pudieron cargar los movimientos.
                </td>
            </tr>`;
        renderizarPaginacion(0, 1);
    }
}

function renderizarTabla(movimientos) {
    tablaBody.innerHTML = "";

    if (movimientos.length === 0) {
        tablaBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;padding:50px;color:#aaa;font-size:15px;">
                    No hay movimientos registrados.
                </td>
            </tr>`;
        return;
    }

    movimientos.forEach((mov) => {
        const fecha  = mov.movementDate ? mov.movementDate.split("T")[0] : "-";
        const nombre = mov.portionName || getNombrePlatillo(mov.portionId);
        const tipo   = mov.movementType || "Ajuste";

        let badgeClass = "badge-ajuste";
        const tipoLower = tipo.toLowerCase();
        if (tipoLower === "entrada") badgeClass = "badge-entrada";
        if (tipoLower === "salida")  badgeClass = "badge-salida";

        const tr = document.createElement("tr");
        tr.dataset.fecha = fecha;

        tr.innerHTML = `
            <td>${nombre}</td>
            <td><span class="badge ${badgeClass}">${tipo}</span></td>
            <td>${mov.quantity ?? 0}</td>
            <td>${mov.previousDailyStock ?? 0}</td>
            <td>${mov.newDailyStock ?? 0}</td>
            <td>${mov.previousAccumulatedStock ?? 0}</td>
            <td>${mov.newAccumulatedStock ?? 0}</td>
            <td>${mov.justification ?? "-"}</td>
            <td><span class="fecha-tag">${fecha}</span></td>
        `;
        tablaBody.appendChild(tr);
    });
}

function renderizarPaginacion(totalRecords, totalPages) {
    const desde = totalRecords === 0 ? 0 : (paginaActual - 1) * TAMANIO_PAG + 1;
    const hasta = Math.min(paginaActual * TAMANIO_PAG, totalRecords);

    paginacionInfo.textContent = `Mostrando ${desde} - ${hasta} de ${totalRecords} registros`;
    paginacionCtrls.innerHTML  = "";

    const btnPrev = document.createElement("button");
    btnPrev.textContent = "‹";
    btnPrev.disabled    = paginaActual === 1;
    btnPrev.addEventListener("click", () => cargarMovimientos(paginaActual - 1));
    paginacionCtrls.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("active");
        btn.addEventListener("click", () => cargarMovimientos(i));
        paginacionCtrls.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.textContent = "›";
    btnNext.disabled    = paginaActual === totalPages;
    btnNext.addEventListener("click", () => cargarMovimientos(paginaActual + 1));
    paginacionCtrls.appendChild(btnNext);
}

searchInput.addEventListener("keyup", function () {
    const texto = this.value.toLowerCase();
    tablaBody.querySelectorAll("tr").forEach(fila => {
        fila.style.display = fila.textContent.toLowerCase().includes(texto) ? "" : "none";
    });
});

btnFiltrar.addEventListener("click", () => {
    const desde = fromDateInput.value;
    const hasta = toDateInput.value;

    tablaBody.querySelectorAll("tr").forEach(fila => {
        const fecha = fila.dataset.fecha;
        if (!fecha) return;

        let mostrar = true;
        if (desde && fecha < desde) mostrar = false;
        if (hasta && fecha > hasta) mostrar = false;
        fila.style.display = mostrar ? "" : "none";
    });
});

btnExportar.addEventListener("click", () => {
    const headers = [
        "Porcion", "Tipo de Movimiento", "Cantidad",
        "Stock Diario Previo", "Nuevo Stock Diario",
        "Stock Acumulado Previo", "Nuevo Stock Acumulado",
        "Justificacion", "Fecha Movimiento"
    ];
    const csv = [headers.join(",")];

    tablaBody.querySelectorAll("tr").forEach(fila => {
        const celdas = fila.querySelectorAll("td");
        if (celdas.length < headers.length) return;

        const row = Array.from(celdas).map(c =>
            `"${c.textContent.trim().replace(/"/g, '""')}"`
        );
        csv.push(row.join(","));
    });

    const blob = new Blob(["\ufeff" + csv.join("\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "MovimientosInventario_TienLan.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

function abrirModalAjuste() {
    formAjuste.reset();
    buscadorPlatillo.value     = "";
    platilloIdSeleccionado     = null;
    listaPlatillos.innerHTML   = "";
    limpiarMensajeModal();

    const hoy  = new Date();
    const yyyy = hoy.getFullYear();
    const mm   = String(hoy.getMonth() + 1).padStart(2, "0");
    const dd   = String(hoy.getDate()).padStart(2, "0");
    inputFecha.value = `${yyyy}-${mm}-${dd}`;

    modalAjuste.style.display = "flex";
}

function cerrarModalAjuste() {
    modalAjuste.style.display = "none";
}

btnRegistrar.addEventListener("click", abrirModalAjuste);
closeModalBtn.addEventListener("click", cerrarModalAjuste);
modalAjuste.addEventListener("click", (e) => {
    if (e.target === modalAjuste) cerrarModalAjuste();
});

formAjuste.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!platilloIdSeleccionado) {
        mostrarMensajeModal("Selecciona un platillo de la lista.", "error");
        return;
    }

    const cantidad = parseInt(inputCantidad.value);
    if (isNaN(cantidad)) {
        mostrarMensajeModal("Ingresa una cantidad válida.", "error");
        return;
    }

    const payload = {
        portionId:      parseInt(platilloIdSeleccionado),
        movementType:   inputMotivo.value.trim(),
        quantity:       cantidad,
        justification:  inputJustificacion.value.trim(),
    };

    try {
        await crearAjusteInventario(payload);
        mostrarMensajeModal("Ajuste registrado correctamente.", "exito");
        cargarMovimientos(paginaActual);
        setTimeout(() => {
            cerrarModalAjuste();
        }, 1200);
    } catch (err) {
        console.error("Error registrando el ajuste:", err);
        mostrarMensajeModal("No se pudo registrar el ajuste: " + err.message, "error");
    }
});

async function iniciar() {
    await cargarPorciones();
    await cargarMovimientos();
}
iniciar();