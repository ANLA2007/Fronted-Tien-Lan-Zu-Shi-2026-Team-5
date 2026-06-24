import {
    obtenerPorciones,
    crearPorcion,
    actualizarPorcion,
    cambiarEstadoPorcion,
    cambiarReconsumable,
    buscarPorcionPorNombre
} from "../SERVICES/porcion.service.js";

import { obtenerCategorias } from "../../CATEGORIA/SERVICES/categoria.service.js";


const tbody           = document.getElementById("tablaPlatillos");
const searchInput     = document.getElementById("searchInput");
const categoryFilter  = document.getElementById("categoryFilter");
const paginacionInfo  = document.querySelector(".pagination-info");
const paginacionCtrls = document.querySelector(".pagination-controls");

const dishName        = document.getElementById("dishName");
const dishDescription = document.getElementById("dishDescription");
const portionType     = document.getElementById("portionType");
const fullPrice       = document.getElementById("fullPrice");
const dishStatus      = document.getElementById("dishStatus");
const statusText      = document.getElementById("statusText");
const dishReusable    = document.getElementById("dishReconsumible");
const dishImage       = document.getElementById("dishImage");
const previewImage    = document.getElementById("previewImage");
const saveBtn         = document.getElementById("saveBtn");
const cancelBtn       = document.getElementById("cancelBtn");

const deleteModal   = document.getElementById("deleteModal");
const cancelDelete  = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");


let categoriasData    = [];
let categoriaSelId    = "";
let categoriaSelNombre = "";

function crearDropdownCategoria() {
    
    const selectOriginal = document.getElementById("dishCategory");
    if (!selectOriginal) return;

    const wrapper = document.createElement("div");
    wrapper.id    = "catDropdown";
    wrapper.style.cssText = "position:relative;width:100%;";

    const btn = document.createElement("div");
    btn.id    = "catBtn";
    btn.style.cssText = `
        width:100%;border:1px solid #ddd;border-radius:12px;padding:12px;
        background:white;cursor:pointer;display:flex;justify-content:space-between;
        align-items:center;font-size:14px;color:#333;box-sizing:border-box;
        transition:.3s;
    `;
    btn.innerHTML = `<span id="catBtnText">Selecciona una categoría</span><i class="fa-solid fa-chevron-down" style="color:#999;font-size:12px;"></i>`;

    const lista = document.createElement("div");
    lista.id    = "catLista";
    lista.style.cssText = `
        display:none;position:absolute;top:calc(100% + 4px);left:0;right:0;
        background:white;border:1px solid #ddd;border-radius:12px;
        box-shadow:0 8px 24px rgba(0,0,0,.12);z-index:99999;
        max-height:220px;overflow-y:auto;
    `;

    wrapper.appendChild(btn);
    wrapper.appendChild(lista);
    selectOriginal.replaceWith(wrapper);

   
    btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const abierto = lista.style.display === "block";
        lista.style.display = abierto ? "none" : "block";
        btn.style.borderColor = abierto ? "#ddd" : "#2f8f2f";
        btn.style.boxShadow   = abierto ? "none" : "0 0 0 3px rgba(47,143,47,.15)";
    });

    document.addEventListener("click", () => {
        lista.style.display = "none";
        btn.style.borderColor = "#ddd";
        btn.style.boxShadow   = "none";
    });
}

function llenarDropdownCategoria(categorias) {
    const lista   = document.getElementById("catLista");
    const btnText = document.getElementById("catBtnText");
    if (!lista) return;

    lista.innerHTML = "";

    
    const itemVacio = document.createElement("div");
    itemVacio.textContent = "Selecciona una categoría";
    itemVacio.style.cssText = "padding:10px 14px;cursor:pointer;font-size:14px;color:#999;";
    itemVacio.addEventListener("mouseenter", () => itemVacio.style.background = "#f5f5f5");
    itemVacio.addEventListener("mouseleave", () => itemVacio.style.background = "white");
    itemVacio.addEventListener("click", () => {
        categoriaSelId     = "";
        categoriaSelNombre = "";
        btnText.textContent = "Selecciona una categoría";
        btnText.style.color = "#999";
        lista.style.display = "none";
    });
    lista.appendChild(itemVacio);

    categorias.forEach(cat => {
        const item = document.createElement("div");
        item.textContent = cat.categoryName;
        item.dataset.id  = cat.id;
        item.style.cssText = "padding:10px 14px;cursor:pointer;font-size:14px;color:#333;";
        item.addEventListener("mouseenter", () => item.style.background = "#f0faf0");
        item.addEventListener("mouseleave", () => item.style.background = "white");
        item.addEventListener("click", () => {
            categoriaSelId     = cat.id;
            categoriaSelNombre = cat.categoryName;
            btnText.textContent = cat.categoryName;
            btnText.style.color = "#333";
            lista.style.display = "none";
            document.getElementById("catBtn").style.borderColor = "#ddd";
            document.getElementById("catBtn").style.boxShadow   = "none";
        });
        lista.appendChild(item);
    });
}

