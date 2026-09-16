const carData = [
  {
    id: 1,
    name: 'BMW X5',
    type: 'SUV',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Hybrid',
    icon: '🚙',
    rate: 98,
    location: 'Manchester Airport',
    available: true,
    rating: 4.9,
  },
  {
    id: 2,
    name: 'Mercedes C-Class',
    type: 'Luxury',
    seats: 4,
    transmission: 'Automatic',
    fuel: 'Diesel',
    icon: '🏎️',
    rate: 112,
    location: 'Manchester City',
    available: true,
    rating: 4.8,
  },
  {
    id: 3,
    name: 'Tesla Model 3',
    type: 'Electric',
    seats: 5,
    transmission: 'Automatic',
    fuel: 'Electric',
    icon: '⚡',
    rate: 89,
    location: 'Leeds Hub',
    available: true,
    rating: 4.9,
  },
  {
    id: 4,
    name: 'VW Touran',
    type: 'Family',
    seats: 7,
    transmission: 'Automatic',
    fuel: 'Petrol',
    icon: '🚐',
    rate: 74,
    location: 'Liverpool Dock',
    available: true,
    rating: 4.7,
  },
];

const recentBookings = [
  { name: 'Family SUV', amount: '£392', date: 'Today' },
  { name: 'Business Class', amount: '£560', date: 'Yesterday' },
  { name: 'Airport Dropoff', amount: '£210', date: 'Mon' },
];

const state = {
  selectedCar: carData[0],
  filter: 'all',
};

const carList = document.getElementById('car-list');
const bookingCard = document.getElementById('booking-card');
const summaryBadge = document.getElementById('summary-badge');
const summaryTitle = document.getElementById('summary-title');
const summaryPickup = document.getElementById('summary-pickup');
const summaryDates = document.getElementById('summary-dates');
const summaryRate = document.getElementById('summary-rate');
const summaryTotal = document.getElementById('summary-total');
const recentList = document.getElementById('recent-bookings-list');
const bookingModal = document.getElementById('booking-modal');
const bookingForm = document.getElementById('booking-form');
const searchButton = document.getElementById('search-button');
const vehicleType = document.getElementById('vehicle-type');
const pickupDate = document.getElementById('pickup-date');
const returnDate = document.getElementById('return-date');
const locationInput = document.getElementById('location');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);
}

function getNumberOfDays() {
  const start = new Date(pickupDate.value);
  const end = new Date(returnDate.value);
  const diff = end - start;
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function updateSummary() {
  const days = getNumberOfDays();
  const rate = state.selectedCar.rate;
  const total = rate * days;

  summaryBadge.textContent = state.selectedCar.type;
  summaryTitle.textContent = state.selectedCar.name;
  summaryPickup.textContent = locationInput.value || 'Manchester Airport';
  summaryDates.textContent = `${new Date(pickupDate.value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  })} – ${new Date(returnDate.value).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short',
  })}`;
  summaryRate.textContent = `${formatCurrency(rate)}/day`;
  summaryTotal.textContent = formatCurrency(total);
}

function renderRecentBookings() {
  recentList.innerHTML = recentBookings
    .map(
      (item) => `
        <li>
          <span>${item.name}</span>
          <strong>${item.amount}</strong>
        </li>
      `
    )
    .join('');
}

function renderCars() {
  const filtered = state.filter === 'all'
    ? carData
    : carData.filter((car) => car.type === state.filter);

  carList.innerHTML = filtered
    .map(
      (car) => `
        <article class="car-item ${state.selectedCar.id === car.id ? 'selected' : ''}" data-id="${car.id}">
          <div class="car-thumb" aria-hidden="true">${car.icon}</div>
          <div class="car-info">
            <div class="car-topline">
              <h4>${car.name}</h4>
              <span class="car-badge">${car.type}</span>
            </div>
            <div class="car-meta">
              <span>⭐ ${car.rating}</span>
              <span>${car.seats} seats</span>
              <span>${car.transmission}</span>
            </div>
            <div class="car-meta">
              <span>${car.fuel}</span>
              <span>${car.location}</span>
            </div>
          </div>
          <div class="car-price">
            <div class="price-amount">${formatCurrency(car.rate)} <small>/day</small></div>
            <button class="primary-button" type="button">Select</button>
          </div>
        </article>
      `
    )
    .join('');

  carList.querySelectorAll('.car-item').forEach((card) => {
    card.addEventListener('click', (event) => {
      const id = Number(card.dataset.id);
      const chosen = carData.find((car) => car.id === id);
      if (!chosen) return;
      state.selectedCar = chosen;
      renderCars();
      updateSummary();
    });
  });
}

function openModal() {
  bookingModal.classList.remove('hidden');
  bookingModal.setAttribute('aria-hidden', 'false');
}

function closeModal() {
  bookingModal.classList.add('hidden');
  bookingModal.setAttribute('aria-hidden', 'true');
}

searchButton.addEventListener('click', () => {
  state.filter = vehicleType.value;
  renderCars();
  updateSummary();
});

vehicleType.addEventListener('change', () => {
  state.filter = vehicleType.value;
  renderCars();
});

pickupDate.addEventListener('change', updateSummary);
returnDate.addEventListener('change', updateSummary);
locationInput.addEventListener('input', updateSummary);

document.getElementById('book-button').addEventListener('click', openModal);
document.getElementById('close-modal').addEventListener('click', closeModal);
bookingModal.addEventListener('click', (event) => {
  if (event.target === bookingModal) closeModal();
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const amount = formatCurrency(state.selectedCar.rate * getNumberOfDays());

  recentBookings.unshift({
    name: `${state.selectedCar.name} • ${state.selectedCar.type}`,
    amount,
    date: 'Just now',
  });

  renderRecentBookings();
  closeModal();
  bookingForm.reset();
  alert(`Booking confirmed for ${state.selectedCar.name}. Deposit paid: ${amount}`);
});

renderCars();
renderRecentBookings();
updateSummary();
