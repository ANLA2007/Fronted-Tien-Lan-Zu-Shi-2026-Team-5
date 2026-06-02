// ELEMENTOS DOM
const tablaPlatillos = document.getElementById("tablaPlatillos");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const saveBtn = document.getElementById("saveBtn");
const cancelBtn = document.getElementById("cancelBtn");

const dishName = document.getElementById("dishName");
const dishDescription = document.getElementById("dishDescription");
const dishCategory = document.getElementById("dishCategory");

const fullPrice = document.getElementById("fullPrice");
const halfPrice = document.getElementById("halfPrice");

const dishStatus = document.getElementById("dishStatus");
const statusText = document.getElementById("statusText");

const dishImage = document.getElementById("dishImage");
const previewImage = document.getElementById("previewImage");

// MODAL ELIMINAR
const deleteModal = document.getElementById("deleteModal");
const cancelDelete = document.getElementById("cancelDelete");
const confirmDelete = document.getElementById("confirmDelete");


// VARIABLES
let editRow = null;
let rowToDelete = null;

// ESTADO ACTIVO / INACTIVO
dishStatus.addEventListener("change", () => {

    statusText.textContent =
        dishStatus.checked
            ? "Activo"
            : "Inactivo";

});


// PREVIEW IMAGEN
dishImage.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;

        previewImage.style.display = "block";

    };

    reader.readAsDataURL(file);

});

// GUARDAR PLATILLO
saveBtn.addEventListener("click", () => {

    if (
        dishName.value.trim() === "" ||
        dishCategory.value === "" ||
        fullPrice.value === ""
    ) {

        alert("Completa los campos obligatorios");

        return;
    }

    const imageSrc =
        previewImage.src || "img/spaghetti.png";

    const categoriaBadge =
        obtenerBadge(dishCategory.value);

    const estadoHTML =
        dishStatus.checked
            ? `<span class="status active-status">Activo</span>`
            : `<span class="status inactive-status">Inactivo</span>`;

    if (editRow) {

        actualizarFila(
            editRow,
            imageSrc,
            categoriaBadge,
            estadoHTML
        );

        guardarLocalStorage();

        limpiarFormulario();

        editRow = null;

        return;
    }

    const nuevaFila = document.createElement("tr");

    nuevaFila.dataset.category =
        dishCategory.value;

    nuevaFila.innerHTML = `

        <td>

            <div class="dish-info">

                <img src="${imageSrc}">

                <div>

                    <h4>${dishName.value}</h4>

                    <p>${dishDescription.value}</p>

                </div>

            </div>

        </td>

        <td>
            ${categoriaBadge}
        </td>

        <td>

            <select class="portion-select">

                <option value="${fullPrice.value}">
                    Porción completa
                </option>

                ${
                    halfPrice.value
                    ? `
                    <option value="${halfPrice.value}">
                        Media porción
                    </option>
                    `
                    : ""
                }

            </select>

        </td>

        <td class="price">
            $${fullPrice.value}.00
        </td>

        <td>
            ${estadoHTML}
        </td>

        <td>

            <button class="edit-btn">
                <i class="fa-solid fa-pen"></i>
            </button>

            <button class="delete-btn">
                <i class="fa-solid fa-trash"></i>
            </button>

        </td>

    `;

    tablaPlatillos.appendChild(nuevaFila);

    activarEventosFila(nuevaFila);

    guardarLocalStorage();

    limpiarFormulario();

});

// EVENTOS FILA
function activarEventosFila(fila) {

    const btnEdit =
        fila.querySelector(".edit-btn");

    const btnDelete =
        fila.querySelector(".delete-btn");

    const select =
        fila.querySelector(".portion-select");

    // EDITAR

    btnEdit.addEventListener("click", () => {

        editRow = fila;

        dishName.value =
            fila.querySelector("h4").textContent;

        dishDescription.value =
            fila.querySelector("p").textContent;

        dishCategory.value =
            fila.dataset.category;

        previewImage.src =
            fila.querySelector("img").src;

        previewImage.style.display = "block";

        fullPrice.value =
            select.options[0].value;

        halfPrice.value =
            select.options[1]
                ? select.options[1].value
                : "";

        const activo =
            fila.querySelector(".status")
            .textContent.trim() === "Activo";

        dishStatus.checked = activo;

        statusText.textContent =
            activo
                ? "Activo"
                : "Inactivo";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    });

    // ELIMINAR

    btnDelete.addEventListener("click", () => {

        rowToDelete = fila;

        deleteModal.style.display = "flex";

    });

    // CAMBIO DE PRECIO

    select.addEventListener("change", () => {

        fila.querySelector(".price")
            .textContent =
            "$" + select.value + ".00";

        guardarLocalStorage();

    });

}

