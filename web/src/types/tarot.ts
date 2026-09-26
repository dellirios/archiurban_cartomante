export type ArcanaType = 'major' | 'minor'

export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles' | null

export interface TarotCardData {
  id: string
  name: string
  ptName: string
  number: number
  roman: string
  type: ArcanaType
  suit: TarotSuit
  symbol: string
  img: string
  keywords: string[]
  description: string
  uprightMeaning: string
  reversedMeaning: string
  element?: string
  astrology?: string
}

export interface SpreadPosition {
  id: string
  label: string
  description: string
}

export interface SpreadConfig {
  id: string
  name: string
  subtitle: string
  description: string
  cardCount: number
  positions: SpreadPosition[]
  layout: 'single' | 'three' | 'five' | 'celtic'
}

export interface DrawnCard {
  card: TarotCardData
  position: SpreadPosition
  isReversed: boolean
  isRevealed: boolean
  revealedAt?: number
}
