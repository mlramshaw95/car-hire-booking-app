const state = {
  vehicles: [],
  bookings: [],
  user: null,
  activeFilter: 'Popular',
};

const authScreen = document.getElementById('auth-screen');
const appShell = document.getElementById('app-shell');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const vehicleList = document.getElementById('vehicle-list');
const bookingList = document.getElementById('booking-list');
const adminBookingList = document.getElementById('admin-booking-list');
const tabs = document.querySelectorAll('.tab');
const navButtons = document.querySelectorAll('.nav-button');
const screens = document.querySelectorAll('.screen');
const checkoutModal = document.getElementById('checkout-modal');
const closeModalBtn = document.getElementById('close-modal');
const bookingForm = document.getElementById('booking-form');
const logoutBtn = document.getElementById('logout-btn');
const headerName = document.getElementById('header-name');
const profileName = document.getElementById('profile-name');
const profileRole = document.getElementById('profile-role');
const adminNavBtn = document.getElementById('admin-nav-btn');

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function showScreen(target) {
  screens.forEach((screen) => {
    screen.classList.toggle('active', screen.dataset.screen === target);
  });

  navButtons.forEach((button) => {
    const isActive = button.dataset.target === target;
    button.classList.toggle('active', isActive);
  });
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
}

async function loadUser() {
  try {
    const data = await fetchJson('/api/auth/me');
    state.user = data.user;
    updateUserView();
    await Promise.all([loadVehicles(), loadBookings()]);
    if (state.user.role === 'admin') {
      await loadAdminMetrics();
      adminNavBtn.classList.remove('hidden');
    } else {
      adminNavBtn.classList.add('hidden');
    }
    authScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
  } catch (error) {
    authScreen.classList.remove('hidden');
    appShell.classList.add('hidden');
  }
}

async function loadVehicles() {
  const data = await fetchJson('/api/vehicles');
  state.vehicles = data;
  renderVehicles();
}

async function loadBookings() {
  try {
    const data = await fetchJson('/api/bookings');
    state.bookings = data;
    renderBookings();
  } catch (error) {
    state.bookings = [];
    renderBookings();
  }
}

async function loadAdminMetrics() {
  try {
    const data = await fetchJson('/api/admin/metrics');
    const { metrics, bookings } = data;
    document.getElementById('metric-revenue').textContent = formatCurrency(metrics.totalRevenue);
    document.getElementById('metric-users').textContent = String(metrics.activeUsers);
    document.getElementById('metric-upcoming').textContent = String(metrics.upcomingBookings);

    adminBookingList.innerHTML = bookings.slice(0, 5).map((booking) => `
      <div class="admin-list-item">
        <div>
          <strong>${booking.vehicle_name}</strong><br>
          <small>${booking.customer_name}</small>
        </div>
        <span>${booking.status}</span>
      </div>
    `).join('');
  } catch (error) {
    console.error('Admin metrics failed:', error);
  }
}

