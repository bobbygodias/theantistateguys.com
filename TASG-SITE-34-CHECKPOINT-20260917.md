# Bobby Dias & The Anti-State Guys — checkpoint de continuidade

**Data do checkpoint:** 2026-09-16 18:34:23 -06:00 (relógio do ambiente de trabalho)  
**Projeto:** site oficial `theantistateguys.com`  
**Objetivo:** preservar o estado verificável do site, o cânone visual aprovado e a próxima ação, para retomada segura em outra sessão/dispositivo.

> Este documento é um checkpoint operacional. Ele separa o que foi aprovado, o que foi realmente testado e o que ainda não pode ser afirmado.

## Estado ativo

- **Fonte visual governante:** ZIP `Canone Visual Aprovado em 15.09.2026 - Historia com ano errado - o certo eh 2024 - e zoom ou expandir as imagens foi uma ideia descartada.zip`.
- **Local do ZIP nesta execução:** `/workspace/scratch/5a71fae2ccdf/upload/Canone Visual Aprovado em 15.09.2026 - Historia com ano errado -  o certo eh 2024 - e zoom ou expandir as imagens foi uma ideia descartada.zip`.
- **Pranchas dentro do ZIP:** `Homes.png`, `Contato.png`, `Historia.png`, `Integrantes.png`, `Fotos (pagina do site).png`, `Shows e Eventos.png`.
- **Autoridade:** o cânone visual aprovado prevalece sobre versões publicadas, templates, interpretações posteriores ou conveniências técnicas.
- **Código ativo:** checkout `/workspace/scratch/5a71fae2ccdf/site`.
- **Branch local:** `canon-20260916`.
- **HEAD local confirmado no início deste checkpoint:** `212bd3a` — `Restore approved visual materials and responsive native page composition`.
- **Atualização remota anteriormente confirmada:** branch remota `canon-20260916` apontou para `8dfb1e3b0dffc9864c0ceff28a4b0c13d928b837` por operação de branch/ref. As alterações listadas em “trabalho local ainda não consolidado” abaixo podem estar depois desse commit e não devem ser consideradas publicadas sem nova verificação.
- **Não afirmar publicação em produção:** este checkpoint não prova que o estado local mais recente esteja no domínio público.

## Decisões bloqueadas pelo Bobby

1. Identidade própria da banda; não usar template genérico.
2. Família visual única: underground nu-metal dark + grunge, beco urbano escuro, piso molhado, reflexos âmbar, ferrugem, metal gasto, preto, bege sujo e vermelho apenas como destaque.
3. A Home aprovada é o cânone. O restante deve parecer outro cômodo/área do mesmo lugar físico.
4. Figura humana discreta, quase sombra, sem disputar com o nome ou a boombox.
5. Nome exato: **BOBBY DIAS & THE ANTI-STATE GUYS**; usar a tipografia/identidade fornecida, sem substituir silenciosamente por uma fonte genérica.
6. Único slogan: **CONEXÃO CLANDESTINA — CONTEÚDO EXPLÍCITO**.
7. A placa histórica/provisória **“SITE PROVISÓRIO · AINDA EM PRODUÇÃO”** foi um episódio antigo de uma sessão em que o site estava inacabado; não pertence ao estado atual e não deve voltar para a Home.
8. Não inserir símbolos anarquistas/políticos, manifestos, regionalismo ou frases inventadas.
9. Boombox é o coração da Home: objeto físico integrado ao beco, não um player HTML fantasiado.
10. CD identificado somente como **DEMO**; sequência: CD/gaveta visível → toque/clique → CD entra → gaveta fecha → efeito real fornecido → player pronto.
11. Controles necessários: Play, Stop, Anterior, Próxima, Eject e **CD / FAIXAS**; display de faixa/tempo; Eject interrompe/resetando o necessário e retorna à gaveta aberta.
12. Usar fontes reais de vídeo/música já definidas; não inventar áudio ou vídeo. Não há vídeo de introdução obrigatório.
13. Navegação em placas industriais/metálicas envelhecidas; no mobile, hambúrguer metálico coerente com o mesmo cenário.
14. Desktop, tablet, portrait e landscape são a mesma experiência reorganizada; mobile first de verdade; sem hover obrigatório, sem zoom exigido e com alvos de toque adequados.
15. Fotos somente da banda e somente os seis integrantes: Bobby Dias, Break, Lukas McFly, Marcus Young, Thomaz e Santiago.
16. Fotos não abrem lightbox nem expandem ao clique; ampliação fica a cargo do navegador/dispositivo.
17. História começa em **2024** e segue a narrativa real: BreakNews, formação original, “O Forasteiro”, entrada do Bobby, mudança de direção, nascimento de Bobby Dias & The Anti-State Guys e consolidação Nu-Metal + Grunge.
18. Shows sem confirmação: mostrar honestamente **DATAS EM ATUALIZAÇÃO** e apontar para canais oficiais; jamais inventar data, local, horário, ingresso ou status.
19. Contato: `CONTATO`, `FALE COM A BANDA`, `CONTATOS`, formulário, Instagram, YouTube e `theantistateguys@gmail.com`; sem WhatsApp, e-mail pessoal ou endereço inventado.
20. Galeria pode usar Estúdio, Ensaio, Banda, Detalhes e Arquivo somente quando houver material real; não criar “Ao Vivo” sem fotos ao vivo.
21. Proteger assets contra download/hotlinking casual dentro do possível, sem prometer proteção absoluta contra captura.
22. Ordem de acabamento: **Home → Contato → Integrantes → História → Fotos → Shows**.
23. Refinamento técnico é permitido; mudança de conceito, composição fundamental, narrativa, identidade ou criação/edição de novo visual exige conversa explícita com Bobby.

