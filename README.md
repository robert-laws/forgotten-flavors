# Forgotten Flavors

[![Deploy Pages](https://github.com/robert-laws/forgotten-flavors/actions/workflows/pages.yml/badge.svg)](https://github.com/robert-laws/forgotten-flavors/actions/workflows/pages.yml)
[![Live Site](https://img.shields.io/badge/GitHub%20Pages-Live-c98049?logo=github&logoColor=white)](https://robert-laws.github.io/forgotten-flavors/)

React + Vite + Material UI storefront prototype for inspired Roman and Greek "forgotten flavors" recipes.

Live site: [robert-laws.github.io/forgotten-flavors](https://robert-laws.github.io/forgotten-flavors/)

## Stack
- React 19
- Vite 7
- Material UI (MUI)

## Data
- `public/recipes.json`: recipe catalog rendered by the app

## Run Locally
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy
GitHub Pages is configured via `.github/workflows/pages.yml`.
The workflow runs `npm ci`, builds with Vite, and deploys `dist/`.
Production URL: [https://robert-laws.github.io/forgotten-flavors/](https://robert-laws.github.io/forgotten-flavors/)
