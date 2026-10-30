import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  Product,
  CartItem,
  StoreConfig,
  Language,
  Theme,
  ActivePage,
  CategorySlug,
  CollectionSlug,
  FeedbackItem,
} from '../types/store';
import { translations } from '../i18n/translations';

interface StoreContextType {
  products: Product[];
  allProducts: Product[]; // Includes drafts when owner is authenticated
  cart: CartItem[];
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  config: StoreConfig;
  updateConfig: (patch: Partial<StoreConfig>) => Promise<boolean>;
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedCategory: CategorySlug | 'all';
  setSelectedCategory: (cat: CategorySlug | 'all') => void;
  selectedCollection: CollectionSlug | 'all';
  setSelectedCollection: (col: CollectionSlug | 'all') => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isStudioOpen: boolean;
  setIsStudioOpen: (open: boolean) => void;
  isAuthenticated: boolean;
  loginToStudio: (password: string) => Promise<{ success: boolean; error?: string }>;
  logoutFromStudio: () => void;
  triggerSecretAuth: () => void;
  addToCart: (product: Product, size: string, color: string, quantity: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  formatPrice: (amount: number) => string;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<boolean>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<boolean>;
  deleteProduct: (id: string) => Promise<boolean>;
  clearAllProducts: () => void;
  buildWhatsAppMessage: () => string;
  getWhatsAppUrl: () => { url: string; configured: boolean };
  // Feedback
  feedbackList: FeedbackItem[];
  submitCustomerFeedback: (feedback: { name?: string; email?: string; category: string; message: string }) => Promise<{ success: boolean; error?: string }>;
  updateFeedbackStatus: (id: string, status: 'unread' | 'read' | 'archived') => Promise<boolean>;
  markFeedbackAsRead: (id: string, isRead: boolean) => Promise<boolean>;
  archiveFeedback: (id: string, isArchived: boolean) => Promise<boolean>;
  deleteFeedback: (id: string) => Promise<boolean>;
  deleteCustomerFeedback: (id: string) => Promise<boolean>;
  unreadFeedbackCount: number;
  logoutStudio: () => void;
  t: typeof translations.pt;
}

const initialDraftSkateboard: Product = {
  id: 'draft_skate_01',
  name: 'STICKERS Skateboard',
  slug: 'stickers-skateboard',
  description: 'Deck de skate STICKERS® fabricado em maple canadiano de 7 camadas, concavidade média para street e skatepark.',
  category: 'skateboards',
  collection: 'new-drops',
  price: 0,
  images: [],
  colors: [{ name: 'Raw Maple / Black', hex: '#222222' }],
  sizes: ['8.0"', '8.25"'],
  stockByVariant: { '8.0"': 0, '8.25"': 0 },
  isPublished: false, // DRAFT: does not appear in public store until owner completes and publishes
  isFeatured: false,
  fabricFit: 'Madeira Canadiana 7-ply, concave médio, lixa não incluída.',
  deckDimensions: '8.0" x 31.75"',
  deckMaterial: '7-ply Canadian Hard Rock Maple',
  deckType: 'Street & Park Deck',
  brand: 'STICKERS®',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const defaultConfig: StoreConfig = {
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, ''),
  careMessagePt: 'Olá STICKERS! Gostaria de confirmar a disponibilidade e saber como proceder com o pagamento por M-Pesa ou e-Mola.',
  careMessageEn: 'Hello STICKERS! I would like to verify item availability and proceed with payment via M-Pesa or e-Mola.',
  instagramUrl: 'https://www.instagram.com/lamar_rr67/',
  instagramActive: true,
  tiktokUrl: '',
  tiktokActive: false,
  youtubeUrl: '',
  youtubeActive: false,
  currency: 'MT',
  city: 'Maputo',
  country: 'Moçambique',
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Language state (defaults to 'pt')
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('stickers_lang_v2');
    return saved === 'en' || saved === 'pt' ? saved : 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('stickers_lang_v2', lang);
    document.documentElement.lang = lang;
  };

