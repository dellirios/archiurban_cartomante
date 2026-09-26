import React from 'react'
import { DrawnCard, SpreadConfig } from '../types/tarot'
import { Sparkles, RotateCw, X } from 'lucide-react'

interface ClientCardsViewProps {
  spread: SpreadConfig
  drawnCards: DrawnCard[]
  onClose: () => void
}

export const ClientCardsView: React.FC<ClientCardsViewProps> = ({
  spread,
  drawnCards,
  onClose,
}) => {
  // Ajuste dinâmico de tamanho conforme o número de cartas para caber perfeitamente na tela
  const isLargeSpread = drawnCards.length > 3

  return (
    <div className="relative w-full h-full min-h-screen flex flex-col items-center justify-center pointer-events-none select-none px-4">
      {/* Botão sutil de saída no canto superior direito */}
      <div className="absolute top-6 right-8 flex items-center gap-2 pointer-events-auto">
        <button
          onClick={onClose}
          className="px-3.5 py-1.5 rounded-full border border-white/10 bg-black/40 hover:bg-black/70 text-slate-300 hover:text-white text-xs flex items-center gap-2 transition-all shadow-lg cursor-pointer"
          style={{ borderColor: 'var(--theme-card-border, rgba(255, 255, 255, 0.15))' }}
          title="Fechar Leitura (ESC)"
        >
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-white/80">ESC</span>
          <span>Fechar</span>
          <X className="w-3.5 h-3.5 opacity-70" />
        </button>
      </div>

      {/* Título sutil e místico da tiragem no topo das cartas */}
      <div className="mb-6 flex flex-col items-center gap-1.5 text-center pointer-events-none animate-in fade-in duration-500">
        <h2
          className="font-mystic text-lg sm:text-xl font-bold tracking-widest uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
          style={{ color: 'var(--theme-text-title, #fef08a)' }}
        >
          {spread.name}
        </h2>
        <div
          className="w-16 h-0.5 rounded-full shadow-sm"
          style={{ backgroundColor: 'var(--theme-primary, #f59e0b)' }}
        />
      </div>

      {/* Mesa de Cartas - Somente as cartas viradas e desvirando */}
      <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 max-w-[94vw] pointer-events-none">
        {drawnCards.map((drawnCard) => {
          const { card, position, isReversed, isRevealed } = drawnCard

          return (
            <div
              key={`${card.id}-${position.id}`}
              className="flex flex-col items-center animate-in fade-in duration-500"
            >
              {/* Etiqueta da Posição da Carta */}
              <div
                className="mb-2.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase flex items-center gap-1.5 shadow-xl border pointer-events-none"
                style={{
                  backgroundColor: 'rgba(14, 8, 24, 0.80)',
                  borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
                  color: 'var(--theme-secondary, #fbbf24)',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.7)',
                }}
              >
                <Sparkles className="w-3 h-3" style={{ color: 'var(--theme-primary, #f59e0b)' }} />
                <span>{position.label}</span>
              </div>

              {/* Contêiner 3D da Carta com efeito de flip */}
              <div
                className={`perspective-1000 ${
                  isLargeSpread
                    ? 'w-[130px] h-[225px] sm:w-[145px] sm:h-[250px]'
                    : 'w-[150px] h-[260px] sm:w-[170px] sm:h-[295px]'
                }`}
              >
                <div
                  className={`relative w-full h-full duration-700 transform-style-3d transition-transform ${
                    isRevealed ? 'rotate-y-180' : ''
                  }`}
                >
                  {/* Verso da Carta (Face Oculta / Virada para Baixo) */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden rounded-xl overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.85)] bg-[#0c0716] border"
                    style={{
                      borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.45))',
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.8), 0 0 16px var(--theme-glow, rgba(168, 85, 247, 0.2))',
                    }}
                  >
                    <img
                      src="./bg/bgcarta.png"
                      alt="Verso da Carta"
                      className="w-full h-full object-cover select-none pointer-events-none"
                      loading="eager"
                    />
                  </div>

                  {/* Frente da Carta (Revelada / Desvirada) */}
                  <div
                    className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-xl overflow-hidden shadow-[0_14px_36px_rgba(0,0,0,0.9)] bg-[#140e24] flex flex-col border"
                    style={{
                      borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.45))',
                      boxShadow: '0 0 24px var(--theme-glow, rgba(245, 158, 11, 0.35)), 0 12px 30px rgba(0,0,0,0.85)',
                    }}
                  >
                    {/* Imagem da Carta */}
                    <div className="relative flex-1 w-full bg-black/60 overflow-hidden">
                      <img
                        src={card.img}
                        alt={card.ptName}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          isReversed ? 'rotate-180' : ''
                        }`}
                        loading="eager"
                      />

                      {/* Badge Invertida / Normal */}
                      <div
                        className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase shadow-md flex items-center gap-1 bg-[#120c1f]/90 border"
                        style={{
                          borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
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

                      {/* Algarismo Romano */}
                      <div
                        className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-mystic font-bold bg-black/80 border"
                        style={{
                          borderColor: 'var(--theme-card-border, rgba(245, 158, 11, 0.4))',
                          color: 'var(--theme-primary, #f59e0b)',
                        }}
                      >
                        {card.roman}
                      </div>
                    </div>

                    {/* Faixa inferior com nome da carta */}
                    <div
                      className="p-2.5 border-t text-center"
                      style={{
                        backgroundColor: 'var(--theme-card-bg, rgba(14, 8, 24, 0.9))',
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
            </div>
          )
        })}
      </div>
    </div>
  )
}
