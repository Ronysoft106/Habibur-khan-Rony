import React from 'react';
import { Trash2, Plus, Minus, Sparkles } from 'lucide-react';
import { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  language?: 'bn' | 'en';
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  language = 'bn',
}) => {
  const isBn = language === 'bn';

  return (
    <div className="flex gap-3 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/50 p-2 rounded-xl transition">
      {/* Product Image Thumbnail */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover"
        />
        {item.isCustom && (
          <div className="absolute top-1 left-1 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5 shadow-xs">
            <Sparkles className="w-2.5 h-2.5" />
            <span>Custom</span>
          </div>
        )}
      </div>

      {/* Product Details & Actions */}
      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">
              {item.title}
            </h4>
            <button
              onClick={() => onRemove(item.id)}
              className="text-slate-400 hover:text-red-500 p-1 rounded-md transition hover:bg-red-50 shrink-0"
              title={isBn ? 'আইটেম মুছুন' : 'Remove item'}
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Attributes: Size & Custom tags */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200">
              {isBn ? 'সাইজ' : 'Size'}: {item.size}
            </span>

            {item.customDetails && (
              <>
                {item.customDetails.playerName && (
                  <span className="text-[11px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium border border-blue-100">
                    {item.customDetails.playerName} #{item.customDetails.playerNumber || ''}
                  </span>
                )}
                {item.customDetails.badge && item.customDetails.badge !== 'none' && (
                  <span className="text-[11px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-medium border border-amber-100">
                    Badge: {item.customDetails.badge}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Pricing & Quantity Controls */}
        <div className="flex items-center justify-between mt-2 pt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-slate-900">৳{item.price * item.quantity}</span>
            {item.quantity > 1 && (
              <span className="text-[11px] text-slate-400 font-normal">
                (৳{item.price} x {item.quantity})
              </span>
            )}
          </div>

          <div className="flex items-center border border-slate-200 bg-white rounded-lg shadow-xs overflow-hidden">
            <button
              onClick={() => onUpdateQuantity(item.id, -1)}
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition active:bg-slate-200 disabled:opacity-30"
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-xs font-bold text-slate-800">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, 1)}
              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition active:bg-slate-200"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