  // 1.1 Theme state (defaults to OS preference or saved)
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stickers_theme');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    return 'light';
  });

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('stickers_theme', newTheme);
    if (typeof document !== 'undefined') {
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  useEffect(() => {
    setTheme(theme);
  }, []);

  // 2. Auth state
  const [token, setToken] = useState<string | null>(() => {
    return sessionStorage.getItem('stickers_studio_token') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(token));
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  // 3. Products state
  const [allProducts, setAllProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('stickers_products_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [initialDraftSkateboard];
  });

  // Public products: strictly published only!
  const products = allProducts.filter((p) => p.isPublished === true);

  // 4. Store Config state
  const [config, setConfig] = useState<StoreConfig>(() => {
    try {
      const saved = localStorage.getItem('stickers_config_v2');
      if (saved) return { ...defaultConfig, ...JSON.parse(saved) };
    } catch {}
    return defaultConfig;
  });

  // 5. Feedback list
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>(() => {
    try {
      const saved = localStorage.getItem('stickers_feedback_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // 6. Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('stickers_cart_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem('stickers_cart_v2', JSON.stringify(cart));
  }, [cart]);

  // 7. Navigation & view states
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | 'all'>('all');
  const [selectedCollection, setSelectedCollection] = useState<CollectionSlug | 'all'>('all');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch initial data from server API
  const refreshProducts = useCallback(async () => {
    try {
      const headers: Record<string, string> = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const url = token ? '/api/products?all=true' : '/api/products';
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setAllProducts(data);
          localStorage.setItem('stickers_products_v2', JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn('Backend sync unavailable, using client state:', err);
    }
  }, [token]);

  const refreshConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig((prev) => {
          const updated = { ...prev, ...data };
          localStorage.setItem('stickers_config_v2', JSON.stringify(updated));
          return updated;
        });
      }
    } catch (err) {}
  }, []);

  const refreshFeedback = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/feedback', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeedbackList(data);
          localStorage.setItem('stickers_feedback_v2', JSON.stringify(data));
        }
      }
    } catch (err) {}
  }, [token]);

  useEffect(() => {
    refreshProducts();
    refreshConfig();
  }, [refreshProducts, refreshConfig]);

  useEffect(() => {
    if (isAuthenticated) {
      refreshFeedback();
    }
  }, [isAuthenticated, refreshFeedback]);

  // Verify token validity on load
  useEffect(() => {
    if (token) {
      fetch('/api/studio/verify', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.authenticated) {
            logoutFromStudio();
          } else {
            setIsAuthenticated(true);
          }
        })
        .catch(() => {});
    }
  }, [token]);

  // ==================== SECRET KEYBOARD SEQUENCE: SHIFT + W + A + S + D ====================
  useEffect(() => {
    const expectedSequence = ['KeyW', 'KeyA', 'KeyS', 'KeyD'];
    let sequenceIndex = 0;
    let sequenceTimer: any = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input, textarea or search box
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        sequenceIndex = 0;
        return;
      }

      // Check if Shift is actively held down
      if (!e.shiftKey) {
        sequenceIndex = 0;
        return;
      }

      // Clear previous timeout
      clearTimeout(sequenceTimer);

      if (e.code === expectedSequence[sequenceIndex]) {
        sequenceIndex += 1;
        // Reset if inactive for more than 2.5 seconds
        sequenceTimer = setTimeout(() => {
          sequenceIndex = 0;
        }, 2500);

        if (sequenceIndex === expectedSequence.length) {
          sequenceIndex = 0;
          e.preventDefault();
          // Secret matched: open auth modal!
          setIsAuthModalOpen(true);
        }
      } else {
        sequenceIndex = 0;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(sequenceTimer);
    };
  }, []);

  const triggerSecretAuth = () => {
    setIsAuthModalOpen(true);
  };

  // Login handler
  const loginToStudio = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/studio/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('stickers_studio_token', data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setIsAuthModalOpen(false);
        setIsStudioOpen(true);
        return { success: true };
      }
      return { success: false, error: data.error || 'Código de acesso incorreto.' };
    } catch {
      return { success: false, error: 'Falha na ligação com o servidor.' };
    }
  };

  const logoutFromStudio = () => {
    if (token) {
      fetch('/api/studio/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    sessionStorage.removeItem('stickers_studio_token');
    setToken(null);
    setIsAuthenticated(false);
    setIsStudioOpen(false);
  };

  // Product operations
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      if (token) {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(productData),
        });
        if (res.ok) {
          const created = await res.json();
          setAllProducts((prev) => [created, ...prev]);
          return true;
        }
      }
    } catch (err) {}

    // Fallback local
    const newProduct: Product = {
      ...productData,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAllProducts((prev) => {
      const updated = [newProduct, ...prev];
      localStorage.setItem('stickers_products_v2', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const updateProduct = async (id: string, patch: Partial<Product>): Promise<boolean> => {
    try {
      if (token) {
        const res = await fetch(`/api/products/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const updated = await res.json();
          setAllProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
          return true;
        }
      }
    } catch (err) {}

    setAllProducts((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p
      );
      localStorage.setItem('stickers_products_v2', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const deleteProduct = async (id: string): Promise<boolean> => {
    try {
      if (token) {
        await fetch(`/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {}

    setAllProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('stickers_products_v2', JSON.stringify(updated));
      return updated;
    });
    setCart((prev) => prev.filter((item) => item.productId !== id));
    if (selectedProductId === id) {
      setSelectedProductId(null);
      setActivePage('shop');
    }
    return true;
  };

  const clearAllProducts = () => {
    setAllProducts([]);
    localStorage.setItem('stickers_products_v2', JSON.stringify([]));
  };

  const markFeedbackAsRead = async (id: string, isRead: boolean): Promise<boolean> => {
    return updateFeedbackStatus(id, isRead ? 'read' : 'unread');
  };

  const archiveFeedback = async (id: string, isArchived: boolean): Promise<boolean> => {
    return updateFeedbackStatus(id, isArchived ? 'archived' : 'read');
  };

  // Config operations
  const updateConfig = async (patch: Partial<StoreConfig>): Promise<boolean> => {
    try {
      if (token) {
        const res = await fetch('/api/config', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(patch),
        });
        if (res.ok) {
          const updated = await res.json();
          setConfig(updated);
          localStorage.setItem('stickers_config_v2', JSON.stringify(updated));
          return true;
        }
      }
    } catch (err) {}

    setConfig((prev) => {
      const updated = { ...prev, ...patch };
      localStorage.setItem('stickers_config_v2', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  // Feedback operations
  const submitCustomerFeedback = async (feedbackData: {
    name?: string;
    email?: string;
    category: string;
    message: string;
  }): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedbackData),
      });
      const data = await res.json();
      if (res.ok) {
        // Also add locally
        if (data.feedback) {
          setFeedbackList((prev) => [data.feedback, ...prev]);
        }
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch {
      // Local fallback
      const localFb: FeedbackItem = {
        id: `fb_${Date.now()}`,
        name: feedbackData.name,
        email: feedbackData.email,
        category: feedbackData.category,
        message: feedbackData.message,
        status: 'unread',
        createdAt: new Date().toISOString(),
      };
      setFeedbackList((prev) => {
        const updated = [localFb, ...prev];
        localStorage.setItem('stickers_feedback_v2', JSON.stringify(updated));
        return updated;
      });
      return { success: true };
    }
  };

  const updateFeedbackStatus = async (id: string, status: 'unread' | 'read' | 'archived'): Promise<boolean> => {
    try {
      if (token) {
        await fetch(`/api/feedback/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        });
      }
    } catch {}

    setFeedbackList((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, status } : f));
      localStorage.setItem('stickers_feedback_v2', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const deleteCustomerFeedback = async (id: string): Promise<boolean> => {
    try {
      if (token) {
        await fetch(`/api/feedback/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {}

    setFeedbackList((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      localStorage.setItem('stickers_feedback_v2', JSON.stringify(updated));
      return updated;
    });
    return true;
  };

  const unreadFeedbackCount = feedbackList.filter((f) => f.status === 'unread').length;

  // Cart operations
  const addToCart = (product: Product, size: string, color: string, quantity: number) => {
    const itemId = `${product.id}_${size}_${color}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === itemId);
      if (existing) {
        return prev.map((item) =>
          item.id === itemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          product,
          selectedSize: size,
          selectedColor: color,
          quantity,
          unitPrice: product.price,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  // Price formatter in Metical (MT)
  const formatPrice = (amount: number): string => {
    const formatted = new Intl.NumberFormat('pt-MZ', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
    return `${formatted} MT`;
  };

  // WhatsApp generator
  const t = translations[language];

  const buildWhatsAppMessage = (): string => {
    const m = t.orderMessage;
    const lines: string[] = [
      m.greeting,
      '',
      m.headerProducts,
    ];

    cart.forEach((item, index) => {
      const lineTotal = item.unitPrice * item.quantity;
      lines.push(
        `${index + 1}. ${item.product.name} | ${t.cart.size}: ${item.selectedSize} | ${t.cart.color}: ${item.selectedColor} | Qtd: ${item.quantity} | Preço: ${formatPrice(item.unitPrice)} (${formatPrice(lineTotal)})`
      );
    });

    lines.push('');
    lines.push(`${m.subtotal} ${formatPrice(cartSubtotal)}`);
    lines.push(m.shippingNote);
    lines.push('');
    lines.push(language === 'pt' ? config.careMessagePt : config.careMessageEn);
    lines.push('');
    lines.push(m.thankYou);

    return lines.join('\n');
  };

  const getWhatsAppUrl = (): { url: string; configured: boolean } => {
    const cleanNumber = (config.whatsappNumber || '').replace(/\D/g, '');
    if (!cleanNumber) {
      return { url: '', configured: false };
    }
    const message = encodeURIComponent(buildWhatsAppMessage());
    return {
      url: `https://wa.me/${cleanNumber}?text=${message}`,
      configured: true,
    };
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        allProducts,
        cart,
        theme,
        setTheme,
        toggleTheme,
        language,
        setLanguage,
        config,
        updateConfig,
        activePage,
        setActivePage,
        selectedCategory,
        setSelectedCategory,
        selectedCollection,
        setSelectedCollection,
        selectedProductId,
        setSelectedProductId,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isStudioOpen,
        setIsStudioOpen,
        isAuthenticated,
        loginToStudio,
        logoutFromStudio,
        triggerSecretAuth,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        formatPrice,
        addProduct,
        updateProduct,
        deleteProduct,
        clearAllProducts,
        buildWhatsAppMessage,
        getWhatsAppUrl,
        feedbackList,
        submitCustomerFeedback,
        updateFeedbackStatus,
        markFeedbackAsRead,
        archiveFeedback,
        deleteFeedback: deleteCustomerFeedback,
        deleteCustomerFeedback,
        unreadFeedbackCount,
        logoutStudio: logoutFromStudio,
        t,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
