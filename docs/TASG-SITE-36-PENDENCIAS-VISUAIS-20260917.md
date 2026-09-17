# TASG SITE — Pendências visuais da Home

Data: 17/09/2026
Status: diagnóstico alinhado com Bobby; correção da boombox em implementação isolada na branch `boombox-native-controls`.

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
   - O objetivo é que os controles necessários sejam os próprios botões físicos já desenhados na boombox, não uma interface moderna colocada por cima.

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
   - Depois de inserir o CD, parar a reprodução já pode ser feito com `STOP`; portanto esses dois controles devem sair da interface visível.
   - Os botões de transporte atuais não estão implementados como parte visual da boombox; parecem uma camada de UI posicionada sobre ela.
   - A cor dos botões difere demais do rádio: o cinza chama atenção e denuncia a sobreposição.
   - A solução desejada é integrar os controles necessários à própria geometria física da boombox.

3. **Faixa inferior / rodapé**
   - A faixa inferior está destacada demais.
   - A intenção original era uma faixa preta, pequena e discreta, como nota de rodapé do tipo “site construído com...”.
   - Também é um detalhe tolerável se a correção trouxer risco ou complexidade desnecessária.

## Arquitetura alinhada para a boombox

Decisão conjunta Bobby + Andrew em 17/09/2026:

- **ZERO redesenho da boombox aprovada.** O asset visual `assets/canon/boombox.webp` permanece intacto.
- A boombox é tratada como um componente indivisível com geometria nativa **672 × 464**.
- Imagem, gaveta/CD, display e zonas de interação pertencem ao mesmo sistema de coordenadas interno.
- A página decide apenas quanto espaço existe para o componente; a boombox inteira cresce ou encolhe mantendo proporções.
- `STOP`, `PREV`, `PLAY/PAUSE` e `NEXT` tornam-se **hotspots HTML transparentes presos aos botões físicos já existentes na fotografia**.
- Os hotspots não ganham placa, cor, metal falso ou desenho novo. A pessoa vê somente a boombox original.
- `CD / FAIXAS` e `EJECT` deixam de aparecer na interface visual.
- A máquina de estados já existente (`open → closing → ready`) e o efeito real de fechamento da gaveta são preservados.
- O motor de áudio existente é reutilizado; a mudança é na camada de interação, não no catálogo ou na reprodução.
- Para calibração durante desenvolvimento, existe modo visual temporário `debug-hotspots`, que colore as zonas transparentes no DevTools. Ele não aparece em produção.
- Não calibrar por aparelho, viewport ou breakpoint específico; calibrar pela geometria interna da própria boombox.

## Regra de construção descoberta neste ajuste

> Não acrescentar funcionalidade ao redor de um objeto quando a funcionalidade pode ser incorporada ao próprio objeto.

Aplicação prática: uma camada técnica invisível pode existir para tornar o objeto interativo, mas não deve criar uma segunda aparência de controle por cima dele quando o controle físico já existe no objeto.

## Estado da implementação

Branch de trabalho: `boombox-native-controls`.

Implementado até este checkpoint:

- stylesheet isolado `boombox-native-controls.css`;
- remoção visual da UI auxiliar `CD / FAIXAS` e `EJECT`;
- remoção da prateleira metálica mobile criada para sustentar os controles artificiais;
- restauração da boombox para escala integral dentro do seu container;
- quatro hotspots transparentes amarrados à fileira física de botões do asset 672×464;
- reaproveitamento da máquina de estados e do efeito de fechamento do CD;
- QA responsivo atualizado para validar que os hotspots permanecem dentro da boombox e não se sobrepõem;
- QA de interação atualizado para validar `STOP`, `PREV`, `PLAY/PAUSE` e `NEXT` como controles físicos nativos.

Ainda não publicar/mesclar esta branch até o QA e a inspeção visual final serem concluídos.

## Prioridade de correção

1. **Boombox e controles — obrigatório corrigir.**
2. Sobreposição de camadas no mobile — revisar com cuidado e sem solução baseada em pixels fixos.
3. Pequena faixa/“parede” sob a navegação — opcional se simples e segura.
4. Rodapé/faixa inferior — opcional se simples e segura.
5. Recortes das outras páginas — Bobby relatou que alguns saíram levemente errados; analisar somente depois de fechar a boombox.

## Restrições

- Não redesenhar a Home.
- Não alterar o cânone visual aprovado.
- Não gerar novas imagens sem conversar com Bobby antes.
- Não usar breakpoints como substituto de uma estrutura realmente responsiva.
- Não considerar o site finalizado apenas porque um conjunto de geometrias de teste passa; conferir também a coerência visual e interativa em aparelhos reais.
- Antes de qualquer alteração importante, alinhar a solução com Bobby.
