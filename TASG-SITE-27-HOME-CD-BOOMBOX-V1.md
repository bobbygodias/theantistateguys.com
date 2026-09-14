# TASG-SITE-27 — Home final / CD + Boombox v1

Checkpoint de continuidade da implementação aprovada com Bobby em 12–13/09/2026.

## O que entrou nesta etapa

- Direção visual da Home preservada: beco noturno, figura em sombra, wordmark real da banda, metal gasto, iluminação âmbar e vermelho restrito a destaque/estado ativo.
- Navegação recebeu tratamento de placas industriais físicas: bege sujo, borda escura, rebites/parafusos, desgaste e aba ativa em vermelho oxidado.
- Boombox continua sendo o objeto central da Home.
- Display do rádio passou a funcionar como display do player e inicia em `INSIRA O CD`.
- CD visível colocado sobre a gaveta aberta.
- Toque/clique no CD inicia a sequência de inserção.
- Gaveta fecha visualmente.
- Efeito sonoro oficial fornecido no projeto foi incorporado em `assets/cd-tray-close.mp3`.
- Player permanece bloqueado enquanto o CD está carregando e só fica pronto depois do efeito de gaveta terminar (com fallback previsível caso o navegador bloqueie o áudio).
- Depois de carregado, Play, Stop, Anterior, Próxima, Biblioteca e Eject ficam disponíveis.
- Eject para a reprodução, fecha a biblioteca se estiver aberta, reseta o tempo e devolve o CD ao estado inicial.
- Controles continuam fisicamente sobre a boombox inclusive em telas estreitas.
- Todos os alvos tocáveis do player foram mantidos em no mínimo 44×44 px.
- Texto/e-mail pessoal do Bobby não é usado; o site mantém `theantistateguys@gmail.com`.

## Responsividade

A Home continua usando recomposição real por geometria, não zoom forçado. A implementação foi testada em nove geometrias diferentes, incluindo:

- 300×960
- 390×844
- 640×360
- 800×800
- 768×1024
- 1280×664
- 1366×768
- 1920×1080
- 2560×1080

As seis rotas foram testadas em cada geometria.

## QA desta etapa

Run validado no branch `home-final-v1`: GitHub Actions `responsive-qa-v3`, run 34.

Resultados:

- Integridade: PASS
- Responsive matrix: 54 casos, 0 falhas
- Interação/foco: 2 casos, 0 falhas
- Performance measurement: PASS
- Visual snapshots: PASS
- CLS medido na Home: 0 nos dois cenários de performance

O primeiro run da etapa detectou alvos de toque abaixo de 44 px na Home. Isso foi corrigido antes deste checkpoint; o run seguinte passou integralmente.

## Estado visual verificado

Snapshots reais gerados pelo navegador confirmaram:

- desktop/paisagem: boombox no canto inferior esquerdo, figura em sombra, wordmark à direita, navegação em placas e redes no rodapé visual;
- mobile/vertical: menu recomposto em duas colunas, wordmark e aviso em seguida, beco preservado, boombox em largura útil e redes abaixo;
- o CD aparece sobre a gaveta aberta e o visitante recebe a indicação funcional para tocá-lo.

## Próximo passo depois da aprovação/publicação da Home

Seguir a ordem combinada:

1. Contato — placas, `FALE COM A BANDA`, bloco `CONTATOS`, formulário e e-mail oficial.
2. Integrantes — fotos reais, texto mais oral/underground e geometria menos corporativa no desktop.
3. História — narrativa real de 2024 e composição editorial aprovada.
4. Fotos — categorias e material real.
5. Shows — estrutura pronta, apenas dados confirmados.
6. QA final geral.

## Regra

A identidade visual encontrada está congelada como norte. Refinar sem reinventar. Nenhum slogan, símbolo político/anarquista ou frase decorativa aleatória deve ser reintroduzido.
