import React, { useState } from 'react';
import { Send, CheckCircle2, MessageSquareHeart, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ScrollReveal } from './ScrollReveal';

export const FeedbackSection: React.FC = () => {
  const { submitCustomerFeedback, t } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState(t.feedback.categories[0]);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setErrorMsg(null);

    const res = await submitCustomerFeedback({
      name: name.trim() || undefined,
      email: email.trim() || undefined,
      category,
      message: message.trim(),
    });

    setLoading(false);
    if (res.success) {
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    } else {
      setErrorMsg(res.error || 'Erro ao enviar mensagem. Tente novamente.');
    }
  };

  return (
    <div className="py-24 sm:py-28 bg-[#F7F6F1] min-h-screen text-[#171717]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <ScrollReveal variant="up" className="text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAE5D9] text-[#68734D] text-xs font-mono font-bold uppercase tracking-wider">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>COMMUNITY VOICES</span>
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-black uppercase tracking-tight text-[#171717]">
            {t.feedback.title}
          </h1>
          <p className="text-sm sm:text-base text-[#6B7280] max-w-xl mx-auto">
            {t.feedback.subtitle}
          </p>
        </ScrollReveal>

        {/* Feedback Card */}
        <ScrollReveal variant="scale" delay={100}>
          <div className="bg-[#FFFFFF] border border-[#E7E7E2] rounded-3xl p-6 sm:p-10 shadow-xl shadow-black/5">
            {success ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-[#EBF2EA] text-[#68734D] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-[#171717]">
                  {t.feedback.successTitle}
                </h3>
                <p className="text-sm text-[#6B7280] max-w-md mx-auto leading-relaxed">
                  {t.feedback.successMsg}
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setSuccess(false)}
                    className="px-6 py-2.5 rounded-xl bg-[#171717] hover:bg-[#2B2B2B] text-white font-display font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    {t.feedback.sendAnother}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Honeypot field for bot spam detection */}
                <input
                  type="text"
                  name="honeypot_check"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
                      {t.feedback.nameLabel}
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.feedback.namePlaceholder}
                      className="w-full bg-[#F7F6F1] border border-[#E7E7E2] focus:border-[#171717] rounded-xl px-4 py-3 text-xs font-mono text-[#171717] placeholder-[#9CA3AF] focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
                      {t.feedback.emailLabel}
                    </label>
                    <input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.feedback.emailPlaceholder}
                      className="w-full bg-[#F7F6F1] border border-[#E7E7E2] focus:border-[#171717] rounded-xl px-4 py-3 text-xs font-mono text-[#171717] placeholder-[#9CA3AF] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
                    {t.feedback.categoryLabel}
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {t.feedback.categories.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                          category === cat
                            ? 'bg-[#171717] text-white font-bold shadow-sm'
                            : 'bg-[#F7F6F1] border border-[#E7E7E2] text-[#6B7280] hover:text-[#171717]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#4B5563] uppercase tracking-wider">
                    {t.feedback.messageLabel} *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.feedback.messagePlaceholder}
                    className="w-full bg-[#F7F6F1] border border-[#E7E7E2] focus:border-[#171717] rounded-xl p-4 text-xs font-mono text-[#171717] placeholder-[#9CA3AF] focus:outline-none transition-colors leading-relaxed"
                  />
                </div>

                {errorMsg && (
                  <p className="text-xs font-mono text-[#DC2626] bg-[#FEE2E2] p-3 rounded-lg border border-[#FCA5A5]">
                    {errorMsg}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#171717] hover:bg-[#2B2B2B] text-white font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? t.feedback.submitting : t.feedback.submitBtn}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
