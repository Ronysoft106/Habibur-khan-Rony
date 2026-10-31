import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Flame, ShieldCheck, Truck, RotateCcw, 
  Phone, Mail, MapPin, MessageCircle, ArrowRight, 
  Search as SearchIcon, Filter, Heart, ShoppingBag, Star,
  Bell, User, ChevronRight, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Product, Category, CartItem as CartItemType, Order, OrderNotification } from './types';
import { CATEGORIES, INITIAL_PRODUCTS, STORE_CONFIG, INITIAL_NOTIFICATIONS, search10kJerseys } from './data/mockData';
import { Header } from './components/Header';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { TShirtCustomizer } from './components/TShirtCustomizer';
import { ProductDetail } from './components/ProductDetail';
import { OrderTracker } from './components/OrderTracker';
import { BottomNav } from './components/BottomNav';
import { ProfileScreen } from './components/ProfileScreen';
import { NotificationScreen } from './components/NotificationScreen';
import { WhatsAppChatbotModal } from './components/WhatsAppChatbotModal';

const HERO_JERSEYS = [
  {
    title: 'Real Madrid Retro Gold Polo',
    bnTitle: 'রিয়াল মাদ্রিদ রেট্রো গোল্ড পোলো জার্সি',
    tag: 'Gold Limited',
    price: 490,
    oldPrice: 850,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    productIndex: 0
  },
  {
    title: 'AC Milan Retro Full Sleeve',
    bnTitle: 'এসি মিলান ফুল স্লিভ উইন্টার রেট্রো',
    tag: 'Full Sleeve',
    price: 400,
    oldPrice: 850,
    image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&auto=format&fit=crop&q=80',
    productIndex: 1
  },
  {
    title: 'FC Barcelona UNICEF Special Polo',
    bnTitle: 'বার্সেলোনা ইউনিসেফ স্পেশাল পোলো',
    tag: 'Blaugrana',
    price: 490,
    oldPrice: 850,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&auto=format&fit=crop&q=80',
    productIndex: 2
  },
  {
    title: 'Argentina 3-Star World Champions Authentic',
    bnTitle: 'আর্জেন্টিনা ৩-স্টার বিশ্বকাপ প্লেয়ার এডিশন',
    tag: 'Player Edition',
    price: 590,
    oldPrice: 1150,
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&auto=format&fit=crop&q=80',
    productIndex: 4
  }
];

export const handleImageFallback = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = e.target as HTMLImageElement;
  target.onerror = null;
  target.src = 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&auto=format&fit=crop&q=80';
};

