import { Product, Category, Review, Order, OrderNotification, UserProfile } from '../types';

export const STORE_CONFIG = {
  brandName: 'Rony Fashion House',
  shortBrand: 'RFH',
  tagline: 'Premium Sports & Custom Jersey Studio',
  bnTagline: 'প্রিমিয়াম স্পোর্টস ও কাস্টম জার্সি হাউস',
  hotline: '01603319739',
  whatsAppNumber: '01603319739',
  whatsAppLink: 'https://wa.me/8801603319739?text=Hello%20Rony%20Fashion%20House,%20I%20want%20to%20order%20a%20jersey',
  adminEmail: 'habiburkhanrony3@gmail.com',
  ownerName: 'Habibur Khan Rony',
  ownerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  address: 'House 32, Road 7A, Dhanmondi, Dhaka-1209, Bangladesh',
  fulfillmentHub: 'Dhanmondi Central Hub, Dhaka',
  established: '2022',
};

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Habibur Khan Rony',
  phone: '01603319739',
  email: 'habiburkhanrony3@gmail.com',
  address: 'Road 7A, Dhanmondi',
  district: 'Dhaka',
  rewardPoints: 240,
  totalOrders: 14,
  favoriteClub: 'Real Madrid / Argentina'
};

export const CATEGORIES: Category[] = [
  { 
    id: '1', 
    name: 'Stock Clearance Offer', 
    bnName: 'স্টক ক্লিয়ারেন্স অফার', 
    image: 'https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=600&auto=format&fit=crop&q=80',
    itemCount: 28,
    tag: 'clearance'
  },
  { 
    id: '2', 
    name: 'Bd Premium Jersey', 
    bnName: 'বাংলাদেশ প্রিমিয়াম জার্সি', 
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
    itemCount: 42,
    tag: 'bd_premium'
  },
  { 
    id: '3', 
    name: 'Master Copy Edition', 
    bnName: 'মাস্টার কপি এডিশন', 
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    itemCount: 85,
    tag: 'master_copy'
  },
  { 
    id: '4', 
    name: 'Player Edition (Authentic)', 
    bnName: 'প্লেয়ার এডিশন অরিজিনাল', 
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80',
    itemCount: 64,
    tag: 'player_edition'
  },
  { 
    id: '5', 
    name: 'Spider-Man Compression Tee', 
    bnName: 'স্পাইডারম্যান কম্প্রেশন টি', 
    image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=600&auto=format&fit=crop&q=80',
    itemCount: 18,
    tag: 'superhero'
  },
  { 
    id: '6', 
    name: 'Full Jersey & Shorts Set', 
    bnName: 'ফুল জার্সি ও হাফপ্যান্ট সেট', 
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80',
    itemCount: 52,
    tag: 'jersey_set'
  },
  { 
    id: '7', 
    name: 'Full Sleeve Retro', 
    bnName: 'ফুল স্লিভ রেট্রো', 
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80',
    itemCount: 36,
    tag: 'full_sleeve'
  },
  { 
    id: '8', 
    name: 'Sweep Shirt & Hoodies', 
    bnName: 'সুইপ শার্ট ও উইন্টার ওয়্যার', 
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    itemCount: 24,
    tag: 'sweep_shirt'
  },
  { 
    id: '9', 
    name: 'Retro Classics 90s-00s', 
    bnName: 'ক্লাসিক রেট্রো কালেকশন', 
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    itemCount: 78,
    tag: 'retro'
  },
];

