# Travel Planner

Travel Planner is a React + Vite web app for planning trips with friends. Users can add places they want to visit, organize them by priority, view places on a map, and use the app in English or Traditional Mandarin.

The goal is to make travel planning easier by combining a shared place list, free map search, personal ratings, notes, and a simple route order in one app.

## Project Idea

When planning a trip, people usually save places in different apps and use maps separately to search how to get to each spot. This project brings those planning pieces into one place.

Users will be able to:

- Add travel spots.
- View all spots on a list and map.
- Prioritize where they want to go.
- Categorize each spot.
- See selected map addresses and add personal ratings.
- Switch between English and Traditional Mandarin.

This project starts without a login system. The first version focuses on the core planning structure and user interface.

## What It Can Do

- Pick spots from a free OpenStreetMap map.
- Search places with OpenStreetMap Nominatim.
- Save address and map location with each spot.
- Add your own personal rating for each place.
- Add trip spots with area, category, visit time, priority, and notes.
- Show all saved spots in a clean list.
- Delete spots you no longer need.
- Generate a simple suggested route by priority.
- Show quick stats for your current plan.
- Switch between English and Traditional Mandarin.

## Map Setup

The map uses Leaflet with OpenStreetMap tiles, so no Google account, billing, or API key is required.

Place search uses the public OpenStreetMap Nominatim service. Keep searches user-triggered and moderate, and show OpenStreetMap attribution.

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
  i18n.js
```

## Next Ideas

- Save spots to local storage.
- Add drag-and-drop route ordering.
- Add trip days and budgets.
- Check transportation time between spots.
- Convert the project to TypeScript later.
