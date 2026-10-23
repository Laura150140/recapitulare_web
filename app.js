const adresaAPI = 'https://dummyjson.com/products';

const formular = document.getElementById('formular-produs');
const listaProduse = document.getElementById('lista-produse');
const cautare = document.getElementById('cautare');
const mesajLista = document.getElementById('mesaj-lista');
const mesajFormular = document.getElementById('mesaj-formular');
const numarProduse = document.getElementById('numar-produse');
const butonAdaugare = document.getElementById('buton-adaugare');
const butonReincarcare = document.getElementById('buton-reincarcare');

let produse = [];
let produseAdaugate = [];

try {
    produseAdaugate = JSON.parse(localStorage.getItem('produseAdaugate')) || [];
    if (!Array.isArray(produseAdaugate)) {
        produseAdaugate = [];
    }
} catch (eroare) {
    produseAdaugate = [];
}

// functia care arata mesajele de pe pagina
function arataMesaj(element, text, tip = '') {
    element.textContent = text;
    element.className = 'mesaj ' + tip;
}

// functia care afiseaza produsele si filtreaza dupa cautare
function afiseazaProduse() {
    const textCautat = cautare.value.trim().toLowerCase();
    const rezultate = produse.filter(function(produs) {
        return produs.title.toLowerCase().includes(textCautat) ||
               (produs.description || '').toLowerCase().includes(textCautat);
    });

    listaProduse.replaceChildren();
    numarProduse.textContent = rezultate.length + ' produse afisate';

    if (rezultate.length === 0) {
        const paragraf = document.createElement('p');
        paragraf.className = 'fara-rezultate';
        paragraf.textContent = textCautat ? 'Niciun produs nu corespunde cautarii.' : 'Lista este goala.';
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

// functia care incarca produsele de pe api
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
        const produseDinAPI = Array.isArray(date.products) ? date.products : [];
        produse = [...produseAdaugate, ...produseDinAPI];
        afiseazaProduse();

        if (produse.length === 0) {
            arataMesaj(mesajLista, 'Lista este goala.');
        } else {
            arataMesaj(mesajLista, 'Produsele au fost incarcate.', 'succes');
        }
    } catch (eroare) {
        produse = [...produseAdaugate];
        afiseazaProduse();
        arataMesaj(mesajLista, 'Eroare la incarcare. Incearca din nou.', 'eroare');
        console.error(eroare);
    } finally {
        butonReincarcare.disabled = false;
    }
}

// functia care trimite produsul nou la api
async function adaugaProdus(eveniment) {
    eveniment.preventDefault();

    const dateFormular = new FormData(formular);
    const produsNou = {
        title: String(dateFormular.get('nume') || '').trim(),
        price: Number(dateFormular.get('pret')),
        description: String(dateFormular.get('descriere') || '').trim()
    };

    if (!produsNou.title || !produsNou.description || !Number.isFinite(produsNou.price) || produsNou.price <= 0) {
        arataMesaj(mesajFormular, 'Completeaza toate campurile corect.', 'eroare');
        return;
    }

    arataMesaj(mesajFormular, 'Se trimite produsul...');
    butonAdaugare.disabled = true;

    try {
        const raspuns = await fetch(adresaAPI + '/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(produsNou)
        });
        const dateServer = await raspuns.json().catch(function() { return {}; });

        if (raspuns.status >= 400 && raspuns.status < 500) {
            const eroareServer = dateServer.message || dateServer.error || 'Cererea nu a fost acceptata.';
            arataMesaj(mesajFormular, eroareServer, 'eroare');
            return;
        }

        if (!raspuns.ok) {
            arataMesaj(mesajFormular, 'Serverul nu a putut salva produsul.', 'eroare');
            return;
        }

        if (raspuns.status !== 201) {
            arataMesaj(mesajFormular, 'Raspuns neasteptat de la server HTTP ' + raspuns.status, 'eroare');
            return;
        }

        produsNou.id = dateServer.id || Date.now();
        produseAdaugate.unshift(produsNou);
        produse.unshift(produsNou);

        try {
            localStorage.setItem('produseAdaugate', JSON.stringify(produseAdaugate));
        } catch (eroare) {
            console.warn('Nu am putut salva produsul in browser', eroare);
        }

        formular.reset();
        cautare.value = '';
        afiseazaProduse();
        arataMesaj(mesajFormular, 'Produsul a fost adaugat cu succes!', 'succes');
    } catch (eroare) {
        arataMesaj(mesajFormular, 'Eroare de retea. Incearca din nou.', 'eroare');
        console.error(eroare);
    } finally {
        butonAdaugare.disabled = false;
    }
}

formular.addEventListener('submit', adaugaProdus);
cautare.addEventListener('input', afiseazaProduse);
butonReincarcare.addEventListener('click', incarcaProduse);

incarcaProduse();
