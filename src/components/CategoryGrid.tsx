import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { CategorySlug } from '../types/store';
import { ScrollReveal } from './ScrollReveal';

export const CategoryGrid: React.FC = () => {
  const { products, language, setSelectedCategory, setSelectedCollection, setActivePage } = useStore();

  const handleCategoryClick = (categorySlug: CategorySlug) => {
    setSelectedCategory(categorySlug);
    setSelectedCollection('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic count of published products in each category
  const getProductCount = (slug: CategorySlug) => {
    return products.filter((p) => p.category === slug && p.isPublished).length;
  };

  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-[#15171D] border-b border-[#E7E7E2] dark:border-[#22252E] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#68734D] dark:text-[#8A9A68] uppercase font-bold block mb-2">
              ESTRUTURA DE PRODUTOS // CATEGORIAS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] transition-colors">
              {language === 'pt' ? 'Explorar por Categoria' : 'Explore by Category'}
            </h2>
          </div>
          <p className="text-xs font-mono text-[#6B7280] dark:text-[#9DA0AC] max-w-xs transition-colors">
            {language === 'pt'
              ? 'Vestuário pesado oversized e decks de skate prensados para durabilidade real.'
              : 'Heavyweight oversized apparel and skate decks pressed for raw durability.'}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, idx) => {
            const count = getProductCount(cat.slug);
            const isSkate = cat.slug === 'skateboards';
            return (
              <ScrollReveal
                key={cat.slug}
                variant="up"
                delay={idx * 50}
              >
                <button
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`w-full group relative p-6 sm:p-7 rounded-3xl border transition-all duration-300 text-left flex flex-col justify-between min-h-[190px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white ${
                    isSkate
                      ? 'bg-[#171717] dark:bg-[#1F222C] text-white border-[#171717] dark:border-[#2F3342] shadow-md'
                      : 'bg-[#F7F6F1] dark:bg-[#1A1C23] hover:bg-white dark:hover:bg-[#1E212A] border-[#E7E7E2] dark:border-[#272A35] hover:border-[#171717] dark:hover:border-[#E7E7E2] text-[#171717] dark:text-[#F5F4F0] shadow-2xs hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-xs font-mono font-bold ${isSkate ? 'text-[#68734D] dark:text-[#8A9A68]' : 'text-[#6B7280] dark:text-[#8E909B]'}`}>
                      0{idx + 1} //
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isSkate
                        ? 'bg-[#262626] dark:bg-[#2A2E3B] text-white group-hover:bg-[#68734D]'
                        : 'bg-white dark:bg-[#252834] border border-[#E7E7E2] dark:border-[#323644] text-[#171717] dark:text-[#F5F4F0] group-hover:bg-[#171717] dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black'
                    }`}>
                      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  <div className="space-y-1 mt-6">
                    <h3 className="font-display text-2xl font-black uppercase tracking-tight leading-tight">
                      {cat.name[language]}
                    </h3>
                    <p className={`text-xs font-mono ${isSkate ? 'text-[#D4D0C5] dark:text-[#B6B5AE]' : 'text-[#6B7280] dark:text-[#9DA0AC]'}`}>
                      {cat.subtitle[language]}
                    </p>
                  </div>

                  <div className={`pt-4 mt-4 border-t flex items-center justify-between text-[11px] font-mono ${
                    isSkate ? 'border-white/10 dark:border-white/10 text-[#9CA3AF] dark:text-[#B6B5AE]' : 'border-[#E7E7E2] dark:border-[#272A35] text-[#6B7280] dark:text-[#9DA0AC]'
                  }`}>
                    <span className="uppercase">{cat.slug}</span>
                    <span className="font-bold">
                      {count} {language === 'pt' ? (count === 1 ? 'Artigo' : 'Artigos') : (count === 1 ? 'Item' : 'Items')}
                    </span>
                  </div>
                </button>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
};
