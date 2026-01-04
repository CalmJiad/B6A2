# Vehicle Rental Management System

A robust and scalable backend API for managing vehicle rentals, built with **Node.js**, **TypeScript**, and **PostgreSQL**. This system provides comprehensive functionality for vehicle inventory management, customer bookings, and role-based access control.

## 🔗 Live URL

**API Base URL:** `https://vehicle-server-sigma.vercel.app/`

> The application is deployed on Vercel.

---

## ✨ Features

### 🔐 Authentication & Authorization

- **User Registration & Login** with JWT-based authentication
- **Role-based Access Control** (Admin & Customer roles)
- Secure password hashing using **bcrypt**
- Protected routes with token verification

### 🚙 Vehicle Management

- Create, read, update, and delete vehicles (Admin only)
- Real-time availability tracking
- Support for multiple vehicle types (Car, Bike, Van, SUV)
- Public access to view vehicle inventory

### 📅 Booking System

- Create bookings with automatic price calculation
- Customer-specific booking views
- Admin oversight of all bookings
- Booking status management (Active, Cancelled, Returned)
- Vehicle status auto-update on booking actions
- Cancellation rules enforcement (before start date only)

### 👥 User Management

- Admin dashboard for user oversight
- Profile update functionality
- Role management (Admin only)
- Delete protection for users with active bookings

---

## 🛠️ Technology Stack

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe development

### Database

- **PostgreSQL** - Relational database
- **pg** - PostgreSQL client for Node.js

### Security & Authentication

- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT token generation/verification

### Development Tools

- **tsx** - TypeScript execution with hot reload
- **dotenv** - Environment variable management

---

## 📦 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### 1. Clone the Repository

```bash
git clone https://github.com/CalmJiad/B6A2.git
cd B6A2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory and add the following variables:

```env
PORT=5000
CONNECTION_STR=your_postgresql_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

**Example PostgreSQL connection string:**

```
postgresql://username:password@localhost:5432/vehicle_rental
```

> **Note:** For PostgreSQL hosted on cloud services (NeonDB, Supabase, etc.), use the connection string provided by your hosting service.

### 4. Database Setup

The application automatically creates the required tables on startup:

- `Users` - User accounts and authentication
- `Vehicles` - Vehicle inventory
- `Bookings` - Rental bookings

### 5. Start the Server

**Development Mode (with hot reload):**

```bash
npm run dev
```

**Production Build:**

```bash
npm run build
```

The server will start on `http://localhost:5000` (or your specified PORT).

### 6. Deployment

This project is configured for deployment on **Vercel**.

**Deploy to Vercel:**

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel --prod`
3. Or push to GitHub and connect to Vercel dashboard

The `vercel.json` configuration file handles the serverless deployment automatically.

---

## 🚀 Usage

### API Base URL

```
http://localhost:5000/api/v1
```

### Authentication

For protected routes, include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

### Available Endpoints

#### Authentication

- `POST /auth/signup` - Register a new user
- `POST /auth/signin` - Login and get JWT token

#### Vehicles

- `POST /vehicles` - Create a new vehicle (Admin)
- `GET /vehicles` - Get all vehicles (Public)
- `GET /vehicles/:vehicleId` - Get vehicle by ID (Public)
- `PUT /vehicles/:vehicleId` - Update vehicle (Admin)
- `DELETE /vehicles/:vehicleId` - Delete vehicle (Admin)

#### Users

- `GET /users` - Get all users (Admin)
- `PUT /users/:userId` - Update user profile (Admin/Own)
- `DELETE /users/:userId` - Delete user (Admin)

#### Bookings

- `POST /bookings` - Create a new booking (Customer/Admin)
- `GET /bookings` - Get bookings (Role-based access)
- `PUT /bookings/:bookingId` - Update booking status (Role-based)

---

## 📂 Project Structure

```
B6A2/
├── api/
│   └── index.ts                  # Vercel serverless entry point
├── src/
│   ├── app.ts                    # Express application setup
│   ├── server.ts                 # Local development server
│   ├── config/
│   │   ├── index.ts              # Configuration management
│   │   └── dbconfig.ts           # Database setup & initialization
│   ├── middlewares/
│   │   ├── auth.middleware.ts    # JWT authentication & validation
│   │   └── vehicles.middleware.ts # Vehicle input validation
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── bookings/
│   │   │   ├── bookings.controller.ts
│   │   │   ├── bookings.routes.ts
│   │   │   └── bookings.service.ts
│   │   ├── user/
│   │   │   ├── user.controller.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.service.ts
│   │   └── vehicles/
│   │       ├── vehicles.controller.ts
│   │       ├── vehicles.routes.ts
│   │       └── vehicles.service.ts
│   └── types/
│       ├── auth.types.ts         # Authentication type definitions
│       └── express.d.ts          # Express type extensions
├── .env                          # Environment variables (local)
├── .gitignore
├── package.json
├── tsconfig.json
├── vercel.json                   # Vercel deployment configuration
└── README.md
```

---

## 🔑 Key Features Explained

### Automatic Price Calculation

The system automatically calculates booking prices based on:

```
Total Price = Daily Rent Price × Number of Days
```

### Vehicle Availability Management

- Vehicle status changes to **"booked"** when a booking is created
- Status reverts to **"available"** when booking is cancelled or returned

### Smart Deletion Protection

- Users cannot be deleted if they have active bookings
- Vehicles cannot be deleted if they have active bookings

### Role-Based Operations

| Action            | Admin | Customer                     |
| ----------------- | ----- | ---------------------------- |
| Manage Vehicles   | ✅    | ❌                           |
| View All Bookings | ✅    | Own Only                     |
| Cancel Bookings   | ✅    | Own Only (Before Start Date) |
| Mark as Returned  | ✅    | ❌                           |
| Manage Users      | ✅    | Update Own Profile           |

---

## 🧪 Testing the API

You can test the API using tools like:

- **Postman** - [Download](https://www.postman.com/downloads/)
- **Thunder Client** - VS Code Extension
- **cURL** - Command line tool

### Example Request

```bash
# Register a new user
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "01234567890",
    "role": "customer"
  }'
```

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 salt rounds)
- ✅ JWT-based authentication with expiration
- ✅ Protected routes with token verification
- ✅ Role-based authorization middleware
- ✅ Input validation on all endpoints
- ✅ SQL injection prevention using parameterized queries

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**CalmJiad**

- GitHub: [@CalmJiad](https://github.com/CalmJiad)
- Repository: [B6A2](https://github.com/CalmJiad/B6A2)

---

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on [GitHub Issues](https://github.com/CalmJiad/B6A2/issues)
- Contact via repository discussions

---

## 🎯 Future Enhancements

- [ ] Payment gateway integration
- [ ] Email notifications for bookings
- [ ] Advanced search and filtering
- [ ] Booking history and analytics
- [ ] Multi-language support
- [ ] API documentation with Swagger/OpenAPI

---

<div align="center">
  <p>Made with ❤️ by CalmJiad</p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
