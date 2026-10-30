import React, { useRef } from 'react';
import { ArrowUpRight, MessageSquare, Instagram, Video, Youtube } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { useStore } from '../context/StoreContext';
import { CategorySlug, ActivePage } from '../types/store';

export const Footer: React.FC = () => {
  const {
    language,
    setLanguage,
    setActivePage,
    setSelectedCategory,
    setSelectedCollection,
    config,
    triggerSecretAuth,
    t,
  } = useStore();

  const tapCountRef = useRef(0);
  const lastTapTimeRef = useRef(0);

  // Hidden 5-tap touch trigger for secret Studio authentication on mobile
  const handleSecretTap = () => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < 800) {
      tapCountRef.current += 1;
    } else {
      tapCountRef.current = 1;
    }
    lastTapTimeRef.current = now;

    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      triggerSecretAuth();
    }
  };

  const handleCategoryClick = (slug: CategorySlug) => {
    setSelectedCategory(slug);
    setSelectedCollection('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (page: ActivePage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cleanWhatsApp = (config.whatsappNumber || '').replace(/\D/g, '');
  const instagramUrl = config.instagramUrl || 'https://www.instagram.com/lamar_rr67/';
  const tiktokUrl = config.tiktokUrl;
  const isTiktokActive = config.tiktokActive;
  const youtubeUrl = config.youtubeUrl;
  const isYoutubeActive = config.youtubeActive;

  return (
    <footer className="bg-[#EAE5D9] border-t border-[#DED8CA] text-[#171717] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#D8D2C2]">
          {/* Brand Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-10 px-3.5 rounded-xl bg-[#171717] flex items-center justify-center shadow-xs">
                <img
                  src="/assets/aistudio/Log_tipo_STICKERS_em_pincel_e23a3350.png"
                  alt="STICKERS®"
                  className="h-7 w-auto object-contain filter invert"
                />
              </div>
            </div>

            <p className="text-xs text-[#555] leading-relaxed max-w-sm">
              {t.footer.brandDesc}
            </p>

            <div className="text-xs font-mono text-[#68734D] font-bold space-y-0.5">
              <p>MAPUTO, MOÇAMBIQUE</p>
              <p>HEAVYWEIGHT STREETWEAR & SKATEBOARDING · 2026</p>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white border border-[#D8D2C2] text-[#171717] hover:bg-[#171717] hover:text-white transition-colors flex items-center justify-center shadow-xs"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>

              {isTiktokActive && tiktokUrl && (
                <a
                  href={tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white border border-[#D8D2C2] text-[#171717] hover:bg-[#171717] hover:text-white transition-colors flex items-center justify-center shadow-xs"
                  title="TikTok"
                >
                  <Video className="w-4 h-4" />
                </a>
              )}

              {isYoutubeActive && youtubeUrl && (
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-xl bg-white border border-[#D8D2C2] text-[#171717] hover:bg-[#171717] hover:text-white transition-colors flex items-center justify-center shadow-xs"
                  title="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Navigation Links (2 Cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717]">
              {t.footer.navigation}
            </h4>
            <ul className="space-y-2 text-xs font-medium text-[#555]">
              <li>
                <button
                  onClick={() => handlePageClick('home')}
                  className="hover:text-[#171717] hover:underline transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('shop')}
                  className="hover:text-[#171717] hover:underline transition-colors"
                >
                  {t.nav.shop}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('collections')}
                  className="hover:text-[#171717] hover:underline transition-colors"
                >
                  {t.nav.collections}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('about')}
                  className="hover:text-[#171717] hover:underline transition-colors"
                >
                  {t.nav.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('contact')}
                  className="hover:text-[#171717] hover:underline transition-colors"
                >
                  {t.nav.contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handlePageClick('feedback')}
                  className="hover:text-[#171717] hover:underline transition-colors font-bold text-[#68734D]"
                >
                  {language === 'pt' ? 'Dar Feedback' : 'Give Feedback'}
                </button>
              </li>
            </ul>
          </div>

          {/* Categories (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717]">
              {t.footer.categories}
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-xs text-[#555]">
              {CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <button
                    onClick={() => handleCategoryClick(cat.slug)}
                    className="hover:text-[#171717] hover:underline transition-colors text-left font-medium"
                  >
                    {cat.name[language]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support & Payments (3 Cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171717]">
              {t.footer.support}
            </h4>
            <p className="text-xs text-[#555] leading-relaxed">
              {t.footer.paymentNotice}
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-white border border-[#D8D2C2] text-xs font-mono font-bold text-[#171717] shadow-2xs">
                M-Pesa
              </span>
              <span className="px-3 py-1 rounded-lg bg-white border border-[#D8D2C2] text-xs font-mono font-bold text-[#171717] shadow-2xs">
                e-Mola
              </span>
            </div>

            <div className="pt-2">
              {cleanWhatsApp ? (
                <a
                  href={`https://wa.me/${cleanWhatsApp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#171717] hover:underline"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#25D366] fill-current" />
                  <span>WhatsApp Oficial</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Language, Secret Touch Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono text-[#666]">
          {/* Secret Touch Trigger on Copyright (5 taps opens auth modal for mobile) */}
          <div
            onClick={handleSecretTap}
            className="cursor-default select-none transition-opacity hover:opacity-80"
            title="STICKERS®"
          >
            <p>© {new Date().getFullYear()} STICKERS®. {t.footer.allRights}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switch */}
            <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-[#D8D2C2] shadow-2xs">
              <button
                onClick={() => setLanguage('pt')}
                className={`transition-colors ${
                  language === 'pt' ? 'text-[#171717] font-black underline' : 'text-[#888] hover:text-[#171717]'
                }`}
              >
                PT
              </button>
              <span className="text-[#bbb]">/</span>
              <button
                onClick={() => setLanguage('en')}
                className={`transition-colors ${
                  language === 'en' ? 'text-[#171717] font-black underline' : 'text-[#888] hover:text-[#171717]'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
