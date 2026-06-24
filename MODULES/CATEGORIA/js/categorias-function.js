import {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    cambiarEstadoCategoria,
     buscarCategoriaPorNombre
} from "../SERVICES/categoria.service.js";

const modal            = document.getElementById("modalCategoria");
const nombreInput      = document.getElementById("nombreCategoria");
const estadoInput      = document.getElementById("estadoCategoria");
const descripcionInput = document.getElementById("descripcionCategoria");
const errorDiv         = document.getElementById("errorCategoria");
const tbody            = document.querySelector(".table-categorias tbody");
const buscador         = document.querySelector(".search-categoria");
const paginacionInfo   = document.querySelector(".pagination-info");
const paginacionCtrls  = document.querySelector(".pagination-controls");

let categoriaEditando = null;
let paginaActual      = 1;
const TAMANIO_PAG     = 10;


async function cargarCategorias(pagina = 1) {
    try {
        const respuesta = await obtenerCategorias(pagina, TAMANIO_PAG);

       
        const categorias   = respuesta.data ?? [];
        const totalRecords = respuesta.meta?.totalRecords ?? 0;
        const totalPages   = respuesta.meta?.totalPages ?? 1;

        paginaActual = pagina;

        tbody.innerHTML = "";
        categorias.forEach(cat => {
            const activo      = cat.state === true;
            const estadoTexto = activo ? "Activo" : "Inactivo";
            const claseEstado = activo ? "estado-activo" : "estado-inactivo";

            const tr = document.createElement("tr");
            tr.dataset.id = cat.id;
            tr.innerHTML = `
                <td>${cat.categoryName ?? cat.name}</td>
                <td><span class="${claseEstado}">${estadoTexto}</span></td>
                <td>${cat.description}</td>
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

            tr.querySelector(".editar").addEventListener("click",   () => editarCategoria(tr));
            tr.querySelector(".eliminar").addEventListener("click", () => eliminarCategoria(tr.dataset.id));

            tbody.appendChild(tr);
        });

        renderizarPaginacion(totalRecords, totalPages);

    } catch (err) {
        console.error("Error cargando categorías:", err);
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
    btnPrev.addEventListener("click", () => cargarCategorias(paginaActual - 1));
    paginacionCtrls.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("active");
        btn.addEventListener("click", () => cargarCategorias(i));
        paginacionCtrls.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.textContent = "›";
    btnNext.disabled = paginaActual === totalPages;
    btnNext.addEventListener("click", () => cargarCategorias(paginaActual + 1));
    paginacionCtrls.appendChild(btnNext);
}


function abrirModal() {
    limpiarCampos();
    categoriaEditando = null;
    modal.style.display = "flex";
}

function cerrarModal() {
    limpiarCampos();
    categoriaEditando = null;
    modal.style.display = "none";
}

function limpiarCampos() {
    nombreInput.value       = "";
    estadoInput.value       = "Activo";
    descripcionInput.value  = "";
    errorDiv.innerHTML      = "";
}

function editarCategoria(fila) {
    categoriaEditando      = fila;
    nombreInput.value      = fila.cells[0].textContent.trim();
    estadoInput.value      = fila.cells[1].querySelector("span").textContent.trim();
    descripcionInput.value = fila.cells[2].textContent.trim();
    modal.style.display    = "flex";
}


async function eliminarCategoria(id) {
    try {
        await cambiarEstadoCategoria(id);
        cargarCategorias(paginaActual);
    } catch (err) {
        console.error("Error:", err);
    }
}


async function guardarCategoria() {
    const nombre      = nombreInput.value.trim();
    const estado      = estadoInput.value;
    const descripcion = descripcionInput.value.trim();
    const categoria = {
        categoryName: nombre,
        description:  descripcion,
        state:        estado === "Activo"
    };
    try {
        if (categoriaEditando) {
            await actualizarCategoria(categoriaEditando.dataset.id, categoria);
        } else {
            await crearCategoria(categoria);
        }
        cerrarModal();
        cargarCategorias(paginaActual);
    } catch (err) {
        errorDiv.innerHTML = err.message;
    }
}

let debounceTimer = null;

buscador.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;

    const texto = buscador.value.trim();

    if (!texto) {
        cargarCategorias(paginaActual);
        return;
    }

    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(async () => {
        try {
            const cat         = await buscarCategoriaPorNombre(texto);
            const activo      = cat.state === true;
            const estadoTexto = activo ? "Activo" : "Inactivo";
            const claseEstado = activo ? "estado-activo" : "estado-inactivo";
            tbody.innerHTML    = "";
            const tr = document.createElement("tr");
            tr.dataset.id = cat.id;
            tr.innerHTML = `
                <td>${cat.categoryName ?? cat.name}</td>
                <td><span class="${claseEstado}">${estadoTexto}</span></td>
                <td>${cat.description}</td>
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
            tr.querySelector(".editar").addEventListener("click",   () => editarCategoria(tr));
            tr.querySelector(".eliminar").addEventListener("click", () => eliminarCategoria(tr.dataset.id));
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

document.getElementById("btnNuevaCategoria").addEventListener("click", abrirModal);
document.getElementById("btnCerrarModal").addEventListener("click", cerrarModal);
document.getElementById("btnGuardar").addEventListener("click", guardarCategoria);
document.getElementById("btnCancelar").addEventListener("click", cerrarModal);

modal.addEventListener("click", e => {
    if (e.target === modal) cerrarModal();
});

cargarCategorias();