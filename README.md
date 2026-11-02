# Seedling – Garden Planner, LocalStorage CRUD & Weather API (Assignment 03)

Seedling is a responsive React web application rewritten from the static multi-page project, extended with **Task 1: JavaScript CRUD Operations & Local Storage** and **Task 2: Free Public API Integration with Axios**.

## Features

### 1. Task 1: Garden Bed & Plant Records CRUD (Local Storage)
- **Create**: Add new plant/crop records (name, category, garden bed, sow date, harvest days, watering frequency, frost sensitivity, companion notes).
- **Read**: Dynamic card grid and structured table views displaying all stored crops with badges and stats.
- **Update**: Full modal edit functionality to modify existing crop records.
- **Delete**: Remove individual plant records with confirmation safeguard.
- **Local Storage Persistence**: Uses `localStorage.getItem('seedling_garden_records')` and `localStorage.setItem(...)` so that all data remains available across page refreshes or browser reopens. Includes realistic starter demo seeds.
- **Search & Filter**:
  - Live search across crop names, bed locations, and notes.
  - Category filters: Vegetables, Herbs, Fruits, Flowers.
  - Growth stage filters: Sown, Seedling, Growing, Ready to Harvest.
  - Bed location selector.
  - Sorting by Sow Date, Name (A-Z), and Days to Harvest.
- **JavaScript Array Methods Compliance**:
  - `filter()`: Search and multi-criteria category/status/bed filtering.
  - `find()`: Locate individual records for edit modal hydration.
  - `map()`: Dynamic UI rendering and statistics calculation.
  - `some()`: Duplicate crop detection per bed.
  - `every()`: Form validation checks.

### 2. Task 2: Free Public API Integration via Axios
- **API**: Open-Meteo Weather Forecast API (`https://api.open-meteo.com/v1/forecast`), 100% free with no API key requirement.
- **Axios**: Asynchronous `axios.get()` with loading spinners, error alerts, and refresh functionality.
- **Dynamic Climate Dashboard**:
  - Live temperature, relative humidity, wind speed, and precipitation.
  - Location switcher (Faisalabad, Lahore, Islamabad, London, New York, Tokyo, Sydney, Berlin).
  - Automated **Frost Alert System** that warns when nighttime lows dip to $\le$ 2°C to protect tender seedlings.
  - **Smart Watering Advice** computed from 72-hour rainfall accumulation.
  - 7-day forecast cards with high/low temperatures, weather icons, rain probabilities, and detailed data table.

### 3. Preserved Original Brand & Pages
- **Home**: Hero with interactive weekly chore checklist (with dynamic progress calculation and task addition), stats, 3 feature pillars, 3-step guide, testimonials, interactive FAQ accordion, newsletter subscription.
- **About**: Origin story, mission, achievement progress bars, core values, journey timeline, team member cards, founder quote.
- **Contact**: Interactive contact message form with validation, office details (Faisalabad), support hours table, social links, map placeholder.
- **Sign In**: Member login with Google/GitHub social auth simulations, show/hide password toggle, remember me checkbox.
- **Sign Up**: Account creation with dynamic password strength meter ('Weak', 'Fair', 'Good', 'Strong'), confirmation validation, terms agreement.

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Bundler & Dev Server**: Vite 6 (host `0.0.0.0`, port `3000`)
- **Styling**: Tailwind CSS v4 with custom Seedling palette (`leaf`, `sun`, `clay`) and fonts (`Bricolage Grotesque`, `Source Sans 3`)
- **HTTP Client**: Axios (`axios.get`)
- **Icons**: Lucide React
- **Storage**: Browser `localStorage`

## Development
```bash
npm install
npm run dev
```
Dev server listens on `http://0.0.0.0:3000`.
