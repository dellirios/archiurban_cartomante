import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { TarotEngine } from './core/tarotEngine'
import { TAROT_DECK } from './data/tarotDeck'
import { DEFAULT_SPREADS } from './data/spreads'
import { SpreadConfig, DrawnCard } from './types/tarot'
import { SpreadSelector } from './components/SpreadSelector'
import { TarotTable } from './components/TarotTable'
import { ClientCardsView } from './components/ClientCardsView'
import { InviteNotification } from './components/InviteNotification'
import { CardDetailsModal } from './components/CardDetailsModal'
import { ThemeEditorModal, PRESET_THEMES, TarotTheme } from './components/ThemeEditorModal'

const THEME_STORAGE_KEY = 'archiurban_tarot_theme'

// Reprodução do som de cartas virando (./som/carta.mp3)
const playCardFlipSound = () => {
  try {
    const audio = new Audio('./som/carta.mp3')
    audio.volume = 0.75
    audio.currentTime = 0
    audio.play().catch(() => {
      // Browsers podem restringir áudio se não houver interação prévia
    })
  } catch {}
}

// Helper to apply theme colors directly to document root CSS variables
const applyThemeToCSS = (theme: TarotTheme) => {
  const root = document.documentElement
  root.style.setProperty('--theme-primary', theme.primary)
  root.style.setProperty('--theme-secondary', theme.secondary)
  root.style.setProperty('--theme-text-title', theme.textTitle)
  root.style.setProperty('--theme-text-body', theme.textBody)
  root.style.setProperty('--theme-card-border', theme.cardBorder)
  root.style.setProperty('--theme-card-bg', theme.cardBg)
  root.style.setProperty('--theme-glow', theme.glow)
  root.style.setProperty('--theme-bg-overlay', `rgba(10, 5, 18, ${theme.bgOverlayOpacity})`)
}

