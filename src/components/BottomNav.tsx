import React from 'react';
import { Home, Shirt, Search, PackageCheck, ShoppingBag, User } from 'lucide-react';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: 'home' | 'search' | 'customizer' | 'stock' | 'detail' | 'track' | 'about' | 'contact' | 'profile' | 'notifications') => void;
  onOpenCart: () => void;
  cartCount: number;
  language?: 'bn' | 'en';
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  onNavigate,
  onOpenCart,
  cartCount,
  language = 'bn',
}) => {
  const isBn = language === 'bn';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg safe-bottom">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            currentScreen === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isBn ? 'হোম' : 'Home'}</span>
        </button>

        {/* Customizer */}
        <button
          onClick={() => onNavigate('customizer')}
          className={`relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            currentScreen === 'customizer' ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="relative">
            <Shirt className="w-5 h-5 mb-0.5" />
            <span className="absolute -top-1 -right-2 bg-amber-400 text-slate-900 text-[8px] font-black px-1 rounded-full">
              New
            </span>
          </div>
          <span className="text-[10px]">{isBn ? 'কাস্টম' : 'Custom'}</span>
        </button>

        {/* Search */}
        <button
          onClick={() => onNavigate('search')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            currentScreen === 'search' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Search className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isBn ? 'সার্চ' : 'Search'}</span>
        </button>

        {/* Track */}
        <button
          onClick={() => onNavigate('track')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            currentScreen === 'track' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <PackageCheck className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isBn ? 'ট্র্যাক' : 'Track'}</span>
        </button>

        {/* Profile */}
        <button
          onClick={() => onNavigate('profile')}
          className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
            currentScreen === 'profile' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">{isBn ? 'প্রোফাইল' : 'Profile'}</span>
        </button>

        {/* Cart */}
        <button
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center py-1 px-1.5 rounded-xl text-slate-700 active:scale-95 transition"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 mb-0.5 text-blue-600" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold">{isBn ? 'কার্ট' : 'Cart'}</span>
        </button>
      </div>
    </div>
  );
};
