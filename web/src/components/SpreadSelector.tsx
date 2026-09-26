import React from 'react'
import { SpreadConfig } from '../types/tarot'
import { Sparkles, Layers, Compass, Sun, ShieldCheck, X, Palette } from 'lucide-react'

interface SpreadSelectorProps {
  spreads: SpreadConfig[]
  selectedSpread: SpreadConfig
  allowReversed: boolean
  onSelectSpread: (spread: SpreadConfig) => void
  onToggleReversed: (enabled: boolean) => void
  onStartReading: () => void
  onOpenThemeEditor: () => void
  onClose: () => void
}

export const SpreadSelector: React.FC<SpreadSelectorProps> = ({
  spreads,
  selectedSpread,
  allowReversed,
  onSelectSpread,
  onToggleReversed,
  onStartReading,
  onOpenThemeEditor,
  onClose,
}) => {
  return (
    <div
      className="relative w-[410px] max-w-[92vw] rounded-2xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-right-4 duration-300 pointer-events-auto overflow-hidden border"
      style={{
        borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.2))',
        backgroundColor: '#0a0512',
      }}
    >
      {/* Menu Background Artwork */}
      <img
        src="./bg/cartasdodia.png"
        alt="Altar Menu Background"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-100"
      />
      {/* Dynamic Overlay Contrast Filter */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors duration-300"
        style={{
          backgroundColor: 'var(--theme-bg-overlay, rgba(10, 5, 18, 0.45))',
        }}
      />

      <div className="relative z-10 flex flex-col gap-4">
        {/* Header */}
        <div
          className="flex items-start justify-between border-b pb-3"
          style={{ borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.15))' }}
        >
          <div>
            <div
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[11px] font-semibold mb-1 shadow-sm bg-black/60"
              style={{
                borderColor: 'var(--theme-card-border)',
                color: 'var(--theme-secondary)',
              }}
            >
              <Sparkles className="w-3 h-3" style={{ color: 'var(--theme-primary)' }} />
              <span>Oráculo ArchiUrban</span>
            </div>
            <h2
              className="font-mystic text-xl font-bold tracking-wider drop-shadow-md"
              style={{ color: 'var(--theme-text-title, #ffffff)' }}
            >
              Tiragem de Tarô
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenThemeEditor}
              className="p-2 rounded-lg bg-black/60 hover:bg-black/80 border transition-all cursor-pointer shadow-sm"
              style={{
                borderColor: 'var(--theme-card-border)',
                color: 'var(--theme-primary)',
              }}
              title="Editor de Cores (/cartasedit)"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-black/60 hover:bg-rose-950/80 border border-white/10 text-slate-300 hover:text-rose-300 transition-all cursor-pointer shadow-sm"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Spreads List */}
        <div className="flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto pr-1">
          {spreads.map((spread) => {
            const isSelected = spread.id === selectedSpread.id

            return (
              <div
                key={spread.id}
                onClick={() => onSelectSpread(spread)}
                className={`cursor-pointer p-3.5 rounded-xl border transition-all duration-200 flex flex-col gap-1.5 shadow-md`}
                style={{
                  backgroundColor: 'var(--theme-card-bg, rgba(14, 8, 24, 0.85))',
                  borderColor: isSelected
                    ? 'var(--theme-primary, #f59e0b)'
                    : 'var(--theme-card-border, rgba(255, 255, 255, 0.15))',
                  boxShadow: isSelected
                    ? '0 0 16px var(--theme-glow, rgba(245, 158, 11, 0.3))'
                    : 'none',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="p-2 rounded-lg transition-all border"
                      style={{
                        backgroundColor: isSelected
                          ? 'var(--theme-primary, #f59e0b)'
                          : 'rgba(0, 0, 0, 0.5)',
                        borderColor: 'var(--theme-card-border)',
                        color: isSelected ? '#000000' : 'var(--theme-primary, #f59e0b)',
                      }}
                    >
                      {spread.cardCount === 1 && <Sun className="w-4 h-4" />}
                      {spread.cardCount === 3 && <Layers className="w-4 h-4" />}
                      {spread.cardCount === 4 && <Compass className="w-4 h-4" />}
                      {spread.cardCount >= 10 && <Sparkles className="w-4 h-4" />}
                    </div>
                    <div>
                      <h3
                        className="font-mystic font-bold text-sm tracking-wide"
                        style={{ color: 'var(--theme-text-title, #ffffff)' }}
                      >
                        {spread.name}
                      </h3>
                      <p
                        className="text-[11px] font-medium"
                        style={{ color: 'var(--theme-secondary, #fbbf24)' }}
                      >
                        {spread.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-black/60"
                      style={{
                        borderColor: 'var(--theme-card-border)',
                        color: 'var(--theme-secondary)',
                      }}
                    >
                      {spread.cardCount} {spread.cardCount === 1 ? 'carta' : 'cartas'}
                    </span>
                    {isSelected && (
                      <ShieldCheck
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: 'var(--theme-primary)' }}
                      />
                    )}
                  </div>
                </div>

                <p
                  className="text-xs leading-relaxed font-sans pl-1"
                  style={{ color: 'var(--theme-text-body, #e2e8f0)' }}
                >
                  {spread.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Options & Action Footer */}
        <div
          className="pt-3 border-t flex flex-col gap-3"
          style={{ borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.15))' }}
        >
          <label className="flex items-center gap-2.5 cursor-pointer select-none px-1">
            <input
              type="checkbox"
              checked={allowReversed}
              onChange={(e) => onToggleReversed(e.target.checked)}
              className="w-4 h-4 rounded bg-black/80 cursor-pointer"
              style={{ accentColor: 'var(--theme-primary)' }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: 'var(--theme-secondary, #fbbf24)' }}
            >
              Permitir Cartas Invertidas (Sombra)
            </span>
          </label>

          <button
            onClick={onStartReading}
            className="w-full py-3 rounded-xl font-mystic text-xs font-bold tracking-widest uppercase shadow-xl active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 border border-white/20"
            style={{
              backgroundColor: 'var(--theme-primary, #f59e0b)',
              color: '#000000',
              boxShadow: '0 4px 20px var(--theme-glow, rgba(245, 158, 11, 0.4))',
            }}
          >
            <Sparkles className="w-4 h-4 text-black" />
            <span>Consultar os Arcanos</span>
          </button>
        </div>
      </div>
    </div>
  )
}
