# TASG-SITE-13 — INTRINSIC LAYOUT + SELF-QA

**Projeto:** theantistateguys.com  
**Banda:** Bobby Dias & The Anti-State Guys  
**Data:** 2026-09-06  
**Status:** QA V3; produção permanece intacta.

## Regra reafirmada

O site inteiro se recompõe ao espaço útil real. Colunas não devem surgir porque o código decidiu que uma largura pertence a um tipo de aparelho. Sempre que possível, a própria necessidade mínima dos blocos deve decidir se eles ficam lado a lado ou empilhados.

## Mudanças desta rodada

### História

`history-layout` deixou de ser explicitamente uma coluna com uma troca posterior para duas colunas. Agora usa `repeat(auto-fit, minmax(...))`: texto e foto negociam o espaço pelo próprio mínimo confortável. A regra de `sticky` da foto permanece apenas como refinamento quando largura, altura e proporção suportam esse comportamento; ela não decide a quantidade de colunas.

### Shows

`show-layout` também abandonou o estado explícito de uma coluna seguido por breakpoint de duas colunas. Agora usa `auto-fit/minmax()`, deixando texto e fotografia se organizarem intrinsecamente. Consultas de recipiente continuam existindo apenas para refinar altura da imagem e tipografia quando a geometria torna isso útil.

### Medidor de QA

`qa-site-v3.js` agora executa verificações geométricas automáticas no navegador real e mostra:

- `HARD-OK` quando nenhuma violação geométrica dura foi detectada;
- `HARD-FAIL` quando houver overflow horizontal, alvo interativo abaixo de 44 px ou elemento estrutural relevante cortado horizontalmente;
- VisualViewport;
- tamanho do conteúdo real;
- aspect ratio;
- DPR;
- colunas/linhas reais de navegação e mídia;
- altura da rota;
- necessidade de scroll vertical;
- overflow horizontal;
- quantidade de recortes horizontais detectados;
- menor dimensão de alvo interativo;
- rota ativa.

`HARD-OK` NÃO significa aprovação visual/artística do site. Significa apenas que os testes geométricos duros do medidor não encontraram uma violação óbvia. A aprovação visual continua sendo humana e posterior.

## Critério de arquitetura

Preferência de decisão:

1. layout intrínseco (`auto-fit`, `minmax`, flex/grid);
2. unidades relativas e container units;
3. container queries para necessidades reais de composição;
4. rolagem quando o conteúdo fisicamente não pode caber confortavelmente;
5. nunca device sniffing, orientação como proxy de aparelho ou zoom obrigatório.

## Arquivos alterados

- `qa-site-v3-internal.css`
- `qa-site-v3.js`

## Próximo trabalho

- continuar removendo pressupostos geométricos desnecessários;
- concluir independência visual da boombox/JVC em relação à raster do beco;
- revisar acessibilidade de teclado/foco e semântica;
- validar V3 em algumas geometrias reais antes de qualquer migração para produção.
