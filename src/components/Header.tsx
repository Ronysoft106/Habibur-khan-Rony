import React, { useState } from 'react';
import { 
  ShoppingBag, Search, Sparkles, PackageCheck, Phone, 
  Menu, X, Shirt, MapPin, Bell, User, MessageCircle 
} from 'lucide-react';
import { STORE_CONFIG } from '../data/mockData';

interface HeaderProps {
  cartCount: number;
  unreadNotifCount: number;
  onOpenCart: () => void;
  onNavigate: (screen: 'home' | 'search' | 'customizer' | 'stock' | 'detail' | 'track' | 'about' | 'contact' | 'profile' | 'notifications') => void;
  currentScreen: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  language: 'bn' | 'en';
  setLanguage: (lang: 'bn' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  unreadNotifCount,
  onOpenCart,
  onNavigate,
  currentScreen,
  searchQuery,
  setSearchQuery,
  language,
  setLanguage,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  const isBn = language === 'bn';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Full Marquee Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white text-xs font-medium py-1.5 px-3 border-b border-white/10 overflow-hidden whitespace-nowrap">
        <div className="animate-marquee font-bold text-xs tracking-wide text-amber-300">
          🔥 {STORE_CONFIG.brandName} — {isBn ? 'ধানমন্ডি ঢাকা সেন্ট্রাল হাব থেকে দ্রুততম ক্যাশ অন ডেলিভারি! ফ্রি হোম ডেলিভারি পেতে ১৫০০৳+ অর্ডার করুন!' : 'Fastest Nationwide Cash on Delivery from Dhanmondi, Dhaka! Free Express Delivery on orders over ৳1500!'} &nbsp;&nbsp;&nbsp; 📞 হটলাইন: {STORE_CONFIG.hotline} &nbsp;&nbsp;&nbsp; 💬 হোয়াটসঅ্যাপ: {STORE_CONFIG.whatsAppNumber} &nbsp;&nbsp;&nbsp; 📍 ঠিকানা: {STORE_CONFIG.address} &nbsp;&nbsp;&nbsp; 👤 স্বত্বাধিকারী: {STORE_CONFIG.ownerName} 🔥
        </div>
      </div>

      {/* Top Hotline, Owner Profile Avatar & Language Strip */}
      <div className="bg-slate-900 text-white text-[11px] font-semibold py-1 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          
          {/* Owner Circular Avatar with Badge */}
          <div className="flex items-center gap-2">
            <div className="relative group cursor-pointer" onClick={() => onNavigate('profile')}>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-sm">
                <img
                  src={STORE_CONFIG.ownerImage}
                  alt={STORE_CONFIG.ownerName}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-slate-900 animate-pulse" />
            </div>

            <div className="leading-tight">
              <span className="text-[10px] text-amber-300 font-bold block">
                {STORE_CONFIG.ownerName}
              </span>
              <span className="text-[9px] text-slate-400 font-medium hidden sm:inline">
                {isBn ? 'স্বত্বাধিকারী — ধানমন্ডি, ঢাকা' : 'Owner — Dhanmondi, Dhaka'}
              </span>
            </div>
          </div>

          {/* Hotline, WhatsApp and Location */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <a 
              href={`tel:${STORE_CONFIG.hotline}`}
              className="flex items-center gap-1 font-black text-amber-400 hover:text-white transition"
              title="Call Hotline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>হটলাইন: {STORE_CONFIG.hotline}</span>
            </a>

            <a 
              href={STORE_CONFIG.whatsAppLink}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{STORE_CONFIG.whatsAppNumber}</span>
            </a>

            <span className="hidden md:flex items-center gap-1 text-slate-300 text-[11px]">
              <MapPin className="w-3 h-3 text-rose-400" /> ধানমন্ডি, ঢাকা
            </span>

            <button
              onClick={() => setLanguage(isBn ? 'en' : 'bn')}
              className="bg-white/10 hover:bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide transition"
            >
              {isBn ? 'English' : 'বাংলা'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo - Rony Fashion House (RFH) */}
          <button 
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 text-left group"
          >
            {/* Stylish Logo Crest */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-amber-300 text-sm tracking-tighter italic">
                  RFH
                </span>
              </div>
            </div>

            <div>
              <div className="font-black text-slate-950 tracking-tight text-base sm:text-lg leading-tight flex items-center gap-1.5 font-serif">
                Rony Fashion House
                <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                  Store
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-semibold truncate">
                {isBn ? 'প্রিমিয়াম স্পোর্টস ও কাস্টম জার্সি হাউস' : 'Premium Sports & Custom Wear'}
              </p>
            </div>
          </button>

          {/* Desktop Search Bar (10k search ready) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder={isBn ? '১০,০০০+ জার্সি খুঁজুন (যেমন: Madrid, Messi, Milan, Retro...)' : 'Search 10k+ jerseys (e.g. Madrid, Messi, Milan...)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (currentScreen !== 'search') onNavigate('search'); }}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-300 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-xs sm:text-sm font-bold text-slate-700">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-lg transition ${
                currentScreen === 'home' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              {isBn ? 'হোম' : 'Home'}
            </button>

            {/* Customizer Tab */}
            <button
              onClick={() => onNavigate('customizer')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${
                currentScreen === 'customizer'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs'
                  : 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>{isBn ? 'কাস্টম জার্সি' : 'Customizer'}</span>
              <span className="text-[9px] bg-amber-400 text-slate-900 font-black px-1.5 py-0.2 rounded-full">
                New
              </span>
            </button>

            <button
              onClick={() => onNavigate('stock')}
              className={`px-3 py-2 rounded-lg transition ${
                currentScreen === 'stock' ? 'text-red-600 bg-red-50' : 'hover:text-red-600 hover:bg-slate-50'
              }`}
            >
              {isBn ? 'ক্লিয়ারেন্স' : 'Sale'}
            </button>

            <button
              onClick={() => onNavigate('track')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${
                currentScreen === 'track' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>{isBn ? 'ট্র্যাক' : 'Track'}</span>
            </button>

            {/* Profile Tab */}
            <button
              onClick={() => onNavigate('profile')}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition ${
                currentScreen === 'profile' ? 'text-blue-600 bg-blue-50' : 'hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{isBn ? 'প্রোফাইল' : 'Profile'}</span>
            </button>

            {/* Notification Tab */}
            <button
              onClick={() => onNavigate('notifications')}
              className={`relative p-2 rounded-xl transition ${
                currentScreen === 'notifications' ? 'text-blue-600 bg-blue-50' : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Order Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute 1 top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-black flex items-center justify-center">
                  {unreadNotifCount}
                </span>
              )}
            </button>
          </nav>

          {/* Action Icons: Mobile Search + Cart */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowSearchInput(!showSearchInput);
                if (!showSearchInput) onNavigate('search');
              }}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3 py-2 bg-slate-950 text-white rounded-xl hover:bg-slate-900 transition shadow-sm active:scale-95"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">
                {isBn ? 'কার্ট' : 'Cart'}
              </span>
              <span className="bg-blue-600 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Dropdown */}
        {showSearchInput && (
          <div className="lg:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder={isBn ? 'জার্সি নাম লিখুন...' : 'Search jersey name...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold ${
              currentScreen === 'home' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            🏠 {isBn ? 'হোম পেজ' : 'Home'}
          </button>

          <button
            onClick={() => { onNavigate('customizer'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold ${
              currentScreen === 'customizer' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
            }`}
          >
            <span className="flex items-center gap-2">
              <Shirt className="w-4 h-4" />
              {isBn ? 'টি-শার্ট ও জার্সি কাস্টমাইজার' : 'Custom Jersey Studio'}
            </span>
            <span className="text-[9px] bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full font-black">New</span>
          </button>

          <button
            onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold ${
              currentScreen === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            👤 {isBn ? 'প্রোফাইল ও ঠিকানা (Profile)' : 'Profile & Store Details'}
          </button>

          <button
            onClick={() => { onNavigate('notifications'); setMobileMenuOpen(false); }}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold ${
              currentScreen === 'notifications' ? 'bg-blue-50 text-blue-600' : 'text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              {isBn ? 'অর্ডার নোটিফিকেশন' : 'Order Notifications'}
            </span>
            {unreadNotifCount > 0 && (
              <span className="bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">
                {unreadNotifCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { onNavigate('stock'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50"
          >
            🔥 {isBn ? 'স্টক ক্লিয়ারেন্স অফার' : 'Stock Clearance Offers'}
          </button>

          <button
            onClick={() => { onNavigate('track'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-50"
          >
            📦 {isBn ? 'অর্ডার ট্র্যাকিং' : 'Track Order'}
          </button>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">হটলাইন:</span>
            <a href={`tel:${STORE_CONFIG.hotline}`} className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
              📞 {STORE_CONFIG.hotline}
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
