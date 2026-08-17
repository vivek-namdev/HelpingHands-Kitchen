HelpingHands Kitchen

HelpingHands Kitchen is a full-stack MERN application designed to connect surplus food donors with NGOs so that edible food can be redirected to communities that need it.

The platform provides role-based workflows for Donors, NGOs, and Admins, including donor/NGO registration, food donation creation, map-based locations, donation claiming, claim tracking, and administrative monitoring.

🌱 Problem

Large amounts of edible food can go unused while communities and organizations continue to need food support.

HelpingHands Kitchen creates a digital bridge between:

Donors who have surplus edible food

NGOs that can collect and distribute it

Admins who manage the overall platform

The goal is simple: reduce food waste and help good food reach people who need it.

✨ Features

👤 Donor

Register and create a donor profile

Automatically link the donor profile to the logged-in account

Create food donations

Select pickup location using an interactive Leaflet map

Reverse-geocode selected locations using OpenStreetMap Nominatim

Set available date and time

Set food expiry duration

Add pickup instructions

View personal donation statistics

Track donation status

🏢 NGO

Register and create an NGO profile

Automatically link the NGO profile to the logged-in account

Browse available donations

Claim donations using the NGO's own linked profile ID

View claimed donations

Track pickup and delivery progress

View NGO-specific dashboard statistics

🛡️ Admin

Admin authentication

View donors

View NGOs

View donations

View claims

Monitor high-priority donations

View successful deliveries

Dashboard auto-refresh

Access platform-level statistics

📍 Interactive Location System

Leaflet + React Leaflet

Map centered on India by default

Click anywhere on the map to select a location

Marker appears at the selected point

Reverse geocoding through Nominatim

Stores address, latitude, and longitude

📧 Email Notifications

When an NGO successfully claims a donation, the backend can send an email notification to the donor using Nodemailer + Gmail SMTP.

The notification contains:

Donation ID

Food category

Quantity

NGO name

🔐 Authentication

The application includes:

Role-based authentication

Protected routes

Donor / NGO / Admin roles

Session-based frontend user state

sessionStorage for the current browser session

User profile refresh through /api/auth/me

📊 Google Sheets Sync

The backend includes Google Sheets synchronization utilities for operational data such as donor records.

🛠️ Tech Stack

Frontend

React.js

Vite

Tailwind CSS

React Router

Context API

Lucide React

Leaflet

React Leaflet

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT authentication

Nodemailer

Integrations / Deployment

OpenStreetMap Nominatim

Leaflet

Google Sheets

Vercel

Render

MongoDB Atlas

📁 Project Structure

HelpingHands-Kitchen/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── claims/
│   │   │   ├── dashboard/
│   │   │   ├── donations/
│   │   │   ├── donors/
│   │   │   ├── ngos/
│   │   │   └── layout/
│   │   │
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── index.html
│   └── package.json
│
└── README.md

🚀 Getting Started

1. Clone the repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd HelpingHands-Kitchen

2. Backend Setup

cd backend
npm install

Create backend/.env:

PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
CLIENT_URL=http://localhost:5173

Start the backend:

npm run dev

or:

npm start

Backend:

http://localhost:5000

3. Frontend Setup

cd frontend
npm install

Create frontend/.env:

VITE_API_URL=http://localhost:5000/api

Start the frontend:

npm run dev

Frontend:

http://localhost:5173

🗺️ Map Setup

Install the map packages:

npm install leaflet react-leaflet

Import Leaflet CSS in the frontend entry file:

import "leaflet/dist/leaflet.css";

The application uses Nominatim reverse geocoding:

https://nominatim.openstreetmap.org/reverse

No API key is required for this integration.

🔐 User Roles

Role

Main Responsibilities

Donor

Register, create donations, manage own donations

NGO

Register, browse donations, claim food, track claims

Admin

Manage and monitor the platform

Donor rule

