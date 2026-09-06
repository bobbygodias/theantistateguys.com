# TASG-SITE-12 — INTERNAL ROUTES FLUID

**Projeto:** theantistateguys.com  
**Banda:** Bobby Dias & The Anti-State Guys  
**Data:** 2026-09-06  
**Status:** QA V3 — rotas internas integradas ao motor fluido; produção ainda intacta

## Regra central

As páginas internas não são exceção à regra do projeto.

**História, Integrantes, Fotos, Shows e Contato também se recompõem ao espaço útil real.**

Não existe versão de celular, tablet, desktop, TV ou orientação. O mesmo DOM responde ao recipiente.

## Nova camada

Arquivo criado:

- `qa-site-v3-internal.css`

Ele é carregado depois do núcleo (`qa-site-v3.css`) e da cenografia (`qa-site-v3-cenography.css`).

A separação é intencional:

1. **núcleo:** física geral da viewport e componentes;
2. **cenografia:** direção visual do beco e objetos;
3. **rotas internas:** composição específica de conteúdo sem categorias de aparelho.

## Mudanças principais

### História

- empilhamento é o estado base;
- texto + foto só entram lado a lado quando largura **e proporção** sustentam essa direção;
- foto pode permanecer visível por `sticky` quando há coluna lateral útil;
- em espaço largo e muito baixo, texto e foto reduzem excessos de padding antes de recorrer a soluções ruins.

História é conteúdo longo; rolagem é legítima. O objetivo é evitar miniaturização ou um grid impróprio para o recipiente.

### Integrantes

- `auto-fit/minmax()` continua escolhendo a quantidade de cartões;
- cada `.member-card` virou um container próprio;
- cartões estreitos adotam imagem mais compacta;
- cartões muito largos podem virar composição horizontal foto + texto;
- espaços muito largos podem comportar mais cartões naturalmente.

### Fotos

A rota Fotos passou a usar a altura útil real:

- shell em grid;
- rótulo e título ocupam apenas o necessário;
- galeria recebe o restante da área;
- fotografia usa `object-fit: contain` dentro desse restante;
- quando a viewport é baixa, título, legenda e espaçamentos se compactam antes de gerar rolagem.

### Shows

- empilhamento é o estado base;
- texto + foto passam para duas colunas apenas quando largura e proporção tornam isso melhor;
- em viewport baixa, tipografia e espaçamentos se ajustam antes de aceitar rolagem.

### Contato

- shell usa toda a altura útil quando possível;
- canais usam `auto-fit` e distribuem o restante do recipiente;
- em altura curta, cartões reduzem padding e tipografia secundária antes de sair da viewport.

### Geometrias extremas

Foi incorporado explicitamente o tipo de caso discutido durante o alinhamento: algo como **300×960** deve continuar utilizável.

Não há regra dizendo “isso é celular”. Existe apenas uma consulta ao espaço:

- shell ocupa praticamente toda a largura;
- título não domina o recipiente;
- grids viram uma coluna quando necessário;
- e-mails e textos longos quebram sem overflow horizontal.

Em espaços muito grandes, inclusive TVs, o alvo de toque e a tipografia funcional podem crescer moderadamente em vez de permanecerem como uma ilha minúscula.

## Critério preservado

- remontagem antes de rolagem;
- rolagem quando o conteúdo é realmente maior do que o recipiente;
- nunca zoom obrigatório;
- nunca “Site de computador” obrigatório;
- nunca orientação obrigatória;
- nunca overflow horizontal acidental;
- nunca uma imagem de fundo ou um elemento cenográfico recebe licença para ignorar a responsividade.

## Arquivos alterados

- `qa-site-v3-internal.css` — novo
- `qa-site-v3.html` — passa a carregar a camada interna

## Próximos passos

1. continuar limpando dependências raster da Home, especialmente a boombox provisória;
2. usar o medidor QA para validar geometrias reais sem transformar Bobby em operador de testes;
3. revisar acessibilidade/teclado e conteúdo nas rotas internas;
4. só então planejar a substituição da produção pelas camadas V3 consolidadas.
