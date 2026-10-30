import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, ArrowUpRight, Sun, Moon } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ActivePage, CategorySlug } from '../types/store';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    activePage,
    setActivePage,
    selectedCategory,
    setSelectedCategory,
    setSelectedCollection,
    cartCount,
    setIsCartOpen,
    setIsSearchOpen,
    t,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (page: ActivePage, category?: CategorySlug, collection?: string) => {
    if (category) setSelectedCategory(category);
    if (collection) setSelectedCollection(collection as any);
    setActivePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F7F6F1]/90 dark:bg-[#121316]/90 backdrop-blur-md border-b border-[#EAE5D9] dark:border-[#242732] py-3 shadow-xs'
            : 'bg-[#F7F6F1]/95 dark:bg-[#121316]/95 py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Zone 1: Official Logo Tag */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => navigateTo('home')}
                className="group flex items-center gap-2.5 focus-visible:outline-none"
                aria-label="STICKERS® Home"
              >
                {/* Official Brush Logo in high-contrast streetwear frame */}
                <div className="h-10 sm:h-11 w-auto aspect-square rounded-xl bg-[#171717] dark:bg-[#1C1F27] border border-black/10 dark:border-white/10 p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                  <img
                    src="/assets/aistudio/Log_tipo_STICKERS_em_pincel_e23a3350.png"
                    alt="STICKERS®"
                    className="w-full h-full object-contain filter invert dark:invert-0"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-[#171717] dark:text-[#F5F4F0] leading-none transition-colors">
                    STICKERS
                  </span>
                  <span className="text-[10px] font-mono font-bold text-[#68734D] dark:text-[#8A9A68] tracking-widest uppercase transition-colors">
                    SKATE & STREET
                  </span>
                </div>
              </button>
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs font-mono font-semibold tracking-wider uppercase">
              <button
                onClick={() => navigateTo('home')}
                className={`py-1 transition-all ${
                  activePage === 'home'
                    ? 'text-[#171717] dark:text-[#F5F4F0] border-b-2 border-[#171717] dark:border-[#F5F4F0] font-bold'
                    : 'text-[#6B7280] dark:text-[#A0A2AA] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                }`}
              >
                {t.nav.home}
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCollection('all');
                  navigateTo('shop');
                }}
                className={`py-1 transition-all ${
                  activePage === 'shop' && selectedCategory !== 'skateboards'
                    ? 'text-[#171717] dark:text-[#F5F4F0] border-b-2 border-[#171717] dark:border-[#F5F4F0] font-bold'
                    : 'text-[#6B7280] dark:text-[#A0A2AA] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                }`}
              >
                {t.nav.shop}
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('skateboards');
                  setSelectedCollection('all');
                  navigateTo('shop');
                }}
                className={`py-1 transition-all flex items-center gap-1 ${
                  activePage === 'shop' && selectedCategory === 'skateboards'
                    ? 'text-[#68734D] dark:text-[#8A9A68] font-bold border-b-2 border-[#68734D] dark:border-[#8A9A68]'
                    : 'text-[#68734D] dark:text-[#8A9A68] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                }`}
              >
                <span>{t.nav.skates}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#68734D]/15 dark:bg-[#8A9A68]/20 font-mono">
                  NEW
                </span>
              </button>
              <button
                onClick={() => navigateTo('collections')}
                className={`py-1 transition-all ${
                  activePage === 'collections'
                    ? 'text-[#171717] dark:text-[#F5F4F0] border-b-2 border-[#171717] dark:border-[#F5F4F0] font-bold'
                    : 'text-[#6B7280] dark:text-[#A0A2AA] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                }`}
              >
                {t.nav.collections}
              </button>
              <button
                onClick={() => navigateTo('about')}
                className={`py-1 transition-all ${
                  activePage === 'about'
                    ? 'text-[#171717] dark:text-[#F5F4F0] border-b-2 border-[#171717] dark:border-[#F5F4F0] font-bold'
                    : 'text-[#6B7280] dark:text-[#A0A2AA] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                }`}
              >
                {t.nav.about}
              </button>
              <button
                onClick={() => navigateTo('feedback')}
                className={`py-1 transition-all ${
                  activePage === 'feedback'
                    ? 'text-[#171717] dark:text-[#F5F4F0] border-b-2 border-[#171717] dark:border-[#F5F4F0] font-bold'
                    : 'text-[#6B7280] dark:text-[#A0A2AA] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                }`}
              >
                {t.nav.feedback}
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className={`py-1 transition-all ${
                  activePage === 'contact'
                    ? 'text-[#171717] dark:text-[#F5F4F0] border-b-2 border-[#171717] dark:border-[#F5F4F0] font-bold'
                    : 'text-[#6B7280] dark:text-[#A0A2AA] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                }`}
              >
                {t.nav.contact}
              </button>
            </nav>

            {/* Zone 3: Actions (Theme Toggle, Language, Search, Cart, Mobile Menu) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Theme Toggle Button (Light/Dark with Sun/Moon) */}
              <button
                onClick={toggleTheme}
                className="p-2 sm:p-2.5 rounded-xl border border-[#E7E7E2] dark:border-[#292C37] bg-white/80 dark:bg-[#191B21]/80 hover:bg-[#EAE5D9] dark:hover:bg-[#242730] text-[#171717] dark:text-[#F5F4F0] transition-all shadow-2xs group relative"
                aria-label={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
                title={theme === 'dark' ? (language === 'pt' ? 'Mudar para tema claro' : 'Switch to light mode') : (language === 'pt' ? 'Mudar para tema escuro' : 'Switch to dark mode')}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#F5F4F0] group-hover:rotate-45 transition-transform duration-300" />
                ) : (
                  <Moon className="w-4 h-4 text-[#171717] group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>

              {/* Language Switcher */}
              <div className="flex items-center bg-[#EAE5D9] dark:bg-[#1E212A] rounded-xl p-0.5 text-xs font-mono border border-black/5 dark:border-white/5">
                <button
                  onClick={() => setLanguage('pt')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    language === 'pt'
                      ? 'bg-[#171717] dark:bg-[#F5F4F0] text-white dark:text-[#121316] font-bold shadow-xs'
                      : 'text-[#6B7280] dark:text-[#9DA0AC] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                  }`}
                  aria-label="Português"
                >
                  PT
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-lg transition-colors ${
                    language === 'en'
                      ? 'bg-[#171717] dark:bg-[#F5F4F0] text-white dark:text-[#121316] font-bold shadow-xs'
                      : 'text-[#6B7280] dark:text-[#9DA0AC] hover:text-[#171717] dark:hover:text-[#F5F4F0]'
                  }`}
                  aria-label="English"
                >
                  EN
                </button>
              </div>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 sm:p-2.5 text-[#171717] dark:text-[#F5F4F0] hover:bg-[#EAE5D9] dark:hover:bg-[#22252E] rounded-xl transition-colors border border-transparent hover:border-[#E7E7E2] dark:hover:border-[#292C37]"
                aria-label={t.nav.search}
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Shopping Bag Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 bg-[#171717] dark:bg-[#F5F4F0] hover:bg-[#2B2B2B] dark:hover:bg-[#E6E5DF] text-white dark:text-[#121316] rounded-xl transition-all shadow-xs group active:scale-95"
                aria-label={t.nav.cart}
              >
                <ShoppingBag className="w-4 h-4 group-hover:scale-105 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#68734D] dark:bg-[#7E8D5E] text-white text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-[#121316] shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 lg:hidden text-[#171717] dark:text-[#F5F4F0] hover:bg-[#EAE5D9] dark:hover:bg-[#22252E] rounded-xl transition-colors"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Slide-Over Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[64px] sm:top-[68px] z-30 bg-[#F7F6F1]/98 dark:bg-[#121316]/98 backdrop-blur-xl border-t border-[#E7E7E2] dark:border-[#242732] lg:hidden px-6 py-8 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => navigateTo('home')}
                className="text-left font-display text-2xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] hover:text-[#68734D] dark:hover:text-[#8A9A68] flex items-center justify-between py-2.5 border-b border-[#EAE5D9] dark:border-[#22252E]"
              >
                <span>{t.nav.home}</span>
                <ArrowUpRight className="w-5 h-5 text-[#9CA3AF]" />
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCollection('all');
                  navigateTo('shop');
                }}
                className="text-left font-display text-2xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] hover:text-[#68734D] dark:hover:text-[#8A9A68] flex items-center justify-between py-2.5 border-b border-[#EAE5D9] dark:border-[#22252E]"
              >
                <span>{t.nav.shop}</span>
                <ArrowUpRight className="w-5 h-5 text-[#9CA3AF]" />
              </button>
              <button
                onClick={() => {
                  setSelectedCategory('skateboards');
                  setSelectedCollection('all');
                  navigateTo('shop');
                }}
                className="text-left font-display text-2xl font-black uppercase tracking-tight text-[#68734D] dark:text-[#8A9A68] hover:text-[#171717] dark:hover:text-[#F5F4F0] flex items-center justify-between py-2.5 border-b border-[#EAE5D9] dark:border-[#22252E]"
              >
                <span>{t.nav.skates}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#68734D]/15 dark:bg-[#8A9A68]/20 font-mono">
                  NEW DROP
                </span>
              </button>
              <button
                onClick={() => navigateTo('collections')}
                className="text-left font-display text-2xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] hover:text-[#68734D] dark:hover:text-[#8A9A68] flex items-center justify-between py-2.5 border-b border-[#EAE5D9] dark:border-[#22252E]"
              >
                <span>{t.nav.collections}</span>
                <ArrowUpRight className="w-5 h-5 text-[#9CA3AF]" />
              </button>
              <button
                onClick={() => navigateTo('about')}
                className="text-left font-display text-2xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] hover:text-[#68734D] dark:hover:text-[#8A9A68] flex items-center justify-between py-2.5 border-b border-[#EAE5D9] dark:border-[#22252E]"
              >
                <span>{t.nav.about}</span>
                <ArrowUpRight className="w-5 h-5 text-[#9CA3AF]" />
              </button>
              <button
                onClick={() => navigateTo('feedback')}
                className="text-left font-display text-2xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] hover:text-[#68734D] dark:hover:text-[#8A9A68] flex items-center justify-between py-2.5 border-b border-[#EAE5D9] dark:border-[#22252E]"
              >
                <span>{t.nav.feedback}</span>
                <ArrowUpRight className="w-5 h-5 text-[#9CA3AF]" />
              </button>
              <button
                onClick={() => navigateTo('contact')}
                className="text-left font-display text-2xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] hover:text-[#68734D] dark:hover:text-[#8A9A68] flex items-center justify-between py-2.5 border-b border-[#EAE5D9] dark:border-[#22252E]"
              >
                <span>{t.nav.contact}</span>
                <ArrowUpRight className="w-5 h-5 text-[#9CA3AF]" />
              </button>
            </div>

            {/* Mobile Controls: Theme & Language */}
            <div className="pt-4 flex items-center justify-between border-t border-[#EAE5D9] dark:border-[#22252E]">
              <span className="text-xs font-mono text-[#6B7280] dark:text-[#9DA0AC] uppercase">
                {language === 'pt' ? 'Tema da Interface' : 'Interface Theme'}
              </span>
              <button
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded-xl border border-[#E7E7E2] dark:border-[#292C37] bg-white dark:bg-[#1E212A] text-xs font-mono font-bold flex items-center gap-2 text-[#171717] dark:text-[#F5F4F0]"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-[#F5F4F0]" />
                    <span>Claro</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-[#171717]" />
                    <span>Escuro</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#EAE5D9] dark:border-[#22252E] text-xs font-mono text-[#6B7280] dark:text-[#8E8D88] space-y-1">
            <p className="font-bold text-[#171717] dark:text-[#F5F4F0]">STICKERS® OFFICIAL STORE</p>
            <p>MAPUTO, MOÇAMBIQUE · SKATE & STREETWEAR</p>
          </div>
        </div>
      )}
    </>
  );
};
