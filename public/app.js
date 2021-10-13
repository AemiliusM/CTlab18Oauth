const button = document.createElement('button');

button.textContent = 'SIGN IN NOW! PLEASE?';

button.addEventListener('click', () => {
  window.location.assign('/api/auth/login');
});

document.getElementById('root').appendChild(button);
