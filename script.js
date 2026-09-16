const vehicles = [];
const vehicleList = document.getElementById('vehicle-list');
const navButtons = document.querySelectorAll('.nav-button');
const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const checkoutModal = document.getElementById('checkout-modal');
const closeModal = document.getElementById('close-modal');
const bookingForm = document.getElementById('booking-form');
const tripList = document.querySelector('.screen[data-screen="bookings"]');
const recentBookings = [];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 }).format(value);
}

async function loadVehicles() {
  try {
    const response = await fetch('/api/vehicles');
    if (!response.ok) throw new Error('Could not load vehicles');
    const data = await response.json();
    vehicles.splice(0, vehicles.length, ...data);
    renderVehicles();
  } catch (error) {
    console.error(error);
    alert('Unable to load vehicles from the server.');
  }
}

async function loadBookings() {
  try {
    const response = await fetch('/api/bookings');
    if (!response.ok) throw new Error('Could not load bookings');
    const data = await response.json();
    recentBookings.splice(0, recentBookings.length, ...data);
    renderBookings();
  } catch (error) {
    console.error(error);
  }
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
      const total = selected.rate * 4;
      const totalEl = document.querySelector('.checkout-details strong:last-of-type');
      if (totalEl) totalEl.textContent = formatCurrency(total);
      checkoutModal.classList.remove('hidden');
      checkoutModal.setAttribute('aria-hidden', 'false');
      checkoutModal.dataset.vehicleId = String(selected.id);
      checkoutModal.dataset.vehicleName = selected.name;
      checkoutModal.dataset.vehicleRate = String(selected.rate);
    });
  });
}

function renderBookings() {
  const cards = recentBookings.slice(0, 3).map(booking => `
    <div class="trip-card ${booking.status === 'Upcoming' ? 'active-trip' : ''}">
      <div class="trip-topline">
        <div>
          <span class="trip-status ${booking.status === 'Completed' ? 'muted' : ''}">${booking.status}</span>
          <h4>${booking.pickup}</h4>
        </div>
        <span class="trip-badge ${booking.status === 'Completed' ? 'alt' : ''}">${booking.vehicle}</span>
      </div>
      <div class="trip-details">
        <span>Reservation</span>
        <span>${booking.customer}</span>
      </div>
      <div class="trip-price">${formatCurrency(booking.total)} total</div>
    </div>
  `).join('');

  const bookingsScreen = document.querySelector('.screen[data-screen="bookings"]');
  if (bookingsScreen) {
    const tripCards = bookingsScreen.querySelectorAll('.trip-card');
    if (tripCards.length) {
      tripCards.forEach(card => card.remove());
    }
    const header = bookingsScreen.querySelector('.section-header');
    if (header) {
      header.insertAdjacentHTML('afterend', cards);
    }
  }
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

bookingForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const formData = new FormData(bookingForm);
  const payload = {
    fullName: formData.get('fullName') || 'Jordan Doe',
    email: formData.get('email') || 'jordan@example.com',
    licence: formData.get('licence') || 'MANC-234-789',
    vehicleName: checkoutModal.dataset.vehicleName || 'BMW X5',
    pickup: 'Manchester Airport',
    total: Number(checkoutModal.dataset.vehicleRate || 98) * 4,
    status: 'Upcoming',
  };

  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Booking failed');
    }

    checkoutModal.classList.add('hidden');
    checkoutModal.setAttribute('aria-hidden', 'true');
    bookingForm.reset();
    await loadBookings();
    alert('Booking reserved successfully. Your confirmation has been sent by email.');
  } catch (error) {
    console.error(error);
    alert(error.message || 'Unable to complete booking.');
  }
});

loadVehicles();
loadBookings();
