import React from 'react';
import { Layers, Scissors, Shield, MessageSquare } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ScrollReveal } from './ScrollReveal';

export const BrandManifesto: React.FC = () => {
  const { t } = useStore();

  const iconList = [
    <Layers className="w-5 h-5 text-[#68734D] dark:text-[#8A9A68]" key="layers" />,
    <Scissors className="w-5 h-5 text-[#171717] dark:text-[#F5F4F0]" key="scissors" />,
    <Shield className="w-5 h-5 text-[#68734D] dark:text-[#8A9A68]" key="shield" />,
    <MessageSquare className="w-5 h-5 text-[#171717] dark:text-[#F5F4F0]" key="messagesquare" />,
  ];

  return (
    <section className="py-20 sm:py-24 bg-white dark:bg-[#15171D] border-b border-[#E7E7E2] dark:border-[#22252E] relative overflow-hidden transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ScrollReveal variant="up" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          <div className="lg:col-span-5">
            <span className="text-xs font-mono tracking-widest text-[#68734D] dark:text-[#8A9A68] uppercase font-bold block mb-3">
              {t.manifesto.kicker}
            </span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0] leading-[1.04] transition-colors">
              {t.manifesto.title}
            </h2>
          </div>

          <div className="lg:col-span-7 space-y-4 text-base sm:text-lg text-[#4B5563] dark:text-[#A8ABB6] leading-relaxed transition-colors">
            <p>{t.manifesto.text1}</p>
            <p className="text-sm sm:text-base text-[#6B7280] dark:text-[#8E909B]">{t.manifesto.text2}</p>
          </div>
        </ScrollReveal>

        {/* 4 Brand Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.manifesto.values.map((v, i) => (
            <ScrollReveal
              key={i}
              variant="up"
              delay={i * 70}
            >
              <div className="p-7 rounded-3xl bg-[#F7F6F1] dark:bg-[#1A1C23] border border-[#E7E7E2] dark:border-[#272A35] hover:border-[#171717] dark:hover:border-white transition-all group flex flex-col justify-between h-full shadow-2xs">
                <div>
                  <div className="w-11 h-11 rounded-2xl bg-white dark:bg-[#22252E] border border-[#E7E7E2] dark:border-[#323644] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-2xs">
                    {iconList[i % iconList.length]}
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#171717] dark:text-[#F5F4F0] mb-2 uppercase tracking-wide transition-colors">
                    {v.title}
                  </h3>
                  <p className="text-xs text-[#6B7280] dark:text-[#9DA0AC] leading-relaxed">{v.desc}</p>
                </div>
                <div className="pt-6 mt-6 border-t border-[#EAE5D9] dark:border-[#272A35] flex items-center justify-between text-[11px] font-mono text-[#9CA3AF] dark:text-[#8E909B]">
                  <span>PILAR // 0{i + 1}</span>
                  <span className="text-[#68734D] dark:text-[#8A9A68] font-bold">STICKERS®</span>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Brutalist Editorial Mood Card */}
        <ScrollReveal variant="scale" delay={120} className="mt-14 rounded-3xl overflow-hidden border border-[#E7E7E2] dark:border-[#2A2E3C] relative bg-[#171717] dark:bg-[#181A21] text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 h-64 sm:h-80 lg:h-96 relative overflow-hidden">
              <img
                src="/src/assets/images/stickers_brutalist_mood_1793376826330.jpg"
                alt="STICKERS Architectural Skate Mood"
                className="w-full h-full object-cover object-center filter contrast-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/40 to-[#171717] dark:to-[#181A21]" />
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 space-y-4">
              <span className="text-xs font-mono tracking-widest text-[#68734D] dark:text-[#8A9A68] uppercase font-bold block">
                MAPUTO ARCHIVE // 2026
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white leading-tight">
                A Cidade Como Tela.
              </h3>
              <p className="text-sm text-[#D4D0C5] dark:text-[#C5C3BC] leading-relaxed">
                Cada peça e cada deck da STICKERS® reflete a energia das ruas e das esquinas de Maputo aliada ao design intemporal do skate internacional. Algodão pesado, caimento descontraído e madeira canadiana sem cedências.
              </p>
              <div className="pt-4 flex items-center gap-4 text-xs font-mono text-[#9CA3AF] dark:text-[#8E909B]">
                <span>HEAVYWEIGHT</span>
                <span>·</span>
                <span>SKATE DECKS</span>
                <span>·</span>
                <span>NO FAST FASHION</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
