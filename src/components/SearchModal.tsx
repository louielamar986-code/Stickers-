import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types/store';

export const SearchModal: React.FC = () => {
  const {
    products,
    isSearchOpen,
    setIsSearchOpen,
    setSelectedProductId,
    setActivePage,
    formatPrice,
    language,
    t,
  } = useStore();

  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const published = products.filter((p) => p.isPublished);
  const searchResults = query.trim()
    ? published.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectProduct = (product: Product) => {
    setSelectedProductId(product.id);
    setActivePage('shop');
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 px-4">
      <div className="relative w-full max-w-2xl bg-white border border-[#E7E7E2] rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-[#171717]">
        {/* Input Bar */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#EAE5D9] bg-[#F7F6F1]">
          <Search className="w-5 h-5 text-[#68734D]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.catalog.searchPlaceholder}
            className="flex-1 bg-transparent text-sm font-mono text-[#171717] placeholder-[#888] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs font-mono text-[#888] hover:text-[#171717]"
            >
              Limpar
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-[#888] hover:text-[#171717] hover:bg-[#EAE5D9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 divide-y divide-[#F7F6F1]">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs font-mono text-[#888] space-y-2">
              <p>
                {language === 'pt'
                  ? 'Pesquise artigos por nome, modelo ou categoria (t-shirts, hoodies, skateboards).'
                  : 'Search items by name, model or category (t-shirts, hoodies, skateboards).'}
              </p>
              <p className="text-[11px] text-[#68734D] font-bold">
                {published.length === 0
                  ? (language === 'pt' ? 'Catálogo oficial STICKERS®' : 'Official STICKERS® catalog')
                  : `${published.length} ${language === 'pt' ? 'artigos registados.' : 'registered items.'}`}
              </p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-[#888]">
              <p>
                {language === 'pt' ? 'Nenhuma peça encontrada para' : 'No items found for'} "{query}".
              </p>
            </div>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.id}
                onClick={() => handleSelectProduct(product)}
                className="py-3 px-3 rounded-2xl hover:bg-[#F7F6F1] cursor-pointer flex items-center justify-between transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-14 rounded-xl bg-[#EAE5D9] border border-[#E7E7E2] overflow-hidden shrink-0 flex items-center justify-center">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-[8px] font-bold text-[#888]">STICKERS</span>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#68734D] font-bold uppercase">
                      {product.category}
                    </span>
                    <h4 className="font-display font-bold text-sm text-[#171717] group-hover:text-[#68734D] transition-colors">
                      {product.name}
                    </h4>
                    <span className="text-xs font-mono font-bold text-[#171717]">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-[#888] group-hover:text-[#171717]">
                  <span>{language === 'pt' ? 'Ver' : 'View'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-2.5 bg-[#F7F6F1] border-t border-[#EAE5D9] flex items-center justify-between text-[11px] font-mono text-[#888]">
          <span>STICKERS® CATALOG SEARCH</span>
          <span>ESC para fechar</span>
        </div>
      </div>
    </div>
  );
};
