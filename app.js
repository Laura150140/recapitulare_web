const adresaAPI = 'https://dummyjson.com/products';

const formular = document.getElementById('formular-produs');
const listaProduse = document.getElementById('lista-produse');
const mesajLista = document.getElementById('mesaj-lista');
const mesajFormular = document.getElementById('mesaj-formular');
const numarProduse = document.getElementById('numar-produse');
const butonReincarcare = document.getElementById('buton-reincarcare');

let produse = [];

function arataMesaj(element, text, tip = '') {
    element.textContent = text;
    element.className = 'mesaj ' + tip;
}

function afiseazaProduse() {
    const rezultate = produse;

    listaProduse.replaceChildren();
    numarProduse.textContent = rezultate.length + ' produse afisate';

    if (rezultate.length === 0) {
        const paragraf = document.createElement('p');
        paragraf.className = 'fara-rezultate';
        paragraf.textContent = 'Lista este goala.';
        listaProduse.appendChild(paragraf);
        return;
    }

    rezultate.forEach(function(produs) {
        const card = document.createElement('article');
        card.className = 'produs';

        const titlu = document.createElement('h3');
        titlu.textContent = produs.title;

        const pret = document.createElement('p');
        pret.className = 'pret';
        pret.textContent = Number(produs.price).toFixed(2) + ' USD';

        const descriere = document.createElement('p');
        descriere.className = 'descriere';
        descriere.textContent = produs.description || 'Fara descriere.';

        card.appendChild(titlu);
        card.appendChild(pret);
        card.appendChild(descriere);
        listaProduse.appendChild(card);
    });
}

async function incarcaProduse() {
    arataMesaj(mesajLista, 'Se incarca produsele...');
    butonReincarcare.disabled = true;
    listaProduse.replaceChildren();
    numarProduse.textContent = '';

    try {
        const raspuns = await fetch(adresaAPI + '?limit=30');
        if (!raspuns.ok) {
            throw new Error('HTTP ' + raspuns.status);
        }

        const date = await raspuns.json();
        produse = Array.isArray(date.products) ? date.products : [];
        afiseazaProduse();

        if (produse.length === 0) {
            arataMesaj(mesajLista, 'Lista este goala.');
        } else {
            arataMesaj(mesajLista, 'Produsele au fost incarcate.', 'succes');
        }
    } catch (eroare) {
        produse = [];
        listaProduse.replaceChildren();
        numarProduse.textContent = '0 produse afisate';
        arataMesaj(mesajLista, 'Eroare la incarcare. Incearca din nou.', 'eroare');
        console.error(eroare);
    } finally {
        butonReincarcare.disabled = false;
    }
}

formular.addEventListener('submit', function(eveniment) {
    eveniment.preventDefault();
    arataMesaj(mesajFormular, 'TODO');
});

butonReincarcare.addEventListener('click', incarcaProduse);

incarcaProduse();
