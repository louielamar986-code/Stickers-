/**
 * STICKERS® Store Type Definitions
 */

export type CategorySlug = 
  | 't-shirts' 
  | 'hoodies' 
  | 'sweatshirts' 
  | 'bottoms' 
  | 'headwear' 
  | 'accessories'
  | 'skateboards';

export type CollectionSlug = 
  | 'new-drops' 
  | 'limited-edition' 
  | 'best-sellers';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface SkateboardSpecs {
  deckDimensions?: string;
  woodMaterial?: string;
  concaveType?: string;
  brand?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CategorySlug;
  collection: CollectionSlug;
  price: number; // In Mozambican Metical (MT)
  images: string[]; // Primary, back/alternate, detail
  colors: ProductColor[];
  sizes: string[]; // e.g. ['S', 'M', 'L', 'XL'] or ['8.0"', '8.25"']
  stockByVariant: Record<string, number>;
  isPublished: boolean;
  isFeatured: boolean;
  fabricFit?: string;
  // Skateboard-specific optional specs
  deckDimensions?: string;
  deckMaterial?: string;
  deckType?: string;
  brand?: string;
  skateboardSpecs?: SkateboardSpecs;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // unique item id `${productId}_${size}_${color}`
  productId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  unitPrice: number;
}

export interface StoreConfig {
  whatsappNumber: string; // clean digits e.g. 25884xxxxxxx
  careMessagePt: string;
  careMessageEn: string;
  instagramUrl: string;
  instagramActive: boolean;
  tiktokUrl: string;
  tiktokActive: boolean;
  youtubeUrl: string;
  youtubeActive: boolean;
  currency: string; // 'MT'
  city: string; // Maputo
  country: string; // Moçambique
}

export type FeedbackCategory =
  | 'Sugestão'
  | 'Experiência de compra'
  | 'Design da loja'
  | 'Produtos'
  | 'Outro';

export interface FeedbackItem {
  id: string;
  name?: string;
  email?: string;
  contact?: string;
  category: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  isRead?: boolean;
  isArchived?: boolean;
  createdAt: string;
}

export type Language = 'pt' | 'en';
export type Theme = 'light' | 'dark';

export type ActivePage = 
  | 'home' 
  | 'shop' 
  | 'collections' 
  | 'about' 
  | 'contact' 
  | 'feedback'
  | 'product-detail';

export interface FilterState {
  category: CategorySlug | 'all';
  collection: CollectionSlug | 'all';
  size: string | 'all';
  color: string | 'all';
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'name-asc';
  searchQuery: string;
}
