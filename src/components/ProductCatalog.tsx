import React, { useState, useMemo } from 'react';
import {
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  Compass,
  Instagram,
  Sparkles,
} from 'lucide-react';
import { CATEGORIES, COLLECTIONS } from '../data/categories';
import { ProductCard } from './ProductCard';
import { ProductDetailModal } from './ProductDetailModal';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';
import { ScrollReveal } from './ScrollReveal';

export const ProductCatalog: React.FC = () => {
  const {
    products,
    selectedCategory,
    setSelectedCategory,
    selectedCollection,
    setSelectedCollection,
    selectedProductId,
    setSelectedProductId,
    config,
    language,
    t,
  } = useStore();

  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc' | 'name-asc'>('newest');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);

  // Only published products in public catalog (drafts stay invisible to visitors)
  const publishedProducts = useMemo(() => {
    return products.filter((p) => p.isPublished);
  }, [products]);

  // Filtered and Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...publishedProducts];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedCollection !== 'all') {
      result = result.filter((p) => p.collection === selectedCollection);
    }

    if (selectedSize !== 'all') {
      result = result.filter((p) => p.sizes?.includes(selectedSize));
    }

    // Sort
    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [publishedProducts, selectedCategory, selectedCollection, selectedSize, sortBy]);

  // Open modal if selectedProductId was set from elsewhere
  React.useEffect(() => {
    if (selectedProductId) {
      const found = products.find((p) => p.id === selectedProductId);
      if (found) setActiveModalProduct(found);
    }
  }, [selectedProductId, products]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setSelectedSize('all');
    setSortBy('newest');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedCollection !== 'all' ||
    selectedSize !== 'all' ||
    sortBy !== 'newest';

  const instagramUrl = config.instagramUrl || 'https://www.instagram.com/lamar_rr67/';

  return (
    <div className="py-24 sm:py-28 min-h-screen bg-[#F7F6F1] text-[#171717]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Catalog Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#EAE5D9]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-[#68734D] tracking-widest uppercase">
                STICKERS® STORE
              </span>
              <span className="text-[#C8C2B4]">/</span>
              <span className="text-xs font-mono text-[#787878]">
                {filteredProducts.length} {t.catalog.resultsCount}
              </span>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#171717]">
              {selectedCategory === 'all'
                ? t.catalog.allProducts
                : CATEGORIES.find((c) => c.slug === selectedCategory)?.name[language] || t.catalog.title}
            </h1>
          </div>

          {/* Quick Sort Control */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#555] bg-white border border-[#E7E7E2] rounded-xl px-3 py-2 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#68734D]" />
              <span className="hidden sm:inline">{t.catalog.sortBy}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label={t.catalog.sortBy}
                className="bg-transparent text-[#171717] font-mono text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="newest">{t.catalog.sortOptions.newest}</option>
                <option value="price-asc">{t.catalog.sortOptions.priceAsc}</option>
                <option value="price-desc">{t.catalog.sortOptions.priceDesc}</option>
                <option value="name-asc">{t.catalog.sortOptions.nameAsc}</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="p-2.5 rounded-xl bg-white border border-[#E7E7E2] text-[#666] hover:text-[#171717] hover:border-[#171717] transition-colors shadow-xs"
                title={t.catalog.resetFilters}
                aria-label={t.catalog.resetFilters}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Categories Tab Strip (Including Skateboards) */}
        <div className="pt-6 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#171717] text-white font-bold shadow-md'
                : 'bg-white border border-[#E7E7E2] text-[#666] hover:text-[#171717] hover:border-[#C8C2B4]'
            }`}
          >
            {t.catalog.allProducts}
          </button>
          {CATEGORIES.map((c) => {
            const isSelected = selectedCategory === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#171717] text-white font-bold shadow-md'
                    : 'bg-white border border-[#E7E7E2] text-[#666] hover:text-[#171717] hover:border-[#C8C2B4]'
                }`}
              >
                {c.name[language]}
              </button>
            );
          })}
        </div>

        {/* Secondary Filters Bar (Collections & Sizes) */}
        <div className="py-3 border-b border-[#EAE5D9] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[#888] uppercase tracking-wider text-[11px] font-bold">
              {t.catalog.filterByCollection}:
            </span>
            <button
              onClick={() => setSelectedCollection('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                selectedCollection === 'all'
                  ? 'bg-[#171717] text-white font-bold'
                  : 'text-[#666] hover:text-[#171717]'
              }`}
            >
              {language === 'pt' ? 'Todas' : 'All'}
            </button>
            {COLLECTIONS.map((col) => (
              <button
                key={col.slug}
                onClick={() => setSelectedCollection(col.slug)}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  selectedCollection === col.slug
                    ? 'bg-[#171717] text-white font-bold'
                    : 'text-[#666] hover:text-[#171717]'
                }`}
              >
                {col.name[language]}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 py-1">
            <span className="text-[#888] uppercase tracking-wider text-[11px] font-bold">
              {t.catalog.filterBySize}:
            </span>
            {['all', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`px-2 py-0.5 rounded text-xs transition-colors ${
                  selectedSize === sz
                    ? 'bg-[#171717] text-white font-bold'
                    : 'text-[#666] hover:text-[#171717]'
                }`}
              >
                {sz === 'all' ? (language === 'pt' ? 'Todos' : 'All') : sz}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA: REAL PUBLISHED PRODUCTS or CLEAN STREETWEAR COMPOSITION */}
        <div className="mt-8">
          {publishedProducts.length === 0 ? (
            /* CLEAN BRAND COMPOSITION WHEN NO PRODUCTS ARE PUBLISHED YET (ZERO FAKE PRODUCTS) */
            <ScrollReveal variant="scale" delay={100} className="rounded-3xl border border-[#E7E7E2] bg-white p-8 sm:p-14 lg:p-16 relative overflow-hidden text-center my-6 shadow-sm">
              <div className="max-w-2xl mx-auto space-y-6 relative z-10">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-[#171717] p-3 flex items-center justify-center shadow-lg">
                  <img
                    src="/assets/aistudio/Log_tipo_STICKERS_em_pincel_e23a3350.png"
                    alt="STICKERS®"
                    className="max-h-full max-w-full object-contain filter invert"
                  />
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F6F1] border border-[#EAE5D9] text-xs font-mono text-[#68734D] font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>STICKERS® OFFICIAL STORE</span>
                </div>

                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#171717]">
                  {language === 'pt' ? 'Catálogo Oficial STICKERS®' : 'Official STICKERS® Catalog'}
                </h2>

                <p className="text-sm sm:text-base text-[#666] leading-relaxed max-w-xl mx-auto">
                  {language === 'pt'
                    ? 'Os artigos originais da coleção STICKERS® (t-shirts boxy, hoodies heavyweight e skateboards) estão a ser catalogados diretamente pela nossa equipa com stock e especificações autênticas.'
                    : 'Authentic STICKERS® items (heavyweight tees, hoodies, and maple skateboards) are being cataloged with verified stock and genuine specifications.'}
                </p>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#2c2c2c] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors inline-flex items-center gap-2 shadow-sm"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>{language === 'pt' ? 'Seguir Novidades no Instagram' : 'Follow on Instagram'}</span>
                  </a>
                </div>
              </div>
            </ScrollReveal>
          ) : filteredProducts.length === 0 ? (
            /* When products exist, but none match current filter criteria */
            <ScrollReveal variant="up" className="py-20 text-center space-y-4 bg-white rounded-3xl border border-[#E7E7E2] p-8 shadow-xs">
              <SlidersHorizontal className="w-8 h-8 text-[#888] mx-auto" />
              <p className="font-display text-lg font-bold text-[#171717] uppercase">
                {t.catalog.noProductsInFilter}
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2.5 rounded-xl bg-[#171717] text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors"
              >
                {t.catalog.resetFilters}
              </button>
            </ScrollReveal>
          ) : (
            /* REAL PRODUCTS GRID */
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, idx) => (
                <ScrollReveal
                  key={product.id}
                  variant="up"
                  delay={idx * 60}
                >
                  <ProductCard
                    product={product}
                    onSelect={(p) => setActiveModalProduct(p)}
                  />
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={activeModalProduct}
        onClose={() => {
          setActiveModalProduct(null);
          setSelectedProductId(null);
        }}
      />
    </div>
  );
};
