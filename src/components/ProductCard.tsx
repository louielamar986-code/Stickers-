import React, { useState } from 'react';
import { Eye, Plus, Check } from 'lucide-react';
import { Product } from '../types/store';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { formatPrice, addToCart, t } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const mainImage = product.images?.[0];
  const hoverImage = product.images?.[1] || mainImage;
  const currentImage = isHovered && hoverImage ? hoverImage : mainImage;

  // Check if any stock available
  const totalStock = Object.values(product.stockByVariant || {}).reduce((a, b) => a + b, 0);
  const isOutOfStock = totalStock <= 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    const defaultSize = product.sizes?.[0] || 'M';
    const defaultColor = product.colors?.[0]?.name || 'Padrão';
    addToCart(product, defaultSize, defaultColor, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div
      onClick={() => onSelect(product)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer rounded-3xl bg-white dark:bg-[#191B21] border border-[#E7E7E2] dark:border-[#272A35] hover:border-[#171717] dark:hover:border-white transition-all duration-300 flex flex-col overflow-hidden relative shadow-2xs hover:shadow-xl hover:-translate-y-1"
    >
      {/* Product Image Area */}
      <div className="relative aspect-[4/5] w-full bg-[#F7F6F1] dark:bg-[#131418] overflow-hidden flex items-center justify-center">
        {currentImage && !imageError ? (
          <img
            src={currentImage}
            alt={product.name}
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        ) : (
          /* Neutral architectural streetwear placeholder */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#F7F6F1] dark:from-[#191B21] to-[#EAE5D9] dark:to-[#131418]">
            <span className="text-[10px] font-mono tracking-widest text-[#68734D] dark:text-[#8A9A68] uppercase font-bold mb-2">
              STICKERS® ARCHIVE
            </span>
            <span className="font-display font-black text-sm text-[#171717] dark:text-[#F5F4F0] uppercase">
              {product.name}
            </span>
            <span className="text-[11px] font-mono text-[#6B7280] dark:text-[#8E909B] mt-2">
              {t.product.imageUnavailable}
            </span>
          </div>
        )}

        {/* Status indicators */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
          {isOutOfStock ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FEE2E2] dark:bg-[#3E1B1B] border border-[#FCA5A5] dark:border-[#6B2828] text-[#991B1B] dark:text-[#FCA5A5]">
              {t.product.outOfStock}
            </span>
          ) : product.isFeatured ? (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#171717] dark:bg-white text-white dark:text-black shadow-xs">
              FEATURED
            </span>
          ) : null}
        </div>

        {/* Hover Action Bar */}
        <div className="absolute inset-x-3.5 bottom-3.5 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 shadow-md ${
              isOutOfStock
                ? 'bg-[#E7E7E2] dark:bg-[#2A2D3A] text-[#9CA3AF] cursor-not-allowed'
                : justAdded
                ? 'bg-[#68734D] text-white'
                : 'bg-[#171717] dark:bg-[#F5F4F0] text-white dark:text-[#121316] hover:bg-[#2B2B2B] dark:hover:bg-[#E2E1DA]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{t.product.addedToCart}</span>
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5" />
                <span>{t.product.addToCart}</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="p-2.5 rounded-xl bg-white/95 dark:bg-[#1E212A]/95 backdrop-blur-sm border border-[#E7E7E2] dark:border-[#2C303E] text-[#171717] dark:text-[#F5F4F0] hover:bg-[#171717] dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors shadow-sm"
            aria-label="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Card Info Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-[11px] font-mono text-[#68734D] dark:text-[#8A9A68] font-bold uppercase mb-1.5">
            <span>{product.category}</span>
            <span className="text-[#9CA3AF] dark:text-[#8E909B]">{product.collection.replace('-', ' ')}</span>
          </div>

          <h3 className="font-display text-base sm:text-lg font-black text-[#171717] dark:text-[#F5F4F0] group-hover:text-[#68734D] dark:group-hover:text-[#8A9A68] transition-colors leading-snug">
            {product.name}
          </h3>
        </div>

        <div className="mt-4 pt-3 border-t border-[#EAE5D9] dark:border-[#272A35] flex items-center justify-between">
          <span className="font-mono text-base font-bold text-[#171717] dark:text-[#F5F4F0] tabular-nums">
            {formatPrice(product.price)}
          </span>

          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 text-[10px] font-mono text-[#6B7280] dark:text-[#9DA0AC]">
              <span>{product.sizes.join(' · ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
