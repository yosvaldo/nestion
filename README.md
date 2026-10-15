# Nestion - Property Rental & Management Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
[![Railway](https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white)](https://railway.app/)

**Nestion** is a comprehensive, full-stack property reservation system. It bridges the gap between property owners (Tenants) and guests (Users) by providing a robust booking engine, dynamic pricing models, and secure transaction workflows.

## 🚀 Key Features

### 🛡️ Enterprise-Grade Authentication & Security
*   **Passwordless Registration Flow:** Users register via email and receive a secure, time-sensitive verification link to set their password.
*   **Advanced Token Architecture:** Utilizes short-lived JWT Access Tokens stored in memory and 7-day Refresh Tokens stored in secure `httpOnly` cookies to prevent XSS attacks.
*   **Strict Role-Based Access Control (RBAC):** Middleware completely isolates User features from Tenant features, ensuring absolute data privacy and route protection.

### 🏢 Tenant Property Management
*   **Isolated Data Access:** Strict relational database checks ensure tenants can only view and mutate their own properties and revenue.
*   **Dynamic Peak-Season Pricing:** Algorithmic price calculation engine applies percentage-based or nominal price bumps on specific dates without destructively altering the base price.
*   **Smart Room Unavailability:** A unified calendar system automatically blocks out dates based on manual tenant overrides OR active user bookings.

### 🛒 Secure Booking Engine
*   **Concurrency Control:** Database-level transaction checks prevent race conditions and double-booking on overlapping dates.
*   **Server-Side Price Calculation:** The backend independently calculates the total order price based on the dates and database rates, preventing client-side payload tampering.
*   **Automated Expiration:** Payment windows are strictly enforced at the action point. Uploading proof after the 1-hour window automatically voids the transaction.

### 💳 Transaction & Workflow Management
*   **Bidirectional State Machine:** Tenants can Accept or Reject payments. Rejections automatically revert the order state to allow users a chance to re-upload valid proof.
*   **Event-Driven Notifications:** Transaction updates (Accept/Reject) trigger automated, dynamic Handlebars email templates delivered to the user.
*   **Secure File Handling:** Strict double-validation (Zod on client, Multer on server) ensures only safe, size-limited image files hit the Cloudinary storage.

### 📊 Business Intelligence & Reporting
*   **Financial Accuracy:** Revenue reports explicitly filter out pending or canceled orders, ensuring only verified, processed transactions are calculated.
*   **UTC Normalization:** Backend safely normalizes all date queries to absolute UTC boundaries, preventing timezone-related data loss.
*   **Optimized Render Engine:** The frontend utilizes `useMemo` to efficiently group and render 30-day matrices for multiple rooms without lagging the React DOM.

## 💻 Tech Stack

*   **Frontend:** React, TypeScript, Zustand, Tailwind CSS, React Hook Form, Zod
*   **Backend:** Node.js, Express, TypeScript
*   **Database & ORM:** PostgreSQL, Prisma ORM
*   **File Storage:** Cloudinary, Multer
*   **Email Service:** Resend, Handlebars

### Prerequisites
* Node.js (v18+)
* PostgreSQL instance
* Cloudinary Account
* Resend API Key
