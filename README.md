# Receipt Desk

A website where a business registers, adds its logo and details, and then only types
**item name, price and quantity** to print a receipt on a thermal printer (58mm or 80mm).

Built with **React (Vite)** and **Firebase** (Authentication + Firestore).

---

## 1. Set up Firebase (once)

1. Go to https://console.firebase.google.com and click **Add project**.
2. **Authentication** > *Get started* > *Sign-in method* > enable **Email/Password**.
3. **Firestore Database** > *Create database* > choose a location > start in **production mode**.
4. Firestore > **Rules** tab > delete what is there, paste the contents of `firestore.rules` from this folder > **Publish**.
5. **Project settings** (gear icon) > *Your apps* > click the **</>** (Web) icon > register the app.
   Firebase shows a `firebaseConfig` block. You need those values in the next step.

The logo is stored inside Firestore as a small image, so you do **not** need Firebase Storage
(which requires a paid plan).

## 2. Run it on your computer

Install Node.js (version 18 or newer) from https://nodejs.org, then in this folder:

```bash
cp .env.example .env      # on Windows: copy .env.example .env
```

Open `.env` and paste your Firebase values (apiKey, authDomain, and so on). Then:

```bash
npm install
npm run dev
```

Open the address it prints (usually http://localhost:5173), register a business, and try a sale.

## 3. Put it online (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # choose your project, public directory: dist, single-page app: Yes
                           # (say No if it asks to overwrite dist/index.html or firebase.json)
npm run build
firebase deploy
```

---

## How the code is organised (for learning)

```
src/
  main.jsx              Starts React and wraps the app in the router and login provider
  App.jsx               The list of pages (routes) and which ones need a login
  firebase.js           Connects to Firebase (with offline support)
  index.css             All styling, including the print rules
  context/
    AuthContext.jsx     Knows who is logged in and loads their business profile
  components/
    Layout.jsx          Top bar with links (New sale, History, Settings, Log out)
    Receipt.jsx         Draws a receipt. Used for preview, printing and reprints
  pages/
    Register.jsx        Creates a login + business profile
    Login.jsx           Log in / forgot password
    NewSale.jsx         Type items, choose payment, save and print
    History.jsx         Today's total, past receipts, reprint
    Settings.jsx        Edit business details and logo, choose paper width
  utils/
    money.js            Naira formatting and totals
    image.js            Shrinks the logo before saving
    errors.js           Friendly error messages
```

### React ideas you will meet

- **Component**: a function that returns HTML-like code (JSX). Example: `Receipt`.
- **Props**: the inputs to a component. `<Receipt business={...} sale={...} />`.
- **State** (`useState`): data that changes, like what the cashier has typed. When state changes, React redraws the screen.
- **Effect** (`useEffect`): code that runs when a component appears, for example to start listening to Firestore.
- **Context**: shared data any component can read, like the logged-in user.

### How the data is stored in Firestore

```
businesses/{userId}                  name, address, phone, footer, logo, paper, receiptCount
businesses/{userId}/sales/{saleId}   number, items[], total, payment, received, createdAt
```

Each business can only read and write its own documents. That is enforced by `firestore.rules`,
not just by the app, so keep those rules published.

## Known limits of this first version

- Receipt numbers come from a counter on the business document. If the same business uses two
  devices offline at the same time, two receipts could get the same number.
- Printing uses the browser's print dialog. Direct printing without the dialog is a later step.
- History shows the latest 100 sales.
