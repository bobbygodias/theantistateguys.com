# TASG-SITE-15 — PROGRESSIVE COMPATIBILITY

**Projeto:** theantistateguys.com  
**Banda:** Bobby Dias & The Anti-State Guys  
**Data:** 2026-09-06  
**Status:** QA V3 — produção pública ainda intacta

## Objetivo

Garantir que o V3 continue funcional em engines antigas, WebViews, TVs e navegadores com suporte parcial a recursos modernos, sem criar versões por aparelho.

## Novo módulo

Foi criado `qa-site-v3-compat.css` como camada de Progressive Enhancement/Fallback.

A regra permanece a mesma: **o recipiente governa a composição**. O fallback não tenta adivinhar celular, tablet, notebook ou televisão.

## Fallbacks cobertos

- ausência de `100dvh`: usa `100vh`;
- ausência de container units (`cqi`/`cqb`): substitui medidas críticas por aproximações em `vw`, `vh`, `vmin` e `rem`;
- ausência de `container-type:size`: mantém grids intrínsecos com `auto-fit/minmax()` e retira refinamentos que dependem de container queries;
- hover só existe como enhancement quando `hover:hover` e `pointer:fine`;
- ponteiro coarse recebe `touch-action: manipulation`;
- suporte a `forced-colors`;
- suporte a `prefers-contrast: more`.

## QA de suporte

`qa-site-v3.js` passou a informar no medidor:

- `CQ sim/fallback` — container queries/container type;
- `CU sim/fallback` — container units;
- `DVH sim/fallback` — dynamic viewport height.

Essas flags servem para sabermos se o navegador usa o motor moderno ou a camada de degradação progressiva.

## Importante

Fallback não significa miniaturizar o site ou voltar a breakpoints por aparelho. Mesmo sem recursos modernos, o layout continua usando Grid/Flex, `auto-fit`, `minmax()` e medidas fluidas sempre que disponíveis.

## Deploy

O commit `d6fc9369985a090be5d36bf43225633d61372a7c` foi publicado pelo GitHub Pages com sucesso.

## Regra-mãe preservada

**Tudo se recompõe. O visitante não adapta navegador, zoom, orientação ou aparelho ao site.**
