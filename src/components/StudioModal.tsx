import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Save,
  Upload,
  CheckCircle2,
  Download,
  RotateCcw,
  Sparkles,
  Layers,
  PhoneCall,
  Eye,
  EyeOff,
  Instagram,
  Video,
  Youtube,
  MessageSquare,
  LogOut,
  LayoutDashboard,
  Share2,
  Settings,
  Archive,
  Mail,
  MailOpen,
  Compass,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, CategorySlug, CollectionSlug, FeedbackItem } from '../types/store';
import { CATEGORIES, COLLECTIONS } from '../data/categories';

export const StudioModal: React.FC = () => {
  const {
    allProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    config,
    updateConfig,
    feedbackList,
    markFeedbackAsRead,
    archiveFeedback,
    deleteFeedback,
    isStudioOpen,
    setIsStudioOpen,
    logoutStudio,
    formatPrice,
    language,
    t,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'social' | 'feedback' | 'settings'>('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'unread' | 'archived'>('all');

  // WhatsApp & Store Settings form
  const [whatsappInput, setWhatsappInput] = useState(config.whatsappNumber || '258841234567');
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  // Social Media state
  const [instagramUrl, setInstagramUrl] = useState(config.instagramUrl || 'https://www.instagram.com/lamar_rr67/');
  const [instagramActive, setInstagramActive] = useState(config.instagramActive ?? true);
  const [tiktokUrl, setTiktokUrl] = useState(config.tiktokUrl || '');
  const [tiktokActive, setTiktokActive] = useState(config.tiktokActive ?? false);
  const [youtubeUrl, setYoutubeUrl] = useState(config.youtubeUrl || '');
  const [youtubeActive, setYoutubeActive] = useState(config.youtubeActive ?? false);
  const [savedSocialNotice, setSavedSocialNotice] = useState(false);

  // Product form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<CategorySlug>('t-shirts');
  const [formCollection, setFormCollection] = useState<CollectionSlug>('new-drops');
  const [formPrice, setFormPrice] = useState<number>(2800);
  const [formDescription, setFormDescription] = useState('');
  const [formFabric, setFormFabric] = useState('100% Algodão Heavyweight 280 GSM, corte boxy oversized.');
  const [formSizes, setFormSizes] = useState('S, M, L, XL');
  const [formColors, setFormColors] = useState('Preto (#171717), Off-White (#F7F6F1)');
  const [formStock, setFormStock] = useState('12');
  const [formImages, setFormImages] = useState('');
  const [formFeatured, setFormFeatured] = useState(true);
  const [formPublished, setFormPublished] = useState(true);

  // Skateboard specific technical fields
  const [deckDimensions, setDeckDimensions] = useState('8.25" x 31.875"');
  const [deckMaterial, setDeckMaterial] = useState('7 Camadas de Hard Rock Maple Canadense');
  const [deckConcave, setDeckConcave] = useState('Medium Concave');
  const [deckBrand, setDeckBrand] = useState('STICKERS® Skateboarding');

  if (!isStudioOpen) return null;

  const publishedCount = allProducts.filter((p) => p.isPublished).length;
  const draftCount = allProducts.filter((p) => !p.isPublished).length;
  const unreadFeedbackCount = feedbackList.filter((f) => f.status === 'unread').length;

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('t-shirts');
    setFormCollection('new-drops');
    setFormPrice(2800);
    setFormDescription('Peça oficial STICKERS® com costuras reforçadas e caimento streetwear autêntico.');
    setFormFabric('100% Algodão Heavyweight 280 GSM, gola canelada de alta densidade.');
    setFormSizes('S, M, L, XL');
    setFormColors('Preto (#171717), Off-White (#F7F6F1)');
    setFormStock('12');
    setFormImages('');
    setFormFeatured(true);
    setFormPublished(true);
    setDeckDimensions('8.25" x 31.875"');
    setDeckMaterial('7 Camadas de Maple Canadense');
    setDeckConcave('Medium Concave');
    setDeckBrand('STICKERS® Skateboarding');
    setIsCreating(true);
  };

  const handleEdit = (p: Product) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormCollection(p.collection);
    setFormPrice(p.price);
    setFormDescription(p.description);
    setFormFabric(p.fabricFit || '');
    setFormSizes(p.sizes.join(', '));
    setFormColors(
      p.colors.map((c) => `${c.name} (${c.hex})`).join(', ') || 'Preto (#171717)'
    );
    const firstStock = Object.values(p.stockByVariant || {})[0] || 10;
    setFormStock(String(firstStock));
    setFormImages(p.images.join('\n'));
    setFormFeatured(p.isFeatured);
    setFormPublished(p.isPublished);

    // Skateboard specs
    setDeckDimensions(p.deckDimensions || p.skateboardSpecs?.deckDimensions || '8.25" x 31.875"');
    setDeckMaterial(p.deckMaterial || p.skateboardSpecs?.woodMaterial || '7 Camadas de Maple Canadense');
    setDeckConcave(p.deckType || p.skateboardSpecs?.concaveType || 'Medium Concave');
    setDeckBrand(p.brand || p.skateboardSpecs?.brand || 'STICKERS® Skateboarding');

    setIsCreating(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setFormImages((prev) => (prev ? `${prev}\n${result}` : result));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    // Parse sizes
    const sizes = formSizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    // Parse colors
    const colors = formColors
      .split(',')
      .map((c) => {
        const match = c.match(/^(.*?)\s*\((.*?)\)$/);
        if (match) {
          return { name: match[1].trim(), hex: match[2].trim() };
        }
        return { name: c.trim(), hex: '#171717' };
      })
      .filter((c) => c.name);

    // Parse images
    const images = formImages
      .split('\n')
      .map((img) => img.trim())
      .filter(Boolean);

    // Stock map
    const stockQty = parseInt(formStock, 10) || 5;
    const stockByVariant: Record<string, number> = {};
    sizes.forEach((s) => {
      stockByVariant[s] = stockQty;
    });

    const slug = formName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const productPayload: any = {
      name: formName.trim(),
      slug,
      category: formCategory,
      collection: formCollection,
      price: Number(formPrice),
      description: formDescription.trim(),
      fabricFit: formFabric.trim(),
      sizes: sizes.length > 0 ? sizes : ['M'],
      colors: colors.length > 0 ? colors : [{ name: 'Preto', hex: '#171717' }],
      stockByVariant,
      images,
      isFeatured: formFeatured,
      isPublished: formPublished,
    };

    // If Skateboard, attach technical deck specs
    if (formCategory === 'skateboards') {
      productPayload.deckDimensions = deckDimensions.trim() || '8.25" x 31.875"';
      productPayload.deckMaterial = deckMaterial.trim() || '7 Camadas de Maple Canadense';
      productPayload.deckType = deckConcave.trim() || 'Medium Concave';
      productPayload.brand = deckBrand.trim() || 'STICKERS® Skateboarding';
      productPayload.skateboardSpecs = {
        deckDimensions: deckDimensions.trim() || '8.25" x 31.875"',
        woodMaterial: deckMaterial.trim() || '7 Camadas de Maple Canadense',
        concaveType: deckConcave.trim() || 'Medium Concave',
        brand: deckBrand.trim() || 'STICKERS® Skateboarding',
      };
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload);
    } else {
      addProduct(productPayload);
    }

    setIsCreating(false);
    setEditingProduct(null);
  };

  const handleSaveSocial = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      instagramUrl: instagramUrl.trim(),
      instagramActive,
      tiktokUrl: tiktokUrl.trim(),
      tiktokActive,
      youtubeUrl: youtubeUrl.trim(),
      youtubeActive,
    });
    setSavedSocialNotice(true);
    setTimeout(() => setSavedSocialNotice(false), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = whatsappInput.replace(/\D/g, '');
    updateConfig({
      whatsappNumber: cleanNumber,
    });
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 2500);
  };

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(allProducts, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `stickers_catalog_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            await addProduct(item);
          }
          alert('Catálogo importado com sucesso!');
        }
      } catch {
        alert('Ficheiro JSON inválido.');
      }
    };
    reader.readAsText(file);
  };

  // Filter feedbacks
  const filteredFeedbacks = feedbackList.filter((fb) => {
    if (feedbackFilter === 'unread') return fb.status === 'unread';
    if (feedbackFilter === 'archived') return fb.status === 'archived';
    return fb.status !== 'archived';
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white border border-[#E7E7E2] rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col my-auto text-[#171717]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#EAE5D9] bg-[#F7F6F1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#171717] p-2 flex items-center justify-center shadow-sm">
              <img
                src="/assets/aistudio/Log_tipo_STICKERS_em_pincel_e23a3350.png"
                alt="STICKERS®"
                className="max-h-full max-w-full object-contain filter invert"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-lg font-black uppercase tracking-tight text-[#171717]">
                  STICKERS® STUDIO
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#68734D]/15 text-[#68734D] border border-[#68734D]/30">
                  AUTENTICADO
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#777]">
                Painel Administrativo Privado · Shift + W + A + S + D
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={logoutStudio}
              className="px-3 py-1.5 rounded-xl border border-[#E7E7E2] bg-white text-[#888] hover:text-[#d32f2f] hover:border-[#d32f2f] text-xs font-mono font-bold transition-colors flex items-center gap-1.5"
              title="Terminar Sessão"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
            <button
              onClick={() => setIsStudioOpen(false)}
              className="p-2 rounded-xl text-[#888] hover:text-[#171717] hover:bg-[#EAE5D9] transition-colors"
              aria-label="Fechar Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-2 bg-white border-b border-[#EAE5D9] flex items-center justify-between overflow-x-auto no-scrollbar gap-2 text-xs font-mono">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setActiveTab('dashboard');
                setIsCreating(false);
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-[#171717] text-white font-bold shadow-xs'
                  : 'text-[#666] hover:bg-[#F7F6F1] hover:text-[#171717]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Visão Geral</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('products');
                setIsCreating(false);
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'products'
                  ? 'bg-[#171717] text-white font-bold shadow-xs'
                  : 'text-[#666] hover:bg-[#F7F6F1] hover:text-[#171717]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Produtos ({allProducts.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('social');
                setIsCreating(false);
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'social'
                  ? 'bg-[#171717] text-white font-bold shadow-xs'
                  : 'text-[#666] hover:bg-[#F7F6F1] hover:text-[#171717]'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Redes Sociais</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('feedback');
                setIsCreating(false);
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all relative ${
                activeTab === 'feedback'
                  ? 'bg-[#171717] text-white font-bold shadow-xs'
                  : 'text-[#666] hover:bg-[#F7F6F1] hover:text-[#171717]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Mensagens</span>
              {unreadFeedbackCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-[#68734D] text-white text-[10px] font-bold">
                  {unreadFeedbackCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('settings');
                setIsCreating(false);
              }}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 transition-all ${
                activeTab === 'settings'
                  ? 'bg-[#171717] text-white font-bold shadow-xs'
                  : 'text-[#666] hover:bg-[#F7F6F1] hover:text-[#171717]'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>WhatsApp & Loja</span>
            </button>
          </div>

          <div className="text-[11px] text-[#888] hidden md:block">
            Sessão Ativa · Master Token
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#F7F6F1]/50 space-y-6">
          {activeTab === 'dashboard' ? (
            /* Dashboard View */
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-[#E7E7E2] shadow-xs">
                  <span className="text-xs font-mono text-[#888] uppercase block">Total de Peças</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-3xl font-black text-[#171717]">{allProducts.length}</span>
                    <span className="text-xs font-mono text-[#68734D] font-bold">{publishedCount} publicados</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E7E7E2] shadow-xs">
                  <span className="text-xs font-mono text-[#888] uppercase block">Rascunhos (Drafts)</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-3xl font-black text-[#171717]">{draftCount}</span>
                    <span className="text-xs font-mono text-[#888]">Ocultos ao público</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E7E7E2] shadow-xs">
                  <span className="text-xs font-mono text-[#888] uppercase block">Mensagens / Feedback</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-3xl font-black text-[#171717]">{feedbackList.length}</span>
                    <span className={`text-xs font-mono font-bold ${unreadFeedbackCount > 0 ? 'text-[#68734D]' : 'text-[#888]'}`}>
                      {unreadFeedbackCount} por ler
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-[#E7E7E2] shadow-xs">
                  <span className="text-xs font-mono text-[#888] uppercase block">Canal de Encomendas</span>
                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="font-display text-xl font-black text-[#25D366]">WhatsApp</span>
                    <span className="text-xs font-mono text-[#68734D] font-bold">M-Pesa / e-Mola</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-6 rounded-3xl bg-white border border-[#E7E7E2] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display text-base font-bold uppercase text-[#171717]">
                      Ações Rápidas do Proprietário
                    </h3>
                    <p className="text-xs text-[#777]">
                      Gira o catálogo real, publique o skate rascunho ou consulte o feedback recebido.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('products');
                      handleOpenCreate();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Peça</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('products')}
                    className="p-4 rounded-2xl bg-[#F7F6F1] hover:bg-[#EAE5D9] border border-[#EAE5D9] text-left transition-colors"
                  >
                    <Layers className="w-5 h-5 text-[#68734D] mb-2" />
                    <span className="font-display font-bold text-sm text-[#171717] block">Catálogo & Skates</span>
                    <span className="text-xs text-[#777]">Editar preços, fotos e visibilidade pública.</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('social')}
                    className="p-4 rounded-2xl bg-[#F7F6F1] hover:bg-[#EAE5D9] border border-[#EAE5D9] text-left transition-colors"
                  >
                    <Instagram className="w-5 h-5 text-[#68734D] mb-2" />
                    <span className="font-display font-bold text-sm text-[#171717] block">Redes Sociais</span>
                    <span className="text-xs text-[#777]">Gerir Instagram, TikTok e YouTube da marca.</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('feedback')}
                    className="p-4 rounded-2xl bg-[#F7F6F1] hover:bg-[#EAE5D9] border border-[#EAE5D9] text-left transition-colors"
                  >
                    <MessageSquare className="w-5 h-5 text-[#68734D] mb-2" />
                    <span className="font-display font-bold text-sm text-[#171717] block">Inbox de Clientes</span>
                    <span className="text-xs text-[#777]">Ler opiniões e mensagens de clientes.</span>
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'social' ? (
            /* Social Media Management Tab */
            <form onSubmit={handleSaveSocial} className="space-y-6 max-w-2xl bg-white p-6 rounded-3xl border border-[#E7E7E2] shadow-xs">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#171717]">
                  Gestão de Redes Sociais STICKERS®
                </h3>
                <p className="text-xs text-[#777] mt-1">
                  Ative ou desative as redes e defina os links que aparecem no cabeçalho, rodapé e secções.
                </p>
              </div>

              {/* Instagram */}
              <div className="p-4 rounded-2xl bg-[#F7F6F1] border border-[#EAE5D9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Instagram className="w-4 h-4 text-[#e1306c]" />
                    <span className="font-mono text-xs font-bold uppercase text-[#171717]">Instagram Oficial</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={instagramActive}
                      onChange={(e) => setInstagramActive(e.target.checked)}
                      className="rounded"
                    />
                    <span className={instagramActive ? 'text-[#68734D] font-bold' : 'text-[#888]'}>
                      {instagramActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                </div>
                <input
                  type="url"
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  placeholder="https://www.instagram.com/lamar_rr67/"
                  className="w-full bg-white border border-[#E7E7E2] rounded-xl px-4 py-2.5 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                />
              </div>

              {/* TikTok */}
              <div className="p-4 rounded-2xl bg-[#F7F6F1] border border-[#EAE5D9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-[#171717]" />
                    <span className="font-mono text-xs font-bold uppercase text-[#171717]">TikTok</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={tiktokActive}
                      onChange={(e) => setTiktokActive(e.target.checked)}
                      className="rounded"
                    />
                    <span className={tiktokActive ? 'text-[#68734D] font-bold' : 'text-[#888]'}>
                      {tiktokActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                </div>
                <input
                  type="url"
                  value={tiktokUrl}
                  onChange={(e) => setTiktokUrl(e.target.value)}
                  placeholder="https://www.tiktok.com/@stickers"
                  className="w-full bg-white border border-[#E7E7E2] rounded-xl px-4 py-2.5 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                />
              </div>

              {/* YouTube */}
              <div className="p-4 rounded-2xl bg-[#F7F6F1] border border-[#EAE5D9] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Youtube className="w-4 h-4 text-[#ff0000]" />
                    <span className="font-mono text-xs font-bold uppercase text-[#171717]">YouTube</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono">
                    <input
                      type="checkbox"
                      checked={youtubeActive}
                      onChange={(e) => setYoutubeActive(e.target.checked)}
                      className="rounded"
                    />
                    <span className={youtubeActive ? 'text-[#68734D] font-bold' : 'text-[#888]'}>
                      {youtubeActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </label>
                </div>
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/@stickers"
                  className="w-full bg-white border border-[#E7E7E2] rounded-xl px-4 py-2.5 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                />
              </div>

              {savedSocialNotice && (
                <div className="p-3 rounded-xl bg-[#68734D]/15 border border-[#68734D]/30 text-xs font-mono text-[#68734D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Redes sociais atualizadas com sucesso!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Gravar Redes Sociais
              </button>
            </form>
          ) : activeTab === 'feedback' ? (
            /* Customer Feedback Inbox Tab */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#171717]">
                    Mensagens & Feedback dos Clientes
                  </h3>
                  <p className="text-xs text-[#777]">
                    Todas as submissões enviadas pelo formulário público da loja são registadas aqui.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => setFeedbackFilter('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      feedbackFilter === 'all'
                        ? 'bg-[#171717] text-white font-bold'
                        : 'bg-white border border-[#E7E7E2] text-[#666]'
                    }`}
                  >
                    Todas ({feedbackList.filter((f) => f.status !== 'archived').length})
                  </button>
                  <button
                    onClick={() => setFeedbackFilter('unread')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      feedbackFilter === 'unread'
                        ? 'bg-[#171717] text-white font-bold'
                        : 'bg-white border border-[#E7E7E2] text-[#666]'
                    }`}
                  >
                    Por Ler ({unreadFeedbackCount})
                  </button>
                  <button
                    onClick={() => setFeedbackFilter('archived')}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      feedbackFilter === 'archived'
                        ? 'bg-[#171717] text-white font-bold'
                        : 'bg-white border border-[#E7E7E2] text-[#666]'
                    }`}
                  >
                    Arquivadas ({feedbackList.filter((f) => f.status === 'archived').length})
                  </button>
                </div>
              </div>

              {filteredFeedbacks.length === 0 ? (
                <div className="py-16 text-center space-y-2 bg-white rounded-3xl border border-[#E7E7E2] p-8">
                  <MailOpen className="w-10 h-10 text-[#bbb] mx-auto" />
                  <p className="font-display font-bold text-sm text-[#171717] uppercase">
                    Nenhuma mensagem nesta visualização
                  </p>
                  <p className="text-xs text-[#888]">
                    As mensagens submetidas pelos utilizadores na secção de feedback aparecerão instantaneamente aqui.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredFeedbacks.map((item) => (
                    <div
                      key={item.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        item.status === 'unread'
                          ? 'bg-white border-[#68734D]/50 shadow-sm'
                          : 'bg-white/80 border-[#E7E7E2]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F7F6F1]">
                        <div className="flex items-center gap-2">
                          {item.status === 'unread' && (
                            <span className="w-2 h-2 rounded-full bg-[#68734D]" />
                          )}
                          <span className="font-display font-bold text-sm text-[#171717]">
                            {item.name || 'Cliente STICKERS'}
                          </span>
                          {(item.email || item.contact) && (
                            <span className="text-xs font-mono text-[#777]">
                              ({item.email || item.contact})
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono text-[#888]">
                          <span>
                            {new Date(item.createdAt).toLocaleDateString(language === 'pt' ? 'pt-PT' : 'en-US', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>

                          <button
                            onClick={() => markFeedbackAsRead(item.id, item.status !== 'read')}
                            className="p-1 text-[#666] hover:text-[#171717]"
                            title={item.status === 'read' ? 'Marcar como não lida' : 'Marcar como lida'}
                          >
                            {item.status === 'read' ? <Mail className="w-4 h-4" /> : <MailOpen className="w-4 h-4 text-[#68734D]" />}
                          </button>

                          <button
                            onClick={() => archiveFeedback(item.id, item.status !== 'archived')}
                            className="p-1 text-[#666] hover:text-[#171717]"
                            title={item.status === 'archived' ? 'Desarquivar' : 'Arquivar'}
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              if (confirm('Eliminar esta mensagem permanentemente?')) {
                                deleteFeedback(item.id);
                              }
                            }}
                            className="p-1 text-[#666] hover:text-[#d32f2f]"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="pt-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#EAE5D9] text-[#171717] font-bold inline-block mb-2">
                          {item.category}
                        </span>
                        <p className="text-sm text-[#333] whitespace-pre-wrap leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'settings' ? (
            /* Settings Tab */
            <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl bg-white p-6 rounded-3xl border border-[#E7E7E2] shadow-xs">
              <div>
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#171717]">
                  Definições da Loja & WhatsApp
                </h3>
                <p className="text-xs text-[#777] mt-1">
                  Defina o número para onde os pedidos do carrinho serão encaminhados via wa.me.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F6F1] border border-[#EAE5D9] space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono text-[#68734D] font-bold">
                  <PhoneCall className="w-4 h-4" />
                  <span>NÚMERO OFICIAL DE WHATSAPP (MÉTODO PRINCIPAL)</span>
                </div>
                <p className="text-xs text-[#666] leading-relaxed">
                  As encomendas serão geradas com o resumo de tamanhos, cores, total em Meticais (MT) e instruções de liquidação M-Pesa / e-Mola.
                </p>
                <div className="pt-2">
                  <label className="text-xs font-mono text-[#171717] font-bold block mb-1">
                    Número de Telefone (com indicativo)
                  </label>
                  <input
                    type="text"
                    value={whatsappInput}
                    onChange={(e) => setWhatsappInput(e.target.value)}
                    placeholder="258841234567"
                    className="w-full bg-white border border-[#E7E7E2] rounded-xl px-4 py-2.5 text-xs font-mono text-[#171717] focus:border-[#171717] focus:outline-none"
                  />
                  <span className="text-[10px] font-mono text-[#888] block mt-1">
                    Prefixo Moçambique 258 seguido do número, sem espaços ou símbolos (Ex: 258841234567).
                  </span>
                </div>
              </div>

              {savedSettingsNotice && (
                <div className="p-3 rounded-xl bg-[#68734D]/15 border border-[#68734D]/30 text-xs font-mono text-[#68734D] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Definições guardadas com sucesso!</span>
                </div>
              )}

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Guardar Definições
              </button>
            </form>
          ) : isCreating ? (
            /* Product Creation / Edit Form (with Skateboard specs) */
            <form onSubmit={handleSaveProduct} className="space-y-5 bg-white p-6 rounded-3xl border border-[#E7E7E2] shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE5D9]">
                <h3 className="font-display text-base font-bold text-[#171717] uppercase">
                  {editingProduct ? 'Editar Peça' : 'Adicionar Nova Peça ao Catálogo'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-xs font-mono text-[#888] hover:text-[#171717]"
                >
                  Cancelar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Nome da Peça *
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Ex: Heavyweight Boxy Tee - Charcoal"
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Preço (MT) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as CategorySlug)}
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Coleção
                  </label>
                  <select
                    value={formCollection}
                    onChange={(e) => setFormCollection(e.target.value as CollectionSlug)}
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  >
                    {COLLECTIONS.map((col) => (
                      <option key={col.slug} value={col.slug}>
                        {col.name[language]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* DEDICATED SKATEBOARD TECHNICAL FIELDS */}
                {formCategory === 'skateboards' && (
                  <div className="sm:col-span-2 p-4 rounded-2xl bg-[#F7F6F1] border border-[#68734D]/30 space-y-3">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#68734D]" />
                      <span className="font-mono text-xs font-bold uppercase text-[#68734D]">
                        Especificações Técnicas de Skate (Shape / Deck)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono text-[#555] block mb-1">
                          Dimensões / Largura (Ex: 8.25" x 31.875")
                        </label>
                        <input
                          type="text"
                          value={deckDimensions}
                          onChange={(e) => setDeckDimensions(e.target.value)}
                          placeholder="8.25&quot; x 31.875&quot;"
                          className="w-full bg-white border border-[#E7E7E2] rounded-lg px-3 py-1.5 text-xs font-mono text-[#171717]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#555] block mb-1">
                          Madeira / Composição (Ex: 7 Camadas Maple Canadense)
                        </label>
                        <input
                          type="text"
                          value={deckMaterial}
                          onChange={(e) => setDeckMaterial(e.target.value)}
                          placeholder="7 Camadas de Maple Canadense"
                          className="w-full bg-white border border-[#E7E7E2] rounded-lg px-3 py-1.5 text-xs font-mono text-[#171717]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#555] block mb-1">
                          Concavidade (Ex: Medium Concave)
                        </label>
                        <input
                          type="text"
                          value={deckConcave}
                          onChange={(e) => setDeckConcave(e.target.value)}
                          placeholder="Medium Concave"
                          className="w-full bg-white border border-[#E7E7E2] rounded-lg px-3 py-1.5 text-xs font-mono text-[#171717]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-mono text-[#555] block mb-1">
                          Marca / Shape Mold
                        </label>
                        <input
                          type="text"
                          value={deckBrand}
                          onChange={(e) => setDeckBrand(e.target.value)}
                          placeholder="STICKERS® Skateboarding"
                          className="w-full bg-white border border-[#E7E7E2] rounded-lg px-3 py-1.5 text-xs font-mono text-[#171717]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Descrição da Peça
                  </label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Descrição detalhada e caimento..."
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Tamanhos / Medidas (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={formSizes}
                    onChange={(e) => setFormSizes(e.target.value)}
                    placeholder="S, M, L, XL ou 8.0, 8.25"
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Cores / Variações
                  </label>
                  <input
                    type="text"
                    value={formColors}
                    onChange={(e) => setFormColors(e.target.value)}
                    placeholder="Preto (#171717), Off-White (#F7F6F1)"
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Stock Disponível
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono text-[#555] font-bold block mb-1">
                    Gramagem e Tecido / Composição
                  </label>
                  <input
                    type="text"
                    value={formFabric}
                    onChange={(e) => setFormFabric(e.target.value)}
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                {/* Images Upload / URLs */}
                <div className="sm:col-span-2 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-[#555] font-bold">
                      Fotografias Reais (uma URL por linha ou upload local)
                    </label>
                    <label className="cursor-pointer text-[11px] font-mono text-[#68734D] font-bold hover:underline flex items-center gap-1">
                      <Upload className="w-3 h-3" />
                      <span>Upload de Ficheiro Local</span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <textarea
                    rows={3}
                    value={formImages}
                    onChange={(e) => setFormImages(e.target.value)}
                    placeholder="https://... (fotografias autênticas do artigo)"
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] rounded-xl px-3 py-2 text-xs font-mono text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>

                {/* Toggles */}
                <div className="flex items-center gap-6 sm:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-xs font-mono text-[#171717] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="rounded"
                    />
                    <span>Destacar na Página Inicial</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-mono text-[#171717] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formPublished}
                      onChange={(e) => setFormPublished(e.target.checked)}
                      className="rounded"
                    />
                    <span className="font-bold">
                      {formPublished ? '✓ Publicado (Visível na loja)' : '✗ Rascunho (Oculto)'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EAE5D9]">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-[#888] hover:text-[#171717]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Gravar Peça</span>
                </button>
              </div>
            </form>
          ) : (
            /* Products List View */
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                  onClick={handleOpenCreate}
                  className="px-5 py-2.5 rounded-xl bg-[#171717] hover:bg-[#333] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Peça</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono">
                  {allProducts.length > 0 && (
                    <button
                      onClick={handleExport}
                      className="p-2 rounded-xl bg-white border border-[#E7E7E2] text-[#666] hover:text-[#171717] transition-colors"
                      title="Exportar Catálogo JSON"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <label
                    className="p-2 rounded-xl bg-white border border-[#E7E7E2] text-[#666] hover:text-[#171717] transition-colors cursor-pointer"
                    title="Importar Catálogo JSON"
                  >
                    <Upload className="w-4 h-4" />
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImport}
                      className="hidden"
                    />
                  </label>

                  {allProducts.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Deseja limpar todos os produtos e regressar a 0 produtos?')) {
                          clearAllProducts();
                        }
                      }}
                      className="px-3 py-2 rounded-xl bg-[#fff0f0] border border-[#fcc] text-[#d32f2f] hover:bg-[#ffe5e5] transition-colors font-mono text-xs font-bold"
                    >
                      <RotateCcw className="w-3.5 h-3.5 inline-block mr-1" />
                      <span>Limpar Tudo</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Products Table */}
              {allProducts.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-white rounded-3xl border border-[#E7E7E2] p-6 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-[#F7F6F1] border border-[#EAE5D9] flex items-center justify-center text-[#888] mx-auto">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="font-display text-base font-bold text-[#171717] uppercase">
                    Nenhuma peça registada
                  </h4>
                  <p className="text-xs text-[#777] max-w-md mx-auto">
                    Clique em "Adicionar Peça" para registar artigos autênticos da STICKERS®.
                  </p>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#E7E7E2] overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#F7F6F1] text-[#666] border-b border-[#EAE5D9]">
                      <tr>
                        <th className="py-3 px-4">Artigo</th>
                        <th className="py-3 px-4">Categoria</th>
                        <th className="py-3 px-4">Preço (MT)</th>
                        <th className="py-3 px-4">Estado</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F7F6F1]">
                      {allProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-[#F7F6F1]/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 rounded-lg bg-[#EAE5D9] overflow-hidden shrink-0 flex items-center justify-center border border-[#E7E7E2]">
                                {p.images?.[0] ? (
                                  <img
                                    src={p.images[0]}
                                    alt={p.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-[8px] font-bold text-[#888]">STK</span>
                                )}
                              </div>
                              <div>
                                <span className="font-display font-bold text-sm text-[#171717] block">
                                  {p.name}
                                </span>
                                <span className="text-[10px] text-[#777]">
                                  {p.category === 'skateboards'
                                    ? `Deck: ${p.deckDimensions || p.skateboardSpecs?.deckDimensions || '8.25"'}`
                                    : `Tamanhos: ${p.sizes.join(', ')}`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 uppercase text-[#666] font-semibold">{p.category}</td>
                          <td className="py-3 px-4 font-bold text-[#171717] tabular-nums">
                            {formatPrice(p.price)}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => updateProduct(p.id, { isPublished: !p.isPublished })}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${
                                p.isPublished
                                  ? 'bg-[#68734D]/15 text-[#68734D] border border-[#68734D]/30'
                                  : 'bg-[#888]/15 text-[#666] border border-[#888]/30'
                              }`}
                              title="Clique para alternar visibilidade pública"
                            >
                              {p.isPublished ? (
                                <>
                                  <Eye className="w-3 h-3" />
                                  <span>Publicado</span>
                                </>
                              ) : (
                                <>
                                  <EyeOff className="w-3 h-3" />
                                  <span>Rascunho (Oculto)</span>
                                </>
                              )}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleEdit(p)}
                                className="p-1.5 rounded-lg bg-[#F7F6F1] hover:bg-[#EAE5D9] text-[#171717] transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remover "${p.name}"?`)) deleteProduct(p.id);
                                }}
                                className="p-1.5 rounded-lg bg-[#fff0f0] hover:bg-[#ffe5e5] text-[#d32f2f] transition-colors"
                                title="Remover"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#F7F6F1] border-t border-[#EAE5D9] flex items-center justify-between text-xs font-mono text-[#888]">
          <span>STICKERS® STUDIO · CONTROL PANEL</span>
          <button
            onClick={() => setIsStudioOpen(false)}
            className="text-[#171717] font-bold hover:underline"
          >
            Fechar Janela
          </button>
        </div>
      </div>
    </div>
  );
};
