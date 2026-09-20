# TASG SITE — Checkpoint Boombox V3 — perspectiva fechada

**Data:** 19/09/2026  
**Branch:** `fix/boombox-closed-perspective-v3`  
**Base publicada:** `9ceee3426337dde89ca949e4d52ec26492621d0d`

## Motivo

Após publicação do V2, Bobby identificou que o estado fechado repetia um erro já discutido anteriormente: o módulo central parecia frontal/quadrado em vez de acompanhar a perspectiva física da boombox.

Também foi confirmado no código que, em `ready`, a gaveta era ocultada, mas o CD (`.cd-disc`) permanecia como elemento irmão e não era ocultado explicitamente.

## Cânone recuperado

Quando o CD é inserido:

1. CD entra.
2. Gaveta fecha.
3. CD desaparece visualmente.
4. Gaveta aberta desaparece visualmente.
5. Aparece o conjunto fechado real.
6. A tampa superior e a tampa inferior acompanham o ponto de fuga da boombox.
7. A tela preta ocupa o vão superior perspectivado.
8. A placa inferior `CD Player` permanece integrada à tampa inferior.
9. Nenhuma peça deve parecer um retângulo web frontal colado sobre a boombox.

## V3

Novo asset:

`assets/canon/boombox-mechanism-closed-v3.webp`

Blob SHA:

`94db5cfd37ab322dfc531db7938243baae906499`

Commit inicial do asset:

`6e2496361aa13b548bacd3b7ae2b5df568ad00c5`

O V2 permanece preservado como fallback.

## Correções de comportamento

Em `data-cd-state="ready"`:

- `.cd-tray` fica invisível;
- `.cd-disc` fica invisível;
- ambos perdem pointer events;
- `.cd-closed-panel` V3 fica visível;
- a tela dinâmica deixa de desenhar um grande retângulo preto independente e passa a carregar somente texto sobre o vão preto já existente no asset V3.

## Geometria da tela READY

A tela acompanha o slot perspectivado do V3 no palco nativo 672×464:

- left: 44.05%;
- top: 59.70%;
- width: 23.22%;
- height: 5.60%;
- clip-path: `polygon(3% 19%, 100% 0, 99% 77%, 0 100%)`;
- fundo/borda/sombra próprios removidos no READY: o preto físico vem do asset.

## Cache

Bumps aplicados:

- `boombox-native-controls.css?rev=20260919-1`
- `boombox-mechanism-closed-v3.webp?rev=20260919-1`
- `home-final-v1.js?rev=20260919-1`
- `script.js?rev=20260919-1`

## QA reforçado

O teste de interação agora falha se, em READY:

- a gaveta continuar visível;
- o CD continuar visível;
- o mecanismo fechado não aparecer;
- o asset usado não for V3;
- a tela sair dos limites da boombox.

Foi adicionado snapshot específico:

`wide-short-home-ready` — 640×360, touch, CD em READY.

## Estado no momento deste checkpoint

Workflow:

`responsive-qa-v3`

Run:

**#117** — ID `35481955185`

O run foi disparado na branch V3 e está em execução.

A `main` NÃO foi alterada nesta correção.

Não fazer merge antes da inspeção dos snapshots e alinhamento com Bobby.
