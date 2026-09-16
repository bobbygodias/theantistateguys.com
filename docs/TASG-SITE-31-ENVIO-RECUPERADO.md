# Retomada — envio recuperado — 16/09/2026

## Estado confirmado
- Branch ativa: `home-final-direction-v1`.
- Commit remoto: `0281b0e0d2729fa7c4c240cbcae0f7de3dffd04c`.
- Tree remoto: `26146fb92b52763f3f0cae97e38614b69b8cac68`, idêntico ao tree do checkpoint local `376ee0b`.
- Boombox fotográfica, máscara, fonte, referências PNG íntegras, CSS, HTML e testes recuperados e enviados. Os blobs da sessão interrompida já existiam no GitHub; foi possível concluir tree, commit e atualização sem repetir uploads.
- Checkout preservado: `/workspace/scratch/a4a8c47a6a66/site`.
- Anexos da nova sessão estão acessíveis em `/workspace/scratch/5a71fae2ccdf/project_sources/`.
- Integridade local: PASS, 26 arquivos, 6 rotas, 2 faixas.

## QA atual
Workflow `responsive-qa-v3`, execução `35057814928`:
https://github.com/bobbygodias/theantistateguys.com/actions/runs/35057814928

Em execução ao criar este registro. Conferir conclusão, logs e capturas antes de publicar. Não confundir sucesso do envio com sucesso do QA. Atenção à sobreposição entre biblioteca e transporte em 300px.

## Decisões vigentes
Referências e decisões de 15–16/09 em `docs/TASG-SITE-28-IMPLEMENTACAO-APROVADA.md` e `docs/TASG-SITE-29-RETOMADA-QA.md` prevalecem sobre os documentos históricos de 06/09 no Drive. Sem intro, sem expansão de fotos, zoom nativo preservado, rolagem natural, seis integrantes, boombox com CD/gaveta e controles funcionais. Sem slogans, símbolos ou datas inventados. Hotlink Cloudflare preparado, não ativado. Não promover à main antes de QA visual e funcional.

## Próximo passo
Conferir execução 35057814928; corrigir falhas, revisar capturas e então publicar conforme autorização já existente. Atualizar este registro com resultado real.

## Resultado e correção após primeiro QA
- Execução 35057814928: 54 casos responsivos passaram; interação e capturas pararam ao clicar no CD em 300px, porque `#play-pause` interceptava o toque.
- Captura inspecionada: `/tmp/tasg-71/visual/narrow-tall-home.png`; sobreposição confirmada.
- Correção enviada no commit `25bb93a14a56c3e71e3428d0f54065d1dd6b081c`: mecanismo do CD à frente dos botões e posições separadas para biblioteca/transporte/ejeção nos aparelhos de até 36rem.
- Novo tree: `5567b3702defe729e00a89130cafcf6d0ef71956`.
- Novo QA disparado; ainda não considerar a correção validada. Produção não alterada.
