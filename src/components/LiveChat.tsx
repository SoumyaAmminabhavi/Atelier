import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import { Close, Send } from './Icons';
import { cn } from '../lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are Aria, an elegant and warm luxury beauty consultant for Atelier — a premium Indian skincare brand. You speak in a refined yet approachable tone. Keep responses concise (2-4 sentences max). You help customers with:
- Product recommendations (Atelier's range includes serums, night elixirs, rose-based products, moisturizers, and curated ritual kits)
- Skincare routines and tips
- Order tracking and shipping queries (standard domestic: 3-5 days free over ₹12,000; priority express: next day for ₹2,000)
- Returns policy (30-day window, free return labels, direct exchanges for damaged items)
- General beauty advice

Prices are in ₹ (INR). Always be helpful, luxurious in tone, and recommend Atelier products naturally where appropriate. Use occasional elegant emoji like ✨ or 🌹 sparingly.`;

const WELCOME_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    role: 'assistant',
    content: "Welcome to Atelier ✨ I'm Aria, your personal beauty consultant. How may I assist you today?",
    timestamp: new Date(),
  },
];

const QUICK_REPLIES = [
  "Help me build a routine",
  "Track my order",
  "Product recommendations",
  "Return an item",
];

// --- Smart Fallback Response Engine ---
// Provides helpful, contextual responses when the AI API is unavailable

interface FallbackRule {
  keywords: string[];
  response: string;
}

const FALLBACK_RESPONSES: FallbackRule[] = [
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'namaste'],
    response: "Hello and welcome to Atelier! ✨ I'm Aria, your beauty consultant. I'd love to help you with skincare recommendations, order tracking, returns, or building your perfect routine. What can I help you with today?",
  },
  // Skincare routine
  {
    keywords: ['routine', 'regimen', 'daily', 'morning routine', 'night routine', 'evening routine', 'skincare steps', 'build a routine', 'start routine'],
    response: "I'd love to help you craft the perfect ritual! ✨ Here's our recommended Atelier routine:\n\n🌅 Morning: Gentle cleanser → L'Essence de Rose Serum → Hydra-Glow Moisturizer → SPF\n\n🌙 Evening: Double cleanse → The Night Elixir → Rose-Petal Eye Cream\n\nFor a curated set, our Complete Beauty Ritual Kit (₹24,999 — 25% off) includes everything you need. Would you like to know more about any specific step?",
  },
  // Product recommendations
  {
    keywords: ['recommend', 'suggestion', 'which product', 'best product', 'what should i', 'product for', 'what do you suggest'],
    response: "Great question! Here are our most-loved products ✨\n\n🌹 The Night Elixir (₹6,900) — Our #1 bestseller for overnight repair\n💧 Hydra-Glow Moisturizer (₹4,500) — Deep hydration for all skin types\n✨ L'Essence de Rose Serum (₹8,200) — Brightening & anti-aging\n🎁 Complete Beauty Ritual Kit (₹24,999) — Full routine at 25% off\n\nWould you like me to recommend something specific for your skin concern?",
  },
  // Dry skin
  {
    keywords: ['dry skin', 'dryness', 'flaky', 'dehydrated', 'moisturize', 'moisture'],
    response: "For dry or dehydrated skin, I recommend our deeply nourishing duo 💧\n\n• Hydra-Glow Moisturizer (₹4,500) — Locks in moisture for up to 72 hours with hyaluronic acid\n• The Night Elixir (₹6,900) — Intensive overnight restoration so you wake up to plump, soft skin\n\nTip: Apply the serum on damp skin right after cleansing for maximum absorption ✨",
  },
  // Oily / acne skin
  {
    keywords: ['oily', 'acne', 'pimple', 'breakout', 'pores', 'greasy', 'blemish'],
    response: "For oily or acne-prone skin, balance is key ✨\n\n• L'Essence de Rose Serum (₹8,200) — Lightweight, non-comedogenic formula that controls excess oil while brightening\n• Our gel-based moisturizer provides hydration without clogging pores\n\nTip: Avoid skipping moisturizer — dehydrated skin actually produces more oil. A light, water-based formula works beautifully 🌹",
  },
  // Anti-aging
  {
    keywords: ['aging', 'anti-age', 'wrinkle', 'fine lines', 'mature skin', 'age', 'anti aging', 'younger'],
    response: "Our anti-aging collection is formulated with powerful yet gentle actives ✨\n\n• The Night Elixir (₹6,900) — Retinol-infused overnight repair that reduces fine lines\n• L'Essence de Rose Serum (₹8,200) — Vitamin C + rose extracts for firmer, brighter skin\n• Rose-Petal Eye Cream — Targets crow's feet and dark circles\n\n93% of our clients noticed visible improvement within 4 weeks 🌹",
  },
  // Glow / brightening
  {
    keywords: ['glow', 'bright', 'radiant', 'dull', 'dark spot', 'pigmentation', 'uneven', 'lighten', 'luminous'],
    response: "For that coveted Atelier glow ✨\n\n• L'Essence de Rose Serum (₹8,200) — Our star brightening serum with Vitamin C and rose extracts\n• Pair it with our Hydra-Glow Moisturizer for all-day radiance\n\nPro tip: Use the serum every morning under SPF for best results. Most clients see a noticeable glow within 2 weeks 🌹",
  },
  // Order tracking
  {
    keywords: ['track', 'order', 'where is', 'shipping status', 'delivery status', 'my order', 'when will', 'order status'],
    response: "I'd be happy to help you track your order! 📦\n\nTo check your order status:\n1. Visit your Profile → Order History\n2. Or share your order number here and I'll look it up\n\nStandard orders arrive in 3-5 business days, and Priority Express orders arrive next day if placed before 12 PM IST.\n\nIf you need immediate assistance, you can also email us at support@atelier.in with your order number 🌹",
  },
  // Shipping
  {
    keywords: ['shipping', 'delivery', 'ship', 'deliver', 'how long', 'dispatch', 'courier', 'free shipping'],
    response: "Here are our shipping options 📦\n\n🚚 Standard Domestic — 3 to 5 business days\n   • FREE on all orders over ₹12,000\n   • ₹500 flat rate for orders under ₹12,000\n\n⚡ Priority Express — Next day arrival\n   • ₹2,000 flat rate\n   • Order must be placed before 12 PM IST\n\nAll orders are carefully packaged in our signature luxury boxes. Would you like to place an order?",
  },
  // Returns
  {
    keywords: ['return', 'refund', 'exchange', 'send back', 'return policy', 'money back', 'damaged'],
    response: "We want you to be completely happy with your purchase! Here's our returns policy 📋\n\n✅ 30-day return window for unused items in original packaging\n🏷️ Free return shipping labels — download from your account\n🔄 Direct exchanges for any item damaged during transit\n💰 Refunds processed within 5-7 business days\n\nTo start a return, visit Profile → Orders → Select item → Request Return. Need help with a specific return?",
  },
  // Pricing
  {
    keywords: ['price', 'cost', 'how much', 'expensive', 'affordable', 'discount', 'offer', 'sale', 'coupon', 'promo'],
    response: "Here's our current pricing ✨\n\n🌹 The Night Elixir — ₹6,900\n💧 Hydra-Glow Moisturizer — ₹4,500\n✨ L'Essence de Rose Serum — ₹8,200\n👁️ Rose-Petal Eye Cream — ₹3,800\n🎁 Complete Beauty Ritual Kit — ₹24,999 (25% off, saves ₹8,300!)\n\n💳 Free shipping on orders over ₹12,000. Check our Shop page for exclusive limited-time offers!",
  },
  // Ingredients
  {
    keywords: ['ingredient', 'natural', 'chemical', 'paraben', 'cruelty', 'vegan', 'organic', 'what\'s in', 'made of', 'contain'],
    response: "Quality ingredients are the heart of Atelier 🌿\n\n• All products are cruelty-free and never tested on animals\n• We use premium, globally-sourced natural ingredients\n• Free from parabens, sulfates, and harmful chemicals\n• Eco-conscious, sustainable packaging\n\nKey actives include: Damask Rose extract, Hyaluronic Acid, Vitamin C, Retinol, and Niacinamide. Would you like details about a specific product's ingredients?",
  },
  // Sensitive skin
  {
    keywords: ['sensitive', 'irritation', 'redness', 'rash', 'allergy', 'gentle', 'calm'],
    response: "We understand sensitive skin needs extra care 🌸\n\n• All Atelier products are dermatologically tested\n• Our Hydra-Glow Moisturizer is especially gentle — fragrance-free formula with soothing ingredients\n• We recommend doing a patch test on your inner wrist 24 hours before first use\n\nTip: Start with one new product at a time so you can see how your skin responds. If you experience any irritation, please reach out and we'll help find alternatives ✨",
  },
  // Payment
  {
    keywords: ['payment', 'pay', 'card', 'upi', 'cod', 'cash on delivery', 'emi', 'wallet'],
    response: "We offer multiple secure payment options 💳\n\n• Credit / Debit Cards (Visa, Mastercard, RuPay)\n• UPI (Google Pay, PhonePe, Paytm)\n• Net Banking\n• Apple Pay\n• EMI available on orders above ₹5,000\n\nAll payments are encrypted and secure 🔒. You can proceed to checkout from your cart anytime!",
  },
  // Gift
  {
    keywords: ['gift', 'present', 'birthday', 'anniversary', 'surprise', 'gifting'],
    response: "Atelier makes the perfect gift for someone special! 🎁\n\n• Our Complete Beauty Ritual Kit (₹24,999) comes in a luxury gift box\n• We offer complimentary gift wrapping on all orders\n• Add a personalized note at checkout\n\nFor curated gift sets and limited editions, visit our Shop → Limited Edition Rituals section. Would you like suggestions based on your recipient's skin type?",
  },
  // Contact / help
  {
    keywords: ['contact', 'support', 'email', 'call', 'phone', 'help', 'speak to', 'talk to', 'human', 'agent', 'customer service'],
    response: "I'm here to help, and you can also reach our team directly 🌹\n\n📧 Email: support@atelier.in (24-hour response)\n📞 Phone: +91 1800-ATELIER (toll-free, 24/7)\n💬 You're already in our live chat!\n\nFor order-specific queries, please have your order number ready. Is there anything specific I can assist with right now?",
  },
  // Thank you / bye
  {
    keywords: ['thank', 'thanks', 'bye', 'goodbye', 'see you', 'take care', 'appreciate'],
    response: "You're most welcome! It was a pleasure assisting you ✨ Remember, I'm always here whenever you need beauty guidance or help with your orders. Wishing you a radiant day! 🌹",
  },
  // What can you do
  {
    keywords: ['what can you do', 'what do you do', 'how can you help', 'features', 'who are you', 'tell me about yourself', 'introduce yourself'],
    response: "I'm Aria, your personal Atelier beauty consultant! ✨ Here's what I can help you with:\n\n🌹 Build a personalized skincare routine\n💄 Recommend products for your skin type & concerns\n📦 Track your orders & check delivery status\n🔄 Guide you through returns & exchanges\n💰 Share pricing & current offers\n🧴 Explain our ingredients & formulations\n\nJust ask me anything — I'm here for you!",
  },
];

function getSmartFallback(userText: string): string {
  const lower = userText.toLowerCase();

  // Try to match against fallback rules — score by number of distinct keyword hits,
  // with multi-word phrases weighted higher for specificity
  let bestMatch: FallbackRule | null = null;
  let bestScore = 0;

  for (const rule of FALLBACK_RESPONSES) {
    let score = 0;
    for (const keyword of rule.keywords) {
      if (lower.includes(keyword)) {
        // Multi-word phrases are more specific and worth more
        const wordCount = keyword.split(' ').length;
        score += wordCount * 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule;
    }
  }

  if (bestMatch && bestScore > 0) {
    return bestMatch.response;
  }

  // General fallback — still helpful, not an error message
  return "Thank you for your question! ✨ Here's what I can help you with:\n\n🌹 Skincare routines — just say \"build a routine\"\n💄 Product recommendations — ask about any skin concern\n📦 Order tracking — share your order number\n🔄 Returns & exchanges — I'll walk you through it\n💰 Pricing & offers — ask about any product\n\nYou can also visit our Shop page to explore our full collection, or type your specific question and I'll do my best to assist!";
}

interface LiveChatProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveChat: React.FC<LiveChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(WELCOME_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatHistoryRef = useRef<{ role: string; parts: { text: string }[] }[]>([]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setError(null);

    // Build conversation history for context
    chatHistoryRef.current.push({
      role: 'user',
      parts: [{ text: text.trim() }],
    });

    // Add a small delay so the typing indicator feels natural
    const typingDelay = () => new Promise<void>(r => setTimeout(r, 600 + Math.random() * 800));

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

      const contents = [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: "Understood. I am Aria, Atelier's luxury beauty consultant. I'm ready to assist with elegance and warmth." }] },
        ...chatHistoryRef.current,
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents,
      });

      const assistantText =
        response.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, I'm momentarily unavailable. Please try again in a moment.";

      chatHistoryRef.current.push({
        role: 'model',
        parts: [{ text: assistantText }],
      });

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantText,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      console.error('Chat error:', err);

      // Use smart contextual fallback instead of a generic error
      await typingDelay();
      const fallbackText = getSmartFallback(text);

      chatHistoryRef.current.push({
        role: 'model',
        parts: [{ text: fallbackText }],
      });

      const fallback: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: fallbackText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallback]);
      setError(null);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickReply = (text: string) => {
    sendMessage(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />

          {/* Chat Panel */}
          <motion.div
            initial={{ opacity: 0, y: '100%', scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: '100%', scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 350 }}
            className="fixed bottom-0 left-0 right-0 sm:bottom-6 sm:right-6 sm:left-auto sm:w-[420px] z-[70] flex flex-col max-h-[85vh] sm:max-h-[680px] sm:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl shadow-black/30 border border-outline-variant/20"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-primary-container px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-lg border border-white/30">
                    ✨
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-primary" />
                </div>
                <div>
                  <h3 className="text-on-primary font-headline text-base tracking-wide">
                    Aria
                  </h3>
                  <p className="text-on-primary/70 text-[10px] font-label uppercase tracking-[0.15em]">
                    Beauty Consultant · Online
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-on-primary hover:bg-white/25 transition-colors border border-white/20"
              >
                <Close className="text-lg" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-surface px-4 py-5 space-y-4 no-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: idx === 0 ? 0 : 0.05 }}
                  className={cn(
                    'flex gap-2.5 max-w-[88%]',
                    msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  )}
                >
                  {/* Avatar */}
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-xs shrink-0 mt-1 border border-primary-container">
                      ✨
                    </div>
                  )}

                  <div className="flex flex-col gap-1">
                    <div
                      className={cn(
                        'px-4 py-3 text-sm leading-relaxed',
                        msg.role === 'user'
                          ? 'bg-primary text-on-primary rounded-2xl rounded-br-md shadow-md shadow-primary/15'
                          : 'bg-surface-container-lowest text-on-surface rounded-2xl rounded-bl-md shadow-sm border border-outline-variant/10'
                      )}
                    >
                      {msg.content}
                    </div>
                    <span
                      className={cn(
                        'text-[9px] text-outline px-1 font-label tracking-wider',
                        msg.role === 'user' ? 'text-right' : 'text-left'
                      )}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="flex gap-2.5 max-w-[88%] mr-auto"
                  >
                    <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center text-xs shrink-0 mt-1 border border-primary-container">
                      ✨
                    </div>
                    <div className="bg-surface-container-lowest px-5 py-4 rounded-2xl rounded-bl-md shadow-sm border border-outline-variant/10">
                      <div className="flex gap-1.5 items-center">
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 1 && !isTyping && (
              <div className="bg-surface border-t border-outline-variant/10 px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply) => (
                    <motion.button
                      key={reply}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleQuickReply(reply)}
                      className="bg-primary-fixed/30 text-primary px-4 py-2 rounded-full text-[11px] font-label uppercase tracking-wider border border-primary-container/30 hover:bg-primary-fixed/50 transition-colors"
                    >
                      {reply}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="bg-surface-container-lowest px-4 py-4 border-t border-outline-variant/10 shrink-0"
            >
              <div className="flex items-center gap-2 bg-surface-container rounded-full pl-5 pr-2 py-1.5">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isTyping}
                  className="flex-1 bg-transparent text-sm text-on-surface placeholder:text-outline/50 focus:outline-none font-body disabled:opacity-50"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'w-9 h-9 rounded-full flex items-center justify-center transition-all',
                    input.trim() && !isTyping
                      ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                      : 'bg-outline-variant/20 text-outline'
                  )}
                >
                  <Send className="text-base" />
                </motion.button>
              </div>
              <p className="text-center text-[9px] text-outline/50 mt-2 font-label tracking-wider">
                Powered by AI · Atelier Beauty
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/* Floating Chat Bubble — renders on every page */
export const LiveChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-xl shadow-primary/30 flex items-center justify-center hover:shadow-2xl hover:shadow-primary/40 transition-shadow"
            id="live-chat-bubble"
          >
            <span className="material-symbols-outlined text-2xl fill-current">chat</span>
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-30" />
          </motion.button>
        )}
      </AnimatePresence>

      <LiveChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

/* Export a hook-like helper so the Concierge page can open the chat */
let globalOpenChat: (() => void) | null = null;

export const LiveChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    globalOpenChat = () => setIsOpen(true);
    return () => { globalOpenChat = null; };
  }, []);

  return (
    <>
      {children}

      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-5 sm:bottom-8 sm:right-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-xl shadow-primary/30 flex items-center justify-center hover:shadow-2xl hover:shadow-primary/40 transition-shadow"
            id="live-chat-bubble"
          >
            <span className="material-symbols-outlined text-2xl fill-current">chat</span>
            <span className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-30 pointer-events-none" />
          </motion.button>
        )}
      </AnimatePresence>

      <LiveChat isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export const openLiveChat = () => {
  if (globalOpenChat) globalOpenChat();
};
