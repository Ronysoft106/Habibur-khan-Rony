import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Sliders, RotateCcw, Type, Sparkles, Check, 
  ShoppingBag, Download, ArrowLeftRight, Image as ImageIcon,
  Palette, Eye, ZoomIn, ZoomOut, Shield, ChevronRight
} from 'lucide-react';
import { CartItem } from '../types';

interface TShirtCustomizerProps {
  onAddToCart: (customItem: CartItem) => void;
  language?: 'bn' | 'en';
}

const SHIRT_COLORS = [
  { name: 'Pitch Black', hex: '#111827', textHex: '#FFFFFF' },
  { name: 'Pearl White', hex: '#F8FAFC', textHex: '#0F172A' },
  { name: 'Royal Madrid Gold', hex: '#D97706', textHex: '#FFFFFF' },
  { name: 'Deep Navy Blue', hex: '#1E3A8A', textHex: '#FFFFFF' },
  { name: 'Crimson Red', hex: '#DC2626', textHex: '#FFFFFF' },
  { name: 'Emerald Green', hex: '#059669', textHex: '#FFFFFF' },
  { name: 'Electric Cyan', hex: '#0284C7', textHex: '#FFFFFF' },
  { name: 'Burgundy Maroon', hex: '#831843', textHex: '#FFFFFF' },
];

const FONTS = [
  { id: 'Impact, sans-serif', name: 'Athletic Squad' },
  { id: 'Arial Black, sans-serif', name: 'Bold Classic' },
  { id: 'Trebuchet MS, sans-serif', name: 'Modern Pro' },
  { id: 'Courier New, monospace', name: 'Retro Block' },
  { id: 'Georgia, serif', name: 'Vintage Club' },
];

const BADGES = [
  { id: 'none', name: 'No Badge' },
  { id: 'ucl', name: '⭐ Champions League Starball' },
  { id: 'pl', name: '🦁 Premier League Lion' },
  { id: 'laliga', name: '⚽ La Liga Crest' },
  { id: 'wc_champion', name: '🏆 World Cup Champions 3-Star' },
];

const PRESETS = [
  {
    name: 'Real Madrid 7',
    shirtType: 'jersey' as const,
    color: '#111827',
    playerName: 'RONALDO',
    playerNumber: '7',
    sponsorText: 'EMIRATES',
    textColor: '#F59E0B',
    badge: 'ucl',
  },
  {
    name: 'Argentina 10',
    shirtType: 'jersey' as const,
    color: '#0284C7',
    playerName: 'MESSI',
    playerNumber: '10',
    sponsorText: 'ARGENTINA',
    textColor: '#FFFFFF',
    badge: 'wc_champion',
  },
  {
    name: 'Dhanmondi Kings FC',
    shirtType: 'jersey' as const,
    color: '#059669',
    playerName: 'HABIBUR',
    playerNumber: '99',
    sponsorText: 'RONY FASHION',
    textColor: '#F8FAFC',
    badge: 'pl',
  },
  {
    name: 'Streetwear Graphic Tee',
    shirtType: 'tshirt' as const,
    color: '#111827',
    playerName: '',
    playerNumber: '',
    sponsorText: 'LIMITED EDITION',
    textColor: '#EF4444',
    badge: 'none',
  }
];

