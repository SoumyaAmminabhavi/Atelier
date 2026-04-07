import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { auth, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from './lib/authMock';
import { CartProvider, useCart } from './CartContext';
import { PRODUCTS } from './constants';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { ShopScreen, CartScreen } from './ShopScreens';
import { ProfileScreen } from './ProfileScreens';
import { SignInPage, SignUpPage, SignOutPage } from './AuthPages';

import { ConciergeScreen, CheckoutScreen } from './ConciergeScreens';
import { LiveChatProvider } from './components/LiveChat';
import { 
  Menu, 
  ShoppingBag, 
  Home as HomeIcon, 
  BrandAwareness, 
  Person, 
  ArrowBack, 
  ArrowForward, 
  Remove, 
  Add, 
  Apple, 
  CreditCard, 
  Lock, 
  East, 
  FormatQuote, 
  PlayArrow, 
  Spa, 
  Fingerprint, 
  Mail,
  AutoAwesome,
  AddCircle
} from './components/Icons';

// --- Components ---

const TopAppBar = () => {
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_40px_0px_0px_rgba(26,28,26,0.04)]">
      <div className="flex justify-between items-center px-6 sm:px-8 h-20 max-w-full">
        <button 
          onClick={() => isHome ? null : navigate(-1)}
          className="text-primary hover:opacity-70 transition-opacity"
        >
          {isHome ? <Menu className="text-2xl" /> : <ArrowBack className="text-2xl" />}
        </button>
        <Link to="/" className="text-2xl font-serif tracking-[0.2em] uppercase text-primary">ATELIER</Link>
        <Link to="/cart" className="text-primary hover:opacity-70 transition-opacity relative">
          <ShoppingBag className="text-2xl" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-on-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

const BottomNavBar = () => {
  const location = useLocation();
  const navItems = [
    { path: '/', label: 'HOME', icon: HomeIcon },
    { path: '/shop', label: 'SHOP', icon: BrandAwareness },
    { path: '/profile', label: 'PROFILE', icon: Person },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center pt-4 pb-8 px-6 sm:px-10 bg-surface/90 backdrop-blur-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[2rem] z-50 max-w-full">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        const Icon = item.icon;
        return (
          <Link 
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-500 ease-out",
              isActive ? "text-primary font-bold" : "text-stone-400 hover:text-primary"
            )}
          >
            <Icon className={cn("text-2xl mb-1", isActive && "fill-current")} />
            <span className="font-sans text-[10px] tracking-[0.1em] uppercase">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

// --- Screens ---

const HomeScreen = () => {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
      return;
    }

    setNewsletterStatus('loading');
    try {
      // Simulate API call - in production, this would save to Firestore
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNewsletterStatus('success');
      setEmail('');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    } catch (err) {
      setNewsletterStatus('error');
      setTimeout(() => setNewsletterStatus('idle'), 3000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-16 pb-32"
    >
      {/* Hero Section */}
      <section className="relative min-h-[420px] flex items-end px-6 sm:px-8 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-7CpqOCmArML3T4k7HtLeHCoVCtaNG8GiFG-xSTNRosfR2KpkzYkwI9EnS-nC_gvjFkf2Dt2VEzX-dAA6DQbCbEV0NMUUl-WqCv6ln-Kz9qIlH-1N91DiYc0KUNVGVDbVjhpaKwHZdEYW4br_Bns-JN7MInXfa3v9YcTnp_OFmLPxZsl9E7uS3QUluWxnga_Qmnxelt8Bct8_QL7qNZUPq7GpubVlt5mG3cumCXFYMyXhrlHUb8iHhwaPtWrhkabSBaONA8OaivE" 
            alt="Radiant skin"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
        </div>
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-0">
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-label text-[10px] tracking-[0.3em] uppercase text-primary mb-6 letter-spacing-wide"
          >
            L'essence de la Mer
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-headline text-6xl sm:text-7xl leading-[1.1] mb-10 tracking-tight max-w-2xl font-light"
          >
            Skin that breathes <span className="italic">light.</span>
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/shop" className="inline-block bg-gradient-to-r from-primary to-primary-container text-on-primary px-12 py-5 rounded-full font-label text-xs tracking-widest uppercase shadow-2xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105">
              Discover Collection
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="px-6 sm:px-8 py-16 max-w-6xl mx-auto">
        {/* Section Badge */}
        <div className="mb-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
          <span className="font-label text-[11px] uppercase tracking-widest text-primary/60 whitespace-nowrap px-4">Featured Collections</span>
          <div className="h-px flex-1 bg-gradient-to-l from-transparent via-primary/20 to-transparent"></div>
        </div>

        <div className="grid grid-cols-6 grid-rows-2 gap-6">
          <div className="col-span-4 bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-2xl p-8 flex flex-col justify-between aspect-[3/2] shadow-lg shadow-black/5 border border-outline-variant/10 hover:shadow-xl transition-all group overflow-hidden relative">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-0"></div>
            <div className="relative z-10">
              <span className="inline-block font-label text-[9px] uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-full mb-4 font-semibold">Most Loved</span>
              <h3 className="font-headline text-3xl mb-3">The Night Elixir</h3>
              <p className="text-on-surface-variant text-base font-light">Wake up to restoration.</p>
            </div>
            <div className="flex items-center justify-between relative z-10">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaTs0-jse4UzVkRUWG7k-k1c9z1N6zhPLVV3CzFR0J8J6GNZMVY4bNGsuqQfMp_ie5-k4wMmBYz2LkV8WhRqCrbLfKZDHX89LS9XGlTVf2UfAuREx3iTl5HehK58KUFL2rXE5A5akIAYo1TGQALBEMoTmVrGmtavT5xxqJ2LgN3oWSl6rPUnFTKZ39UmMbIzGzbqeXRb7giSRRQ6xnRfD7IrIzpK4h3cg5Gh88jyGsNWfalc5S7451A_1HpAFvAS4B4VBoykLfXOM" 
                alt="Night Elixir"
                className="w-28 h-28 object-contain mt-6 group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="text-right bg-white/50 backdrop-blur px-4 py-3 rounded-xl">
                <p className="font-label text-[10px] uppercase tracking-widest text-primary mb-1">From</p>
                <p className="font-headline text-xl text-primary">₹6,900</p>
              </div>
            </div>
          </div>
          <Link to="/shop?filter=new" className="col-span-2 bg-gradient-to-br from-primary-fixed via-primary-fixed to-primary-container rounded-2xl p-6 aspect-[2/3] flex flex-col items-center justify-center text-center shadow-lg shadow-primary/20 border border-primary-container/30 hover:shadow-xl transition-all group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <AutoAwesome className="text-primary text-6xl mb-4 fill-current group-hover:scale-110 transition-transform" />
              <p className="font-label text-[11px] uppercase tracking-wider text-on-primary-fixed-variant font-semibold">New Arrivals</p>
              <p className="font-label text-[9px] uppercase tracking-wider text-on-primary-fixed-variant/70 mt-2">Exclusive</p>
            </div>
          </Link>
          <div className="col-span-2 bg-surface-container-high rounded-2xl aspect-[2/3] overflow-hidden shadow-lg shadow-black/5 border border-outline-variant/10 hover:shadow-xl transition-all relative group">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTvmSsa-dL0kFCcYKJ_7gO__sLRUPdolWGbk-y5MHY0xtwUqURgk8bmnStsWI0deR5T7UeOM7YYsK3fNA3AOCJpGww5BD0DF4-dhv9X0sH7rWMy21EzYSW1Q7OA5l2msTFYTnBLj1As-y7kVwCOCAhWzu3XYmLnQlHkuSr9btqG8WiGSokTDow1JNXGwoMF0dkuQpoiGGYme_Bf4-Kqwq-8QgP9xa_4VHquXDwLVu6Ne5BvJuf6IqYvRPYSxIR14ntBkJpkg5M2Zs" 
              alt="Cream texture"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/30 to-transparent p-4">
              <span className="inline-block font-label text-[9px] uppercase tracking-widest text-white bg-white/20 backdrop-blur px-3 py-1 rounded-full font-semibold">Premium</span>
            </div>
          </div>
          <Link to="/shop?filter=limited" className="col-span-4 bg-gradient-to-r from-surface-container-lowest to-surface-container-low rounded-2xl p-8 flex items-center justify-between gap-8 shadow-lg shadow-black/5 border border-outline-variant/10 hover:shadow-xl transition-all group cursor-pointer relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="flex-1 relative z-10">
              <span className="inline-block font-label text-[9px] uppercase tracking-widest text-primary/70 mb-2">🎁 Limited Time</span>
              <p className="font-headline text-2xl">Limited Edition Rituals</p>
              <p className="text-sm text-primary uppercase tracking-widest mt-3 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-2">✓ Curated Sets <span className="text-xs">for you</span></p>
            </div>
            <div className="w-20 h-20 bg-primary/10 flex items-center justify-center rounded-full group-hover:bg-primary group-hover:text-white transition-all relative z-10">
              <ArrowForward className="text-2xl text-primary group-hover:text-white" />
            </div>
          </Link>
        </div>
      </section>

      {/* Classics Section */}
      <section className="py-20 bg-surface-container-low relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0"></div>
        <div className="px-6 sm:px-8 mb-12 flex justify-between items-end max-w-6xl mx-auto">
          <div>
            <h2 className="font-headline text-4xl">The Classics</h2>
            <p className="text-base font-light text-on-surface-variant mt-2">⭐ Time-tested beauty staples.</p>
          </div>
          <Link to="/shop" className="font-label text-[11px] uppercase tracking-widest text-primary border-b-2 border-primary pb-2 font-semibold hover:opacity-70 transition-opacity">View All</Link>
        </div>
        <div className="flex overflow-x-auto no-scrollbar gap-6 px-6 sm:px-8 snap-x ml-auto mr-auto max-w-6xl pb-4">
          {PRODUCTS.filter(p => p.isSignature).map(product => (
            <div key={product.id} className="min-w-[280px] snap-center group">
              <div className="bg-surface-container-lowest rounded-2xl p-5 mb-5 relative aspect-[3/4] flex items-center justify-center overflow-hidden shadow-lg shadow-black/5 border border-outline-variant/10 hover:shadow-xl transition-all">
                <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md z-10">
                  <p className="font-label text-[8px] uppercase tracking-widest text-primary font-semibold">⭐ Signature</p>
                </div>
                <div className="absolute top-4 right-4 bg-primary/10 backdrop-blur px-2 py-1 rounded-full shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="font-label text-[8px] uppercase tracking-widest text-primary font-bold">★★★★★</p>
                </div>
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="px-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-headline text-lg leading-snug flex-1">{product.name}</h4>
                  <div className="text-primary text-xs font-semibold">Best</div>
                </div>
                <p className="text-sm font-light text-on-surface-variant mt-2">{product.description}</p>
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-outline-variant/10">
                  <p className="font-body text-lg font-semibold text-primary">₹{product.price.toLocaleString('en-IN')}</p>
                  <span className="text-xs font-label uppercase tracking-widest text-primary/60">Stock: In</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-6 sm:px-8 text-center bg-surface">
        <div className="max-w-4xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <FormatQuote className="text-primary-container text-7xl opacity-30 fill-current mx-auto mb-6" />
          </motion.div>
          <h3 className="font-headline text-4xl sm:text-5xl italic leading-relaxed mt-4 text-on-surface">
            Beauty is an <span className="font-bold non-italic text-primary">art</span> of patience, crafted in the quietest moments of self-care.
          </h3>
          <p className="font-label text-[11px] tracking-[0.4em] uppercase mt-10 text-primary font-semibold letter-spacing-wide">The Atelier Philosophy</p>
        </div>
        <div className="relative w-full aspect-[16/9] max-h-80 rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 mx-auto max-w-4xl border border-outline-variant/20">
          <img 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0qCPr811HgKDFHte1eU9I96fc3VohRJ5UInsX8kTzpet_QFB_XfJE5FOqB8cNqXaYsGxJtC0lbsWCacbpkj32Haa0Sa188uOugSY8bYDri9XwOZV6Qu-2mlWf6X9aDofvhlAQwiNegSG4vV6U1CNKtO_PRCUU3YYXdAOwhuk-LQ-i0orBCijynpF8uv_VXrkZfmfdWV0hYu-7TYmHvLMaRhaeBn4OUi1tqd2UqoVAlo2W9iIuvIxGHRc4Cucw0X7a2Qo9c5G6Bz4" 
            alt="Spa setup"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm hover:bg-black/10 transition-colors">
            <motion.div 
              whileHover={{ scale: 1.15 }}
              className="w-20 h-20 rounded-full bg-white/25 backdrop-blur-xl flex items-center justify-center text-white border-2 border-white/50 cursor-pointer"
            >
              <PlayArrow className="text-4xl ml-1.5 fill-current" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Shop by Concern */}
      <section className="py-20 px-6 sm:px-8 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl mb-3">Shop by Concern</h2>
            <p className="text-on-surface-variant font-light">Find your perfect match</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'hydration', icon: "💧", label: "Hydration", color: "from-blue-100 to-cyan-100" },
              { id: 'glow', icon: "✨", label: "Glow", color: "from-yellow-100 to-orange-100" },
              { id: 'anti-age', icon: "🌿", label: "Anti-Age", color: "from-green-100 to-emerald-100" },
              { id: 'sensitivity', icon: "🔴", label: "Sensitivity", color: "from-rose-100 to-pink-100" }
            ].map((concern, idx) => (
              <Link 
                key={idx}
                to={`/shop?filter=concern&concern=${concern.id}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className={`bg-gradient-to-br ${concern.color} rounded-2xl p-6 text-center cursor-pointer hover:shadow-xl transition-all hover:scale-105 group`}
                >
                  <div className="text-5xl mb-3 group-hover:scale-125 transition-transform">{concern.icon}</div>
                  <p className="font-label text-sm font-semibold text-on-surface">{concern.label}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Atelier Section */}
      <section className="py-20 px-6 sm:px-8 bg-gradient-to-r from-surface-container-low to-surface-container-highest relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="font-headline text-4xl text-center mb-12">Why Choose Atelier</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { 
                num: "01", 
                title: "Luxury Formulations", 
                desc: "Crafted with 20+ years of beauty expertise and premium ingredients sourced globally.",
                icon: "🏆"
              },
              { 
                num: "02", 
                title: "Sustainable Beauty", 
                desc: "Eco-conscious packaging and cruelty-free practices for conscious consumers.",
                icon: "🌍"
              },
              { 
                num: "03", 
                title: "Personal Ritual", 
                desc: "AI-powered consultations to create your perfect skincare routine.",
                icon: "🎯"
              }
            ].map((benefit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15 }}
                viewport={{ once: true }}
                className="bg-surface rounded-2xl p-8 border border-outline-variant/20 hover:border-primary/30 transition-all hover:shadow-xl group"
              >
                <div className="flex items-start gap-4 mb-6">
                  <span className="text-4xl">{benefit.icon}</span>
                  <span className="font-label text-3xl font-bold text-primary/30 group-hover:text-primary/60 transition-colors">{benefit.num}</span>
                </div>
                <h3 className="font-headline text-xl mb-3">{benefit.title}</h3>
                <p className="text-sm font-light text-on-surface-variant leading-relaxed">{benefit.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 sm:px-8 bg-surface">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl mb-2">Loved by 50K+ Beauty Enthusiasts</h2>
            <p className="text-on-surface-variant font-light flex items-center justify-center gap-2">
              <span className="text-lg">⭐⭐⭐⭐⭐</span>
              <span>4.9/5 Average Rating</span>
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Priya Sharma",
                role: "Beauty Influencer",
                text: "Atelier products transformed my skincare routine. The Night Elixir is now my holy grail—skin has never felt softer.",
                avatar: "👩‍🦰",
                rating: 5
              },
              {
                name: "Anaya Verma",
                role: "Skincare Enthusiast",
                text: "The research behind each product is exceptional. I'm obsessed with how L'Essence de Rose makes my skin glow naturally.",
                avatar: "👩‍🦱",
                rating: 5
              },
              {
                name: "Sakshi Malhotra",
                role: "Dermatology Student",
                text: "Finally, luxury skincare that's backed by science. The formula quality is comparable to clinical-grade treatments.",
                avatar: "👱‍♀️",
                rating: 5
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-surface-container-lowest rounded-2xl p-6 border border-outline-variant/10 hover:border-primary/30 transition-all hover:shadow-xl group"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-lg">⭐</span>
                  ))}
                </div>
                <p className="text-sm font-light text-on-surface-variant mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-outline-variant/10">
                  <span className="text-3xl">{testimonial.avatar}</span>
                  <div>
                    <p className="font-label text-xs font-semibold text-primary uppercase">{testimonial.name}</p>
                    <p className="text-xs text-on-surface-variant">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Spotlight */}
      <section className="py-20 px-6 sm:px-8 bg-gradient-to-b from-surface-container-low to-surface relative overflow-hidden">
        <div className="absolute left-0 bottom-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-headline text-3xl mb-2">🔥 Trending Now</h2>
              <p className="text-on-surface-variant font-light">What everyone's adding to their routine</p>
            </div>
            <Link to="/shop" className="font-label text-xs uppercase tracking-widest text-primary border-b-2 border-primary pb-1 hover:opacity-70">View All Trending</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-primary-fixed to-primary-container rounded-2xl p-8 flex items-center gap-8 text-on-primary-fixed hover:shadow-2xl transition-all hover:scale-105"
            >
              <div className="flex-1">
                <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full font-label text-xs mb-4 font-semibold">Best Seller</span>
                <h3 className="font-headline text-2xl mb-2">Nocturnal Recovery</h3>
                <p className="text-sm font-light mb-6 opacity-90">Used by 8,000+ in the last week</p>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌙</span>
                  <p className="text-sm">Night repair that really works</p>
                </div>
              </div>
              <div className="text-5xl opacity-40">💤</div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-surface-container-lowest to-surface-container-low rounded-2xl p-8 border-2 border-outline-variant/20 hover:border-primary/30 hover:shadow-2xl transition-all hover:scale-105 group"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-2xl">Bundle Deal 🎁</h3>
                <span className="bg-error/20 text-error px-3 py-1 rounded-full font-label text-xs font-bold">-25%</span>
              </div>
              <p className="text-sm font-light text-on-surface-variant mb-4">Complete Beauty Ritual Kit</p>
              <div className="flex gap-2 mb-6">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🌹</div>
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform">💎</div>
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center text-lg group-hover:scale-110 transition-transform">✨</div>
              </div>
              <p className="font-headline text-lg text-primary mb-3">₹24,999 <span className="line-through text-on-surface-variant font-body text-base">₹33,300</span></p>
              <Link to="/shop" className="inline-block bg-primary text-on-primary px-6 py-2 rounded-full font-label text-xs uppercase tracking-widest hover:bg-primary-container transition-colors">Shop Bundle</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-b from-surface-container-high to-surface py-24 px-6 sm:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto text-center"
        >
          <h3 className="font-headline text-4xl mb-6">Join the Atelier</h3>
          <p className="text-base font-light text-on-surface-variant mb-10">Receive early access to launches and curated beauty editorial.</p>
          <form onSubmit={handleNewsletterSubmit} className="relative group">
            <div className="relative">
              <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border-b-2 border-outline-variant py-5 px-2 font-label text-sm tracking-widest focus:ring-0 focus:border-primary transition-all outline-none placeholder:text-outline-variant/50 rounded-t-md focus:bg-primary/5" 
                placeholder="YOUR EMAIL" 
                type="email"
              />
              <button 
                type="submit"
                disabled={newsletterStatus === 'loading'}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-primary hover:scale-125 transition-transform disabled:opacity-50"
              >
                <East className="text-2xl" />
              </button>
            </div>
            
            {newsletterStatus === 'success' && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-primary font-label uppercase tracking-widest mt-4 font-semibold"
              >
                ✓ Thank you! Check your email.
              </motion.p>
            )}
            {newsletterStatus === 'error' && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-error font-label uppercase tracking-widest mt-4 font-semibold"
              >
                Please enter a valid email
              </motion.p>
            )}
          </form>
          <p className="text-xs text-on-surface-variant mt-6 font-light">We respect your privacy. Unsubscribe at any time.</p>
        </motion.div>
      </section>
    </motion.div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-primary font-serif tracking-[0.2em] animate-pulse">ATELIER</div>
      </div>
    );
  }

  return (
    <Router>
      <CartProvider>
        <LiveChatProvider>
          <div className="min-h-screen bg-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
            <TopAppBar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<HomeScreen />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route path="/signout" element={<SignOutPage />} />
                <Route path="/shop" element={<ShopScreen />} />
                <Route path="/cart" element={<CartScreen />} />
                <Route path="/profile" element={<ProfileScreen />} />

                <Route path="/concierge" element={<ConciergeScreen />} />
                <Route path="/checkout" element={<CheckoutScreen />} />
              </Routes>
            </AnimatePresence>
            <BottomNavBar />
          </div>
        </LiveChatProvider>
      </CartProvider>
    </Router>
  );
}
