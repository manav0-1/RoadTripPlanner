# **Road Trip Planner** 🚗✨

> **A Premium Cinematic Travel Experience**

The **Road Trip Planner** is a high-fidelity, full-stack MERN application designed for travelers who seek both adventure and a world-class digital experience. Built for **Cars24**, this conceptual platform allows users to discover, create, and share global road trips through an immersive, cinematic interface.

---

## **✨ Premium UI/UX Features**

We've overhauled the entire frontend to provide a **Next-Gen User Experience**:

*   **💎 Cinematic Glassmorphism:** Every interface element features multi-layered backdrop blurs and subtle white borders for a sophisticated, high-end feel.
*   **🎬 Fluid Animations:** Powered by **Framer Motion**, the app features seamless page transitions, layout-morphing card interactions, and delicate hover states.
*   **🌌 Dynamic Ambient Lighting:** Animated "Ambient Orbs" and "Liquid Blobs" drift across the background, creating a living, breathing digital environment.
*   **📐 Modern Typography:** A curated pairing of **Space Grotesk** (Display) and **Manrope** (Body) ensures maximum readability and aesthetic appeal.
*   **📱 Precision Responsiveness:** A fully adaptive layout that feels native on everything from ultra-wide monitors to mobile devices.

---

## **🗺️ Functional Core**

Beyond its stunning visuals, the platform remains a robust travel tool:

*   **📍 Interactive Route Planning:** Integrated with **Leaflet** and **OpenRouteService** for real-time map visualization and distance calculations.
*   **🌦️ Live Destination Weather:** Real-time atmospheric data for your journey's start and end points via **Weather API**.
*   **🏛️ Smart POI Discovery:** Automated discovery of nearby attractions and landmarks using the **Geoapify Places API**.
*   **🔐 Secure AI-Ready Auth:** Complete JWT-based authentication system with secure gesture support foundations.
*   **🖼️ Cloud Media Hosting:** High-performance image management powered by **Cloudinary**.
*   **💬 Traveler Community:** Engage with the world through a nested commenting system and real-time social metrics (likes/views).

---

## **🛠️ The Power Stack**

**Core Infrastructure**
*   **MongoDB Atlas:** Global cloud database
*   **Express.js & Node.js:** Scalable backend architecture
*   **React 18:** Component-based frontend

**UI & Effects (The "Premium" Layer)**
*   **Tailwind CSS:** Utility-first design system
*   **Framer Motion:** High-performance motion engine
*   **Lucide React:** Minimalist, consistent iconography

**APIs & Services**
*   **Geoapify:** Location intelligence
*   **OpenRouteService:** Navigation & Routing
*   **Cloudinary:** Media transformation & delivery
*   **WeatherAPI:** Environmental data

---

## **🚀 Getting Started**

### **Prerequisites**
*   [Node.js](https://nodejs.org/) (v16.0 or higher)
*   [MongoDB Atlas](https://www.mongodb.com/atlas/database) account
*   Cloudinary Account

### **1. Installation**

```bash
git clone <your-repo-url>
cd Road-Trip-Planner
```

### **2. Backend Configuration**

Navigate to the `backend` directory, create a `.env` file basing it on the provided template:

```bash
cd backend
npm install
cp .env.example .env
```

**Environment Variables:**
Ensure you populate your `.env` with the necessary keys (refer to `.env.example` for the full list):
*   `MONGODB_CONNECTION_STRING`
*   `JWT_SECRET`
*   `WEATHER_API_KEY`
*   `ORS_API_KEY`
*   `GEOAPIFY_API_KEY`
*   `CLOUDINARY_CLOUD_NAME`
*   `CLOUDINARY_API_KEY`
*   `CLOUDINARY_API_SECRET`

### **3. Frontend Setup**

```bash
cd ../frontend
npm install
npm start
```

---

## **🎨 Visual Identity**

*   **Primary Palette:** `Deep Space` (#060a18) to `Stellar Navy` (#161030)
*   **Accent Gradients:** `Mint Glow` (#84ffd8) → `Azure Sky` (#67c5ff) → `Nebula Purple` (#d08cff)
*   **Effects:** 22% backdrop-blur, 1px white/10 border, high-fidelity shadows.

---

## **👨‍💻 Contributors**

*   **Manav Sharma** - *Lead Developer* (Menternship Project under Cars24)
