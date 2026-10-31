import React, { useState } from 'react';
import { 
  User, Phone, Mail, MapPin, ShieldCheck, Heart, 
  ShoppingBag, Award, Edit3, Check, MessageCircle, ExternalLink,
  Store, Building2, Clock, Sparkles
} from 'lucide-react';
import { STORE_CONFIG, INITIAL_USER_PROFILE } from '../data/mockData';
import { UserProfile } from '../types';

interface ProfileScreenProps {
  onNavigate: (screen: any) => void;
  language?: 'bn' | 'en';
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onNavigate,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const [profile, setProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editAddress, setEditAddress] = useState(profile.address);
  const [editDistrict, setEditDistrict] = useState(profile.district);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      ...profile,
      name: editName,
      phone: editPhone,
      address: editAddress,
      district: editDistrict,
    });
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    // Persist to server
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editName,
        phone: editPhone,
        address: editAddress,
        district: editDistrict,
      })
    }).catch(() => {});
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* BRAND & OWNER HERO CARD */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-slate-800 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-60 h-60 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Stylish RFH Logo Badge */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-0.5 shadow-xl shrink-0 group hover:scale-105 transition">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex flex-col items-center justify-center p-2">
              <span className="text-2xl sm:text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-white">
                RFH
              </span>
              <span className="text-[8px] font-black tracking-widest uppercase text-amber-400 -mt-0.5">
                Rony Fashion
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'অফিসিয়াল স্টোর ও ওনার প্রোফাইল' : 'Official Store & Owner Profile'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-serif">
              {STORE_CONFIG.brandName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              {isBn ? STORE_CONFIG.bnTagline : STORE_CONFIG.tagline}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-400" />
                <strong>{isBn ? 'স্বত্বাধিকারী:' : 'Proprietor:'}</strong> {STORE_CONFIG.ownerName}
              </span>
              <span className="flex items-center gap-1.5">
                <Store className="w-4 h-4 text-blue-400" />
                <span>{isBn ? 'ধানমন্ডি সেন্ট্রাল হাব, ঢাকা' : 'Dhanmondi Central Hub, Dhaka'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Contact & WhatsApp Action Strip */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href={`tel:${STORE_CONFIG.hotline}`}
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition text-white border border-white/10"
          >
            <Phone className="w-4 h-4 text-blue-400" />
            <span>হটলাইন: {STORE_CONFIG.hotline}</span>
          </a>

          <a
            href={STORE_CONFIG.whatsAppLink}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-500 rounded-2xl text-xs font-bold transition text-white shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>হোয়াটসঅ্যাপ: {STORE_CONFIG.whatsAppNumber}</span>
          </a>

          <a
            href={`mailto:${STORE_CONFIG.adminEmail}`}
            className="flex items-center justify-center gap-2 p-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold transition text-white border border-white/10"
          >
            <Mail className="w-4 h-4 text-rose-400" />
            <span className="truncate">{STORE_CONFIG.adminEmail}</span>
          </a>
        </div>
      </div>

      {/* STORE HEADQUARTERS & BUSINESS ADDRESS CARD */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <Building2 className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-black tracking-tight">
            {isBn ? 'রনি ফ্যাশন হাউস প্রধান ঠিকানা ও স্টোর ইনফরমেশন' : 'Store Official Address & Information'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
              {isBn ? 'স্টোর ও ওয়্যারহাউজ ঠিকানা' : 'Warehouse & Store Address'}
            </span>
            <div className="font-extrabold text-slate-900 text-sm">
              {STORE_CONFIG.address}
            </div>
            <p className="text-slate-500">
              হাউস ৩২, রোড ৭এ, ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ।
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-slate-500 uppercase tracking-wider block text-[10px]">
              {isBn ? 'সাপোর্ট ও যোগাযোগ সময়সূচি' : 'Customer Support & Business Hours'}
            </span>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>শনিবার — বৃহস্পতিবার (সকাল ৯:০০ - রাত ১০:৩০)</span>
            </div>
            <p className="text-slate-500">
              জরুরি প্রয়োজনে ২৪/৭ হোয়াটসঅ্যাপ মেসেজ সাপোর্ট সক্রিয় থাকে।
            </p>
          </div>
        </div>
      </div>

      {/* CUSTOMER PROFILE CARD & EDITABLE FORM */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/80 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              {isBn ? 'আপনার কাস্টমার প্রোফাইল ও ডেলিভারি তথ্য' : 'Your Customer Account Details'}
            </h2>
            <p className="text-xs text-slate-500">
              {isBn ? 'সহজ ও দ্রুত চেকআউটের জন্য নিজের ঠিকানা সেভ করে রাখুন' : 'Saved details for fast 1-click checkout'}
            </p>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditing ? (isBn ? 'বাতিল' : 'Cancel') : (isBn ? 'পরিবর্তন' : 'Edit')}</span>
          </button>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{isBn ? 'প্রোফাইল তথ্য সফলভাবে সেভ হয়েছে!' : 'Profile updated successfully!'}</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'পূর্ণ নাম' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'মোবাইল নম্বর' : 'Phone Number'}
                </label>
                <input
                  type="tel"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'জেলা (District)' : 'District'}
                </label>
                <input
                  type="text"
                  required
                  value={editDistrict}
                  onChange={(e) => setEditDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isBn ? 'ঠিকানা (বাসা/রোড/এলাকা)' : 'Street Address'}
                </label>
                <input
                  type="text"
                  required
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              {isBn ? 'তথ্য সংরক্ষণ করুন' : 'Save Changes'}
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">{isBn ? 'গ্রাহকের নাম' : 'Customer Name'}</span>
              <span className="font-bold text-slate-900 text-sm">{profile.name}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">{isBn ? 'ফোন নম্বর' : 'Phone'}</span>
              <span className="font-bold text-slate-900 text-sm">{profile.phone}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">{isBn ? 'ডেলিভারি জেলা' : 'District'}</span>
              <span className="font-bold text-slate-900 text-sm">{profile.district}</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">{isBn ? 'বিস্তারিত ঠিকানা' : 'Address'}</span>
              <span className="font-bold text-slate-900 text-sm">{profile.address}</span>
            </div>
          </div>
        )}

        {/* Quick Stats Summary */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="text-xl font-black text-blue-700">{profile.totalOrders}</div>
            <div className="text-[11px] font-semibold text-blue-900 mt-0.5">{isBn ? 'সম্পূর্ণ অর্ডার' : 'Total Orders'}</div>
          </div>

          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <div className="text-xl font-black text-amber-700">{profile.rewardPoints}</div>
            <div className="text-[11px] font-semibold text-amber-900 mt-0.5">{isBn ? 'রিওয়ার্ড পয়েন্টস' : 'Reward Points'}</div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
            <div className="text-xl font-black text-emerald-700">VIP</div>
            <div className="text-[11px] font-semibold text-emerald-900 mt-0.5">{isBn ? 'মেম্বার স্ট্যাটাস' : 'Member Level'}</div>
          </div>
        </div>

        {/* Quick Action Navigation */}
        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={() => onNavigate('track')}
            className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>{isBn ? 'অর্ডার ট্র্যাকিং দেখুন' : 'Track Current Orders'}</span>
          </button>

          <button
            onClick={() => onNavigate('customizer')}
            className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold text-center transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isBn ? 'কাস্টম জার্সি স্টুডিও' : 'Create Custom Jersey'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
