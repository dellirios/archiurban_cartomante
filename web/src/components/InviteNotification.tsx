import React, { useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'

interface InviteNotificationProps {
  duration?: number
  onAccept: () => void
  onDecline: () => void
}

export const InviteNotification: React.FC<InviteNotificationProps> = ({
  duration = 15000,
  onAccept,
  onDecline,
}) => {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const startTime = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remainingPct = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remainingPct)
      if (remainingPct <= 0) {
        clearInterval(interval)
      }
    }, 50)

    return () => clearInterval(interval)
  }, [duration])

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className="relative overflow-hidden rounded-2xl border px-5 py-3.5 flex items-center gap-4 bg-[#0e0818]/95 shadow-[0_12px_36px_rgba(0,0,0,0.85)]"
        style={{
          borderColor: 'var(--theme-card-border, rgba(168, 85, 247, 0.35))',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.85), 0 0 24px var(--theme-glow, rgba(147, 51, 234, 0.3))',
        }}
      >
        {/* Ícone místico */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border"
          style={{
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            borderColor: 'rgba(245, 158, 11, 0.4)',
            color: 'var(--theme-primary, #f59e0b)',
          }}
        >
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>

        {/* Texto descritivo */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className="font-mystic font-bold text-xs sm:text-sm tracking-wide"
              style={{ color: 'var(--theme-text-title, #fef08a)' }}
            >
              Leitura de Tarô
            </span>
          </div>
          <span
            className="text-[11px] leading-tight"
            style={{ color: 'var(--theme-secondary, #fbbf24)' }}
          >
            A Cartomante deseja ler o seu destino nas cartas
          </span>
        </div>

        {/* Separador vertical sutil */}
        <div className="w-[1px] h-8 bg-white/10 mx-1 flex-shrink-0" />

        {/* Ações [Y] e [N] */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Botão Y - Aceitar */}
          <button
            onClick={onAccept}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 transition-all cursor-pointer shadow-sm group"
            title="Pressione Y para aceitar"
          >
            <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] bg-emerald-500/30 border border-emerald-400/50 text-white shadow-xs group-hover:scale-105 transition-transform">
              Y
            </span>
            <span className="text-xs font-semibold">Aceitar</span>
          </button>

          {/* Botão N - Recusar */}
          <button
            onClick={onDecline}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-300 transition-all cursor-pointer shadow-sm group"
            title="Pressione N para recusar"
          >
            <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] bg-rose-500/30 border border-rose-400/50 text-white shadow-xs group-hover:scale-105 transition-transform">
              N
            </span>
            <span className="text-xs font-semibold">Recusar</span>
          </button>
        </div>

        {/* Linha de progresso do tempo na base */}
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-75 ease-linear shadow-xs"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #f59e0b, #a855f7, #f59e0b)',
          }}
        />
      </div>
    </div>
  )
}
