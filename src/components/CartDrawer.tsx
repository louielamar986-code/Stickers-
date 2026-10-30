import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  CreditCard,
  MessageSquare,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount,
    formatPrice,
    getWhatsAppUrl,
    setActivePage,
    t,
  } = useStore();

  const [whatsappError, setWhatsappError] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    const { url, configured } = getWhatsAppUrl();
    if (!configured) {
      setWhatsappError(true);
      return;
    }
    setWhatsappError(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    setActivePage('shop');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F6F1] border-l border-[#EAE5D9] shadow-2xl flex flex-col justify-between text-[#171717]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#EAE5D9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#171717]" />
              <h2 className="font-display text-lg font-black uppercase tracking-tight text-[#171717]">
                {t.cart.title}
              </h2>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-[#EAE5D9] text-[#171717]">
                {cartCount}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-xl text-[#777] hover:text-[#171717] hover:bg-[#F7F6F1] transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto px-6 py-6 divide-y divide-[#EAE5D9]">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-[#E7E7E2] flex items-center justify-center text-[#888] shadow-xs">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#171717]">
                    {t.cart.emptyTitle}
                  </h3>
                  <p className="text-xs text-[#777] max-w-xs">
                    {t.cart.emptySubtitle}
                  </p>
                </div>
                <button
                  onClick={handleContinueShopping}
                  className="mt-4 px-6 py-3 rounded-xl bg-[#171717] text-white font-display text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors shadow-sm"
                >
                  {t.cart.continueShopping}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4 items-start">
                  {/* Thumbnail */}
                  <div className="w-20 h-24 rounded-xl bg-white border border-[#E7E7E2] overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                    {item.product.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-[10px] font-mono font-bold text-[#888] p-1 text-center">
                        STICKERS
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between h-24">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display text-sm font-bold text-[#171717] uppercase leading-tight line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#999] hover:text-[#d32f2f] transition-colors"
                          aria-label={t.cart.remove}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-[#666] mt-1">
                        <span>{t.cart.size}: <strong className="text-[#171717]">{item.selectedSize}</strong></span>
                        <span>·</span>
                        <span>{t.cart.color}: <strong className="text-[#171717]">{item.selectedColor}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Stepper */}
                      <div className="flex items-center bg-white border border-[#E7E7E2] rounded-lg shadow-xs">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-[#666] hover:text-[#171717]"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-mono text-xs font-bold text-[#171717] tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-[#666] hover:text-[#171717]"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-[#171717] tabular-nums">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & WhatsApp Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#EAE5D9] bg-white space-y-4">
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-[#666]">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-bold text-[#171717] tabular-nums">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#666]">
                  <span>{t.cart.deliveryFee}</span>
                  <span className="text-[11px] text-[#68734D] font-bold">
                    {t.cart.deliveryNotice}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#EAE5D9] flex items-center justify-between text-sm font-bold text-[#171717]">
                  <span>{t.cart.total}</span>
                  <span className="text-base text-[#171717] tabular-nums">
                    {formatPrice(cartSubtotal)}
                  </span>
                </div>
              </div>

              {/* WhatsApp Not Configured Alert */}
              {whatsappError && (
                <div className="p-3 rounded-xl bg-[#fff0f0] border border-[#fcc] text-xs text-[#d32f2f] space-y-1">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>{t.cart.whatsappNotConfigured}</p>
                  </div>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-black font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/20 active:scale-[0.98]"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>{t.cart.checkoutWhatsApp}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Payment Methods Notice (M-Pesa / e-Mola) */}
              <div className="pt-1 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-[11px] font-mono text-[#68734D] font-bold">
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pagamentos: M-Pesa · e-Mola</span>
                </div>
                <p className="text-[10px] text-[#888] leading-tight">
                  {t.cart.whatsappNotice}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
