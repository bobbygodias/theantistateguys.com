# TASG SITE — Checkpoint Boombox V2 — 18/09/2026

## Motivo deste checkpoint

A plataforma travou durante a retomada da boombox. Este arquivo congela o estado exato do trabalho para impedir perda de contexto.

## Branch de trabalho

`fix/boombox-perspective-tray`

A `main` permanece intocada. Não fazer merge sem alinhamento explícito com Bobby.

## Ponto de partida desta sessão

Checkpoint anterior confirmado:

`bd63e4f72ec8a03df7100a8cd89ff25b173ac625`

Esse checkpoint registrava como último estado funcional validado:

`52a05c22dd206f537ae8ee49d5fec20aa5b0aff6`

QA anterior: run #114, sucesso completo.

## Decisão Bobby + Andrew nesta sessão

Bobby forneceu um novo recorte da região central da boombox, arquivo de origem:

`Nova Tampa cd player + local da tela.png`

Decisão conjunta: testar o novo recorte como **candidato V2**, sem aposentar nem sobrescrever o recorte anterior.

Regras combinadas:
- manter o asset anterior intacto como fallback;
- testar primeiro encaixe/escala;
- esconder a bandeja animada antiga somente no estado `ready`;
- avaliar depois coloração e integração visual;
- não mexer na state machine, SFX, hotspots, áudio ou arquitetura aprovada;
- não tocar na `main`.

## Asset V2

Foi criado e adicionado à branch:

`assets/canon/boombox-mechanism-closed-v2.webp`

Blob SHA efetivamente referenciado:

`f0039f0e17f44cbf67104f761659601f6e6671bb`

O asset anterior continua preservado:

`assets/canon/boombox-mechanism-closed.webp`

Blob do anterior:

`2b911cadf5a629cf86c3d01d6c134afa92c3a5d0`

## Mudanças aplicadas no teste V2

Commit do teste:

`744245eac6cb501972aa9f65626653bd8568ed40`

Mensagem:

`Test Bobby closed mechanism v2 crop`

Esse commit:
1. adiciona o asset V2 separado;
2. faz `home-final-v1.js` apontar para `boombox-mechanism-closed-v2.webp?rev=20260918-2`;
3. adiciona regra em `boombox-native-controls.css` para tornar a `.cd-tray` antiga invisível apenas em `data-cd-state="ready"`;
4. reativa temporariamente a branch `fix/boombox-perspective-tray` no workflow `responsive-qa-v3`.

A regra adicionada para a bandeja não altera o estado aberto/fechando; ela só impede que a antiga gaveta animada apareça por trás do mecanismo fechado real.

## QA do V2

GitHub Actions:

- workflow: `responsive-qa-v3`
- run: **#115**
- run ID: `35322523065`
- head SHA: `744245eac6cb501972aa9f65626653bd8568ed40`
- resultado: **SUCCESS**
- concluído em: `2026-09-18T08:06:49Z`

Passaram:
- integrity QA;
- responsive matrix;
- interaction/focus QA;
- canonical content + real playback;
- performance QA;
- visual snapshots;
- upload de artefatos.

Artefato:
- ID: `10537443619`
- nome: `responsive-qa-v3`
- tamanho aproximado: 27.9 MB.

O artefato foi baixado para inspeção humana como:

`tasg-qa-115.zip`

## Ponto exato em que a plataforma travou

O QA #115 **já havia terminado verde** e o artefato de snapshots **já havia sido baixado**.

A próxima ação ainda NÃO executada era:

1. abrir o snapshot real do estado `ready` gerado pelo QA #115;
2. comparar visualmente V2 versus o estado anterior;
3. decidir com Bobby entre:
   - aprovar V2;
   - ajustar apenas cor/encaixe do V2;
   - rejeitar V2 e voltar imediatamente ao asset anterior.

IMPORTANTE: ainda não declarar o V2 aprovado. O QA funcional passou, mas faltava a inspeção visual humana do snapshot real.

## Continuidade obrigatória

Ao retomar:
- começar pela inspeção do snapshot real do QA #115;
- não refazer o asset sem necessidade;
- não apagar o asset anterior;
- não mexer na `main`;
- não reabrir arquitetura/state machine;
- após decisão visual de Bobby, remover novamente o gatilho temporário da branch no workflow;
- somente depois discutir merge.

## Observação de segurança de continuidade

Existe um blob intermediário/orfão criado durante uma tentativa de transporte do binário, mas ele **não é referenciado pela árvore do commit funcional**. O único blob V2 relevante é:

`f0039f0e17f44cbf67104f761659601f6e6671bb`

Estado seguro para retomada: branch em `744245ea...`, QA #115 verde, aguardando somente inspeção visual e decisão Bobby + Andrew.


## Inspeção visual concluída após retomada

Snapshot real do QA #115 revisado em conjunto:

- `visual/real-home-ready.png`
- `visual/narrow-tall-home-ready.png`

Comparação com o QA #114 confirmou:
- o V2 elimina a sobra/cunha visual problemática do mecanismo anterior;
- a peça lê como parte física da boombox, sem aparência de elemento flutuante;
- a coloração está coerente o suficiente com o aparelho no render real;
- o layout estreito mantém o mecanismo preso à boombox;
- não surgiu regressão responsiva ou de interação.

Decisão final desta etapa:
**manter o V2 sem ajuste adicional de cor neste momento.**

Motivo: o encaixe geométrico melhorou de forma clara e a coloração já integra bem no contexto real. Ajustar cor preventivamente adicionaria risco sem evidência de problema perceptível.

## Limpeza pós-QA

O gatilho temporário da branch `fix/boombox-perspective-tray` foi removido novamente de `.github/workflows/responsive-qa-v3.yml`.

Commit de limpeza:
`869724f414138992a45a151dd0344173882ae7d2`

A `main` continua intocada.

## Estado de continuidade atualizado

Boombox fechada V2: **APROVADA na branch de trabalho**.

Ainda não houve merge para `main`. Qualquer merge continua dependendo de alinhamento explícito com Bobby.