function setCategoriaDropdown(id) {
    const btnText = document.getElementById("catBtnText");
    if (!btnText) return;
    if (!id) {
        categoriaSelId      = "";
        categoriaSelNombre  = "";
        btnText.textContent = "Selecciona una categoría";
        btnText.style.color = "#999";
        return;
    }
    const cat = categoriasData.find(c => String(c.id) === String(id));
    if (cat) {
        categoriaSelId      = cat.id;
        categoriaSelNombre  = cat.categoryName;
        btnText.textContent = cat.categoryName;
        btnText.style.color = "#333";
    }
}

let porcionEditando = null;
let rowToDelete     = null;
let paginaActual    = 1;
const TAMANIO_PAG   = 10;

const FOOD_ICONS = {
    postre:  "../../../../../ASSETS/img porcion/pastel.png",
    bebida:  "../../../../../ASSETS/img porcion/frescos.png",
    sopa:    "../../../../../ASSETS/img porcion/soup.png",
    ensalada:"../../../../../ASSETS/img porcion/salad.png",
    arroz:   "../../../../../ASSETS/img porcion/rice.png",
    planta:  "../../../../../ASSETS/img porcion/fresh-vegetable.png",
    plato:   "../../../../../ASSETS/img porcion/bibimbap.png",
    licuados: "../../../../../ASSETS/img porcion/batidos.png",
    pudin: "../../../../../ASSETS/img porcion/pudin.png",
    galletas: "../../../../../ASSETS/img porcion/galleta-salada.png",
    Panqueques:"../../../../../ASSETS/img porcion/panqueques.png",
    Tostadas:  "../../../../../ASSETS/img porcion/tostada-francesa.png",
    default: "../../../../../ASSETS/img porcion/dish.png"
};

function obtenerIconoComida(categoryName, portionName) {
    const texto = ((categoryName || "") + " " + (portionName || "")).toLowerCase();
    if (texto.includes("postre") || texto.includes("dulce") || texto.includes("torta") || texto.includes("cake")) return FOOD_ICONS.postre;
    if (texto.includes("refresco") || texto.includes("bebida") || texto.includes("batido") || texto.includes("jugo") || texto.includes("agua")) return FOOD_ICONS.bebida;
    if (texto.includes("sopa") || texto.includes("caldo") || texto.includes("crema")) return FOOD_ICONS.sopa;
    if (texto.includes("ensalada") || texto.includes("vegetal") || texto.includes("verdura") || texto.includes("lechuga")) return FOOD_ICONS.ensalada;
    if (texto.includes("arroz") || texto.includes("cereal") || texto.includes("grano")) return FOOD_ICONS.arroz;
    if (texto.includes("especia") || texto.includes("planta") || texto.includes("hierba") || texto.includes("especie")) return FOOD_ICONS.planta;
    return FOOD_ICONS.default;
}


async function cargarCategorias() {
    try {
        const respuesta  = await obtenerCategorias(1, 100);
        categoriasData   = respuesta.data ?? [];

       
        categoryFilter.innerHTML = `<option value="todos">Todas</option>`;
        categoriasData.forEach(cat => {
            const opt = document.createElement("option");
            opt.value       = cat.id;
            opt.textContent = cat.categoryName;
            categoryFilter.appendChild(opt);
        });

       
        crearDropdownCategoria();
        llenarDropdownCategoria(categoriasData);

    } catch (err) {
        console.error("Error cargando categorías:", err);
    }
}


async function cargarPorciones(pagina = 1) {
    try {
        const respuesta    = await obtenerPorciones(pagina, TAMANIO_PAG);
        const porciones    = respuesta.data ?? [];
        const totalRecords = respuesta.meta?.totalRecords ?? 0;
        const totalPages   = respuesta.meta?.totalPages   ?? 1;

        paginaActual    = pagina;
        tbody.innerHTML = "";

        porciones.forEach(p => {
            const tr = crearFila(p);
            tbody.appendChild(tr);
        });

        renderizarPaginacion(totalRecords, totalPages);

    } catch (err) {
        console.error("Error cargando porciones:", err);
    }
}


