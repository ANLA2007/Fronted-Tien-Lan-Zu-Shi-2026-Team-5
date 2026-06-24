document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.formulario');
  const btn = document.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userName = form.querySelector('input[type="text"]').value.trim();
    const password = form.querySelector('input[type="password"]').value.trim();

    btn.disabled = true;
    btn.textContent = 'Iniciando sesión...';

    try {
      const response = await fetch('https://localhost:7264/api/Auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ UserName: userName, Password: password })
      });
      if (!response.ok) throw new Error('Error');

      const data = await response.json();
      localStorage.setItem('token', data.token);
    window.location.href = '../../../DASHBOARD/dashboard.html';

    } catch (error) {
      alert('Usuario o contraseña incorrectos');
    } finally {
      btn.disabled = false;
      btn.textContent = 'Iniciar sesión';
    }
  });
});