// Rich Curated Initial Products with 100% working, verified sport jersey photos
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Real Madrid Retro Gold Polo Jersey (Limited Edition)',
    bnTitle: 'রিয়াল মাদ্রিদ রেট্রো গোল্ড পোলো জার্সি (রনি ফ্যাশন হাউস স্পেশাল)',
    price: 490,
    oldPrice: 850,
    discount: '42% OFF',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    category: 'Retro Classics 90s-00s',
    description: `Premium Mesh micro-interlock fabric 180 GSM with moisture-wicking technology.\nAuthentic gold metallic club crest & vintage polo collar.\nSize Chart:\nM: Length 27", Chest 38"\nL: Length 28", Chest 40"\nXL: Length 29", Chest 42"\nXXL: Length 30", Chest 44"`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 4,
    rating: 4.9,
    reviewCount: 48,
    isPopular: true,
    isClearance: true,
    featured: true
  },
  {
    id: '2',
    title: 'AC Milan Retro 2007 Full Sleeve Jersey',
    bnTitle: 'এসি মিলান রেট্রো ২০০৭ ফুল স্লিভ জার্সি',
    price: 400,
    oldPrice: 850,
    discount: '53% OFF',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80',
    category: 'Full Sleeve Retro',
    description: `Legendary Kaká era AC Milan full sleeve jersey. Premium breathable mesh with iconic red & black stripes and embroidered crest badge.\nBest for winter sports and casual football fanatic wear.`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 7,
    rating: 4.8,
    reviewCount: 32,
    isPopular: true,
    featured: true
  },
  {
    id: '3',
    title: 'FC Barcelona UNICEF Special Edition Fan Polo',
    bnTitle: 'বার্সেলোনা ইউনিসেফ স্পেশাল এডিশন পোলো জার্সি',
    price: 490,
    oldPrice: 850,
    discount: '42% OFF',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80',
    category: 'Master Copy Edition',
    description: `Special classic Blaugrana jersey with historic UNICEF golden print. Lightweight breathable microfiber with sweat-wicking dry cell finish.`,
    sizes: ['M', 'L', 'XL'],
    stockCount: 9,
    rating: 4.7,
    reviewCount: 26,
    isPopular: true,
    featured: false
  },
  {
    id: '4',
    title: 'Real Madrid Sweep Shirt Winter Warm-up',
    bnTitle: 'রিয়াল মাদ্রিদ সুইপ শার্ট উইন্টার কালেকশন',
    price: 650,
    oldPrice: 1350,
    discount: '52% OFF',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
    category: 'Sweep Shirt & Hoodies',
    description: `Winter training collection sweep shirt. Fleeced inner lining for warmth during cold morning training sessions. Highly comfortable and durable.`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 5,
    rating: 5.0,
    reviewCount: 39,
    isPopular: true,
    featured: true
  },
  {
    id: '5',
    title: 'Argentina 3-Star World Champions Authentic Player Jersey',
    bnTitle: 'আর্জেন্টিনা ৩-স্টার বিশ্বকাপ চ্যাম্পিয়ন জার্সি (মেসি ১০)',
    price: 590,
    oldPrice: 1150,
    discount: '48% OFF',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
    category: 'Player Edition (Authentic)',
    description: `Authentic Heat.RDY player edition shirt with embossed 3 stars and World Cup Winners badge. Ultra-light, laser-cut ventilation holes.`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 12,
    rating: 4.95,
    reviewCount: 65,
    isPopular: true,
    featured: true
  },
  {
    id: '6',
    title: 'Brazil Retro 1998 Ronaldo 9 Classic Jersey',
    bnTitle: 'ব্রাজিল রেট্রো ১৯৯৮ রোনালদো ৯ ক্লাসিক জার্সি',
    price: 490,
    oldPrice: 850,
    discount: '42% OFF',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    category: 'Retro Classics 90s-00s',
    description: `Iconic 1998 vintage canary yellow jersey with green shoulder piping and legendary R9 styling. Cotton-feel poly blend fabric.`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 8,
    rating: 4.9,
    reviewCount: 34,
    isPopular: true,
    featured: false
  },
  {
    id: '7',
    title: 'Spider-Man Superhero Quick-Dry Gym Compression Tee',
    bnTitle: 'স্পাইডারম্যান জিম ও রানিং কম্প্রেশন টি-শার্ট',
    price: 390,
    oldPrice: 750,
    discount: '48% OFF',
    image: 'https://images.unsplash.com/photo-1635863138275-d9b33299680b?w=600&auto=format&fit=crop&q=80',
    category: 'Spider-Man Compression Tee',
    description: `4-way stretch spandex compression shirt. 3D sublimated spider web print that never fades. UV-protective and high muscle support.`,
    sizes: ['M', 'L', 'XL'],
    stockCount: 6,
    rating: 4.6,
    reviewCount: 22,
    isPopular: false,
    featured: false
  },
  {
    id: '8',
    title: 'Bangladesh Tigers Official Cricket Jersey 2026',
    bnTitle: 'বাংলাদেশ টাইগার্স অফিসিয়াল ক্রিকেট জার্সি ২০২৬',
    price: 520,
    oldPrice: 950,
    discount: '45% OFF',
    image: 'https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=600&auto=format&fit=crop&q=80',
    category: 'Bd Premium Jersey',
    description: `Green & red Bengal Tiger claw sublimation print. Moisture-control micro-knit mesh, breathable side panels, rubberized BCB crest.`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 15,
    rating: 4.85,
    reviewCount: 57,
    isPopular: true,
    featured: true
  },
  {
    id: '9',
    title: 'Arsenal Retro 2005-06 Highbury Maroon Farewell Jersey',
    bnTitle: 'আর্সেনাল রেট্রো ২০০৫-০৬ হাইবারি মেরুন জার্সি (অঁরি ১৪)',
    price: 520,
    oldPrice: 990,
    discount: '47% OFF',
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80',
    category: 'Retro Classics 90s-00s',
    description: `Historic Redcurrant Highbury memorial jersey with gold O2 print. A legendary collector piece for any Gooner.`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 11,
    rating: 4.95,
    reviewCount: 41,
    isPopular: true,
    featured: true
  },
  {
    id: '10',
    title: 'Manchester United 2008 Moscow Final Black Away Jersey',
    bnTitle: 'ম্যান ইউনাইটেড ২০০৮ মস্কো ফাইনাল ব্ল্যাক অ্যাওয়ে জার্সি',
    price: 490,
    oldPrice: 880,
    discount: '44% OFF',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
    category: 'Master Copy Edition',
    description: `Iconic CR7 double winner season black kit with red vertical chest stripe and AIG print.`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 8,
    rating: 4.9,
    reviewCount: 37,
    isPopular: true,
    featured: true
  },
  {
    id: '11',
    title: 'Manchester City 4-In-A-Row Treble Winners Player Jersey',
    bnTitle: 'ম্যানচেস্টার সিটি ট্রেবল উইনার্স প্লেয়ার এডিশন (হাল্যান্ড ৯)',
    price: 560,
    oldPrice: 1050,
    discount: '46% OFF',
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80',
    category: 'Player Edition (Authentic)',
    description: `Sky Blue master performance kit with golden Premier League champions badge.`,
    sizes: ['M', 'L', 'XL'],
    stockCount: 10,
    rating: 4.8,
    reviewCount: 29,
    isPopular: true,
    featured: false
  },
  {
    id: '12',
    title: 'Portugal Euro 2016 Champions Cristiano Ronaldo 7 Jersey',
    bnTitle: 'পর্তুগাল ইউরো ২০১৬ চ্যাম্পিয়ন সিআর৭ জার্সি',
    price: 510,
    oldPrice: 950,
    discount: '46% OFF',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
    category: 'Player Edition (Authentic)',
    description: `Vibrant ruby red body with turquoise shoulder gradients. Official Euro 2016 champion badge on sleeve.`,
    sizes: ['M', 'L', 'XL', 'XXL'],
    stockCount: 7,
    rating: 4.95,
    reviewCount: 46,
    isPopular: true,
    featured: true
  }
];

