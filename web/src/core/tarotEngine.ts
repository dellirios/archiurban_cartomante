import { TarotCardData, SpreadConfig, DrawnCard, SpreadPosition } from '../types/tarot'

export class TarotEngine {
  private deck: TarotCardData[] = []
  private customSpreads: Map<string, SpreadConfig> = new Map()

  constructor(initialDeck: TarotCardData[] = []) {
    if (initialDeck.length > 0) {
      this.initializeDeck(initialDeck)
    }
  }

  public initializeDeck(cards: TarotCardData[]): void {
    if (!cards || cards.length === 0) {
      throw new Error('O baralho não pode estar vazio.')
    }
    this.deck = [...cards]
  }

  public registerSpread(config: SpreadConfig): void {
    this.customSpreads.set(config.id, config)
  }

  public getSpread(id: string): SpreadConfig | undefined {
    return this.customSpreads.get(id)
  }

  public getAllSpreads(): SpreadConfig[] {
    return Array.from(this.customSpreads.values())
  }

  public shuffleDeck(): TarotCardData[] {
    const copy = [...this.deck]
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[copy[i], copy[j]] = [copy[j], copy[i]]
    }
    this.deck = copy
    return [...this.deck]
  }

  public drawCards(count: number, allowReversed = true, reversedChance = 0.25): { card: TarotCardData; isReversed: boolean }[] {
    if (count > this.deck.length) {
      throw new Error(`Não é possível tirar ${count} cartas. Baralho tem ${this.deck.length} cartas.`)
    }

    const shuffled = this.shuffleDeck()
    const drawn = shuffled.slice(0, count)

    return drawn.map((card) => ({
      card,
      isReversed: allowReversed ? Math.random() < reversedChance : false,
    }))
  }

  public doReading(spreadId: string, allowReversed = true): DrawnCard[] {
    const spread = this.customSpreads.get(spreadId)
    if (!spread) {
      throw new Error(`Tiragem com ID "${spreadId}" não encontrada.`)
    }

    const drawnWithOrientation = this.drawCards(spread.cardCount, allowReversed)

    return spread.positions.map((pos: SpreadPosition, index: number) => ({
      position: pos,
      card: drawnWithOrientation[index].card,
      isReversed: drawnWithOrientation[index].isReversed,
      isRevealed: false,
    }))
  }
}
