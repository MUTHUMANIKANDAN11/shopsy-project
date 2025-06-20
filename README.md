# Shopsy E-commerce Project

A complete e-commerce platform with user authentication, product management, shopping cart, and order processing.

## Project Overview

This project consists of:

- **Frontend**: HTML, CSS, JavaScript with Bootstrap for responsive design
- **Backend**: Node.js with Express.js and MongoDB for data persistence
- **Authentication**: JWT-based user authentication
- **Database**: MongoDB with Mongoose ODM

## Features

### User Management

- User registration with validation
- User login with JWT authentication
- User profile management
- Secure password hashing with bcrypt

### Product Management

- Product listing with search and filtering
- Product categories and ratings
- Product details and images
- Stock management

### Shopping Cart

- Add/remove products from cart
- Update quantities
- Persistent cart storage
- Cart total calculation

### Order Management

- Order placement with delivery options
- Order history and tracking
- Order status updates
- Delivery time estimation

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Update MongoDB connection URL in `server.js`:

   ```javascript
   const MONGODB_URI = "your-mongodb-connection-string";
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

### Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add product to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/clear` - Clear cart

### Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create new order

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation
- CORS configuration
- Error handling

## Future Enhancements

- Payment gateway integration
- Email notifications
- Admin dashboard
- Product reviews
- Mobile app
