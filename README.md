# FXBridge — IB Manager Dashboard

A frontend-only dashboard for an **Introducing Broker (IB) Manager** at a forex brokerage. Built with pure HTML, CSS, and JavaScript — no frameworks, no backend, no build tools required.

## Features

### Authentication
- **Login page** — email + password with inline validation and Enter key support
- **Sign Up page** — name, email, password (min. 8 characters) with success redirect
- User name is derived from the sign-up form or auto-formatted from the email address
- Session state stored in `sessionStorage`

### Dashboard
- **Sticky header** — displays the current date, user avatar (initials), name, and role
- **Sidebar navigation** — 10 links across 4 sections: Overview, Earnings, Growth, Account
- **Period tabs** — filter view by Today, This Month, Last Month, or YTD

### Widgets
| Widget | Description |
|---|---|
| KPI Cards | Total Clients, Commission Earned, Active Traders, Trading Volume — each with a vs-last-month delta |
| Top Clients by Volume | Table with avatar initials, lots traded, commission earned, and status pills |
| Commission Breakdown | Spread rebates, volume commission, sub-IB override, new client bonus + payout progress bar |
| Volume by Instrument | Horizontal bar chart for EUR/USD, GBP/USD, XAU/USD, USD/JPY, US30, and Other |
| Referral Link | One-click copy, link click / sign-up / deposit stats |
| Recent Alerts | Payout confirmations, KYC updates, referral activity |

## Project Structure

```
├── index.html    # Markup — all screens (login, sign up, dashboard)
├── styles.css    # All styles — variables, layout, components
└── app.js        # All JavaScript — routing, auth, UI interactions
```

## Getting Started

No installation needed. Open `index.html` directly in a browser, or serve it locally:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

### Login
Any email and password combination will work — authentication is simulated client-side.

## Tech Stack

- HTML5
- CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (ES6+)
- No dependencies, no build step
