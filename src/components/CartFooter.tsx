import React, { useState } from 'react';
import { Tag, ArrowRight, Truck, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CartFooterProps {
  subtotal: number;
  shippingFee: number;
  discount: number;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => boolean;
  onRemoveCoupon: () => void;
  shippingLocation: 'inside_dhaka' | 'outside_dhaka';
  onLocationChange: (loc: 'inside_dhaka' | 'outside_dhaka') => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  language?: 'bn' | 'en';
}

export const CartFooter: React.FC<CartFooterProps> = ({
  subtotal,
  shippingFee,
  discount,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  shippingLocation,
  onLocationChange,
  onProceedToCheckout,
  onContinueShopping,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const freeShippingThreshold = 1500;
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  const grandTotal = Math.max(0, subtotal + shippingFee - discount);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');

    if (!couponInput.trim()) return;

    const success = onApplyCoupon(couponInput.trim().toUpperCase());
    if (success) {
      setCouponSuccess(isBn ? 'কুপন সফলভাবে যুক্ত হয়েছে!' : 'Coupon applied successfully!');
      setCouponInput('');
    } else {
      setCouponError(isBn ? 'ভুল কুপন কোড! ট্রাই করুন BZSPECIAL' : 'Invalid coupon! Try BZSPECIAL');
    }
  };

  return (
    <div className="bg-slate-50 border-t border-slate-200 p-4 space-y-4 rounded-b-2xl">
      {/* Free Delivery Goal Tracker */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs shadow-xs">
        <div className="flex items-center justify-between font-semibold text-slate-800 mb-1.5">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600" />
            {remainingForFreeShipping === 0
              ? (isBn ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন 🎉' : 'Congratulations! You unlocked Free Delivery 🎉')
              : (isBn 
                  ? `আর ৳${remainingForFreeShipping} টাকার পণ্য যোগ করলেই ফ্রি ডেলিভারি!` 
                  : `Add ৳${remainingForFreeShipping} more to get Free Delivery!`)}
          </span>
          <span className="text-blue-600 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Delivery Zone Selector */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {isBn ? 'ডেলিভারি এরিয়া নির্বাচন করুন' : 'Select Delivery Location'}
        </label>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => onLocationChange('inside_dhaka')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
              shippingLocation === 'inside_dhaka'
                ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-1 ring-blue-600'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="font-semibold">{isBn ? 'ঢাকার ভেতরে' : 'Inside Dhaka'}</div>
              <div className="text-[11px] text-slate-500">১-২ কর্মদিবস</div>
            </div>
            <div className="text-xs font-bold text-slate-900">৳60</div>
          </button>

          <button
            type="button"
            onClick={() => onLocationChange('outside_dhaka')}
            className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
              shippingLocation === 'outside_dhaka'
                ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold ring-1 ring-blue-600'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div>
              <div className="font-semibold">{isBn ? 'ঢাকার বাইরে / সমগ্র বাংলাদেশ' : 'Outside Dhaka / All BD'}</div>
              <div className="text-[11px] text-slate-500">২-৩ কর্মদিবস</div>
            </div>
            <div className="text-xs font-bold text-slate-900">৳120</div>
          </button>
        </div>
      </div>

      {/* Coupon Promo Code Box */}
      <div>
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 px-3 py-2 rounded-xl text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {isBn ? 'কুপন সক্রিয়:' : 'Coupon active:'}{' '}
                <strong className="tracking-wider">{appliedCoupon}</strong> (-৳{discount})
              </span>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-xs text-red-600 font-bold hover:underline"
            >
              {isBn ? 'বাতিল' : 'Remove'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder={isBn ? 'কুপন কোড (যেমন: BZSPECIAL)' : 'Coupon code (e.g. BZSPECIAL)'}
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 bg-white text-xs uppercase font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              />
              <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              className="px-3 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition"
            >
              {isBn ? 'প্রয়োগ' : 'Apply'}
            </button>
          </form>
        )}
        {couponError && <p className="text-[11px] text-red-600 mt-1">{couponError}</p>}
        {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>}
      </div>

      {/* Price Breakdown Calculation */}
      <div className="space-y-1.5 text-xs text-slate-600 pt-1">
        <div className="flex justify-between">
          <span>{isBn ? 'সাবটোটাল' : 'Subtotal'}</span>
          <span className="font-semibold text-slate-800">৳{subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>{isBn ? 'ডেলিভারি চার্জ' : 'Shipping Charge'}</span>
          <span className="font-semibold text-slate-800">
            {shippingFee === 0 ? (
              <span className="text-emerald-600 font-bold">{isBn ? 'ফ্রি' : 'FREE'}</span>
            ) : (
              `৳${shippingFee}`
            )}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-700 font-semibold">
            <span>{isBn ? 'বিশেষ ডিসকাউন্ট' : 'Special Discount'}</span>
            <span>-৳{discount}</span>
          </div>
        )}
        <div className="flex justify-between text-base font-extrabold text-slate-950 pt-2 border-t border-slate-200">
          <span>{isBn ? 'সর্বমোট প্রদেয়' : 'Grand Total'}</span>
          <span className="text-blue-700 font-black">৳{grandTotal}</span>
        </div>
      </div>

      {/* Trust & Guarantee Badge */}
      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>
          {isBn 
            ? '১০০% অরিজিনাল কোয়ালিটি ও ক্যাশ অন ডেলিভারি সুবিধা' 
            : '100% Quality Guaranteed & Cash On Delivery Available'}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-1">
        <button
          onClick={onProceedToCheckout}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition"
        >
          <span>{isBn ? 'অর্ডার কনফার্ম করুন (Checkout)' : 'Proceed to Checkout'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={onContinueShopping}
          className="w-full py-2.5 px-4 bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold text-xs transition"
        >
          {isBn ? 'আরও শপিং চালিয়ে যান' : 'Continue Shopping'}
        </button>
      </div>
    </div>
  );
};
