# ArchiUrban Cartomante

Recurso de Tarô para servidores FiveM. Oferece leituras individuais e sessões entre dois jogadores, com interface NUI, 78 cartas ilustradas, significados em português, som ao virar cartas e personalização de cores.

## Links

- Site oficial: [archiurban.com.br](https://archiurban.com.br/)
- Instagram: [@daniloguloni](https://www.instagram.com/daniloguloni)

## Demonstração em vídeo

[![Assista à demonstração do ArchiUrban Cartomante](https://i.ytimg.com/vi/CDezkgfUemE/hqdefault.jpg)](https://youtu.be/CDezkgfUemE)

[Assistir à demonstração no YouTube](https://youtu.be/CDezkgfUemE).

## Funcionalidades

- Leitura individual pelo item `baralho` ou pelos comandos `/cartas`, `/cartomante` e `/tarot`.
- Quatro tiragens: Carta do Dia (1 carta), Trindade Temporal (3), Encruzilhada & Decisões (4) e Cruz Céltica Completa (10).
- Cartas normais ou invertidas, com interpretação e opção de revelar uma carta ou todas de uma vez.
- Leitura presencial com `ox_target`: o leitor convida outro jogador, que pode aceitar ou recusar. As cartas e ações do leitor são sincronizadas com o consulente.
- Editor de cores com temas prontos. A escolha é salva no armazenamento local da NUI do jogador.

## Requisitos e integrações

| Recurso | Uso |
| --- | --- |
| `ox_lib` | Obrigatório: callbacks, notificações e `cache.ped`. O manifesto carrega `@ox_lib/init.lua`. |
| `ox_inventory` ou `lk_inventory` | O servidor consulta a quantidade do item `baralho` nesses inventários, nessa ordem. Configure o item no inventário usado pelo servidor. |
| `ox_target` | Necessário para iniciar uma leitura clicando em outro jogador. A leitura individual pelos comandos não depende desse alvo. |
| `qbx_core` | Usado para reconhecer administradores pela permissão ou grupo `admin`. O código também aceita permissões ACE `command` e `admin`. |

A opção de leitura em outro jogador usa `ox_inventory:Search('count', 'baralho')` no cliente além da validação no servidor. Em instalações que usam somente `lk_inventory`, confira se esse export está disponível por compatibilidade antes de depender do fluxo com `ox_target`.

## Instalação

1. Copie a pasta `archiurban_cartomante` para `resources/` do servidor. Se usar uma categoria como `[archiurban]`, mantenha o nome da pasta do recurso exatamente como `archiurban_cartomante`.
2. Inicie `ox_lib`, o inventário, `ox_target` e, se usado, `qbx_core` antes deste recurso. No `server.cfg`, adicione `ensure archiurban_cartomante` depois deles.
3. Cadastre o item `baralho` no inventário. O cadastro do item **não faz parte deste repositório**; ele precisa existir no servidor que instalar o recurso.
4. Execute `refresh` e `ensure archiurban_cartomante` no console do FXServer, ou reinicie somente o recurso se ele já estiver instalado.

Exemplo do item usado com `lk_inventory`:

```lua
['baralho'] = {
    label = 'Baralho de Tarô',
    weight = 120,
    stack = false,
    close = true,
    consume = 0,
    description = 'Um baralho oracular com os 78 arcanos de Tarô.',
    client = {
        image = 'baralho.png',
        export = 'archiurban_cartomante.useBaralho'
    }
},
```

Coloque a imagem `baralho.png` na pasta de imagens do seu inventário se quiser que o item tenha ícone. Para outro inventário, adapte o registro do item à API dele; o nome `baralho` e o export `archiurban_cartomante.useBaralho` devem corresponder ao código.

O arquivo `web/dist/index.html` e seus recursos já estão incluídos. Não é necessário compilar a interface para instalar esta versão.

## Como usar

### Leitura individual

Use o item `baralho` no inventário ou digite um dos comandos:

```text
/cartas
/cartomante
/tarot
```

Os comandos consultam o servidor: o jogador precisa ter o item `baralho` ou ser administrador. Também é possível passar o ID de uma tiragem, por exemplo `/cartas celtic`. IDs aceitos: `single`, `three`, `choices` e `celtic`. Sem argumento, a interface abre na seleção de tiragens, com Trindade Temporal selecionada inicialmente.

Na interface, escolha a tiragem, decida se permite cartas invertidas e inicie a leitura. Clique nas cartas para revelá-las, use a ação de revelar todas, embaralhe novamente ou volte à seleção. `Esc` fecha a interface quando não há um modal aberto.

Use `/cartasedit` para abrir diretamente o editor de cores. Esse comando segue a mesma regra de acesso dos demais. O botão de paleta dentro da interface também abre o editor.

### Leitura para outra pessoa

1. O leitor deve ter o item `baralho` ou permissão de administrador e estar perto do outro jogador.
2. Com `ox_target`, selecione **Tirar Cartas de Tarô** no jogador. A opção de alvo aparece para quem tem o item `baralho` no inventário consultado pelo cliente.
3. O consulente recebe um convite e pode aceitar com **Y**, recusar com **N** ou clicar na notificação. O convite expira após 15 segundos.
4. Quando o convite é aceito, o leitor controla a tiragem. O consulente vê as cartas e acompanha início, revelação, nova tiragem e mudança de disposição.

O servidor verifica permissão, existência dos jogadores, distância e se já estão em outra sessão. O convite exige distância de até 4 metros; após a resposta, a distância é conferida novamente com limite de 5 metros. Fechar a interface ou desconectar encerra a sessão para o parceiro.

## Tiragens disponíveis

| ID | Nome | Cartas | Posições |
| --- | --- | ---: | --- |
| `single` | Carta do Dia | 1 | Resposta/conselho |
| `three` | Trindade Temporal | 3 | Passado, presente e futuro |
| `choices` | Encruzilhada & Decisões | 4 | Estado atual, caminhos A e B, síntese/conselho |
| `celtic` | Cruz Céltica Completa | 10 | Panorama detalhado da situação |

O baralho tem 22 Arcanos Maiores e 56 Arcanos Menores. O sorteio embaralha as 78 cartas sem repetição dentro da mesma tiragem. Quando cartas invertidas estão habilitadas, cada carta tem 25% de chance de sair invertida.

## Desenvolvimento da interface

O código da NUI está em `web/src/` e usa React, TypeScript e Vite. Os arquivos servidos pelo FiveM ficam em `web/dist/`, conforme `fxmanifest.lua`.

```bash
cd web
npm ci
npm run typecheck
npm run build
```

O build escreve em `web/dist/`. Ao alterar a interface, inclua os arquivos gerados no commit para que a versão instalada no FiveM acompanhe o código-fonte. A configuração do Vite usa `emptyOutDir: false`; builds anteriores podem deixar arquivos com hash antigos em `dist/assets/`. Confirme que `dist/index.html` aponta para os arquivos novos antes de publicar.

`web/node_modules/` e `web/tsconfig.app.tsbuildinfo` são arquivos locais e não entram no repositório.

## Estrutura

```text
archiurban_cartomante/
├── fxmanifest.lua          # Registro do recurso e dos arquivos da NUI
├── client/client.lua       # Comandos, item, ox_target, foco e eventos NUI
├── server/server.lua       # Permissões, convite e sessão entre jogadores
└── web/
    ├── src/                # Interface, tiragens, cartas e lógica de leitura
    ├── public/             # Imagens e áudio usados no build
    ├── dist/               # Interface pronta para o FiveM
    ├── package.json
    └── package-lock.json
```

## Resolução de problemas

| Sintoma | Verifique |
| --- | --- |
| O recurso não inicia | Se `ox_lib` foi iniciado antes e se `web/dist/index.html` existe. |
| O comando informa falta de permissão | Se o jogador possui `baralho` no inventário consultado pelo servidor ou uma das permissões administrativas aceitas. |
| O item não abre a interface | Se o registro do item aponta para `archiurban_cartomante.useBaralho` e se o recurso está iniciado. |
| A opção de alvo não aparece | Se `ox_target` está iniciado, o alvo é outro jogador vivo e o cliente consegue consultar `baralho` via `ox_inventory:Search`. |
| O convite não chega ou falha | Se ambos estão online, próximos, fora de outra sessão e se o consulente respondeu em até 15 segundos. |
| A NUI abre sem imagens ou estilo | Se a pasta `web/dist/` foi copiada completa e se os caminhos em `dist/index.html` existem. |

## API do recurso

Exports do cliente: `useBaralho`, `openTarot` e `closeTarot`. `openTarot(spreadId, bypassCheck, sessionMode, partnerSrc)` abre a NUI; use `bypassCheck` somente em fluxos autorizados, pois ele pula a consulta de acesso feita no cliente.

Exports do servidor: `canPlayerUseTarot(source)`, `isPlayerAdmin(source)` e `getPlayerBaralhoCount(source)`. Eles permitem que outros recursos consultem as mesmas regras de acesso.

As leituras são geradas na interface do jogador. As sessões entre dois jogadores mantêm o par em memória e encaminham as ações da NUI; não há banco de dados nem histórico persistente neste recurso.

## Licença

Este projeto é distribuído sob a licença MIT. Consulte [LICENSE](LICENSE) para os termos completos.
