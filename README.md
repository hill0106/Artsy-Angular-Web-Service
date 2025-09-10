# 🎨 Artsy Angular Web Service

[![Angular](https://img.shields.io/badge/Angular-19.2.0-red.svg)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.21.2-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.14.2-green.svg)](https://mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.3-purple.svg)](https://getbootstrap.com/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)

A modern web application that integrates with the Artsy API to provide art discovery, artist information, and personalized favorites management. Built with Angular frontend and Node.js/Express backend.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

- **🔍 Art Search**: Search for artists using the Artsy API
- **👤 User Authentication**: Secure user registration and login
- **❤️ Favorites Management**: Save and manage favorite artists
- **📱 Responsive Design**: Mobile-friendly interface with Bootstrap
- **🔐 JWT Authentication**: Secure token-based authentication
- **☁️ Cloud Deployment**: Ready for Google Cloud Platform deployment
- **🔄 Auto Token Refresh**: Automatic Artsy API token management

## 🛠 Tech Stack

### Frontend
- **Angular 19.2.0** - Modern web framework
- **Bootstrap 5.3.3** - Responsive UI components
- **Bootstrap Icons** - Icon library
- **TypeScript** - Type-safe JavaScript

### Backend
- **Node.js 20.x** - Runtime environment
- **Express.js 4.21.2** - Web framework
- **MongoDB 6.14.2** - Database
- **Mongoose 8.12.1** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### External APIs
- **Artsy API** - Art and artist data

## 📋 Prerequisites

Before running this application, make sure you have:

- **Node.js** (v20.x or higher)
- **npm** (v8.x or higher)
- **MongoDB** (local or cloud instance)
- **Artsy API Access** (for art data)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hill0106/Artsy-Angular-Web-Service.git
   cd assignment3
   ```

2. **Install server dependencies**
   ```bash
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

## ⚙️ Configuration

1. **Create environment variables**
   ```bash
   # Create .env file in the root directory
   touch .env
   ```

2. **Configure environment variables**
   ```env
   # Database
   DB=mongodb://localhost:27017/artsy-app
   # or use MongoDB Atlas connection string
   
   # JWT
   JWTPRIVATEKEY=your-jwt-private-key
   SALT=16
   
   # Environment
   NODE_ENV=development
   ```

3. **Artsy API Setup**
   - Register at [Artsy API](https://developers.artsy.net/)
   - Obtain your API credentials
   - The application will automatically fetch and refresh tokens

## 🎯 Usage

### Development Mode

1. **Start the backend server**
   ```bash
   npm start
   ```
   Server runs on `http://localhost:8080`

2. **Start the frontend development server**
   ```bash
   cd client
   ng serve
   ```
   Frontend runs on `http://localhost:4200`

### Production Mode

1. **Build the Angular application**
   ```bash
   cd client
   ng build --configuration production
   cd ..
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Search & Art Data
- `GET /api/search?q={query}` - Search for artists
- `GET /api/artist/{id}` - Get artist details
- `GET /api/artwork/{id}` - Get artwork details
- `GET /api/gene/{id}` - Get gene (category) details

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `GET /api/user/favorites` - Get user favorites
- `POST /api/user/favorites` - Add to favorites
- `DELETE /api/user/favorites/{id}` - Remove from favorites

## 📁 Project Structure

```
assignment3/
├── client/                 # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ # Angular components
│   │   │   └── services/   # Angular services
│   │   └── assets/         # Static assets
│   └── dist/              # Build output
├── server/                # Node.js backend
│   ├── routes/            # API routes
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   └── server.js          # Main server file
├── app.yaml              # Google Cloud deployment config
└── package.json          # Root package configuration
```

## ☁️ Deployment

### Google Cloud Platform

The application is configured for Google Cloud Platform deployment:

1. **Build the application**
   ```bash
   cd client
   ng build --configuration production
   cd ..
   ```

2. **Deploy to Google Cloud**
   ```bash
   gcloud app deploy
   ```

3. **Configure environment variables in Google Cloud Console**

### Environment Variables for Production
- `DB` - MongoDB connection string
- `JWTPRIVATEKEY` - JWT signing key
- `SALT` - Password hashing salt rounds
- `NODE_ENV` - Set to "production"

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Follow Angular style guide
- Use TypeScript strict mode
- Write meaningful commit messages
- Add tests for new features

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Artsy](https://www.artsy.net/) for providing the amazing art API
- [Angular](https://angular.io/) team for the excellent framework
- [Bootstrap](https://getbootstrap.com/) for the UI components

---

**Made with ❤️ for art lovers**
