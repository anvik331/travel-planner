# Travel Planner

Travel Planner is a React + Vite web app for planning trips with friends. Users can add places they want to visit, organize them by priority, view places on a map, and use the app in English or Traditional Mandarin.

The goal is to make travel planning easier by combining a shared place list, Google Maps place details, ratings, notes, and a simple route order in one app.

## Project Idea

When planning a trip, people usually save places in different apps and use maps separately to search how to get to each spot. This project brings those planning pieces into one place.

Users will be able to:

- Add travel spots.
- View all spots on a list and map.
- Prioritize where they want to go.
- Categorize each spot.
- See Google place ratings and addresses.
- Switch between English and Traditional Mandarin.

This project starts without a login system. The first version focuses on the core planning structure and user interface.

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
- Check transportation time between spots.
- Convert the project to TypeScript later.
