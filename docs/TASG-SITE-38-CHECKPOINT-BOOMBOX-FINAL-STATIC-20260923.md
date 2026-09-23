# TASG SITE 38 — CHECKPOINT BOOMBOX FINAL ESTÁTICA — 2026-09-23

## Decisão final aprovada

A Home abandona definitivamente a mecânica de CD.

A boombox passa a ser um player físico sempre fechado e sempre pronto, baseado na última imagem de referência colocada por Bobby nas fontes do projeto.

### Não existe mais
- CD visível;
- gaveta/tray;
- abrir/fechar;
- estado open/closing/ready/opening;
- botão EJECT;
- efeito sonoro de abrir/fechar;
- necessidade de inserir CD antes de usar o player.

### Player final
O display preto superior mostra dinamicamente o nome da faixa atual, com rolagem horizontal.

A fileira inferior possui cinco controles físicos, da esquerda para a direita:
1. Stop;
2. Previous;
3. Play;
4. Next;
5. Pause.

Os cinco controles ficam funcionais imediatamente.

## Regra responsiva — cláusula fixa

A boombox inteira usa um único sistema intrínseco de coordenadas: **672 × 464**.

Display e hotspots são posicionados em porcentagens relativas à própria boombox.

A viewport pode redimensionar e reposicionar o conjunto inteiro, mas **não existe geometria interna separada para desktop, mobile, tablet ou paisagem**.

O QA falha se qualquer peça interna mudar de posição proporcional entre viewports.

## Asset final

Caminho:
`assets/canon/boombox-final-static.webp`

Git blob SHA:
`8986af4f8362e41c99db9fd221e1d49082f58676`

O binário foi verificado byte a byte pelo SHA antes de ser incorporado à branch.

## Branch

`fix/final-static-boombox`

Base original:
`main@9ceee3426337dde89ca949e4d52ec26492621d0d`

## QA final pré-merge

Workflow: `responsive-qa-v3`

Run: **#127**

Run ID:
`35935358310`

Head testado:
`8b85a170e1107af4342c866ad28605dc3713767f`

Resultado: **SUCCESS**

Passaram:
- integridade;
- matriz responsiva;
- interação/foco;
- reprodução real e contrato canônico;
- performance;
- snapshots visuais;
- artifact upload.

Artifact:
`10782957191`

Digest:
`sha256:ccad44745b26c0a3e213212f9a6cba4a24307f56a047f9e19a71968cb263b1c3`

## Inspeção visual humana

Snapshots reais do QA #127 conferidos:
- `visual/real-home.png`;
- `visual/narrow-tall-home.png`;
- `visual/wide-short-home.png`.

Resultado:
- boombox visualmente íntegra;
- display corretamente integrado;
- cinco controles preservados;
- nenhuma mecânica de CD;
- mesma geometria interna em recipientes diferentes;
- Home rearranja o conjunto conforme o espaço disponível, sem criar versão interna desktop/mobile.

## Continuidade

Esta é a solução final escolhida para encerrar a etapa da boombox.

Não reintroduzir mecânica de CD, drawer, SFX ou estados de abertura/fechamento sem uma nova decisão explícita de Bobby.
