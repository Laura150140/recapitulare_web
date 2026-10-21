const formular = document.getElementById('formular-produs');
const mesajFormular = document.getElementById('mesaj-formular');
const mesajLista = document.getElementById('mesaj-lista');
mesajLista.textContent = 'Lista de produse va aparea aici.';

formular.addEventListener('submit', function(eveniment) {
    eveniment.preventDefault();
    mesajFormular.textContent = 'TODO.';
});
