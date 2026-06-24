import {
    obtenerUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarEstadoUsuario,
    asignarRol,
    buscarUsuarioPorNombre
} from "../SERVICES/usuario.service.js"

import { obtenerRoles } from "../../ROLES/SERVICES/roles.service.js";

const modal           = document.getElementById("modalUsuario");
const modalRol        = document.getElementById("modalRol");
const nombreInput     = document.getElementById("nombreUsuario");
const correoInput     = document.getElementById("correoUsuario");
const passwordInput   = document.getElementById("passwordUsuario");
const estadoInput     = document.getElementById("estadoUsuario");
const errorDiv        = document.getElementById("errorUsuario");
const errorRolDiv     = document.getElementById("errorRol");
const selectRol       = document.getElementById("selectRol");
const tbody           = document.querySelector(".table-usuarios tbody");
const buscador        = document.querySelector(".search-usuarios");
const paginacionInfo  = document.querySelector(".pagination-info");
const paginacionCtrls = document.querySelector(".pagination-controls");

let usuarioEditando = null;
let usuarioRolId    = null;
let paginaActual    = 1;
const TAMANIO_PAG   = 10;


async function cargarUsuarios(pagina = 1) {
    try {
        const respuesta = await obtenerUsuarios(pagina, TAMANIO_PAG);

        const usuarios     = respuesta.data ?? [];
        const totalRecords = respuesta.meta?.totalRecords ?? 0;
        const totalPages   = respuesta.meta?.totalPages ?? 1;

        paginaActual = pagina;

        tbody.innerHTML = "";
        usuarios.forEach(usuario => {
            const activo      = usuario.state === true;
            const estadoTexto = activo ? "Activo" : "Inactivo";
            const claseEstado = activo ? "estado-activo" : "estado-inactivo";

            const tr = document.createElement("tr");
            tr.dataset.id = usuario.id;
            tr.innerHTML = `
                <td>${usuario.userName}</td>
                <td>${usuario.email}</td>
                <td><span class="${claseEstado}">${estadoTexto}</span></td>
                <td>
                    <div class="acciones-tabla">
                        <button class="btn-accion editar">
                            <img src="../../../../ASSETS/img/editar.png" alt="Editar">
                        </button>
                        <button class="btn-accion eliminar">
                            <img src="../../../../ASSETS/img/borrar.png" alt="Eliminar">
                        </button>
                        <button class="btn-accion asignar-rol" title="Asignar Rol">
                            <img src="../../../../ASSETS/img/rol.png" alt="Asignar Rol">
                        </button>
                    </div>
                </td>
            `;

            tr.querySelector(".editar").addEventListener("click",      () => editarUsuario(tr));
            tr.querySelector(".eliminar").addEventListener("click",    () => eliminarUsuario(tr.dataset.id));
            tr.querySelector(".asignar-rol").addEventListener("click", () => abrirModalRol(tr.dataset.id));

            tbody.appendChild(tr);
        });

        renderizarPaginacion(totalRecords, totalPages);

    } catch (err) {
        console.error("Error cargando usuarios:", err);
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
    btnPrev.addEventListener("click", () => cargarUsuarios(paginaActual - 1));
    paginacionCtrls.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("active");
        btn.addEventListener("click", () => cargarUsuarios(i));
        paginacionCtrls.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.textContent = "›";
    btnNext.disabled = paginaActual === totalPages;
    btnNext.addEventListener("click", () => cargarUsuarios(paginaActual + 1));
    paginacionCtrls.appendChild(btnNext);
}


function abrirModal() {
    limpiarCampos();
    usuarioEditando = null;
    document.querySelector("#modalUsuario h3").textContent = "Nuevo Usuario";
    modal.style.display = "flex";
}

function cerrarModal() {
    limpiarCampos();
    usuarioEditando = null;
    modal.style.display = "none";
}

function limpiarCampos() {
    nombreInput.value   = "";
    correoInput.value   = "";
    passwordInput.value = "";
    estadoInput.value   = "Activo";
    errorDiv.innerHTML  = "";
}


async function abrirModalRol(userId) {
    usuarioRolId = userId;
    errorRolDiv.innerHTML = "";
    selectRol.innerHTML = "<option value=''>Seleccione un rol...</option>";

    try {
        const respuesta = await obtenerRoles(1, 100);
        const roles = respuesta.data ?? [];
        roles.forEach(rol => {
            const option = document.createElement("option");
            option.value = rol.id;
            option.textContent = rol.roleName;
            selectRol.appendChild(option);
        });
    } catch (err) {
        console.error("Error cargando roles:", err);
    }

    modalRol.style.display = "flex";
}

function cerrarModalRol() {
    usuarioRolId = null;
    errorRolDiv.innerHTML = "";
    modalRol.style.display = "none";
}

async function guardarRol() {
    const roleId = selectRol.value;

    if (!roleId) {
        errorRolDiv.innerHTML = "⚠️ Seleccione un rol";
        return;
    }

    try {
        await asignarRol(usuarioRolId, roleId);
        cerrarModalRol();
    } catch (err) {
        errorRolDiv.innerHTML = "⚠️ " + err.message;
    }
}


function editarUsuario(fila) {
    usuarioEditando     = fila;
    nombreInput.value   = fila.cells[0].textContent.trim();
    correoInput.value   = fila.cells[1].textContent.trim();
    passwordInput.value = "";
    estadoInput.value   = fila.cells[2].querySelector("span").textContent.trim();
    document.querySelector("#modalUsuario h3").textContent = "Editar Usuario";
    modal.style.display = "flex";
}


async function eliminarUsuario(id) {
    try {
        const fila = tbody.querySelector(`tr[data-id="${id}"]`);
        const activo = fila.cells[2].querySelector("span").textContent.trim() === "Activo";
        await cambiarEstadoUsuario(id, !activo);
        cargarUsuarios(paginaActual);
    } catch (err) {
        console.error("Error:", err);
    }
}


async function guardarUsuario() {
    const nombre   = nombreInput.value.trim();
    const correo   = correoInput.value.trim();
    const password = passwordInput.value.trim();
    const estado   = estadoInput.value;

    const usuario = {
        userName: nombre,
        email:    correo,
        state:    estado === "Activo"
    };

    if (password) usuario.passwordHash = password;

    try {
        if (usuarioEditando) {
            await actualizarUsuario(usuarioEditando.dataset.id, usuario);
        } else {
            await crearUsuario(usuario);
        }
        cerrarModal();
        cargarUsuarios(paginaActual);
    } catch (err) {
        errorDiv.innerHTML = err.message;
    }
}

let debounceTimer = null;

buscador.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const texto = buscador.value.trim();

    if (!texto) {
        cargarUsuarios(paginaActual);
        return;
    }

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        try {
            const usr         = await buscarUsuarioPorNombre(texto);
            const activo      = usr.state === true;
            const estadoTexto = activo ? "Activo" : "Inactivo";
            const claseEstado = activo ? "estado-activo" : "estado-inactivo";

            tbody.innerHTML = "";

            const tr = document.createElement("tr");
            tr.dataset.id = usr.id;
            tr.innerHTML = `
                <td>${usr.userName}</td>
                <td>${usr.email}</td>
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
            tr.querySelector(".editar").addEventListener("click",   () => editarUsuario(tr));
            tr.querySelector(".eliminar").addEventListener("click", () => eliminarUsuario(tr.dataset.id));
            tbody.appendChild(tr);

            paginacionInfo.textContent = `Mostrando 1 resultado(s)`;
            paginacionCtrls.innerHTML  = "";

        } catch (err) {
            tbody.innerHTML            = `<tr><td colspan="4" style="text-align:center; color:red;">${err.message}</td></tr>`;
            paginacionInfo.textContent = "";
            paginacionCtrls.innerHTML  = "";
        }
    }, 300);
});

document.getElementById("btnNuevoUsuario").addEventListener("click", abrirModal);
document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
document.getElementById("btnGuardar").addEventListener("click", guardarUsuario);
document.getElementById("btnCancelar").addEventListener("click", cerrarModal);
document.getElementById("btnCerrarModalRol").addEventListener("click", cerrarModalRol);
document.getElementById("btnGuardarRol").addEventListener("click", guardarRol);
document.getElementById("btnCancelarRol").addEventListener("click", cerrarModalRol);

modal.addEventListener("click", e => {
    if (e.target === modal) cerrarModal();
});

modalRol.addEventListener("click", e => {
    if (e.target === modalRol) cerrarModalRol();
});


cargarUsuarios();