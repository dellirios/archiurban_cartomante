import React from 'react'
import { DrawnCard } from '../types/tarot'
import { X, Sparkles, Compass, Flame, Moon, RotateCw, BookOpen } from 'lucide-react'

interface CardDetailsModalProps {
  drawnCard: DrawnCard | null
  onClose: () => void
}

export const CardDetailsModal: React.FC<CardDetailsModalProps> = ({
  drawnCard,
  onClose,
}) => {
  if (!drawnCard) return null

  const { card, position, isReversed } = drawnCard

  return (
    <div
      className="fixed right-24 sm:right-28 md:right-32 top-6 bottom-6 z-50 w-[420px] max-w-[94vw] rounded-2xl border p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in fade-in slide-in-from-right-6 duration-200 pointer-events-auto"
      style={{
        backgroundColor: 'var(--theme-card-bg, #0c0716)',
        borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
        boxShadow: '0 0 24px var(--theme-glow, rgba(245, 158, 11, 0.35))',
      }}
    >
      {/* Top Header */}
      <div>
        <div
          className="flex items-center justify-between border-b pb-3 mb-4"
          style={{ borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.2))' }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-[11px] uppercase tracking-widest font-mystic font-semibold"
              style={{ color: 'var(--theme-secondary, #fbbf24)' }}
            >
              {card.type === 'major' ? 'Arcano Maior' : 'Arcano Menor'} • {card.roman}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg border transition-colors cursor-pointer"
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.3))',
              color: 'var(--theme-text-title, #ffffff)',
            }}
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Card Image and Meta Banner */}
        <div className="flex gap-4 items-start mb-4">
          <div
            className="relative w-[110px] h-[185px] rounded-lg overflow-hidden border shadow-lg bg-black flex-shrink-0"
            style={{ borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))' }}
          >
            <img
              src={card.img}
              alt={card.ptName}
              className={`w-full h-full object-cover ${
                isReversed ? 'rotate-180' : ''
              }`}
            />
          </div>

          <div className="flex-1 flex flex-col justify-between h-[185px]">
            <div>
              <h2
                className="font-mystic text-lg font-bold leading-tight"
                style={{ color: 'var(--theme-text-title, #ffffff)' }}
              >
                {card.ptName}
              </h2>
              <p
                className="text-[11px] italic"
                style={{ color: 'var(--theme-secondary, #fbbf24)' }}
              >
                {card.name}
              </p>

              <div
                className="mt-2 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-semibold border w-fit"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.3))',
                }}
              >
                {isReversed ? (
                  <>
                    <RotateCw className="w-3 h-3 text-rose-400 rotate-180" />
                    <span className="text-rose-300">Invertida (Sombra)</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-300">Posição Direta (Luz)</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-1">
              {card.element && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded border text-[10px]"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.2))',
                    color: 'var(--theme-secondary, #fbbf24)',
                  }}
                >
                  <Flame className="w-2.5 h-2.5" style={{ color: 'var(--theme-primary, #f59e0b)' }} />
                  {card.element}
                </span>
              )}
              {card.astrology && (
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded border text-[10px]"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.2))',
                    color: 'var(--theme-secondary, #fbbf24)',
                  }}
                >
                  <Moon className="w-2.5 h-2.5" style={{ color: 'var(--theme-primary, #f59e0b)' }} />
                  {card.astrology}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Position Influence */}
        <div
          className="p-2.5 rounded-lg border mb-3"
          style={{
            backgroundColor: 'rgba(0,0,0,0.4)',
            borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.25))',
          }}
        >
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold"
            style={{ color: 'var(--theme-text-title, #ffffff)' }}
          >
            <Compass className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary, #f59e0b)' }} />
            <span>Casa: {position.label}</span>
          </div>
          <p
            className="text-[10px] mt-0.5 leading-relaxed"
            style={{ color: 'var(--theme-text-body, #f1f5f9)' }}
          >
            {position.description}
          </p>
        </div>

        {/* Active Interpretation */}
        <div
          className="p-3 rounded-xl border mb-3"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.35))',
          }}
        >
          <div
            className="flex items-center gap-1.5 text-[11px] font-semibold mb-1"
            style={{ color: 'var(--theme-primary, #f59e0b)' }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>
              {isReversed ? 'Conselho do Arcano Invertido' : 'Conselho do Arcano Direto'}
            </span>
          </div>
          <p
            className="text-xs leading-relaxed font-reading"
            style={{ color: 'var(--theme-text-body, #f1f5f9)' }}
          >
            {isReversed ? card.reversedMeaning : card.uprightMeaning}
          </p>
        </div>

        {/* Keywords */}
        <div className="mb-2">
          <div className="flex flex-wrap gap-1">
            {card.keywords.map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded text-[10px] border"
                style={{
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.2))',
                  color: 'var(--theme-secondary, #fbbf24)',
                }}
              >
                {kw}
              </span>
            ))}
          </div>
        </div>

        {/* Lore / Description */}
        <p
          className="text-[11px] leading-relaxed italic"
          style={{ color: 'var(--theme-text-body, #f1f5f9)', opacity: 0.8 }}
        >
          {card.description}
        </p>
      </div>

      <div
        className="pt-3 border-t flex justify-end"
        style={{ borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.2))' }}
      >
        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl text-white text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer"
          style={{
            backgroundColor: 'var(--theme-primary, #f59e0b)',
          }}
        >
          Voltar para a Mesa
        </button>
      </div>
    </div>
  )
}
