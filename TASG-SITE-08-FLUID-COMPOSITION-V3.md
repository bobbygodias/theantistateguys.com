# TASG-SITE-08 — FLUID COMPOSITION V3

**Projeto:** theantistateguys.com  
**Banda:** Bobby Dias & The Anti-State Guys  
**Data:** 2026-09-06  
**Status:** QA ESTRUTURAL EM ANDAMENTO — PRODUÇÃO NÃO FOI SUBSTITUÍDA

## Motivo deste V3

O problema não estava restrito à Home. A arquitetura anterior tratava responsividade como uma coleção de versões, breakpoints e correções locais. Isso fazia partes do site se adaptarem, mas não o **site inteiro como composição**.

A regra correta é mais simples e mais exigente:

> **Tudo se recompõe.**

Isso inclui cenário, plano de fundo, pessoas/figuras cenográficas, navegação, wordmark, vídeo, player, imagens, textos, cartões, fotografias, páginas internas e controles.

O visitante não deve adaptar navegador, zoom, orientação ou comportamento ao site. O site é que assume a forma do espaço que recebeu.

## Cânone absoluto

1. Não existe versão “desktop” e versão “mobile” da mesma interface.
2. Não existe layout decidido por marca ou modelo de aparelho.
3. Retrato/paisagem são apenas geometrias; não são categorias de dispositivo.
4. Largura, altura, proporção e área útil participam da composição.
5. O plano de fundo também recebe direção responsiva; não é uma fotografia de interface congelada.
6. Elementos funcionais não ficam presos a coordenadas de uma imagem raster.
7. Grid/Flex e `auto-fit/minmax()` fazem o reflow natural sempre que possível.
8. Medidas usam `clamp()`, porcentagens, viewport/container e unidades relativas; pixels fixos só aparecem onde existe um limite físico real, por exemplo alvo mínimo de toque.
9. Breakpoints só podem existir quando uma mudança de geometria exige direção artística/composicional, nunca como tradução de “celular/tablet/desktop”.
10. Se uma composição razoável puder manter tudo utilizável numa viewport, remontar antes de recorrer à rolagem.
11. Se fisicamente não houver espaço seguro, rolagem é preferível a miniaturização, corte destrutivo ou zoom obrigatório.
12. QA em hardware real confirma o trabalho; não deve ser usado para fazer Bobby reconstruir manualmente a arquitetura através de dezenas de prints.

## V3 criada para QA

Arquivos isolados da produção:

- `qa-site-v3.html`
- `qa-site-v3.css`
- `qa-site-v3.js`

URL após deploy:

`https://theantistateguys.com/qa-site-v3.html`

## Núcleo de composição atual

A partir do commit `b7e485b...`, o V3 passou a usar o próprio espaço útil como container de layout:

- `body` ocupa a viewport e é dividido em navegação + área útil;
- `main` ocupa exatamente a área restante e usa `container-type: size` / `container-name: site`;
- a altura da navegação, inclusive quando ela quebra em mais linhas, é automaticamente descontada;
- Home e rotas internas consultam esse container real, não uma suposição sobre aparelho;
- container queries podem responder simultaneamente à largura, altura e proporção da área útil;
- `cqw` e `cqh` são usados em elementos que precisam escalar conforme o recipiente;
- `auto-fit/minmax()` continua sendo a primeira escolha para reflow natural;
- o scroll fica no recipiente de conteúdo quando o espaço físico realmente não comporta a composição inteira.

Isso elimina a lógica anterior em que um breakpoint de largura podia tomar uma decisão errada sem considerar a altura disponível.

### Mudanças estruturais já aplicadas

- uma única navegação sem duplicação mobile/desktop;
- uma única Home funcional;
- vídeo e player usam o mesmo DOM em qualquer geometria;
- navegação usa Grid com `auto-fit` e se recompõe pela largura disponível;
- mídia usa Grid com `auto-fit` e escolhe uma ou múltiplas colunas pelo espaço real;
- wordmark preserva a peça inteira e cede altura antes de controles essenciais;
- cenário da Home virou camada atmosférica responsiva, não mapa de hotspots;
- Santiago possui camada cenográfica independente para poder mudar de posição/escala com a composição;
- o beco agora recebe também camadas de parede/luz/vinheta separadas da fotografia base;
- História, Integrantes, Fotos, Shows e Contato usam o mesmo motor fluido;
- História/Shows usam grids auto-fit em vez de estados rígidos de 2/1 colunas;
- Integrantes cria quantos pôsteres couberem, sem definir “3/2/1 por dispositivo”;
- Fotos limita a própria fotografia também pela altura útil do container e usa `object-fit: contain` quando necessário;
- fundos internos mudam foco pela forma do recipiente;
- removidas do V3 as dependências de `styles.css`, `scenic-fixes.css`, `history-v5.css`, `internal-v2.css` e `responsive-home.css`;
- diagnóstico de QA foi corrigido: em vez de inferir colunas pela string CSS, mede as posições reais dos elementos e informa colunas/linhas.

## QA real recebido em 2026-09-06

Capturas reais forneceram uma geometria particularmente útil:

- VisualViewport reportado na página: aproximadamente `1280 × 664 CSS`;
- aspect ratio aproximado: `1.93`;
- DPR: `2.00`;
- navegador embutido com tecnologia Firefox;
- “Site de computador” não é requisito funcional e não deve alterar a necessidade de recomposição.

As capturas mostraram Home, Fotos, navegação, player, troca de música e toast funcionando. Elas também deixaram claro que QA visual deve observar não só controles, mas **a recomposição de cenário, imagem e página inteira**.

## Observação sobre o beco

`home-scene.webp` ainda é usado como **matéria atmosférica**, com `object-fit: cover`, foco variável e tratamento visual. Ele deixou de ser a interface em si.

Esta é uma transição importante, mas ainda existe trabalho artístico a fazer: elementos reconhecíveis que estavam “assados” na imagem original devem, quando necessário, virar camadas independentes ou ser substituídos por uma base cenográfica limpa. O objetivo final é que nenhum objeto importante dependa de permanecer em coordenadas raster fixas.

O rádio ainda usa um recorte da imagem original como arte provisória do player. Isso é permitido apenas durante o QA estrutural. A etapa cenográfica final deve substituir esse recorte por um objeto independente/limpo para evitar duplicação perceptível de cenário.

## Critério de aprovação do V3

A arquitetura somente poderá migrar para produção quando:

- Home se recompor em geometrias estreitas, altas, largas e baixas;
- nenhuma função exigir “Site de computador”, zoom ou rotação manual;
- background e objetos cenográficos continuarem coerentes após recomposição;
- navegação permanecer legível/tocável;
- vídeo permanecer utilizável;
- player e biblioteca permanecerem utilizáveis;
- todas as rotas internas apresentarem reflow natural sem overflow horizontal;
- imagens nunca ultrapassarem o recipiente;
- textos não forem mutilados;
- nenhuma peça relevante desaparecer apenas porque mudou a geometria;
- QA real confirmar os resultados.

## Produção

`index.html` e a arquitetura pública atual não foram substituídos por este V3. O V3 é um laboratório isolado. Depois de aprovado, a migração deve ser limpa: substituir a arquitetura antiga em vez de adicionar outra camada de remendos sobre ela.
