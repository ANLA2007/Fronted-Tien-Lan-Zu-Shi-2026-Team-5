document.addEventListener('DOMContentLoaded', () => {
    // Usamos los id que asiganmos en la clase modal y mas 
    const openModal = document.getElementById('openModal');
    const closeModal = document.getElementById('closeModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalContent = document.querySelector('.modal-content');



    // Abrir modal
    openModal.addEventListener('click', (e) => {
        e.preventDefault(); // Evita cualquier comportamiento por defecto
        console.log("Abriendo formulario...");
        
        modalOverlay.classList.add('modal-open');
        
        setTimeout(() => {
            modalContent.classList.add('activo');
        }, 10);
    });

    // Cerrar modal 
    closeModal.addEventListener('click', () => {
        modalContent.classList.remove('activo');
        setTimeout(() => {
            modalOverlay.classList.remove('modal-open');
        }, 300);
    });

});