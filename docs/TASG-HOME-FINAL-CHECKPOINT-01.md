# TASG — Home final — Checkpoint 01

Data: 2026-09-13
Branch de trabalho: `home-final-direction-v1`

## Estado preservado

- A `main` permanece intacta.
- A branch `home-final-direction-v1` foi criada para a fase final da Home.
- A Home existente continua sendo a base técnica; não será reconstruída do zero.
- Player atual já possui catálogo, play/pause, stop, faixa anterior, próxima, display de título/tempo e biblioteca.

## Direção visual aprovada por Bobby

- Beco escuro/noturno.
- Metal envelhecido, ferrugem, bege sujo, preto e luz âmbar.
- Placas industriais aparafusadas como linguagem de navegação, títulos e controles, sem transformar todo conteúdo em placa.
- Vermelho apenas como destaque/estado ativo.
- Visual underground, nu-metal + grunge, brasileiro/DIY, sem caricatura americana e sem slogans ideológicos/decorativos.
- Desktop e telas verticais são composições do mesmo sistema; mobile não será desktop espremido.

## Home — alvo desta etapa

A boombox deve deixar de parecer um player web vestido de boombox e passar a parecer uma boombox real que incidentalmente funciona como player.

Fluxo combinado:

1. CD visível com gaveta aberta.
2. Toque/clique no CD fecha a gaveta.
3. Reproduzir o efeito `Putting Cd Into Player SOUND Effect.mp3` dentro do gesto do usuário.
4. Estado passa para pronto.
5. Play inicia a música; Stop, anterior e próxima funcionam.
6. Display integrado mostra faixa, tempo atual e duração.
7. Eject, se usado, interrompe e reabre a gaveta.
8. Controles permanecem fisicamente integrados ao aparelho em telas estreitas; não devem ser destacados para fora da boombox.

## Próximos commits pequenos

1. Estrutura visual da gaveta/CD e controles integrados.
2. Máquina de estados do CD e efeito sonoro.
3. Ajustes visuais da Home e sistema definitivo de placas.
4. QA responsivo: celular vertical/horizontal, tablet, notebook e desktop.
5. Só depois de aprovação, preparar promoção para `main`.

## Regra de segurança do projeto

Fazer mudanças em blocos pequenos e verificáveis. Se a plataforma travar, retomar do último commit/checkpoint, sem alterar silenciosamente decisões já aprovadas com Bobby.
