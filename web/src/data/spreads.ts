import { SpreadConfig } from '../types/tarot'

export const DEFAULT_SPREADS: SpreadConfig[] = [
  {
    id: 'single',
    name: 'Carta do Dia',
    subtitle: 'Orientação Imediata',
    description: 'Uma única carta para revelar a energia predominante, o conselho do momento e o foco espiritual para sua jornada.',
    cardCount: 1,
    layout: 'single',
    positions: [
      {
        id: 'pos_1',
        label: 'A Resposta / Conselho',
        description: 'Revela a força motriz atual, a lição imediata e a atitude recomendada pelos arcanos.',
      },
    ],
  },
  {
    id: 'three',
    name: 'Trindade Temporal',
    subtitle: 'Passado · Presente · Futuro',
    description: 'A clássica tiragem de três lâminas para compreender a origem das questões, o estado presente e o destino provável.',
    cardCount: 3,
    layout: 'three',
    positions: [
      {
        id: 'pos_past',
        label: '1. O Passado',
        description: 'As causas raízes, acontecimentos anteriores e energias que construíram o momento presente.',
      },
      {
        id: 'pos_present',
        label: '2. O Presente',
        description: 'A situação atual, seus desafios imediatos e onde sua energia está sendo canalizada agora.',
      },
      {
        id: 'pos_future',
        label: '3. O Futuro',
        description: 'O desfecho provável caso você mantenha o curso atual, os aprendizados que se aproximam.',
      },
    ],
  },
  {
    id: 'choices',
    name: 'Encruzilhada & Decisões',
    subtitle: 'Você · Opção A · Opção B · Conselho',
    description: 'Indicada quando há um dilema ou duas decisões possíveis pela frente, esclarecendo as consequências de cada caminho.',
    cardCount: 4,
    layout: 'five',
    positions: [
      {
        id: 'pos_self',
        label: '1. Seu Estado',
        description: 'Como sua mente e coração estão posicionados perante essa decisão.',
      },
      {
        id: 'pos_path_a',
        label: '2. O Primeiro Caminho',
        description: 'O que esperar ao escolher a primeira alternativa.',
      },
      {
        id: 'pos_path_b',
        label: '3. O Segundo Caminho',
        description: 'O que esperar ao optar pela segunda alternativa.',
      },
      {
        id: 'pos_synthesis',
        label: '4. A Síntese & Conselho',
        description: 'A sabedoria superior para orientar sua escolha final.',
      },
    ],
  },
  {
    id: 'celtic',
    name: 'Cruz Céltica Completa',
    subtitle: '10 Lâminas de Leitura Profunda',
    description: 'O método tradicional mais respeitado da cartomancia para uma análise panorâmica e detalhada de todas as facetas da sua vida.',
    cardCount: 10,
    layout: 'celtic',
    positions: [
      {
        id: 'celtic_1',
        label: '1. O Momento Presente',
        description: 'A essência da sua situação atual.',
      },
      {
        id: 'celtic_2',
        label: '2. O Desafio Cruzado',
        description: 'O obstáculo imediato ou a força contrária.',
      },
      {
        id: 'celtic_3',
        label: '3. A Raiz Subconsciente',
        description: 'As motivações ocultas e alicerces profundos.',
      },
      {
        id: 'celtic_4',
        label: '4. O Passado Recente',
        description: 'Eventos que acabaram de passar e ainda ecoam.',
      },
      {
        id: 'celtic_5',
        label: '5. O Melhor Potencial',
        description: 'O ponto mais alto e a meta que pode ser alcançada.',
      },
      {
        id: 'celtic_6',
        label: '6. O Futuro Imediato',
        description: 'O que entrará em seu caminho nos próximos passos.',
      },
      {
        id: 'celtic_7',
        label: '7. Sua Postura Pessoal',
        description: 'Como você se enxerga e age perante a situação.',
      },
      {
        id: 'celtic_8',
        label: '8. O Ambiente Externo',
        description: 'A influência das pessoas próximas e das circunstâncias.',
      },
      {
        id: 'celtic_9',
        label: '9. Esperanças & Temores',
        description: 'Seus maiores anseios e os receios que carrega no íntimo.',
      },
      {
        id: 'celtic_10',
        label: '10. O Desfecho Final',
        description: 'A conclusão de longo prazo e a resolução cármica.',
      },
    ],
  },
]
