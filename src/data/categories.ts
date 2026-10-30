import { CategorySlug, CollectionSlug } from '../types/store';

export interface CategoryInfo {
  slug: CategorySlug;
  name: {
    pt: string;
    en: string;
  };
  subtitle: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'skateboards',
    name: { pt: 'Skates', en: 'Skateboards' },
    subtitle: { pt: 'Decks & Street Setups', en: 'Decks & Street Setups' },
    description: {
      pt: 'Decks em maple canadiano de 7 camadas, concavidade equilibrada e acabamentos duradouros para asfalto e skateparks.',
      en: '7-ply Canadian maple decks, balanced concave, and rugged durability for street and skateparks.',
    },
  },
  {
    slug: 't-shirts',
    name: { pt: 'T-Shirts', en: 'T-Shirts' },
    subtitle: { pt: 'Heavyweight & Boxy Cut', en: 'Heavyweight & Boxy Cut' },
    description: {
      pt: 'Algodão pesado 240-280 GSM, corte boxy oversized, golas caneladas resistentes.',
      en: 'Heavyweight 240-280 GSM cotton, boxy oversized silhouette, reinforced ribbed collars.',
    },
  },
  {
    slug: 'hoodies',
    name: { pt: 'Hoodies', en: 'Hoodies' },
    subtitle: { pt: 'Double-Layered Fleece', en: 'Double-Layered Fleece' },
    description: {
      pt: 'Gramagem 450+ GSM, capuz estruturado duplo, acabamentos artesanais e caimento skate clássico.',
      en: '450+ GSM fleece, structured double hood, artisanal trims, and classic skate drape.',
    },
  },
  {
    slug: 'sweatshirts',
    name: { pt: 'Sweatshirts', en: 'Sweatshirts' },
    subtitle: { pt: 'Crewneck Heavyknit', en: 'Crewneck Heavyknit' },
    description: {
      pt: 'Modelagem drop shoulder, textura terry francesa premium para conforto urbano diário.',
      en: 'Drop shoulder silhouette, premium French terry texture for daily urban comfort.',
    },
  },
  {
    slug: 'bottoms',
    name: { pt: 'Bottoms', en: 'Bottoms' },
    subtitle: { pt: 'Cargo & Skate Pants', en: 'Cargo & Skate Pants' },
    description: {
      pt: 'Calças cargo utilitárias, sarja reforçada e jeans corte reto com mobilidade para skate.',
      en: 'Utility cargo pants, reinforced twill and straight cut denim with skate mobility.',
    },
  },
  {
    slug: 'headwear',
    name: { pt: 'Headwear', en: 'Headwear' },
    subtitle: { pt: 'Caps & Beanies', en: 'Caps & Beanies' },
    description: {
      pt: 'Bonés desestruturados 6-painéis, beanies de malha canelada e balaclavas underground.',
      en: 'Unstructured 6-panel caps, heavy knit beanies and underground balaclavas.',
    },
  },
  {
    slug: 'accessories',
    name: { pt: 'Accessories', en: 'Accessories' },
    subtitle: { pt: 'Street Goods & Bags', en: 'Street Goods & Bags' },
    description: {
      pt: 'Shoulder bags em ripstop, meias de compressão streetwear, porta-chaves e autocolantes de arquivo.',
      en: 'Ripstop shoulder bags, streetwear ribbed socks, keychains and archive sticker packs.',
    },
  },
];

export interface CollectionInfo {
  slug: CollectionSlug;
  name: {
    pt: string;
    en: string;
  };
  tag: {
    pt: string;
    en: string;
  };
  description: {
    pt: string;
    en: string;
  };
}

export const COLLECTIONS: CollectionInfo[] = [
  {
    slug: 'new-drops',
    name: { pt: 'New Drops', en: 'New Drops' },
    tag: { pt: 'Lançamentos Recentes', en: 'Fresh Arrivals' },
    description: {
      pt: 'As peças mais recentes desenhadas para a estação corrente.',
      en: 'The newest pieces designed for the current season.',
    },
  },
  {
    slug: 'limited-edition',
    name: { pt: 'Limited Edition', en: 'Limited Edition' },
    tag: { pt: 'Tiragem Exclusiva', en: 'Exclusive Run' },
    description: {
      pt: 'Produções únicas e numeradas. Sem reposições após esgotar.',
      en: 'Single numbered productions. No restocks once sold out.',
    },
  },
  {
    slug: 'best-sellers',
    name: { pt: 'Best Sellers', en: 'Best Sellers' },
    tag: { pt: 'Mais Procurados', en: 'Most Wanted' },
    description: {
      pt: 'As silhuetas mais aclamadas da nossa comunidade urbana.',
      en: 'The most requested silhouettes across our street community.',
    },
  },
];
