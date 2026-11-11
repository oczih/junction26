# Apex — SaaS Hackathon Frontend Starter

A clean, modern SaaS landing page and frontend foundation engineered for 48-hour hackathons. Built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS 4**, and **Motion for React**.

Designed for rapid prototyping: clone, launch, and immediately present a high-converting, polished product UI to judges and users.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) with React 19 and Turbopack
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with dark mode design tokens
- **Animations**: [Motion for React](https://motion.dev/) (`motion/react`) for fluid reveal and tactile micro-interactions
- **Backend Ready**: Preserved MongoDB Atlas connection handler (`lib/mongoose.ts`) and Mongoose User model (`app/models/usermodel.ts`) for quick backend wiring

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Page Sections (`app/page.tsx`)

1. **Sticky Navbar**: Brand logo, anchor navigation links (`Features`, `How It Works`, `Pricing`, `FAQ`), and an interactive `Login` modal trigger.
2. **Hero Section**:
   - High-impact centered headline & descriptive subtitle.
   - Dual CTAs: primary "Get Started Free" and secondary "Documentation".
   - Key social proof metrics (99.99% uptime, <15ms response, 10x velocity).
   - Interactive dashboard preview mockup with metric cards and animated bar graph.
3. **Features Grid**: 3-column responsive grid with SVG icons and subtle hover border illumination.
4. **How It Works**: 3-step sequence illustrating product onboarding.
5. **Call To Action (Bottom)**: High-converting conversion card with instant email input and signup trigger.
6. **Footer**: 5-column SaaS footer with Product, Company, Resources, Legal link columns, live status dot, and copyright.

---

## 🛠️ Reusable UI Primitives (`components/ui/`)

- **`Button`**: Primary (Ember fill), Secondary, Outline, Ghost, and Danger with Motion tap scale (`whileTap={{ scale: 0.98 }}`).
- **`Card`**: Surface container with subtle border (`border-border-subtle`), internal padding, and hover elevation.
- **`Input` / `Textarea`**: Styled form controls with focus rings and error states.
- **`Modal`**: Accessible, animated dialog powered by `AnimatePresence`.
- **`Badge`**: Status pills with optional live pulsing dot.

---

## 🧪 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Next.js dev server with Turbopack |
| `npm run build` | Compiles the production build with full type checking |
| `npm start` | Starts the production server |
| `npm run lint` | Runs ESLint 9 checks |
