# Trip Planner

A beginner-friendly React + Vite starter app for planning places to visit.

## What It Can Do

- Pick spots from Google Maps using the Places API.
- Save Google place rating, address, and map location with each spot.
- Add trip spots with area, category, visit time, priority, and notes.
- Show all saved spots in a clean list.
- Delete spots you no longer need.
- Generate a simple suggested route by priority.
- Show quick stats for your current plan.
- Switch between English and Traditional Mandarin.

## Google Maps Setup

Create a `.env` file in the project root:

```bash
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

In Google Cloud, enable these APIs for the key:

- Maps JavaScript API
- Places API
- Geocoding API

Restart the dev server after adding the key:

```bash
npm run dev
```

## Run The Project

```bash
npm install
npm run dev
```

Then open the local URL shown in your terminal.

## Project Structure

```text
src/
  App.jsx
  App.css
  main.jsx
  components/
    SpotForm.jsx
    SpotList.jsx
    PlanSummary.jsx
    MapPicker.jsx
  data/
    sampleSpots.js
  utils/
    googleMaps.js
  i18n.js
```

## Next Ideas

- Save spots to local storage.
- Add drag-and-drop route ordering.
- Add trip days and budgets.
- Convert the project to TypeScript later.
