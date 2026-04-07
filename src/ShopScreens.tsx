import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { PRODUCTS, CONCERNS } from './constants';
import { useCart } from './CartContext';
import { motion } from 'motion/react';
import { AddCircle, Remove, Add, Lock as LockIcon } from './components/Icons';

export const ShopScreen = () => {
  const { addToCart } = useCart();
  const [searchParams] = useSearchParams();
  const filter = searchParams.get('filter');
  const concernId = searchParams.get('concern');

  let displayedProducts = PRODUCTS;
  let title = 'Curated Elements';
  let subtitle = 'The Editorial Collection';
  let concernInfo: any = null;

  if (filter === 'new') {
    displayedProducts = PRODUCTS.filter(p => p.isNew);
    title = 'New Arrivals';
    subtitle = 'Discover Our Latest Launches';
  } else if (filter === 'limited') {
    displayedProducts = PRODUCTS.filter(p => p.isLimited);
    title = 'Limited Edition Rituals';
    subtitle = 'Exclusive & Curated Collections';
  } else if (filter === 'concern' && concernId) {
    concernInfo = CONCERNS.find(c => c.id === concernId);
    if (concernInfo) {
      displayedProducts = PRODUCTS.filter(p => p.concerns?.includes(concernId));
      title = concernInfo.name;
      subtitle = 'Shop Solutions for Your Skin';
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="pt-24 pb-32 px-6 sm:px-8"
    >
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <p className="font-label text-[10px] tracking-[0.2em] uppercase text-primary mb-2">{subtitle}</p>
          <div className="flex items-center gap-4">
            <h2 className="font-headline text-3xl">{title}</h2>
            {filter === 'new' && (
              <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full font-label text-xs font-semibold uppercase tracking-widest">✨ Exclusive</span>
            )}
            {filter === 'limited' && (
              <span className="inline-block bg-error/10 text-error px-4 py-1.5 rounded-full font-label text-xs font-semibold uppercase tracking-widest">🎁 Limited</span>
            )}
          </div>
        </div>

        {concernInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${concernInfo.color} rounded-2xl p-8 mb-12 border border-outline-variant/20`}
          >
            <div className="flex items-start gap-4 mb-6">
              <span className="text-5xl">{concernInfo.icon}</span>
              <div className="flex-1">
                <h3 className="font-headline text-2xl mb-3 text-on-surface">Why {concernInfo.name}?</h3>
                <p className="text-sm text-on-surface-variant font-light leading-relaxed mb-4">{concernInfo.why}</p>
                <div className="bg-white/40 backdrop-blur rounded-lg p-4">
                  <p className="font-label text-xs uppercase tracking-widest text-on-surface font-semibold mb-2">Who Should Use It</p>
                  <p className="text-sm text-on-surface-variant font-light">{concernInfo.who}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {displayedProducts.map((product) => (
          <div key={product.id} className="group flex flex-col h-full">
            <div className="relative overflow-hidden rounded-2xl bg-surface-container-low mb-4 aspect-[3/4] flex-grow">
              {product.isNew && (
                <div className="absolute top-4 right-4 bg-error/90 backdrop-blur text-white px-3 py-1 rounded-full shadow-lg z-20">
                  <p className="font-label text-[9px] uppercase tracking-widest font-bold">New</p>
                </div>
              )}
              {product.isLimited && (
                <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur text-white px-3 py-1 rounded-full shadow-lg z-20">
                  <p className="font-label text-[9px] uppercase tracking-widest font-bold">🎁 Limited</p>
                </div>
              )}
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <h4 className="font-headline text-lg leading-tight">{product.name}</h4>
                  <p className="text-xs text-on-surface-variant font-light">{product.description}</p>
                </div>
                {product.productType && (
                  <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-[8px] font-label uppercase tracking-widest font-semibold whitespace-nowrap">{product.productType}</span>
                )}
              </div>
              <div className="flex justify-between items-center pt-2">
                <p className="font-body text-sm font-medium">₹{product.price.toLocaleString('en-IN')}</p>
                <button 
                  onClick={() => addToCart(product.id)}
                  className="text-primary hover:scale-110 transition-transform"
                >
                  <AddCircle className="text-2xl fill-current" />
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </motion.div>
  );
};

export const CartScreen = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const cartProducts = cart.map(item => ({
    ...PRODUCTS.find(p => p.id === item.productId)!,
    quantity: item.quantity
  }));

  const subtotal = cartProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const shipping = 0;
  const tax = subtotal * 0.087;
  const total = subtotal + shipping + tax;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <h2 className="font-headline text-2xl mb-4">Your selection is empty</h2>
        <p className="text-stone-500 mb-8">Discover our curated beauty rituals.</p>
        <Link to="/shop" className="bg-primary text-on-primary px-8 py-3 rounded-full uppercase tracking-widest text-xs">Shop Now</Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-28 pb-32 px-6 sm:px-8 max-w-2xl mx-auto"
    >
      <section className="mb-12">
        <h1 className="text-3xl font-headline italic mb-8 tracking-tight">Your Selection</h1>
        <div className="space-y-8">
          {cartProducts.map(product => (
            <div key={product.id} className="flex gap-6 items-center">
              <div className="w-24 h-32 rounded-lg bg-surface-container-highest overflow-hidden flex-shrink-0">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] tracking-[0.15em] font-label uppercase text-primary mb-1">{product.category}</p>
                <h3 className="text-lg font-headline leading-tight mb-1">{product.name}</h3>
                <p className="text-sm text-stone-500 mb-2">{product.size} • {product.benefits}</p>
                <div className="flex justify-between items-center">
                  <span className="font-medium">₹{product.price.toLocaleString('en-IN')}</span>
                  <div className="flex items-center gap-4 text-xs font-label">
                    <button onClick={() => updateQuantity(product.id, product.quantity - 1)} className="hover:text-primary">
                      <Remove className="text-sm" />
                    </button>
                    <span>{product.quantity}</span>
                    <button onClick={() => updateQuantity(product.id, product.quantity + 1)} className="hover:text-primary">
                      <Add className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-surface-container-lowest p-8 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.03)] mb-12">
        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm text-stone-500">
            <span>Subtotal</span>
            <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-500">
            <span>Shipping</span>
            <span>₹{shipping.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="flex justify-between text-sm text-stone-500">
            <span>Estimated VAT</span>
            <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
          <div className="h-px bg-surface-container w-full" />
          <div className="flex justify-between items-baseline pt-2">
            <span className="font-headline text-lg">Total</span>
            <span className="font-headline text-2xl text-primary">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
        <Link 
          to="/checkout"
          className="block w-full py-5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary text-center font-label tracking-[0.2em] uppercase text-sm shadow-xl shadow-primary/20 transition-all hover:opacity-90 active:scale-[0.98]"
        >
          Checkout
        </Link>
        <p className="mt-6 text-center text-[10px] text-stone-400 flex items-center justify-center gap-2">
          <LockIcon className="text-[12px]" />
          Encrypted & Secure Payment Processing
        </p>
      </section>
    </motion.div>
  );
};
