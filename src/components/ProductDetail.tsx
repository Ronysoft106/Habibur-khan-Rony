import React, { useState } from 'react';
import { 
  ArrowLeft, Star, ShoppingBag, ShieldCheck, Truck, 
  RotateCcw, Share2, Heart, Check, Ruler, MessageSquare, Plus, Minus
} from 'lucide-react';
import { Product, CartItem, Review } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (item: CartItem) => void;
  onBuyNow: (item: CartItem) => void;
  language?: 'bn' | 'en';
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'XL');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'shipping'>('desc');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 'r1',
      productId: product.id,
      userName: 'Tanvir Hossain',
      rating: 5,
      date: '২ দিন আগে',
      comment: 'কাপড় খুবই প্রিমিয়াম এবং ব্রিদেবল। সাইজ ফিটিং একদম ১০০ তে ১০০!',
      verifiedPurchase: true
    },
    {
      id: 'r2',
      productId: product.id,
      userName: 'Shakil Ahmed',
      rating: 5,
      date: '৫ দিন আগে',
      comment: 'BoyZoneW থেকে ফাস্ট ডেলিভারি পেয়েছি। রেট্রো প্রিন্ট অসাধারণ নিখুঁত।',
      verifiedPurchase: true
    }
  ]);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor.trim() || !newReviewText.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      userName: newReviewAuthor.trim(),
      rating: newReviewRating,
      date: isBn ? 'আজকে' : 'Today',
      comment: newReviewText.trim(),
      verifiedPurchase: true
    };

    setReviews([newRev, ...reviews]);
    setNewReviewAuthor('');
    setNewReviewText('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const createCartItem = (): CartItem => ({
    id: `${product.id}-${selectedSize}-${Date.now()}`,
    productId: product.id,
    title: product.title,
    price: product.price,
    size: selectedSize,
    quantity,
    image: product.image,
  });

  const handleAdd = () => {
    onAddToCart(createCartItem());
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleBuy = () => {
    onBuyNow(createCartItem());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 mb-4 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{isBn ? '‹ পূর্ববর্তী পেজে ফিরুন' : 'Back to Collection'}</span>
      </button>

      {/* Product Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product Images */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-md group">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-[380px] sm:h-[480px] object-cover transition duration-300 group-hover:scale-105"
            />
            {/* Discount Badge */}
            <div className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-black px-3 py-1 rounded-full shadow-md">
              {product.discount}
            </div>

            {/* Urgency Stock Warning */}
            {product.stockCount && product.stockCount < 10 && (
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-xs text-white text-xs font-bold py-2 px-3 rounded-xl flex items-center justify-between">
                <span>🔥 {isBn ? `স্টক সীমিত — মাত্র ${product.stockCount} টি অবশিষ্ট!` : `Only ${product.stockCount} left in stock!`}</span>
                <span className="text-amber-400 font-extrabold uppercase text-[10px]">Fast Selling</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Product Info & Purchase Actions */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-normal">({reviews.length + product.reviewCount} reviews)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {product.title}
            </h1>
            {product.bnTitle && (
              <h2 className="text-sm font-semibold text-slate-500 mt-1">
                {product.bnTitle}
              </h2>
            )}

            {/* Pricing Section */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-black text-slate-950">
                ৳{product.price}
              </span>
              <span className="text-base text-slate-400 line-through">
                ৳{product.oldPrice}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Save ৳{product.oldPrice - product.price}
              </span>
            </div>
          </div>

          {/* Size Chooser with Size Guide Trigger */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {isBn ? 'সাইজ নির্বাচন করুন:' : 'Select Size:'} <span className="text-blue-600 font-black">{selectedSize}</span>
              </label>
              <button
                type="button"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{isBn ? 'সাইজ চার্ট (Size Guide)' : 'Size Guide'}</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {(product.sizes || ['M', 'L', 'XL', 'XXL']).map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-14 h-11 rounded-xl text-xs font-black transition ${
                    selectedSize === size
                      ? 'bg-blue-600 text-white shadow-md ring-2 ring-blue-600'
                      : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Size Chart Modal / Drawer */}
            {showSizeGuide && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 animate-in fade-in">
                <div className="font-bold text-slate-800">BoyZoneW Standard Jersey Size Chart (Inches):</div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
                  <div className="p-1 bg-white rounded-md border"><strong>M:</strong> 27" L / 38" C</div>
                  <div className="p-1 bg-white rounded-md border"><strong>L:</strong> 28" L / 40" C</div>
                  <div className="p-1 bg-white rounded-md border"><strong>XL:</strong> 29" L / 42" C</div>
                  <div className="p-1 bg-white rounded-md border"><strong>XXL:</strong> 30" L / 44" C</div>
                </div>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              {isBn ? 'পরিমাণ (Quantity):' : 'Quantity:'}
            </label>
            <div className="flex items-center border border-slate-300 rounded-xl w-36 overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 disabled:opacity-30 transition"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="flex-1 text-center font-black text-sm text-slate-900">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-slate-100 active:bg-slate-200 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* CTA Buttons: Instant Buy & Add to Cart */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleBuy}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-2xl font-black text-base shadow-lg flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <ShoppingBag className="w-5 h-5 text-amber-300" />
              <span>{isBn ? 'এখনই অর্ডার করুন (Buy Now)' : 'Buy Now Instantly'}</span>
            </button>

            <button
              onClick={handleAdd}
              className="w-full py-3.5 px-6 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 rounded-2xl font-bold text-sm shadow-xs flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <span>🛒 {isBn ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
            </button>

            {addedToast && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs text-center font-bold flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'পণ্যটি কার্টে সফলভাবে যোগ করা হয়েছে!' : 'Product added to cart!'}</span>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{isBn ? 'ধানমন্ডি, ঢাকা ও সারা দেশে দ্রুত ক্যাশ অন ডেলিভারি' : 'Cash on Delivery from Dhaka Nationwide'}</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isBn ? '৭ দিন সহজ সাইজ এক্সচেঞ্জ সুবিধা' : '7 Days Easy Size Replacement'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Reviews, Shipping Info */}
      <div className="mt-12 bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('desc')}
            className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'desc'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 {isBn ? 'পণ্যের বিবরণ (Description)' : 'Description'}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            ⭐ {isBn ? `গ্রাহক রিভিউ (${reviews.length})` : `Customer Reviews (${reviews.length})`}
          </button>

          <button
            onClick={() => setActiveTab('shipping')}
            className={`flex-1 py-4 text-center text-xs sm:text-sm font-bold border-b-2 transition ${
              activeTab === 'shipping'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            🚚 {isBn ? 'ডেলিভারি ও রিটার্ন নীতি' : 'Delivery & Returns'}
          </button>
        </div>

        <div className="p-6 sm:p-8">
          {/* TAB 1: DESCRIPTION */}
          {activeTab === 'desc' && (
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed text-sm">
              {product.description}
              
              <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  {isBn ? 'ফ্যাব্রিক ও যত্নের নির্দেশিকা:' : 'Fabric & Care Instructions:'}
                </h4>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
                  <li>100% Breathable Micro-Interlock Polyester with Dry-Fit technology</li>
                  <li>Machine wash cold with similar colors inside out</li>
                  <li>Do not iron directly over rubber badges or sponsor prints</li>
                  <li>Tumble dry low or air dry in shade</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Write Review Form */}
              <form onSubmit={handleAddReview} className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>{isBn ? 'আপনার রিভিউ প্রদান করুন' : 'Write a Product Review'}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? 'আপনার নাম' : 'Your Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthor}
                      onChange={(e) => setNewReviewAuthor(e.target.value)}
                      placeholder="e.g. Mahfuzul Alam"
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? 'রেটিং (স্টার)' : 'Rating (Stars)'}
                    </label>
                    <div className="flex items-center gap-1.5 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 hover:scale-125 transition"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= newReviewRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? 'আপনার মন্তব্য' : 'Your Comments'}
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder={isBn ? 'পণ্যের কোয়ালিটি, ফিটিং এবং সার্ভিস কেমন লাগলো...' : 'Share your thoughts on quality, fitting, and delivery...'}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  {isBn ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                </button>

                {reviewSubmitted && (
                  <span className="text-xs font-bold text-emerald-600 ml-3">
                    ✅ {isBn ? 'ধন্যবাদ! আপনার রিভিউ যোগ করা হয়েছে।' : 'Review added successfully!'}
                  </span>
                )}
              </form>

              {/* Reviews List */}
              <div className="divide-y divide-slate-100 space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="pt-4 first:pt-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 mb-1.5">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SHIPPING */}
          {activeTab === 'shipping' && (
            <div className="space-y-4 text-xs text-slate-600">
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-slate-900 mb-1">
                  {isBn ? 'কুরিয়ার ও ডেলিভারি সময়সীমা:' : 'Courier & Delivery Timeline:'}
                </h4>
                <p className="leading-relaxed">
                  {isBn
                    ? 'Rony Fashion House এর কেন্দ্রীয় হাব অবস্থিত ধানমন্ডি, ঢাকায়। আমরা স্টিডফাস্ট কুরিয়ার ও পাঠাও এর মাধ্যমে সারা বাংলাদেশে দ্রুত ও নিরাপদে পার্সেল সরবরাহ করি।'
                    : 'Rony Fashion House main dispatch hub is located at Dhanmondi, Dhaka. We partner with Steadfast & Pathao courier networks nationwide.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 border rounded-xl">
                  <strong>ঢাকার ভেতরে:</strong> ১-২ কর্মদিবস (চার্জ ৬০৳)
                </div>
                <div className="p-3 border rounded-xl">
                  <strong>ঢাকার বাইরে ও সারা বাংলাদেশ:</strong> ২-৩ কর্মদিবস (চার্জ ১২০৳)
                </div>
              </div>

              <p className="text-slate-500">
                ১৫০০ টাকার উপরে অর্ডারে ফ্রি ডেলিভারি প্রযোজ্য। কোনো সমস্যা হলে আমাদের কাস্টমার কেয়ারে কল করুন: 01603319739
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
