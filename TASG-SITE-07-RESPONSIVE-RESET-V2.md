# TASG-SITE-07 — RESPONSIVE RESET V2

**Projeto:** theantistateguys.com  
**Banda:** Bobby Dias & The Anti-State Guys  
**Data:** 2026-09-06  
**Status:** QA EM ANDAMENTO — NÃO SUBSTITUIR A HOME DE PRODUÇÃO ATÉ PASSAR EM DISPOSITIVOS REAIS

## Por que este reset existe

O QA em aparelho real revelou uma falha conceitual na primeira camada `space-driven`: uma viewport larga em paisagem estava sendo tratada como se fosse automaticamente uma tela de desktop.

Isso fazia a composição 1672×941 inteira ser reduzida para caber em uma tela larga porém baixa. A página tecnicamente cabia, mas a experiência falhava: navegação, player e hotspots podiam ficar pequenos demais e obrigar o visitante a usar zoom.

**Regra corrigida:** caber não significa funcionar.

Se o visitante precisa ampliar, girar o aparelho, descobrir um recurso do navegador ou adaptar seu comportamento para conseguir usar a página, o frontend falhou.

## Cânone de responsividade

1. **Mobile First de verdade:** a base funciona no menor espaço disponível.
2. **Viewport, não aparelho:** nunca decidir layout por marca, modelo, orientação ou rótulo “desktop/mobile”.
3. **Largura e altura contam juntas:** uma viewport larga e curta não recebe uma composição de desktop em miniatura.
4. **Reflow antes de escala:** quando não há espaço confortável, componentes se reorganizam e a página pode rolar; não se reduz tudo até ficar microscópico.
5. **Alvos de toque confortáveis:** controles essenciais preservam alvo mínimo prático de aproximadamente 44–48 CSS px.
6. **Nada essencial depende de hover:** hover é apenas melhoria progressiva quando existe.
7. **Medidas fluidas:** `min()`, `max()`, `clamp()`, Grid, Flexbox e unidades relativas antes de dimensões rígidas.
8. **Progressive Enhancement:** a composição cenográfica integral só aparece quando largura E altura disponíveis permitem usabilidade real.
9. **Mesmo universo visual:** beco, identidade, wordmark, vídeo, música e redes continuam sendo a mesma Home; muda apenas a composição.
10. **QA real vence suposição:** nenhum breakpoint é aprovado só por parecer correto no código.

## Implementação de QA V2

Foram adicionados sem alterar a Home pública atual:

- `qa-home-v2.html`
- `qa-home-v2.css`
- `qa-home-v2.js`

URL de QA após deploy do GitHub Pages:

`https://theantistateguys.com/qa-home-v2.html`

### Arquitetura da V2

A V2 usa uma única estrutura funcional de Home e cresce progressivamente:

- espaço compacto: uma coluna, controles grandes e rolagem normal;
- espaço intermediário: grade mais ampla e aproveitamento lateral;
- espaço realmente amplo **e alto**: enhancement cenográfico usando a composição 1672×941.

O enhancement cenográfico exige simultaneamente `min-width: 1120px` e `min-height: 680px`. Estes números não representam aparelhos; são um primeiro limite de QA para garantir que a composição integral tenha espaço físico suficiente. Eles poderão ser ajustados a partir dos testes reais.

Uma tela larga porém baixa permanece no layout refluído e nunca vira “desktop em miniatura”.

## Critério de aprovação

A V2 só poderá substituir a Home atual quando passar, sem zoom manual do visitante, em pelo menos:

- celular em retrato;
- celular em paisagem;
- tablet em retrato;
- tablet em paisagem;
- viewport ampla de desktop/notebook.

Para cada caso verificar:

- navegação legível e tocável;
- vídeo legível e tocável;
- player legível e operável;
- biblioteca de faixas acessível;
- redes acessíveis;
- ausência de overflow horizontal;
- ausência de sobreposição destrutiva;
- ausência de necessidade de zoom;
- identidade visual preservada.

## Próximo passo

Testar `qa-home-v2.html` em hardware real. Registrar screenshots e falhas. Corrigir a V2 até passar. Somente então migrar a arquitetura aprovada para `index.html` e retirar a implementação antiga duplicada.