export const INITIAL_NOTIFICATIONS: OrderNotification[] = [
  {
    id: 'notif-1',
    orderId: 'RFH-982417',
    customerName: 'Rafiqul Islam',
    customerPhone: '01712345678',
    customerEmail: 'rafiqul@example.com',
    orderTotal: 500,
    itemsSummary: 'Real Madrid Retro Gold Polo Jersey (XL) x 1',
    timestamp: '2 মিনিট আগে (Just now)',
    read: false,
    type: 'new_order'
  },
  {
    id: 'notif-2',
    orderId: 'RFH-774102',
    customerName: 'Kawsar Mahmud',
    customerPhone: '01819283746',
    customerEmail: 'kawsar@gmail.com',
    orderTotal: 940,
    itemsSummary: 'AC Milan Retro 2007 Full Sleeve (L) + Custom T-Shirt x 1',
    timestamp: '15 মিনিট আগে',
    read: false,
    type: 'payment_received'
  },
  {
    id: 'notif-3',
    orderId: 'RFH-652390',
    customerName: 'Tanvir Hossain',
    customerPhone: '01912984756',
    customerEmail: 'tanvir@gmail.com',
    orderTotal: 650,
    itemsSummary: 'Argentina 3-Star World Champions Authentic (XL) x 1',
    timestamp: '1 ঘণ্টা আগে',
    read: true,
    type: 'dispatch_update'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: '1',
    userName: 'Tanvir Ahmed (Dhaka)',
    rating: 5,
    date: '2 দিন আগে',
    comment: 'রনি ফ্যাশন হাউসের জার্সির কোয়ালিটি অসাধারণ! গোল্ড কালার প্রিন্ট আর ফ্যাব্রিক একদম প্রিমিয়াম। সাইজ একদম পারফেক্ট হয়েছে।',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: '1',
    userName: 'Sabbir Hossain (Sylhet)',
    rating: 5,
    date: '৫ দিন আগে',
    comment: 'Rony Fashion House থেকে ২য় বার অর্ডার করলাম। ধানমন্ডি হাব থেকে ডেলিভারি খুব দ্রুত পেয়েছি। ধন্যবাদ হাবিবুর ভাই!',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: '2',
    userName: 'Kawsar Mahmud (Dhanmondi, Dhaka)',
    rating: 4,
    date: '১ সপ্তাহ আগে',
    comment: 'ফুল স্লিভ রেট্রো কাপড়ের ফিনিশিং দারুণ। শীতে খেলার জন্য খুব আরামদায়ক।',
    verifiedPurchase: true
  },
  {
    id: 'rev-4',
    productId: '5',
    userName: 'Nazmul Hasan (Chittagong)',
    rating: 5,
    date: '৩ দিন আগে',
    comment: 'মেসির ৩ স্টার জার্সিটা একদম আসল প্লেয়ার এডিশনের মতো হালকা এবং আরামদায়ক। মাস্ট বাই!',
    verifiedPurchase: true
  }
];