## O que foi produzido e verificado

- Assets técnicos derivados exclusivamente das pranchas aprovadas foram criados em `site/assets/canon/`: fundos de beco (desktop/portrait/interior), boombox, bandeja/CD, wordmark, placas de navegação/títulos, texturas e rodapé.
- `canon.css` passou a ser a folha visual principal carregada pelo HTML atual.
- A estrutura atual mantém seis rotas semânticas: Home, Contato, Integrantes, História, Fotos e Shows.
- A Home usa a composição de beco, silhueta discreta, wordmark aprovado, slogan único, boombox física, CD DEMO e rodapé editorial.
- Contato usa o universo de textura/placas do cânone e o e-mail oficial.
- Integrantes usa as seis fotos reais; não há biografias inventadas nem sétimo integrante.
- História usa o ano correto 2024.
- Fotos não usa lightbox/expansão.
- Shows informa atualização sem inventar eventos.
- Proteções casuais de arrastar/context menu foram mantidas sem alegar DRM.
- Nenhuma imagem nova foi gerada por IA nesta execução; os visuais canônicos são recortes/derivações técnicas do ZIP aprovado.

## Evidências de teste

- `node tests/integrity-qa.mjs` — **PASS**; 55 arquivos locais, 6 rotas, 2 faixas.
- QA responsivo Playwright — **PASS** em 54 casos (9 geometrias × 6 rotas); alvos mínimos de toque reportados como ≥ 44 px.
- QA de interação — **PASS** em 4 geometrias: 300×960, 640×360, 390×844 e 1280×664.
- Snapshots visuais — **PASS** para Home, Contato, Integrantes, História, Fotos e Shows; artefatos em `site/test-artifacts/visual/`.
- Performance QA — evidência local aproximada: ~577 KB em condição móvel e ~516 KB em desktop, CLS 0, sem erros observados.
- `tests/canon-contract.mjs` — contrato estrutural/conteúdo **PASS**. O teste registrou que a reprodução do áudio externo não pôde ser verificada no laboratório (timeout); portanto, **não declarar áudio real validado** até uma execução com conectividade/ambiente que permita ouvir a faixa e o efeito de fechamento.
- Browser cloud tentando `http://127.0.0.1:4173` falhou com `ERR_BLOCKED_BY_CLIENT`; as verificações locais usaram Playwright headless. Isso é uma limitação do laboratório, não evidência de falha do site publicado.

## Trabalho local ainda não consolidado

No momento do checkpoint, `git status --short` mostrou alterações locais e arquivos não rastreados, incluindo:

- `.github/workflows/responsive-qa-v3.yml`
- `approved-pages.js`, `home-final-v1.js`, `script.js`, `index.html`, `canon.css`
- `assets/canon/alley*.webp`, `boombox.webp`, `footer-grain.webp`
- novas placas `assets/canon/nav-*.webp` e títulos `assets/canon/title-*.webp`
- `tests/integrity-qa.mjs`, `tests/canon-contract.mjs`
- `docs/continuity/`
- remoção local de `docs/approved-20260915/home.png` (marcada como `D`; confirmar antes de qualquer commit)

Esses itens são estado de trabalho. Não devem ser chamados de publicados até serem revisados, commitados na branch correta, enviados e verificados pelo CI/publicação.

## Lacunas e riscos reais

- O áudio externo e o efeito real de fechamento ainda não têm verificação auditiva reproduzível neste laboratório; somente o contrato estrutural e a tentativa de reprodução foram registrados.
- A versão remota `8dfb1e3…` antecede parte dos refinamentos locais; a relação exata entre remoto, HEAD local e produção precisa ser rechecada antes de novo envio.
- Não assumir que o domínio público corresponde aos snapshots locais sem abrir a URL publicada e comparar novamente.
- Uploads originais aparecem como cópias de trabalho no scratch; se um anexo expirar, recuperar pela cópia persistente/Library ou pelo repositório, sem fingir que foi inspecionado.

## Próxima retomada segura

1. Abrir este checkpoint e o ZIP canônico; não misturar com a placa provisória histórica.
2. No checkout `site`, executar `git status --short` e `git log --oneline --decorate -5`.
3. Revisar especificamente a remoção de `docs/approved-20260915/home.png`, o CSS final e os novos assets de placas/títulos.
4. Rodar `node tests/integrity-qa.mjs`, QA responsivo/interação e snapshots visuais.
5. Se tudo continuar PASS, consolidar somente as alterações intencionais na branch `canon-20260916`, obter o SHA completo de `git rev-parse --verify HEAD`, atualizar o remoto e aguardar CI.
6. Só depois comparar a URL pública; não declarar deploy nem áudio validado sem evidência correspondente.

### Comando de retomada

> “Abra `site/docs/continuity/TASG-SITE-34-CHECKPOINT-20260917.md`, compare o ZIP canônico com o estado local da branch `canon-20260916`, confira o `git status`, e retome pela revisão/commit das alterações não consolidadas; preserve o cânone e não reintroduza a placa provisória.”

