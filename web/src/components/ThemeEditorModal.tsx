import React, { useState } from 'react'
import { Palette, Check, RotateCcw, X, Sparkles, Sliders, Type, Layers } from 'lucide-react'

export interface TarotTheme {
  name: string
  primary: string        // Ícones, destaques e botões
  secondary: string      // Subtítulos e badges
  textTitle: string      // Cor da fonte dos títulos
  textBody: string       // Cor da fonte das descrições
  cardBorder: string     // Cor da borda dos cards
  cardBg: string         // Fundo dos cards na lista
  glow: string           // Brilho
  bgOverlayOpacity: number // Escurecimento da imagem de fundo
}

export const PRESET_THEMES: TarotTheme[] = [
  {
    name: 'Dourado Alquímico',
    primary: '#f59e0b',
    secondary: '#fbbf24',
    textTitle: '#fef08a',
    textBody: '#f1f5f9',
    cardBorder: 'rgba(245, 158, 11, 0.40)',
    cardBg: 'rgba(14, 8, 24, 0.85)',
    glow: 'rgba(245, 158, 11, 0.35)',
    bgOverlayOpacity: 0.40,
  },
  {
    name: 'Violeta Místico',
    primary: '#a855f7',
    secondary: '#c084fc',
    textTitle: '#f3e8ff',
    textBody: '#f1f5f9',
    cardBorder: 'rgba(168, 85, 247, 0.40)',
    cardBg: 'rgba(20, 10, 35, 0.85)',
    glow: 'rgba(168, 85, 247, 0.35)',
    bgOverlayOpacity: 0.40,
  },
  {
    name: 'Ciano Astral',
    primary: '#06b6d4',
    secondary: '#22d3ee',
    textTitle: '#cffafe',
    textBody: '#f1f5f9',
    cardBorder: 'rgba(6, 182, 212, 0.40)',
    cardBg: 'rgba(8, 18, 32, 0.85)',
    glow: 'rgba(6, 182, 212, 0.35)',
    bgOverlayOpacity: 0.40,
  },
  {
    name: 'Carmesim Noturno',
    primary: '#f43f5e',
    secondary: '#fb7185',
    textTitle: '#ffe4e6',
    textBody: '#f1f5f9',
    cardBorder: 'rgba(244, 63, 94, 0.40)',
    cardBg: 'rgba(28, 10, 20, 0.85)',
    glow: 'rgba(244, 63, 94, 0.35)',
    bgOverlayOpacity: 0.40,
  },
  {
    name: 'Esmeralda Oculta',
    primary: '#10b981',
    secondary: '#34d399',
    textTitle: '#d1fae5',
    textBody: '#f1f5f9',
    cardBorder: 'rgba(16, 185, 129, 0.40)',
    cardBg: 'rgba(8, 25, 18, 0.85)',
    glow: 'rgba(16, 185, 129, 0.35)',
    bgOverlayOpacity: 0.40,
  },
  {
    name: 'Noite Cósmica',
    primary: '#6366f1',
    secondary: '#818cf8',
    textTitle: '#e0e7ff',
    textBody: '#f1f5f9',
    cardBorder: 'rgba(99, 102, 241, 0.40)',
    cardBg: 'rgba(12, 12, 34, 0.85)',
    glow: 'rgba(99, 102, 241, 0.35)',
    bgOverlayOpacity: 0.40,
  },
]

interface ThemeEditorModalProps {
  currentTheme: TarotTheme
  onApplyTheme: (theme: TarotTheme) => void
  onClose: () => void
}

