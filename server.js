const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const dataDir = path.join(__dirname, 'data');
const vehiclesPath = path.join(dataDir, 'vehicles.json');
const bookingsPath = path.join(dataDir, 'bookings.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const seedVehicles = [
  { id: 1, name: 'BMW X5', type: 'SUV', fuel: 'Hybrid', seats: 5, rate: 98, icon: '🚙', badge: 'Popular' },
  { id: 2, name: 'Mercedes C-Class', type: 'Luxury', fuel: 'Diesel', seats: 4, rate: 112, icon: '🏎️', badge: 'Luxury' },
  { id: 3, name: 'Tesla Model 3', type: 'Electric', fuel: 'Electric', seats: 5, rate: 89, icon: '⚡', badge: 'Eco' },
  { id: 4, name: 'VW Touran', type: 'Family', fuel: 'Petrol', seats: 7, rate: 74, icon: '🚐', badge: 'Family' },
];

const seedBookings = [
  { id: 1, customer: 'Jordan Doe', vehicle: 'BMW X5', pickup: 'Manchester Airport', total: 392, status: 'Upcoming' },
  { id: 2, customer: 'Alicia Green', vehicle: 'Tesla Model 3', pickup: 'Leeds Hub', total: 267, status: 'Completed' },
];

function ensureFile(filePath, defaultValue) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

function readJson(filePath, fallback) {
  ensureFile(filePath, fallback);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

ensureFile(vehiclesPath, seedVehicles);
ensureFile(bookingsPath, seedBookings);

app.use(express.json());
app.use(express.static(__dirname));

app.get('/api/vehicles', (req, res) => {
  const vehicles = readJson(vehiclesPath, seedVehicles);
  res.json(vehicles);
});

app.get('/api/bookings', (req, res) => {
  const bookings = readJson(bookingsPath, seedBookings);
  res.json(bookings);
});

app.post('/api/bookings', (req, res) => {
  const { fullName, email, licence, vehicleName, pickup, total, status = 'Upcoming' } = req.body;

  if (!fullName || !email || !licence || !vehicleName || !pickup || !total) {
    return res.status(400).json({ message: 'Missing required booking fields.' });
  }

  const bookings = readJson(bookingsPath, seedBookings);
  const newBooking = {
    id: Date.now(),
    customer: fullName,
    email,
    licence,
    vehicle: vehicleName,
    pickup,
    total,
    status,
  };

  bookings.unshift(newBooking);
  writeJson(bookingsPath, bookings);

  return res.status(201).json({ message: 'Booking confirmed.', booking: newBooking });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DriveNow app running on http://localhost:${PORT}`);
});
