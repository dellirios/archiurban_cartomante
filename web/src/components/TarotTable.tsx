import React, { useState, useEffect } from 'react'
import { DrawnCard, SpreadConfig } from '../types/tarot'
import { TarotCard } from './TarotCard'
import {
  Sparkles,
  RotateCcw,
  Layers,
  Eye,
  RotateCw,
  BookOpen,
  Compass,
  Flame,
  Moon,
  X,
  Palette,
} from 'lucide-react'

interface TarotTableProps {
  spread: SpreadConfig
  drawnCards: DrawnCard[]
  sessionMode?: 'solo' | 'reader' | 'client'
  onFlipCard: (index: number) => void
  onFlipAll: () => void
  onInspectCard: (card: DrawnCard) => void
  onResetReading: () => void
  onChangeSpread: () => void
  onOpenThemeEditor: () => void
  onClose: () => void
}

export const TarotTable: React.FC<TarotTableProps> = ({
  spread,
  drawnCards,
  sessionMode = 'solo',
  onFlipCard,
  onFlipAll,
  onResetReading,
  onChangeSpread,
  onOpenThemeEditor,
  onClose,
}) => {
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0)

  const allRevealed = drawnCards.length > 0 && drawnCards.every((c) => c.isRevealed)
  const revealedCount = drawnCards.filter((c) => c.isRevealed).length

  // Automatically select the most recently revealed card or the first revealed card
  useEffect(() => {
    const lastRevealedIdx = drawnCards.findIndex((c) => c.isRevealed)
    if (
      lastRevealedIdx !== -1 &&
      (!drawnCards[activeCardIndex] || !drawnCards[activeCardIndex].isRevealed)
    ) {
      setActiveCardIndex(lastRevealedIdx)
    }
  }, [drawnCards, activeCardIndex])

  const activeDrawnCard = drawnCards[activeCardIndex]
  const isCardActiveAndRevealed = activeDrawnCard && activeDrawnCard.isRevealed

  return (
    <div
      className="relative w-[490px] max-w-[94vw] max-h-[94vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto bg-[#0a0512]"
      style={{
        borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.2))',
      }}
    >
      {/* Menu Background Artwork */}
      <img
        src="./bg/cartasdodia2.png"
        alt="Altar Reading Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-100"
      />
      {/* Dynamic Overlay Contrast Filter */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-300"
        style={{
          backgroundColor: 'var(--theme-bg-overlay, rgba(10, 5, 18, 0.45))',
        }}
      />

      <div className="relative z-10 flex flex-col h-full overflow-hidden">
        {/* Altar Header */}
        <header
          className="px-4 py-3 border-b flex items-center justify-between gap-2 flex-shrink-0 bg-black/60"
          style={{ borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.15))' }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shadow-sm"
              style={{
                backgroundColor: 'var(--theme-primary, #f59e0b)',
                color: '#000000',
              }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1
                  className="font-mystic text-sm font-bold tracking-wide"
                  style={{ color: 'var(--theme-text-title, #ffffff)' }}
                >
                  {spread.name}
                </h1>
                <span
                  className="text-[10px] px-2 py-0.2 rounded-full border bg-black/70 font-semibold"
                  style={{
                    borderColor: 'var(--theme-card-border)',
                    color: 'var(--theme-secondary, #fbbf24)',
                  }}
                >
                  {revealedCount}/{spread.cardCount}
                </span>
              </div>
              <p
                className="text-[10px]"
                style={{ color: 'var(--theme-secondary, #fbbf24)' }}
              >
                {spread.subtitle}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-1">
            {sessionMode !== 'client' && (
              <>
                {!allRevealed && (
                  <button
                    onClick={onFlipAll}
                    className="px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer bg-black/60 hover:bg-black/80"
                    style={{
                      borderColor: 'var(--theme-card-border)',
                      color: 'var(--theme-secondary)',
                    }}
                    title="Revelar todas as cartas"
                  >
                    <Eye className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
                    <span>Revelar</span>
                  </button>
                )}

                <button
                  onClick={() => {
                    onResetReading()
                    setActiveCardIndex(0)
                  }}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 border transition-all cursor-pointer"
                  style={{
                    borderColor: 'var(--theme-card-border)',
                    color: 'var(--theme-primary)',
                  }}
                  title="Embaralhar novamente"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onChangeSpread}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 border transition-all cursor-pointer"
                  style={{
                    borderColor: 'var(--theme-card-border)',
                    color: 'var(--theme-secondary)',
                  }}
                  title="Mudar oráculo"
                >
                  <Layers className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onOpenThemeEditor}
                  className="p-1.5 rounded-lg bg-black/60 hover:bg-black/80 border transition-all cursor-pointer"
                  style={{
                    borderColor: 'var(--theme-card-border)',
                    color: 'var(--theme-primary)',
                  }}
                  title="Editor de Cores (/cartasedit)"
                >
                  <Palette className="w-3.5 h-3.5" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-950/70 border border-white/10 text-slate-300 hover:text-rose-200 transition-colors ml-1 cursor-pointer"
              title="Fechar mesa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Main Content (Cards + Live Reading) */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col items-center gap-4">
          {!allRevealed && (
            <div className="text-center">
              <span
                className="text-[11px] px-3.5 py-1 rounded-full border shadow-xs animate-pulse bg-black/75"
                style={{
                  borderColor: 'var(--theme-card-border)',
                  color: 'var(--theme-secondary, #fbbf24)',
                }}
              >
                Toque na carta fechada para revelá-la
              </span>
            </div>
          )}

          {/* Cards Row / Grid */}
          <div
            className={`w-full flex flex-wrap justify-center items-center gap-3 py-1 ${
              drawnCards.length === 1 ? 'max-w-[200px]' : 'max-w-[440px]'
            }`}
          >
            {drawnCards.map((drawnCard, index) => {
              const isCurrentActive = index === activeCardIndex
              return (
                <div
                  key={`${drawnCard.card.id}-${drawnCard.position.id}`}
                  onClick={() => {
                    if (drawnCard.isRevealed) {
                      setActiveCardIndex(index)
                    }
                  }}
                  className={`relative transition-all duration-200 rounded-xl p-1 ${
                    isCurrentActive && drawnCard.isRevealed
                      ? 'ring-2 shadow-lg'
                      : ''
                  }`}
                  style={{
                    boxShadow:
                      isCurrentActive && drawnCard.isRevealed
                        ? '0 0 16px var(--theme-glow)'
                        : 'none',
                  }}
                >
                  <TarotCard
                    drawnCard={drawnCard}
                    index={index}
                    onFlip={(idx) => {
                      if (sessionMode !== 'client') {
                        onFlipCard(idx)
                        setActiveCardIndex(idx)
                      }
                    }}
                    onInspect={() => {
                      if (sessionMode !== 'client') {
                        setActiveCardIndex(index)
                      }
                    }}
                  />
                </div>
              )
            })}
          </div>

          {/* Multi-card selector tabs if more than 1 card */}
              {drawnCards.length > 1 && revealedCount > 0 && (
                <div
                  className="w-full flex items-center justify-center gap-1.5 flex-wrap pt-2 border-t"
                  style={{ borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.15))' }}
                >
                  {drawnCards.map((dc, idx) => (
                    <button
                      key={dc.position.id}
                      onClick={() => dc.isRevealed && setActiveCardIndex(idx)}
                      disabled={!dc.isRevealed}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all ${
                        idx === activeCardIndex && dc.isRevealed
                          ? 'font-bold border'
                          : dc.isRevealed
                          ? 'border bg-black/60 hover:bg-black/80 cursor-pointer'
                          : 'border bg-black/30 opacity-40 cursor-not-allowed'
                      }`}
                      style={{
                        backgroundColor:
                          idx === activeCardIndex && dc.isRevealed
                            ? 'var(--theme-primary)'
                            : undefined,
                        color:
                          idx === activeCardIndex && dc.isRevealed
                            ? '#000000'
                            : 'var(--theme-secondary)',
                        borderColor: 'var(--theme-card-border)',
                      }}
                    >
                      {dc.position.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Live Card Interpretation Section */}
              {isCardActiveAndRevealed && activeDrawnCard && (
                <div
                  className="w-full rounded-2xl border p-4 shadow-xl flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
                  style={{
                    backgroundColor: 'var(--theme-card-bg, rgba(14, 8, 24, 0.88))',
                    borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.2))',
                    boxShadow: '0 8px 24px var(--theme-glow, rgba(0, 0, 0, 0.4))',
                  }}
                >
                  {/* Header: Title, Roman numeral, Upright/Inverted Badge */}
                  <div
                    className="flex items-start justify-between gap-2 border-b pb-2.5"
                    style={{ borderColor: 'var(--theme-card-border)' }}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-mystic font-bold border"
                          style={{
                            borderColor: 'var(--theme-card-border)',
                            color: 'var(--theme-primary)',
                          }}
                        >
                          {activeDrawnCard.card.roman}
                        </span>
                        <h3
                          className="font-mystic font-bold text-sm sm:text-base leading-tight"
                          style={{ color: 'var(--theme-text-title)' }}
                        >
                          {activeDrawnCard.card.ptName}
                        </h3>
                      </div>
                      <p
                        className="text-[11px] italic mt-0.5"
                        style={{ color: 'var(--theme-secondary)' }}
                      >
                        {activeDrawnCard.card.name}
                      </p>
                    </div>

                    <div
                      className="px-2.5 py-1 rounded-md text-[10px] font-semibold border flex items-center gap-1 shadow-sm"
                      style={{
                        borderColor: 'var(--theme-card-border)',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                      }}
                    >
                      {activeDrawnCard.isReversed ? (
                        <>
                          <RotateCw className="w-3 h-3 text-rose-400 rotate-180" />
                          <span className="text-rose-300 font-medium">Invertida (Sombra)</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300 font-medium">Direta (Luz)</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Position Significance */}
                  <div
                    className="p-2.5 rounded-xl border flex flex-col gap-1"
                    style={{
                      borderColor: 'var(--theme-card-border)',
                      backgroundColor: 'rgba(0,0,0,0.4)',
                    }}
                  >
                    <div
                      className="flex items-center gap-1.5 text-xs font-semibold"
                      style={{ color: 'var(--theme-primary)' }}
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{activeDrawnCard.position.label}</span>
                    </div>
                    <p
                      className="text-[11px] leading-relaxed"
                      style={{ color: 'var(--theme-text-body)' }}
                    >
                      {activeDrawnCard.position.description}
                    </p>
                  </div>

                  {/* Oracle Interpretation Message */}
                  <div
                    className="p-3 rounded-xl border flex flex-col gap-1"
                    style={{
                      borderColor: 'var(--theme-card-border)',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                    }}
                  >
                    <div
                      className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide uppercase"
                      style={{ color: 'var(--theme-secondary)' }}
                    >
                      <BookOpen className="w-3.5 h-3.5" style={{ color: 'var(--theme-primary)' }} />
                      <span>Mensagem do Oráculo</span>
                    </div>
                    <p
                      className="text-xs leading-relaxed font-reading"
                      style={{ color: 'var(--theme-text-body)' }}
                    >
                      {activeDrawnCard.isReversed
                        ? activeDrawnCard.card.reversedMeaning
                        : activeDrawnCard.card.uprightMeaning}
                    </p>
                  </div>

                  {/* Badges: Keywords & Element/Astrology */}
                  <div
                    className="flex items-center justify-between gap-2 flex-wrap pt-1 border-t"
                    style={{ borderColor: 'var(--theme-card-border)' }}
                  >
                    <div className="flex flex-wrap gap-1">
                      {activeDrawnCard.card.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded text-[10px] font-medium border bg-black/60"
                          style={{
                            borderColor: 'var(--theme-card-border)',
                            color: 'var(--theme-secondary)',
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {activeDrawnCard.card.element && (
                        <span
                          className="flex items-center gap-1 px-2 py-0.5 rounded border bg-black/70 text-[10px] font-semibold"
                          style={{
                            borderColor: 'var(--theme-card-border)',
                            color: 'var(--theme-primary)',
                          }}
                        >
                          <Flame className="w-3 h-3" />
                          {activeDrawnCard.card.element}
                        </span>
                      )}
                      {activeDrawnCard.card.astrology && (
                        <span
                          className="flex items-center gap-1 px-2 py-0.5 rounded border bg-black/70 text-[10px] font-semibold"
                          style={{
                            borderColor: 'var(--theme-card-border)',
                            color: 'var(--theme-secondary)',
                          }}
                        >
                          <Moon className="w-3 h-3" />
                          {activeDrawnCard.card.astrology}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
        </div>
      </div>
    </div>
  )
}
