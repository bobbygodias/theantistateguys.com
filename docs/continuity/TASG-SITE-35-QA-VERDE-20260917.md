# TASG SITE — QA VERDE APÓS RECUPERAÇÃO DO WORK

**Data:** 2026-09-17  
**Branch técnica:** `canon-20260916`  
**Commit funcional validado:** `3148b603a3e5001850f0cd409198fcb8609c7963`  
**Workflow:** `responsive-qa-v3` — run `35167728829` (#75)

## Contexto

O Work esgotou a cota logo depois da implementação canônica e da primeira execução da matriz responsiva. O pacote principal havia sido salvo no commit `8dfb1e3b0dffc9864c0ceff28a4b0c13d928b837`.

A primeira execução completa do workflow encontrou 3 falhas na rota `integrantes`, nas geometrias 300×960, 390×844 e 640×360. Em todos os três casos, o teste marcou `clip-x-6` para exatamente as seis imagens dos integrantes.

A inspeção dos screenshots e do CSS confirmou que as fotos são propositalmente ampliadas dentro de `.member-photo`, cujo contêiner usa `overflow: hidden` para realizar o enquadramento aprovado. Não havia overflow horizontal da página. O QA estava tratando esse recorte artístico intencional como falha de layout.

Foi corrigido somente o teste responsivo para não classificar como clipping inválido imagens deliberadamente recortadas dentro de um contêiner de mídia com overflow controlado. Nenhuma alteração visual foi feita nesta correção.

## Resultado do run verde

Run `35167728829`, commit `3148b603a3e5001850f0cd409198fcb8609c7963`:

- `Run local integrity QA` — PASS
- `Run responsive matrix` — PASS
- `Run interaction and focus QA` — PASS
- `Check canonical content and real playback` — PASS
- `Measure loading and route cost` — PASS
- `Capture representative visual samples` — PASS
- `Upload QA artifacts` — PASS

### Matriz responsiva

- 9 geometrias
- 6 rotas por geometria
- 54 casos
- 0 falhas
- alvos de toque mínimos preservados
- sem overflow horizontal detectado

Geometrias verificadas:

- 300×960
- 390×844
- 640×360
- 800×800
- 768×1024
- 1280×664
- 1366×768
- 1920×1080
- 2560×1080

### Interação

PASS nas geometrias:

- 300×960
- 640×360
- 390×844
- 1280×664

### Integridade

- 55 arquivos locais verificados
- 6 rotas
- 2 faixas catalogadas
- resultado: PASS

### Contrato canônico e mídia

Resultado: PASS.

Verificações incluídas:

- somente o slogan oficial
- ausência da placa provisória antiga
- sequência do CD e Eject
- feed oficial de vídeo
- história com ano 2024
- seis integrantes reais e suas biografias
- validação de contato e e-mail oficial

Nesta execução, a mídia externa avançou de fato durante o teste: `currentTime > 0`, duração detectada de aproximadamente 363,64 s, `paused: false` e sem erro de mídia. Isso supera a limitação registrada no checkpoint anterior, em que o laboratório não havia conseguido confirmar reprodução real.

### Performance medida no laboratório

Home 390×844:

- aproximadamente 578 KB locais no carregamento inicial
- FCP ~140 ms
- LCP ~140 ms
- CLS 0

Home 1280×664:

- aproximadamente 516 KB locais no carregamento inicial
- FCP ~124 ms
- LCP ~124 ms
- CLS 0

A rota `integrantes` adiciona aproximadamente 2 MB devido às seis fotos reais. Isto é carregamento incremental da rota, não peso inicial da Home.

## Revisão visual pós-QA

Os snapshots do run verde foram comparados com as seis pranchas do ZIP canônico de 15/09/2026.

A implementação preserva a direção aprovada: mesmo beco, mesma família de placas, wordmark, boombox, composição e linguagem visual. As diferenças observadas são reorganizações responsivas necessárias para geometrias diferentes, não uma reinterpretação do conceito.

Nenhuma imagem nova foi gerada por IA nesta etapa.

## Estado da `main`

A `main` recebeu apenas o checkpoint de emergência `TASG-SITE-34-CHECKPOINT-20260917.md` no commit `63ba290a21e4442653071f24e47f2aaa96444734`.

A implementação canônica validada permanece isolada em `canon-20260916`. A `main` e a branch canônica estão divergentes por causa desse checkpoint documental; isso é esperado e deve ser conciliado somente no momento de integração final.

## Regra de integração

Não mover `main`, não publicar e não fazer merge sem alinhamento explícito com Bobby.

Próximo passo seguro: apresentar o estado validado, decidir conjuntamente a integração, preservar o checkpoint da `main`, então executar a integração final e verificar a URL pública depois do deploy.
