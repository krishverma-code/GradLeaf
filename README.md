# GradLeaf 🍃

> **Education today, growth tomorrow** — The collegiate platform connecting verified student identities, smart teammate matching with explainable AI, and shared collaborative project sprint workspaces.

---

## 👥 Project Team Roster

| Member | Role | GitHub |
| :--- | :--- | :--- |
| **Krish Verma** | Project Lead & Fullstack Architecture | [@krishverma-code](https://github.com/krishverma-code) |
| **Veer** | Core Contributor & Matching Algorithm | [@Veer-0201](https://github.com/Veer-0201) |
| **Madhavi Chugh** | Core Contributor & UI/UX Design System | [@madhavichugh](https://github.com/madhavichugh) |
| **Mudit Chaudhary** | Core Contributor & Workspace Features | [@muditchaudhary29](https://github.com/muditchaudhary29) |

---

## 🚀 Quickstart Guide

Follow these quick steps to get GradLeaf running locally on your machine:

### 1. Prerequisites
- **Node.js** (v18.17+ or v20+)
- **npm** (comes with Node.js)
- **Git**

### 2. Clone the Repository
```bash
git clone https://github.com/krishverma-code/GradLeaf.git
cd GradLeaf
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Setup (Prisma & SQLite)
GradLeaf uses SQLite with Prisma ORM out-of-the-box (zero external database configuration required).
```bash
# Push schema to SQLite database
npx prisma db push

# (Optional) Populate database with sample students, courses, and projects
node prisma/seed.js
```

### 5. Launch the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router, Server & Client Components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom collegiate forest/sage design system & glassmorphism
- **ORM / Database**: Prisma with SQLite
- **Icons**: Lucide React

---

## 🌿 Core Features
- **Student Identity & Skill Matrix**: Verified course credentials, learning statuses, and GitHub integration.
- **Explainable Smart Matcher**: Mathematical multi-factor matching (Skills 40%, Domain 20%, Availability 20%, Experience 10%, Team Balance 10%).
- **Interactive Workspaces**: Private Kanban task boards, project milestones, team role distribution, and sprint tracking.
- **Campus Project Marketplace**: Explore projects by university, domain filter, and initiate collaboration requests.
- **Account Switcher**: Built-in multi-profile switcher in the top navigation to test interactions across different student personas.

---

## 🤝 Team Workflow & Collaboration Rules
- **Main Branch**: Keep `main` stable and deployable.
- **Feature Branches**: Create descriptive branches before developing:
  ```bash
  git checkout -b feature/your-feature-name
  ```
- **Pull Requests**: Open a PR into `main` and get a teammate review before merging.
- **Database Schema Changes**: If you modify `prisma/schema.prisma`, run `npx prisma db push` and commit the updated schema.
