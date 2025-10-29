# Authentication & Authorization System

## Overview
The Rapchai application now implements a robust token-based authentication system with proper role-based access control.

## 🔐 Authentication Flow

### 1. Admin Login Process
1. **Admin clicks "Admin Login"** → Frontend calls `/api/auth/login`
2. **Backend validates credentials** → Returns JWT access token + refresh token
3. **Frontend stores tokens** → Admin APIs become accessible
4. **All admin routes require valid JWT token** → Token verified on each request

### 2. Admin Logout Process
1. **Admin clicks "Logout"** → Frontend calls `/api/auth/logout`
2. **Backend invalidates all user tokens** → Tokens marked as revoked in database
3. **Frontend clears stored tokens** → Admin APIs immediately become inaccessible
4. **Subsequent admin requests fail** → Returns 401 Unauthorized

## 🛡️ Route Protection

### Public Customer APIs (Always Accessible)
- `GET /api/menu/categories` - Get all categories
- `GET /api/menu/categories/:id` - Get category by ID
- `GET /api/menu/items` - Get all menu items
- `GET /api/menu/items/:id` - Get menu item by ID
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID
- `PATCH /api/orders/:id/cancel` - Cancel order
- `GET /api/orders/customer/:phone` - Get orders by customer phone

### Admin APIs (Require Authentication)
- `GET /api/admin/dashboard` - Dashboard analytics
- `GET /api/admin/events` - Get all events ✅ **FIXED**
- `GET /api/admin/events/:id` - Get event by ID ✅ **FIXED**
- `POST /api/admin/events` - Create event
- `PUT /api/admin/events/:id` - Update event
- `DELETE /api/admin/events/:id` - Delete event
- `GET /api/admin/bookings` - Get all bookings
- `POST /api/menu/categories` - Create category
- `PUT /api/menu/categories/:id` - Update category
- `DELETE /api/menu/categories/:id` - Delete category
- `POST /api/menu/items` - Create menu item
- `PUT /api/menu/items/:id` - Update menu item
- `DELETE /api/menu/items/:id` - Delete menu item
- `GET /api/orders` - Get all orders
- `PATCH /api/orders/:id/status` - Update order status
- `PATCH /api/orders/:id/payment` - Update payment status

## 🔧 Technical Implementation

### Token Management
- **Access Tokens**: Short-lived (15 minutes), used for API requests
- **Refresh Tokens**: Long-lived (7 days), used to get new access tokens
- **Token Revocation**: Tokens marked as revoked in database on logout
- **Token Validation**: Every admin request validates token + checks revocation status

### Database Schema
```sql
-- Refresh tokens table with revocation support
model RefreshToken {
  id        String   @id @default(cuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  isRevoked Boolean  @default(false)  -- ✅ Token revocation support
}
```

### Middleware Stack
1. **authMiddleware**: Validates JWT token, checks user exists and is active
2. **adminMiddleware**: Runs authMiddleware + verifies user role is ADMIN
3. **Token Revocation Check**: Validates tokens haven't been revoked

## 🚀 Usage Examples

### Frontend Implementation
```javascript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'admin@example.com', password: 'password' })
});
const { accessToken, refreshToken } = await loginResponse.json();

// Store tokens
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Make admin API calls
const eventsResponse = await fetch('/api/admin/events', {
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// Logout
await fetch('/api/auth/logout', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${accessToken}` }
});

// Clear tokens
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
```

## ✅ Security Features

1. **Token-Based Authentication**: JWT tokens with proper expiration
2. **Role-Based Access Control**: Admin vs Customer role separation
3. **Token Revocation**: Immediate invalidation on logout
4. **User Status Checking**: Inactive users cannot authenticate
5. **Secure Token Storage**: Tokens stored in database with revocation tracking

## 🎯 Benefits

- **Immediate Security**: Admin APIs stop working instantly on logout
- **Customer Experience**: Public APIs always accessible
- **Scalable**: Token-based system supports multiple admin sessions
- **Audit Trail**: All authentication events logged
- **Flexible**: Easy to add new roles or permissions

## 🔍 Testing

To test the authentication flow:

1. **Start the application**: `.\start-app-supabase.ps1`
2. **Try accessing admin API without login**: Should return 401
3. **Login as admin**: Get access token
4. **Access admin API with token**: Should work
5. **Logout**: Clear tokens
6. **Try accessing admin API again**: Should return 401
7. **Verify customer APIs still work**: Should always be accessible
