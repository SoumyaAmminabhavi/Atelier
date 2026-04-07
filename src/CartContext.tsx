import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, query } from 'firebase/firestore';
import { CartItem, OperationType } from './types';
import { handleFirestoreError } from './lib/firestore';

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!auth.currentUser) {
      setCart([]);
      return;
    }

    const path = `users/${auth.currentUser.uid}/cart`;
    const q = query(collection(db, path));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => doc.data() as CartItem);
      setCart(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addToCart = async (productId: string) => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/cart`;
    const existingItem = cart.find(item => item.productId === productId);

    try {
      if (existingItem) {
        await updateDoc(doc(db, path, productId), {
          quantity: existingItem.quantity + 1
        });
      } else {
        await setDoc(doc(db, path, productId), {
          productId,
          quantity: 1,
          addedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!auth.currentUser) return;
    const path = `users/${auth.currentUser.uid}/cart`;
    try {
      await deleteDoc(doc(db, path, productId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!auth.currentUser || quantity < 1) return;
    const path = `users/${auth.currentUser.uid}/cart`;
    try {
      await updateDoc(doc(db, path, productId), { quantity });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
