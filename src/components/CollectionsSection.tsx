import React from 'react';
import { ArrowRight } from 'lucide-react';
import { COLLECTIONS } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { CollectionSlug } from '../types/store';
import { ScrollReveal } from './ScrollReveal';

export const CollectionsSection: React.FC = () => {
  const { language, setSelectedCollection, setSelectedCategory, setActivePage } = useStore();

  const handleCollectionSelect = (slug: CollectionSlug) => {
    setSelectedCollection(slug);
    setSelectedCategory('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#F7F6F1] dark:bg-[#121316] border-b border-[#E7E7E2] dark:border-[#22252E] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal variant="up" className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#68734D] dark:text-[#8A9A68] font-bold uppercase block mb-2">
              SÉRIES & DROPS ESPECIAIS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] transition-colors">
              {language === 'pt' ? 'Coleções STICKERS®' : 'STICKERS® Collections'}
            </h2>
          </div>
          <p className="text-xs font-mono text-[#6B7280] dark:text-[#9DA0AC] max-w-xs transition-colors">
            {language === 'pt'
              ? 'Lançamentos controlados e edições com tiragem numerada.'
              : 'Controlled drops and numbered limited capsule runs.'}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLLECTIONS.map((col, idx) => (
            <ScrollReveal
              key={col.slug}
              variant="up"
              delay={idx * 80}
            >
              <div className="p-7 rounded-3xl bg-white dark:bg-[#191B21] border border-[#E7E7E2] dark:border-[#292C37] hover:border-[#171717] dark:hover:border-white transition-all duration-300 flex flex-col justify-between group h-full shadow-2xs hover:shadow-md">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-4">
                    <span className="text-[#68734D] dark:text-[#8A9A68] font-bold">0{idx + 1}</span>
                    <span className="text-[#6B7280] dark:text-[#B6B8C2] bg-[#EAE5D9] dark:bg-[#252834] px-2.5 py-0.5 rounded-full font-semibold">
                      {col.tag[language]}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] mb-2 group-hover:text-[#68734D] dark:group-hover:text-[#8A9A68] transition-colors">
                    {col.name[language]}
                  </h3>

                  <p className="text-xs text-[#6B7280] dark:text-[#A0A2AE] leading-relaxed">
                    {col.description[language]}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EAE5D9] dark:border-[#272A35]">
                  <button
                    onClick={() => handleCollectionSelect(col.slug)}
                    className="w-full flex items-center justify-between text-xs font-display font-bold uppercase tracking-wider text-[#171717] dark:text-[#F5F4F0] group-hover:text-[#68734D] dark:group-hover:text-[#8A9A68] transition-colors"
                  >
                    <span>{language === 'pt' ? 'Ver Coleção' : 'View Collection'}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
