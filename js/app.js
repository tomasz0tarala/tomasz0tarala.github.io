document.getElementById('add-car').addEventListener('click', function() {
    addCarToList();
    sortCarsByPower();
});

function addCarToList() {
    const carName = document.getElementById('car-name').value.trim();
    const carPowerKW = document.getElementById('car-power-kw').value.trim();
    if (!carName || !carPowerKW || isNaN(carPowerKW) || Number(carPowerKW) <= 0) {
        alert('Please enter a valid car name and a positive number for car power.');
        return;
    }

    const carList = document.getElementById('car-list');
    const carItem = document.createElement('li');
    carItem.className = 'car-item';
    carItem.dataset.power = kwToHp(carPowerKW); // Przechowywanie mocy w KM jako atrybut danych
    carItem.innerHTML = `${carName} - ${carItem.dataset.power} KM <span class="remove-car" onclick="removeCar(this)">X</span>`;
    carList.appendChild(carItem);
}

function kwToHp(kw) {
    return Math.round(kw * 1.34102);
}

function removeCar(element) {
    element.parentElement.remove();
    sortCarsByPower(); // Sortowanie po usunięciu samochodu
}

function sortCarsByPower() {
    const carList = document.getElementById('car-list');
    let cars = Array.from(carList.getElementsByTagName('li'));
    cars.sort((a, b) => b.dataset.power - a.dataset.power); // Sortowanie malejąco

    carList.innerHTML = ''; // Czyszczenie listy
    cars.forEach(car => carList.appendChild(car)); // Ponowne dodanie posortowanych samochodów
}

document.getElementById('load-sample-cars').addEventListener('click', fetchLocalData);

// Funkcja do pobrania danych o samochodach z lokalnego pliku JSON
async function fetchLocalData() {
    try {
        const response = await fetch('../json/cars.json');
        const cars = await response.json();
        updateDOMWithLocalData(cars);
    } catch (error) {
        console.error('Error fetching local data:', error);
    }
}

function updateDOMWithLocalData(cars) {
    const carList = document.getElementById('car-list');

    cars.forEach(car => {
        const carItem = document.createElement('li');
        carItem.className = 'car-item';
        carItem.dataset.power = kwToHp(car.powerKW); // Używając danych z pliku JSON
        carItem.innerHTML = `${car.name} - ${carItem.dataset.power} KM <span class="remove-car" onclick="removeCar(this)">X</span>`;
        carList.appendChild(carItem);
    });
    sortCarsByPower(); // Sortowanie listy po dodaniu nowych samochodów
}


