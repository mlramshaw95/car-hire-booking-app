const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 3000);
const dataDir = path.join(__dirname, 'data');
const dataFile = path.join(dataDir, 'app-data.json');

const seed = {
  users: [],
  vehicles: [
    { id: 1, name: 'BMW X5', type: 'SUV', fuel: 'Hybrid', seats: 5, rate: 98, icon: '🚙', badge: 'Popular' },
    { id: 2, name: 'Mercedes C-Class', type: 'Luxury', fuel: 'Diesel', seats: 4, rate: 112, icon: '🏎️', badge: 'Luxury' },
    { id: 3, name: 'Tesla Model 3', type: 'Electric', fuel: 'Electric', seats: 5, rate: 89, icon: '⚡', badge: 'Eco' },
    { id: 4, name: 'VW Touran', type: 'Family', fuel: 'Petrol', seats: 7, rate: 74, icon: '🚐', badge: 'Family' }
  ],
  bookings: [],
  payments: []
};

fs.mkdirSync(dataDir, { recursive: true });
if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(seed, null, 2));

function readData() {
  return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}
function writeData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}
function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}
function requireAuth(req, res, next) {
  if (req.session.user) return next();
  return res.status(401).json({ message: 'Please log in first.' });
}
function requireAdmin(req, res, next) {
  if (req.session.user?.role === 'admin') return next();
  return res.status(403).json({ message: 'Admin access required.' });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'drive-now-development-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 12 * 60 * 60 * 1000 }
}));

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.get('/api/auth/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: 'Not logged in.' });
  res.json({ user: req.session.user });
});

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: 'Name, email, and a password of at least 6 characters are required.' });
  }
  const data = readData();
  const normalizedEmail = email.trim().toLowerCase();
  if (data.users.some((user) => user.email === normalizedEmail)) {
    return res.status(409).json({ message: 'That email is already registered.' });
  }
  const user = { id: Date.now(), name: name.trim(), email: normalizedEmail, passwordHash: await bcrypt.hash(password, 10), role: 'user' };
  data.users.push(user);
  writeData(data);
  req.session.user = publicUser(user);
  res.status(201).json({ user: req.session.user });
});

app.post('/api/auth/login', async (req, res) => {
  const data = readData();
  const email = String(req.body.email || '').trim().toLowerCase();
  const user = data.users.find((item) => item.email === email);
  if (!user || !(await bcrypt.compare(String(req.body.password || ''), user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }
  req.session.user = publicUser(user);
  res.json({ user: req.session.user });
});

app.post('/api/auth/logout', (req, res) => req.session.destroy(() => res.json({ message: 'Logged out.' })));
app.get('/api/vehicles', (req, res) => res.json(readData().vehicles));

app.get('/api/bookings', requireAuth, (req, res) => {
  const data = readData();
  const bookings = data.bookings.filter((booking) => booking.userId === req.session.user.id).map((booking) => ({
    ...booking,
    vehicle_name: data.vehicles.find((vehicle) => vehicle.id === booking.vehicleId)?.name || 'Vehicle'
  }));
  res.json(bookings);
});

app.post('/api/bookings', requireAuth, (req, res) => {
  const { vehicleId, pickup, dates, total } = req.body;
  const data = readData();
  const vehicle = data.vehicles.find((item) => item.id === Number(vehicleId));
  if (!vehicle || !pickup || !dates || !Number(total)) return res.status(400).json({ message: 'Valid booking details are required.' });
  const booking = { id: Date.now(), userId: req.session.user.id, vehicleId: vehicle.id, pickup, dates, total: Number(total), status: 'Upcoming', createdAt: new Date().toISOString() };
  data.bookings.unshift(booking);
  writeData(data);
  res.status(201).json({ booking });
});

app.post('/api/payments', requireAuth, (req, res) => {
  const data = readData();
  const booking = data.bookings.find((item) => item.id === Number(req.body.bookingId) && item.userId === req.session.user.id);
  if (!booking) return res.status(404).json({ message: 'Booking not found.' });
  booking.status = 'Confirmed';
  data.payments.push({ id: Date.now(), bookingId: booking.id, userId: req.session.user.id, amount: Number(req.body.amount), status: 'Paid' });
  writeData(data);
  res.status(201).json({ payment: data.payments.at(-1) });
});

app.get('/api/admin/metrics', requireAuth, requireAdmin, (req, res) => {
  const data = readData();
  const bookings = data.bookings.map((booking) => ({
    ...booking,
    customer_name: data.users.find((user) => user.id === booking.userId)?.name || 'Customer',
    vehicle_name: data.vehicles.find((vehicle) => vehicle.id === booking.vehicleId)?.name || 'Vehicle'
  }));
  res.json({
    metrics: {
      activeUsers: data.users.length,
      totalRevenue: bookings.reduce((sum, booking) => sum + booking.total, 0),
      upcomingBookings: bookings.filter((booking) => booking.status === 'Upcoming').length
    },
    bookings
  });
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

(async () => {
  const data = readData();
  if (!data.users.some((user) => user.email === 'admin@drive.now')) {
    data.users.push({ id: 1, name: 'Admin User', email: 'admin@drive.now', passwordHash: await bcrypt.hash('admin123', 10), role: 'admin' });
    writeData(data);
  }
  app.listen(port, () => console.log(`DriveNow is running at http://localhost:${port}`));
})();
