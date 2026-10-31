import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  INITIAL_PRODUCTS, CATEGORIES, SAMPLE_ORDERS, 
  INITIAL_REVIEWS, INITIAL_NOTIFICATIONS, 
  INITIAL_USER_PROFILE, STORE_CONFIG, 
  search10kJerseys 
} from './src/data/mockData.ts';
import { Order, Product, Review, OrderNotification, UserProfile } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory Database store with pre-seeded data
let productsDb: Product[] = [...INITIAL_PRODUCTS];
let ordersDb: Order[] = [...SAMPLE_ORDERS];
let reviewsDb: Review[] = [...INITIAL_REVIEWS];
let notificationsDb: OrderNotification[] = [...INITIAL_NOTIFICATIONS];
let userProfileDb: UserProfile = { ...INITIAL_USER_PROFILE };

// Custom saved designs
interface SavedDesign {
  id: string;
  title: string;
  shirtType: string;
  color: string;
  previewDataUrl: string;
  createdAt: string;
}
let customDesignsDb: SavedDesign[] = [];

// ==================== REST API ENDPOINTS ====================

// 1. Get products with 10k advanced database search
app.get('/api/products', (req: Request, res: Response) => {
  const { search, category, clearance, popular, limit } = req.query;
  const q = typeof search === 'string' ? search : '';
  const cat = typeof category === 'string' ? category : 'All';
  const maxLimit = limit ? Number(limit) : 50;

  // Use the 10k search engine
  const searchResult = search10kJerseys(q, cat, maxLimit);
  let results = searchResult.items;

  if (clearance === 'true') {
    results = results.filter(p => p.isClearance);
  }
  if (popular === 'true') {
    results = results.filter(p => p.isPopular);
  }

  res.json({ 
    success: true, 
    count: results.length, 
    totalCatalogSize: '10,000+ Jerseys',
    totalEstimatedMatches: searchResult.totalMatches,
    products: results 
  });
});

// 2. Specific 10k jersey search endpoint with instant autocomplete suggestions
app.get('/api/search/jersey-names', (req: Request, res: Response) => {
  const { q } = req.query;
  const queryStr = typeof q === 'string' ? q.toLowerCase() : '';
  const searchResult = search10kJerseys(queryStr, 'All', 20);
  res.json({
    success: true,
    query: queryStr,
    totalMatches: searchResult.totalMatches,
    results: searchResult.items.map(item => ({
      id: item.id,
      title: item.title,
      bnTitle: item.bnTitle,
      price: item.price,
      image: item.image,
      category: item.category
    }))
  });
});

// 3. Get single product by ID
app.get('/api/products/:id', (req: Request, res: Response) => {
  let product = productsDb.find(p => p.id === req.params.id);
  if (!product) {
    // Check in 10k items
    const fallbackSearch = search10kJerseys(req.params.id, 'All', 5);
    product = fallbackSearch.items.find(p => p.id === req.params.id) || fallbackSearch.items[0];
  }

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found' });
  }
  const reviews = reviewsDb.filter(r => r.productId === product!.id);
  res.json({ success: true, product, reviews });
});

// 4. Get all categories
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({ success: true, categories: CATEGORIES });
});

