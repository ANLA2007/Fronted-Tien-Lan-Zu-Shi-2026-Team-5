import { obtenerPorciones }   from "../../PLATILLO/SERVICES/porcion.service.js";
import { obtenerClientes }    from "../../CLIENTE/SERVICES/cliente.service.js";
import { obtenerVentas, obtenerVentaPorId, crearVenta, obtenerVentasPorFecha,marcarFacturaImpresa } from "../SERVICES/venta.service.js";
import { obtenerInventarios } from "../../INVENTARIO/SERVICES/inventario.service.js";

const openVentaModalBtn  = document.getElementById("openVentaModalBtn");
const closeVentaModal    = document.getElementById("closeVentaModal");
const ventaModal         = document.getElementById("ventaModal");
const btnCancelarVenta   = document.getElementById("btnCancelarVenta");
const btnGenerarFactura  = document.getElementById("btnGenerarFactura");

const facturaModal       = document.getElementById("facturaModal");
const closeFacturaModal  = document.getElementById("closeFacturaModal");
const btnCerrarFactura   = document.getElementById("btnCerrarFactura");
const btnImprimirFactura = document.getElementById("btnImprimirFactura");

const verVentaModal      = document.getElementById("verVentaModal");
const closeVerVentaModal = document.getElementById("closeVerVentaModal");
const btnCerrarVerVenta  = document.getElementById("btnCerrarVerVenta");

const clienteSearchInput = document.getElementById("clienteSearchInput");
const portionSearchInput = document.getElementById("portionSearchInput");
const portionQuantity    = document.getElementById("portionQuantity");
const btnAddToCart       = document.getElementById("btnAddToCart");
const portionPrice       = document.getElementById("portionPrice");
const portionType        = document.getElementById("portionType"); 

const cartBody       = document.getElementById("cartBody");
const salesTableBody = document.getElementById("salesTable");
const cartTotal      = document.getElementById("cartTotal");

const facturaNumero    = document.getElementById("facturaNumero");
const facturaDateTag   = document.getElementById("facturaDateTag");
const facturaCliente   = document.getElementById("facturaCliente");
const facturaTableBody = document.getElementById("facturaTableBody");
const facturaTotalNeto = document.getElementById("facturaTotalNeto");

const verCliente      = document.getElementById("verCliente");
const verFecha        = document.getElementById("verFecha");
const verVentaDetalle = document.getElementById("verVentaDetalle");
const verVentaTotal   = document.getElementById("verVentaTotal");

const paginacionInfo  = document.querySelector(".pagination-info");
const paginacionCtrls = document.querySelector(".pagination-controls");
const searchInput     = document.getElementById("searchInput");
const fromDate        = document.getElementById("fromDate");
const toDate          = document.getElementById("toDate");
const paymentFilter   = document.getElementById("paymentFilter");
const btnFiltrar      = document.getElementById("btnFiltrar");

const mvError = document.getElementById("mvError");

function mostrarError(mensaje) {
    if (!mvError) return;
    mvError.textContent = mensaje;
    mvError.classList.add("visible");
}
function ocultarError() {
    if (!mvError) return;
    mvError.textContent = "";
    mvError.classList.remove("visible");
}


let porcionesCache      = [];
let inventariosCache    = [];
let clientesDisponibles = [];
let porcionSeleccionada = null;
let clienteSeleccionado = null;
let carrito             = [];
let paginaActual        = 1;
const TAMANIO_PAG       = 10;
let ventasCache         = [];


function getNombrePorcion(portionId, portionName) {
    if (portionName && !String(portionName).startsWith("Platillo #")) return portionName;
    const porcion = porcionesCache.find(p => p.id === portionId);
    return porcion ? porcion.portionName : (portionName ?? `#${portionId}`);
}

function nombreCompletoCliente(c) {
    if (!c) return "";
    if (c.fullName) return c.fullName;
    const nombre   = c.name ?? c.nombre ?? c.firstName ?? "";
    const apellido = c.lastName ?? c.apellido ?? "";
    return `${nombre} ${apellido}`.trim();
}

function getNombreCliente(customerId, customerName) {
    if (customerName && !String(customerName).startsWith("Cliente #")) return customerName;
    const cliente = clientesDisponibles.find(c => c.id === customerId);
    return cliente ? nombreCompletoCliente(cliente) : (customerName ?? "-");
}


