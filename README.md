# PayBud 💸

PayBud is a modern full-stack web application designed to simplify the way you share expenses with friends, family, and colleagues. No more spreadsheets or complex math—PayBud handles the "who owes whom" part so you can focus on the fun.

## 🚀 Features

- **Intuitive Dashboard**: Get a bird's-eye view of your financial standing across all groups.
- **Group Management**: Create dedicated spaces for different trips, flatmates, or events.
- **Smart Splitting**: Split bills equally or by exact amounts with just a few clicks.
- **Live Notifications**: Get real-time updates via Socket.io when someone adds an expense or settles up.
- **Visual Analytics**: Interactive charts powered by Recharts to track your spending trends.
- **Secure Authentication**: Robust user sessions using JWT and encrypted passwords.
- **Admin Panel**: Specialized tools for managing system data and banking integrations.

## 🛠️ Technology Stack

### Frontend
- **React 19** with **Vite** for blazing-fast performance.
- **Redux Toolkit** for sophisticated state management.
- **Tailwind CSS** & **Framer Motion** for a premium, interactive UI.
- **Lucide React** for consistent, modern iconography.

### Backend
- **Node.js** & **Express.js** for a scalable REST API.
- **MongoDB** with **Mongoose** for flexible data modeling.
- **Socket.io** for real-time data synchronization.
- **JWT** (JSON Web Tokens) for secure, stateless authentication.

## 📁 Project Structure

```text
├── frontend/       # React + Vite Client
├── server/         # Node.js + Express API
├── shared/         # Shared utilities and types
└── README.md       # Project documentation
```

## ⚙️ Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/vanshitavarma/PayBud.git
   ```

2. **Setup Server:**
   ```bash
   cd server
   npm install
   # Create a .env file with your MONGO_URI and JWT_SECRET
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## 🛡️ License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for better financial transparency.*