A logged-in donor cannot choose another donor while creating a donation. The donation uses the donor's linked:

user.profileId

NGO rule

A logged-in NGO cannot choose another NGO while claiming a donation. Claims use the NGO's linked:

user.profileId

📦 Donation Workflow

Donor registers
       ↓
Donor profile created
       ↓
Donor profile ID linked to User
       ↓
Donor creates donation
       ↓
Donation becomes Available
       ↓
NGO views donation
       ↓
NGO claims donation
       ↓
Claim created
       ↓
Donor receives notification
       ↓
Pickup coordinated
       ↓
Food delivered

📍 Donation Location Workflow

User opens donation form
        ↓
Map displayed
        ↓
User clicks location
        ↓
Marker placed
        ↓
Latitude + Longitude captured
        ↓
Nominatim reverse geocoding
        ↓
Address returned
        ↓
Address + coordinates stored

Donation records can store:

Location
Latitude
Longitude

⏰ Donation Availability

The donation form automatically initializes Available From to the current local date and time.

The user can define an expiry duration in hours.

Expiry Time = Available From + Expiry Hours

📧 Claim Email Notification

When a claim is successfully created, the backend can:

Find the donor's linked User account

Read the donor email

Build the claim notification template

Send the email using Nodemailer

Example subject:

Your donation DON600001 has been claimed — HelpingHands Kitchen

🌐 Deployment

The project is designed to be deployed as:

Frontend → Vercel
Backend  → Render
Database → MongoDB Atlas

Example deployment URLs used during development:

Backend:
https://foodbridge-backend-7bdz.onrender.com

Frontend:
https://food-bridge-neon-ten.vercel.app/landing

Update these URLs if your deployments change.

🔑 Environment Variables

Backend

Never commit secrets to GitHub.

PORT=5000
MONGODB_URI=...
JWT_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
CLIENT_URL=...

Frontend

VITE_API_URL=...

🎨 Design System

HelpingHands Kitchen uses a green + blue role-based visual language:

Green  → Donors / Food / Sustainability
Blue   → NGOs / Community / Claims
Purple → Admin
Orange → Warning / Priority
Red    → Errors / Expired
Slate  → Neutral UI
Navy   → Public landing page

Primary colors:

Green:       #22C55E
Dark Green:  #16A34A
Blue:        #3B82F6
Dark Blue:   #2563EB
Purple:      #8B5CF6
Navy:        #0A1628
Background:  #F8FAFC

🖼️ Public Landing Page

The public landing page is available at:

/landing

It includes:

HelpingHands Kitchen branding

Hero section

Donor / NGO role selection

Impact statistics

Interactive workflow

Food network visualization

Impact calculator

Community stories

FAQ

Registration CTAs

Unauthenticated users are directed to the landing page before accessing protected application pages.

🔒 Security Notes

Do not commit:

.env
credentials.json
MongoDB credentials
JWT secrets
Gmail passwords / app passwords
Google service-account private keys

Use environment variables or deployment secrets instead.

🧪 Development

Run the backend and frontend separately.

Backend

cd backend
npm install
npm run dev

Frontend

cd frontend
npm install
npm run dev

🚧 Future Improvements

Possible next steps:

Real-time notifications

Real-time donation map

Pickup tracking

NGO verification

Push notifications

Donation analytics

Food waste impact reporting

Delivery partner integration

Mobile application

Improved accessibility

Automated expiry notifications

🤝 Contributing

Contributions are welcome.

git checkout -b feature/your-feature

Make your changes, test them, then:

git add .
git commit -m "Add your feature"
git push origin feature/your-feature

Then create a Pull Request on GitHub.

📄 License

This project is currently maintained as a personal / educational full-stack project.

Add a formal open-source license such as MIT if you intend to publish the repository under a standard open-source license.

❤️ HelpingHands Kitchen

Reducing waste. Feeding hope. Connecting communities.

Good food should have a better destination than the trash.
