// FILTRO DE BUSQUEDA
const searchInput = document.getElementById("searchInput");
const salesTable = document.getElementById("salesTable");

searchInput.addEventListener("keyup", () => {

    const filter = searchInput.value.toLowerCase();
    const rows = salesTable.querySelectorAll("tr");

    rows.forEach(row => {

        const text = row.textContent.toLowerCase();

        if(text.includes(filter)){
            row.style.display = "";
        }else{
            row.style.display = "none";
        }
    });
});

// FILTRO DE PAGO
const paymentFilter = document.getElementById("paymentFilter");

paymentFilter.addEventListener("change", () => {

    const selected = paymentFilter.value;
    const rows = salesTable.querySelectorAll("tr");

    rows.forEach(row => {

        const paymentMethod = row.children[3].textContent;

        if(selected === "all" || paymentMethod === selected){
            row.style.display = "";
        }else{
            row.style.display = "none";
        }
    });
});

//BUTTON NUEVA VENTA
//const newSaleBtn = document.querySelector(".btn-new-sale");

//newSaleBtn.addEventListener("click", () => {

  // window.location.href = "NuevaVenta.html";

//});


// FILTRO POR FECHAS
const filterBtn = document.querySelector(".btn-filter");

filterBtn.addEventListener("click", () => {

    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;

    const rows = salesTable.querySelectorAll("tr");

    rows.forEach(row => {

        const dateCell = row.children[1];

        if(!dateCell) return;

        const rowDate = dateCell.textContent.trim();
        const parts = rowDate.split("/");
        const formattedDate =
            parts[2] + "-" +
            parts[1].padStart(2, "0") + "-" +
            parts[0].padStart(2, "0");

        if(
            (fromDate === "" || formattedDate >= fromDate) &&
            (toDate === "" || formattedDate <= toDate)
        ){
            row.style.display = "";
        }else{
            row.style.display = "none";
        }
    });
});
// ELIMINAR VENTA
const modal = document.getElementById("deleteModal");
const btnCancel = document.getElementById("cancelDelete");
const btnConfirm = document.getElementById("confirmDelete");

let filaSeleccionada = null;

document.querySelectorAll(".btn-delete").forEach(btn => {

    btn.addEventListener("click", function(){

        filaSeleccionada = this.closest("tr");

        modal.style.display = "flex";

    });

});

btnCancel.addEventListener("click", () => {

    modal.style.display = "none";

});

btnConfirm.addEventListener("click", () => {

    if(filaSeleccionada){

        filaSeleccionada.remove();

    }

    modal.style.display = "none";

});
