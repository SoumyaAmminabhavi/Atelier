import { Product } from './types';

export const CONCERNS = [
  {
    id: 'hydration',
    name: 'Hydration',
    icon: '💧',
    color: 'from-blue-100 to-cyan-100',
    why: 'Dehydrated skin appears dull and accelerates aging. Proper hydration plumps the skin, reduces fine lines, and maintains a healthy barrier.',
    who: 'Ideal for: Dry skin, sensitive skin, those in dry climates, anyone with flaky patches or tight-feeling skin',
    products: ['rose-essence', 'oasis-mist', 'hydrating-serum', 'hydrating-moisturizer']
  },
  {
    id: 'glow',
    icon: '✨',
    name: 'Glow',
    color: 'from-yellow-100 to-orange-100',
    why: 'Radiant skin boosts confidence and signals healthy, youthful skin. Glow-enhancing products brighten dark spots and reveal luminosity.',
    who: 'Ideal for: Dull skin, uneven tone, those wanting a lit-from-within look, combination skin',
    products: ['rose-essence', 'glow-booster-serum', 'brightening-cream']
  },
  {
    id: 'anti-age',
    icon: '🌿',
    name: 'Anti-Age',
    color: 'from-green-100 to-emerald-100',
    why: 'Anti-aging supports collagen production, reduces wrinkles, and firms skin. It targets fine lines, loss of elasticity, and skin texture.',
    who: 'Ideal for: Mature skin (30+), those with fine lines, sun-damaged skin, anyone wanting prevention or correction',
    products: ['nocturnal-recovery', 'anti-age-serum', 'firming-cream']
  },
  {
    id: 'sensitivity',
    icon: '🔴',
    name: 'Sensitivity',
    color: 'from-rose-100 to-pink-100',
    why: 'Sensitive skin needs gentle care to reduce redness, irritation, and inflammation. These products calm and strengthen the skin barrier.',
    who: 'Ideal for: Reactive skin, rosacea-prone, allergic reactions, those using active ingredients, post-procedure skin',
    products: ['oasis-mist', 'calming-serum', 'soothing-moisturizer']
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'rose-essence',
    name: "L'Essence de Rose",
    category: 'SKINCARE',
    productType: 'Cream',
    description: 'Intensive Hydration',
    concerns: ['hydration', 'glow'],
    price: 9900.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC91m7j-GeeF6-fjM1c9mwjz3Z4h5zuvfPxS8z7f5OPSfTsIyC-bxcBv8raA0qVNPBqLw3samCGpGsCQYhQq7HG_3rqUQzcjuufCdJ5liLTYqxxuE11S1eW7AE-b_hokX8ZhZH1dClO6ifpRA026LR97Q7ELsNSdsnoXoKsbmwR6MVmiM0xn15mgFe9OpzaVw51DxTlJ0UTz9m5Solk-taJteBMGdspsjwjjEc22ZLp9nmJkaenyA-sAECLx7cW4MaoAqCwuoutefM',
    size: '30ml',
    benefits: 'Intensive Hydration',
    isSignature: true
  },
  {
    id: 'nocturnal-recovery',
    name: 'Nocturnal Recovery',
    productType: 'Cream',
    category: 'EYE CARE',
    description: 'Lifting Cream',
    concerns: ['anti-age'],
    price: 6900.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA879iD7SlMWPzWO3gqArJ-xhBX1erhpk8Pxki1nOPIGvuqGFqomfC6zPE-GxTSA-hSh9L-_P5phEYo3iZ2u7jmgeWURzI9Kxv78ymY2orfB5o9moenK-Qqia6GRl17Qj_b6aXnsj4BDKxMcrVzu9vmzAW7UWswwp3b5JTKCx3KKm3he8tJtyH0nucABC91S4yrlVH261rPL0w7MsrUiJx5V5_iIIvYwS0owf6HTpA71OwV7MEsSLcpmuX47udVCtdNNH4X3TS4PTw',
    size: '15ml',
    benefits: 'Lifting Cream',
    isLimited: true
  },
  {
    id: 'oasis-mist',
    name: "L'Oasis Mist",
    productType: 'Serum',
    category: 'SKINCARE',
    description: 'Calming Hydration',
    concerns: ['hydration', 'sensitivity'],
    price: 6500.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvYRj3bRXoVldwClkV5dTXgKsj2YGoZ4UuOta-f-X3o1sehsBkhodThd_hDUOQEDdAcFV6tntYl8pkw1ueQ5Sn9Tbk2lU0EF_5oeFYe5i_vMCNqoMN6P7JRsSd08__cCtL-M2Ayyb8_m5aD8E_VAxLtk2su2Cf5Mt3QDAadxEHRcpS5PJDFmBPnkALiapCJL_PlqApREwNk45fXKE_YnManhlfbWk9aMCtAkBtNzShtLSojYO3KXlNtJ5tTGfVT-FesEJ-1QnrGLU',
    isSignature: true,
    isLimited: true
  },
  {
    id: 'velvet-sculpt',
    name: 'Velvet Sculpt',
    productType: 'Cream',
    category: 'SKINCARE',
    description: 'Lifting Balm',
    concerns: ['anti-age'],
    price: 9500.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrh2125i8IUvMJYQ_UW7-Ex0FXxvTpouXnRqHepQ4Y3YcFdwC3LnqG2yQzP9ZIo54-zaFN8n3CyU8Xkv0VEtSQoI6anLWNo4-N1Z__s2_mDTKf9ceihR98koAptTvUKwoV9aDiuUoncNZAhiL18G-iiChCEiCKviPeKbqF4wP9ug5IGmap8vkjgWBCG0ZLebcDfBEvgtvk7TA6Lbj9-K8-hCdL82C6qLPqBN2Nt4kb53iGWQ0JbT3sJQTyKnJ86xFWIvITYD5cEso',
    isNew: true
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    productType: 'Serum',
    category: 'SKINCARE',
    description: 'Nourishing Oil',
    concerns: ['hydration', 'glow'],
    price: 7500.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDjT5UX2HOwhFOg4oXdWdN6KHL8KCBcbJNxN1Ahb92rWxshy1whDKOOuy3aypdzxGmN9TaozTNQvSF4C179NECws2vbnXmiFEHQMboovAzV-EBO0KtrS77TZaRdDe7iPvy3GphuGtWPSxtOouU6rXa2q-bspkc1X94GzQwc7L9m6eUa6UuUg1q9jhJK4N0t9dCsyI4E5Y-WE0EvjIwK-z3VsblkkDUctB22PIVaY8VhTKOsmwTEt1tlZN0KSGI6S_JUtSnIgiDX3c',
    isNew: true
  },
  {
    id: 'hydrating-serum',
    name: 'Hydrating Essence Serum',
    productType: 'Serum',
    category: 'SKINCARE',
    description: 'Lightweight Hydration Boost',
    concerns: ['hydration'],
    price: 5200.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC91m7j-GeeF6-fjM1c9mwjz3Z4h5zuvfPxS8z7f5OPSfTsIyC-bxcBv8raA0qVNPBqLw3samCGpGsCQYhQq7HG_3rqUQzcjuufCdJ5liLTYqxxuE11S1eW7AE-b_hokX8ZhZH1dClO6ifpRA026LR97Q7ELsNSdsnoXoKsbmwR6MVmiM0xn15mgFe9OpzaVw51DxTlJ0UTz9m5Solk-taJteBMGdspsjwjjEc22ZLp9nmJkaenyA-sAECLx7cW4MaoAqCwuoutefM'
  },
  {
    id: 'hydrating-moisturizer',
    name: 'Hydrating Night Moisturizer',
    productType: 'Moisturizer',
    category: 'SKINCARE',
    description: 'Deep Nourishing Cream',
    concerns: ['hydration'],
    price: 7300.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC91m7j-GeeF6-fjM1c9mwjz3Z4h5zuvfPxS8z7f5OPSfTsIyC-bxcBv8raA0qVNPBqLw3samCGpGsCQYhQq7HG_3rqUQzcjuufCdJ5liLTYqxxuE11S1eW7AE-b_hokX8ZhZH1dClO6ifpRA026LR97Q7ELsNSdsnoXoKsbmwR6MVmiM0xn15mgFe9OpzaVw51DxTlJ0UTz9m5Solk-taJteBMGdspsjwjjEc22ZLp9nmJkaenyA-sAECLx7cW4MaoAqCwuoutefM'
  },
  {
    id: 'glow-booster-serum',
    name: 'Glow Booster Vitamin C Serum',
    productType: 'Serum',
    category: 'SKINCARE',
    description: 'Brightening & Radiance Serum',
    concerns: ['glow'],
    price: 8500.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC91m7j-GeeF6-fjM1c9mwjz3Z4h5zuvfPxS8z7f5OPSfTsIyC-bxcBv8raA0qVNPBqLw3samCGpGsCQYhQq7HG_3rqUQzcjuufCdJ5liLTYqxxuE11S1eW7AE-b_hokX8ZhZH1dClO6ifpRA026LR97Q7ELsNSdsnoXoKsbmwR6MVmiM0xn15mgFe9OpzaVw51DxTlJ0UTz9m5Solk-taJteBMGdspsjwjjEc22ZLp9nmJkaenyA-sAECLx7cW4MaoAqCwuoutefM'
  },
  {
    id: 'brightening-cream',
    name: 'Brightening Day Cream',
    productType: 'Cream',
    category: 'SKINCARE',
    description: 'SPF-Infused Glow Cream',
    concerns: ['glow'],
    price: 6800.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC91m7j-GeeF6-fjM1c9mwjz3Z4h5zuvfPxS8z7f5OPSfTsIyC-bxcBv8raA0qVNPBqLw3samCGpGsCQYhQq7HG_3rqUQzcjuufCdJ5liLTYqxxuE11S1eW7AE-b_hokX8ZhZH1dClO6ifpRA026LR97Q7ELsNSdsnoXoKsbmwR6MVmiM0xn15mgFe9OpzaVw51DxTlJ0UTz9m5Solk-taJteBMGdspsjwjjEc22ZLp9nmJkaenyA-sAECLx7cW4MaoAqCwuoutefM'
  },
  {
    id: 'anti-age-serum',
    name: 'Retinol Anti-Age Serum',
    productType: 'Serum',
    category: 'SKINCARE',
    description: 'Advanced Wrinkle Reduction',
    concerns: ['anti-age'],
    price: 9200.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA879iD7SlMWPzWO3gqArJ-xhBX1erhpk8Pxki1nOPIGvuqGFqomfC6zPE-GxTSA-hSh9L-_P5phEYo3iZ2u7jmgeWURzI9Kxv78ymY2orfB5o9moenK-Qqia6GRl17Qj_b6aXnsj4BDKxMcrVzu9vmzAW7UWswwp3b5JTKCx3KKm3he8tJtyH0nucABC91S4yrlVH261rPL0w7MsrUiJx5V5_iIIvYwS0owf6HTpA71OwV7MEsSLcpmuX47udVCtdNNH4X3TS4PTw'
  },
  {
    id: 'firming-cream',
    name: 'Firming Night Cream',
    productType: 'Cream',
    category: 'SKINCARE',
    description: 'Collagen-Boosting Cream',
    concerns: ['anti-age'],
    price: 8900.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA879iD7SlMWPzWO3gqArJ-xhBX1erhpk8Pxki1nOPIGvuqGFqomfC6zPE-GxTSA-hSh9L-_P5phEYo3iZ2u7jmgeWURzI9Kxv78ymY2orfB5o9moenK-Qqia6GRl17Qj_b6aXnsj4BDKxMcrVzu9vmzAW7UWswwp3b5JTKCx3KKm3he8tJtyH0nucABC91S4yrlVH261rPL0w7MsrUiJx5V5_iIIvYwS0owf6HTpA71OwV7MEsSLcpmuX47udVCtdNNH4X3TS4PTw'
  },
  {
    id: 'calming-serum',
    name: 'Calming Relief Serum',
    productType: 'Serum',
    category: 'SKINCARE',
    description: 'Soothing & Anti-Inflammatory',
    concerns: ['sensitivity'],
    price: 5700.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvYRj3bRXoVldwClkV5dTXgKsj2YGoZ4UuOta-f-X3o1sehsBkhodThd_hDUOQEDdAcFV6tntYl8pkw1ueQ5Sn9Tbk2lU0EF_5oeFYe5i_vMCNqoMN6P7JRsSd08__cCtL-M2Ayyb8_m5aD8E_VAxLtk2su2Cf5Mt3QDAadxEHRcpS5PJDFmBPnkALiapCJL_PlqApREwNk45fXKE_YnManhlfbWk9aMCtAkBtNzShtLSojYO3KXlNtJ5tTGfVT-FesEJ-1QnrGLU'
  },
  {
    id: 'soothing-moisturizer',
    name: 'Barrier-Repair Moisturizer',
    productType: 'Moisturizer',
    category: 'SKINCARE',
    description: 'Gentle & Protective Cream',
    concerns: ['sensitivity'],
    price: 6200.00,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvYRj3bRXoVldwClkV5dTXgKsj2YGoZ4UuOta-f-X3o1sehsBkhodThd_hDUOQEDdAcFV6tntYl8pkw1ueQ5Sn9Tbk2lU0EF_5oeFYe5i_vMCNqoMN6P7JRsSd08__cCtL-M2Ayyb8_m5aD8E_VAxLtk2su2Cf5Mt3QDAadxEHRcpS5PJDFmBPnkALiapCJL_PlqApREwNk45fXKE_YnManhlfbWk9aMCtAkBtNzShtLSojYO3KXlNtJ5tTGfVT-FesEJ-1QnrGLU'
  }
];
