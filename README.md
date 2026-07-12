# AssetFlow

AssetFlow is a polished asset and resource management dashboard for tracking company property, allocations, maintenance, bookings, audits, and activity logs in one place. It is built as a Vite + React single-page app with seeded demo data and role-aware navigation for common enterprise workflows.

## Features

- Role-based login and signup for Admin, Asset Manager, Department Head, and Employee users.
- Live dashboard with operational snapshots, asset status summaries, overdue items, maintenance counts, and department breakdowns.
- Asset directory for registering, filtering, searching, and reviewing assets by category, status, holder, and location.
- Allocation and transfer workflows for assigning assets to employees or departments.
- Resource booking, maintenance requests, audits, reports, and activity logs with notifications.
- Organization setup screens for departments, asset categories, and employee role management.
- Clean industrial-style UI with custom tags, charts, and responsive panels.

## Tech Stack

- React 18
- Vite
- Recharts
- lucide-react

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm

### Install dependencies

```bash
npm install
```

### Run the app locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Project Structure

- `main.jsx` mounts the React app.
- `AssetFlow.jsx` contains the full application UI, seeded data, and interactions.
- `index.html` provides the Vite entry point.
- `vite.config.js` contains the Vite configuration.

## Notes

- The app currently runs on seeded in-memory data, so changes are reset on refresh.
- Different navigation items appear depending on the signed-in user role.
- AssetFlow is designed as a demo and can be extended with a backend, persistence layer, or authentication provider later.
