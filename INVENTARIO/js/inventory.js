document.addEventListener('DOMContentLoaded', () => {

    const openModal = document.getElementById('openModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.querySelector('.modal-content');

    openModal.addEventListener('click', (e) => {
        e.preventDefault();
        modalOverlay.classList.add('modal-open');

        setTimeout(() => {
            modalContent.classList.add('activo');
        }, 10);
    });

    closeModal.addEventListener('click', () => {
        modalContent.classList.remove('activo');

        setTimeout(() => {
            modalOverlay.classList.remove('modal-open');
        }, 300);
    });


    
    const buscador = document.getElementById("buscador");

    buscador.addEventListener("keyup", function () {
        let filtro = this.value.toLowerCase();
        let filas = document.querySelectorAll(".orders-table tbody tr");

        filas.forEach(fila => {
            let texto = fila.innerText.toLowerCase();
            fila.style.display = texto.includes(filtro) ? "" : "none";
        });
    });

});



function filtrar() {
    let desde = document.getElementById("fromDate").value;
    let hasta = document.getElementById("toDate").value;

    let filas = document.querySelectorAll(".orders-table tbody tr");

    filas.forEach(fila => {
        let fechaTexto = fila.children[0].innerText.trim();
        let fechaFila = new Date(fechaTexto);

        let mostrar = true;

        if (desde && fechaFila < new Date(desde)) {
            mostrar = false;
        }

        if (hasta && fechaFila > new Date(hasta)) {
            mostrar = false;
        }

        fila.style.display = mostrar ? "" : "none";
    });
}