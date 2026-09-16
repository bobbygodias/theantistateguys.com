# Bobby Dias & The Anti-State Guys — SITE

## Checkpoint 2026-09-14 — direção final em implementação

Site oficial: `https://theantistateguys.com`

Produção pública: branch `main`.

Direção final em desenvolvimento e QA: branch `home-final-direction-v1`.

**Não promover para `main` sem revisão visual do Bobby e QA funcional/responsivo verde.**

## Direção visual aprovada

- Universo físico/cinematográfico de beco escuro, ferrugem, metal gasto, preto, âmbar e bege sujo.
- Vermelho usado com moderação para estado ativo/destaque.
- Navegação e títulos podem assumir a linguagem de placas industriais envelhecidas.
- A página deve parecer um lugar pertencente à banda, não um tema genérico de site de rock.
- Nu-metal + grunge + underground brasileiro, sem caricatura de favela/gangue norte-americana.
- Nada de símbolos anarquistas, slogans políticos, frases aleatórias de parede ou manifestos inventados.
- Responsividade é recomposição real: vertical não é desktop espremido.
- Touch é primeira classe; interação importante não pode depender de hover.

## Home

- Intro/vídeo removido da direção final.
- Beco como cenário principal.
- Wordmark oficial da banda.
- Aviso `SITE PROVISÓRIO · AINDA EM PRODUÇÃO` enquanto o trabalho estiver em andamento.
- Boombox é um objeto físico funcional, não um player web vestido de rádio.
- Fluxo do CD: gaveta aberta → toque/clique no disco → gaveta fecha com efeito sonoro real → aparelho fica pronto → Play/Stop/Anterior/Próxima/Biblioteca → Eject para e reabre.
- Display exibe faixa e tempo.
- Controles permanecem fisicamente integrados ao aparelho inclusive em telas estreitas.
- Instagram e YouTube oficiais.

## História

- Origem oficial usada no site: Goiânia, fevereiro de **2024**.
- Nome inicial: `BreakNews`.
- Formação inicial: Break, McFly, Young, Thomaz e Santiago.
- `O Forasteiro` foi a única composição autoral daquele primeiro momento, doada por Bobby Dias.
- Após o episódio da apresentação/aniversário de Break e o ensaio mediado por Santiago, Bobby foi convidado a liderar o projeto.
- O nome mudou para `Bobby Dias & The Anti-State Guys` (hífen intencional).
- Sonoridade: Nu-Metal + Grunge.
- Não inventar fatos além do arquivo de história fornecido pelo Bobby.

## Integrantes

Usar somente fotos reais fornecidas pelo Bobby.

Formação atual:
- Bobby Dias — Vocal, compositor e multiinstrumentista.
- Break — Bateria e percussão.
- Lukas McFly — Baixo e backing vocal.
- Marcus Young — Guitarra solo e backing vocal.
- Thomaz — Guitarra base e backing vocal.
- Santiago — Vocal, DJ e sonoplastia.

Direção visual: mural de pôsteres/fichas de parede, com pequenas quebras de eixo no desktop e leitura vertical limpa no mobile. Evitar aparência de “equipe corporativa”.

## Fotos

- Somente material fotográfico real da banda.
- Nunca inserir pessoas geradas por IA.
- Direção atual: parede/arquivo visual, com a `pose 6` como peça principal e fotos reais de estúdio/banda como peças secundárias.
- Crédito só quando conhecido/confirmado. Nunca inventar crédito.
- Não criar categoria `Ao Vivo` sem material real correspondente.

## Shows

- Nunca inventar datas, casas, horários ou ingressos.
- Estado atual: banda em estúdio; datas futuras só entram quando forem confirmadas.
- Foto de estúdio real.

## Contato

- Títulos aprovados: `CONTATO`, `FALE COM A BANDA`, `CONTATOS`.
- E-mail oficial e único da banda: `theantistateguys@gmail.com`.
- Instagram: `@theantistateguys`.
- YouTube: `@TheAntiStateGuys`.
- **Sem WhatsApp.**
- **Sem e-mail pessoal do Bobby.**
- Formulário atual monta a mensagem e abre o cliente de e-mail do visitante; não há backend externo inventado.

## QA

A branch final usa GitHub Actions com verificação de:
- integridade de arquivos/rotas;
- matriz responsiva em múltiplas geometrias;
- interação e foco;
- custo/carregamento;
- screenshots representativos;
- regressões críticas de contato e da metáfora física da boombox.

Camadas finais (`*-final-v1.css` / `*-final-v1.js`) também devem disparar o workflow.

## Regra de trabalho

Mudanças importantes de direção visual, conteúdo ou comportamento devem ser alinhadas com Bobby antes de implementação. Não alterar silenciosamente decisões já aprovadas. Em dúvida factual, perguntar em vez de preencher lacunas.
