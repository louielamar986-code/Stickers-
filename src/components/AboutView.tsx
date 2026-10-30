import React from 'react';
import { Compass, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ScrollReveal } from './ScrollReveal';

export const AboutView: React.FC = () => {
  const { setActivePage, t } = useStore();

  return (
    <div className="py-24 sm:py-28 min-h-screen bg-[#F7F6F1] text-[#171717]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Editorial Title */}
        <ScrollReveal variant="up" className="space-y-4 border-b border-[#EAE5D9] pb-10">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#68734D] tracking-widest uppercase">
            <Compass className="w-4 h-4" />
            <span>MANIFESTO OFICIAL // 2026</span>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#171717] leading-[0.95]">
            {t.about.title}
          </h1>
          <p className="text-lg sm:text-xl text-[#555] font-normal max-w-2xl">
            {t.about.tagline}
          </p>
        </ScrollReveal>

        {/* Story Section 1: Origin & Streetwear Ethos */}
        <ScrollReveal variant="up" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4">
            <span className="text-xs font-mono font-bold text-[#68734D] uppercase tracking-wider block mb-2">
              01 // ORIGEM & CULTURA
            </span>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#171717]">
              {t.about.originTitle}
            </h2>
          </div>
          <div className="md:col-span-8 text-base text-[#444] leading-relaxed space-y-4">
            <p>{t.about.originText}</p>
            <p className="text-sm text-[#666]">
              A STICKERS® nasce do asfalto, da fricção da lixa do skate, dos ritmos do hip-hop e da energia underground de jovens independentes. Uma marca feita para resistir e expressar identidade sem artifícios.
            </p>
          </div>
        </ScrollReveal>

        {/* Visual Break with Skate / Streetwear mood */}
        <ScrollReveal variant="scale" className="rounded-3xl overflow-hidden border border-[#E7E7E2] aspect-[16/9] relative shadow-md">
          <img
            src="/src/assets/images/stickers_brutalist_mood_1793376826330.jpg"
            alt="STICKERS Architectural Ethos"
            className="w-full h-full object-cover filter contrast-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs font-mono text-white">
            <span className="font-bold">STICKERS® ARCHIVE // MAPUTO</span>
            <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full">HEAVYWEIGHT & SKATE</span>
          </div>
        </ScrollReveal>

        {/* Story Section 2: Craft & Matter */}
        <ScrollReveal variant="up" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-6 border-t border-[#EAE5D9]">
          <div className="md:col-span-4">
            <span className="text-xs font-mono font-bold text-[#68734D] uppercase tracking-wider block mb-2">
              02 // A MATÉRIA
            </span>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#171717]">
              {t.about.craftTitle}
            </h2>
          </div>
          <div className="md:col-span-8 text-base text-[#444] leading-relaxed space-y-4">
            <p>{t.about.craftText}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-5 rounded-2xl bg-white border border-[#E7E7E2] shadow-xs">
                <span className="font-mono text-xl font-black text-[#171717] block">240-450</span>
                <span className="text-xs font-mono text-[#68734D] font-bold">GSM Heavyweight</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#E7E7E2] shadow-xs">
                <span className="font-mono text-xl font-black text-[#171717] block">BOXY</span>
                <span className="text-xs font-mono text-[#68734D] font-bold">Skate Silhouette</span>
              </div>
              <div className="p-5 rounded-2xl bg-white border border-[#E7E7E2] shadow-xs">
                <span className="font-mono text-xl font-black text-[#171717] block">MAPLE</span>
                <span className="text-xs font-mono text-[#68734D] font-bold">7-Ply Skateboard Decks</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Story Section 3: Mozambique to the World */}
        <ScrollReveal variant="up" className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-6 border-t border-[#EAE5D9]">
          <div className="md:col-span-4">
            <span className="text-xs font-mono font-bold text-[#68734D] uppercase tracking-wider block mb-2">
              03 // ALCANCE
            </span>
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight text-[#171717]">
              {t.about.cultureTitle}
            </h2>
          </div>
          <div className="md:col-span-8 text-base text-[#444] leading-relaxed space-y-4">
            <p>{t.about.cultureText}</p>
            <p className="text-sm text-[#666]">
              A partir de Maputo com entregas em todo o território nacional e canais diretos de atendimento via WhatsApp, preparando a rota para o cenário internacional do streetwear.
            </p>

            <div className="pt-4">
              <button
                onClick={() => {
                  setActivePage('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-[#171717] text-white font-display font-bold text-xs uppercase tracking-wider hover:bg-[#333] transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>Explorar o Catálogo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
