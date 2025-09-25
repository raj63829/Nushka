export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  benefits: string[];
  ingredients: string[];
  usage: string;
  images: string[];
  category: 'cleanser' | 'moisturizer' | 'serum' | 'mask' | 'oil' | 'toner';
  skinConcerns: string[];
  featured?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface WishlistItem extends Product {}

export interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  productId: string;
  date: string;
}

export interface Ritual {
  id: string;
  title: string;
  description: string;
  steps: RitualStep[];
  duration: string;
  skinType: string;
  image: string;
}

export interface RitualStep {
  stepNumber: number;
  title: string;
  description: string;
  products: string[];
}
