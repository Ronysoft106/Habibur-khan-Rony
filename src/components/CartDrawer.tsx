import React from 'react';
import { X, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem as CartItemType } from '../types';
import { CartItem } from './CartItem';
import { CartFooter } from './CartFooter';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItemType[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  shippingLocation: 'inside_dhaka' | 'outside_dhaka';
  onLocationChange: (loc: 'inside_dhaka' | 'outside_dhaka') => void;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onProceedToCheckout: () => void;
  onStartCustomizer: () => void;
  language?: 'bn' | 'en';
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  shippingLocation,
  onLocationChange,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  onStartCustomizer,
  language = 'bn',
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const totalItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Delivery calculation: Free if subtotal >= 1500 or coupon FREESHIP
  let shippingFee = shippingLocation === 'inside_dhaka' ? 60 : 120;
  if (subtotal >= 1500 || appliedCoupon === 'FREESHIP') {
    shippingFee = 0;
  }

  // Discount calculation
  let discount = 0;
  if (appliedCoupon === 'BZSPECIAL') {
    discount = 100;
  } else if (appliedCoupon === 'FIRSTBUY') {
    discount = Math.round(subtotal * 0.05);
  } else if (appliedCoupon === 'DISCOUNT50') {
    discount = 50;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-bold tracking-wide">
                  {isBn ? 'আপনার শপিং কার্ট' : 'Your Shopping Cart'}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {totalItemCount} {isBn ? 'টি আইটেম' : 'items'}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
              aria-label="Close cart"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Cart Body */}
          {items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <h4 className="text-base font-bold text-slate-800 mb-1">
                {isBn ? 'আপনার কার্ট এখন খালি' : 'Your cart is currently empty'}
              </h4>
              <p className="text-xs text-slate-500 max-w-xs mb-6">
                {isBn
                  ? 'আপনার প্রিয় ফুটবল ক্লাবের রেট্রো জার্সি খুঁজুন অথবা আমাদের কাস্টমাইজারে নিজের জার্সি তৈরি করুন!'
                  : 'Explore our latest retro and player edition jerseys or personalize your own custom kit!'}
              </p>

              <div className="w-full space-y-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <span>{isBn ? 'কালেকশন দেখুন (Browse Store)' : 'Browse Store'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onStartCustomizer();
                  }}
                  className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isBn ? 'কাস্টম জার্সি ডিজাইন করুন' : 'Design Custom Jersey'}</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Scrollable Items List */}
              <div className="flex-1 overflow-y-auto px-4 py-2 divide-y divide-slate-100">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={onUpdateQuantity}
                    onRemove={onRemoveItem}
                    language={language}
                  />
                ))}
              </div>

              {/* Cart Footer */}
              <CartFooter
                subtotal={subtotal}
                shippingFee={shippingFee}
                discount={discount}
                appliedCoupon={appliedCoupon}
                onApplyCoupon={onApplyCoupon}
                onRemoveCoupon={onRemoveCoupon}
                shippingLocation={shippingLocation}
                onLocationChange={onLocationChange}
                onProceedToCheckout={onProceedToCheckout}
                onContinueShopping={onClose}
                language={language}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