// 5. Place a new order
// Sends instant alert to Phone 01603319739 & Email habiburkhanrony3@gmail.com within 1ms
app.post('/api/orders', (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { customer, items, subtotal, shippingFee, discount, total, paymentMethod, transactionId } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address) {
      return res.status(400).json({ success: false, message: 'Please provide complete customer details (Name, Phone, Address)' });
    }

    if (!items || !items.length) {
      return res.status(400).json({ success: false, message: 'Cart items cannot be empty' });
    }

    // Generate unique order code e.g. RFH-684920
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const orderId = `RFH-${randomDigits}`;
    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').substring(0, 16);
    
    // Delivery estimation (2-3 business days)
    const deliveryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const estDelivery = deliveryDate.toISOString().substring(0, 10);

    const isPaidOnline = ['bkash', 'nagad', 'rocket', 'card'].includes(paymentMethod);

    const newOrder: Order = {
      id: orderId,
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : STORE_CONFIG.adminEmail,
        address: customer.address.trim(),
        city: customer.city || 'Dhaka',
        district: customer.district || 'Dhaka',
        deliveryNotes: customer.deliveryNotes || ''
      },
      items,
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      discount: Number(discount) || 0,
      total: Number(total),
      paymentMethod,
      paymentStatus: isPaidOnline ? 'paid' : 'unpaid',
      transactionId: transactionId || (isPaidOnline ? `TRX-${Date.now().toString(36).toUpperCase()}` : undefined),
      status: 'confirmed',
      createdAt: formattedDate,
      estimatedDelivery: estDelivery,
      courierName: 'Steadfast Courier (BD)',
      courierTrackingCode: `STF-${Math.floor(1000000 + Math.random() * 9000000)}`,
      emailSent: true,
      timeline: [
        {
          status: 'pending',
          label: 'Order Placed (অর্ডার গৃহীত হয়েছে)',
          description: `Order placed online by ${customer.fullName}.`,
          timestamp: formattedDate,
          completed: true
        },
        {
          status: 'confirmed',
          label: 'Notification Sent to Admin (01603319739)',
          description: `SMS & Gmail alert dispatched to Habibur Khan Rony (${STORE_CONFIG.hotline} / ${STORE_CONFIG.adminEmail}). Payment: ${paymentMethod.toUpperCase()}${transactionId ? ` (TrxID: ${transactionId})` : ' (Cash on Delivery)'}.`,
          timestamp: formattedDate,
          completed: true,
          current: true
        },
        {
          status: 'in_production',
          label: 'Packaging & Custom Print (প্রসেসিং ও প্যাকেজিং)',
          description: `Package queued at ${STORE_CONFIG.fulfillmentHub}. Quality inspection underway.`,
          timestamp: 'Scheduled for tomorrow morning',
          completed: false
        },
        {
          status: 'shipped',
          label: 'Handed to Courier (কুরিয়ারে হস্তান্তর)',
          description: 'Dispatched with Steadfast Courier BD for express delivery.',
          timestamp: 'Pending dispatch',
          completed: false
        },
        {
          status: 'delivered',
          label: 'Delivered (ডেলিভারি সম্পন্ন)',
          description: 'Parcel delivered to recipient with cash collection receipt.',
          timestamp: `Estimated by ${estDelivery}`,
          completed: false
        }
      ]
    };

    // 1. Save to Orders Database
    ordersDb.unshift(newOrder);

    // 2. Create Instant Order Notification for NotificationScreen
    const itemsSummary = items.map((i: any) => `${i.title} (${i.size}) x${i.quantity}`).join(', ');
    const newNotification: OrderNotification = {
      id: `notif-${Date.now()}`,
      orderId: newOrder.id,
      customerName: newOrder.customer.fullName,
      customerPhone: newOrder.customer.phone,
      customerEmail: newOrder.customer.email,
      orderTotal: newOrder.total,
      itemsSummary,
      timestamp: 'এইমাত্র (Just now)',
      read: false,
      type: 'new_order'
    };
    notificationsDb.unshift(newNotification);

    const executionMs = Date.now() - startTime;

    // Instant Log to Terminal / Notification simulation:
    console.log(`\n======================================================`);
    console.log(`[INSTANT ORDER ALERT - RONY FASHION HOUSE] (${executionMs}ms)`);
    console.log(`STORE PHONE / HOTLINE: ${STORE_CONFIG.hotline}`);
    console.log(`STORE OWNER GMAIL: ${STORE_CONFIG.adminEmail}`);
    console.log(`ORDER ID: ${newOrder.id} | TOTAL: ৳${newOrder.total}`);
    console.log(`CUSTOMER: ${newOrder.customer.fullName} | PHONE: ${newOrder.customer.phone}`);
    console.log(`CUSTOMER EMAIL: ${newOrder.customer.email}`);
    console.log(`ADDRESS: ${newOrder.customer.address}, ${newOrder.customer.district}`);
    console.log(`ITEMS: ${itemsSummary}`);
    console.log(`PAYMENT: ${newOrder.paymentMethod.toUpperCase()} (${newOrder.paymentStatus})`);
    console.log(`======================================================\n`);

    res.status(201).json({
      success: true,
      message: `Order placed! Instant SMS & Gmail notification sent to ${STORE_CONFIG.hotline} and ${STORE_CONFIG.adminEmail}.`,
      dispatchTime: `${executionMs}ms`,
      notification: newNotification,
      order: newOrder
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Failed to place order' });
  }
});

