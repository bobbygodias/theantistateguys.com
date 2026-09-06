# TASG-SITE-14 — JVC INDEPENDENTE + ACESSIBILIDADE DE ROTA

**Projeto:** theantistateguys.com  
**Banda:** Bobby Dias & The Anti-State Guys  
**Data:** 2026-09-06  
**Status:** QA V3 — produção pública ainda intacta

## Objetivo desta rodada

Remover a dependência funcional do player em relação ao recorte de `home-scene.webp` e fortalecer o QA/autonomia do frontend sem transformar Bobby em operador de teste.

## JVC independente

Foi criado o asset:

- `assets/jvc-player.svg`

O asset preserva o JVC usado na linguagem visual do projeto, mas passa a existir como objeto separado do beco.

O player funcional agora recebe o rádio por esta camada independente. O recorte de `home-scene.webp` deixou de ser a fonte visual do rádio funcional.

A fotografia do beco ainda contém um rádio assado na raster original. Até existir uma base cenográfica limpa, `qa-site-v3-cenography.css` continua neutralizando essa região com sombra/pavimento fluido.

### Regra

**Objeto funcional não pode depender de coordenada pintada dentro de uma raster de cenário.**

## Cenografia do player

`qa-site-v3-cenography.css` passou a:

- usar `assets/jvc-player.svg`;
- posicionar e dimensionar o JVC segundo o recipiente real do player;
- variar `inset`, posição e sombra pela proporção e altura do próprio player;
- remover máscara usada para esconder recorte retangular antigo;
- manter sombra de contato para o rádio continuar parecendo parte física do beco.

## QA automático

`qa-site-v3.js` passou a verificar também:

- overflow horizontal;
- alvos funcionais abaixo do mínimo de toque;
- elementos relevantes cortados horizontalmente;
- IDs duplicados;
- imagens sem atributo `alt`;
- botões sem nome acessível;
- se o rádio funcional ainda depende de `home-scene.webp`.

No diagnóstico:

- `rádio indep` = player desacoplado da raster do beco;
- `rádio RASTER` = regressão;
- `sem 0` = nenhum problema semântico simples detectado pelo QA;
- `HARD-OK` continua significando apenas ausência de falha geométrica/semântica automática óbvia, nunca aprovação artística.

## Acessibilidade de navegação

`script.js` foi refinado para:

- atualizar `aria-pressed` do botão play/pause;
- marcar a faixa atual com `aria-current`;
- ao trocar de rota pela navegação, levar foco programático ao título da nova seção sem provocar rolagem extra;
- manter `aria-current="page"` na placa da rota ativa;
- continuar zerando o scroll do `main`, que é o recipiente rolável real do V3.

## Deploy

As mudanças estão somente no laboratório V3:

- `qa-site-v3.html`
- `qa-site-v3.css`
- `qa-site-v3-cenography.css`
- `qa-site-v3-internal.css`
- `qa-site-v3.js`
- `script.js`
- `assets/jvc-player.svg`

A Home pública permanece intacta até aprovação do V3 em hardware real.

## Próxima frente

1. continuar reduzindo dependências da raster cenográfica original;
2. revisar foco/teclado/dialog em geometrias extremas;
3. validar páginas internas com o mesmo QA;
4. somente depois preparar migração controlada V3 → produção.

## Regra-mãe preservada

**Tudo se recompõe. O usuário não adapta navegador, zoom, orientação ou aparelho ao site. O site toma a forma do recipiente.**
