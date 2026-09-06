# TASG-SITE-07 — RESPONSIVE RESET V2

**Projeto:** theantistateguys.com  
**Banda:** Bobby Dias & The Anti-State Guys  
**Data:** 2026-09-06  
**Status:** QA EM ANDAMENTO — NÃO SUBSTITUIR A HOME DE PRODUÇÃO ATÉ PASSAR EM HARDWARE REAL

## Por que este reset existe

O QA em aparelho real revelou uma falha conceitual na primeira camada `space-driven`: uma viewport larga estava sendo tratada como se fosse automaticamente uma tela de desktop.

Isso fazia a composição 1672×941 inteira ser reduzida para caber em uma área larga porém baixa. A página tecnicamente cabia, mas a experiência falhava: navegação, player e hotspots podiam ficar pequenos demais e obrigar o visitante a usar zoom.

**Regra corrigida:** caber não significa funcionar.

Se o visitante precisa ampliar, girar o aparelho, descobrir um recurso do navegador ou adaptar seu comportamento para conseguir usar a página, o frontend falhou.

## Cânone de responsividade

1. **Mobile First de verdade:** a base funciona no menor espaço disponível.
2. **Viewport, não aparelho:** nunca decidir layout por marca, modelo, orientação ou rótulo “desktop/mobile”.
3. **Largura e altura contam juntas:** nenhuma dimensão isolada autoriza uma composição.
4. **Remontagem antes de rolagem:** sempre que existir uma composição razoável capaz de manter navegação, identidade, vídeo, player e redes utilizáveis dentro da viewport, o site deve se reorganizar para caber nela. Rolagem vertical só entra quando a geometria disponível realmente não comportar o conjunto com legibilidade e alvos de toque adequados.
5. **Nunca encolher até caber:** zoom obrigatório, texto microscópico e controles minúsculos são falha, mesmo que nada ultrapasse a viewport.
6. **Alvos de toque confortáveis:** controles essenciais preservam alvo mínimo prático de aproximadamente 44–48 CSS px sempre que fisicamente possível.
7. **Nada essencial depende de hover:** hover é apenas melhoria progressiva quando existe.
8. **Medidas fluidas:** `min()`, `max()`, `clamp()`, Grid, Flexbox e unidades relativas antes de dimensões rígidas.
9. **Progressive Enhancement:** a composição cenográfica integral só aparece quando largura E altura disponíveis permitem usabilidade real.
10. **Mesmo universo visual:** beco, identidade, wordmark, vídeo, música e redes continuam sendo a mesma Home; muda apenas a composição.
11. **QA real vence suposição:** nenhum breakpoint é aprovado só por parecer correto no código.

## Evidência de QA que corrigiu a V2

Em 2026-09-06, screenshots de hardware real mostraram a V2 em um Custom Tab com tecnologia Firefox e com **“Site de computador” desativado**.

A primeira leitura superficial considerou o reflow suficiente. A revisão cuidadosa mostrou o contrário:

- no topo, os seis links e o wordmark apareciam, mas a parte inferior do player ficava fora da área visível;
- após rolagem, player e redes apareciam, porém a navegação principal desaparecia da viewport e o wordmark ficava parcialmente cortado;
- portanto, a Home havia apenas sido repartida verticalmente, não remontada para o espaço disponível.

A causa estava no breakpoint intermediário `@media (min-width:820px)`, que tomava uma decisão de composição usando **largura isolada**. Isso contrariava a própria regra-mãe do projeto.

## Implementação de QA V2

Foram adicionados sem substituir a Home pública atual:

- `qa-home-v2.html`
- `qa-home-v2.css`
- `qa-home-v2-fit.css`
- `qa-home-v2.js`

URL de QA após deploy do GitHub Pages:

`https://theantistateguys.com/qa-home-v2.html`

### Arquitetura atual da V2

A V2 usa uma única estrutura funcional de Home e cresce progressivamente.

- espaço compacto: composição de uma coluna e rolagem somente quando necessária;
- espaço mais largo: navegação e componentes podem aproveitar colunas adicionais;
- espaço largo **e curto**, quando houver altura suficiente para manter alvos tocáveis: `qa-home-v2-fit.css` comprime a distribuição vertical, reduz o wordmark e mantém **navegação + identidade + vídeo + player + redes simultaneamente dentro de uma viewport**;
- espaço realmente amplo **e alto**: enhancement cenográfico usando a composição 1672×941.

O enhancement cenográfico continua exigindo simultaneamente `min-width:1120px` e `min-height:680px` neste estágio de QA. Estes números não representam tipos de aparelhos; são limites iniciais definidos pela necessidade física da composição.

A camada `qa-home-v2-fit.css` trata especificamente o intervalo geométrico em que há largura para duas colunas mas altura insuficiente para a cena integral. Atualmente ela exige pelo menos 820 CSS px de largura e 460 CSS px de altura, usando o ajuste de uma única viewport até 679 CSS px de altura. Abaixo do envelope seguro de altura, a implementação não finge que tudo cabe: volta ao fluxo base e permite rolagem.

## Critério de aprovação

A V2 só poderá substituir a Home atual quando passar, sem zoom manual do visitante, em uma variedade de geometrias reais, incluindo:

- viewport estreita e alta;
- viewport estreita e baixa;
- viewport larga e curta;
- viewport larga e alta;
- área ampla de notebook/desktop/TV.

Os aparelhos usados são amostras, não categorias de CSS.

Para cada teste verificar:

- navegação legível e tocável;
- identidade visível sem roubar espaço funcional de forma destrutiva;
- vídeo legível e tocável;
- player inteiro, legível e operável;
- biblioteca de faixas acessível;
- redes acessíveis;
- ausência de overflow horizontal;
- ausência de sobreposição destrutiva;
- ausência de necessidade de zoom;
- quando houver composição fisicamente possível, todo o núcleo funcional disponível sem rolagem;
- identidade visual preservada.

## Próximo passo

Reabrir `qa-home-v2.html` no mesmo hardware e navegador/Custom Tab que produziu os screenshots anteriores, sem alterar zoom ou configuração. Confirmar se a nova camada `qa-home-v2-fit.css` mantém o núcleo funcional completo dentro de uma única viewport. Se falhar, registrar o screenshot e corrigir pela geometria observada — nunca por modelo de aparelho.

Somente depois de uma sequência de QA aprovada migrar a arquitetura para `index.html` e retirar a implementação antiga duplicada.