function renderVehicles() {
  const filtered = state.activeFilter === 'Popular'
    ? state.vehicles
    : state.vehicles.filter((vehicle) => vehicle.type === state.activeFilter || vehicle.badge === state.activeFilter);

  vehicleList.innerHTML = filtered.map((vehicle) => `
    <article class="vehicle-card">
      <div class="vehicle-emoji">${vehicle.icon}</div>
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

  vehicleList.querySelectorAll('.select-btn').forEach((button) => {
    button.addEventListener('click', () => {
      const selectedVehicle = state.vehicles.find((vehicle) => vehicle.id === Number(button.dataset.id));
      if (!selectedVehicle) return;
      document.querySelector('.modal-card h3').textContent = `Reserve ${selectedVehicle.name}`;
      const total = selectedVehicle.rate * 4;
      document.getElementById('modal-total').textContent = formatCurrency(total);
      checkoutModal.dataset.vehicleId = String(selectedVehicle.id);
      checkoutModal.dataset.total = String(total);
      checkoutModal.classList.remove('hidden');
      checkoutModal.setAttribute('aria-hidden', 'false');
    });
  });
}

function renderBookings() {
  if (!state.bookings.length) {
    bookingList.innerHTML = '<div class="trip-card"><p>No bookings yet.</p></div>';
    return;
  }

  bookingList.innerHTML = state.bookings.map((booking) => `
    <div class="trip-card ${booking.status === 'Upcoming' ? 'active-trip' : ''}">
      <div class="trip-topline">
        <div>
          <span class="trip-status ${booking.status === 'Confirmed' || booking.status === 'Completed' ? 'muted' : ''}">${booking.status}</span>
          <h4>${booking.pickup}</h4>
        </div>
        <span class="trip-badge ${booking.status === 'Confirmed' ? 'alt' : ''}">${booking.vehicle_name || booking.vehicle}</span>
      </div>
      <div class="trip-details">
        <span>${booking.dates || 'Booking'}</span>
        <span>${booking.customer_name || state.user?.name || 'Driver'}</span>
      </div>
      <div class="trip-price">${formatCurrency(booking.total)} total</div>
    </div>
  `).join('');
}

function updateUserView() {
  if (!state.user) return;
  headerName.textContent = `Hi, ${state.user.name.split(' ')[0]}`;
  profileName.textContent = state.user.name;
  profileRole.textContent = state.user.role === 'admin' ? 'Admin account' : 'Gold member';
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.toggle('active', item === tab));
    state.activeFilter = tab.textContent.trim();
    renderVehicles();
  });
});

navButtons.forEach((button) => {
  button.addEventListener('click', () => {
    showScreen(button.dataset.target);
  });
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const payload = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const data = await fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    state.user = data.user;
    updateUserView();
    await Promise.all([loadVehicles(), loadBookings()]);
    if (state.user.role === 'admin') {
      await loadAdminMetrics();
      adminNavBtn.classList.remove('hidden');
    }
    authScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
    showScreen('home');
  } catch (error) {
    alert(error.message);
  }
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(signupForm);
  const payload = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  try {
    const data = await fetchJson('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    state.user = data.user;
    updateUserView();
    await Promise.all([loadVehicles(), loadBookings()]);
    authScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
    showScreen('home');
  } catch (error) {
    alert(error.message);
  }
});

logoutBtn.addEventListener('click', async () => {
  try {
    await fetchJson('/api/auth/logout', { method: 'POST' });
    state.user = null;
    authScreen.classList.remove('hidden');
    appShell.classList.add('hidden');
    signupForm.reset();
    loginForm.reset();
  } catch (error) {
    alert(error.message);
  }
});

document.querySelectorAll('.toggle-button').forEach((button) => {
  button.addEventListener('click', () => {
    const mode = button.dataset.mode;
    document.querySelectorAll('.toggle-button').forEach((item) => item.classList.toggle('active', item === button));
    const isLogin = mode === 'login';
    loginForm.classList.toggle('hidden', !isLogin);
    signupForm.classList.toggle('hidden', isLogin);
  });
});

closeModalBtn.addEventListener('click', () => {
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
    vehicleId: Number(checkoutModal.dataset.vehicleId),
    pickup: 'Manchester Airport',
    dates: '17 Sep - 21 Sep',
    total: Number(checkoutModal.dataset.total || 392),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    licence: formData.get('licence'),
  };

  try {
    const bookingResult = await fetchJson('/api/bookings', {
      method: 'POST',
      body: JSON.stringify({
        vehicleId: payload.vehicleId,
        pickup: payload.pickup,
        dates: payload.dates,
        total: payload.total,
      }),
    });

    await fetchJson('/api/payments', {
      method: 'POST',
      body: JSON.stringify({
        bookingId: bookingResult.booking.id,
        amount: payload.total,
      }),
    });

    checkoutModal.classList.add('hidden');
    checkoutModal.setAttribute('aria-hidden', 'true');
    bookingForm.reset();
    alert('Booking confirmed and payment processed.');
    await loadBookings();
    if (state.user?.role === 'admin') await loadAdminMetrics();
  } catch (error) {
    alert(error.message);
  }
});

loadUser();
showScreen('home');
