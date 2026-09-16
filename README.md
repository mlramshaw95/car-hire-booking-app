# DriveNow car hire website

## Run locally

Use Node.js 18 or newer:

```bash
npm install
npm start
```

Open http://localhost:3000.

Demo admin account:

- Email: `admin@drive.now`
- Password: `admin123`

The app uses a small JSON data store in `data/app-data.json`, so it does not require native SQLite modules. Bookings, users, and payments are persisted locally.

If an old clone cannot check out because of a malformed filename, remove it and clone again after the repository has been repaired:

```bash
cd /home/michael
rm -rf car-hire-booking-app
git clone https://github.com/mlramshaw95/car-hire-booking-app.git
cd car-hire-booking-app
npm install
npm start
```
