# ReWear – Community Clothing Exchange

ReWear is a full-stack web application that enables users to exchange clothing items within a community. The platform supports direct swaps, point-based redemptions, and includes an admin panel for item approval and user management. Users can register and log in using email/password or Google OAuth.

---

## Features

- **User Registration & Login**
  - Email/password authentication
  - Google OAuth authentication
- **Item Listing**
  - Add, edit, and delete clothing items
  - Upload images for each item
  - Browse and search items
- **AI-Powered Features**
  - **Image Analysis**: AI analyzes clothing images to auto-fill item details
  - **Smart Recommendations**: Personalized item recommendations based on user preferences
  - **Style Insights**: AI-generated style analysis and suggestions
  - **Description Generation**: AI creates engaging item descriptions
  - **Similar Item Suggestions**: Find similar items for better swapping
- **ImageKit Integration**
  - Professional image hosting with optimization and CDN
  - Automatic image resizing and optimization
  - Fast global content delivery
- **Swapping System**
  - Direct item swaps between users
  - Point-based redemption for items
- **Admin Panel**
  - Approve or reject new item listings
  - Manage users and assign admin roles
- **User Dashboard**
  - View owned items, swap history, and points
  - AI-powered insights and recommendations
- **Responsive UI**
  - Modern, mobile-friendly design using React and Tailwind CSS

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, Sequelize ORM
- **Database:** PostgreSQL (Neon or any PostgreSQL-compatible service)
- **Authentication:** JWT, Passport.js, Google OAuth 2.0
- **AI Integration:** Google Gemini AI for image analysis and recommendations
- **Image Hosting:** ImageKit.io for professional image management
- **Image Uploads:** Multer

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v8 or higher)
- PostgreSQL database (e.g., [Neon](https://neon.tech/), Supabase, or local PostgreSQL)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd <project-directory>
```

### 2. Install Dependencies
```bash
npm run install:all
```

### 3. Environment Variables

#### Backend (`backend/.env`):
```
JWT_SECRET=your-jwt-secret
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/database
MAX_FILE_SIZE=5242880
UPLOAD_PATH=../uploads
CORS_ORIGIN=http://localhost:3000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# ImageKit.io Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

#### Frontend (`frontend/.env.local`):
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

### 4. Start the Application
From the project root, run:
```bash
npm run dev
```
- The backend will run on [http://localhost:5000](http://localhost:5000)
- The frontend will run on [http://localhost:3000](http://localhost:3000)

---

## Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials for a Web application
3. Add the following to **Authorized JavaScript origins**:
   - `http://localhost:3000`
4. Add the following to **Authorized redirect URIs**:
   - `http://localhost:5000/api/auth/google/callback`
5. Copy your client ID and secret into the backend and frontend environment files

---

## Usage
- Register or log in with email/password or Google
- Add clothing items with images and details
- Browse, search, and request swaps with other users
- Use points to redeem items
- Admins can approve/reject items and manage users

---

## Folder Structure
```
root/
  backend/
    models/
    routes/
    config/
    uploads/
    server.js
    .env
  frontend/
    src/
      components/
      pages/
      contexts/
      App.js
    .env.local
  README.md
```

---

## Contribution Guidelines
- Fork the repository and create a new branch for your feature or bugfix
- Write clear, descriptive commit messages
- Ensure code is well-documented and follows project conventions
- Submit a pull request with a detailed description of your changes

---

## License
This project is licensed under the MIT License. 