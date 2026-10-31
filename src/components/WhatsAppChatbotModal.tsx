import React, { useState, useRef, useEffect } from 'react';
import { 
  X, Send, Phone, MessageCircle, CheckCheck, 
  ExternalLink, Sparkles, ShieldCheck, User, Bot, Clock
} from 'lucide-react';
import { STORE_CONFIG } from '../data/mockData';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

interface WhatsAppChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: any) => void;
  language?: 'bn' | 'en';
}

const QUICK_PROMPTS = [
  'আমি একটি ফুটবল জার্সি অর্ডার করতে চাই',
  'কাস্টম জার্সির দাম ও প্রিন্টিং কত পড়বে?',
  'ধানমন্ডি ঢাকা থেকে ডেলিভারি কতদিন লাগবে?',
  'বিকাশ বা নগদে পেমেন্ট করব কীভাবে?',
  'আমার অর্ডার ট্র্যাক করব কীভাবে?'
];

export const WhatsAppChatbotModal: React.FC<WhatsAppChatbotModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  language = 'bn',
}) => {
  if (!isOpen) return null;

  const isBn = language === 'bn';
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'bot',
      text: `আসসালামু আলাইকুম! রনি ফ্যাশন হাউস (Rony Fashion House), ধানমন্ডি, ঢাকা এর অফিসিয়াল এআই সহকারী হিসেবে আপনাকে স্বাগতম। আমি কীভাবে আপনাকে সাহায্য করতে পারি?`,
      time: 'Just now'
    },
    {
      id: 'm-2',
      sender: 'bot',
      text: `হটলাইন ও হোয়াটসঅ্যাপ: 01603319739\nঅফিসিয়াল জিমেইল: habiburkhanrony3@gmail.com\nঠিকানা: ধানমন্ডি, ঢাকা। যেকোনো প্রশ্ন টাইপ করুন বা নিচের অপশন নির্বাচন করুন:`,
      time: 'Just now'
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // Instant AI reply logic (simulating 150ms instant response)
    setTimeout(() => {
      let botResponse = '';
      const q = text.toLowerCase();

      if (q.includes('অর্ডার') || q.includes('order') || q.includes('কিনতে')) {
        botResponse = `ধন্যবাদ! আপনি যেকোনো জার্সি সাইজ (M, L, XL, XXL) নির্বাচন করে 'এখনই কিনুন' বাটনে ক্লিক করে অর্ডার কনফার্ম করতে পারেন। এছাড়া ধানমন্ডি সেন্ট্রাল হাব থেকে সারা দেশে ক্যাশ অন ডেলিভারি সুবিধা আছে।\nসরাসরি কথা বলতে কল করুন: 01603319739।`;
      } else if (q.includes('কাস্টম') || q.includes('custom') || q.includes('নাম') || q.includes('দাম')) {
        botResponse = `আমাদের কাস্টম জার্সি স্টুডিওতে আপনি যেকোনো ক্লাবের জার্সিতে নিজের নাম, প্রিয় স্কোয়াড নম্বর এবং লোগো বসিয়ে মাত্র ৫৫০৳ টাকায় অর্ডার করতে পারবেন! সাথে পাচ্ছেন লাইভ ইমেজ ফিল্টার সুবিধা।`;
      } else if (q.includes('ডেলিভারি') || q.includes('delivery') || q.includes('ধানমন্ডি') || q.includes('ঢাকা') || q.includes('সময়')) {
        botResponse = `আমাদের সেন্ট্রাল হাব ধানমন্ডি, ঢাকা থেকে:\n• ঢাকার ভেতরে: ১-২ কর্মদিবস (চার্জ ৬০৳)\n• ঢাকার বাইরে সমগ্র বাংলাদেশ: ২-৩ কর্মদিবস (চার্জ ১২০৳)\n১৫০০৳ টাকার উপরে অর্ডারে ডেলিভারি সম্পূর্ণ ফ্রি!`;
      } else if (q.includes('বিকাশ') || q.includes('bkash') || q.includes('নগদ') || q.includes('nagad') || q.includes('পেমেন্ট')) {
        botResponse = `বিকাশ এবং নগদ সেন্ড মানি নম্বর: 01603319739 (Personal)।\nপেমেন্ট সম্পন্ন করার পর TrxID চেকআউট ফর্মে লিখে সাবমিট করলেই ১ms এর মধ্যে অর্ডার ভেরিফাইড হয়ে যাবে। এছাড়া ক্যাশ অন ডেলিভারিও উপলব্ধ।`;
      } else if (q.includes('ট্র্যাক') || q.includes('track') || q.includes('অবস্থান')) {
        botResponse = `আপনার অর্ডার কোড (যেমন: RFH-982417) অথবা অর্ডার করার ফোন নম্বরটি ওয়েবসাইটে 'অর্ডার ট্র্যাক' ট্যাবে দিলে লাইভ কুরিয়ার স্ট্যাটাস ও রুট ম্যাপ দেখতে পাবেন।`;
      } else {
        botResponse = `আপনার বার্তার জন্য ধন্যবাদ! রনি ফ্যাশন হাউসের স্বত্বাধিকারী হাবিবুর খান রনি এর টিম আপনার পাশে আছে। বিস্তারিত জানতে সরাসরি হোয়াটসঅ্যাপে কল বা মেসেজ দিন: 01603319739 নম্বরে।`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[580px] border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* WHATSAPP GREEN HEADER */}
        <div className="bg-[#075E54] text-white px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            {/* Owner Avatar with Online Dot */}
            <div className="relative w-10 h-10 rounded-full border-2 border-white/60 overflow-hidden bg-slate-900 shrink-0">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80"
                alt="Habibur Khan Rony"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#075E54]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-bold text-sm leading-tight">
                <span>Rony Fashion House AI</span>
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 text-slate-950 text-[9px] flex items-center justify-center font-black">
                  ✓
                </span>
              </div>
              <div className="text-[11px] text-emerald-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                <span>Online • 01603319739 (ধানমন্ডি, ঢাকা)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <a
              href={`tel:${STORE_CONFIG.hotline}`}
              className="p-2 rounded-full hover:bg-white/10 text-white transition"
              title="Call 01603319739"
            >
              <Phone className="w-4 h-4" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-white transition"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* EXTERNAL WHATSAPP APP TRIGGER BANNER */}
        <div className="bg-[#128C7E] px-4 py-2 text-white flex items-center justify-between text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-200" />
            <span>সরাসরি হোয়াটসঅ্যাপ অ্যাপে চ্যাট করতে চান?</span>
          </div>
          <a
            href={STORE_CONFIG.whatsAppLink}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-[#075E54] hover:bg-emerald-50 px-2.5 py-1 rounded-lg font-black text-[11px] flex items-center gap-1 transition shadow-xs"
          >
            <span>Open WhatsApp</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* CHAT MESSAGES BODY */}
        <div className="flex-1 bg-[#ECE5DD] p-4 overflow-y-auto space-y-3 bg-[radial-gradient(#d4ccc3_1px,transparent_1px)] [background-size:16px_16px]">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex flex-col ${
                m.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-xs whitespace-pre-line ${
                  m.sender === 'user'
                    ? 'bg-[#DCF8C6] text-slate-900 rounded-tr-none'
                    : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/50'
                }`}
              >
                {m.text}
                <div
                  className={`text-[9px] mt-1 text-right flex items-center justify-end gap-1 ${
                    m.sender === 'user' ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                >
                  <span>{m.time}</span>
                  {m.sender === 'user' && <CheckCheck className="w-3 h-3 text-blue-500" />}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-1.5 bg-white text-slate-500 px-3 py-2 rounded-2xl rounded-tl-none text-xs w-28 shadow-xs border border-slate-100">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="text-[10px] ml-1">Typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* QUICK SUGGESTION PROMPTS */}
        <div className="bg-slate-50 px-3 py-2 border-t border-slate-200 overflow-x-auto no-scrollbar flex gap-1.5">
          {QUICK_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(p)}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200 text-slate-700 rounded-full text-[10px] font-bold whitespace-nowrap transition shadow-2xs"
            >
              {p}
            </button>
          ))}
        </div>

        {/* CHAT INPUT FORM */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="মেসেজ লিখুন (যেমন: জার্সি অর্ডার, সাইজ, ডেলিভারি)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-3.5 py-2.5 rounded-full border border-slate-300 text-xs focus:ring-2 focus:ring-[#075E54] focus:outline-hidden bg-slate-50"
          />
          <button
            type="submit"
            className="w-10 h-10 rounded-full bg-[#075E54] hover:bg-[#128C7E] text-white flex items-center justify-center transition shadow-md active:scale-95 shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