export const TShirtCustomizer: React.FC<TShirtCustomizerProps> = ({
  onAddToCart,
  language = 'bn',
}) => {
  const isBn = language === 'bn';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Customizer state
  const [shirtType, setShirtType] = useState<'jersey' | 'tshirt' | 'polo'>('jersey');
  const [colorHex, setColorHex] = useState<string>('#111827');
  const [view, setView] = useState<'front' | 'back'>('back');
  const [selectedSize, setSelectedSize] = useState<string>('XL');

  // Text state
  const [playerName, setPlayerName] = useState<string>('RONALDO');
  const [playerNumber, setPlayerNumber] = useState<string>('7');
  const [sponsorText, setSponsorText] = useState<string>('RONY FASHION');
  const [textColor, setTextColor] = useState<string>('#F59E0B');
  const [fontFamily, setFontFamily] = useState<string>('Impact, sans-serif');
  const [textSize, setTextSize] = useState<number>(36);

  // Badge state
  const [selectedBadge, setSelectedBadge] = useState<string>('ucl');

  // Uploaded Image state
  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [imgScale, setImgScale] = useState<number>(1);
  const [imgPosX, setImgPosX] = useState<number>(0);
  const [imgPosY, setImgPosY] = useState<number>(0);

  // Filter states
  const [brightness, setBrightness] = useState<number>(100); // 50 to 200
  const [contrast, setContrast] = useState<number>(100);     // 50 to 200
  const [saturation, setSaturation] = useState<number>(100); // 0 to 200
  const [grayscale, setGrayscale] = useState<number>(0);      // 0 to 100
  const [invert, setInvert] = useState<boolean>(false);
  const [sepia, setSepia] = useState<number>(0);             // 0 to 100
  const [hueRotate, setHueRotate] = useState<number>(0);      // 0 to 360

  // UI active tab
  const [activeTab, setActiveTab] = useState<'apparel' | 'text' | 'image' | 'filters' | 'presets'>('text');
  const [addedToast, setAddedToast] = useState(false);

  // Handle Image File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setUploadedImageSrc(src);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          setUploadedImage(img);
          // Auto switch to image tab so user can adjust
          setActiveTab('image');
        };
        img.src = src;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setInvert(false);
    setSepia(0);
    setHueRotate(0);
    setImgScale(1);
    setImgPosX(0);
    setImgPosY(0);
  };

  // Live Canvas Rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const width = 480;
    const height = 540;
    canvas.width = width;
    canvas.height = height;

    // Clear background
    ctx.clearRect(0, 0, width, height);

    // Subtle background gradient for studio feel
    const bgGradient = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 280);
    bgGradient.addColorStop(0, '#FFFFFF');
    bgGradient.addColorStop(1, '#E2E8F0');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 1. Draw Shirt Silhouette
    ctx.save();

    // Shadow under shirt
    ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 12;

    // Shirt Body Path
    ctx.beginPath();
    // Neck collar center
    ctx.moveTo(170, 75);
    // Right shoulder
    ctx.quadraticCurveTo(240, view === 'front' ? 120 : 90, 310, 75);
    // Right sleeve top
    ctx.lineTo(440, 160);
    // Right sleeve bottom
    ctx.lineTo(395, 230);
    // Right underarm
    ctx.lineTo(345, 195);
    // Right side hem
    ctx.lineTo(355, 470);
    // Bottom curve
    ctx.quadraticCurveTo(240, 485, 125, 470);
    // Left side hem
    ctx.lineTo(135, 195);
    // Left underarm
    ctx.lineTo(85, 230);
    // Left sleeve bottom
    ctx.lineTo(40, 160);
    // Left shoulder
    ctx.closePath();

    // Shirt fill color
    ctx.fillStyle = colorHex;
    ctx.fill();

    // Shirt border
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // 2. Add realistic fabric mesh texture & lighting
    ctx.save();
    // Subtle vertical highlights / folds
    const foldGradient = ctx.createLinearGradient(0, 0, width, 0);
    foldGradient.addColorStop(0.1, 'rgba(0,0,0,0.18)');
    foldGradient.addColorStop(0.28, 'rgba(255,255,255,0.08)');
    foldGradient.addColorStop(0.5, 'rgba(0,0,0,0.04)');
    foldGradient.addColorStop(0.72, 'rgba(255,255,255,0.08)');
    foldGradient.addColorStop(0.9, 'rgba(0,0,0,0.18)');

    ctx.fillStyle = foldGradient;
    ctx.fill(); // fills previous shirt path

    // Draw Neckline detail
    ctx.beginPath();
    if (view === 'front') {
      if (shirtType === 'polo') {
        // Collar flaps
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 2;
        ctx.strokeRect(228, 90, 24, 70);
      } else {
        ctx.arc(240, 75, 45, 0, Math.PI);
        ctx.lineWidth = 8;
        ctx.strokeStyle = colorHex === '#F8FAFC' ? '#CBD5E1' : 'rgba(255, 255, 255, 0.35)';
        ctx.stroke();
      }
    } else {
      ctx.arc(240, 68, 50, 0, Math.PI);
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.stroke();
    }

    // Sleeve Stripes for Sports Jersey
    if (shirtType === 'jersey') {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 4;
      // Right sleeve lines
      ctx.beginPath();
      ctx.moveTo(330, 115);
      ctx.lineTo(420, 180);
      ctx.moveTo(340, 130);
      ctx.lineTo(410, 195);
      ctx.stroke();

      // Left sleeve lines
      ctx.beginPath();
      ctx.moveTo(150, 115);
      ctx.lineTo(60, 180);
      ctx.moveTo(140, 130);
      ctx.lineTo(70, 195);
      ctx.stroke();
    }

    // Tournament Badge on Right Sleeve
    if (selectedBadge !== 'none') {
      ctx.save();
      ctx.fillStyle = '#F59E0B';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(385, 190, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedBadge === 'ucl' ? '★' : selectedBadge === 'wc_champion' ? '★★★' : 'PL', 385, 190);
      ctx.restore();
    }

    ctx.restore();

    // 3. Render Uploaded Custom Image with Live Filters
    if (uploadedImage) {
      ctx.save();

      // Apply CSS Filters directly to canvas context
      const filterString = `
        brightness(${brightness}%)
        contrast(${contrast}%)
        saturate(${saturation}%)
        grayscale(${grayscale}%)
        invert(${invert ? 1 : 0})
        sepia(${sepia}%)
        hue-rotate(${hueRotate}deg)
      `;
      ctx.filter = filterString;

      // Base placement: center of chest or lower back
      const targetCenterX = 240 + imgPosX;
      const targetCenterY = (view === 'front' ? 240 : 350) + imgPosY;
      const baseWidth = 140 * imgScale;
      const aspectRatio = uploadedImage.height / uploadedImage.width;
      const baseHeight = baseWidth * aspectRatio;

      ctx.drawImage(
        uploadedImage,
        targetCenterX - baseWidth / 2,
        targetCenterY - baseHeight / 2,
        baseWidth,
        baseHeight
      );

      ctx.restore();
    }

    // 4. Render Typography (Name, Number, Sponsor)
    ctx.save();
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';

    if (view === 'back') {
      // BACK VIEW: Big Squad Number & Player Name
      if (playerName.trim()) {
        ctx.font = `bold ${Math.round(textSize * 0.75)}px ${fontFamily}`;
        // Arch or letter spacing
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetY = 2;
        ctx.fillText(playerName.toUpperCase(), 240, 180);
      }

      if (playerNumber.trim()) {
        ctx.font = `bold ${Math.round(textSize * 2.2)}px ${fontFamily}`;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetY = 3;
        ctx.fillText(playerNumber, 240, 310);
      }

      if (sponsorText.trim()) {
        ctx.font = `bold 13px ${fontFamily}`;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(sponsorText.toUpperCase(), 240, 420);
      }
    } else {
      // FRONT VIEW: Chest Sponsor & Club Logo / Small Number
      if (sponsorText.trim()) {
        ctx.font = `bold ${Math.round(textSize * 0.9)}px ${fontFamily}`;
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 4;
        ctx.fillText(sponsorText.toUpperCase(), 240, 290);
      }

      if (playerNumber.trim()) {
        ctx.font = `bold 22px ${fontFamily}`;
        ctx.fillText(playerNumber, 290, 200);
      }

      // Small Chest Crest Badge
      ctx.beginPath();
      ctx.arc(190, 195, 15, 0, Math.PI * 2);
      ctx.fillStyle = textColor;
      ctx.fill();
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('RFH', 190, 198);
    }

    ctx.restore();

  }, [
    shirtType, colorHex, view, playerName, playerNumber, 
    sponsorText, textColor, fontFamily, textSize, selectedBadge,
    uploadedImage, imgScale, imgPosX, imgPosY,
    brightness, contrast, saturation, grayscale, invert, sepia, hueRotate
  ]);

  // Load Preset
  const handleLoadPreset = (preset: typeof PRESETS[0]) => {
    setShirtType(preset.shirtType);
    setColorHex(preset.color);
    setPlayerName(preset.playerName);
    setPlayerNumber(preset.playerNumber);
    setSponsorText(preset.sponsorText);
    setTextColor(preset.textColor);
    setSelectedBadge(preset.badge);
    setView('back');
  };

  // Export Design Mockup as Image
  const handleDownloadMockup = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `RonyFashionHouse-Custom-${playerName || 'Jersey'}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Add Custom Jersey to Cart
  const handleAddToCartClick = () => {
    const canvas = canvasRef.current;
    const mockupUrl = canvas 
      ? canvas.toDataURL('image/png') 
      : 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600&auto=format&fit=crop&q=80';

    const customItem: CartItem = {
      id: `custom-${Date.now()}`,
      productId: 'custom-jersey',
      title: `Custom ${shirtType.toUpperCase()} (${playerName || 'Personalized'} #${playerNumber || ''})`,
      price: 550, // ৳450 base + ৳100 custom print
      size: selectedSize,
      quantity: 1,
      image: mockupUrl,
      isCustom: true,
      customDetails: {
        playerName,
        playerNumber,
        shirtColor: colorHex,
        hasCustomImage: !!uploadedImage,
        view,
        badge: selectedBadge,
      }
    };

    onAddToCart(customItem);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Title & Breadcrumbs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isBn ? 'জার্সি পার্সোনালাইজেশন স্টুডিও' : 'Jersey & T-Shirt Studio'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {isBn ? 'আপনার নিজস্ব কাস্টম জার্সি ডিজাইন করুন' : 'Design Your Custom Jersey & T-Shirt'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isBn 
              ? 'লোগো বা ছবি আপলোড করুন, ফিল্টার প্রয়োগ করুন, নাম-নাম্বার যুক্ত করে সরাসরি অর্ডার করুন।' 
              : 'Upload logos, apply live image filters, customize player name & number, and order instantly.'}
          </p>
        </div>

        {/* Quick Actions Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === 'front' ? 'back' : 'front')}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition"
          >
            <ArrowLeftRight className="w-4 h-4 text-blue-600" />
            <span>{view === 'front' ? (isBn ? 'পেছনের দিক দেখুন (Back)' : 'View Back') : (isBn ? 'সামনের দিক দেখুন (Front)' : 'View Front')}</span>
          </button>

          <button
            onClick={handleDownloadMockup}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold transition shadow-xs"
            title="Download PNG Mockup"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">{isBn ? 'মকআপ ডাউনলোড' : 'Download Mockup'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Canvas Preview */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="relative w-full max-w-[480px] bg-white rounded-3xl p-4 shadow-xl border border-slate-200/80">
            {/* View Tag */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-2">
              <span className="bg-slate-950/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                <Eye className="w-3 h-3 text-amber-400" />
                {view === 'back' ? (isBn ? 'পেছন (Back View)' : 'Back View') : (isBn ? 'সামনে (Front View)' : 'Front View')}
              </span>
              {uploadedImage && (
                <span className="bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.8 rounded-full">
                  Image Active
                </span>
              )}
            </div>

            {/* Quick View Switcher floating button */}
            <button
              onClick={() => setView(view === 'front' ? 'back' : 'front')}
              className="absolute top-6 right-6 z-10 w-9 h-9 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:scale-110 transition active:scale-95"
              aria-label="Toggle front back view"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* HTML5 Canvas */}
            <div className="w-full flex justify-center overflow-hidden rounded-2xl">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[440px] h-auto object-contain select-none"
              />
            </div>

            {/* Pricing & Order Card at bottom of preview */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs text-slate-500 font-medium">
                  {isBn ? 'কাস্টম জার্সি প্যাকেজ মূল্য' : 'Custom Kit Total Price'}
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-black text-slate-900">৳550</span>
                  <span className="text-xs text-slate-400 line-through">৳950</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                    {isBn ? 'প্রিন্ট চার্জ ফ্রি' : '42% Off'}
                  </span>
                </div>
              </div>

              {/* Size Selector */}
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-600 mr-1">{isBn ? 'সাইজ:' : 'Size:'}</span>
                {['M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                      selectedSize === sz
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCartClick}
              className="w-full mt-3 py-3.5 px-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition"
            >
              <ShoppingBag className="w-4 h-4 text-amber-300" />
              <span>{isBn ? 'এই কাস্টম জার্সিটি কার্টে যোগ করুন (৳550)' : 'Add Custom Jersey to Cart (৳550)'}</span>
            </button>

            {addedToast && (
              <div className="mt-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs text-center font-bold flex items-center justify-center gap-1 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{isBn ? 'কার্টে যোগ করা হয়েছে! উপরে শপিং ব্যাগে ক্লিক করে অর্ডার করুন।' : 'Added to cart successfully!'}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customization Controls & Image Filters */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 shadow-xl border border-slate-200/80">
          {/* Customizer Tabs */}
          <div className="flex border-b border-slate-200 overflow-x-auto no-scrollbar gap-1 pb-2 mb-6">
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                activeTab === 'text'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{isBn ? 'নাম ও নম্বর' : 'Name & Number'}</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                activeTab === 'image'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{isBn ? 'ছবি/লোগো আপলোড' : 'Upload Image'}</span>
              {uploadedImage && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
            </button>

            <button
              onClick={() => setActiveTab('filters')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                activeTab === 'filters'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>{isBn ? 'ইমেজ ফিল্টার' : 'Image Filters'}</span>
            </button>

            <button
              onClick={() => setActiveTab('apparel')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                activeTab === 'apparel'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>{isBn ? 'পোশাক ও রঙ' : 'Shirt & Color'}</span>
            </button>

            <button
              onClick={() => setActiveTab('presets')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
                activeTab === 'presets'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isBn ? 'ক্লাব প্রিসেট' : 'Presets'}</span>
            </button>
          </div>

          {/* TAB 1: TEXT & NUMBERS */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'প্লেয়ার নাম (Player Name)' : 'Player Name'}
                </label>
                <input
                  type="text"
                  maxLength={14}
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="e.g. RONALDO / MESSI / YOUR NAME"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold uppercase tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isBn ? 'জার্সি নম্বর' : 'Squad Number'}
                  </label>
                  <input
                    type="text"
                    maxLength={3}
                    value={playerNumber}
                    onChange={(e) => setPlayerNumber(e.target.value)}
                    placeholder="7, 10, 99"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-extrabold text-center tracking-wider focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    {isBn ? 'স্পন্সর / টিম টেক্সট' : 'Sponsor / Front Text'}
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    value={sponsorText}
                    onChange={(e) => setSponsorText(e.target.value)}
                    placeholder="BOYZONEW"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold uppercase focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Font Family Chooser */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'ফন্ট স্টাইল নির্বাচন' : 'Font Typography'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {FONTS.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setFontFamily(f.id)}
                      className={`p-2 rounded-xl border text-xs font-bold text-left transition ${
                        fontFamily === f.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                      style={{ fontFamily: f.id }}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Color Chooser */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'প্রিন্ট কালার' : 'Print Text Color'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {['#FFFFFF', '#F59E0B', '#0F172A', '#EF4444', '#10B981', '#38BDF8'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setTextColor(c)}
                      className={`w-9 h-9 rounded-xl border-2 transition ${
                        textColor === c ? 'scale-110 shadow-md ring-2 ring-blue-500' : 'border-slate-300'
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
              </div>

              {/* Text Size Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                  <span>{isBn ? 'টেক্সট সাইজ স্কেল' : 'Text Size Scale'}</span>
                  <span>{textSize}px</span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="52"
                  value={textSize}
                  onChange={(e) => setTextSize(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Sleeve Badge Chooser */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {isBn ? 'স্লিভ টুর্নামেন্ট ব্যাজ' : 'Sleeve Tournament Badge'}
                </label>
                <select
                  value={selectedBadge}
                  onChange={(e) => setSelectedBadge(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  {BADGES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* TAB 2: IMAGE UPLOADER & POSITIONING */}
          {activeTab === 'image' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl border-2 border-dashed border-blue-300 bg-blue-50/50 text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 cursor-pointer py-4"
                >
                  <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-blue-900 block">
                      {isBn ? 'কাস্টম ছবি বা লোগো নির্বাচন করুন' : 'Click to Upload Custom Logo / Photo'}
                    </span>
                    <span className="text-xs text-blue-600">
                      PNG, JPG, WEBP (ক্লিয়ার ব্যাকগ্রাউন্ড সুপারিশকৃত)
                    </span>
                  </div>
                </button>
              </div>

              {uploadedImage && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-emerald-600" />
                      {isBn ? 'আপলোডকৃত ছবি সমন্বয়' : 'Adjust Uploaded Graphic'}
                    </span>
                    <button
                      onClick={() => {
                        setUploadedImage(null);
                        setUploadedImageSrc(null);
                      }}
                      className="text-xs text-red-600 font-bold hover:underline"
                    >
                      {isBn ? 'ছবি মুছুন' : 'Remove Image'}
                    </button>
                  </div>

                  {/* Scale / Zoom Slider */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>{isBn ? 'ছবির আকার (Scale/Zoom)' : 'Size Scale'}</span>
                      <span>{Math.round(imgScale * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.4"
                      max="2.2"
                      step="0.05"
                      value={imgScale}
                      onChange={(e) => setImgScale(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Horizontal Position */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>{isBn ? 'ডানে-বামে অবস্থান (X Offset)' : 'Position Horizontal'}</span>
                      <span>{imgPosX}px</span>
                    </div>
                    <input
                      type="range"
                      min="-100"
                      max="100"
                      value={imgPosX}
                      onChange={(e) => setImgPosX(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  {/* Vertical Position */}
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>{isBn ? 'উপরে-নিচে অবস্থান (Y Offset)' : 'Position Vertical'}</span>
                      <span>{imgPosY}px</span>
                    </div>
                    <input
                      type="range"
                      min="-120"
                      max="120"
                      value={imgPosY}
                      onChange={(e) => setImgPosY(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setImgScale(1);
                      setImgPosX(0);
                      setImgPosY(0);
                    }}
                    className="text-xs text-slate-600 font-semibold hover:text-slate-900 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> {isBn ? 'পজিশন রিসেট' : 'Reset Position'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: IMAGE EDITING & FILTER TOOLS */}
          {activeTab === 'filters' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">
                  {isBn ? 'রিয়েল-টাইম ইমেজ ফিল্টার' : 'Live Image Filters & Effects'}
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  {isBn ? 'সব রিসেট করুন' : 'Reset All'}
                </button>
              </div>

              {!uploadedImage && (
                <div className="bg-amber-50 text-amber-800 p-3 rounded-xl text-xs font-medium border border-amber-200">
                  💡 {isBn ? 'ফিল্টার প্রয়োগ করতে প্রথমে "ছবি/লোগো আপলোড" ট্যাব থেকে একটি ছবি যুক্ত করুন।' : 'Upload an image first from the Upload tab to apply these real-time filters!'}
                </div>
              )}

              {/* Brightness */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{isBn ? 'উজ্জ্বলতা (Brightness)' : 'Brightness'}</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="180"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Contrast */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{isBn ? 'কন্ট্রাস্ট (Contrast)' : 'Contrast'}</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Saturation */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{isBn ? 'স্যাচুরেশন (Saturation)' : 'Saturation'}</span>
                  <span>{saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="250"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Grayscale */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{isBn ? 'গ্রেস্কেল / সাদা-কালো (Grayscale)' : 'Grayscale'}</span>
                  <span>{grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={grayscale}
                  onChange={(e) => setGrayscale(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Hue Rotate */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                  <span>{isBn ? 'কালার হিউ পরিবর্তন (Hue Rotate)' : 'Hue Rotate'}</span>
                  <span>{hueRotate}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={hueRotate}
                  onChange={(e) => setHueRotate(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>

              {/* Invert & Sepia Quick Toggles */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setInvert(!invert)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    invert ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  🔄 {isBn ? 'ইনভার্ট কালার' : 'Invert Colors'}
                </button>

                <button
                  type="button"
                  onClick={() => setSepia(sepia > 0 ? 0 : 80)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition ${
                    sepia > 0 ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  ☕ {isBn ? 'সেপিয়া রেট্রো টোন' : 'Sepia Vintage'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: SHIRT TYPE & FABRIC COLOR */}
          {activeTab === 'apparel' && (
            <div className="space-y-5">
              {/* Shirt Silhouette Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isBn ? 'পোশাকের ধরন' : 'Apparel Model'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'jersey', label: isBn ? 'রেট্রো জার্সি' : 'Retro Jersey' },
                    { id: 'tshirt', label: isBn ? 'ক্যাজুয়াল টি-শার্ট' : 'Crewneck Tee' },
                    { id: 'polo', label: isBn ? 'স্পোর্টস পোলো' : 'Sports Polo' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setShirtType(item.id as any)}
                      className={`p-3 rounded-xl border text-xs font-bold transition ${
                        shirtType === item.id
                          ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shirt Base Color */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {isBn ? 'জার্সি / শার্টের মূল কালার' : 'Fabric Color'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {SHIRT_COLORS.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => setColorHex(c.hex)}
                      className={`p-2 rounded-xl border flex items-center gap-2 text-left transition ${
                        colorHex === c.hex ? 'border-blue-600 ring-2 ring-blue-500 shadow-xs' : 'border-slate-200'
                      }`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-slate-300 shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {c.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PRESETS */}
          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 mb-2">
                {isBn 
                  ? 'দ্রুত শুরু করতে জনপ্রিয় ক্লাব অথবা খেলোয়াড়ের স্টাইল নির্বাচন করুন:' 
                  : 'Select an iconic club template to jumpstart your design:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.name}
                    onClick={() => handleLoadPreset(p)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition text-left group flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {p.playerName} #{p.playerNumber} • {p.sponsorText}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
