# Admin Authentication Setup Guide

## 1. Firebase Authentication Setup

### Step 1: Enable Authentication in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "Sanskritiyam" project
3. Navigate to "Authentication" in the left sidebar
4. Click "Get started"
5. Go to "Sign-in method" tab
6. Enable "Email/Password" provider
7. Click "Save"

### Step 2: Configure Authentication Settings
1. In the Authentication section, go to "Settings" tab
2. Add your domain to "Authorized domains" if needed
3. Configure any additional settings as required

## 2. Admin Account Creation

### Method 1: Using the Registration Page
1. Start your development server: `npm run dev`
2. Navigate to `/admin/register`
3. Fill in the registration form:
   - **Full Name**: Your display name
   - **Email**: Your admin email address
   - **Password**: Strong password (min 6 characters)
   - **Confirm Password**: Same as password
4. Click "Create Admin Account"
5. You'll be automatically logged in and redirected to the admin dashboard

### Method 2: Using Firebase Console
1. Go to Firebase Console → Authentication → Users
2. Click "Add user"
3. Enter email and password
4. Click "Add user"
5. The user will need to log in through `/admin/login`

## 3. Admin Access Control

### Current Admin Email List
The system recognizes the following emails as admin:
- `admin@sanskritiyam.com`
- `kartik@sanskritiyam.com`
- `support@sanskritiyam.com`
- Any email containing "admin"

### Customizing Admin Access
To modify admin access, edit the `isAdmin` function in `src/contexts/AuthContext.jsx`:

```javascript
const isAdmin = (user) => {
  if (!user) return false;
  
  // Add your admin emails here
  const adminEmails = [
    'admin@sanskritiyam.com',
    'kartik@sanskritiyam.com',
    'support@sanskritiyam.com',
    'your-email@domain.com'  // Add your email here
  ];
  
  return adminEmails.includes(user.email) || user.email.includes('admin');
};
```

## 4. Security Features

### Authentication Protection
- ✅ **Protected Routes**: Admin dashboard is only accessible to authenticated users
- ✅ **Admin Verification**: Only verified admin emails can access admin features
- ✅ **Session Management**: Users stay logged in until they explicitly log out
- ✅ **Automatic Redirects**: Unauthenticated users are redirected to login page

### User Interface
- ✅ **Login Page**: Clean, responsive login form with error handling
- ✅ **Registration Page**: Admin account creation with validation
- ✅ **User Menu**: Display current user info with logout option
- ✅ **Loading States**: Proper loading indicators during authentication
- ✅ **Error Handling**: Comprehensive error messages for different scenarios

## 5. Testing the Setup

### Test Login Flow
1. Navigate to `/admin/orders` (should redirect to login)
2. Go to `/admin/login`
3. Enter your admin credentials
4. Should redirect to admin dashboard

### Test Registration Flow
1. Navigate to `/admin/register`
2. Fill in the registration form
3. Should create account and redirect to dashboard

### Test Logout Flow
1. In admin dashboard, click on user menu (top right)
2. Click "Sign out"
3. Should redirect to login page

## 6. Admin Dashboard Features

### Order Management
- View all orders with filtering options
- Update order status (pending → confirmed → in progress → completed)
- View detailed order information
- Order statistics and revenue tracking

### User Management
- View current logged-in admin info
- Logout functionality
- Session persistence

## 7. Environment Variables

Make sure your Firebase configuration is properly set in your environment variables:

```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

## 8. Production Considerations

### Security Rules
For production, implement proper Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated admin users can access orders
    match /orders/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['admin@sanskritiyam.com', 'kartik@sanskritiyam.com'];
    }
    
    // Only authenticated admin users can access payments
    match /payments/{document} {
      allow read, write: if request.auth != null && 
        request.auth.token.email in ['admin@sanskritiyam.com', 'kartik@sanskritiyam.com'];
    }
  }
}
```

### Additional Security
- Enable App Check for additional security
- Set up proper CORS policies
- Implement rate limiting
- Add audit logging for admin actions

## 9. Troubleshooting

### Common Issues

**"Access Denied" Error**
- Check if your email is in the admin list
- Verify Firebase Authentication is enabled
- Check if user is properly authenticated

**Login Not Working**
- Verify Firebase configuration
- Check browser console for errors
- Ensure email/password are correct

**Registration Failing**
- Check if email already exists
- Verify password meets requirements (min 6 characters)
- Check Firebase Authentication settings

**Dashboard Not Loading**
- Check if user is authenticated
- Verify admin permissions
- Check Firebase connection

### Debug Steps
1. Check browser console for errors
2. Verify Firebase configuration
3. Test with different admin emails
4. Check Firebase Console for user creation
5. Verify Firestore security rules

## 10. Next Steps

1. **Create your first admin account** using `/admin/register`
2. **Test the complete flow** from login to order management
3. **Add additional admin emails** as needed
4. **Set up production security rules** before going live
5. **Train your team** on using the admin dashboard
