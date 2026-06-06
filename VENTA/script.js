



document.addEventListener('DOMContentLoaded', () => {
    // Aseguramos que busque exactamente el ID del HTML
    const inputCliente = document.getElementById('cliente-input');
    const dropdown = document.getElementById('clientes-dropdown');

    // Datos estáticos de prueba para asegurar que pinte la lista
    const clientes = [
        { nombre: 'Alexa', apellido: 'Lara' },
        { nombre: 'Dulce', apellido: 'Velasquez' },
        { nombre: 'Sasha', apellido: 'Ramirez' },
        { nombre: 'Roberta', apellido: 'Gomez' },
        { nombre: 'Anahi', apellido: 'Perez' }
    ];

    // Validamos que los elementos realmente existan antes de usarlos
    if (!inputCliente || !dropdown) {
        console.error("Error: No se encontraron los elementos HTML. Revisa los IDs.");
        return;
    }

    inputCliente.addEventListener('input', () => {
        const txt = inputCliente.value.toLowerCase().trim();
        dropdown.innerHTML = '';
        
        if (txt === '') {
            dropdown.style.display = 'none';
            return;
        }

        const filtrados = clientes.filter(c => 
            c.nombre.toLowerCase().includes(txt) || 
            c.apellido.toLowerCase().includes(txt)
        );

        dropdown.style.display = 'block';

        if (filtrados.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'Cliente no encontrado';
            li.classList.add('not-found');
            dropdown.appendChild(li);
            return;
        }

        filtrados.forEach(c => {
            const li = document.createElement('li');
            li.textContent = c.nombre + ' ' + c.apellido;
            li.addEventListener('click', () => {
                inputCliente.value = c.nombre + ' ' + c.apellido;
                dropdown.style.display = 'none';
            });
            dropdown.appendChild(li);
        });
    });

    document.addEventListener('click', (e) => {
        if (!inputCliente.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
});




document.addEventListener('DOMContentLoaded', () => {
    const empleadoSelect = document.getElementById('empleado-select');
    const usuariosStr = localStorage.getItem('catalogoUsuarios');
    const usuarios = usuariosStr ? JSON.parse(usuariosStr) : [];

    if (empleadoSelect) {
        usuarios.forEach(usuario => {
            const opcion = document.createElement('option');
            opcion.value = usuario.nombre;
            opcion.textContent = usuario.nombre;
            empleadoSelect.appendChild(opcion);
        });
    }
});






function updateClock() {
  const now = new Date();

  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

updateClock();
setInterval(updateClock, 1000);






