# Message Application - MERN Stack

A full-stack messaging application built with MongoDB, Express.js, React, and Node.js. Features real-time messaging, user authentication, and responsive design for both desktop and mobile devices.

## Features

- Real-time messaging with Socket.io
- User authentication and authorization
- Responsive design (desktop, tablet, mobile)
- Message history and search functionality
- Online/offline status indicators
- File/image sharing capabilities
- Modern UI with clean design

## Project Structure

```
message-application/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── controllers/        # Route controllers
│   ├── config/             # Database and app configuration
│   └── utils/              # Utility functions
├── frontend/               # React application
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── styles/         # CSS files
│   └── package.json
└── package.json            # Root package.json
```

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm run install-all
   ```

3. Set up environment variables:

   - Copy `backend/.env.example` to `backend/.env`
   - Update the MongoDB connection string and JWT secret

4. Start the development servers:
   ```bash
   npm run dev
   ```

## Technologies Used

- **Frontend**: React, CSS3, Socket.io-client
- **Backend**: Node.js, Express.js, Socket.io
- **Database**: MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Real-time**: Socket.io

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users` - Get all users
- `GET /api/messages/:conversationId` - Get messages for a conversation
- `POST /api/messages` - Send a new message

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