function crearFila(p) {
    const activo       = p.state === true;
    const reconsumable = p.reconsumable === true;

    const claseEstado = activo       ? "active-status"  : "inactive-status";
    const textoEstado = activo       ? "Activo"          : "Inactivo";
    const claseRecon  = reconsumable ? "reconsumible-si" : "reconsumible-no";
    const textoRecon  = reconsumable ? "Sí"              : "No";
    const textoTipo   = p.portionType === "1/2 Porcion"  ? "½ Porción" : "Porción completa";

    const iconUrl = obtenerIconoComida(p.categoryName, p.portionName);

    const tr = document.createElement("tr");
    tr.dataset.id       = p.id;
    tr.dataset.category = p.categoryId;

    tr.innerHTML = `
        <td>
            <div class="dish-info">
                <img src="${iconUrl}" alt="${p.portionName}" class="dish-icon" onerror="this.src='${FOOD_ICONS.default}'">
                <div>
                    <h4>${p.portionName}</h4>
                    <p>${p.description ?? ""}</p>
                </div>
            </div>
        </td>
        <td>${obtenerBadge(p.categoryName)}</td>
        <td>${textoTipo}</td>
        <td class="price">C$${(p.portionPrice ?? 0).toFixed(2)}</td>
        <td><span class="status ${claseEstado}">${textoEstado}</span></td>
        <td><span class="${claseRecon}">${textoRecon}</span></td>
        <td>
            <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </td>
    `;

    tr.querySelector(".edit-btn").addEventListener("click",   () => editarPorcion(p));
    tr.querySelector(".delete-btn").addEventListener("click", () => {
        rowToDelete = { id: p.id, fila: tr };
        deleteModal.style.display = "flex";
    });

    return tr;
}


function obtenerBadge(categoria) {
    const c = (categoria ?? "").toLowerCase();
    if (c.includes("postre"))
        return `<span class="badge postre"><i class="fa-solid fa-cake-candles"></i> ${categoria}</span>`;
    if (c.includes("refresco") || c.includes("batido") || c.includes("bebida"))
        return `<span class="badge bebida"><i class="fa-solid fa-glass-water"></i> ${categoria}</span>`;
    if (c.includes("especia") || c.includes("planta") || c.includes("especie"))
        return `<span class="badge plato"><i class="fa-solid fa-seedling"></i> ${categoria}</span>`;
    return `<span class="badge plato"><i class="fa-solid fa-utensils"></i> ${categoria ?? "Sin categoría"}</span>`;
}


function editarPorcion(p) {
    porcionEditando        = p.id;
    dishName.value         = p.portionName;
    dishDescription.value  = p.description ?? "";
    setCategoriaDropdown(p.categoryId);
    portionType.value      = p.portionType ?? "1 Porcion";
    fullPrice.value        = p.portionPrice;

    const activo           = p.state === true;
    dishStatus.checked     = activo;
    statusText.textContent = activo ? "Activo" : "Inactivo";

    dishReusable.value         = p.reconsumable ? "si" : "no";
    previewImage.src           = "";
    previewImage.style.display = "none";

    saveBtn.textContent = "Actualizar platillo";
    window.scrollTo({ top: 0, behavior: "smooth" });
}


function mostrarMensaje(texto, tipo) {
    let msgDiv = document.getElementById("formMsg");
    if (!msgDiv) {
        msgDiv = document.createElement("div");
        msgDiv.id = "formMsg";
        msgDiv.style.cssText = "padding:8px 12px;border-radius:6px;margin-bottom:10px;font-size:14px;font-weight:500;";
        saveBtn.parentElement.insertBefore(msgDiv, saveBtn.parentElement.firstChild);
    }
    msgDiv.textContent      = texto;
    msgDiv.style.background = tipo === "success" ? "#d4edda" : "#f8d7da";
    msgDiv.style.color      = tipo === "success" ? "#155724" : "#721c24";
    msgDiv.style.display    = "block";
    setTimeout(() => { msgDiv.style.display = "none"; }, 3000);
}

