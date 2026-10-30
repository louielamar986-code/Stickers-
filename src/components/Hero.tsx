import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ScrollReveal } from './ScrollReveal';

export const Hero: React.FC = () => {
  const { setActivePage, setSelectedCategory, setSelectedCollection, t } = useStore();

  const handleExplore = () => {
    setSelectedCategory('all');
    setSelectedCollection('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSkates = () => {
    setSelectedCategory('skateboards');
    setSelectedCollection('all');
    setActivePage('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAbout = () => {
    setActivePage('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[88vh] flex flex-col justify-between pt-28 sm:pt-32 pb-10 overflow-hidden bg-[#F7F6F1] dark:bg-[#121316] border-b border-[#E7E7E2] dark:border-[#22252E] transition-colors duration-200">
      {/* Subtle atmospheric ambient glow & soft textures */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[350px] bg-[#EAE5D9]/70 dark:bg-[#1C1F27]/70 blur-[120px] rounded-full pointer-events-none transition-colors" />
      <div className="absolute bottom-1/3 left-10 w-[400px] h-[300px] bg-[#68734D]/10 dark:bg-[#8A9A68]/10 blur-[100px] rounded-full pointer-events-none transition-colors" />

      {/* Main Hero Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Typography & CTAs (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal variant="up" delay={50}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAE5D9] dark:bg-[#22252E] border border-black/5 dark:border-white/5 text-[#68734D] dark:text-[#8A9A68] text-xs font-mono font-bold uppercase tracking-wider transition-colors">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{t.hero.badge}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={120}>
              <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-[#171717] dark:text-[#F5F4F0] leading-[0.94] uppercase transition-colors">
                American Streetwear.{' '}
                <span className="block text-[#68734D] dark:text-[#8A9A68] hover:text-[#171717] dark:hover:text-white transition-colors duration-300">
                  Skate Culture.
                </span>
              </h1>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={200}>
              <p className="text-base sm:text-lg text-[#4B5563] dark:text-[#A8ABB6] max-w-xl font-normal leading-relaxed transition-colors">
                {t.hero.subtitle}
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal variant="up" delay={280} className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={handleExplore}
                className="group px-7 py-3.5 rounded-xl bg-[#171717] dark:bg-[#F5F4F0] hover:bg-[#2B2B2B] dark:hover:bg-[#E5E4DE] text-white dark:text-[#121316] font-display font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm active:scale-95"
              >
                <span>{t.hero.exploreBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleSkates}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-[#1E212A] border border-[#E7E7E2] dark:border-[#2C303E] text-[#171717] dark:text-[#F5F4F0] hover:border-[#171717] dark:hover:border-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs"
              >
                <span>{t.hero.skateBtn}</span>
              </button>

              <button
                onClick={handleAbout}
                className="px-5 py-3.5 rounded-xl text-[#6B7280] dark:text-[#9DA0AC] hover:text-[#171717] dark:hover:text-[#F5F4F0] font-mono text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5"
              >
                <Compass className="w-4 h-4 text-[#68734D] dark:text-[#8A9A68]" />
                <span>{t.hero.aboutBtn}</span>
              </button>
            </ScrollReveal>

            <ScrollReveal variant="up" delay={320} className="pt-2 flex items-center gap-2 text-xs font-mono text-[#6B7280] dark:text-[#8E909B] transition-colors">
              <ShieldCheck className="w-4 h-4 text-[#68734D] dark:text-[#8A9A68]" />
              <span>Moçambique & Envios Nacionais · Pagamentos via M-Pesa / e-Mola</span>
            </ScrollReveal>
          </div>

          {/* Right Column: Hero Visual Asset with Official Logo (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <ScrollReveal variant="scale" delay={150} className="w-full max-w-md">
              <div className="relative rounded-3xl overflow-hidden bg-[#171717] dark:bg-[#181A21] p-8 sm:p-10 text-white shadow-xl flex flex-col items-center justify-center text-center aspect-square border border-[#333333] dark:border-[#292D39]">
                {/* Official Brush Logo in center */}
                <div className="w-full max-w-[280px] aspect-square flex items-center justify-center p-2">
                  <img
                    src="/assets/aistudio/Log_tipo_STICKERS_em_pincel_e23a3350.png"
                    alt="STICKERS® Official Brush Logo"
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 w-full flex items-center justify-between text-[11px] font-mono text-[#EAE5D9]">
                  <span>MAPUTO · MOZAMBIQUE</span>
                  <span className="text-[#68734D] dark:text-[#8A9A68] font-bold">EST. 2026</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Marquee Ticker Strip */}
      <div className="relative z-10 mt-12 py-3 bg-[#171717] dark:bg-[#16181F] border-y border-black/10 dark:border-white/5 text-[#FFFFFF] overflow-hidden select-none">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-mono tracking-wider uppercase">
          {t.hero.ticker.map((item, idx) => (
            <React.Fragment key={idx}>
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#68734D] dark:bg-[#8A9A68]" />
                {item}
              </span>
              <span className="text-[#6B7280] dark:text-[#525665]">///</span>
            </React.Fragment>
          ))}
          {t.hero.ticker.map((item, idx) => (
            <React.Fragment key={`rep-${idx}`}>
              <span className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#68734D] dark:bg-[#8A9A68]" />
                {item}
              </span>
              <span className="text-[#6B7280] dark:text-[#525665]">///</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
