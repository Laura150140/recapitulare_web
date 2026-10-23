# Catalog de produse - Tema
1. Proiect realizat in HTML, CSS si JavaScript pentru afisarea, cautarea si adaugarea produselor.
2. API folosit: https://dummyjson.com/products
3. Pentru GET folosesc https://dummyjson.com/products?limit=30 ca sa incarc lista de produse.
4. Pentru POST folosesc https://dummyjson.com/products/add ca sa simulez adaugarea unui produs.
5. CORS este gestionat de serverul DummyJSON, care permite cereri din alte domenii prin headerul Access-Control-Allow-Origin
6. Nu am folosit proxy sau backend propriu, deoarece API-ul permite cererile direct din browser.
7. La GET verific response.ok (status 2xx), iar daca apare o eroare afisez un mesaj pe pagina.
8. La POST verific statusul 201 Created si adaug produsul in lista si in localStorage.
9. Pentru erorile 4xx afisez mesajul serverului, iar pentru 5xx afisez un mesaj de eroare.
10. Daca apare o eroare de retea, afisez un mesaj si utilizatorul poate reincerca operatiunea.
