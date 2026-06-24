import {
    obtenerRoles,
    crearRol,
    actualizarRol,
    cambiarEstadoRol,
    buscarRolPorNombre
} from "../SERVICES/roles.service.js";

const modal           = document.getElementById("modalRoles");
const nombreInput     = document.getElementById("nombreRol");
const estadoInput     = document.getElementById("estadoRol");
const errorDiv        = document.getElementById("errorRol");
const tbody           = document.querySelector(".table-usuarios tbody");
const buscador        = document.querySelector(".search-usuarios");
const paginacionInfo  = document.querySelector(".pagination-info");
const paginacionCtrls = document.querySelector(".pagination-controls");

let rolEditando   = null;
let paginaActual  = 1;
const TAMANIO_PAG = 10;


async function cargarRoles(pagina = 1) {
    try {
        const respuesta = await obtenerRoles(pagina, TAMANIO_PAG);

        const roles        = respuesta.data ?? [];
        const totalRecords = respuesta.meta?.totalRecords ?? 0;
        const totalPages   = respuesta.meta?.totalPages ?? 1;

        paginaActual = pagina;

        tbody.innerHTML = "";
        roles.forEach(rol => {
            const activo      = rol.state === true;
            const estadoTexto = activo ? "Activo" : "Inactivo";
            const claseEstado = activo ? "estado-activo" : "estado-inactivo";

            const tr = document.createElement("tr");
            tr.dataset.id = rol.id;
            tr.innerHTML = `
                <td>${rol.roleName}</td>
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

            tr.querySelector(".editar").addEventListener("click",   () => editarRol(tr));
            tr.querySelector(".eliminar").addEventListener("click", () => eliminarRol(tr.dataset.id));

            tbody.appendChild(tr);
        });

        renderizarPaginacion(totalRecords, totalPages);

    } catch (err) {
        console.error("Error cargando roles:", err);
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
    btnPrev.addEventListener("click", () => cargarRoles(paginaActual - 1));
    paginacionCtrls.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("active");
        btn.addEventListener("click", () => cargarRoles(i));
        paginacionCtrls.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.textContent = "›";
    btnNext.disabled = paginaActual === totalPages;
    btnNext.addEventListener("click", () => cargarRoles(paginaActual + 1));
    paginacionCtrls.appendChild(btnNext);
}

function abrirModal() {
    limpiarCampos();
    rolEditando = null;
    modal.style.display = "flex";
}

function cerrarModal() {
    limpiarCampos();
    rolEditando = null;
    modal.style.display = "none";
}

function limpiarCampos() {
    nombreInput.value  = "";
    estadoInput.value  = "Activo";
    errorDiv.innerHTML = "";
}


function editarRol(fila) {
    rolEditando         = fila;
    nombreInput.value   = fila.cells[0].textContent.trim();
    estadoInput.value   = fila.cells[1].querySelector("span").textContent.trim();
    modal.style.display = "flex";
}


async function eliminarRol(id) {
    try {
        await cambiarEstadoRol(id);
        cargarRoles(paginaActual);
    } catch (err) {
        console.error("Error:", err);
    }
}


async function guardarRol() {
    const nombre = nombreInput.value.trim();
    const estado = estadoInput.value;

    const rol = {
        roleName: nombre,
        state:    estado === "Activo"
    };

    try {
        if (rolEditando) {
            await actualizarRol(rolEditando.dataset.id, rol);
        } else {
            await crearRol(rol);
        }
        cerrarModal();
        cargarRoles(paginaActual);
    } catch (err) {
        errorDiv.innerHTML = err.message;
    }
}

let debounceTimer = null;

buscador.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const texto = buscador.value.trim();

    if (!texto) {
        cargarRoles(paginaActual);
        return;
    }

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        try {
            const rol         = await buscarRolPorNombre(texto);
            const activo      = rol.state === true;
            const estadoTexto = activo ? "Activo" : "Inactivo";
            const claseEstado = activo ? "estado-activo" : "estado-inactivo";

            tbody.innerHTML = "";

            const tr = document.createElement("tr");
            tr.dataset.id = rol.id;
            tr.innerHTML = `
                <td>${rol.roleName}</td>
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
            tr.querySelector(".editar").addEventListener("click",   () => editarRol(tr));
            tr.querySelector(".eliminar").addEventListener("click", () => eliminarRol(tr.dataset.id));
            tbody.appendChild(tr);

            paginacionInfo.textContent = `Mostrando 1 resultado(s)`;
            paginacionCtrls.innerHTML  = "";

        } catch (err) {
            tbody.innerHTML            = `<tr><td colspan="3" style="text-align:center; color:red;">${err.message}</td></tr>`;
            paginacionInfo.textContent = "";
            paginacionCtrls.innerHTML  = "";
        }
    }, 300);
});

document.getElementById("btnNuevoRol").addEventListener("click", abrirModal);
document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
document.getElementById("btnGuardar").addEventListener("click", guardarRol);
document.getElementById("btnCancelar").addEventListener("click", cerrarModal);

modal.addEventListener("click", e => {
    if (e.target === modal) cerrarModal();
});


cargarRoles();