function getSalePriceDePorcion(portionId) {
    const registros = inventariosCache.filter(i => i.portionId === portionId);
    if (registros.length === 0) return null;
    registros.sort((a, b) => new Date(b.date) - new Date(a.date));
    return registros[0].salePrice ?? null;
}


async function cargarDatosBase() {
    try {
        const resPorciones = await obtenerPorciones(1, 100);
        porcionesCache = resPorciones.data ?? [];
        crearSugerenciasPorciones();
    } catch (err) { console.error(err); }

    try {
        const resClientes   = await obtenerClientes(1, 100);
        clientesDisponibles = resClientes.data ?? [];
        crearSugerenciasClientes();
    } catch (err) { console.error(err); }

    try {
        const resInv = await obtenerInventarios(1, 1000);
        inventariosCache = resInv.data ?? [];
    } catch (err) { console.error(err); }
}


function crearSugerenciasPorciones() {
    let dl = document.getElementById("porcionesList");
    if (!dl) {
        dl = document.createElement("datalist");
        dl.id = "porcionesList";
        portionSearchInput.setAttribute("list", "porcionesList");
        portionSearchInput.parentElement.appendChild(dl);
    }
    dl.innerHTML = "";
    porcionesCache.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.portionName;
        dl.appendChild(opt);
    });
}

function crearSugerenciasClientes() {
    let dl = document.getElementById("clientesList");
    if (!dl) {
        dl = document.createElement("datalist");
        dl.id = "clientesList";
        clienteSearchInput.setAttribute("list", "clientesList");
        clienteSearchInput.parentElement.appendChild(dl);
    }
    dl.innerHTML = "";
    clientesDisponibles.forEach(c => {
        const opt = document.createElement("option");
        opt.value = nombreCompletoCliente(c);
        dl.appendChild(opt);
    });
}

clienteSearchInput.addEventListener("input", () => {
    const valor = clienteSearchInput.value.trim().toLowerCase();
    clienteSeleccionado = clientesDisponibles.find(
        c => nombreCompletoCliente(c).toLowerCase() === valor
    ) ?? null;
});


portionSearchInput.addEventListener("input", () => {
    const valor = portionSearchInput.value.trim().toLowerCase();
    porcionSeleccionada = porcionesCache.find(
        p => (p.portionName ?? "").toLowerCase() === valor
    ) ?? null;

    if (porcionSeleccionada) {
        const precio = getSalePriceDePorcion(porcionSeleccionada.id);
        porcionSeleccionada.salePrice = precio ?? 0;
        if (portionPrice) portionPrice.value = precio !== null ? precio.toFixed(2) : "";
    } else {
        if (portionPrice) portionPrice.value = "";
    }
});


btnAddToCart.addEventListener("click", () => {
    ocultarError();

    const cantidad = parseInt(portionQuantity.value);
    const precio   = parseFloat(portionPrice?.value ?? "0");
    const tipo     = portionType?.value ?? ""; 

    if (!porcionSeleccionada) {
        mostrarError("Selecciona una porción válida.");
        return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
        mostrarError("Ingresa una cantidad válida.");
        return;
    }


    const existe = carrito.find(
        item => item.portionId === porcionSeleccionada.id && item.portionType === tipo
    );
    if (existe) {
        existe.quantity += cantidad;
    } else {
        carrito.push({
            portionId:   porcionSeleccionada.id,
            portionName: porcionSeleccionada.portionName,
            portionType: tipo, 
            quantity:    cantidad,
            salePrice:   isNaN(precio) ? 0 : precio
        });
    }
    limpiarCamposAgregar();
    actualizarCarritoUI();
});

function limpiarCamposAgregar() {
    portionSearchInput.value = "";
    portionQuantity.value    = "1";
    porcionSeleccionada      = null;
    if (portionPrice) portionPrice.value = "";
    if (portionType)  portionType.value  = ""; 
    ocultarError();
}

