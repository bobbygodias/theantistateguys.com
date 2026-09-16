# TASG — Home final — Checkpoint 02

Data: 2026-09-13/14
Branch: `home-final-direction-v1`

## Regra operacional — Work / Codex

- Andrew deve avisar Bobby quando realmente for uma boa ideia abrir ou começar um projeto/tarefa em Work, Codex ou modo equivalente.
- Motivo: o limite do Work/Codex pode se esgotar muito rápido; usar apenas quando o ganho técnico justificar o custo de contexto/uso.
- Para tarefas como este site, preferir continuar na sessão normal enquanto GitHub, QA e ajustes diretos forem suficientes.
- Para projetos de software mais pesados, builds complexos, emuladores, ambientes completos ou tarefas que realmente precisem de computador/navegador controlado, avaliar Work/Codex e avisar Bobby antes.
- Não mandar Bobby trocar de modo apenas por conveniência do assistente.

## Estado técnico da Home

- `main` continua intocada.
- Trabalho segue na branch `home-final-direction-v1`.
- Home mantém o beco, wordmark da banda, redes e aviso provisório.
- Boombox agora tem mecanismo de CD/gaveta.
- Estado inicial: gaveta aberta, CD visível, transporte desligado.
- Ao tocar/clicar no CD: estado `open -> closing -> ready`.
- Efeito real de fechamento está salvo em `assets/cd-drawer-close.mp3`.
- Em `ready`, Play/Pause, Stop, anterior, próxima e biblioteca são habilitados.
- Eject interrompe áudio, volta `ready -> opening -> open` e desabilita o transporte.
- Controles permanecem fisicamente dentro da boombox também em telas estreitas.
- Sistema de placas industriais foi refinado: metal gasto, rebites, vermelho apenas no ativo/destaque.

## QA

A matriz responsiva cobre 9 geometrias × 6 rotas = 54 casos.

No run 37, 53/54 casos passaram. A única falha foi Home em `640×360`, por pequeno overflow vertical causado pelo CD aberto ficando baixo demais.

Correção seguinte:
- subir o mecanismo do CD apenas em espaço muito baixo/largo;
- manter alvo de toque >= 44 px;
- preservar composição e não destacar controles para fora do aparelho.

O teste de interação também foi atualizado para respeitar o novo fluxo físico: primeiro inserir CD, esperar `ready`, depois testar biblioteca/transportes; por fim testar Eject e retorno ao estado aberto.

## Próximo passo

1. Validar o novo run completo de QA.
2. Se passar, revisar screenshots representativos da Home em vertical, wide-short e desktop.
3. Ajustar acabamento visual apenas onde necessário.
4. Não promover para `main` sem aprovação visual de Bobby.
