# Cânone de 15/09 — implementação de 16–17/09/2026

## Fonte e precedência

A decisão atual de Bobby e o ZIP `IMPORTANTE - VER PRIMEIRO -Canone Visual Aprovado em 15.09.2026 - Historia com ano errado -  o certo eh 2024 - e zoom ou expandir as imagens foi uma ideia descartada.zip`, já versionado por Bobby em `7d21993a`, prevalecem sobre notas antigas.

Exceções obrigatórias: origem em **2024**; fotos sem lightbox; remover a placa de site provisório. A placa provisória foi pedida numa etapa antiga, antes do cânone. Foi incorreto tratá-la como decisão posterior. Só há um slogan: **CONEXÃO CLANDESTINA — CONTEÚDO EXPLÍCITO**.

## Execução

- `canon.css` passa a ser a única folha de estilo carregada. As folhas anteriores continuam no histórico e não são carregadas pelo site.
- `assets/canon/` contém recortes técnicos de placas, títulos, lettering, material e boombox do ZIP. Nenhuma nova geração de imagem foi realizada. Cenário recomposto a partir dos pixels das referências para separar imagem de fundo e elementos interativos. O HTML não é uma captura de página nem um mapa de imagem.
- Menus continuam sendo links HTML; títulos continuam headings acessíveis. Placas e letras originais são a superfície visual. Há tratamento de cores forçadas.
- Home: boombox separada, gaveta fotográfica independente, CD DEMO, efeito fornecido, transporte habilitado após efeito, play/stop/anterior/próxima/eject e biblioteca.
- Mobile: mesma identidade e aparelho; controles reorganizados para toque, com alvos de pelo menos 44px. Rolagem vertical é legítima. Não exigir rotação ou zoom. Rodapé presente.
- Contato: e-mail oficial e formulário `mailto:`. O formulário abre o aplicativo de e-mail e informa isso antes de enviar. Não existe backend de entrega de mensagens.
- Integrantes: seis fotos reais e textos existentes da banda; biografias por `details/summary`.
- História: 2024; preservada a narrativa real. Fotos: quatro imagens reais; nenhuma expansão. Shows: nenhuma data fabricada.
- Biblioteca também lê `data/videos.json`, já atualizado pelo workflow oficial do YouTube, e oferece links diretos dos vídeos. MP3s continuam no MEGA S4 existente.
- Música só passa a buscar metadados após a inserção do CD; não há download antecipado de música na entrada.

## Validação — distinguir função de fidelidade

A matriz local de 54 casos e os quatro percursos de interação passaram antes do acabamento final dos recortes de placas. Capturas das seis páginas foram inspecionadas; foram corrigidos rebites deformados, textos residuais nos fundos, rosto recortado, sobreposição no Contato e a seleção de rota. A validação final está no workflow `responsive-qa-v3` da branch `canon-20260916`.

Medição local: Home ~577 KB no telefone e ~516 KB desktop, CLS 0. Isso é medição de laboratório, não promessa de tempo de carregamento real.

A reprodução remota do MEGA S4 não pôde ser confirmada no navegador local desta execução (timeout de rede); o teste `canon-contract.mjs` registra o estado sem fingir reprodução bem-sucedida. Verificar o resultado externo do CI antes de declarar áudio verificado.

Comparar sempre capturas renderizadas com as seis imagens originais. Passar testes de geometria não equivale à aprovação artística de Bobby.

## Proteção de assets

Menu contextual e arraste das mídias continuam bloqueados como dissuasão casual; o zoom nativo do navegador é preservado. Não foi ativada regra de hotlink no Cloudflare: não há ferramenta de administração do Cloudflare conectada. `docs/HOTLINK-PROTECTION.md` mantém a configuração necessária. GitHub Pages público não oferece sigilo de assets nem bloqueio de captura de tela.

## Publicação

Preservar GitHub Pages + Cloudflare e o domínio atual. Nunca criar uma infraestrutura nova para resolver uma limitação de preview. Não promover uma versão com testes falhando ou artefatos visuais evidentes. A confirmação da publicação deve registrar commit e execução Pages, sem confundir upload da branch com deploy público.