function actualizarCarritoUI() {
    cartBody.innerHTML = "";

    if (carrito.length === 0) {
        cartBody.innerHTML = `
            <tr class="mv-empty-row">
                <td colspan="6">
                    <div class="mv-empty-state">
                        <i class="fa-solid fa-cart-shopping"></i>
                        <p>El carrito está vacío</p>
                    </div>
                </td>
            </tr>`;
        if (cartTotal) cartTotal.textContent = "C$0.00";
        return;
    }

    let total = 0;
    carrito.forEach((item, index) => {
        const lineTotal = (item.quantity ?? 0) * (item.salePrice ?? 0);
        total += lineTotal;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${item.portionName}</td>
            <td style="text-align:center;">${item.portionType || "-"}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">C$${(item.salePrice ?? 0).toFixed(2)}</td>
            <td style="text-align:right;">C$${lineTotal.toFixed(2)}</td>
            <td style="text-align:center;">
                <button type="button" class="btn-remove-item" data-index="${index}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>`;
        cartBody.appendChild(tr);
    });

    if (cartTotal) cartTotal.textContent = `C$${total.toFixed(2)}`;

    cartBody.querySelectorAll(".btn-remove-item").forEach(btn => {
        btn.addEventListener("click", () => {
            carrito.splice(parseInt(btn.dataset.index), 1);
            actualizarCarritoUI();
        });
    });
}


async function cargarHistorialVentas(pagina = 1) {
    try {
        const respuesta    = await obtenerVentas(pagina, TAMANIO_PAG);
        const ventas       = respuesta.data ?? [];
        const totalRecords = respuesta.meta?.totalRecords ?? 0;
        const totalPages   = respuesta.meta?.totalPages   ?? 1;

        paginaActual = pagina;

        ventasCache = ventas.map(v => ({
            ...v,
            customerName: getNombreCliente(v.customerId, v.customerName),
            details: (v.details ?? []).map(d => ({
                ...d,
                portionName: getNombrePorcion(d.portionId, d.portionName)
            }))
        }));

        renderizarTablaVentas(ventasCache);
        renderizarPaginacion(totalRecords, totalPages);
    } catch (err) {
        console.error(err);
    }
}