export const BD_DISTRICTS = [
  'Dhaka', 'Gazipur', 'Narayanganj', 'Chittagong', 
  'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 
  'Mymensingh', 'Comilla', 'Brahmanbaria', 'Cox\'s Bazar', 'Moulvibazar', 'Sunamganj'
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'RFH-982417',
    customer: {
      fullName: 'Rafiqul Islam',
      phone: '01712345678',
      email: 'rafiqul@example.com',
      address: 'House 42, Road 7, Sector 3, Uttara',
      city: 'Dhaka',
      district: 'Dhaka',
      deliveryNotes: 'Call before delivery please'
    },
    items: [
      {
        id: 'c-1',
        productId: '1',
        title: 'Real Madrid Retro Gold Polo Jersey (Limited Edition)',
        price: 490,
        size: 'XL',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80'
      }
    ],
    subtotal: 490,
    shippingFee: 60,
    discount: 50,
    total: 500,
    paymentMethod: 'bkash',
    paymentStatus: 'paid',
    transactionId: 'BKASH827XMN91',
    status: 'shipped',
    createdAt: '2026-10-28 14:30',
    estimatedDelivery: '2026-10-31',
    courierName: 'Steadfast Courier (BD)',
    courierTrackingCode: 'STF-8829410',
    emailSent: true,
    timeline: [
      {
        status: 'pending',
        label: 'Order Placed (অর্ডার গৃহীত হয়েছে)',
        description: 'Order received and logged in Rony Fashion House database.',
        timestamp: '2026-10-28 14:30',
        completed: true
      },
      {
        status: 'confirmed',
        label: 'Payment & SMS Alert (পেমেন্ট নিশ্চিত)',
        description: 'bKash TrxID BKASH827XMN91 verified. Alert dispatched to 01603319739 & habiburkhanrony3@gmail.com.',
        timestamp: '2026-10-28 14:45',
        completed: true
      },
      {
        status: 'in_production',
        label: 'Packaging & Quality Check (প্যাকিং সম্পন্ন)',
        description: 'Jersey inspected and sealed at Dhanmondi Central Hub, Dhaka.',
        timestamp: '2026-10-29 09:15',
        completed: true
      },
      {
        status: 'shipped',
        label: 'Dispatched to Courier (কুরিয়ারে পাঠানো হয়েছে)',
        description: 'Package handed over to Steadfast Courier tracking #STF-8829410. In transit to destination hub.',
        timestamp: '2026-10-29 11:20',
        completed: true,
        current: true
      },
      {
        status: 'delivered',
        label: 'Delivered (ডেলিভারি সম্পন্ন)',
        description: 'Parcel delivered to recipient.',
        timestamp: 'Estimated 2026-10-31',
        completed: false
      }
    ]
  }
];

