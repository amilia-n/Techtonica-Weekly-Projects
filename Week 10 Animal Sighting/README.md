# 🦁 Animal Sighting Tracker

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

> A full-stack PERN (PostgreSQL, Express, React, Node.js) application for tracking endangered animal species, individuals, and sightings. Built with modern web technologies and a focus on user experience.

## 🌍 About Endangered Species

An endangered species is one that is at high risk of extinction in the near future, either globally or within a specific region. Species become endangered due to factors such as habitat destruction, poaching, climate change, and invasive species. Conservation efforts, including legal protections, habitat restoration, and captive breeding programs, aim to prevent extinction.

### Conservation Status Categories

The International Union for Conservation of Nature (IUCN) Red List is the most recognized system for assessing species' conservation status:

| Status | Description |
|--------|-------------|
| Extinct (EX) | No individuals remain |
| Extinct in the Wild (EW) | Only survive in captivity |
| Critically Endangered (CR) | Extremely high risk of extinction |
| Endangered (EN) | Very high risk of extinction |
| Vulnerable (VU) | High risk of extinction |
| Near Threatened (NT) | Close to becoming threatened |
| Least Concern (LC) | No immediate risk |

Over 195 countries have committed to protecting endangered species through biodiversity action plans and conservation programs.

<div align="right">
  <em>Source: <a href="https://en.wikipedia.org/wiki/Endangered_species">Wikipedia - Endangered Species</a></em>
</div>

---

## ✨ Features

🦊 **Species Management**
- Track endangered species with detailed information
- Monitor conservation status and population data
- Scientific and common name tracking

🐘 **Individual Tracking**
- Monitor specific animals within each species
- Track individual histories and characteristics
- Link individuals to their species data

📸 **Sighting Records**
- Record and manage animal sightings
- Location tracking with flexible format
- Health status monitoring
- Image upload capabilities

🎨 **Modern UI/UX**
- Responsive design for all devices
- Intuitive tabbed interface
- Real-time form validation
- Search and filter functionality

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- 📦 Node.js (v14 or higher)
- 🐘 PostgreSQL (v12 or higher)
- 📥 npm or yarn package manager

### Quick Start Guide

1. **Clone & Navigate** 🔄
   ```bash
   git clone <your-repo-url>
   cd Week\ 10\ Animal\ Sighting
   ```

2. **Database Setup** 💾
   ```bash
   createdb endangered
   psql endangered < server/db/db.sql
   ```

3. **Server Configuration** ⚙️
   ```bash
   cd server
   npm install
   ```
   Create `.env` file:
   ```env
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=animal_sighting
   PORT=3000
   ```
   Start server:
   ```bash
   npm start
   ```

4. **Client Setup** 🖥️
   ```bash
   cd client
   npm install
   npm run dev
   ```

   🌐 Visit `http://localhost:5173` in your browser

---

## 📁 Project Structure

```
📦 animal-sighting-tracker
├── 📂 client/                # React frontend
│   ├── 📂 src/              # Source files
│   ├── 📂 public/           # Static files
│   └── 📄 package.json      # Frontend dependencies
├── 📂 server/               # Express backend
│   ├── 📂 db/              # Database scripts
│   ├── 📂 scripts/         # Utility scripts
│   └── 📄 package.json     # Backend dependencies
└── 📄 README.md            # Documentation
```

## 📊 Database Schema

The application uses PostgreSQL with three main tables to track endangered species and sightings:

### Species Table
```sql
CREATE TABLE species (
    id INT PRIMARY KEY,
    commonName TEXT NOT NULL,
    scientificName TEXT NOT NULL,
    conservationStatus TEXT NOT NULL,
    wildPopulation INT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Individuals Table
```sql
CREATE TABLE individuals (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL,
    species_id INT REFERENCES species(id),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Sightings Table
```sql
CREATE TABLE sightings (
    id SERIAL PRIMARY KEY,
    sighting_time TIMESTAMP NOT NULL,
    individual_id INT REFERENCES individuals(id),
    location TEXT NOT NULL,
    appeared_healthy BOOLEAN NOT NULL,
    sighter_email VARCHAR(255) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Database Setup
```bash
# Create the database
createdb endangered

# Import the schema and initial data
psql endangered < server/db/db.sql
```

The database includes initial data for:
- 15 endangered species with conservation status and population data
- 2 individuals per species (30 total)
- 5 sample sightings with location and health status

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/species` | Retrieve all species |
| POST | `/api/species` | Add a new species |
| GET | `/api/individuals` | Retrieve all individuals |
| POST | `/api/individuals` | Add a new individual |
| GET | `/api/sightings` | Retrieve all sightings |
| POST | `/api/sightings` | Add a new sighting |

## 🛠️ Tech Stack

### Frontend
- ⚛️ React
- ⚡ Vite
- 🎨 Modern CSS3
- 📱 Responsive Design

### Backend
- 🟢 Node.js
- ⚡ Express
- 🐘 PostgreSQL
- 🔄 pg-promise

## 👏 Attributions

### Icons
- 📸 [Add img icons](https://www.flaticon.com/free-icons/picture) by Superndre - Flaticon
- ✍️ [Edit icons](https://www.flaticon.com/free-icons/sentence) by Ranah Pixel Studio - Flaticon
- 🔍 [Search icons](https://www.flaticon.com/free-icons/discover) by Smashicons - Flaticon
- 🗑️ [Delete icons](https://www.flaticon.com/free-icons/uninstall) by Dreamcreateicons - Flaticon

### Images
- 🦁 Animal images sourced from [Animalia.bio](https://animalia.bio/)

### UI Components
- 📑 Tabbed container inspired by [Rafaela Lucas's CodePen](https://codepen.io/rafaelavlucas/pen/MLKGba)

## 🧪 Testing

```bash
# 🧪 Frontend tests
cd client && npm test

# 🔍 Backend tests
cd server && npm test
```

## 🤝 Contributing

1. 🔱 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎯 Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

<div align="center">
  Techtonica Week 10 Project
</div>
