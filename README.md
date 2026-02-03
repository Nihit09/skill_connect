# Skill Connect 🤝

Skill Connect is a modern web platform that enables users to exchange skills with one another. Whether you want to learn guitar in exchange for teaching Spanish, or offer professional web development advice for credits, Skill Connect facilitates these interactions through a sleek, professional interface.

## 🚀 Features

### Core Functionality
- **Skill Marketplace**: Discover diverse skills offered by the community. Filter by category (Web Dev, Music, Language, etc.) or search for specific users.
- **Skill Exchange System**: Request to learn a skill from another user. Exchanges can be free (barter) or credit-based.
- **User Dashboard**: Manage your active exchanges, incoming requests, and your own listed skills in one central hub.
- **Real-time Chat**: Fully integrated chat system (powered by Socket.io) allows users to communicate instantly once an exchange is accepted.
- **Reputation System**: Users build reputation scores based on successful exchanges, fostering trust within the community.

### Technical Highlights
- **Authentication**: Secure JWT-based authentication with HttpOnly cookies for session management.
- **Advanced Search**: Capable of searching for both skills and specific users.
- **Deep Linking**: "Message User" buttons on profiles link directly to the relevant chat thread.
- **Professional UI/UX**: Built with a unified light/slate theme, glassmorphism elements, and smooth `framer-motion` animations.

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: Fast, modern UI development.
- **Tailwind CSS**: Utility-first styling for a custom, responsive design.
- **Framer Motion**: For smooth page transitions and interactive elements.
- **Redux Toolkit**: Global state management for authentication and cached data.
- **Lucide React**: Beautiful, consistent iconography.

### Backend
- **Node.js & Express**: Robust REST API architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database for users, skills, and exchanges.
- **Socket.io**: Real-time bidirectional event-based communication for chat.
- **Redis**: In-memory data store for session management and caching (optional/extensible).

## 📦 Installation & Setup

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Nihit09/skill_connect.git
    cd skill_connect
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    
    # Create .env file
    cp .env.example .env
    # (Edit .env with your MongoDB URI, JWT_SECRET, etc.)
    
    npm run dev
    ```

3.  **Setup Frontend**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the App**
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📸 Project Structure

- `/frontend`: Contains the React application logic, pages, and components.
- `/backend`: Contains the Node.js API, models, controllers, and socket logic.

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

---

Built with ❤️ by Nihit Pathak
