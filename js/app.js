/**
 * @fileoverview Skrypt do zarządzania listą samochodów w aplikacji. 
 * Umożliwia dodawanie, usuwanie oraz sortowanie samochodów według mocy.
 */

/**
 * Dodaje obsługę kliknięcia na przycisk, który inicjuje dodawanie samochodu do listy i sortowanie jej według mocy.
 * @public
 * @example
 * document.getElementById('add-car').addEventListener('click', function () {
 *   addCarToList();
 *   sortCarsByPower();
 * });
 */
document.getElementById('add-car').addEventListener('click', function () {
    addCarToList();
    sortCarsByPower();
});

/**
 * Dodaje samochód do listy. Pobiera nazwę i moc samochodu z formularza,
 * sprawdza poprawność danych, a następnie dodaje samochód do listy.
 * @function
 * @public
 * @throws {Error} Gdy nazwa samochodu jest pusta, moc nie jest liczbą, lub moc jest mniejsza lub równa zero.
 */
function addCarToList() {
    const carName = document.getElementById('car-name').value.trim();
    const carPowerKW = document.getElementById('car-power-kw').value.trim();
    if (!carName || !carPowerKW || isNaN(carPowerKW) || Number(carPowerKW) <= 0) {
      alert('Podaj poprawny format nazwy smaochodu oraz dodatnią liczbę mocy.');
      return;
    }
  
    const carList = document.getElementById('car-list');
    const carItem = document.createElement('li');
    carItem.className = 'car-item';
    carItem.dataset.power = kwToHp(carPowerKW); // Przechowywanie mocy w KM jako atrybut danych
    carItem.innerHTML = `${carName} - ${carItem.dataset.power} KM <span class="remove-car" onclick="removeCar(this)">&times</span>`;
    carList.appendChild(carItem);
}

/**
 * Konwertuje moc z kW na KM (konie mechaniczne).
 * @function
 * @public
 * @param {number} kw - Moc w kilowatach.
 * @returns {number} Przeliczona moc w koniach mechanicznych.
 */
function kwToHp(kw) {
    return Math.round(kw * 1.34102);
}

/**
 * Usuwa samochód z listy.
 * @function
 * @public
 * @param {HTMLElement} element - Element HTML reprezentujący samochód, który ma zostać usunięty.
 */
function removeCar(element) {
    element.parentElement.remove();
    sortCarsByPower(); // Sortowanie po usunięciu samochodu
}

/**
 * Sortuje samochody na liście według mocy (malejąco).
 * @function
 * @public
 */
function sortCarsByPower() {
    const carList = document.getElementById('car-list');
    let cars = Array.from(carList.getElementsByTagName('li'));
    cars.sort((a, b) => b.dataset.power - a.dataset.power); // Sortowanie malejąco
  
    carList.innerHTML = ''; // Czyszczenie listy
    cars.forEach(car => carList.appendChild(car)); // Ponowne dodanie posortowanych samochodów
}

/**
 * Pobiera dane o samochodach z lokalnego pliku JSON i aktualizuje DOM.
 * @function
 * @public
 * @async
 * @example
 * document.getElementById('load-sample-cars').addEventListener('click', fetchLocalData);
 */
document.getElementById('load-sample-cars').addEventListener('click', fetchLocalData);
  
/**
 * Pobiera dane o samochodach z lokalnego pliku JSON.
 * @function
 * @public
 * @async
 * @throws {Error} Gdy nie uda się pobrać danych.
 */
async function fetchLocalData() {
    try {
      const response = await fetch('../json/cars.json');
      const cars = await response.json();
      updateDOMWithLocalData(cars);
    } catch (error) {
      console.error('Error fetching local data:', error);
    }
}

/**
 * Aktualizuje DOM, dodając samochody z podanej tablicy.
 * @function
 * @public
 * @param {Object[]} cars - Tablica obiektów reprezentujących samochody.
 */
function updateDOMWithLocalData(cars) {
    const carList = document.getElementById('car-list');
  
    cars.forEach(car => {
      const carItem = document.createElement('li');
      carItem.className = 'car-item';
      carItem.dataset.power = kwToHp(car.powerKW); // Używając danych z pliku JSON
      carItem.innerHTML = `${car.name} - ${carItem.dataset.power} KM <span class="remove-car" onclick="removeCar(this)">&times</span>`;
      carList.appendChild(carItem);
    });
    sortCarsByPower(); // Sortowanie listy po dodaniu nowych samochodów
}  