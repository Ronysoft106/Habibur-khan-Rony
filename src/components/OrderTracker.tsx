import React, { useState, useEffect } from 'react';
import { 
  Package, Search, CheckCircle2, Clock, Truck, 
  MapPin, Phone, AlertCircle, RefreshCw, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { SAMPLE_ORDERS } from '../data/mockData';

interface OrderTrackerProps {
  initialOrderId?: string;
  language?: 'bn' | 'en';
}

export const OrderTracker: React.FC<OrderTrackerProps> = ({
  initialOrderId = '',
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const [searchInput, setSearchInput] = useState(initialOrderId || 'RFH-982417');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch or lookup order
  const handleSearch = async (queryId?: string) => {
    const q = (queryId || searchInput).trim();
    if (!q) return;

    setLoading(true);
    setError('');

    try {
      // Check if it looks like phone or order id
      const isPhone = /^[0-9]+$/.test(q);
      const url = isPhone ? `/api/orders/phone/${q}` : `/api/orders/${q}`;
      
      const res = await fetch(url);
      const data = await res.json();

      if (data.success) {
        if (isPhone && data.orders?.length) {
          setOrder(data.orders[0]);
        } else if (data.order) {
          setOrder(data.order);
        } else {
          setError(isBn ? 'কোনো অর্ডার পাওয়া যায়নি।' : 'No order found.');
        }
      } else {
        // Fallback to local sample orders for instant testing
        const found = SAMPLE_ORDERS.find(o => 
          o.id.toLowerCase() === q.toLowerCase() || 
          o.customer.phone.includes(q)
        );
        if (found) {
          setOrder(found);
        } else {
          setError(data.message || (isBn ? 'অর্ডার কোড বা ফোন নম্বর খুঁজে পাওয়া যায়নি।' : 'Order not found.'));
          setOrder(null);
        }
      }
    } catch (_) {
      // Fallback local lookup
      const found = SAMPLE_ORDERS.find(o => 
        o.id.toLowerCase() === q.toLowerCase() || 
        o.customer.phone.includes(q)
      );
      if (found) {
        setOrder(found);
      } else {
        setError(isBn ? 'অর্ডার তথ্য লোড করতে সমস্যা হয়েছে।' : 'Failed to retrieve order tracking info.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setSearchInput(initialOrderId);
      handleSearch(initialOrderId);
    } else {
      // Auto-load sample order
      handleSearch('RFH-982417');
    }
  }, [initialOrderId]);

  // Status badge style helper
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return { label: isBn ? 'ডেলিভারি সম্পন্ন' : 'Delivered', bg: 'bg-emerald-100 text-emerald-800' };
      case 'shipped':
        return { label: isBn ? 'কুরিয়ারে ট্রানজিট' : 'In Transit', bg: 'bg-blue-100 text-blue-800' };
      case 'in_production':
        return { label: isBn ? 'প্যাকেজিং ও প্রিন্টিং' : 'In Production', bg: 'bg-amber-100 text-amber-800' };
      case 'confirmed':
        return { label: isBn ? 'অর্ডার নিশ্চিত' : 'Confirmed', bg: 'bg-indigo-100 text-indigo-800' };
      default:
        return { label: isBn ? 'পেন্ডিং' : 'Pending', bg: 'bg-slate-100 text-slate-800' };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 mb-8">
        <div className="text-center max-w-lg mx-auto mb-6">
          <div className="inline-flex p-3 rounded-2xl bg-blue-50 text-blue-600 mb-2">
            <Package className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {isBn ? 'রিয়েল-টাইম অর্ডার ট্র্যাকিং' : 'Real-Time Order Tracking'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isBn 
              ? 'আপনার অর্ডার নম্বর (যেমন: BZ-982417) অথবা মোবাইল নম্বর দিয়ে পার্সেলের বর্তমান অবস্থান জানুন।' 
              : 'Enter your Order ID (e.g. BZ-982417) or phone number to track live status.'}
          </p>
        </div>

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. BZ-982417 or 017xxxxxxxx"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-300 text-sm font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>{isBn ? 'অর্ডার খুঁজুন' : 'Track Order'}</span>
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs text-center font-semibold max-w-xl mx-auto flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* TRACKING RESULTS VIEW */}
      {order && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Top Status Overview */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isBn ? 'অর্ডার রেফারেন্স নম্বর' : 'Tracking Reference'}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {order.id}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${getStatusBadge(order.status).bg}`}>
                  {getStatusBadge(order.status).label}
                </span>
              </div>
            </div>

            {/* Courier & Delivery Meta Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">{isBn ? 'ডেলিভারি পার্টনার:' : 'Courier Partner:'}</span>
                <span className="font-bold text-slate-800">{order.courierName}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">{isBn ? 'কুরিয়ার ট্র্যাকিং কোড:' : 'Courier Consignment:'}</span>
                <span className="font-bold text-blue-700">{order.courierTrackingCode}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">{isBn ? 'সম্ভাব্য ডেলিভারি:' : 'Est. Delivery:'}</span>
                <span className="font-bold text-emerald-700">{order.estimatedDelivery}</span>
              </div>

              <div>
                <span className="text-slate-400 font-medium block">{isBn ? 'পেমেন্ট স্ট্যাটাস:' : 'Payment:'}</span>
                <span className="font-bold text-slate-800 uppercase">
                  {order.paymentMethod} ({order.paymentStatus})
                </span>
              </div>
            </div>
          </div>

          {/* Real-time Stepper Timeline */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
            <h3 className="text-base font-black text-slate-900 mb-6 flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <span>{isBn ? 'ডেলিভারি টাইমলাইন ও রুট ট্র্যাকিং' : 'Delivery Timeline & Hub Checkpoints'}</span>
            </h3>

            {/* Timeline Events */}
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {order.timeline.map((event, index) => {
                const isCompleted = event.completed;
                const isCurrent = event.current;

                return (
                  <div key={index} className="relative group">
                    {/* Stepper Dot */}
                    <div
                      className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs transition ${
                        isCompleted
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
                          {event.label}
                        </h4>
                        <span className="text-[11px] font-semibold text-slate-400">
                          {event.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hub Route Illustration */}
            <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'শিপিং রুট ম্যাপ' : 'Shipping Route Hubs'}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 pt-2 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto mb-1"></div>
                  <span>Dhanmondi Hub</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-300 mx-2"></div>
                <div className="text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mx-auto mb-1"></div>
                  <span>Regional Sort</span>
                </div>
                <div className="flex-1 h-0.5 bg-slate-300 mx-2"></div>
                <div className="text-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mx-auto mb-1"></div>
                  <span>{order.customer.district}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items & Customer Receipt */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80 space-y-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              {isBn ? 'অর্ডারের পণ্যসমূহ ও গ্রাহকের বিবরণ' : 'Order Package Details'}
            </h3>

            {/* Items */}
            <div className="divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-xl border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-xs text-slate-800 truncate">{item.title}</h5>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Size: {item.size} • Qty: {item.quantity}
                    </div>
                  </div>
                  <div className="text-xs font-black text-slate-900">
                    ৳{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Customer Delivery Card */}
            <div className="p-4 bg-slate-50 rounded-2xl text-xs space-y-1.5 text-slate-600 border border-slate-200">
              <div><strong>{isBn ? 'গ্রাহক:' : 'Customer:'}</strong> {order.customer.fullName} ({order.customer.phone})</div>
              <div><strong>{isBn ? 'ঠিকানা:' : 'Delivery Address:'}</strong> {order.customer.address}, {order.customer.district}</div>
              {order.customer.deliveryNotes && (
                <div><strong>{isBn ? 'নোট:' : 'Notes:'}</strong> {order.customer.deliveryNotes}</div>
              )}
            </div>

            {/* Helpline banner */}
            <div className="p-3 bg-blue-50 text-blue-900 rounded-xl text-xs flex items-center justify-between font-medium">
              <span>{isBn ? 'পার্সেল নিয়ে কোনো জিজ্ঞাসা? সরাসরি কথা বলুন:' : 'Have questions about delivery?'}</span>
              <a 
                href="tel:01603319739"
                className="font-bold text-blue-700 bg-white px-3 py-1 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
              >
                01603319739
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