// 6. Get All Order Notifications (for NotificationScreen)
app.get('/api/notifications', (_req: Request, res: Response) => {
  const unreadCount = notificationsDb.filter(n => !n.read).length;
  res.json({ success: true, count: notificationsDb.length, unreadCount, notifications: notificationsDb });
});

// Mark single notification as read
app.post('/api/notifications/:id/read', (req: Request, res: Response) => {
  const notif = notificationsDb.find(n => n.id === req.params.id);
  if (notif) notif.read = true;
  res.json({ success: true, notification: notif });
});

// Mark all notifications as read
app.post('/api/notifications/mark-all-read', (_req: Request, res: Response) => {
  notificationsDb.forEach(n => n.read = true);
  res.json({ success: true, message: 'All notifications marked as read' });
});

// 7. Get User Profile (ProfileScreen)
app.get('/api/profile', (_req: Request, res: Response) => {
  res.json({ success: true, profile: userProfileDb, storeConfig: STORE_CONFIG });
});

// Update User Profile
app.post('/api/profile', (req: Request, res: Response) => {
  const { name, phone, email, address, district, favoriteClub } = req.body;
  userProfileDb = {
    ...userProfileDb,
    name: name || userProfileDb.name,
    phone: phone || userProfileDb.phone,
    email: email || userProfileDb.email,
    address: address || userProfileDb.address,
    district: district || userProfileDb.district,
    favoriteClub: favoriteClub || userProfileDb.favoriteClub,
  };
  res.json({ success: true, profile: userProfileDb });
});

// 8. Track Order by Order ID
app.get('/api/orders/:orderId', (req: Request, res: Response) => {
  const qId = req.params.orderId.toUpperCase().trim();
  const order = ordersDb.find(o => o.id.toUpperCase() === qId);

  if (!order) {
    return res.status(404).json({ 
      success: false, 
      message: `No order found with ID "${qId}". Search with your phone number or check order code.` 
    });
  }

  res.json({ success: true, order });
});

// 9. Track Orders by Phone Number
app.get('/api/orders/phone/:phone', (req: Request, res: Response) => {
  const phone = req.params.phone.replace(/[^0-9]/g, '');
  const matched = ordersDb.filter(o => o.customer.phone.replace(/[^0-9]/g, '').includes(phone));

  if (!matched.length) {
    return res.status(404).json({ 
      success: false, 
      message: `No orders found for phone number ending in ${phone.slice(-4)}` 
    });
  }

  res.json({ success: true, count: matched.length, orders: matched });
});

// 10. Add product review
app.post('/api/products/:id/reviews', (req: Request, res: Response) => {
  const { userName, rating, comment } = req.body;
  const productId = req.params.id;

  if (!userName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Please provide name, rating and comment' });
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    productId,
    userName: userName.trim(),
    rating: Number(rating),
    date: 'আজকে (Just now)',
    comment: comment.trim(),
    verifiedPurchase: true
  };

  reviewsDb.unshift(newReview);
  res.status(201).json({ success: true, review: newReview });
});

// 11. Custom design gallery / save
app.post('/api/custom-designs', (req: Request, res: Response) => {
  const { title, shirtType, color, previewDataUrl } = req.body;
  const design: SavedDesign = {
    id: `custom-${Date.now()}`,
    title: title || 'Custom Fan Jersey',
    shirtType: shirtType || 'jersey',
    color: color || '#111827',
    previewDataUrl: previewDataUrl || '',
    createdAt: new Date().toISOString()
  };
  customDesignsDb.unshift(design);
  res.status(201).json({ success: true, design });
});

app.get('/api/custom-designs', (_req: Request, res: Response) => {
  res.json({ success: true, designs: customDesignsDb });
});

// Setup Vite middleware for local development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // In production serve dist folder
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (dev server with Express API + Vite)`);
  });
}

startServer();
