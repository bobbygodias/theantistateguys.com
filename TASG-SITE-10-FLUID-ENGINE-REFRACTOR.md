# TASG-SITE-10 — FLUID ENGINE REFACTOR

**Projeto:** theantistateguys.com  
**Banda:** Bobby Dias & The Anti-State Guys  
**Data:** 2026-09-06  
**Status:** QA V3 — refatoração global em andamento; produção ainda intacta

## Regra central

**O site inteiro se recompõe ao espaço útil real.**

Não existe uma versão para celular, outra para tablet e outra para desktop. Navegador, marca, modelo, orientação e resolução física não escolhem o layout. O recipiente real determina a composição.

Isso vale para tudo: navegação, beco, plano de fundo, Santiago, wordmark, vídeo, player, redes, páginas internas, fotos, textos, cartões, diálogos e controles.

## Mudanças desta rodada

### 1. `main` como recipiente real

O `body` é uma grade de duas linhas: navegação e conteúdo. O `main` recebe o espaço que sobra depois da navegação e é um `size container` chamado `site`.

Consequência: se a navegação vira uma, duas ou três linhas, o conteúdo conhece automaticamente o espaço restante e se recompõe nele.

### 2. Altura dinâmica do navegador

O corpo usa `100dvh`, com fallback em `100vh`, para acompanhar a área dinâmica do navegador em vez de presumir a altura física da tela.

Safe areas (`env(safe-area-inset-*)`) foram incorporadas à navegação, rodapé útil, toast e medidor de QA.

### 3. Componentes também viraram recipientes

O vídeo e o player são `size containers` próprios.

- o conteúdo do vídeo responde ao tamanho real do quadro;
- display, botão FAIXAS e controles do player participam do fluxo interno;
- os controles não dependem mais de coordenadas `top/bottom` engessadas;
- o recorte provisório da boombox muda de direção conforme a proporção do próprio player.

A boombox ainda usa a raster `home-scene.webp` como fonte provisória. A separação artística definitiva da boombox continua pendente e não deve ser esquecida.

### 4. Remontagem larga/baixa

Quando o recipiente é relativamente largo e baixo, vídeo e player podem assumir duas colunas mesmo sem atingir uma suposta “largura de desktop”. A decisão é geométrica, não nominal.

Quando o espaço é estreito, a Home empilha. Quando é fisicamente pequeno demais para manter tudo confortável, o `main` rola em vez de miniaturizar controles ou exigir zoom.

### 5. Rotas internas no mesmo motor

História, Integrantes, Fotos, Shows e Contato continuam dentro do mesmo núcleo fluido:

- `auto-fit/minmax()`;
- medidas relativas;
- imagens limitadas também pela altura útil;
- fundos com direção responsiva por proporção;
- ausência de overflow horizontal intencional.

### 6. Correção de navegação entre rotas

Como o `main` passou a ser o elemento rolável, `script.js` agora zera o scroll do próprio `main` ao trocar de rota. O antigo `window.scrollTo()` não era suficiente nessa arquitetura.

### 7. Diagnóstico de QA melhorado

O medidor agora mostra:

- VisualViewport;
- tamanho real do conteúdo (`main`);
- aspect ratio do conteúdo;
- DPR;
- colunas/linhas reais da navegação;
- colunas/linhas reais da mídia;
- altura da rota ativa;
- se existe rolagem vertical;
- se existe overflow horizontal;
- menor dimensão dos alvos clicáveis/tocáveis;
- rota ativa.

`ResizeObserver` e `MutationObserver` atualizam o diagnóstico quando o layout realmente muda.

## Critério de QA

Uma geometria passa apenas se:

1. não exigir zoom manual;
2. não exigir “Site de computador”;
3. não exigir rotação manual;
4. nenhum controle importante ficar microscópico;
5. nenhum texto ou imagem relevante for mutilado;
6. o plano de fundo e as figuras cenográficas continuarem coerentes;
7. não houver overflow horizontal acidental;
8. a rolagem vertical só aparecer quando o espaço realmente não comportar uma composição confortável;
9. o mesmo DOM e o mesmo sistema de componentes continuarem funcionando em geometrias radicalmente diferentes.

## Arquivos alterados nesta rodada

- `qa-site-v3.css`
- `script.js`
- `qa-site-v3.js`

## Produção

`index.html` público ainda não foi substituído. A migração só acontece depois do QA do V3 e deve substituir as camadas antigas, não empilhar mais remendos sobre elas.
