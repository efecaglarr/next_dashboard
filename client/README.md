# Next Dashboard

A full-stack dashboard application for managing business operations, inventory, and analytics.

## 🚀 Tech Stack

### Frontend
- Next.js 15.1.2
- React 19.0.0
- TypeScript
- Redux Toolkit for state management
- Material UI components
- Tailwind CSS for styling
- Recharts for data visualization

### Backend
- Express.js
- Prisma ORM
- PostgreSQL
- JWT for authentication
- TypeScript

## 📋 Features

### Authentication & Authorization
- User registration and login
- Role-based access control (User, Admin, Employee)
- JWT token-based authentication
- Protected routes

### Dashboard Features
- Popular products tracking
- Sales analytics and summaries
- Purchase tracking and analytics
- Expense management and categorization
- Real-time metrics and statistics

### Data Management
- Product management
- Customer management
- Employee management with shift tracking
- Multi-tenant architecture
- Expense tracking and categorization

### Amazon Fulfillment Features (Planned for Future Updates)
- Integration with Amazon API for fulfillment operations
- Order management and tracking for Amazon orders
- Inventory synchronization with Amazon listings
- Automated processing of ASIN (Amazon Standard Identification Number) codes
- Real-time stock updates and shipment tracking

## 🏗️ Project Structure

```
next-dashboard/
├── client/               # Frontend Next.js application
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── app/         # Next.js app directory
│   │   ├── components/  # Reusable components
│   │   ├── hooks/       # Custom hooks
│   │   ├── state/       # Redux state management
│   │   ├── styles/      # Global styles
│   │   ├── utils/       # Helper functions
│   │   ├── pages/       # Next.js pages
│   ├── package.json     # Frontend dependencies
│   └── tsconfig.json    # TypeScript configuration
│
├── server/               # Backend Express application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic services
│   │   ├── utils/        # Utility functions
│   │   ├── config/       # Configuration files
│   ├── prisma/           # Database schema and migrations
│   ├── package.json      # Backend dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   └── .env              # Environment variables
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Set up environment variables:
   - Create `.env` file in server directory
   - Create `.env.local` file in client directory

4. Set up the database:

```bash
cd server
npx prisma migrate dev
```

5. Start the development servers:

```bash
# Start backend server
cd server
npm run dev

# Start frontend development server
cd client
npm run dev
```

## 📄 License

This project is licensed under the ISC License.

## 📝 Database Schema

The application uses a comprehensive database schema including:
- Users and authentication
- Multi-tenant architecture
- Products and inventory
- Sales and purchase tracking
- Customer management
- Employee management
- Expense tracking

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- HTTP-only cookies for token storage

## 🛠️ Development Scripts

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build production bundle
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build TypeScript files
npm run start    # Start production server
npm run seed     # Seed database with initial data
```

## 📦 Dependencies

For detailed dependencies, please refer to:
- Frontend: `client/package.json`
- Backend: `server/package.json`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
