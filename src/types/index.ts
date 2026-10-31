export interface Product {
  id: string;
  title: string;
  bnTitle?: string;
  price: number;
  oldPrice: number;
  discount: string;
  image: string;
  category: string;
  description: string;
  sizes: string[];
  stockCount: number;
  rating: number;
  reviewCount: number;
  isPopular?: boolean;
  isClearance?: boolean;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  bnName: string;
  image: string;
  itemCount: number;
  tag: string;
}

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
  isCustom?: boolean;
  customDetails?: {
    playerName?: string;
    playerNumber?: string;
    shirtColor?: string;
    hasCustomImage?: boolean;
    view?: 'front' | 'back';
    badge?: string;
  };
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  deliveryNotes?: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'card';

export type OrderStatus = 'pending' | 'confirmed' | 'in_production' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface Order {
  id: string; // e.g. BZ-891024
  customer: OrderCustomerInfo;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'paid' | 'unpaid' | 'verification_pending';
  transactionId?: string;
  status: OrderStatus;
  createdAt: string;
  estimatedDelivery: string;
  courierName: string;
  courierTrackingCode: string;
  timeline: OrderTimelineEvent[];
  emailSent: boolean;
}

export interface CustomDesignState {
  shirtType: 'jersey' | 'tshirt' | 'polo';
  color: string;
  view: 'front' | 'back';
  playerName: string;
  playerNumber: string;
  sponsorText: string;
  fontFamily: string;
  textColor: string;
  textSize: number;
  textOffsetY: number;
  badge: string;
  // Uploaded image
  uploadedImageSrc: string | null;
  imageScale: number;
  imagePosX: number;
  imagePosY: number;
  // Image Filters
  filters: {
    brightness: number; // 50 to 150 (default 100)
    contrast: number;   // 50 to 150 (default 100)
    saturation: number; // 0 to 200 (default 100)
    grayscale: number;  // 0 to 100 (default 0)
    invert: number;     // 0 or 100 (default 0)
    sepia: number;      // 0 to 100 (default 0)
    hueRotate: number;  // 0 to 360 (default 0)
  };
}

export interface OrderNotification {
  id: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  orderTotal: number;
  itemsSummary: string;
  timestamp: string;
  read: boolean;
  type: 'new_order' | 'payment_received' | 'dispatch_update';
}

export interface UserProfile {
  name: string;
  phone: string;
  email: string;
  address: string;
  district: string;
  rewardPoints: number;
  totalOrders: number;
  favoriteClub: string;
}

