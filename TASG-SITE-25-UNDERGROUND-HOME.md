# TASG — Home Underground, 8 de setembro de 2026

## Objetivo
Restaurar a direção solicitada por Bobby: beco escuro, figura anônima quase em silhueta atrás da boombox, rádio funcional no canto da calçada e letreiro original. Remover a área reservada à introdução em vídeo.

## Implementação
- `index.html`: entrada sem placeholder de vídeo; controles HTML sobre boombox fotográfica independente; aviso vermelho de site provisório preservado.
- `assets/alley-underground-v4.webp`: cenário gerado para esta composição, sem textos ou símbolos ideológicos; figura à esquerda e ponto de fuga escuro.
- `assets/boombox-real-v4.webp`: rádio gerado com transparência; controle de áudio independente da imagem.
- `assets/wordmark-bobby-original.webp`: conversão lossless da arte original `Polish_20260830_202236872.png`. Não é fonte substituta; preserva o desenho personalizado enviado por Bobby.
- CSS recompõe a Home segundo largura e altura úteis. Rádio à esquerda e letreiro à direita em espaço largo; empilhamento em espaço estreito. Controles ganham uma barra maior quando a face física não comporta alvos de toque de 44 px.
- `script.js`: fechamento da biblioteca incorporado ao código principal; ícone e estado acessível de reprodução sincronizados. `qa-site-v3.js` removido da produção.
- Seis rotas e conteúdo preservados. Fotografias mantêm os créditos existentes. Faixas continuam no catálogo `data/music.json`.
- Workflow e testes passam a verificar `index.html` diretamente; a exigência de rádio vetorial foi substituída por verificação de imagem independente carregada. A antiga URL de laboratório redireciona à página atual.
- Vite serve apenas à prévia de desenvolvimento. A publicação continua estática no GitHub Pages.

## Verificação antes da publicação
- Integridade local: PASS, 20 arquivos, seis rotas, duas faixas; sintaxe de `script.js` válida.
- Navegador: Renascer reproduziu por mais de 33 segundos; pausa, parar (tempo zero), faixa anterior/próxima, seleção da segunda faixa e fechamento explícito da biblioteca confirmados.
- Home: 300×960, 320×568, 390×844, 640×360, 768×1024, 800×800, 844×390, 1280×664, 1920×1080 e 2560×1080 conferidos. Os dois excessos verticais encontrados em 320×568 e 1280×664 foram corrigidos e rechecados.
- Seis rotas navegadas em 390×844 e 1280×664, sem excesso horizontal nem imagens quebradas. História e integrantes permitem rolagem vertical do conteúdo.
- Inspeção visual de desktop, celular em pé e deitado; reprodução respeita o início por ação do visitante. Animação discreta dos falantes indica reprodução; não representa análise física do áudio.

## Continuidade
Base anterior: `3ebaa24c54ad6196c42b6170763e0ddeea5793ab`.
Conferir o commit que contém este documento e seus runs de Pages/QA para o estado publicado. Os registros anteriores de QA descrevem versões anteriores, não esta revisão.