export const ThemeEditorModal: React.FC<ThemeEditorModalProps> = ({
  currentTheme,
  onApplyTheme,
  onClose,
}) => {
  const defaultTheme = PRESET_THEMES[0]
  const [primary, setPrimary] = useState(currentTheme?.primary || defaultTheme.primary)
  const [secondary, setSecondary] = useState(currentTheme?.secondary || defaultTheme.secondary)
  const [textTitle, setTextTitle] = useState(currentTheme?.textTitle || defaultTheme.textTitle)
  const [textBody, setTextBody] = useState(currentTheme?.textBody || defaultTheme.textBody)
  const [cardBorder, setCardBorder] = useState(currentTheme?.cardBorder || defaultTheme.cardBorder)
  const [bgOverlayOpacity, setBgOverlayOpacity] = useState(
    currentTheme?.bgOverlayOpacity ?? defaultTheme.bgOverlayOpacity
  )

  const handleUpdate = (updates: Partial<TarotTheme>) => {
    const updated: TarotTheme = {
      ...defaultTheme,
      ...currentTheme,
      primary,
      secondary,
      textTitle,
      textBody,
      cardBorder,
      bgOverlayOpacity,
      glow: `${primary}55`,
      ...updates,
    }
    onApplyTheme(updated)
  }

  const handleResetDefault = () => {
    const def = PRESET_THEMES[0]
    setPrimary(def.primary)
    setSecondary(def.secondary)
    setTextTitle(def.textTitle)
    setTextBody(def.textBody)
    setCardBorder(def.cardBorder)
    setBgOverlayOpacity(def.bgOverlayOpacity)
    onApplyTheme(def)
  }

  return (
    <div className="fixed left-6 sm:left-10 md:left-14 top-6 bottom-6 z-50 w-[400px] max-w-[94vw] rounded-2xl border border-white/20 p-5 overflow-y-auto flex flex-col justify-between shadow-2xl animate-in fade-in slide-in-from-left-4 duration-200 pointer-events-auto bg-[#0a0514]/95 text-slate-100">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg border shadow-sm"
              style={{
                backgroundColor: `${primary}25`,
                borderColor: `${primary}55`,
                color: primary,
              }}
            >
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-mystic text-sm font-bold text-white tracking-wide">
                Editor de Cores do Menu
              </h2>
              <p className="text-[10px] text-slate-400">Personalize fontes, ícones e cards</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-black/40 hover:bg-rose-950/80 border border-white/10 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Palettes */}
        <div className="mb-5">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-2.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Paletas Prontas</span>
          </span>

          <div className="grid grid-cols-2 gap-2">
            {PRESET_THEMES.map((theme) => {
              const isSelected =
                (currentTheme?.primary || '').toLowerCase() === theme.primary.toLowerCase()

              return (
                <button
                  key={theme.name}
                  onClick={() => {
                    setPrimary(theme.primary)
                    setSecondary(theme.secondary)
                    setTextTitle(theme.textTitle)
                    setTextBody(theme.textBody)
                    setCardBorder(theme.cardBorder)
                    setBgOverlayOpacity(theme.bgOverlayOpacity)
                    onApplyTheme(theme)
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-white/10 shadow-md ring-1 ring-amber-400/50'
                      : 'border-white/10 bg-black/40 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-xs"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-xs"
                        style={{ backgroundColor: theme.secondary }}
                      />
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  </div>
                  <span className="text-[11px] font-medium text-white truncate">
                    {theme.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detailed Controls */}
        <div className="mb-4 p-3.5 rounded-xl bg-black/50 border border-white/10 flex flex-col gap-3">
          <span className="text-[11px] font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5 border-b border-white/10 pb-1.5">
            <Sliders className="w-3 h-3 text-amber-400" />
            <span>Ajuste Fino de Cores</span>
          </span>

          {/* 1. Ícones e Destaques */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300">Ícones e Botão de Ação</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primary || '#f59e0b'}
                onChange={(e) => {
                  setPrimary(e.target.value)
                  handleUpdate({ primary: e.target.value })
                }}
                className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400">{(primary || '').toUpperCase()}</span>
            </div>
          </div>

          {/* 2. Subtítulos e Badges */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-300">Subtítulos e Badges</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondary || '#fbbf24'}
                onChange={(e) => {
                  setSecondary(e.target.value)
                  handleUpdate({ secondary: e.target.value })
                }}
                className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400">{(secondary || '').toUpperCase()}</span>
            </div>
          </div>

          {/* 3. Títulos das Cartas */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs text-slate-300">Fonte dos Títulos</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textTitle || '#fef08a'}
                onChange={(e) => {
                  setTextTitle(e.target.value)
                  handleUpdate({ textTitle: e.target.value })
                }}
                className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400">{(textTitle || '').toUpperCase()}</span>
            </div>
          </div>

          {/* 4. Descrições */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-300">Fonte das Descrições</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={textBody || '#f1f5f9'}
                onChange={(e) => {
                  setTextBody(e.target.value)
                  handleUpdate({ textBody: e.target.value })
                }}
                className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
              />
              <span className="text-[11px] font-mono text-slate-400">{(textBody || '').toUpperCase()}</span>
            </div>
          </div>

          {/* 5. Bordas dos Cards */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span className="text-xs text-slate-300">Bordas dos Cards</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primary}
                onChange={(e) => {
                  const val = `${e.target.value}66`
                  setCardBorder(val)
                  handleUpdate({ cardBorder: val })
                }}
                className="w-7 h-7 rounded border border-white/20 bg-transparent cursor-pointer"
              />
            </div>
          </div>

          {/* 6. Contraste do Background */}
          <div className="flex flex-col gap-1 pt-1 border-t border-white/10">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Filtro de Contraste da Arte</span>
              <span className="text-[11px] font-mono text-amber-300">
                {Math.round(bgOverlayOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.15"
              max="0.80"
              step="0.05"
              value={bgOverlayOpacity}
              onChange={(e) => {
                const val = parseFloat(e.target.value)
                setBgOverlayOpacity(val)
                handleUpdate({ bgOverlayOpacity: val })
              }}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-white/10 flex gap-2">
        <button
          onClick={handleResetDefault}
          className="px-3.5 py-2 rounded-xl bg-black/50 hover:bg-black/80 border border-white/15 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar</span>
        </button>

        <button
          onClick={onClose}
          className="flex-1 py-2 rounded-xl text-slate-950 font-bold text-xs tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
          style={{ backgroundColor: primary }}
        >
          <Check className="w-3.5 h-3.5" />
          <span>Pronto</span>
        </button>
      </div>
    </div>
  )
}
