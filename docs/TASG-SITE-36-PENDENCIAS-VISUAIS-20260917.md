# TASG SITE — Pendências visuais da Home

Data: 17/09/2026
Status: controles nativos da boombox publicados; correção estrutural do estado fechado da gaveta validada em branch isolada e aguardando aprovação de Bobby antes da publicação.

## Regra principal

A Home precisa se reorganizar conforme o espaço realmente disponível. Não tratar “mobile” como uma única resolução nem ajustar para um aparelho específico. As correções devem preservar o cânone visual aprovado e funcionar em diferentes larguras, alturas, densidades, barras de navegador, safe areas e orientações.

## Problemas observados — MOBILE

1. **Sobreposição de camadas/imagens na composição da Home**
   - Há sobreposições visuais perceptíveis no fundo.
   - Também aparecem interferências/sobreposições na região da placa do slogan `CONEXÃO CLANDESTINA — CONTEÚDO EXPLÍCITO`.
   - Não assumir que o problema seja apenas escala ou largura; revisar a relação entre camadas, containers e posicionamento responsivo.

2. **Boombox: controles fora da integração visual do objeto**
   - Os controles funcionavam mesmo quando apareciam fora do corpo visual da boombox.
   - A correção implementada prende a interação à geometria interna da boombox e elimina os controles artificiais visíveis.

3. **Boombox: aparência dos controles**
   - Os botões criados em CSS/UI tinham coloração cinza muito diferente da boombox e pareciam elementos externos sobrepostos.
   - A implementação nova usa hotspots transparentes sobre os próprios botões físicos do asset.

4. **Não concluir por screenshots isolados**
   - Verificar comportamento real, hitboxes e estados do player em diferentes proporções.
   - Tablet ainda precisa de conferência visual humana; não presumir que tablet = desktop reduzido ou mobile ampliado.

## Problemas observados — NOTEBOOK / DESKTOP

1. **Pequena “parede”/faixa logo abaixo das placas de navegação**
   - Existe uma camada/faixa visual logo abaixo das placas `HOME`, `HISTÓRIA`, `CONTATO`, `INTEGRANTES`, `FOTOS`, `SHOWS`, etc., parecendo uma pequena parede.
   - É um detalhe tolerável. Só corrigir se a solução for simples, segura e não introduzir regressão.

2. **Boombox — problema principal**
   - A boombox em si está visualmente muito boa e deve ser preservada.
   - Os botões `CD / FAIXAS` e `EJECT` não são necessários no fluxo atual e não fazem sentido como controles permanentes visíveis.
   - Depois de inserir o CD, parar a reprodução já pode ser feito com `STOP`; portanto esses dois controles saíram da interface visível na correção publicada.
   - Os botões de transporte artificiais foram substituídos por hotspots sobre a fileira física já existente na boombox.

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
- `STOP`, `PREV`, `PLAY/PAUSE` e `NEXT` são **hotspots HTML transparentes presos aos botões físicos já existentes na fotografia**.
- Os hotspots não ganham placa, cor, metal falso ou desenho novo. A pessoa vê somente a boombox original.
- `CD / FAIXAS` e `EJECT` deixam de aparecer na interface visual.
- A máquina de estados já existente (`open → closing → ready`) e o efeito real de fechamento da gaveta são preservados.
- O motor de áudio existente é reutilizado; a mudança é na camada de interação, não no catálogo ou na reprodução.
- Para calibração durante desenvolvimento, existe modo visual temporário `debug-hotspots`, que colore as zonas transparentes no DevTools. Ele não aparece em produção.
- Não calibrar por aparelho, viewport ou breakpoint específico; calibrar pela geometria interna da própria boombox.

## Regra de construção descoberta neste ajuste

> Não acrescentar funcionalidade ao redor de um objeto quando a funcionalidade pode ser incorporada ao próprio objeto.

Aplicação prática: uma camada técnica invisível pode existir para tornar o objeto interativo, mas não deve criar uma segunda aparência de controle por cima dele quando o controle físico já existe no objeto.

## Estado da implementação dos controles

A implementação dos controles nativos foi validada na branch `boombox-native-controls` e publicada na `main` no merge `4285f863c6910e211af6cef09889f25e224ee7da`.

Implementado:

- stylesheet isolado `boombox-native-controls.css`;
- remoção visual da UI auxiliar `CD / FAIXAS` e `EJECT`;
- remoção da prateleira metálica mobile criada para sustentar os controles artificiais;
- restauração da boombox para escala integral dentro do seu container;
- quatro hotspots transparentes amarrados à fileira física de botões do asset 672×464;
- reaproveitamento da máquina de estados e do efeito de fechamento do CD;
- QA responsivo atualizado para validar que os hotspots permanecem dentro da boombox e não se sobrepõem;
- QA de interação atualizado para validar `STOP`, `PREV`, `PLAY/PAUSE` e `NEXT` como controles físicos nativos;
- contrato canônico atualizado para refletir a remoção da UI auxiliar e manter o acesso oficial ao YouTube pelo cabeçalho.

### QA dos controles nativos

Run GitHub Actions: `#81` — ID `35186381639` — head testado `dab24208833be1b7b2b5aeab6811a0f8178075bf`.

Resultado:

- integridade: PASS;
- matriz responsiva: PASS — 54 casos, 9 geometrias × 6 páginas;
- interação/foco: PASS — 4 geometrias;
- contrato canônico e reprodução real: PASS;
- performance: PASS;
- snapshots representativos: PASS;
- upload de artefatos: PASS.

## Correção do estado fechado da gaveta — 17/09/2026

Após a publicação dos controles nativos, Bobby identificou em aparelho real dois sintomas no estado `ready`: uma faixa preta acima da frente da gaveta e deslocamento visual do display na tentativa de correção inicial.