export const App: React.FC = () => {
  const isEnvBrowser = typeof window !== 'undefined' && !('GetParentResourceName' in window)
  const [isVisible, setIsVisible] = useState(isEnvBrowser && import.meta.env.DEV)
  const [inviteData, setInviteData] = useState<{ visible: boolean; duration: number }>({
    visible: false,
    duration: 15000,
  })
  const [phase, setPhase] = useState<'select' | 'reading'>('select')
  const [sessionMode, setSessionMode] = useState<'solo' | 'reader' | 'client'>('solo')
  const [selectedSpread, setSelectedSpread] = useState<SpreadConfig>(
    DEFAULT_SPREADS[1] // Trindade Temporal
  )
  const [allowReversed, setAllowReversed] = useState(true)
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([])
  const [inspectingCard, setInspectingCard] = useState<DrawnCard | null>(null)
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false)

  // Current active theme with local storage persistence and safe fallback merge
  const [currentTheme, setCurrentTheme] = useState<TarotTheme>(() => {
    const defaultTheme = PRESET_THEMES[0]
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        return {
          ...defaultTheme,
          ...parsed,
          textTitle: parsed.textTitle || defaultTheme.textTitle,
          textBody: parsed.textBody || defaultTheme.textBody,
          cardBorder: parsed.cardBorder || defaultTheme.cardBorder,
          cardBg: parsed.cardBg || defaultTheme.cardBg,
          bgOverlayOpacity: parsed.bgOverlayOpacity ?? defaultTheme.bgOverlayOpacity,
        }
      }
    } catch {}
    return defaultTheme
  })

  // Apply theme on load and change
  useEffect(() => {
    applyThemeToCSS(currentTheme)
  }, [currentTheme])

  const handleApplyTheme = (newTheme: TarotTheme) => {
    setCurrentTheme(newTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newTheme))
    } catch {}
  }

  // Initialize Tarot Engine with full 78 cards
  const engine = useMemo(() => {
    const eng = new TarotEngine(TAROT_DECK)
    DEFAULT_SPREADS.forEach((sp) => eng.registerSpread(sp))
    return eng
  }, [])

  // Close handler dispatching NUI callback to FiveM
  const handleClose = useCallback(() => {
    setIsVisible(false)
    setIsThemeEditorOpen(false)
    if ('GetParentResourceName' in window) {
      fetch(
        `https://${(
          window as unknown as { GetParentResourceName: () => string }
        ).GetParentResourceName()}/close`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      ).catch(() => {})
    }
  }, [])

  // Relé de sincronização entre leitor e consulente
  const relaySyncAction = useCallback(
    (payload: Record<string, unknown>) => {
      if ('GetParentResourceName' in window) {
        fetch(
          `https://${(
            window as unknown as { GetParentResourceName: () => string }
          ).GetParentResourceName()}/relaySyncAction`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        ).catch(() => {})
      }
    },
    []
  )

  // FiveM NUI Message listener and Escape key listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data
      if (data?.action === 'openTarot') {
        setIsVisible(true)
        const mode = (data.mode as 'solo' | 'reader' | 'client') || 'solo'
        setSessionMode(mode)

        if (data.spreadId) {
          const sp = DEFAULT_SPREADS.find((s) => s.id === data.spreadId)
          if (sp) setSelectedSpread(sp)
        }

        if (mode === 'client') {
          // Consulente inicia focado nas cartas da mesa (à esquerda)
          const defaultSp = DEFAULT_SPREADS[1]
          setSelectedSpread(defaultSp)
          const initialCards = engine.doReading(defaultSp.id, true)
          setDrawnCards(initialCards)
          setPhase('reading')
        } else {
          setPhase('select')
        }
      } else if (data?.action === 'syncAction' && data.payload) {
        const p = data.payload
        if (p.type === 'startReading') {
          setSelectedSpread(p.spread)
          setDrawnCards(p.cards)
          setPhase('reading')
          playCardFlipSound()
        } else if (p.type === 'flipCard') {
          playCardFlipSound()
          setDrawnCards((prev) => {
            const updated = [...prev]
            if (updated[p.index]) {
              updated[p.index] = {
                ...updated[p.index],
                isRevealed: true,
                revealedAt: Date.now(),
              }
            }
            return updated
          })
        } else if (p.type === 'flipAll') {
          playCardFlipSound()
          setDrawnCards((prev) =>
            prev.map((card) => ({
              ...card,
              isRevealed: true,
              revealedAt: Date.now(),
            }))
          )
        } else if (p.type === 'resetReading') {
          playCardFlipSound()
          setDrawnCards(p.cards)
        } else if (p.type === 'changeSpread') {
          setPhase('select')
        }
      } else if (data?.action === 'showInvitePrompt') {
        setInviteData({
          visible: true,
          duration: data.duration || 15000,
        })
      } else if (data?.action === 'hideInvitePrompt') {
        setInviteData({ visible: false, duration: 15000 })
      } else if (data?.action === 'openColorEditor') {
        setIsVisible(true)
        setIsThemeEditorOpen(true)
      } else if (data?.action === 'closeTarot') {
        setIsVisible(false)
        setIsThemeEditorOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isThemeEditorOpen) {
          setIsThemeEditorOpen(false)
        } else if (inspectingCard) {
          setInspectingCard(null)
        } else {
          handleClose()
        }
      }
    }

    window.addEventListener('message', handleMessage)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('message', handleMessage)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [inspectingCard, isThemeEditorOpen, handleClose, engine])

  // Start reading with selected spread
  const handleStartReading = () => {
    playCardFlipSound()
    const cards = engine.doReading(selectedSpread.id, allowReversed)
    setDrawnCards(cards)
    setPhase('reading')
    if (sessionMode === 'reader') {
      relaySyncAction({ type: 'startReading', spread: selectedSpread, cards })
    }
  }

  // Flip an individual card (cada carta faz seu proprio som ao virar)
  const handleFlipCard = (index: number) => {
    playCardFlipSound()
    setDrawnCards((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        isRevealed: true,
        revealedAt: Date.now(),
      }
      return updated
    })
    if (sessionMode === 'reader') {
      relaySyncAction({ type: 'flipCard', index })
    }
  }

  // Flip all remaining cards (faz um unico som para todas ao revelar tudo)
  const handleFlipAll = () => {
    playCardFlipSound()
    setDrawnCards((prev) =>
      prev.map((card) => ({
        ...card,
        isRevealed: true,
        revealedAt: Date.now(),
      }))
    )
    if (sessionMode === 'reader') {
      relaySyncAction({ type: 'flipAll' })
    }
  }

  // Reset current reading with new shuffle
  const handleResetReading = () => {
    playCardFlipSound()
    const cards = engine.doReading(selectedSpread.id, allowReversed)
    setDrawnCards(cards)
    if (sessionMode === 'reader') {
      relaySyncAction({ type: 'resetReading', cards })
    }
  }

  const handleChangeSpread = () => {
    setPhase('select')
    if (sessionMode === 'reader') {
      relaySyncAction({ type: 'changeSpread' })
    }
  }

  const handleAnswerInvite = (accept: boolean) => {
    setInviteData({ visible: false, duration: 15000 })
    if ('GetParentResourceName' in window) {
      fetch(
        `https://${(
          window as unknown as { GetParentResourceName: () => string }
        ).GetParentResourceName()}/answerInvite`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accept }),
        }
      ).catch(() => {})
    }
  }

  return (
    <>
      {inviteData.visible && (
        <InviteNotification
          duration={inviteData.duration}
          onAccept={() => handleAnswerInvite(true)}
          onDecline={() => handleAnswerInvite(false)}
        />
      )}

      {isVisible && (
        <main
          className={`w-full h-full min-h-screen flex items-center py-6 select-none bg-transparent pointer-events-none ${
            sessionMode === 'client'
              ? 'justify-center'
              : 'justify-end pr-24 sm:pr-28 md:pr-32'
          }`}
        >
          {sessionMode === 'client' ? (
            <ClientCardsView
              spread={selectedSpread}
              drawnCards={drawnCards}
              onClose={handleClose}
            />
          ) : phase === 'select' ? (
            <SpreadSelector
              spreads={DEFAULT_SPREADS}
              selectedSpread={selectedSpread}
              allowReversed={allowReversed}
              onSelectSpread={setSelectedSpread}
              onToggleReversed={setAllowReversed}
              onStartReading={handleStartReading}
              onOpenThemeEditor={() => setIsThemeEditorOpen(true)}
              onClose={handleClose}
            />
          ) : (
            <TarotTable
              spread={selectedSpread}
              drawnCards={drawnCards}
              sessionMode={sessionMode}
              onFlipCard={handleFlipCard}
              onFlipAll={handleFlipAll}
              onInspectCard={setInspectingCard}
              onResetReading={handleResetReading}
              onChangeSpread={handleChangeSpread}
              onOpenThemeEditor={() => setIsThemeEditorOpen(true)}
              onClose={handleClose}
            />
          )}

          {/* Theme Color Editor Modal (/cartasedit or Palette Button - apenas leitor/solo) */}
          {sessionMode !== 'client' && isThemeEditorOpen && (
            <ThemeEditorModal
              currentTheme={currentTheme}
              onApplyTheme={handleApplyTheme}
              onClose={() => setIsThemeEditorOpen(false)}
            />
          )}

          {/* Card Details Modal Docked on the Right (apenas leitor/solo) */}
          {sessionMode !== 'client' && (
            <CardDetailsModal
              drawnCard={inspectingCard}
              onClose={() => setInspectingCard(null)}
            />
          )}
        </main>
      )}
    </>
  )
}

export default App
