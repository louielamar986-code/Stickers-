import React, { useState, useEffect, useRef } from 'react';
import { X, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, loginToStudio, t } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthModalOpen) {
      setPassword('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setLoading(true);
    setError(null);

    const res = await loginToStudio(password);
    setLoading(false);
    if (!res.success) {
      setError(res.error || t.auth.errorInvalid);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-[#181A20] border border-[#E7E7E2] dark:border-[#292C37] rounded-3xl shadow-2xl overflow-hidden p-7 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200 text-[#171717] dark:text-[#F5F4F0]">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-[#6B7280] dark:text-[#9DA0AC] hover:text-[#171717] dark:hover:text-[#F5F4F0] hover:bg-[#F7F6F1] dark:hover:bg-[#22252E] transition-colors"
          aria-label={t.auth.closeBtn}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header with Official Brush Logo */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-24 h-24 mx-auto rounded-2xl bg-[#171717] dark:bg-[#131418] border border-black/10 dark:border-white/10 p-2 flex items-center justify-center shadow-md">
            <img
              src="/assets/aistudio/Log_tipo_STICKERS_em_pincel_e23a3350.png"
              alt="STICKERS®"
              className="w-full h-full object-contain filter invert dark:invert-0"
            />
          </div>
          <div>
            <h2 className="font-display text-2xl font-black uppercase tracking-tight text-[#171717] dark:text-[#F5F4F0]">
              {t.auth.title}
            </h2>
            <p className="text-xs font-mono text-[#68734D] dark:text-[#8A9A68] font-bold mt-0.5">
              {t.auth.subtitle}
            </p>
          </div>
        </div>

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#4B5563] dark:text-[#A0A2AA] block uppercase tracking-wider font-bold">
              {t.auth.passwordLabel}
            </label>
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.auth.passwordPlaceholder}
                required
                className="w-full bg-[#F7F6F1] dark:bg-[#121316] border border-[#E7E7E2] dark:border-[#292C37] focus:border-[#171717] dark:focus:border-[#8A9A68] rounded-xl px-4 py-3 text-sm font-mono text-[#171717] dark:text-[#F5F4F0] placeholder-[#9CA3AF] dark:placeholder-[#6B7280] focus:outline-none transition-colors pr-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-[#6B7280] dark:text-[#9DA0AC] hover:text-[#171717] dark:hover:text-[#F5F4F0] transition-colors"
                aria-label="Alternar visibilidade do código"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FEE2E2] dark:bg-[#3D1E1E] border border-[#FCA5A5] dark:border-[#6B2828] flex items-center gap-2 text-xs font-mono text-[#991B1B] dark:text-[#FCA5A5] animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-[#171717] dark:bg-[#F5F4F0] hover:bg-[#2B2B2B] dark:hover:bg-[#E2E1DA] text-white dark:text-[#121316] font-display font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 active:scale-[0.99]"
          >
            <span>{loading ? 'A validar...' : t.auth.loginBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center">
          <p className="text-[11px] font-mono text-[#9CA3AF] dark:text-[#787A84] flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#68734D] dark:text-[#8A9A68]" />
            <span>Sessão autenticada pelo servidor STICKERS®</span>
          </p>
        </div>
      </div>
    </div>
  );
};
