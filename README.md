# StudyBuddy - ALU Peer-Peer Support Platform
ALU StudyBuddy is a peer-to-peer academic support platform designed specifically for African Leadership University students. It connects learners with helpful peers based on course needs, availability, and academic context which creates a timely, structured, and collaborative learning.

## 🏗️ Architecture

### System Components
- **Frontend**: React 18 with Vite build tool
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API for authentication
- **Real-time**: WebSocket integration for live notifications
- **API Communication**: RESTful services with Axios
- **Authentication**: JWT-based authentication system

## Features

### Core Functionality
- **Peer Matching**: Find support partners based on skills and availability
- **Session Scheduling**: Book and manage tutoring sessions
- **Availability Management**: Set and update personal availability
- **Skills Tracking**: Manage and showcase academic competencies
- **Support Tickets**: Request help with technical or academic issues
- **Real-time Notifications**: Instant updates on session bookings and peer availability

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Client-side routing

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Git** - Version control

## Installation & Setup

### Prerequisites
- Node.js (v22 or higher)
- npm or yarn package manager
- Git

## Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=https://study-buddy-api-yaoz.onrender.com/api/v1
```

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/El-Gibbor/StudyBuddy_UI.git>
   cd StudyBuddy_UI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Tailwind Configuration
The project uses Tailwind CSS with custom color schemes and responsive breakpoints configured in `tailwind.config.js`.

## Authentication Flow

1. **Login**: Users authenticate with email/password
2. **Token Storage**: JWT tokens stored in localStorage
3. **Protected Routes**: Role-based access control
4. **Session Management**: Automatic token refresh

## Dashboard Features

- **Welcome Section**: Personalized greeting and quick stats
- **Availability Editor**: Manage weekly availability slots
- **Skills Management**: Add/remove skills and expertise areas
- **Find Peers**: Search and filter potential study partners
- **Upcoming Sessions**: View and manage scheduled sessions
- **Notifications**: Real-time updates on platform activities
