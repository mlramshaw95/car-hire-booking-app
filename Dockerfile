const state = {
  user: null,
  vehicles: [],
  bookings: [],
  metrics: null,
  authMode: 'login'
};

const els = {
  authModal: document.getElementById('authModal'),
  authForm: document.getElementById('authForm'),
  nameRow: document.getElementById('nameRow'),
  nameInput: document.getElementById('nameInput'),
  emailInput: document.getElementById('emailInput'),
  passwordInput: document.getElementById('passwordInput'),
  authSubmit: document.getElementById('authSubmit'),
  loginToggle: document.getElementById('loginToggle'),
  signupToggle: document.getElementById('signupToggle'),
  logoutBtn: document.getElementById('logoutBtn'),
  vehicleGrid: document.getElementById('vehicleGrid'),
  vehicleSelect: document.getElementById('vehicleSelect'),
  bookingForm: document.getElementById('bookingForm'),
  pickupDate: document.getElementById('pickupDate'),
  returnDate: document.getElementById('returnDate'),
  bookingTotal: document.getElementById('bookingTotal'),
  bookingsList: document.getElementById('bookingsList'),
  adminPanel: document.getElementById('admin'),
  metricsGrid: document.getElementById('metricsGrid'),
  adminTableBody: document.getElementById('adminTableBody')
};

async function apiRequest(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
}

function formatMoney(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value || 0);
}

function calculateBookingTotal(vehicleId) {
  const vehicle = state.vehicles.find((item) => item.id === Number(vehicleId));
  const pickup = new Date(els.pickupDate.value);
  const returnDate = new Date(els.returnDate.value);
  if (!vehicle || !pickup || !returnDate || returnDate <= pickup) {
    return 0;
  }
  const days = Math.max(1, Math.ceil((returnDate - pickup) / 86400000));
  return vehicle.rate * days;
}