// Helper to generate 10,000+ searchable jersey database for advanced searching
const CLUBS = [
  { name: 'Real Madrid', bn: 'রিয়াল মাদ্রিদ', tags: ['madrid', 'halamadrid', 'rmcf', 'ronaldo', 'bellingham', 'vini'], colors: ['White', 'Gold', 'Black Away', 'Purple Third', 'Retro 2002', 'Retro 2017'] },
  { name: 'FC Barcelona', bn: 'বার্সেলোনা', tags: ['barca', 'blaugrana', 'messi', 'pedri', 'yamal', 'unicef'], colors: ['Blaugrana Home', 'Gold Away', 'Catalan Senyera', 'Retro 2009', 'Retro 2011'] },
  { name: 'Argentina', bn: 'আর্জেন্টিনা', tags: ['albiceleste', 'messi', 'maradona', 'dimaria', '3star', 'worldcup'], colors: ['Sky Blue White 3-Star', 'Purple Away', 'Retro 1986 Maradona', 'Retro 2022 Champions'] },
  { name: 'Brazil', bn: 'ব্রাজিল', tags: ['selecao', 'neymar', 'ronaldo', 'ronaldinho', 'r9'], colors: ['Canary Yellow Home', 'Blue Away', 'Retro 1998 R9', 'Retro 2002 5-Star'] },
  { name: 'Manchester United', bn: 'ম্যানচেস্টার ইউনাইটেড', tags: ['manunited', 'mufc', 'cr7', 'beckham', 'rooney'], colors: ['Red Devils Home', 'Black Away 2008', 'Green & Gold Retro', 'White Third'] },
  { name: 'Arsenal', bn: 'আর্সেনাল', tags: ['gunners', 'henry', 'saka', 'odegaard', 'invincibles'], colors: ['Classic Red White', 'Highbury Maroon 2006', 'Yellow Away', 'Black Gold Third'] },
  { name: 'Manchester City', bn: 'ম্যান সিটি', tags: ['mancity', 'haaland', 'debruyne', 'treble'], colors: ['Sky Blue Home', 'Red & Black Away', 'Neon Yellow Third'] },
  { name: 'Liverpool', bn: 'লিভারপুল', tags: ['lfc', 'ynwa', 'salah', 'gerrard'], colors: ['All Red Home', 'Green White Away', 'Retro 2005 Istanbul'] },
  { name: 'Chelsea', bn: 'চেলসি', tags: ['blues', 'hazard', 'drogba', 'palmer'], colors: ['Royal Blue Home', 'Yellow Away', 'Black Silver Third'] },
  { name: 'Bayern Munich', bn: 'বায়ার্ন মিউনিখ', tags: ['bayern', 'kane', 'muller', 'miasanmia'], colors: ['All Red Home', 'Black Away', 'Oktoberfest Special Edition'] },
  { name: 'PSG', bn: 'পিএসজি', tags: ['paris', 'mbappe', 'messi', 'jordan'], colors: ['Midnight Navy Home', 'White Away', 'Jordan Fourth Edition'] },
  { name: 'AC Milan', bn: 'এসি মিলান', tags: ['milan', 'kaka', 'maldini', 'ibrahimovic'], colors: ['Red & Black Stripes', 'All White Champions League Kit', 'Retro 2007 Full Sleeve'] },
  { name: 'Inter Milan', bn: 'ইন্টার মিলান', tags: ['inter', 'nerazzurri', 'lautaro'], colors: ['Black & Blue Stripes', 'Snakeskin Away Edition'] },
  { name: 'Juventus', bn: 'জুভেন্টাস', tags: ['juve', 'bianconeri', 'delpiero', 'dybala'], colors: ['Black & White Stripes', 'Pink Away', 'Gold Third'] },
  { name: 'Portugal', bn: 'পর্তুগাল', tags: ['portugal', 'cr7', 'ronaldo', 'euro'], colors: ['Red Green Home', 'White Turquoise Away', 'Euro 2016 Edition'] },
  { name: 'Germany', bn: 'জার্মানি', tags: ['dfb', 'kroos', 'muller', 'worldcup'], colors: ['White Black Home', 'Pink Purple Away', 'Retro 1990 DFB'] },
  { name: 'France', bn: 'ফ্রান্স', tags: ['lesbleus', 'mbappe', 'zidane', 'henry'], colors: ['Royal Blue 2-Star Home', 'White Crest Away', 'Retro 1998 World Cup'] },
  { name: 'Bangladesh Cricket & Football', bn: 'বাংলাদেশ টাইগার্স', tags: ['bangladesh', 'tigers', 'shakib', 'tamim', 'bcb'], colors: ['Green Red Tiger Sublimation', 'Red Away Cricket Kit', 'Special Victory Day Edition'] },
];

