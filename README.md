# Sahyog Portal — Statutory VASP Requisition Gateway

> **National Cybercrime Investigation & Law Enforcement Agency (LEA) Portal for Information Disclosure Requisitions to Virtual Asset Service Providers (VASPs).**

---

## 📌 Overview

**Sahyog Portal** is a high-fidelity simulation and integration gateway for Law Enforcement Agencies (LEAs) to serve statutory preservation notices and disclosure orders (under Section 91 CrPC / Section 94 BNSS / Section 69B IT Act) to Virtual Asset Service Providers (VASPs).

Designed to integrate directly with **Sahyog Kryptos** (automated multi-hop blockchain intelligence & wallet-to-VASP attribution engine), this portal enables investigating officers to seamlessly transition from on-chain suspect wallet traces to legal requisitions sent to domestic and international crypto exchanges.

---

## 🚀 Key Features

- 🔐 **Law Enforcement Authentication (`1.html`)**
  - High-fidelity official government portal interface.
  - Interactive math CAPTCHA generator with real-time canvas rendering and refresh.
  - Client-side credential authentication with role-based session tokens.
  - Demo quick-fill credentials for evaluation: `officer@sahyog.gov.in` / `Sahyog@2026`.

- 🛡️ **Session Management & Auth Guard (`js/auth-guard.js`)**
  - Enforces route protection on statutory requisition dispatch views.
  - Automatically loads and hydrates officer profile data across pages.

- 📜 **Statutory Requisition Gateway (`send.html`)**
  - Section 91 CrPC / Section 94 BNSS statutory notice generator.
  - Dynamic VASP intermediary registry loaded from [`data/intermediaries.json`](data/intermediaries.json).
  - Pre-mapped VASP legal compliance desks: **Binance, CoinDCX, WazirX, CoinSwitch, ZebPay, Mudrex, Bybit, KuCoin, OKX, Kraken**.
  - Specialized cryptocurrency intelligence fields mapped to **Sahyog Kryptos** forensic reports:
    - Crime Category (Ransomware, Darknet, Ponzi/Investment Scam, Money Laundering, Cyber Extortion, etc.)
    - Suspect Wallet Address & Blockchain Network (TRC-20, ERC-20, BTC, BSC, SOL)
    - Nearest Attributed VASP & Target Deposit Address
    - Attributed Transaction Hash (TxID)
    - Hop Count & VASP Attribution Confidence Score
    - Inflow Value (USDT / INR Equivalent)
    - Blockchain Explorer Verification URL
    - Statutory Compliance Deadline & Fast-Track Freeze order toggle
    - Evidence dossier PDF upload and dynamic statutory notice letter generation

- ⚛️ **Drop-in React Component (`sahyog_portal/`)**
  - Ready-to-embed React component (`SahyogPortal.jsx` + CSS Modules) for seamless integration with modern React/Vite frontends.

---

## 📁 Project Structure

```text
├── 1.html                  # Official LEA Login Interface
├── index.html              # Root redirect entrypoint (for GitHub Pages / Hosting)
├── send.html               # Statutory VASP Requisition Dispatch Form
├── 1.png - 6.png           # Portal branding & emblem graphics
├── css/
│   ├── login.css           # Modular styling for Login Portal
│   └── send.css            # Responsive styles for Statutory Requisition Form
├── js/
│   ├── auth.js             # Authentication logic & session storage
│   ├── auth-guard.js       # Route protection & profile hydration
│   ├── captcha.js          # Dynamic CAPTCHA canvas engine
│   └── send-notice.js      # Notice form validation, submission & VASP registry
├── data/
│   └── intermediaries.json # VASP Directory (10 Exchanges + Legal Desks)
└── sahyog_portal/          # Standalone React component integration
    ├── README.md
    ├── SahyogPortal.jsx
    └── SahyogPortal.module.css
```

---

## 💻 Running Locally

Simply serve the directory with any static HTTP server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js (npx)
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## 🌐 Deploying to GitHub Pages

1. Go to repository **Settings** on GitHub.
2. Scroll to **Pages** in the left sidebar.
3. Under **Build and deployment**:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `root`
4. Click **Save**. Your portal will be live in seconds at:
   `https://kuldeep-code2005.github.io/Sahyog-Portal/`

---

## ⚖️ Legal & Disclaimer

This software is developed for cybercrime forensic demonstrations, hackathon evaluations, and integration workflows with blockchain analytics tools. All intermediary contact information represents compliance desks for lawful interception and preservation orders.
