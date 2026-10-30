import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  Check,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  MessageCircle,
  Layers,
} from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { formatPrice, addToCart, language, getWhatsAppUrl, t } = useStore();

  if (!product) return null;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors?.[0]?.name || 'Padrão'
  );
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const currentImage = images[selectedImageIndex] || null;

  // Stock for selected variant
  const variantKey = `${selectedSize}_${selectedColor}`;
  const variantStock =
    product.stockByVariant?.[variantKey] ??
    product.stockByVariant?.[selectedSize] ??
    10;

  const isOutOfStock = variantStock <= 0;
  const isSkateboard = product.category === 'skateboards';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppDirect = () => {
    const { url, configured } = getWhatsAppUrl();
    if (!configured) {
      alert(t.cart.whatsappNotConfigured);
      return;
    }
    const greeting = language === 'pt' ? 'Olá STICKERS! Tenho interesse no artigo:' : 'Hello STICKERS! I am interested in this item:';
    const singleMsg = `${greeting}\n\n• ${product.name}\n- ${t.cart.size}: ${selectedSize}\n- ${t.cart.color}: ${selectedColor}\n- Qtd: ${quantity}\n- Preço: ${formatPrice(product.price * quantity)}\n\nGostaria de confirmar a disponibilidade e saber como proceder com o pagamento por M-Pesa ou e-Mola.`;
    const cleanNumber = url.split('wa.me/')[1]?.split('?')[0];
    const directUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(singleMsg)}`;
    window.open(directUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 lg:p-8 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#181A20] border border-[#E7E7E2] dark:border-[#272A35] rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#171717] dark:text-[#F5F4F0]">
        {/* Top Bar with Breadcrumbs & Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EAE5D9] dark:border-[#242732] bg-[#F7F6F1] dark:bg-[#14151B]">
          <div className="flex items-center gap-2 text-xs font-mono text-[#6B7280] dark:text-[#9DA0AC]">
            <span className="uppercase text-[#68734D] dark:text-[#8A9A68] font-bold">{product.category}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="uppercase">{product.collection.replace('-', ' ')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#171717] dark:text-[#F5F4F0] font-bold truncate max-w-[200px]">{product.name}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#6B7280] dark:text-[#9DA0AC] hover:text-[#171717] dark:hover:text-[#F5F4F0] hover:bg-[#EAE5D9] dark:hover:bg-[#22252E] transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Two-Column Split (Gallery Left, Purchase Module Right) */}
        <div className="overflow-y-auto flex-1 grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#EAE5D9] dark:divide-[#242732]">
          {/* Gallery Left (7 Cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-[#F7F6F1] dark:bg-[#14151B]">
            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] w-full rounded-2xl bg-white dark:bg-[#181A20] border border-[#E7E7E2] dark:border-[#272A35] overflow-hidden flex items-center justify-center shadow-xs">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={product.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="p-8 text-center space-y-2">
                  <span className="text-xs font-mono text-[#68734D] dark:text-[#8A9A68] uppercase tracking-widest font-bold block">
                    STICKERS® ARCHIVE
                  </span>
                  <p className="font-display font-black text-xl text-[#171717] dark:text-[#F5F4F0] uppercase">
                    {product.name}
                  </p>
                  <p className="text-xs font-mono text-[#6B7280] dark:text-[#9DA0AC]">
                    {t.product.imageUnavailable}
                  </p>
                </div>
              )}

              {/* Angle Tag */}
              <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-[#1E212A]/90 backdrop-blur-sm border border-[#E7E7E2] dark:border-[#2C303E] text-[10px] font-mono text-[#171717] dark:text-[#F5F4F0] uppercase font-bold shadow-2xs">
                {selectedImageIndex === 0 ? 'Front / Principal' : selectedImageIndex === 1 ? 'Back / Costas' : `Detalhe #0${selectedImageIndex + 1}`}
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {images.length > 1 && (
              <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#171717] dark:border-white scale-105 shadow-sm'
                        : 'border-[#E7E7E2] dark:border-[#2C303E] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Purchase Module Right (5 Cols) */}
          <div className="lg:col-span-5 p-6 sm:p-8 space-y-6 bg-white dark:bg-[#181A20]">
            {/* Header info */}
            <div>
              <span className="text-xs font-mono text-[#68734D] dark:text-[#8A9A68] tracking-widest uppercase font-bold block mb-1">
                {isSkateboard ? 'STICKERS® SKATEBOARD DECK' : 'STICKERS® AUTHENTIC APPAREL'}
              </span>
              <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0]">
                {product.name}
              </h1>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-[#171717] dark:text-[#F5F4F0] tabular-nums">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-mono text-[#6B7280] dark:text-[#9DA0AC]">
                  {language === 'pt' ? 'Preço Oficial em MT' : 'Official Price in MT'}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-[#4B5563] dark:text-[#A8ABB6] leading-relaxed">
              {product.description || (language === 'pt' 
                ? 'Artigo desenhado com silhueta streetwear autêntica, acabamentos reforçados e caimento estruturado.' 
                : 'Item crafted with an authentic streetwear silhouette, reinforced trims and structured drape.')}
            </p>

            {/* Skateboard Specific Specs */}
            {isSkateboard && (
              <div className="p-4 rounded-2xl bg-[#F7F6F1] dark:bg-[#14151B] border border-[#E7E7E2] dark:border-[#242732] space-y-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 text-[#68734D] dark:text-[#8A9A68] font-bold uppercase pb-1 border-b border-[#EAE5D9] dark:border-[#22252E]">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{t.product.skateSpecsTitle}</span>
                </div>
                {(product.deckDimensions || product.skateboardSpecs?.deckDimensions) && (
                  <div className="flex justify-between text-[#4B5563] dark:text-[#A8ABB6]">
                    <span>{t.product.deckDimensions}:</span>
                    <strong className="text-[#171717] dark:text-[#F5F4F0]">{product.deckDimensions || product.skateboardSpecs?.deckDimensions}</strong>
                  </div>
                )}
                {(product.deckMaterial || product.skateboardSpecs?.woodMaterial) && (
                  <div className="flex justify-between text-[#4B5563] dark:text-[#A8ABB6]">
                    <span>{t.product.deckMaterial}:</span>
                    <strong className="text-[#171717] dark:text-[#F5F4F0]">{product.deckMaterial || product.skateboardSpecs?.woodMaterial}</strong>
                  </div>
                )}
                {(product.deckType || product.skateboardSpecs?.concaveType) && (
                  <div className="flex justify-between text-[#4B5563] dark:text-[#A8ABB6]">
                    <span>{t.product.deckType}:</span>
                    <strong className="text-[#171717] dark:text-[#F5F4F0]">{product.deckType || product.skateboardSpecs?.concaveType}</strong>
                  </div>
                )}
              </div>
            )}

            {/* Color Variant Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#4B5563] dark:text-[#A8ABB6] uppercase">{t.product.selectColor}</span>
                  <span className="text-[#171717] dark:text-[#F5F4F0] font-bold">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                        selectedColor === c.name
                          ? 'border-[#171717] dark:border-white bg-[#171717] dark:bg-white text-white dark:text-black shadow-2xs'
                          : 'border-[#E7E7E2] dark:border-[#272A35] bg-[#F7F6F1] dark:bg-[#14151B] text-[#4B5563] dark:text-[#A8ABB6] hover:border-[#171717] dark:hover:border-white'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Variant Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#4B5563] dark:text-[#A8ABB6] uppercase">{t.product.selectSize}</span>
                  <span className="text-[#68734D] dark:text-[#8A9A68] font-bold">
                    {isOutOfStock ? t.product.outOfStock : `${variantStock} ${t.product.unitsLeft}`}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2 rounded-xl font-mono text-xs font-bold transition-all ${
                        selectedSize === s
                          ? 'bg-[#171717] dark:bg-white text-white dark:text-black shadow-xs'
                          : 'bg-[#F7F6F1] dark:bg-[#14151B] border border-[#E7E7E2] dark:border-[#272A35] text-[#4B5563] dark:text-[#A8ABB6] hover:border-[#171717] dark:hover:border-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Bag */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-[#F7F6F1] dark:bg-[#14151B] border border-[#E7E7E2] dark:border-[#272A35] rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-1.5 text-[#6B7280] dark:text-[#9DA0AC] hover:text-[#171717] dark:hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 font-mono text-sm font-bold text-[#171717] dark:text-[#F5F4F0] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(variantStock, quantity + 1))}
                    disabled={quantity >= variantStock || isOutOfStock}
                    className="p-1.5 text-[#6B7280] dark:text-[#9DA0AC] hover:text-[#171717] dark:hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 py-3.5 px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs ${
                    isOutOfStock
                      ? 'bg-[#E7E7E2] dark:bg-[#2A2E3B] text-[#9CA3AF] cursor-not-allowed'
                      : isAdded
                      ? 'bg-[#68734D] text-white'
                      : 'bg-[#171717] dark:bg-[#F5F4F0] text-white dark:text-[#121316] hover:bg-[#2B2B2B] dark:hover:bg-[#E2E1DA] active:scale-[0.98]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{t.product.addedToCart}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? t.product.outOfStock : t.product.addToCart}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct WhatsApp Quick Buy button */}
              <button
                onClick={handleWhatsAppDirect}
                disabled={isOutOfStock}
                className="w-full py-2.5 px-4 rounded-xl bg-[#F7F6F1] dark:bg-[#14151B] border border-[#E7E7E2] dark:border-[#272A35] hover:border-[#171717] dark:hover:border-white text-[#171717] dark:text-[#F5F4F0] font-mono text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>{language === 'pt' ? 'Pedir Diretamente no WhatsApp' : 'Order Directly on WhatsApp'}</span>
              </button>
            </div>

            {/* Info Cards */}
            <div className="pt-4 border-t border-[#EAE5D9] dark:border-[#242732] space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F7F6F1] dark:bg-[#14151B] border border-[#E7E7E2] dark:border-[#272A35] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#171717] dark:text-[#F5F4F0] uppercase font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#68734D] dark:text-[#8A9A68]" />
                  <span>{t.product.detailsTitle}</span>
                </div>
                <p className="text-xs text-[#6B7280] dark:text-[#A8ABB6] leading-relaxed pl-6">
                  {product.fabricFit || t.product.fabricFitDefault}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F6F1] dark:bg-[#14151B] border border-[#E7E7E2] dark:border-[#272A35] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#171717] dark:text-[#F5F4F0] uppercase font-bold">
                  <Truck className="w-4 h-4 text-[#68734D] dark:text-[#8A9A68]" />
                  <span>{t.product.shippingTitle}</span>
                </div>
                <p className="text-xs text-[#6B7280] dark:text-[#A8ABB6] leading-relaxed pl-6">
                  {t.product.shippingNotice}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7F6F1] dark:bg-[#14151B] border border-[#E7E7E2] dark:border-[#272A35] space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#171717] dark:text-[#F5F4F0] uppercase font-bold">
                  <CreditCard className="w-4 h-4 text-[#68734D] dark:text-[#8A9A68]" />
                  <span>M-Pesa & e-Mola</span>
                </div>
                <p className="text-xs text-[#6B7280] dark:text-[#A8ABB6] leading-relaxed pl-6">
                  {t.product.paymentNotice}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