function renderVehicles() {
  els.vehicleGrid.innerHTML = state.vehicles
    .map(
      (vehicle) => `
        <article class="vehicle-card">
          <div class="vehicle-head">
            <div class="vehicle-symbol">${vehicle.icon}</div>
            <span class="vehicle-badge">${vehicle.badge}</span>
          </div>
          <div>
            <h3>${vehicle.name}</h3>
            <span class="vehicle-type">${vehicle.type} · ${vehicle.fuel}</span>
          </div>
          <div class="vehicle-meta-list">
            <span>Seats</span>
            <strong>${vehicle.seats}</strong>
          </div>
          <div class="vehicle-footer">
            <div class="price">${formatMoney(vehicle.rate)}<span>/day</span></div>
            <button class="primary-btn" data-select-vehicle="${vehicle.id}">Reserve</button>
          </div>
        </article>
      `
    )
    .join('');

  els.vehicleSelect.innerHTML = state.vehicles
    .map((vehicle) => `<option value="${vehicle.id}">${vehicle.name} — ${formatMoney(vehicle.rate)}/day</option>`)
    .join('');

  const buttons = document.querySelectorAll('[data-select-vehicle]');
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const id = Number(button.getAttribute('data-select-vehicle'));
      els.vehicleSelect.value = String(id);
      updateBookingTotal();
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function renderBookings() {
  if (!state.user) {
    els.bookingsList.innerHTML = '<p class="empty-state">Sign in to view your bookings.</p>';
    return;
  }

  if (!state.bookings.length) {
    els.bookingsList.innerHTML = '<p class="empty-state">No bookings yet. Reserve a vehicle to get started.</p>';
    return;
  }

  els.bookingsList.innerHTML = state.bookings
    .map(
      (booking) => `
        <div class="history-item">
          <strong>${booking.vehicle_name}</strong>
          <span>${booking.pickup_date} → ${booking.return_date}</span>
          <span>Total: ${formatMoney(booking.total)} · ${booking.status}</span>
        </div>
      `
    )
    .join('');
}

function renderMetrics() {
  if (!state.metrics) {
    return;
  }

  const metricCards = [
    { label: 'Active users', value: state.metrics.metrics.activeUsers },
    { label: 'Revenue', value: formatMoney(state.metrics.metrics.totalRevenue) },
    { label: 'Upcoming bookings', value: state.metrics.metrics.upcomingBookings }
  ];

  els.metricsGrid.innerHTML = metricCards
    .map(
      (card) => `
        <div class="metric-card">
          <span>${card.label}</span>
          <strong>${card.value}</strong>
        </div>
      `
    )
    .join('');

  els.adminTableBody.innerHTML = state.metrics.bookings
    .slice(0, 8)
    .map(
      (booking) => `
        <tr>
          <td>${booking.customer_name}</td>
          <td>${booking.vehicle_name}</td>
          <td>${booking.pickup_date}</td>
          <td>${booking.return_date}</td>
          <td>${formatMoney(booking.total)}</td>
          <td>${booking.status}</td>
        </tr>
      `
    )
    .join('');
}

function updateBookingTotal() {
  const total = calculateBookingTotal(els.vehicleSelect.value);
  els.bookingTotal.textContent = formatMoney(total);
}

function updateAuthView() {
  const isLoggedIn = Boolean(state.user);
  els.loginToggle.classList.toggle('hidden', isLoggedIn);
  els.signupToggle.classList.toggle('hidden', isLoggedIn);
  els.logoutBtn.classList.toggle('hidden', !isLoggedIn);
  els.authModal.classList.add('hidden');

  if (state.user) {
    els.loginToggle.textContent = state.user.name;
    els.signupToggle.textContent = 'My account';
  } else {
    els.loginToggle.textContent = 'Login';
    els.signupToggle.textContent = 'Sign up';
  }

  if (state.user && state.user.role === 'admin') {
    els.adminPanel.classList.add('visible');
    loadAdminMetrics();
  } else {
    els.adminPanel.classList.remove('visible');
  }
}

function openAuthModal(mode) {
  state.authMode = mode;
  els.authModal.classList.remove('hidden');
  els.nameRow.classList.toggle('hidden', mode !== 'signup');
  els.authSubmit.textContent = mode === 'signup' ? 'Create account' : 'Login';
  document.querySelectorAll('.tab-btn').forEach((button) => {
    const active = button.dataset.mode === mode;
    button.classList.toggle('active', active);
  });
}

function closeAuthModal() {
  els.authModal.classList.add('hidden');
}

async function loadUser() {
  try {
    const data = await apiRequest('/api/auth/me');
    state.user = data.user;
  } catch {
    state.user = null;
  }
}

async function loadVehicles() {
  const vehicles = await apiRequest('/api/vehicles');
  state.vehicles = vehicles;
  renderVehicles();
  updateBookingTotal();
}

async function loadBookings() {
  if (!state.user) {
    renderBookings();
    return;
  }

  try {
    const bookings = await apiRequest('/api/bookings');
    state.bookings = bookings;
  } catch (error) {
    console.error(error);
    state.bookings = [];
  }
  renderBookings();
}

async function loadAdminMetrics() {
  if (!state.user || state.user.role !== 'admin') {
    return;
  }

  try {
    const data = await apiRequest('/api/admin/metrics');
    state.metrics = data;
    renderMetrics();
  } catch (error) {
    console.error(error);
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const name = els.nameInput.value.trim();
  const email = els.emailInput.value.trim();
  const password = els.passwordInput.value;

  try {
    const endpoint = state.authMode === 'signup' ? '/api/auth/signup' : '/api/auth/login';
    const payload = state.authMode === 'signup'
      ? { name, email, password }
      : { email, password };

    const response = await apiRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    state.user = response.user;
    closeAuthModal();
    els.authForm.reset();
    updateAuthView();
    await loadBookings();
    if (state.user.role === 'admin') {
      await loadAdminMetrics();
    }
  } catch (error) {
    alert(error.message);
  }
}

async function handleBookingSubmit(event) {
  event.preventDefault();
  if (!state.user) {
    openAuthModal('login');
    return;
  }

  const payload = {
    vehicleId: Number(els.vehicleSelect.value),
    pickupDate: els.pickupDate.value,
    returnDate: els.returnDate.value,
    total: calculateBookingTotal(els.vehicleSelect.value)
  };

  try {
    await apiRequest('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    await loadBookings();
    alert('Booking confirmed successfully.');
    els.bookingForm.reset();
    updateBookingTotal();
  } catch (error) {
    alert(error.message);
  }
}

async function handleLogout() {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    state.user = null;
    state.bookings = [];
    state.metrics = null;
    updateAuthView();
    renderBookings();
    renderMetrics();
  } catch (error) {
    alert(error.message);
  }
}

els.loginToggle.addEventListener('click', () => openAuthModal('login'));
els.signupToggle.addEventListener('click', () => openAuthModal('signup'));
els.logoutBtn.addEventListener('click', handleLogout);
document.getElementById('closeModal').addEventListener('click', closeAuthModal);
els.authForm.addEventListener('submit', handleAuthSubmit);
els.bookingForm.addEventListener('submit', handleBookingSubmit);

document.querySelectorAll('.tab-btn').forEach((button) => {
  button.addEventListener('click', () => openAuthModal(button.dataset.mode));
});

els.pickupDate.addEventListener('input', updateBookingTotal);
els.returnDate.addEventListener('input', updateBookingTotal);
els.vehicleSelect.addEventListener('change', updateBookingTotal);

async function initializeApp() {
  await loadUser();
  await loadVehicles();
  await loadBookings();
  updateAuthView();
}

initializeApp();
