import { Product, Review, Ritual } from '../types';

export const products: Product[] = [
  {
    id: 'gentle-herb-cleanser',
    name: 'Gentle Herb Cleanser',
    price: 1899,
    originalPrice: 2299,
    description: 'A gentle, herb-infused cleanser that purifies while maintaining skin\'s natural moisture barrier.',
    benefits: ['Deep cleansing without stripping', 'Maintains natural pH balance', 'Reduces inflammation', 'Suitable for all skin types'],
    ingredients: ['Neem extract', 'Turmeric', 'Rose water', 'Aloe vera', 'Coconut oil'],
    usage: 'Apply to damp skin, massage gently in circular motions, rinse with lukewarm water. Use morning and evening.',
    images: ['https://images.pexels.com/photos/7755476/pexels-photo-7755476.jpeg'],
    category: 'cleanser',
    skinConcerns: ['Acne', 'Sensitivity', 'Dullness'],
    featured: true
  },
  {
    id: 'radiance-vitamin-c-serum',
    name: 'Radiance Vitamin C Serum',
    price: 2499,
    description: 'A potent vitamin C serum that brightens skin tone and provides antioxidant protection.',
    benefits: ['Brightens complexion', 'Reduces dark spots', 'Antioxidant protection', 'Stimulates collagen production'],
    ingredients: ['Vitamin C (L-Ascorbic acid)', 'Hyaluronic acid', 'Vitamin E', 'Ferulic acid', 'Rose hip oil'],
    usage: 'Apply 2-3 drops to clean skin in the morning. Follow with moisturizer and SPF.',
    images: ['https://images.pexels.com/photos/7755443/pexels-photo-7755443.jpeg'],
    category: 'serum',
    skinConcerns: ['Dark spots', 'Dullness', 'Anti-aging'],
    featured: true
  },
  {
    id: 'hydrating-rose-moisturizer',
    name: 'Hydrating Rose Moisturizer',
    price: 1699,
    description: 'A luxurious rose-infused moisturizer that deeply hydrates and softens skin.',
    benefits: ['Deep hydration', 'Improves skin texture', 'Calming rose fragrance', 'Non-greasy formula'],
    ingredients: ['Rose water', 'Shea butter', 'Jojoba oil', 'Hyaluronic acid', 'Ceramides'],
    usage: 'Apply to clean skin morning and evening. Massage gently until absorbed.',
    images: ['https://images.pexels.com/photos/7755471/pexels-photo-7755471.jpeg'],
    category: 'moisturizer',
    skinConcerns: ['Dryness', 'Sensitivity', 'Aging']
  },
  {
    id: 'purifying-clay-mask',
    name: 'Purifying Clay Mask',
    price: 1399,
    description: 'A detoxifying clay mask that draws out impurities and minimizes pores.',
    benefits: ['Deep pore cleansing', 'Controls excess oil', 'Minimizes pores', 'Improves skin texture'],
    ingredients: ['Bentonite clay', 'Kaolin clay', 'Charcoal', 'Tea tree oil', 'Witch hazel'],
    usage: 'Apply thin layer to clean skin, avoid eye area. Leave for 10-15 minutes, rinse with warm water.',
    images: ['https://images.pexels.com/photos/7755456/pexels-photo-7755456.jpeg'],
    category: 'mask',
    skinConcerns: ['Acne', 'Large pores', 'Oily skin']
  },
  {
    id: 'nourishing-face-oil',
    name: 'Nourishing Face Oil',
    price: 2199,
    description: 'A blend of precious oils that deeply nourishes and restores skin\'s natural glow.',
    benefits: ['Intense nourishment', 'Restores radiance', 'Anti-aging properties', 'Improves elasticity'],
    ingredients: ['Argan oil', 'Rosehip oil', 'Marula oil', 'Vitamin E', 'Lavender oil'],
    usage: 'Apply 3-4 drops to face and neck in the evening. Gently massage until absorbed.',
    images: ['https://images.pexels.com/photos/7755461/pexels-photo-7755461.jpeg'],
    category: 'oil',
    skinConcerns: ['Dryness', 'Anti-aging', 'Dullness'],
    featured: true
  },
  {
    id: 'balancing-herbal-toner',
    name: 'Balancing Herbal Toner',
    price: 1299,
    description: 'A refreshing herbal toner that balances skin pH and prepares it for treatment products.',
    benefits: ['Balances skin pH', 'Minimizes pores', 'Refreshes skin', 'Prepares skin for treatments'],
    ingredients: ['Witch hazel', 'Rose water', 'Green tea', 'Cucumber extract', 'Chamomile'],
    usage: 'Apply to clean skin using cotton pad or spray directly. Use morning and evening.',
    images: ['https://images.pexels.com/photos/7755469/pexels-photo-7755469.jpeg'],
    category: 'toner',
    skinConcerns: ['Large pores', 'Oily skin', 'Sensitivity']
  },
  {
    id: 'rejuvenating-night-cream',
    name: 'Rejuvenating Night Cream',
    price: 2799,
    description: 'A rich, restorative night cream that works while you sleep to repair and rejuvenate skin.',
    benefits: ['Overnight repair', 'Reduces fine lines', 'Deeply moisturizes', 'Improves skin firmness'],
    ingredients: ['Retinol', 'Peptides', 'Shea butter', 'Squalane', 'Bakuchiol'],
    usage: 'Apply to clean skin every evening. Gently massage into face and neck.',
    images: ['https://images.pexels.com/photos/7755463/pexels-photo-7755463.jpeg'],
    category: 'moisturizer',
    skinConcerns: ['Anti-aging', 'Fine lines', 'Firmness']
  }
];