// ACTUALIZAR FILA
function actualizarFila(
    fila,
    imageSrc,
    categoriaBadge,
    estadoHTML
) {

    fila.querySelector("img").src =
        imageSrc;

    fila.querySelector("h4").textContent =
        dishName.value;

    fila.querySelector("p").textContent =
        dishDescription.value;

    fila.querySelector("td:nth-child(2)")
        .innerHTML =
        categoriaBadge;

    fila.dataset.category =
        dishCategory.value;

    const select =
        fila.querySelector(".portion-select");

    select.innerHTML = `

        <option value="${fullPrice.value}">
            Porción completa
        </option>

        ${
            halfPrice.value
            ? `
            <option value="${halfPrice.value}">
                Media porción
            </option>
            `
            : ""
        }

    `;

    fila.querySelector(".price")
        .textContent =
        "$" + fullPrice.value + ".00";

    fila.querySelector("td:nth-child(5)")
        .innerHTML =
        estadoHTML;

}

// BADGES
function obtenerBadge(categoria) {

    if (categoria === "Plato fuerte") {

        return `
            <span class="badge plato">
                <i class="fa-solid fa-utensils"></i>
                Plato fuerte
            </span>
        `;
    }

    if (categoria === "Postres") {

        return `
            <span class="badge postre">
                <i class="fa-solid fa-cake-candles"></i>
                Postres
            </span>
        `;
    }

    return `
        <span class="badge bebida">
            <i class="fa-solid fa-glass-water"></i>
            Refrescos y batidos
        </span>
    `;
}

// FILTROS
searchInput.addEventListener(
    "keyup",
    filtrarPlatillos
);

categoryFilter.addEventListener(
    "change",
    filtrarPlatillos
);

function filtrarPlatillos() {

    const texto =
        searchInput.value.toLowerCase();

    const categoria =
        categoryFilter.value;

    const filas =
        tablaPlatillos.querySelectorAll("tr");

    filas.forEach(fila => {

        const contenido =
            fila.textContent.toLowerCase();

        const categoriaFila =
            fila.dataset.category;

        const coincideTexto =
            contenido.includes(texto);

        const coincideCategoria =
            categoria === "todos" ||
            categoriaFila === categoria;

        fila.style.display =
            coincideTexto &&
            coincideCategoria
                ? ""
                : "none";

    });

}

// LIMPIAR FORMULARiO
cancelBtn.addEventListener(
    "click",
    limpiarFormulario
);

function limpiarFormulario() {

    dishName.value = "";
    dishDescription.value = "";
    dishCategory.value = "";

    fullPrice.value = "";
    halfPrice.value = "";

    dishStatus.checked = true;

    statusText.textContent = "Activo";

    dishImage.value = "";

    previewImage.src = "";
    previewImage.style.display = "none";

}

// MODAL ELIMINAR
cancelDelete.addEventListener("click", () => {

    deleteModal.style.display = "none";

    rowToDelete = null;

});

confirmDelete.addEventListener("click", () => {

    if (rowToDelete) {

        rowToDelete.remove();

        guardarLocalStorage();

    }

    deleteModal.style.display = "none";

    rowToDelete = null;

});

deleteModal.addEventListener("click", (e) => {

    if (e.target === deleteModal) {

        deleteModal.style.display = "none";

        rowToDelete = null;

    }

});

// LOCAL STORAGE
function guardarLocalStorage() {

    localStorage.setItem(
        "platillosHTML",
        tablaPlatillos.innerHTML
    );

}

function cargarLocalStorage() {

    const datos =
        localStorage.getItem(
            "platillosHTML"
        );

    if (!datos) return;

    tablaPlatillos.innerHTML = datos;

    tablaPlatillos
        .querySelectorAll("tr")
        .forEach(fila => {

            activarEventosFila(fila);

        });

}

// INICIO
window.addEventListener(
    "DOMContentLoaded",
    () => {

        cargarLocalStorage();

        tablaPlatillos
            .querySelectorAll("tr")
            .forEach(fila => {

                activarEventosFila(fila);

            });

    }
);