### Causa real encontrada

- A faixa preta não era criada pela animação: ela já existe no próprio `assets/canon/boombox.webp` como a cavidade atrás da gaveta.
- Enquanto a gaveta está aberta, `tray.webp` cobre parte dessa cavidade. Quando a gaveta desaparecia no estado `ready`, a cavidade preta voltava a aparecer.
- A primeira tentativa de correção comprimia o `tray.webp` inteiro em uma faixa rasa; além de não atacar a causa correta, isso podia deformar visualmente a peça.
- `boombox-native-controls.css` também estava redefinindo a geometria do display sem necessidade. Essa responsabilidade foi removida: o display volta a ser governado somente pela camada visual canônica da Home.

### Solução estrutural validada

Branch: `fix/boombox-ready-state-v2`.

- `boombox.webp` continua absolutamente intacta.
- O estado fechado usa `assets/canon/tray-closed.webp`, uma camada transparente no palco nativo 672×464.
- A camada contém somente metal derivado da própria arte aprovada da boombox, alinhado à perspectiva do compartimento, cobrindo a cavidade preta sem esticar uma fotografia inteira e sem criar novo desenho de boombox.
- A camada aparece apenas em `data-cd-state="ready"`.
- O display não é reposicionado por `boombox-native-controls.css`.
- O fluxo `open → closing → ready`, o SFX real e os quatro hotspots permanecem inalterados.

### QA final da correção da gaveta

Run GitHub Actions: `#92` — ID `35276204867` — head testado `779dd9f25516be5c01b97a1657baba3b70b6a474`.

Resultado completo: SUCCESS.

- integridade: PASS;
- matriz responsiva: PASS — 54 casos;
- interação/foco: PASS;
- contrato canônico e reprodução real: PASS;
- performance: PASS;
- snapshots representativos: PASS;
- upload de artefatos: PASS.

Inspeção visual humana dos snapshots após o QA:

- desktop/notebook: sem corrupção visual, sem a faixa preta anterior, display alinhado e boombox preservada;
- mobile estreito: gaveta fechada, display e corpo da boombox permanecem no mesmo sistema de escala e alinhamento;
- a versão corrompida intermediária foi descartada e nunca foi publicada na `main`.

Depois do QA, o gatilho temporário da branch foi removido do workflow. Nenhuma mudança funcional foi feita após o head testado; apenas limpeza de configuração/documentação.

**Situação atual: pronta para Bobby aprovar ou rejeitar antes da publicação na `main`.**

## Prioridade de correção

1. **Estado fechado da gaveta — branch corrigida e visualmente validada; aguardando Bobby para publicar.**
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

## Invariância interna da boombox — descoberta e correção em 17/09/2026

Durante a revisão posterior ao merge do estado fechado, Bobby levantou a pergunta estrutural correta: se o HTML reorganiza a página conforme o display, como garantir que a boombox continue sendo o mesmo objeto e que suas partes internas não sejam reposicionadas independentemente?

A inspeção mostrou que a arquitetura principal já usava `.music-machine` como palco 672 × 464, com `boombox.webp`, mecanismo, gaveta fechada e hotspots no mesmo sistema. Porém o display ainda herdava regras responsivas antigas do `canon.css`: no desktop mudava suas porcentagens e, abaixo de 480 px, sua posição/altura ainda usavam cálculos baseados numa antiga prateleira mobile de 50 px que já havia sido removida.

Essa herança explica o deslocamento do display observado em aparelho real e corrige uma conclusão anterior deste documento: deixar o display exclusivamente sob as regras antigas da Home não era suficiente. A solução atual faz `boombox-native-controls.css` atuar como camada tardia de invariância geométrica, fixando a posição normalizada do display dentro do mesmo palco 672 × 464, sem depender de viewport ou breakpoint.

Branch isolada: `fix/boombox-coordinate-invariance`.

Alterações funcionais desta etapa:

- display normalizado em 40,8% / 37% / 30% / 10%, com rotação preservada, sempre relativo à boombox;
- gaveta, CD, display e hotspots continuam presos ao mesmo objeto 672 × 464;
- cadeia de cache-bust fechada: `index.html` força `script.js` novo, que força `home-final-v1.js` novo, que força o CSS novo da boombox;
- nenhum redesenho da `boombox.webp`.

O QA responsivo ganhou um teste novo de invariância: em vez de apenas verificar se a Home cabe em cada viewport, mede as coordenadas normalizadas das peças internas e falha se um breakpoint mover display, gaveta ou botões independentemente da boombox.

A primeira execução desse teste falhou apenas na altura da hitbox invisível do CD em 300×960 e 640×360. A causa era legítima: `min-height: 44px` aumenta a área de toque em telas pequenas por acessibilidade, sem mover a arte do CD. O teste foi corrigido para permitir esse crescimento da hitbox e continuar exigindo invariância da posição/largura visual.

QA final desta etapa: GitHub Actions run #96, ID `35286566381`, head funcional testado `16596617d65146c44e6dee92e381b52f2caf5e55` — SUCCESS completo.

Resultado:

- integridade: PASS;
- matriz responsiva: PASS — 54 casos, agora incluindo invariância interna da boombox;
- interação/foco: PASS;
- contrato canônico e reprodução real: PASS;
- performance: PASS;
- snapshots representativos: PASS;
- artefatos: PASS.

Inspeção visual humana dos snapshots: desktop em estado `ready`, mobile estreito em estado `ready` e layout wide-short mantiveram display, gaveta e corpo da boombox alinhados. Após o QA, o gatilho temporário da branch foi removido; essa limpeza não altera código funcional.

Estado: branch tecnicamente pronta para revisão/aprovação de Bobby. Não publicar na `main` sem alinhamento explícito.
