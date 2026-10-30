import React from 'react';
import { MessageSquare, Instagram, MapPin, Clock, CreditCard, ArrowUpRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ScrollReveal } from './ScrollReveal';

export const ContactView: React.FC = () => {
  const { config, t } = useStore();

  const cleanWhatsApp = (config.whatsappNumber || '258841234567').replace(/\D/g, '');
  const isWhatsAppConfigured = Boolean(cleanWhatsApp);
  const instagramUrl = config.instagramUrl || 'https://www.instagram.com/lamar_rr67/';

  return (
    <div className="py-24 sm:py-28 min-h-screen bg-[#F7F6F1] text-[#171717]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <ScrollReveal variant="up" className="space-y-3 border-b border-[#EAE5D9] pb-8">
          <span className="text-xs font-mono font-bold text-[#68734D] tracking-widest uppercase block">
            ATENDIMENTO OFICIAL // DIRECT CARE
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#171717]">
            {t.contact.title}
          </h1>
          <p className="text-base text-[#666]">
            {t.contact.subtitle}
          </p>
        </ScrollReveal>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* WhatsApp Card */}
          <ScrollReveal variant="up" delay={50}>
            <div className="p-7 rounded-3xl bg-white border border-[#E7E7E2] flex flex-col justify-between space-y-6 h-full shadow-xs">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#25D366]/15 flex items-center justify-center text-[#25D366]">
                  <MessageSquare className="w-6 h-6 fill-current" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#171717]">
                  {t.contact.whatsappTitle}
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  {t.contact.whatsappDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F7F6F1]">
                {isWhatsAppConfigured ? (
                  <a
                    href={`https://wa.me/${cleanWhatsApp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{t.contact.openWhatsAppBtn}</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : null}
              </div>
            </div>
          </ScrollReveal>

          {/* Instagram Card */}
          <ScrollReveal variant="up" delay={120}>
            <div className="p-7 rounded-3xl bg-white border border-[#E7E7E2] flex flex-col justify-between space-y-6 h-full shadow-xs">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#e1306c]/15 flex items-center justify-center text-[#e1306c]">
                  <Instagram className="w-6 h-6" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#171717]">
                  {t.contact.socialTitle}
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  {t.contact.socialDesc}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F7F6F1]">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>@lamar_rr67</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Operating info & Payment Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <ScrollReveal variant="up" delay={180}>
            <div className="p-6 rounded-3xl bg-white border border-[#E7E7E2] space-y-3 h-full shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#68734D] uppercase">
                <MapPin className="w-4 h-4" />
                <span>{t.contact.locationTitle}</span>
              </div>
              <p className="text-sm font-display font-bold text-[#171717]">
                {t.contact.locationDesc}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#777] pt-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{t.contact.businessHours}</span>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal variant="up" delay={240}>
            <div className="p-6 rounded-3xl bg-white border border-[#E7E7E2] space-y-3 h-full shadow-xs">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#68734D] uppercase">
                <CreditCard className="w-4 h-4" />
                <span>Métodos Oficiais de Liquidação</span>
              </div>
              <p className="text-sm font-display font-bold text-[#171717]">
                M-Pesa · e-Mola
              </p>
              <p className="text-xs text-[#777] leading-relaxed pt-1">
                O pagamento só é efetuado após confirmação do tamanho, especificações e endereço de entrega pela equipa STICKERS® no WhatsApp.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};
