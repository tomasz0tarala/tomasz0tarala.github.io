/**
 * @fileoverview Skrypt do zarządzania listą samochodów w aplikacji.
 * Umożliwia dodawanie, usuwanie oraz sortowanie samochodów według różnych kryteriów.
 */

/**
 * Dodaje obsługę kliknięcia na przycisk, który inicjuje dodawanie samochodu do listy,
 * a następnie sortuje listę według aktualnie wybranego kryterium.
 * @public
 * @example
 * document.getElementById('add-car').addEventListener('click', function () {
 *   addCarToList();
 *   sortCars();
 * });
 */
document.getElementById('add-car').addEventListener('click', function () {
  addCarToList();
  sortCars();
});

/**
 * Dodaje samochód do listy. Pobiera dane samochodu z formularza,
 * sprawdza poprawność danych, a następnie dodaje samochód do listy.
 * @function
 * @public
 * @throws {Error} Gdy dane samochodu są niekompletne lub niepoprawne.
 */
function addCarToList() {
  const carBrand = document.getElementById('car-brand').value;
  const carModel = document.getElementById('car-name').value.trim();
  const carYear = document.getElementById('car-year').value;
  const carPowerKW = document.getElementById('car-power-kw').value.trim();

  if (carBrand === "" || carYear === "") {
    alert('Proszę wybrać markę i rok produkcji samochodu.');
    return;
  }

  if (!carModel || !carPowerKW || isNaN(carPowerKW) || Number(carPowerKW) <= 0) {
    alert('Podaj poprawny format nazwy smaochodu oraz dodatnią liczbę mocy.');
    return;
  }

  const carList = document.getElementById('car-list');
  const carItem = document.createElement('li');
  carItem.className = 'car-item';
  carItem.dataset.brand = carBrand;
  carItem.dataset.model = carModel;
  carItem.dataset.year = carYear;
  carItem.dataset.power = kwToHp(carPowerKW);

  carItem.innerHTML = `<span class="car-detail">Marka: ${carBrand}</span><span class="car-detail">Model: ${carModel}</span><span class="car-detail">Rok: ${carYear}</span><span class="car-detail">Moc: ${carItem.dataset.power} KM</span><span class="remove-car" onclick="removeCar(this)">&times;</span>`;

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
 * Usuwa wybrany samochód z listy i następnie sortuje listę.
 * @function
 * @public
 * @param {HTMLElement} element - Element HTML reprezentujący samochód, który ma zostać usunięty.
 * @example
 * removeCar(this); // Wywołanie z przycisku usunięcia w elemencie listy
 */
function removeCar(element) {
  element.parentElement.remove();
  sortCars(); // Sortowanie po usunięciu samochodu
}

/**
 * Dodaje obsługę zdarzeń do wszystkich przycisków radiowych odpowiedzialnych za wybór kryteriów sortowania.
 * Po zmianie stanu któregokolwiek z przycisków radiowych, lista samochodów jest sortowana ponownie.
 * @example
 * document.querySelectorAll('input[name="filter-option"]').forEach(radio => {
 *     radio.addEventListener('change', sortCars);
 * });
 */
document.querySelectorAll('input[name="filter-option"]').forEach(radio => {
  radio.addEventListener('change', sortCars);
});

/**
 * Dodaje obsługę zdarzeń do wszystkich przycisków radiowych odpowiedzialnych za wybór kierunku sortowania.
 * Po zmianie wyboru, lista samochodów jest sortowana ponownie zgodnie z nowym kierunkiem.
 * @example
 * document.querySelectorAll('input[name="sort-order"]').forEach(radio => {
 *     radio.addEventListener('change', sortCars);
 * });
 */
document.querySelectorAll('input[name="sort-order"]').forEach(radio => {
  radio.addEventListener('change', sortCars);
});

/**
 * Sortuje samochody na liście według wybranych kryteriów i kierunku sortowania.
 * Umożliwia sortowanie według marki, roku produkcji, modelu oraz mocy samochodu.
 * Kierunek sortowania jest określany przez przyciski radiowe.
 * @function
 * @public
 * @example
 * // Przykładowe wywołanie funkcji sortującej po zmianie stanu któregokolwiek z checkboxów lub przycisków radiowych
 * document.querySelectorAll('input[name="filter-option"]').forEach(checkbox => {
 *     checkbox.addEventListener('change', sortCars);
 * });
 * document.querySelectorAll('input[name="sort-order"]').forEach(radio => {
 *     radio.addEventListener('change', sortCars);
 * });
 */
function sortCars() {
  const carList = document.getElementById('car-list');
  let cars = Array.from(carList.getElementsByTagName('li'));

  const sortByBrand = document.getElementById('filter-by-brand').checked;
  const sortByYear = document.getElementById('filter-by-year').checked;
  const sortByModel = document.getElementById('filter-by-model').checked;
  const sortByPower = document.getElementById('filter-by-power').checked;

  const sortOrder = document.querySelector('input[name="sort-order"]:checked').value;
  const isAscending = sortOrder === 'ascending';

  const sortFunction = (a, b) => {
    if (isAscending) {
      return a.localeCompare(b);
    } else {
      return b.localeCompare(a);
    }
  };

  if (sortByBrand) {
    cars.sort((a, b) => sortFunction(a.dataset.brand, b.dataset.brand));
  } else if (sortByYear) {
    cars.sort((a, b) => isAscending ? a.dataset.year - b.dataset.year : b.dataset.year - a.dataset.year);
  } else if (sortByModel) {
    cars.sort((a, b) => sortFunction(a.dataset.model, b.dataset.model));
  } else if (sortByPower) {
    cars.sort((a, b) => isAscending ? a.dataset.power - b.dataset.power : b.dataset.power - a.dataset.power);
  }

  carList.innerHTML = '';
  cars.forEach(car => carList.appendChild(car));
}

/**
 * Dodaje obsługę zdarzenia kliknięcia, które inicjuje proces ładowania danych samochodów z pliku JSON.
 * @example
 * document.getElementById('load-sample-cars').addEventListener('click', fetchLocalData);
 */

document.getElementById('load-sample-cars').addEventListener('click', fetchLocalData);

/**
 * Asynchronicznie pobiera dane o samochodach z pliku JSON i aktualizuje DOM.
 * @async
 * @function
 * @public
 * @throws {Error} Gdy nie uda się pobrać danych.
 * @example
 * fetchLocalData();
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
 * Aktualizuje DOM, dodając samochody z podanej tablicy do listy.
 * Każdy samochód jest przedstawiony jako element listy z odpowiednimi detalami.
 * @function
 * @public
 * @param {Object[]} cars - Tablica obiektów reprezentujących samochody.
 * @example
 * updateDOMWithLocalData(carsArray); // carsArray to tablica obiektów samochodów
 */

function updateDOMWithLocalData(cars) {
  const carList = document.getElementById('car-list');

  cars.forEach(car => {
    const carItem = document.createElement('li');
    carItem.className = 'car-item';
    carItem.dataset.brand = car.brand;
    carItem.dataset.model = car.model;
    carItem.dataset.year = car.year;
    carItem.dataset.power = kwToHp(car.powerKW);
    carItem.innerHTML = `<span class="car-detail">Marka: ${car.brand}</span><span class="car-detail">Model: ${car.model}</span><span class="car-detail">Rok: ${car.year}</span><span class="car-detail">Moc: ${carItem.dataset.power} KM</span><span class="remove-car" onclick="removeCar(this)">&times;</span>`;
    carList.appendChild(carItem);
  });

  sortCars(); // Funkcja do sortowania listy
}

/**
 * Generuje opcje roku w elemencie select dla roku produkcji samochodu.
 * Opcje są generowane w zakresie od 1950 do 2024 roku.
 * @function
 * @public
 * @example
 * generateYearOptions();
 */
function generateYearOptions() {
  const yearSelect = document.getElementById('car-year');
  for (let year = 2024; year >= 1950; year--) {
    let option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
}

generateYearOptions();