import React from 'react'
import { DrawnCard } from '../types/tarot'
import { Sparkles, RotateCw, Eye } from 'lucide-react'

interface TarotCardProps {
  drawnCard: DrawnCard
  index: number
  onFlip: (index: number) => void
  onInspect: (drawnCard: DrawnCard) => void
}

export const TarotCard: React.FC<TarotCardProps> = ({
  drawnCard,
  index,
  onFlip,
  onInspect,
}) => {
  const { card, position, isReversed, isRevealed } = drawnCard

  return (
    <div className="flex flex-col items-center group">
      {/* Position Header Tag */}
      <div
        className="mb-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide flex items-center gap-1.5 shadow-sm transition-all"
        style={{
          backgroundColor: 'var(--theme-card-bg, rgba(14, 8, 24, 0.85))',
          borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
          borderWidth: '1px',
          color: 'var(--theme-secondary, #fbbf24)',
        }}
      >
        <Sparkles className="w-3 h-3" style={{ color: 'var(--theme-primary, #f59e0b)' }} />
        <span>{position.label}</span>
      </div>

      {/* 3D Card Container */}
      <div
        className="perspective-1000 w-[125px] h-[215px] sm:w-[138px] sm:h-[238px] cursor-pointer"
        onClick={() => {
          if (!isRevealed) {
            onFlip(index)
          } else {
            onInspect(drawnCard)
          }
        }}
      >
        <div
          className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
            isRevealed ? 'rotate-y-180' : 'hover:scale-[1.03]'
          }`}
        >
          {/* Card Back (Verso Oculto - Imagem bgcarta.png) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-2xl bg-[#0c0716] transition-colors"
            style={{
              borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
              borderWidth: '1px',
            }}
          >
            <img
              src="./bg/bgcarta.png"
              alt="Verso da Carta - ArchiUrban"
              className="w-full h-full object-cover select-none pointer-events-none"
              loading="eager"
            />
          </div>

          {/* Card Front (Frente Revelada) */}
          <div
            className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-2xl bg-[#140e24] flex flex-col"
            style={{
              borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
              borderWidth: '1px',
            }}
          >
            {/* Card Image Area */}
            <div className="relative flex-1 w-full bg-black/60 overflow-hidden">
              <img
                src={card.img}
                alt={card.ptName}
                className={`w-full h-full object-cover transition-transform duration-500 ${
                  isReversed ? 'rotate-180' : ''
                }`}
                loading="eager"
              />

              {/* Inverted / Upright Badge */}
              <div
                className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase shadow-md flex items-center gap-1 bg-[#120c1f]/90"
                style={{
                  borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
                  borderWidth: '1px',
                }}
              >
                {isReversed ? (
                  <>
                    <RotateCw className="w-2.5 h-2.5 text-rose-400 rotate-180" />
                    <span className="text-rose-300">Invertida</span>
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    <span className="text-emerald-300">Normal</span>
                  </>
                )}
              </div>

              {/* Roman Numeral Badge */}
              <div
                className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mystic font-bold bg-black/70 border"
                style={{
                  borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
                  color: 'var(--theme-primary, #f59e0b)',
                }}
              >
                {card.roman}
              </div>

              {/* Hover Quick Inspect Overlay */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-medium"
                style={{
                  backgroundColor: 'rgba(10, 5, 18, 0.75)',
                }}
              >
                <Eye className="w-4 h-4" style={{ color: 'var(--theme-secondary, #fbbf24)' }} />
                <span>Ver Significado</span>
              </div>
            </div>

            {/* Bottom Card Title Banner */}
            <div
              className="p-2.5 border-t text-center"
              style={{
                backgroundColor: 'var(--theme-card-bg, rgba(14, 8, 24, 0.85))',
                borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
              }}
            >
              <h4
                className="font-mystic font-semibold text-xs sm:text-sm truncate"
                style={{ color: 'var(--theme-text-title, #ffffff)' }}
              >
                {card.ptName}
              </h4>
              <p
                className="text-[10px] truncate mt-0.5"
                style={{ color: 'var(--theme-secondary, #fbbf24)' }}
              >
                {card.type === 'major' ? 'Arcano Maior' : card.keywords[0]}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Snippet */}
      <div className="mt-2 text-center max-w-[170px]">
        <p
          className="text-[11px] line-clamp-1 italic"
          style={{ color: 'var(--theme-text-body, #f1f5f9)', opacity: 0.8 }}
        >
          {position.description}
        </p>
      </div>
    </div>
  )
}
