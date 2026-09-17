# TASG SITE — Pendências visuais da Home

Data: 17/09/2026
Status: diagnóstico alinhado com Bobby; não corrigir por suposição visual ou por pixels fixos de um aparelho.

## Regra principal

A Home precisa se reorganizar conforme o espaço realmente disponível. Não tratar “mobile” como uma única resolução nem ajustar para um aparelho específico. As correções devem preservar o cânone visual aprovado e funcionar em diferentes larguras, alturas, densidades, barras de navegador, safe areas e orientações.

## Problemas observados — MOBILE

1. **Sobreposição de camadas/imagens na composição da Home**
   - Há sobreposições visuais perceptíveis no fundo.
   - Também aparecem interferências/sobreposições na região da placa do slogan `CONEXÃO CLANDESTINA — CONTEÚDO EXPLÍCITO`.
   - Não assumir que o problema seja apenas escala ou largura; revisar a relação entre camadas, containers e posicionamento responsivo.

2. **Boombox: controles fora da integração visual do objeto**
   - Os controles funcionam mesmo quando aparecem fora do corpo visual da boombox.
   - Isso indica que a área interativa/posicionamento dos controles não está suficientemente amarrada à geometria visual da própria boombox.
   - A correção não deve ser feita para uma resolução específica; os controles precisam acompanhar a boombox de forma consistente em geometrias mobile diferentes.

3. **Boombox: aparência dos controles**
   - Os botões criados em CSS/UI têm coloração cinza muito diferente da boombox e parecem elementos externos sobrepostos.
   - O objetivo é que os controles necessários pareçam parte física da própria boombox, não uma interface moderna colocada por cima.

4. **Não concluir por screenshots isolados**
   - Verificar comportamento real, hitboxes e estados do player em diferentes proporções.
   - Tablet ainda precisa ser verificado; não presumir que tablet = desktop reduzido ou mobile ampliado.

## Problemas observados — NOTEBOOK / DESKTOP

1. **Pequena “parede”/faixa logo abaixo das placas de navegação**
   - Existe uma camada/faixa visual logo abaixo das placas `HOME`, `HISTÓRIA`, `CONTATO`, `INTEGRANTES`, `FOTOS`, `SHOWS`, etc., parecendo uma pequena parede.
   - É um detalhe tolerável. Só corrigir se a solução for simples, segura e não introduzir regressão.

2. **Boombox — problema principal**
   - A boombox em si está visualmente muito boa e deve ser preservada.
   - Os botões `CD / FAIXAS` e `EJECT` não são necessários no fluxo atual e não fazem sentido como controles permanentes visíveis.
   - Depois de inserir o CD, parar a reprodução já pode ser feito com `STOP`; portanto esses dois controles podem ser removidos da interface visível.
   - Os botões de transporte atuais não estão implementados como parte visual da boombox; parecem uma camada de UI posicionada sobre ela.
   - A cor dos botões difere demais do rádio: o cinza chama atenção e denuncia a sobreposição.
   - A solução desejada é integrar os controles necessários visualmente à própria boombox e manter suas áreas clicáveis vinculadas à geometria dela em qualquer dispositivo.

3. **Faixa inferior / rodapé**
   - A faixa inferior está destacada demais.
   - A intenção original era uma faixa preta, pequena e discreta, como nota de rodapé do tipo “site construído com...”.
   - Também é um detalhe tolerável se a correção trouxer risco ou complexidade desnecessária.

## Prioridade de correção

1. **Boombox e controles — obrigatório corrigir.**
2. Sobreposição de camadas no mobile — revisar com cuidado e sem solução baseada em pixels fixos.
3. Pequena faixa/“parede” sob a navegação — opcional se simples e segura.
4. Rodapé/faixa inferior — opcional se simples e segura.

## Decisão de arquitetura da boombox — alinhada com Bobby

Princípio aprendido e aprovado: **não acrescentar funcionalidade visual ao redor de um objeto quando a própria aparência do objeto já contém os controles que devem funcionar.**

Para esta boombox:

- A imagem canônica `assets/canon/boombox.webp` permanece **intocada**. Não redesenhar, não pintar controles por cima e não criar substitutos visuais.
- O componente usa a geometria nativa da própria arte, **672 × 464**, como sistema interno único.
- A página decide apenas o tamanho final do componente; imagem, gaveta, CD, display e áreas interativas escalam juntos.
- Os quatro transportes necessários são hotspots HTML transparentes presos à geometria da boombox: faixa anterior, stop, play/pause e próxima faixa.
- `CD / FAIXAS` e `EJECT` deixam de fazer parte da interface visual. Depois que o CD entra, `STOP` resolve a interrupção; não há necessidade de um controle artificial de ejeção.
- A área de toque pode ser maior que o desenho físico do botão, mas deve permanecer invisível e vinculada ao mesmo objeto.
- Para calibração via DevTools/F12 existe modo de debug planejado/implementado com hotspots verdes sem afetar produção.
- Não calibrar os controles por modelo de celular, viewport específico ou breakpoint. As coordenadas pertencem à boombox, não ao aparelho.

Implementação em teste na branch `fix/boombox-native-controls`:

- novo `boombox-native-controls.css`;
- `home-final-v1.js` ajustado para fluxo `open → closing → ready`, sem depender de EJECT;
- controles artificiais antigos permanecem apenas no DOM temporariamente para evitar churn de markup, mas ficam ocultos, desabilitados e fora da navegação;
- QA responsivo e de interação atualizado para validar hotspots físicos, ausência de UI cinza artificial, não sobreposição e comportamento do áudio;
- `tests/canon-contract.mjs` atualizado para o novo contrato da boombox.

## Restrições

- Não redesenhar a Home.
- Não alterar o cânone visual aprovado.
- Não gerar novas imagens sem conversar com Bobby antes.
- Não usar breakpoints como substituto de uma estrutura realmente responsiva.
- Não considerar o site finalizado apenas porque um conjunto de geometrias de teste passa; conferir também a coerência visual e interativa em aparelhos reais.
- Antes de qualquer alteração importante, alinhar a solução com Bobby.