saveBtn.addEventListener("click", async () => {
    if (!categoriaSelId) {
        mostrarMensaje("Selecciona una categoría", "error");
        return;
    }
    const payload = {
        categoryId:   parseInt(categoriaSelId),
        portionName:  dishName.value.trim(),
        portionPrice: parseFloat(fullPrice.value),
        description:  dishDescription.value.trim(),
        portionType:  portionType.value,
        reconsumable: dishReusable.value === "si",
        state:        dishStatus.checked
    };
    try {
        if (porcionEditando) {
            await actualizarPorcion(porcionEditando, payload);
            mostrarMensaje("✅ Platillo actualizado correctamente.", "success");
        } else {
            await crearPorcion(payload);
            mostrarMensaje("✅ Platillo guardado correctamente.", "success");
        }
        limpiarFormulario();
        cargarPorciones(paginaActual);
    } catch (err) {
        mostrarMensaje(err.message, "error");
    }
});

function limpiarFormulario() {
    porcionEditando            = null;
    dishName.value             = "";
    dishDescription.value      = "";
    setCategoriaDropdown("");
    portionType.value          = "1 Porcion";
    fullPrice.value            = "";
    dishStatus.checked         = true;
    statusText.textContent     = "Activo";
    dishReusable.value         = "si";
    dishImage.value            = "";
    previewImage.src           = "";
    previewImage.style.display = "none";
    saveBtn.textContent        = "Guardar platillo";
}


dishStatus.addEventListener("change", () => {
    statusText.textContent = dishStatus.checked ? "Activo" : "Inactivo";
});


dishImage.addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = e => {
        previewImage.src           = e.target.result;
        previewImage.style.display = "block";
    };
    reader.readAsDataURL(file);
});



let debounceTimer = null;

searchInput.addEventListener("keydown", function (e) {
    if (e.key !== "Enter") return;
    const texto = this.value.trim();
    if (!texto) {
        cargarPorciones(paginaActual);
        return;
    }
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        try {
            const p         = await buscarPorcionPorNombre(texto);
            tbody.innerHTML = "";
            const tr        = crearFila(p);
            tbody.appendChild(tr);
            paginacionInfo.textContent = `Mostrando 1 resultado(s)`;
            paginacionCtrls.innerHTML  = "";
        } catch (err) {
            tbody.innerHTML            = `<tr><td colspan="7" style="text-align:center; color:red;">${err.message}</td></tr>`;
            paginacionInfo.textContent = "";
            paginacionCtrls.innerHTML  = "";
        }
    }, 300);
});

categoryFilter.addEventListener("change", function () {
    const categoria = this.value;
    tbody.querySelectorAll("tr").forEach(fila => {
        const coincideCategoria = categoria === "todos" || fila.dataset.category == categoria;
        fila.style.display      = coincideCategoria ? "" : "none";
    });
});



cancelDelete.addEventListener("click", () => {
    deleteModal.style.display = "none";
    rowToDelete = null;
});

confirmDelete.addEventListener("click", async () => {
    if (!rowToDelete) return;
    try {
        await cambiarEstadoPorcion(rowToDelete.id, false);
        const spanEstado = rowToDelete.fila.querySelector(".status");
        if (spanEstado) {
            spanEstado.textContent = "Inactivo";
            spanEstado.className   = "status inactive-status";
        }
    } catch (err) {
        console.error("Error al eliminar:", err);
        mostrarMensaje("❌ " + err.message, "error");
    }
    deleteModal.style.display = "none";
    rowToDelete = null;
});

deleteModal.addEventListener("click", e => {
    if (e.target === deleteModal) {
        deleteModal.style.display = "none";
        rowToDelete = null;
    }
});


function renderizarPaginacion(totalRecords, totalPages) {
    const desde = totalRecords === 0 ? 0 : (paginaActual - 1) * TAMANIO_PAG + 1;
    const hasta = Math.min(paginaActual * TAMANIO_PAG, totalRecords);

    paginacionInfo.textContent = `Mostrando ${desde} - ${hasta} de ${totalRecords} registros`;
    paginacionCtrls.innerHTML  = "";

    const btnPrev = document.createElement("button");
    btnPrev.textContent = "‹";
    btnPrev.disabled    = paginaActual === 1;
    btnPrev.addEventListener("click", () => cargarPorciones(paginaActual - 1));
    paginacionCtrls.appendChild(btnPrev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === paginaActual) btn.classList.add("active");
        btn.addEventListener("click", () => cargarPorciones(i));
        paginacionCtrls.appendChild(btn);
    }

    const btnNext = document.createElement("button");
    btnNext.textContent = "›";
    btnNext.disabled    = paginaActual === totalPages;
    btnNext.addEventListener("click", () => cargarPorciones(paginaActual + 1));
    paginacionCtrls.appendChild(btnNext);
}


cargarCategorias();
cargarPorciones();