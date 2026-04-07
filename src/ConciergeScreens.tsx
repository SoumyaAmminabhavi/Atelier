import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CalendarToday, Label, PublishedWithChanges, ArrowForward, Apple, CreditCard, Lock as LockIcon } from './components/Icons';
import { openLiveChat } from './components/LiveChat';

export const ConciergeScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-32 px-6 sm:px-8 max-w-2xl mx-auto"
    >
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-headline tracking-tight text-on-surface mb-2">Concierge</h1>
        <p className="text-sm font-label uppercase tracking-[0.15em] text-outline">Delivery & Returns</p>
      </section>

      <div className="mb-20">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-xs font-label uppercase tracking-widest text-primary">01</span>
          <div className="h-[1px] flex-grow bg-outline-variant/30" />
          <h2 className="text-xl font-headline italic">Shipping Policy</h2>
        </div>
        <div className="relative mb-8">
          <div className="w-full aspect-[4/5] max-h-56 bg-surface-container rounded-lg overflow-hidden mb-6">
            <img 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQD49_aVT5L1brgN4eIZsijxEK_cmi5QTa6CdIXHB4byqp836mx-s5wpPLl9p3w1lOe6XV-fOrpxqWAzJPoli3AkpOFLy2Vk954WlOX6SuvcwjchHMtdcogcNaWOWVy1fLNo5ss1CMw7ismQnuRGFuWpyckZnqpCpeJMRhqc2iXcKCp4OEu8JpMAlRjvcfKrKysk6vq0wiqsRm-LXMkmpCKRDk9TxkIpi9UpCdk-HQAUwTwTGOThHFpBh2pjnOA9rqvkOdTLccoCk" 
              alt="Luxury package"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-8 pl-6">
            <div className="max-w-[80%]">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-primary mb-2">Domestic Standard</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">3-5 business days. Complimentary on all orders over ₹12,000.</p>
            </div>
            <div className="max-w-[85%] ml-auto text-right">
              <h3 className="font-label text-[10px] uppercase tracking-widest text-primary mb-2">Priority Express</h3>
              <p className="text-lg leading-relaxed text-on-surface-variant font-light">Next day arrival for orders placed before 12PM IST. Flat rate of ₹2,000.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-xl font-headline italic">Returns & Exchanges</h2>
          <div className="h-[1px] flex-grow bg-outline-variant/30" />
          <span className="text-xs font-label uppercase tracking-widest text-primary">02</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/10">
            <CalendarToday className="text-primary mb-4 fill-current" />
            <h3 className="font-headline text-lg mb-2">30-Day Window</h3>
            <p className="text-sm font-body text-on-surface-variant leading-relaxed">We accept returns for unused items in their original packaging within 30 days of delivery.</p>
          </div>
          <div className="bg-surface-container-low p-6 rounded-xl">
            <Label className="text-primary mb-3" />
            <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface mb-2">Free Labels</h3>
            <p className="text-xs text-on-surface-variant">Simply download and print from your account. Returns are processed at our local centre.</p>
          </div>
          <div className="bg-primary-fixed/20 p-6 rounded-xl">
            <PublishedWithChanges className="text-primary mb-3" />
            <h3 className="font-label text-[10px] uppercase tracking-widest text-on-surface mb-2">Exchanges</h3>
            <p className="text-xs text-on-surface-variant">Direct exchange for any damaged item during transit.</p>
          </div>
        </div>
      </div>

      <section className="mt-16 p-8 bg-surface-container-low rounded-[2rem] text-center">
        <h2 className="font-headline text-2xl mb-4">Further Assistance?</h2>
        <p className="text-sm font-body text-on-surface-variant mb-6 px-4">Our beauty consultants are available 24/7 to guide you through your experience.</p>
        <div className="flex flex-col gap-3">
          <button onClick={openLiveChat} className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary py-4 rounded-full font-label text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/10">Contact Support</button>
        </div>
      </section>
    </motion.div>
  );
};

export const CheckoutScreen = () => {
  const [formData, setFormData] = useState({
    name: 'ELARA VANCE',
    cardNumber: '**** **** **** 4421',
    expiry: 'MM/YY',
    cvc: '***'
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-28 pb-32 px-6 sm:px-8 max-w-2xl mx-auto"
    >
      <section className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-headline">Payment</h2>
          <span className="text-[10px] tracking-[0.1em] font-label text-stone-400 uppercase">Secure Encryption</span>
        </div>
        
        <button className="w-full h-14 bg-on-surface text-surface rounded-full flex items-center justify-center mb-4 transition-transform active:scale-95">
          <span className="font-bold flex items-center gap-1">
            <Apple className="text-xl fill-current" />
            Pay
          </span>
        </button>

        <div className="relative flex items-center justify-center my-8">
          <div className="w-full border-b border-outline-variant/20" />
          <span className="absolute px-4 bg-surface text-[10px] font-label text-stone-400 uppercase tracking-widest">or card details</span>
        </div>

        <div className="space-y-6">
          <div className="group">
            <label className="text-[10px] font-label tracking-widest text-stone-500 uppercase">Cardholder Name</label>
            <input 
              className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-2 focus:ring-0 focus:border-primary transition-all font-body text-stone-800 placeholder:text-stone-300" 
              placeholder="ELARA VANCE" 
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="group">
            <label className="text-[10px] font-label tracking-widest text-stone-500 uppercase">Card Number</label>
            <div className="relative">
              <input 
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-2 focus:ring-0 focus:border-primary transition-all font-body text-stone-800 placeholder:text-stone-300" 
                placeholder="**** **** **** 4421" 
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
              />
              <CreditCard className="absolute right-0 top-2 text-stone-400 text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="group">
              <label className="text-[10px] font-label tracking-widest text-stone-500 uppercase">Expiry Date</label>
              <input 
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-2 focus:ring-0 focus:border-primary transition-all font-body text-stone-800 placeholder:text-stone-300" 
                placeholder="MM/YY" 
                type="text"
                value={formData.expiry}
                onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              />
            </div>
            <div className="group">
              <label className="text-[10px] font-label tracking-widest text-stone-500 uppercase">CVC</label>
              <input 
                className="w-full bg-transparent border-0 border-b border-outline-variant/30 px-0 py-2 focus:ring-0 focus:border-primary transition-all font-body text-stone-800 placeholder:text-stone-300" 
                placeholder="***" 
                type="password"
                value={formData.cvc}
                onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
              />
            </div>
          </div>
        </div>
      </section>

      <button className="w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label tracking-[0.2em] uppercase text-sm shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]">
        Place My Order
      </button>
      <p className="mt-6 text-center text-[10px] text-stone-400 flex items-center justify-center gap-2">
        <LockIcon className="text-[12px]" />
        Encrypted & Secure Payment Processing
      </p>
    </motion.div>
  );
};
