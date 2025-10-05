# Firebase Setup Instructions

## 1. Firebase Project Configuration

### Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your "Sanskritiyam" project
3. Click on the gear icon (Settings) → Project Settings
4. Scroll down to "Your apps" section
5. Click "Add app" → Web app (</>) icon
6. Register your app with a nickname (e.g., "Sanskritiyam Web")
7. Copy the Firebase configuration object

### Step 2: Update Firebase Config

Replace the placeholder values in `src/firebase/config.js` with your actual Firebase configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "sanskritiyam.firebaseapp.com",
  projectId: "sanskritiyam",
  storageBucket: "sanskritiyam.appspot.com",
  messagingSenderId: "your-actual-sender-id",
  appId: "your-actual-app-id",
};
```

## 2. Firestore Database Setup

### Step 1: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### Step 2: Set Up Security Rules (Optional - for production)

Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to orders and payments
    match /orders/{document} {
      allow read, write: if true; // For development only
    }
    match /payments/{document} {
      allow read, write: if true; // For development only
    }
  }
}
```

## 3. Collections Structure

The application will automatically create the following collections:

### Orders Collection (`orders`)

Each document contains:

```javascript
{
  // Customer information
  customer: {
    name: "John Doe",
    gotra: "Kashyap",
    email: "john@example.com",
    phone: "9876543210",
    address: {
      street: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001"
    }
  },

  // Temple information
  temple: {
    id: "mangala-gauri",
    name: "Mangala Gauri Mandir Kashi",
    location: "Mangala Gauri Temple, Kashi",
    image: "/assets/newimg/MangalaGauri.webp"
  },

  // Package information
  package: {
    id: 1,
    name: "Quick Marriage Puja",
    price: 851,
    description: "Package description"
  },

  // Order items
  items: [
    {
      type: "package",
      name: "Quick Marriage Puja",
      price: 851,
      quantity: 1,
      description: "Package description"
    },
    {
      type: "offering",
      id: "sarees",
      name: "Sarees",
      price: 551,
      quantity: 2,
      description: "Symbol of happiness"
    }
  ],

  // Order metadata
  totalAmount: 1953,
  orderNumber: "SKT123456ABC",
  eventName: "Mangala Gauri Mandir Kashi - Quick Marriage Puja",
  status: "confirmed",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z",
  notes: "",
  specialInstructions: ""
}
```

### Payments Collection (`payments`)

Each document contains:

```javascript
{
  orderId: "order_document_id",
  amount: 1953,
  currency: "INR",
  paymentMethod: "online",
  paymentGateway: "razorpay",
  gatewayDetails: {
    transactionId: "txn_123456",
    paymentId: "pay_123456",
    signature: "signature_hash",
    gatewayOrderId: "order_123456"
  },
  customerEmail: "john@example.com",
  customerPhone: "9876543210",
  orderNumber: "SKT123456ABC",
  eventName: "Mangala Gauri Mandir Kashi - Quick Marriage Puja",
  status: "success",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-01-01T00:00:00Z"
}
```

## 4. Testing the Setup

### Step 1: Test Order Creation

1. Start the development server: `npm run dev`
2. Navigate to a temple page (e.g., `/temple/mangala-gauri`)
3. Select a package and go to offerings
4. Add some items to cart
5. Complete the payment form
6. Check Firebase Console → Firestore Database to see the created documents

### Step 2: Test Admin Dashboard

1. Navigate to `/admin/orders`
2. View the order dashboard with statistics
3. Test order status updates

## 5. Production Considerations

### Security Rules

For production, implement proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Orders - only authenticated users can read/write
    match /orders/{document} {
      allow read, write: if request.auth != null;
    }

    // Payments - only authenticated users can read/write
    match /payments/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Environment Variables

Store Firebase configuration in environment variables:

1. Create `.env.local` file:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

2. Update `src/firebase/config.js`:

```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
```

## 6. Available Features

### Order Management

- ✅ Create orders with customer details
- ✅ Store temple and package information
- ✅ Track cart items and quantities
- ✅ Generate unique order numbers
- ✅ Order status management (pending, confirmed, in_progress, completed, cancelled)

### Payment Tracking

- ✅ Link payments to orders
- ✅ Store payment gateway details
- ✅ Track payment status
- ✅ Store transaction information

### Admin Dashboard

- ✅ View all orders
- ✅ Filter orders by status
- ✅ Order statistics and revenue tracking
- ✅ Update order status
- ✅ Detailed order view with customer information

### Data Validation

- ✅ Form validation before saving
- ✅ Email and phone number validation
- ✅ Required field validation
- ✅ Data formatting utilities

## 7. Next Steps

1. **Update Firebase Config**: Replace placeholder values with actual Firebase configuration
2. **Test Order Flow**: Complete a test order to verify data is being saved
3. **Set Up Authentication**: Implement user authentication for admin access
4. **Add Email Notifications**: Send confirmation emails to customers
5. **Implement Payment Gateway**: Integrate with Razorpay or other payment providers
6. **Add Order Tracking**: Allow customers to track their order status
7. **Export Functionality**: Add CSV/Excel export for order data
8. **Analytics**: Add order analytics and reporting features
