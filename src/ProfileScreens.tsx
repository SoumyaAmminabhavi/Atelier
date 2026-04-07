import React, { useState } from 'react';
import { auth, signInWithGoogle } from './firebase';
import { motion } from 'motion/react';
import { Google, IOS, Mail, Lock as LockIcon, BrandAwareness, Fingerprint, Spa, ArrowForward } from './components/Icons';
import { Link, useNavigate } from 'react-router-dom';
import { openLiveChat } from './components/LiveChat';
export const ProfileScreen = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-container-low"
      >
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline mb-4 text-on-surface">Sign in to Continue</h2>
          <p className="text-on-surface-variant font-light mb-8">Explore personalized beauty experiences</p>
        </div>

        <div className="flex gap-4">
          <Link to="/signin" className="px-8 py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-label text-xs tracking-widest uppercase shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
            Sign In
          </Link>
          <Link to="/signup" className="px-8 py-4 rounded-full border-2 border-primary text-primary font-label text-xs tracking-widest uppercase hover:bg-primary/5 transition-colors">
            Sign Up
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-32 px-6 sm:px-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-12">
        <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-primary-container p-1">
          <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full rounded-full object-cover" />
        </div>
        <h2 className="text-3xl font-headline">{user.displayName}</h2>
        <p className="text-stone-500 font-light">{user.email}</p>
      </div>

      <div className="space-y-4">


        <Link to="/concierge" className="flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-stone-500">
              <Spa className="fill-current" />
            </div>
            <div>
              <h3 className="font-headline text-lg">Concierge</h3>
              <p className="text-xs text-stone-500">Delivery & Returns</p>
            </div>
          </div>
          <ArrowForward className="text-stone-300 group-hover:text-primary transition-colors" />
        </Link>

        <button onClick={openLiveChat} className="text-left w-full flex items-center justify-between p-6 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
              <Mail className="fill-current" />
            </div>
            <div>
              <h3 className="font-headline text-lg">Contact Support</h3>
              <p className="text-xs text-stone-500">Chat with our 24/7 support</p>
            </div>
          </div>
          <ArrowForward className="text-stone-300 group-hover:text-primary transition-colors" />
        </button>

        <Link 
          to="/signout"
          className="block w-full mt-8 py-4 text-center rounded-full border border-error/20 text-error font-label text-xs tracking-widest uppercase hover:bg-error/5 transition-colors"
        >
          Sign Out
        </Link>
      </div>
    </motion.div>
  );
};
