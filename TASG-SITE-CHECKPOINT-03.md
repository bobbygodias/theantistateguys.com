# TASG SITE — CHECKPOINT 03

**Projeto:** Bobby Dias & The Anti-State Guys — site oficial  
**Data:** 14/09/2026  
**Produção:** `main` — NÃO alterada neste checkpoint  
**Branch de trabalho:** `home-final-direction-v1`  
**HEAD aprovado tecnicamente:** `3dbb53b747eb0fddbbaf1e995652a25b33270a1d`  
**Workflow final:** `responsive-qa-v3` — run `34801177176` — PASS

## Estado geral

A direção visual aprovada com Bobby está implementada na branch de trabalho e tecnicamente validada. Não promover para `main` sem revisão visual final do Bobby.

Direção preservada:
- beco escuro e cinematográfico;
- ferrugem, metal gasto, preto, âmbar e bege sujo;
- vermelho apenas em estado ativo/destaque;
- placas industriais envelhecidas;
- Nu-Metal + Grunge + underground brasileiro;
- sem símbolos anarquistas, slogans políticos, frases aleatórias ou manifesto inventado;
- pessoas e fotos reais da banda;
- responsividade por recomposição real, inclusive portrait e paisagem baixa;
- touch como interação de primeira classe.

## Home

- Boombox tratada como objeto físico funcional.
- CD visível com gaveta aberta.
- Clique/toque no CD fecha a gaveta.
- Efeito sonoro real de fechamento em `assets/cd-drawer-close.mp3`.
- Estado: `open -> closing -> ready -> opening`.
- Transporte e biblioteca só ativam depois da inserção do CD.
- Play, Stop, Anterior, Próxima e Eject integrados ao aparelho.
- Eject para/reseta a música e reabre.
- Display mostra faixa e tempo.
- Controles permanecem dentro da boombox em telas estreitas.
- Home passou QA em vertical, paisagem baixa, 1280x664 e TV.

## Contato

Títulos:
- `CONTATO`
- `FALE COM A BANDA`
- `CONTATOS`

Canais:
- `theantistateguys@gmail.com`
- Instagram `@theantistateguys`
- YouTube `@TheAntiStateGuys`

Regras protegidas por QA:
- sem WhatsApp;
- sem e-mail pessoal do Bobby;
- formulário obrigatório.

O formulário monta a mensagem e abre o cliente de e-mail do visitante. Não foi criado backend externo ou dependência de terceiros.

## Integrantes

- Fotos reais dos seis integrantes.
- Rótulo: `FORMAÇÃO ATUAL`.
- Texto reescrito com voz humana/direta, baseado no arquivo de história fornecido por Bobby.
- Desktop: mural editorial com pequenas quebras de eixo.
- Vertical: lista limpa e legível.
- Sem aparência de “equipe corporativa”.
- Sem biografia inventada ou slogan ideológico.

## História

- Goiânia, fevereiro de **2024**.
- BreakNews como nome inicial.
- Break, McFly, Young, Thomaz e Santiago na formação inicial.
- `O Forasteiro` como composição autoral doada por Bobby.
- Discussão sobre interpretação, ensaio mediado por Santiago e convite para Bobby liderar.
- Nome final: `Bobby Dias & The Anti-State Guys` com hífen intencional.
- Sonoridade: Nu-Metal + Grunge.
- Composição editorial preservada.

## Fotos

Página deixou de ser uma foto solitária e virou arquivo visual usando somente material real já presente no projeto:
- Pose 6 como peça principal — `ENSAIO`.
- Foto real de estúdio — `ESTÚDIO`.
- Foto real da banda reunida — `BANDA`.

Crédito só onde já estava confirmado no site:
- Pose 6: `Foto: Gabryelle Arackelly`.

Nenhum crédito foi inventado. Nenhuma categoria `Ao Vivo` foi criada sem material correspondente.

## Shows

- Nenhuma data, casa, horário ou ingresso inventado.
- Estado factual atual: banda em estúdio; datas entram somente quando confirmadas.
- Em paisagem baixa (`640x360`), a hierarquia foi corrigida: mensagem permanece visível na primeira tela e a foto do estúdio funciona como apoio.
- Desktop e demais páginas não foram alterados por essa correção.

## Arquitetura CSS final

As camadas de acabamento aprovadas são carregadas por último por `site-final-v1.css`.

Imports:
- `home-final-v1.css`
- `contact-final-v1.css`
- `members-final-v1.css`
- `photos-final-v1.css`
- `shows-final-v1.css`

Isso impede as camadas-base de QA/compatibilidade de sobrescrever silenciosamente decisões visuais finais.

## QA final

Workflow: `responsive-qa-v3`  
Run: `34801177176`  
HEAD: `3dbb53b747eb0fddbbaf1e995652a25b33270a1d`

Resultado:
- Integridade: PASS
- Matriz responsiva: PASS
- Interação/foco: PASS
- Performance/custo: PASS
- Snapshots visuais: PASS
- Upload de artefatos: PASS

Foram verificados snapshots representativos de Home aberta e CD pronto, Contato, Integrantes, Fotos, História e Shows em 300x960, 640x360, 1280x664 e 1920x1080 quando aplicável.

Após o último ajuste de Shows, a comparação dos screenshots confirmou que Home, Contato, Integrantes, Fotos e História permaneceram inalterados; somente `wide-short-shows` mudou, de forma intencional.

## Regra de Work/Codex

Andrew avisa Bobby quando Work/Codex ou modo equivalente realmente valer o gasto. Não abrir esses modos por conveniência, pois o limite/uso pode se esgotar rapidamente.

Para o estado atual deste site, a continuidade no chat normal foi suficiente.

## Próximo passo

**Revisão visual do Bobby.**

Não fazer merge para `main` antes da aprovação dele.

Depois da aprovação:
1. confirmar HEAD;
2. executar uma última checagem curta;
3. promover para `main`;
4. conferir `theantistateguys.com` em produção;
5. registrar o commit de produção e qualquer limitação restante.
