# TASG-SITE-11 — CENOGRAFIA RESPONSIVA

**Projeto:** theantistateguys.com  
**Data:** 2026-09-06  
**Status:** V3 em QA; produção intacta

## Regra

A cenografia faz parte do sistema responsivo. O beco, sombras, piso, figuras e objetos visuais não são um papel de parede congelado.

## Mudança desta rodada

Foi criada a camada `qa-site-v3-cenography.css`, carregada depois do núcleo V3. Ela não cria versões por aparelho. Ela recebe o recipiente já calculado pelo núcleo e apenas dirige o mundo visual conforme a geometria disponível.

### Beco

A raster `home-scene.webp` ainda é usada como matéria-base do beco, mas a boombox já fotografada nela passou a ser neutralizada por uma sombra cenográfica fluida no setor inferior. A forma da sombra varia por aspect ratio e continua fazendo parte do ambiente escuro/pavimento.

Isso reduz a duplicação visual entre o rádio assado na fotografia e o rádio funcional do player.

### Santiago

Santiago continua sendo uma camada independente e fica acima da sombra cenográfica. Sua posição e escala permanecem governadas pelo recipiente.

### Player

O rádio funcional continua usando temporariamente um recorte da raster original como fonte de textura, mas o recorte recebeu máscara de bordas e direção própria por container query do player. Assim ele deixa de parecer uma fotografia retangular simplesmente colada sobre o beco.

A meta final continua sendo substituir essa fonte provisória por um objeto de rádio limpo/independente sem perder a identidade do JVC.

## Princípio de arquitetura

Separar responsabilidades:

- `qa-site-v3.css`: geometria, fluxo, acessibilidade, containers e layout funcional;
- `qa-site-v3-cenography.css`: direção artística do mundo visual em função do recipiente;
- HTML: sem duplicação mobile/desktop;
- JavaScript: interação e diagnóstico, sem escolher aparelho.

Essa separação é modular, não uma pilha de correções específicas para tamanhos de tela.

## Critério

A cenografia passa apenas quando:

1. o beco continua reconhecível em geometrias radicalmente diferentes;
2. nenhum objeto assado na raster contradiz um objeto funcional independente;
3. não existe retângulo visual denunciando recorte da fotografia;
4. Santiago não vira hotspot fixo preso à resolução original;
5. o cenário se recompõe sem exigir zoom, rotação ou modo desktop.

## Arquivos

- `qa-site-v3-cenography.css`
- `qa-site-v3.html` — passa a carregar a camada cenográfica