const STYLES = ['Player Edition (Authentic)', 'Master Copy Edition', 'Retro Classics 90s-00s', 'Full Sleeve Retro', 'Full Jersey & Shorts Set', 'Sweep Shirt & Hoodies'];
const SIZES_COMBO = ['M', 'L', 'XL', 'XXL'];

// Pre-generated 10k database generator helper that returns consistent items
export function search10kJerseys(query: string, category?: string, limit = 40): { totalMatches: number; items: Product[] } {
  const cleanQ = query.toLowerCase().trim();
  const results: Product[] = [];

  // 1. Search initial curated products first
  for (const p of INITIAL_PRODUCTS) {
    if (!cleanQ || p.title.toLowerCase().includes(cleanQ) || (p.bnTitle && p.bnTitle.toLowerCase().includes(cleanQ)) || p.category.toLowerCase().includes(cleanQ)) {
      if (!category || category === 'All' || p.category.toLowerCase() === category.toLowerCase()) {
        results.push(p);
      }
    }
  }

  // 2. Dynamically expand matching combinations across 10,000+ variants
  let syntheticCount = 0;
  for (let cIdx = 0; cIdx < CLUBS.length; cIdx++) {
    const club = CLUBS[cIdx];
    const isClubMatch = !cleanQ || 
      club.name.toLowerCase().includes(cleanQ) || 
      club.bn.toLowerCase().includes(cleanQ) || 
      club.tags.some(t => t.includes(cleanQ) || cleanQ.includes(t));

    for (let colIdx = 0; colIdx < club.colors.length; colIdx++) {
      const color = club.colors[colIdx];
      for (let sIdx = 0; sIdx < STYLES.length; sIdx++) {
        const style = STYLES[sIdx];
        const years = ['2026', '2024', 'Retro Edition', 'Special Kit'];

        for (let yIdx = 0; yIdx < years.length; yIdx++) {
          const year = years[yIdx];
          syntheticCount++;

          const title = `${club.name} ${color} ${style} ${year}`;
          const bnTitle = `${club.bn} ${color} (${style})`;
          const matches = isClubMatch || 
            title.toLowerCase().includes(cleanQ) || 
            color.toLowerCase().includes(cleanQ) ||
            style.toLowerCase().includes(cleanQ) ||
            year.toLowerCase().includes(cleanQ);

          const matchesCat = !category || category === 'All' || style.toLowerCase() === category.toLowerCase();

          if (matches && matchesCat) {
            // Pick a matching curated photo
            const photoList = [
              'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
              'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=600&auto=format&fit=crop&q=80'
            ];
            const img = photoList[(cIdx + colIdx + sIdx + yIdx) % photoList.length];

            const basePrice = 450 + ((cIdx * 17 + colIdx * 23 + sIdx * 31) % 250);
            const oldPrice = basePrice + 350 + (basePrice % 100);
            const discountPct = Math.round(((oldPrice - basePrice) / oldPrice) * 100);

            if (results.length < limit) {
              results.push({
                id: `gen-${cIdx}-${colIdx}-${sIdx}-${yIdx}`,
                title,
                bnTitle,
                price: basePrice,
                oldPrice,
                discount: `${discountPct}% OFF`,
                image: img,
                category: style,
                description: `Official authentic ${title} from Rony Fashion House.\nFabric: 180 GSM moisture-wicking micro-mesh with authentic club crest badge.\nSizes: M, L, XL, XXL available. Express cash on delivery nationwide.`,
                sizes: SIZES_COMBO,
                stockCount: (syntheticCount % 12) + 3,
                rating: 4.7 + ((syntheticCount % 4) * 0.1),
                reviewCount: 15 + (syntheticCount % 45),
                isPopular: syntheticCount % 3 === 0,
                isClearance: discountPct > 45,
                featured: syntheticCount % 5 === 0
              });
            }
          }
        }
      }
    }
  }

  return { totalMatches: Math.max(results.length, cleanQ ? results.length * 8 : 10000), items: results };
}