export default function App() {
  // Navigation & Screen state
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'search' | 'customizer' | 'stock' | 'detail' | 'track' | 'about' | 'contact' | 'profile' | 'notifications'
  >('home');
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');

  // Search & 10k Database Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'popular' | 'price_asc' | 'price_desc'>('popular');
  const [isSearching10k, setIsSearching10k] = useState<boolean>(false);
  const [totalCatalogSize, setTotalCatalogSize] = useState<string>('10,000+ Jerseys');

  // Hero interactive t-shirt switcher
  const [activeHeroIndex, setActiveHeroIndex] = useState(0);

  // Products Database
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<OrderNotification[]>(INITIAL_NOTIFICATIONS);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(2);

  // WhatsApp Chatbot Modal State
  const [isWhatsAppBotOpen, setIsWhatsAppBotOpen] = useState(false);

  // Cart State (Persisted in localStorage)
  const [cartItems, setCartItems] = useState<CartItemType[]>(() => {
    try {
      const saved = localStorage.getItem('rfh_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [shippingLocation, setShippingLocation] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string>('RFH-982417');

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rfh_cart', JSON.stringify(cartItems));
    } catch (_) {}
  }, [cartItems]);

  // Sync notifications from server
  const fetchNotifications = () => {
    fetch('/api/notifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.notifications) {
          setNotifications(data.notifications);
          setUnreadNotifCount(data.unreadCount || data.notifications.filter((n: any) => !n.read).length);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch live products or 10k search query from backend API
  useEffect(() => {
    setIsSearching10k(true);
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (selectedCategory && selectedCategory !== 'All') params.append('category', selectedCategory);
      params.append('limit', '60');

      fetch(`/api/products?${params.toString()}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.products?.length) {
            setProducts(data.products);
            if (data.totalCatalogSize) setTotalCatalogSize(data.totalCatalogSize);
          } else {
            // Local fallback 10k search
            const localResult = search10kJerseys(searchQuery, selectedCategory, 60);
            setProducts(localResult.items);
          }
        })
        .catch(() => {
          const localResult = search10kJerseys(searchQuery, selectedCategory, 60);
          setProducts(localResult.items);
        })
        .finally(() => {
          setIsSearching10k(false);
        });
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchQuery, selectedCategory]);

  const isBn = language === 'bn';

  // Cart Operations
  const handleAddToCart = (item: CartItemType) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === item.productId && i.size === item.size && !i.isCustom
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += item.quantity;
        return next;
      }
      return [item, ...prev];
    });
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItemType[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (code: string): boolean => {
    const validCodes = ['BZSPECIAL', 'FREESHIP', 'FIRSTBUY', 'DISCOUNT50', 'RONY10'];
    if (validCodes.includes(code.toUpperCase())) {
      setAppliedCoupon(code.toUpperCase());
      return true;
    }
    return false;
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
  };

  // Immediate Buy Now flow
  const handleBuyNow = (item: CartItemType) => {
    handleAddToCart(item);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleNavigate = (screen: any) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentScreen('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter & Sort
  const displayedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return (b.rating || 0) - (a.rating || 0);
  });

  const clearanceProducts = products.filter((p) => p.isClearance || p.oldPrice - p.price > 350);

  // Cart totals
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let cartShipping = shippingLocation === 'inside_dhaka' ? 60 : 120;
  if (cartSubtotal >= 1500 || appliedCoupon === 'FREESHIP') {
    cartShipping = 0;
  }
  let cartDiscount = 0;
  if (appliedCoupon === 'BZSPECIAL' || appliedCoupon === 'RONY10') cartDiscount = 100;
  else if (appliedCoupon === 'FIRSTBUY') cartDiscount = Math.round(cartSubtotal * 0.05);
  else if (appliedCoupon === 'DISCOUNT50') cartDiscount = 50;

  const currentHero = HERO_JERSEYS[activeHeroIndex];

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans pb-16 md:pb-0">
      
      {/* Header with Full Marquee Banner & Stylish Owner Avatar */}
      <Header
        cartCount={totalCartCount}
        unreadNotifCount={unreadNotifCount}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        currentScreen={currentScreen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Main Body Content */}
      <main className="flex-1">
        
        {/* 1. HOME SCREEN */}
        {currentScreen === 'home' && (
          <div className="space-y-10 pb-16">
            
            {/* HERO BANNER */}
            <div className="relative bg-slate-950 text-white overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-1/4 -mb-10 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
                  
                  {/* Top Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isBn ? 'রনি ফ্যাশন হাউস • ধানমন্ডি, ঢাকা' : 'Rony Fashion House • Dhanmondi, Dhaka'}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight font-serif">
                    {isBn ? (
                      <>
                        প্রিমিয়াম স্পোর্টস জার্সি ও <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-white">
                          কাস্টম জার্সি স্টুডিও
                        </span>
                      </>
                    ) : (
                      <>
                        Luxury Football Kits & <br className="hidden sm:inline" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-200 to-white">
                          Custom Jersey House
                        </span>
                      </>
                    )}
                  </h1>

                  <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
                    {isBn
                      ? '১০,০০০+ রেট্রো ও প্লেয়ার এডিশন ফুটবল জার্সি। ধানমন্ডি সেন্ট্রাল হাব, ঢাকা থেকে সারা দেশে দ্রুততম ক্যাশ অন ডেলিভারি এবং কাস্টম নাম ও নম্বর প্রিন্টিং সুবিধা।'
                      : 'Over 10,000+ authentic retro & player edition jerseys. Nationwide express cash on delivery from Dhanmondi Central Hub, Dhaka.'}
                  </p>

                  {/* STYLISH OWNER CIRCLE IMAGE & HOTLINE CARD (REQUESTED) */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
                    <div className="flex items-center gap-3 p-2.5 sm:p-3 bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl border border-white/20 transition shadow-lg">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-lg shrink-0">
                          <img
                            src={STORE_CONFIG.ownerImage}
                            alt={STORE_CONFIG.ownerName}
                            className="w-full h-full object-cover rounded-full"
                            onError={handleImageFallback}
                          />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-1 font-bold text-xs sm:text-sm text-white">
                          <span>{STORE_CONFIG.ownerName}</span>
                          <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded-full uppercase">
                            Owner
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-300 font-medium">
                          স্বত্বাধিকারী — ধানমন্ডি, ঢাকা
                        </p>
                        <a 
                          href={`tel:${STORE_CONFIG.hotline}`}
                          className="text-[11px] font-black text-white hover:text-amber-300 flex items-center gap-1 mt-0.5"
                        >
                          <Phone className="w-3 h-3 text-amber-400" />
                          <span>হটলাইন: {STORE_CONFIG.hotline}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                    <button
                      onClick={() => handleNavigate('customizer')}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-sm shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition"
                    >
                      <Sparkles className="w-4 h-4 text-slate-950" />
                      <span>{isBn ? 'কাস্টম জার্সি স্টুডিও' : 'Customizer Studio'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleNavigate('stock')}
                      className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-xs border border-white/20 transition flex items-center gap-2"
                    >
                      <Flame className="w-4 h-4 text-orange-400" />
                      <span>{isBn ? 'ক্লিয়ারেন্স অফার' : 'Clearance Offers'}</span>
                    </button>

                    <button
                      onClick={() => setIsWhatsAppBotOpen(true)}
                      className="px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center gap-2 shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp AI চ্যাট ({STORE_CONFIG.whatsAppNumber})</span>
                    </button>
                  </div>

                  {/* Highlights Bar */}
                  <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-400" />
                      <span>{isBn ? 'ধানমন্ডি হাব থেকে সারা দেশে ডেলিভারি' : 'Dhanmondi Hub Dispatch'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>{isBn ? '১০০% ব্রিদেবল মাইক্রো-মেশ' : '100% Breathable Mesh'}</span>
                    </div>
                  </div>
                </div>

                {/* Hero Showcase with Multiple T-Shirt Thumbnails (100% VISIBLE IMAGES) */}
                <div className="lg:col-span-5 flex flex-col items-center">
                  <div className="relative w-full max-w-sm sm:max-w-md group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-3xl blur-md opacity-40 group-hover:opacity-60 transition" />
                    <div className="relative bg-slate-900 rounded-3xl overflow-hidden border border-white/20 shadow-2xl">
                      
                      {/* Main Featured T-Shirt Image with Robust Fallback */}
                      <img
                        src={currentHero.image}
                        alt={currentHero.title}
                        className="w-full h-80 sm:h-96 object-cover transform transition duration-500 group-hover:scale-105"
                        onError={handleImageFallback}
                      />

                      {/* Overlay card */}
                      <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/20 px-2 py-0.5 rounded-md">
                            {currentHero.tag}
                          </span>
                          <div className="text-xs font-bold text-white mt-1">{currentHero.title}</div>
                          <div className="text-xs text-amber-300 font-extrabold mt-0.5">
                            ৳{currentHero.price} <span className="text-slate-400 line-through text-[10px]">৳{currentHero.oldPrice}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleSelectProduct(products[currentHero.productIndex] || products[0])}
                          className="px-3.5 py-2 bg-amber-500 text-slate-950 rounded-xl text-xs font-black hover:bg-amber-400 transition shadow-sm"
                        >
                          {isBn ? 'বিস্তারিত' : 'View'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 4 Distinct T-Shirt Image Selectors */}
                  <div className="mt-4 flex items-center justify-center gap-2">
                    {HERO_JERSEYS.map((hj, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveHeroIndex(idx)}
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition ${
                          activeHeroIndex === idx
                            ? 'border-amber-400 scale-105 shadow-md ring-2 ring-amber-400/40'
                            : 'border-white/30 opacity-70 hover:opacity-100'
                        }`}
                        title={hj.title}
                      >
                        <img
                          src={hj.image}
                          alt={hj.title}
                          className="w-full h-full object-cover"
                          onError={handleImageFallback}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* FEATURED CATEGORIES SECTION */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {isBn ? 'জনপ্রিয় ক্যাটাগরি সমূহ' : 'Featured Categories'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn ? 'আপনার পছন্দের সেকশন নির্বাচন করুন' : 'Browse jerseys by category'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    handleNavigate('search');
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <span>{isBn ? 'সব দেখুন' : 'View All'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Category Grid with Verified Images */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                {CATEGORIES.slice(0, 10).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      handleNavigate('search');
                    }}
                    className="group relative bg-white rounded-2xl p-3 border border-slate-200/80 hover:border-amber-500 hover:shadow-lg transition text-left overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative w-full h-28 sm:h-32 rounded-xl overflow-hidden bg-slate-100 mb-2.5">
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        onError={handleImageFallback}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xs text-slate-800 line-clamp-1 group-hover:text-blue-600 transition">
                        {isBn ? cat.bnName : cat.name}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {cat.itemCount} {isBn ? 'টি প্রোডাক্ট' : 'Items'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOMIZER CALLOUT BANNER */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
                <div className="space-y-2 text-center md:text-left z-10">
                  <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-3 py-1 rounded-full">
                    Rony Custom Studio
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black font-serif">
                    {isBn ? 'নিজের ছবি বা লোগো দিয়ে কাস্টম জার্সি তৈরি করুন' : 'Create Custom Name & Number Jersey'}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                    {isBn 
                      ? 'লাইভ ক্যানভাস প্রিভিউতে নাম, নম্বর, স্পনসর ও ফিল্টার প্রয়োগ করে রনি ফ্যাশন হাউস থেকে তৈরি করে নিন!' 
                      : 'Upload crests, adjust image filters, customize player names, and order instantly.'}
                  </p>
                </div>
                <button
                  onClick={() => handleNavigate('customizer')}
                  className="px-6 py-3.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-slate-950 rounded-2xl font-black text-sm shadow-lg shrink-0 transition flex items-center gap-2 hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>{isBn ? 'কাস্টম স্টুডিও খুলুন' : 'Open Customizer Studio'}</span>
                </button>
              </div>
            </div>

            {/* POPULAR PRODUCTS GRID */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {isBn ? 'জনপ্রিয় ফুটবল ও স্পোর্টস জার্সি' : 'Popular Jerseys'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isBn ? 'সর্বোচ্চ বিক্রিত ও গ্রাহক পছন্দের কালেকশন' : 'Top trending and verified fan kits'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleNavigate('search')}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    {isBn ? '১০,০০০+ সকল জার্সি দেখুন' : 'Explore All 10k+'}
                  </button>
                </div>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedProducts.slice(0, 16).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs hover:shadow-lg transition flex flex-col justify-between group"
                  >
                    {/* Top thumbnail */}
                    <div 
                      onClick={() => handleSelectProduct(item)}
                      className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-100 cursor-pointer mb-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={handleImageFallback}
                      />
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                        {item.discount}
                      </div>
                      {item.stockCount < 6 && (
                        <div className="absolute bottom-2 left-2 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm">
                          Only {item.stockCount} left
                        </div>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div 
                        onClick={() => handleSelectProduct(item)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="truncate">{item.category}</span>
                          <span className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
                            ★ {item.rating}
                          </span>
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 leading-snug group-hover:text-blue-600 transition">
                          {isBn && item.bnTitle ? item.bnTitle : item.title}
                        </h4>
                      </div>

                      {/* Pricing and Actions */}
                      <div className="pt-3 border-t border-slate-100 mt-2">
                        <div className="flex items-baseline gap-1.5 mb-2.5">
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            ৳{item.price}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ৳{item.oldPrice}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => handleBuyNow({
                              id: `${item.id}-XL-${Date.now()}`,
                              productId: item.id,
                              title: item.title,
                              price: item.price,
                              size: 'XL',
                              quantity: 1,
                              image: item.image,
                            })}
                            className="py-2 px-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-[11px] font-bold text-center transition"
                          >
                            {isBn ? 'এখনই কিনুন' : 'Buy Now'}
                          </button>

                          <button
                            onClick={() => handleAddToCart({
                              id: `${item.id}-XL-${Date.now()}`,
                              productId: item.id,
                              title: item.title,
                              price: item.price,
                              size: 'XL',
                              quantity: 1,
                              image: item.image,
                            })}
                            className="py-2 px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-[11px] font-bold text-center transition"
                          >
                            🛒 {isBn ? 'কার্টে যোগ' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TRUST & DHANMONDI DHAKA FULFILLMENT FOOTER CALLOUT */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
                <div className="flex items-start gap-3">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shrink-0">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {isBn ? 'ধানমন্ডি সেন্ট্রাল হাব থেকে ডেলিভারি' : 'Dhanmondi Hub Dispatch'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      ধানমন্ডি ঢাকা সেন্ট্রাল ফুলফিলমেন্ট হাব থেকে সারা দেশে স্টিডফাস্ট কুরিয়ার ও পাঠাওতে দ্রুততম হোম ডেলিভারি।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {isBn ? 'রনি ফ্যাশন হাউস প্রিমিয়াম কোয়ালিটি' : '100% Quality Assurance'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      ১৮০ জিএসএম ব্রিদেবল মাইক্রো-মেশ ফ্যাব্রিক ও স্থায়ী সাবলিমেশন কালার প্রিন্ট।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
                    <RotateCcw className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {isBn ? '৭ দিন সহজ সাইজ এক্সচেঞ্জ' : '7 Days Easy Exchange'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      সাইজে কোনো অমিল হলে সরাসরি হটলাইনে (01603319739) কল করে সাইজ পরিবর্তন করে নিতে পারবেন।
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* 2. REAL-TIME SEARCH SCREEN (10K API DATA INTEGRATED) */}
        {currentScreen === 'search' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-black text-slate-900 font-serif">
                  {isBn ? 'জার্সি সার্চ ও ফিল্টারিং ইঞ্জিন (১০,০০০+ ডাটা)' : '10k+ Advanced Jersey Search Engine'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isSearching10k ? 'সার্চিং ডাটাবেজ...' : `${displayedProducts.length} টি জার্সি পাওয়া গেছে • ক্যাটালগ: ${totalCatalogSize}`}
                </p>
              </div>

              {/* Quick Tags */}
              <div className="flex flex-wrap gap-1.5">
                {['Real Madrid', 'Barcelona', 'Argentina 3-Star', 'Brazil R9', 'Man United', 'Full Sleeve'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="text-[11px] font-bold bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-full hover:bg-slate-100 transition shadow-xs"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Search Input Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={isBn ? 'যেকোনো জার্সির নাম লিখুন (যেমন: Madrid, Messi, Ronaldo, Milan, Retro, Bangladesh...)' : 'Type any jersey name, club, or player...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-slate-300 text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-hidden bg-white shadow-xs"
                />
                <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Pills & Sorting Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    selectedCategory === 'All'
                      ? 'bg-slate-950 text-white'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {isBn ? 'সব পণ্য (All)' : 'All'}
                </button>
                {CATEGORIES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      selectedCategory === c.name
                        ? 'bg-slate-950 text-white'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isBn ? c.bnName : c.name}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="font-semibold text-slate-500">{isBn ? 'সাজান:' : 'Sort:'}</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold focus:outline-hidden"
                >
                  <option value="popular">{isBn ? 'জনপ্রিয়তা' : 'Most Popular'}</option>
                  <option value="price_asc">{isBn ? 'কম থেকে বেশি দাম' : 'Price: Low to High'}</option>
                  <option value="price_desc">{isBn ? 'বেশি থেকে কম দাম' : 'Price: High to Low'}</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <SearchIcon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-base">
                  {isBn ? 'কোনো পণ্য খুঁজে পাওয়া যায়নি' : 'No matching jerseys found'}
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {isBn ? 'অন্য বানান ট্রাই করুন অথবা কাস্টম স্টুডিওতে নিজের পছন্দের নাম ও নাম্বার দিয়ে জার্সি বানান!' : 'Try another keyword or create your dream jersey in our custom studio.'}
                </p>
                <button
                  onClick={() => handleNavigate('customizer')}
                  className="mt-4 px-5 py-2.5 bg-amber-500 text-slate-950 rounded-xl text-xs font-bold shadow-md hover:bg-amber-400"
                >
                  {isBn ? 'কাস্টম জার্সি স্টুডিও খুলুন' : 'Open Customizer Studio'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayedProducts.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3 border border-slate-200 shadow-xs hover:shadow-lg transition flex flex-col justify-between group"
                  >
                    <div 
                      onClick={() => handleSelectProduct(item)}
                      className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-100 cursor-pointer mb-3"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        onError={handleImageFallback}
                      />
                      <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                        {item.discount}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div onClick={() => handleSelectProduct(item)} className="cursor-pointer">
                        <span className="text-[11px] text-slate-400 block mb-0.5">{item.category}</span>
                        <h4 className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2">
                          {isBn && item.bnTitle ? item.bnTitle : item.title}
                        </h4>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-2">
                        <div className="flex items-baseline gap-1.5 mb-2">
                          <span className="text-base font-black text-slate-900">৳{item.price}</span>
                          <span className="text-xs text-slate-400 line-through">৳{item.oldPrice}</span>
                        </div>
                        <button
                          onClick={() => handleSelectProduct(item)}
                          className="w-full py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition"
                        >
                          {isBn ? 'বিস্তারিত দেখুন' : 'View Details'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. CUSTOMIZER STUDIO SCREEN */}
        {currentScreen === 'customizer' && (
          <TShirtCustomizer
            onAddToCart={(customItem) => {
              handleAddToCart(customItem);
              setIsCartOpen(true);
            }}
            language={language}
          />
        )}

        {/* 4. PRODUCT DETAIL SCREEN */}
        {currentScreen === 'detail' && selectedProduct && (
          <ProductDetail
            product={selectedProduct}
            onBack={() => handleNavigate('home')}
            onAddToCart={(item) => {
              handleAddToCart(item);
              setIsCartOpen(true);
            }}
            onBuyNow={handleBuyNow}
            language={language}
          />
        )}

        {/* 5. STOCK CLEARANCE SCREEN */}
        {currentScreen === 'stock' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                  Flash Sale
                </span>
                <h1 className="text-2xl sm:text-4xl font-black mt-2 font-serif">
                  {isBn ? 'স্টক ক্লিয়ারেন্স মহাধামাকা অফার' : 'Stock Clearance Flash Sale'}
                </h1>
                <p className="text-xs sm:text-sm text-red-100 mt-1">
                  {isBn ? 'সর্বোচ্চ ৫৩% পর্যন্ত বিশেষ ছাড়ে পছন্দের রেট্রো জার্সি লুফে নিন!' : 'Up to 53% off on selected retro and fan kits while stock lasts!'}
                </p>
              </div>

              <div className="bg-black/30 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 text-center">
                <div className="text-[10px] text-amber-300 font-bold uppercase">{isBn ? 'অফার মেয়াদ' : 'Ends in'}</div>
                <div className="text-lg font-black tracking-widest text-white">12h : 45m : 18s</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {clearanceProducts.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3 border border-red-100 shadow-xs hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div 
                    onClick={() => handleSelectProduct(item)}
                    className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden bg-slate-100 cursor-pointer mb-3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover hover:scale-105 transition"
                      onError={handleImageFallback}
                    />
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                      {item.discount}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <h4 
                      onClick={() => handleSelectProduct(item)}
                      className="font-bold text-xs sm:text-sm text-slate-800 line-clamp-2 cursor-pointer hover:text-blue-600"
                    >
                      {item.title}
                    </h4>

                    <div className="pt-3 border-t border-slate-100 mt-2">
                      <div className="flex items-baseline gap-1.5 mb-2">
                        <span className="text-base font-black text-red-600">৳{item.price}</span>
                        <span className="text-xs text-slate-400 line-through">৳{item.oldPrice}</span>
                      </div>
                      <button
                        onClick={() => handleBuyNow({
                          id: `${item.id}-XL-${Date.now()}`,
                          productId: item.id,
                          title: item.title,
                          price: item.price,
                          size: 'XL',
                          quantity: 1,
                          image: item.image,
                        })}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition text-center"
                      >
                        {isBn ? 'এখনই কিনুন' : 'Buy Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. REAL-TIME ORDER TRACKING SCREEN */}
        {currentScreen === 'track' && (
          <OrderTracker
            initialOrderId={activeTrackingOrderId}
            language={language}
          />
        )}

        {/* 7. PROFILE SCREEN */}
        {currentScreen === 'profile' && (
          <ProfileScreen
            onNavigate={handleNavigate}
            language={language}
          />
        )}

        {/* 8. NOTIFICATION SCREEN */}
        {currentScreen === 'notifications' && (
          <NotificationScreen
            onViewOrder={(orderId) => {
              setActiveTrackingOrderId(orderId);
              handleNavigate('track');
            }}
            language={language}
          />
        )}

        {/* 9. ABOUT US SCREEN */}
        {currentScreen === 'about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <div className="w-14 h-14 bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 rounded-2xl mb-4">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center font-serif text-amber-300 font-black italic text-lg">
                  RFH
                </div>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-serif">
                {STORE_CONFIG.brandName}
              </h1>
              <p className="text-slate-600 leading-relaxed text-sm mb-4">
                {isBn
                  ? 'রনি ফ্যাশন হাউস (Rony Fashion House) বাংলাদেশের ক্রীড়াপ্রেমীদের জন্য একটি বিশ্বস্ত ও নির্ভরযোগ্য শপিং গন্তব্য। আমাদের কেন্দ্রীয় ওয়্যারহাউজ ও হাব অবস্থিত ধানমন্ডি, ঢাকায়। স্বত্বাধিকারী হাবিবুর খান রনির সরাসরি তত্ত্বাবধানে সেরা কোয়ালিটির জার্সি সরবরাহ করা হয়।'
                  : 'Rony Fashion House is your trusted premier destination for authentic football retro kits and custom jersey manufacturing in Bangladesh.'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">📍 প্রধান কার্যালয় ও ওয়্যারহাউজ:</div>
                  <div className="text-slate-600">{STORE_CONFIG.address}</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="font-bold text-slate-800 mb-1">✉️ অফিসিয়াল ইমেইল ও হটলাইন:</div>
                  <div className="text-blue-600 font-semibold">{STORE_CONFIG.adminEmail} | {STORE_CONFIG.hotline}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 10. CONTACT US SCREEN */}
        {currentScreen === 'contact' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
              <h1 className="text-2xl font-black text-slate-900 mb-2 font-serif">
                {isBn ? 'যোগাযোগ ও সরাসরি কাস্টমার কেয়ার' : 'Contact Customer Support'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mb-6">
                যেকোনো জার্সি অর্ডার, সাইজ পরামর্শ বা কাস্টমাইজেশন জানতে আমাদের সাথে যোগাযোগ করুন।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 text-center space-y-2">
                  <Phone className="w-6 h-6 text-blue-600 mx-auto" />
                  <div className="font-bold text-slate-900">হটলাইন কল</div>
                  <div className="text-blue-800 font-extrabold text-sm">{STORE_CONFIG.hotline}</div>
                  <a href={`tel:${STORE_CONFIG.hotline}`} className="inline-block text-blue-600 font-bold hover:underline">এখনই কল করুন</a>
                </div>

                <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center space-y-2">
                  <MessageCircle className="w-6 h-6 text-emerald-600 mx-auto" />
                  <div className="font-bold text-slate-900">হোয়াটসঅ্যাপ AI চ্যাট</div>
                  <div className="text-emerald-800 font-extrabold text-sm">{STORE_CONFIG.whatsAppNumber}</div>
                  <button onClick={() => setIsWhatsAppBotOpen(true)} className="inline-block text-emerald-600 font-bold hover:underline">মেসেজ পাঠান</button>
                </div>

                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-2">
                  <Mail className="w-6 h-6 text-slate-700 mx-auto" />
                  <div className="font-bold text-slate-900">অফিসিয়াল জিমেইল</div>
                  <div className="text-slate-700 font-bold truncate text-xs">{STORE_CONFIG.adminEmail}</div>
                  <a href={`mailto:${STORE_CONFIG.adminEmail}`} className="inline-block text-blue-600 font-bold hover:underline">ইমেইল করুন</a>
                </div>
              </div>

              {/* Direct WhatsApp Action */}
              <div className="mt-6 p-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="font-black text-sm sm:text-base">হোয়াটসঅ্যাপে তাৎক্ষণিক উত্তর পেতে চান?</div>
                  <div className="text-xs text-emerald-100">নাম্বার: {STORE_CONFIG.whatsAppNumber} (২৪ ঘণ্টা AI চ্যাট সক্রিয়)</div>
                </div>
                <button
                  onClick={() => setIsWhatsAppBotOpen(true)}
                  className="px-5 py-2.5 bg-white text-emerald-800 rounded-xl font-black text-xs shadow-md hover:bg-slate-100 transition shrink-0"
                >
                  WhatsApp AI চ্যাট খুলুন
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        shippingLocation={shippingLocation}
        onLocationChange={setShippingLocation}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={handleApplyCoupon}
        onRemoveCoupon={handleRemoveCoupon}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onStartCustomizer={() => handleNavigate('customizer')}
        language={language}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        shippingFee={cartShipping}
        discount={cartDiscount}
        onOrderSuccess={(order) => {
          // Empty cart
          setCartItems([]);
          setActiveTrackingOrderId(order.id);
          fetchNotifications();
        }}
        onViewOrderTracking={(orderId) => {
          setActiveTrackingOrderId(orderId);
          handleNavigate('track');
        }}
        language={language}
      />

      {/* WhatsApp AI Chatbot Modal */}
      <WhatsAppChatbotModal
        isOpen={isWhatsAppBotOpen}
        onClose={() => setIsWhatsAppBotOpen(false)}
        onNavigate={handleNavigate}
        language={language}
      />

      {/* Floating WhatsApp Action Button
          HIDDEN when currentScreen === 'customizer' so it never overlays or triggers chat when editing custom images!
      */}
      {currentScreen !== 'customizer' && (
        <button
          onClick={() => setIsWhatsAppBotOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-5 z-30 p-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition"
          title={`WhatsApp: ${STORE_CONFIG.whatsAppNumber}`}
          aria-label="WhatsApp Support"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Bottom Navigation Bar with Profile Tab */}
      <BottomNav
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
        language={language}
      />

      {/* Desktop Site Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-10 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-black text-base mb-2 font-serif">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-400 to-yellow-300 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center text-xs font-black italic text-amber-300">
                  RFH
                </div>
              </div>
              <span>{STORE_CONFIG.brandName}</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-3">
              {STORE_CONFIG.bnTagline}। প্রিমিয়াম ফুটবল রেট্রো কালেকশন ও নিজস্ব কাস্টমাইজেশন হাউস।
            </p>
            <div className="text-slate-400">
              {STORE_CONFIG.address}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">{isBn ? 'গুরুত্বপূর্ণ লিংক' : 'Quick Links'}</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleNavigate('home')} className="hover:text-white">হোম পেজ</button></li>
              <li><button onClick={() => handleNavigate('customizer')} className="hover:text-white">কাস্টম জার্সি স্টুডিও</button></li>
              <li><button onClick={() => handleNavigate('stock')} className="hover:text-white">ক্লিয়ারেন্স অফার</button></li>
              <li><button onClick={() => handleNavigate('track')} className="hover:text-white">অর্ডার ট্র্যাক</button></li>
              <li><button onClick={() => handleNavigate('profile')} className="hover:text-white">প্রোফাইল ও ঠিকানা</button></li>
              <li><button onClick={() => handleNavigate('notifications')} className="hover:text-white">অর্ডার নোটিফিকেশন</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">{isBn ? 'পেমেন্ট ও কুরিয়ার' : 'Payment & Couriers'}</h4>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
              <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">bKash (01603319739)</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Nagad (01603319739)</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Rocket</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Cash on Delivery</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Steadfast Courier</span>
              <span className="bg-slate-900 px-2.5 py-1 rounded border border-slate-800">Pathao</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3">{isBn ? 'সাপোর্ট ও যোগাযোগ' : 'Customer Care'}</h4>
            <p className="text-amber-400 font-bold">হটলাইন: {STORE_CONFIG.hotline}</p>
            <p className="mt-1">WhatsApp: {STORE_CONFIG.whatsAppNumber}</p>
            <p className="mt-1">Email: {STORE_CONFIG.adminEmail}</p>
            <p className="mt-1">স্বত্বাধিকারী: {STORE_CONFIG.ownerName} (ধানমন্ডি, ঢাকা)</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-slate-800/80 text-center text-slate-500">
          © 2026 {STORE_CONFIG.brandName}. All rights reserved. Dhanmondi, Dhaka, Bangladesh.
        </div>
      </footer>
    </div>
  );
}
