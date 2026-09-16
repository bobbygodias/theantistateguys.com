# TASG — implementação das páginas aprovadas — 15/09/2026

Branch ativa: `home-final-direction-v1`; base recuperada `05a8dd735f9fb5be502985caad91a1678d3eff72`.

## Decisões vigentes

- Contato, Integrantes, História, Fotos e Shows aprovados, referências exatas em `docs/approved-20260915/`.
- Fotos individuais dos seis integrantes, biografias expansíveis (texto), molduras industriais e iluminação âmbar.
- História: fevereiro de **2024**, foto dos seis com Bobby sentado, arquivos completos sem cortar os integrantes.
- Correção explícita mais recente: **sem expansão de fotos** por clique/toque. Removidos modal, botões, setas, texto de convite e eventos. Zoom nativo preservado.
- Fotos: duas colunas no desktop, uma no mobile. Contatos antes do formulário no celular; formulário abre aplicativo de e-mail e não afirma envio automático.
- Shows: DATAS EM ATUALIZAÇÃO; não inventar datas.
- Rolagem natural, rodapé no fluxo, sem comprimir fotos para caber na altura da tela.
- Boombox: CD aberto inicialmente, fechamento com efeito de áudio, controles após estado ready, visor com faixa, biblioteca e ejeção.

## Recuperado e implementado

Alterações anteriores ao travamento estavam em disco sem commit. `approved-pages.css/js` e HTML integram as páginas. Mídias finais WebP e fonte da banda presentes. Bloqueio casual de menu/arraste nas mídias ativo; proteção real de hotlink ainda não ativada — ver `HOTLINK-PROTECTION.md`.

## Verificação e publicação

Integridade local passou: 23 arquivos, 6 rotas, 2 faixas. Sintaxe JavaScript validada. Browser integrado recusou URL local com `net::ERR_BLOCKED_BY_CLIENT`; navegador local do Playwright ausente. Verificação renderizada encaminhada ao workflow já existente do GitHub: matriz de 54 casos, interação e screenshots. Os testes foram atualizados para rolagem natural e links de marca adicionais, sem perder verificação de overflow/tamanho dos controles.

Estado ao preparar este checkpoint: aguardando QA remoto, sem promover à produção. Não confundir aprovação do design com teste funcional concluído ou publicação. Atualizar este trecho após resultados.

## Retomada

Ler este arquivo; conferir head da branch e último workflow `responsive-qa-v3`. Resolver falhas reais e inspecionar capturas antes de publicar. Registrar commit e URL após publicação. Cloudflare depende de acesso administrativo; configuração preparada não significa proteção ativa.
