# Swachh Dashboard 2.0

A comprehensive waste management and community engagement platform that connects citizens, volunteers, and workers to keep communities clean.

![Swachh Dashboard](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

- **User Dashboard**: Track your contributions, points, and impact
- **Trash Reporting**: Report trash locations with images and details
- **Volunteer System**: Sign up to clean reported trash and earn points
- **Worker Management**: Admin can assign workers to clean reported trash
- **Statistics & Analytics**: Visualize waste management data with charts and maps
- **Admin Panel**: Manage users, workers, and trash reports
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🚀 Tech Stack

### Frontend
- React.js
- React Router for navigation
- Axios for API requests
- Tailwind CSS for styling
- Recharts for data visualization
- Leaflet for maps

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for image storage

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account (for image storage)
- npm or yarn

## 🔧 Installation

### Clone the repository
```bash
git clone https://github.com/yourusername/swachh-dashboard.git
cd swachh-dashboard
```

### Backend Setup
```bash
cd Backend
npm install
```

Create a `.env` file in the Backend directory with the following variables:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### Frontend Setup
```bash
cd Frontend
npm install
```

Create a `.env` file in the Frontend directory with:
```
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Running the Application

### Start the Backend
```bash
cd Backend
npm start
```

### Start the Frontend
```bash
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173`

## 👥 User Roles

### Citizen
- Report trash locations
- View their contribution history
- Earn points for reporting

### Volunteer
- View available trash to clean
- Volunteer to clean reported trash
- Mark trash as cleaned
- Earn bonus points for volunteering

### Worker
- View assigned trash locations
- Mark assigned trash as cleaned
- Track completed tasks

### Admin
- View all trash reports
- Assign workers to trash locations
- View statistics and analytics
- Manage users and workers

## 📊 API Endpoints

### User Routes
- `POST /api/user/register` - Register a new user
- `POST /api/user/login` - User login
- `POST /api/user/admin/login` - Admin login
- `GET /api/user/profile` - Get user profile
- `GET /api/user/points` - Get user points
- `GET /api/user/all` - Get all users (admin only)

### Trash Routes
- `POST /api/trash/report` - Report new trash
- `GET /api/trash/all` - Get all trash reports
- `GET /api/trash/user/:userId` - Get user's trash reports
- `GET /api/trash/available` - Get available trash for volunteering
- `POST /api/trash/:trashId/volunteer` - Volunteer for trash
- `PUT /api/trash/:trashId/clean` - Mark trash as cleaned
- `PUT /api/trash/:trashId/assign` - Assign trash to worker (admin only)

### Worker Routes
- `POST /api/worker/registration` - Register a new worker
- `POST /api/worker/login` - Worker login
- `GET /api/worker/all` - Get all workers (admin only)
- `GET /api/worker/:id/points` - Get worker points
- `POST /api/worker/assign` - Assign worker to trash (admin only)
- `GET /api/worker/:id/reports` - Get worker's assigned reports

### Statistics Routes
- `GET /api/trash/stats/weekly` - Get weekly statistics
- `GET /api/trash/stats/monthly` - Get monthly statistics
- `GET /api/trash/stats/yearly` - Get yearly statistics
- `GET /api/trash/stats/category` - Get category-based statistics

## 📱 Screenshots

### User Dashboard
![User Dashboard](screenshots/user-dashboard.png)

### Admin Panel
![Admin Panel](screenshots/admin-panel.png)

### Statistics
![Statistics](screenshots/statistics.png)

### Volunteer Tasks
![Volunteer Tasks](screenshots/volunteer-tasks.png)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👏 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Leaflet](https://leafletjs.com/)

## 📞 Contact

Your Name - [@yourtwitter](https://twitter.com/yourtwitter) - email@example.com

Project Link: [https://github.com/yourusername/swachh-dashboard](https://github.com/yourusername/swachh-dashboard) 