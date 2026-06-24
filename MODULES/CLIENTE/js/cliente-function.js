import {
    obtenerClientes,
    crearCliente,
    actualizarCliente,
    cambiarEstadoCliente,
    buscarClientePorNombre
} from "../SERVICES/cliente.service.js";

const modal            = document.getElementById("modalCliente");
const nombreInput      = document.getElementById("nombreCliente");
const apellidoInput    = document.getElementById("apellidoCliente");
const correoInput      = document.getElementById("correoCliente");
const estadoInput      = document.getElementById("estadoCliente");
const errorDiv         = document.getElementById("errorCliente");
const tbody            = document.querySelector(".table-cliente tbody");
const buscador         = document.querySelector(".search-clientes");
const paginacionInfo   = document.querySelector(".pagination-info");
const paginacionCtrls  = document.querySelector(".pagination-controls");

let clienteEditando = null;
let paginaActual      = 1;
const TAMANIO_PAG     = 10;


async function cargarClientes(pagina = 1) {
    try {
        const respuesta = await obtenerClientes(pagina, TAMANIO_PAG);

     
        const clientes   = respuesta.data ?? [];
        const totalRecords = respuesta.meta?.totalRecords ?? 0;
        const totalPages   = respuesta.meta?.totalPages ?? 1;

        paginaActual = pagina;

        tbody.innerHTML = "";
        clientes.forEach(cliente => {
            const activo      = cliente.state === true;
            const estadoTexto = activo ? "Activo" : "Inactivo";
            const claseEstado = activo ? "estado-activo" : "estado-inactivo";

            const tr = document.createElement("tr");
            tr.dataset.id = cliente.id;
            tr.innerHTML = `
                <td>${cliente.firstName}</td>
                <td>${cliente.lastName}</td>
                <td>${cliente.email}</td>
                <td><span class="${claseEstado}">${estadoTexto}</span></td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-accion editar">
                            <img src="../../../../ASSETS/img/editar.png" alt="Editar">
                        </button>
                        <button class="btn-accion eliminar">
                            <img src="../../../../ASSETS/img/borrar.png" alt="Eliminar">
                        </button>
                    </div>
                </td>
            `;

            tr.querySelector(".editar").addEventListener("click",   () => editarCliente(tr));
            tr.querySelector(".eliminar").addEventListener("click", () => eliminarCliente(tr.dataset.id));

            tbody.appendChild(tr);
        });

        renderizarPaginacion(totalRecords, totalPages);

    } catch (err) {
        console.error("Error cargando clientes:", err);
    }
}


function renderizarPaginacion(totalRecords, totalPages) {
    const desde = totalRecords === 0 ? 0 : (paginaActual - 1) * TAMANIO_PAG + 1;
    const hasta = Math.min(paginaActual * TAMANIO_PAG, totalRecords);

    paginacionInfo.textContent = `Mostrando ${desde} - ${hasta} de ${totalRecords} registros`;

    paginacionCtrls.innerHTML = "";

    const btnPrev = document.createElement("button");
    btnPrev.textContent = "‹";
    btnPrev.disabled = paginaActual === 1;
    btnPrev.addEventListener("click", () => cargarClientes(paginaActual - 1));
    paginacionCtrls.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("active");
        btn.addEventListener("click", () => cargarClientes(i));
        paginacionCtrls.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.textContent = "›";
    btnNext.disabled = paginaActual === totalPages;
    btnNext.addEventListener("click", () => cargarClientes(paginaActual + 1));
    paginacionCtrls.appendChild(btnNext);
}


function abrirModal() {
    limpiarCampos();
    clienteEditando = null;
    modal.style.display = "flex";
}

function cerrarModal() {
    limpiarCampos();
    clienteEditando = null;
    modal.style.display = "none";
}

function limpiarCampos() {
    nombreInput.value   = "";
    apellidoInput.value = "";
    correoInput.value   = "";
    estadoInput.value   = "Activo";
    errorDiv.innerHTML  = "";
}


function editarCliente(fila) {
    clienteEditando     = fila;
    nombreInput.value   = fila.cells[0].textContent.trim();
    apellidoInput.value = fila.cells[1].textContent.trim();
    correoInput.value   = fila.cells[2].textContent.trim();
    estadoInput.value   = fila.cells[3].querySelector("span").textContent.trim();
    modal.style.display = "flex";
}


async function eliminarCliente(id) {
    try {
        await cambiarEstadoCliente(id);
        cargarClientes(paginaActual);
    } catch (err) {
        console.error("Error:", err);
    }
}


async function guardarCliente() {
    const nombre   = nombreInput.value.trim();
    const estado   = estadoInput.value;
    const apellido = apellidoInput.value.trim();
    const correo   = correoInput.value.trim();

    const cliente = {
        FirstName: nombre,
        LastName:  apellido,
        Email:     correo,
        State:     estado === "Activo"
    };

    try {
        if (clienteEditando) {
            await actualizarCliente(clienteEditando.dataset.id, cliente);
        } else {
            await crearCliente(cliente);
        }
        cerrarModal();
        cargarClientes(paginaActual);
    } catch (err) {
        errorDiv.innerHTML = err.message;
    }
}

let debounceTimer = null;

buscador.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const texto = buscador.value.trim();

    if (!texto) {
        cargarClientes(paginaActual);
        return;
    }

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        try {
            const cat         = await buscarClientePorNombre(texto);
            const activo      = cat.state === true;
            const estadoTexto = activo ? "Activo" : "Inactivo";
            const claseEstado = activo ? "estado-activo" : "estado-inactivo";
            tbody.innerHTML   = "";
            const tr = document.createElement("tr");
            tr.dataset.id = cat.id;
            tr.innerHTML = `
                <td>${cat.firstName}</td>
                <td>${cat.lastName}</td>
                <td>${cat.email}</td>
                <td><span class="${claseEstado}">${estadoTexto}</span></td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-accion editar">
                            <img src="../../../../ASSETS/img/editar.png" alt="Editar">
                        </button>
                        <button class="btn-accion eliminar">
                            <img src="../../../../ASSETS/img/borrar.png" alt="Eliminar">
                        </button>
                    </div>
                </td>
            `;
            tr.querySelector(".editar").addEventListener("click",   () => editarCliente(tr));
            tr.querySelector(".eliminar").addEventListener("click", () => eliminarCliente(tr.dataset.id));
            tbody.appendChild(tr);
            paginacionInfo.textContent = `Mostrando 1 resultado(s)`;
            paginacionCtrls.innerHTML  = "";
        } catch (err) {
            tbody.innerHTML            = `<tr><td colspan="5" style="text-align:center; color:red;">${err.message}</td></tr>`;
            paginacionInfo.textContent = "";
            paginacionCtrls.innerHTML  = "";
        }
    }, 300);
});

document.getElementById("btnNuevoCliente").addEventListener("click", abrirModal);
document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
document.getElementById("btnGuardar").addEventListener("click", guardarCliente);
document.getElementById("btnCancelar").addEventListener("click", cerrarModal);

modal.addEventListener("click", e => {
    if (e.target === modal) cerrarModal();
});

cargarClientes();