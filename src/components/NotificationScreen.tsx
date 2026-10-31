import React, { useState, useEffect } from 'react';
import { 
  Bell, CheckCircle2, Clock, Phone, Mail, ShoppingBag, 
  Trash2, RefreshCw, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Filter
} from 'lucide-react';
import { OrderNotification } from '../types';
import { STORE_CONFIG, INITIAL_NOTIFICATIONS } from '../data/mockData';

interface NotificationScreenProps {
  onViewOrder: (orderId: string) => void;
  language?: 'bn' | 'en';
}

export const NotificationScreen: React.FC<NotificationScreenProps> = ({
  onViewOrder,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const [notifications, setNotifications] = useState<OrderNotification[]>(INITIAL_NOTIFICATIONS);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

  // Load latest notifications from backend API
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      const data = await res.json();
      if (data.success && data.notifications) {
        setNotifications(data.notifications);
      }
    } catch (_) {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    } catch (_) {}
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch('/api/notifications/mark-all-read', { method: 'POST' });
    } catch (_) {}
  };

  // Test simulation to generate immediate incoming order alert
  const handleSimulateIncomingOrder = async () => {
    const mockNames = ['Jahidul Islam (Dhanmondi, Dhaka)', 'Nazmul Shakib (Mirpur, Dhaka)', 'Ariful Haque (Uttara, Dhaka)', 'Tanvir Ahmed (Chittagong)'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
    const randomTotal = 490 + Math.floor(Math.random() * 800);
    const randomOrderNum = `RFH-${Math.floor(100000 + Math.random() * 900000)}`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            fullName: randomName,
            phone: '017' + Math.floor(10000000 + Math.random() * 90000000),
            email: 'client' + Math.floor(Math.random() * 100) + '@gmail.com',
            address: 'House 32, Road 7A, Dhanmondi',
            district: 'Dhaka'
          },
          items: [
            {
              id: 'sim-1',
              productId: '1',
              title: 'Real Madrid Retro Gold Polo Jersey (Limited Edition)',
              price: 490,
              size: 'XL',
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80'
            }
          ],
          subtotal: randomTotal,
          shippingFee: 60,
          discount: 0,
          total: randomTotal + 60,
          paymentMethod: 'bkash',
          transactionId: 'BK' + Math.floor(100000 + Math.random() * 900000)
        })
      });

      const data = await res.json();
      if (data.success && data.notification) {
        setNotifications((prev) => [data.notification, ...prev]);
        setSimulatedAlert(`🔔 নতুন অর্ডার প্রাপ্তি! ${data.notification.orderId} — এসএমএস ও জিমেইল নোটিফিকেশন পাঠানো হয়েছে 01603319739 ও habiburkhanrony3@gmail.com এ!`);
        setTimeout(() => setSimulatedAlert(null), 5000);
      }
    } catch (_) {}
  };

  const filtered = notifications.filter((n) => (filterType === 'unread' ? !n.read : true));
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative p-3 rounded-2xl bg-blue-50 text-blue-600 shrink-0">
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isBn ? 'ক্লায়েন্ট অর্ডার নোটিফিকেশন প্যানেল' : 'Client Order Notifications'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isBn 
                  ? `ক্লায়েন্ট অর্ডার করলেই রিয়েল-টাইমে এখানে শো করবে। নোটিফিকেশন সরাসরি পাঠানো হয়:` 
                  : 'Live incoming orders are received here and dispatched to owner:'}
              </p>
            </div>
          </div>

          {/* Quick Admin Dispatch Info */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateIncomingOrder}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isBn ? '+ টেস্ট অর্ডার সিমুলেশন' : '+ Test Order'}</span>
            </button>

            <button
              onClick={fetchNotifications}
              disabled={loading}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Live Dispatch Target Badge Banner */}
        <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="font-bold text-slate-900">🔔 অটো-অ্যালার্ট ডেস্টিনেশন:</span>
            <span className="bg-blue-100 text-blue-900 font-bold px-2 py-0.5 rounded-md">
              📱 {STORE_CONFIG.hotline}
            </span>
            <span className="bg-emerald-100 text-emerald-900 font-bold px-2 py-0.5 rounded-md truncate">
              ✉️ {STORE_CONFIG.adminEmail}
            </span>
          </div>

          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>১ মিলিসেকেন্ডে অ্যালার্ট প্রসেসিং সক্রিয়</span>
          </div>
        </div>

        {/* Real-time simulation alert popup */}
        {simulatedAlert && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl text-xs font-bold animate-in fade-in flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{simulatedAlert}</span>
          </div>
        )}

        {/* Filter & Mark all read bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'সব নোটিফিকেশন' : 'All'} ({notifications.length})
            </button>

            <button
              onClick={() => setFilterType('unread')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                filterType === 'unread'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {isBn ? 'নতুন / অপঠিত' : 'Unread'} ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              {isBn ? 'সবগুলো পঠিত মার্ক করুন' : 'Mark all as read'}
            </button>
          )}
        </div>
      </div>

      {/* NOTIFICATIONS LIST */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800 text-base">
              {isBn ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No notifications'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isBn 
                ? 'ক্লায়েন্ট অর্ডার করলে সাথে সাথে নোটিফিকেশন এখানে আসবে।' 
                : 'Incoming client orders will appear here in real-time.'}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-4 sm:p-5 rounded-3xl border transition shadow-sm hover:shadow-md ${
                !item.read
                  ? 'bg-blue-50/70 border-blue-200 ring-1 ring-blue-400/30'
                  : 'bg-white border-slate-200/80'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Left details */}
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">
                      {item.orderId}
                    </span>
                    {!item.read && (
                      <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded-full">
                        NEW ORDER
                      </span>
                    )}
                    <span className="text-xs text-slate-400">• {item.timestamp}</span>
                  </div>

                  <div className="text-xs text-slate-700">
                    <strong className="text-slate-900">{item.customerName}</strong>
                    <span className="text-slate-500 mx-1.5">|</span>
                    <span className="text-blue-700 font-bold">📞 {item.customerPhone}</span>
                    <span className="text-slate-500 mx-1.5">|</span>
                    <span className="text-slate-600">✉️ {item.customerEmail}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    📦 <strong>আইটেমস:</strong> {item.itemsSummary}
                  </p>
                </div>

                {/* Right Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-200">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">মোট মূল্য</span>
                    <span className="text-base font-black text-blue-700">৳{item.orderTotal}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(item.id);
                      onViewOrder(item.orderId);
                    }}
                    className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shrink-0"
                  >
                    <span>{isBn ? 'অর্ডার দেখুন' : 'View Order'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
