const vehicles = [
  { id: 1, name: 'BMW X5', type: 'SUV', fuel: 'Hybrid', seats: 5, rate: 98, icon: '🚙', badge: 'Popular' },
  { id: 2, name: 'Mercedes C-Class', type: 'Luxury', fuel: 'Diesel', seats: 4, rate: 112, icon: '🏎️', badge: 'Luxury' },
  { id: 3, name: 'Tesla Model 3', type: 'Electric', fuel: 'Electric', seats: 5, rate: 89, icon: '⚡', badge: 'Eco' },
  { id: 4, name: 'VW Touran', type: 'Family', fuel: 'Petrol', seats: 7, rate: 74, icon: '🚐', badge: 'Family' },
];

const vehicleList = document.getElementById('vehicle-list');
const navButtons = document.querySelectorAll('.nav-button');
const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const checkoutModal = document.getElementById('checkout-modal');
const closeModal = document.getElementById('close-modal');
const bookingForm = document.getElementById('booking-form');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
}

function renderVehicles(filter = 'Popular') {
  const current = filter === 'Popular' ? vehicles : vehicles.filter(item => item.type === filter || item.badge === filter);

  vehicleList.innerHTML = current.map(vehicle => `
    <article class="vehicle-card">
      <div class="vehicle-emoji" aria-hidden="true">${vehicle.icon}</div>
      <div class="vehicle-main">
        <div class="vehicle-head">
          <h4>${vehicle.name}</h4>
          <span class="field-badge">${vehicle.badge}</span>
        </div>
        <div class="vehicle-meta">
          <span>${vehicle.type}</span>
          <span>${vehicle.seats} seats</span>
          <span>${vehicle.fuel}</span>
        </div>
      </div>
      <div class="vehicle-price">
        <div class="price-value">${formatCurrency(vehicle.rate)}<small>/day</small></div>
        <button class="select-btn" type="button" data-id="${vehicle.id}">Select</button>
      </div>
    </article>
  `).join('');

  document.querySelectorAll('.select-btn').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const selected = vehicles.find(vehicle => vehicle.id === id);
      if (!selected) return;
      document.querySelector('.modal-card h3').textContent = `Reserve ${selected.name}`;
      document.querySelector('.checkout-details strong:nth-of-type(3)').textContent = formatCurrency(selected.rate * 4);
      checkoutModal.classList.remove('hidden');
      checkoutModal.setAttribute('aria-hidden', 'false');
    });
  });
}

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const target = button.dataset.target;
    screens.forEach(screen => {
      screen.classList.toggle('active', screen.dataset.screen === target);
    });

    navButtons.forEach(item => item.classList.toggle('active', item === button));
  });
});

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(item => item.classList.toggle('active', item === tab));
    const filter = tab.textContent.trim();
    renderVehicles(filter === 'Popular' ? 'Popular' : filter);
  });
});

closeModal.addEventListener('click', () => {
  checkoutModal.classList.add('hidden');
  checkoutModal.setAttribute('aria-hidden', 'true');
});

checkoutModal.addEventListener('click', (event) => {
  if (event.target === checkoutModal) {
    checkoutModal.classList.add('hidden');
    checkoutModal.setAttribute('aria-hidden', 'true');
  }
});

bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  checkoutModal.classList.add('hidden');
  checkoutModal.setAttribute('aria-hidden', 'true');
  alert('Booking reserved successfully. Your confirmation has been sent by email.');
});

renderVehicles();
