# TASG SITE — CONTATO DIRETO VIA WEB3FORMS

**Data:** 17/09/2026  
**Projeto:** Bobby Dias & The Anti-State Guys — site oficial  
**Branch publicada:** `main`

## Alteração

O formulário da página **Contato** deixou de montar um link `mailto:` e de abrir o aplicativo de e-mail do visitante.

Agora o envio é feito diretamente no próprio site para a API do Web3Forms:

- endpoint: `https://api.web3forms.com/submit`;
- método: `POST`;
- dados enviados com `FormData`;
- chave de acesso Web3Forms configurada em `contact-final-v1.js`;
- validação HTML existente preservada;
- botão fica desabilitado durante o envio;
- status de envio aparece na própria página;
- formulário é limpo apenas depois de resposta bem-sucedida;
- em caso de falha, o visitante permanece na página e recebe mensagem para tentar novamente.

O link explícito `theantistateguys@gmail.com` em **CONTATOS** continua sendo um link de e-mail normal. Apenas o formulário deixou de depender do cliente de e-mail do visitante.

## QA

`tests/canon-contract.mjs` foi atualizado para interceptar `https://api.web3forms.com/submit` localmente, sem gerar e-mail real, e verificar:

1. formulário inicialmente inválido sem os campos obrigatórios;
2. endereço oficial da banda preservado;
3. texto indicando envio direto;
4. POST ao endpoint do Web3Forms;
5. mensagem de sucesso no próprio formulário;
6. permanência em `#contato`, sem navegação para cliente de e-mail.

## Commits desta correção

- `6cc81ec6336470012e632bd644dc94b60afc4e59` — envio direto via Web3Forms;
- `ed5c1a01feb569a01b1db3796b469b5e95c57479` — texto/status do envio direto;
- `c7568a9154fdf2db5816a81d7522c8d35c5af42a` — QA do formulário direto.

## Observação

A configuração usada segue o fluxo oficial do Web3Forms para formulários JavaScript/client-side. A validade operacional da chave e o endereço receptor associado a ela só são confirmados definitivamente por uma submissão real; não foi enviada mensagem de teste automática para evitar gerar e-mail não solicitado.