function renderizarTablaVentas(ventas) {
    salesTableBody.innerHTML = "";

    if (ventas.length === 0) {
        salesTableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:50px;color:#aaa;">
                    No hay ventas registradas.
                </td>
            </tr>`;
        return;
    }

    ventas.forEach(v => {
        const nombresPorciones = v.details?.map(d => d.portionName).join(", ") || "-";
        const tiposPorciones   = v.details?.map(d => d.portionType || "-").join(", ") || "-"; // NUEVO
        const totalCantidad    = v.details?.reduce((acc, d) => acc + (d.quantity ?? 0), 0) ?? 0;
        const fechaMostrar     = v.dateTime?.split("T")[0].split("-").reverse().join("-") ?? "-";

        const lineTotales = v.details?.map(d => {
            const lt = (d.quantity ?? 0) * (d.salePrice ?? 0);
            return `C$${lt.toFixed(2)}`;
        }).join(", ") || "-";

        const totalVenta = v.details?.reduce(
            (acc, d) => acc + (d.quantity ?? 0) * (d.salePrice ?? 0), 0
        ) ?? 0;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.customerName ?? "-"}</td>
            <td>${nombresPorciones}</td>
            <td>${tiposPorciones}</td>
            <td>${fechaMostrar}</td>
            <td>${totalCantidad}</td>
            <td>${lineTotales}</td>
            <td>C$${totalVenta.toFixed(2)}</td>
            <td>
                <div class="actions">
                    <button class="btn-view" data-id="${v.id}" title="Ver detalle">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button class="btn-print-venta" data-id="${v.id}" title="Imprimir factura">
                        <i class="fa-solid fa-print"></i>
                    </button>
                </div>
            </td>`;
        salesTableBody.appendChild(tr);
    });

    salesTableBody.querySelectorAll(".btn-view").forEach(btn => {
        btn.addEventListener("click", () => verVenta(btn.dataset.id));
    });

    salesTableBody.querySelectorAll(".btn-print-venta").forEach(btn => {
        btn.addEventListener("click", () => imprimirVentaDesdeTabla(btn.dataset.id));
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
    btnPrev.addEventListener("click", () => cargarHistorialVentas(paginaActual - 1));
    paginacionCtrls.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("active");
        btn.addEventListener("click", () => cargarHistorialVentas(i));
        paginacionCtrls.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.textContent = "›";
    btnNext.disabled    = paginaActual === totalPages;
    btnNext.addEventListener("click", () => cargarHistorialVentas(paginaActual + 1));
    paginacionCtrls.appendChild(btnNext);
}


async function verVenta(id) {
    try {
        let venta = ventasCache.find(v => String(v.id) === String(id));

        if (!venta || !venta.details || venta.details.length === 0) {
            const res = await obtenerVentaPorId(id);
            venta = res?.data ?? res;
            venta = {
                ...venta,
                customerName: getNombreCliente(venta.customerId, venta.customerName),
                details: (venta.details ?? []).map(d => ({
                    ...d,
                    portionName: getNombrePorcion(d.portionId, d.portionName)
                }))
            };
        }

        verCliente.value = venta.customerName ?? "-";
        verFecha.value   = venta.dateTime?.split("T")[0].split("-").reverse().join("-") ?? "-";

        verVentaDetalle.innerHTML = "";
        let subtotal = 0;
        (venta.details ?? []).forEach(d => {
            const lt = (d.quantity ?? 0) * (d.salePrice ?? 0);
            subtotal += lt;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${d.portionName ?? "-"}</td>
                <td style="text-align:center;">${d.portionType || "-"}</td>
                <td style="text-align:center;">${d.quantity ?? 0}</td>
                <td style="text-align:right;">C$${(d.salePrice ?? 0).toFixed(2)}</td>
                <td style="text-align:right;">C$${lt.toFixed(2)}</td>`;
            verVentaDetalle.appendChild(tr);
        });

        verVentaTotal.textContent = `C$${subtotal.toFixed(2)}`;
        verVentaModal.classList.add("modal-open");
    } catch (err) {
        console.error(err);
    }
}

closeVerVentaModal.addEventListener("click", () => verVentaModal.classList.remove("modal-open"));
btnCerrarVerVenta.addEventListener("click",  () => verVentaModal.classList.remove("modal-open"));
verVentaModal.addEventListener("click", e => {
    if (e.target === verVentaModal) verVentaModal.classList.remove("modal-open");
});


async function imprimirVentaDesdeTabla(id) {
    try {
        let venta = ventasCache.find(v => String(v.id) === String(id));

        if (!venta || !venta.details || venta.details.length === 0) {
            const res = await obtenerVentaPorId(id);
            venta = res?.data ?? res;
            venta = {
                ...venta,
                customerName: getNombreCliente(venta.customerId, venta.customerName),
                details: (venta.details ?? []).map(d => ({
                    ...d,
                    portionName: getNombrePorcion(d.portionId, d.portionName)
                }))
            };
        }

        const saleId = venta.id ?? "—";
        const fecha  = venta.dateTime
            ? venta.dateTime.split("T")[0].split("-").reverse().join("-")
            : (() => {
                const hoy = new Date();
                return `${String(hoy.getDate()).padStart(2,"0")}-${String(hoy.getMonth()+1).padStart(2,"0")}-${hoy.getFullYear()}`;
            })();

        facturaNumero.textContent  = `#${saleId}`;
        facturaDateTag.textContent = fecha;
        facturaCliente.textContent = venta.customerName || "-";

        facturaTableBody.innerHTML = "";
        let subtotal = 0;
        (venta.details ?? []).forEach(d => {
            const lt = (d.quantity ?? 0) * (d.salePrice ?? 0);
            subtotal += lt;
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${d.portionName ?? "-"}</td>
                <td style="text-align:center;">${d.portionType || "-"}</td>
                <td style="text-align:right;">${d.quantity ?? 0}</td>
                <td style="text-align:right;">C$${(d.salePrice ?? 0).toFixed(2)}</td>
                <td style="text-align:right;">C$${lt.toFixed(2)}</td>`;
            facturaTableBody.appendChild(tr);
        });

        facturaTotalNeto.textContent = `C$${subtotal.toFixed(2)}`;
        facturaModal.classList.add("modal-open");
    } catch (err) {
        console.error(err);
    }
}


btnGenerarFactura.addEventListener("click", async () => {
    ocultarError();
    if (carrito.length === 0) {
        mostrarError("Agrega al menos una porción al carrito.");
        return;
    }

    const payload = {
        customerId: clienteSeleccionado?.id ?? null,
        details: carrito.map(item => ({
            portionId:   item.portionId,
            quantity:    item.quantity,
            portionType: item.portionType  
        }))
    };

    let ventaGuardada = null;
    try {
        ventaGuardada = await crearVenta(payload);
    } catch (err) {
        mostrarError(err.message ?? "Error al guardar la venta.");
        return;
    }

    if (!ventaGuardada) return;

    const clienteParaFactura = clienteSeleccionado;

    carrito = [];
    clienteSeleccionado = null;
    clienteSearchInput.value = "";
    actualizarCarritoUI();
    ventaModal.classList.remove("modal-open");

    mostrarFactura(ventaGuardada, clienteParaFactura);
    facturaModal.classList.add("modal-open");

    await cargarHistorialVentas(1);
});


function mostrarFactura(ventaGuardada, clienteLocal) {
    const venta  = ventaGuardada?.data ?? ventaGuardada;
    const saleId = venta?.id ?? "—";
    const fecha  = new Date();
    const fechaFormateada = `${String(fecha.getDate()).padStart(2,"0")}-${String(fecha.getMonth()+1).padStart(2,"0")}-${fecha.getFullYear()}`;

    facturaNumero.textContent  = `#${saleId}`;
    facturaDateTag.textContent = fechaFormateada;
    facturaCliente.textContent = clienteLocal ? nombreCompletoCliente(clienteLocal) : "-";

    facturaTableBody.innerHTML = "";
    let subtotal = 0;
    (venta?.details ?? []).forEach(d => {
        const nombre = getNombrePorcion(d.portionId, d.portionName);
        const lt     = (d.quantity ?? 0) * (d.salePrice ?? 0);
        subtotal    += lt;
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${nombre}</td>
            <td style="text-align:center;">${d.portionType || "-"}</td>
            <td style="text-align:right;">${d.quantity ?? 0}</td>
            <td style="text-align:right;">C$${(d.salePrice ?? 0).toFixed(2)}</td>
            <td style="text-align:right;">C$${lt.toFixed(2)}</td>`;
        facturaTableBody.appendChild(tr);
    });

    facturaTotalNeto.textContent = `C$${subtotal.toFixed(2)}`;
}


openVentaModalBtn.addEventListener("click", () => {
    document.getElementById("ventaDate").value = new Date().toISOString().split("T")[0];
    carrito = [];
    clienteSeleccionado = null;
    clienteSearchInput.value = "";
    limpiarCamposAgregar();
    actualizarCarritoUI();
    ocultarError();
    ventaModal.classList.add("modal-open");
});

closeVentaModal.addEventListener("click",  () => ventaModal.classList.remove("modal-open"));
btnCancelarVenta.addEventListener("click", () => ventaModal.classList.remove("modal-open"));
ventaModal.addEventListener("click", e => {
    if (e.target === ventaModal) ventaModal.classList.remove("modal-open");
});

closeFacturaModal.addEventListener("click", () => facturaModal.classList.remove("modal-open"));
btnCerrarFactura.addEventListener("click",  () => facturaModal.classList.remove("modal-open"));
facturaModal.addEventListener("click", e => {
    if (e.target === facturaModal) facturaModal.classList.remove("modal-open");
});

btnImprimirFactura.addEventListener("click", async () => {
    try {
        await marcarFacturaImpresa();
    } catch (err) {
        console.error("No se pudo marcar como impresa:", err);
    }
    window.print();
});


searchInput.addEventListener("keyup", () => {
    const texto = searchInput.value.toLowerCase().trim();
    if (!texto) { renderizarTablaVentas(ventasCache); return; }
    renderizarTablaVentas(ventasCache.filter(v => {
        const cliente   = (v.customerName ?? "").toLowerCase();
        const porciones = (v.details?.map(d => d.portionName).join(", ") ?? "").toLowerCase();
        return cliente.includes(texto) || porciones.includes(texto);
    }));
});

btnFiltrar.addEventListener("click", async () => {
    const desde = fromDate.value;
    const hasta  = toDate.value;

    if (desde && hasta) {
        try {
            const res  = await obtenerVentasPorFecha(desde, hasta);
            const raw  = res.data ?? res ?? [];
            const lista = Array.isArray(raw) ? raw : (raw ? [raw] : []);

            const ventas = lista.map(v => ({
                ...v,
                customerName: getNombreCliente(v.customerId, v.customerName),
                details: (v.details ?? []).map(d => ({
                    ...d,
                    portionName: getNombrePorcion(d.portionId, d.portionName)
                }))
            }));

            if (ventas.length === 0) {
                salesTableBody.innerHTML = `
                    <tr>
                        <td colspan="7" style="text-align:center;padding:50px;color:#aaa;">
                            Sin resultados para ese rango de fechas.
                        </td>
                    </tr>`;
            } else {
                renderizarTablaVentas(ventas);
            }
        } catch (err) {
            console.error(err);
            salesTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;padding:50px;color:#aaa;">
                      ${err.message}
                    </td>
                </tr>`;
        }
    } else {
        renderizarTablaVentas(ventasCache);
    }
});


async function iniciar() {
    await cargarDatosBase();
    await cargarHistorialVentas();
}
iniciar();