export const reviews: Review[] = [
  {
    id: 'review-1',
    name: 'Priya Sharma',
    rating: 5,
    comment: 'The Gentle Herb Cleanser is amazing! My skin feels clean but not stripped. Perfect for my sensitive skin.',
    productId: 'gentle-herb-cleanser',
    date: '2024-01-15'
  },
  {
    id: 'review-2',
    name: 'Anisha Patel',
    rating: 5,
    comment: 'This Vitamin C serum has transformed my skin. I can see visible brightness after just 2 weeks!',
    productId: 'radiance-vitamin-c-serum',
    date: '2024-01-10'
  },
  {
    id: 'review-3',
    name: 'Kavya Menon',
    rating: 4,
    comment: 'Love the rose moisturizer. The scent is divine and it keeps my skin hydrated all day.',
    productId: 'hydrating-rose-moisturizer',
    date: '2024-01-08'
  }
];

export const rituals: Ritual[] = [
  {
    id: 'morning-glow',
    title: 'Morning Glow Ritual',
    description: 'Start your day with this energizing routine that awakens and protects your skin.',
    duration: '5-7 minutes',
    skinType: 'All skin types',
    image: 'https://images.pexels.com/photos/7755443/pexels-photo-7755443.jpeg',
    steps: [
      {
        stepNumber: 1,
        title: 'Gentle Cleansing',
        description: 'Cleanse with our Gentle Herb Cleanser to remove overnight impurities.',
        products: ['gentle-herb-cleanser']
      },
      {
        stepNumber: 2,
        title: 'Balance & Tone',
        description: 'Apply Balancing Herbal Toner to prepare your skin.',
        products: ['balancing-herbal-toner']
      },
      {
        stepNumber: 3,
        title: 'Vitamin C Protection',
        description: 'Apply Radiance Vitamin C Serum for antioxidant protection.',
        products: ['radiance-vitamin-c-serum']
      },
      {
        stepNumber: 4,
        title: 'Hydrate',
        description: 'Finish with Hydrating Rose Moisturizer for all-day hydration.',
        products: ['hydrating-rose-moisturizer']
      }
    ]
  }
];
