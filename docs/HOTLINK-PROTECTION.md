# Proteção de mídias — 15/09/2026

## Implementado no site

Fotos sem links para o arquivo, expansão, lightbox ou botões de download. Arraste e menu de contexto bloqueados nas mídias. Zoom nativo e seleção de texto continuam disponíveis. Isso dificulta salvamento casual, não impede capturas ou extração técnica.

## Cloudflare — configuração preparada, NÃO ativada

Não há acesso administrativo ao Cloudflare nesta sessão. GitHub Pages não executa `.htaccess`; adicionar esse arquivo não produziria proteção.

O Hotlink Protection padrão cobre GIF, ICO, JPG, JPEG e PNG, mas não WebP. Nossas fotos são WebP. Usar regra personalizada WAF com ação **Block**, somente se o domínio estiver passando pelo proxy Cloudflare. Expressão sugerida:

```text
(http.host in {"theantistateguys.com" "www.theantistateguys.com"}
 and starts_with(http.request.uri.path, "/assets/")
 and (ends_with(lower(http.request.uri.path), ".webp")
      or ends_with(lower(http.request.uri.path), ".png")
      or ends_with(lower(http.request.uri.path), ".jpg")
      or ends_with(lower(http.request.uri.path), ".jpeg")
      or ends_with(lower(http.request.uri.path), ".svg")
      or ends_with(lower(http.request.uri.path), ".mp3"))
 and http.request.uri.path ne "/assets/photos-pose-6.webp"
 and http.referer ne ""
 and not starts_with(http.referer, "https://theantistateguys.com/")
 and not starts_with(http.referer, "https://www.theantistateguys.com/"))
```

Preserva a imagem social `og:image` e referências vazias para não bloquear navegação direta/navegadores com restrições de referer. A exceção social deve acompanhar alterações futuras em `og:image`. Não permite domínios que apenas contenham nosso nome. Validar a expressão no painel antes de ativar, sem substituir regras preexistentes.

Aceite após ativar: mídia local com referer do site retorna 200; referer externo retorna 403; referência vazia continua 200; imagem social continua 200. Validar player, navegação mobile e galerias depois. Registrar estado real e data. Regra pode ser desativada individualmente para reversão.

Limites: arquivos públicos no GitHub e músicas hospedadas no MEGA S4 continuam acessíveis por suas origens. Esta regra não protege o MEGA nem impede downloads pelo visitante que já recebe a mídia.

Fontes oficiais consultadas: [Cloudflare Hotlink Protection](https://developers.cloudflare.com/waf/tools/scrape-shield/hotlink-protection/) e [Custom rules por referer](https://developers.cloudflare.com/waf/custom-rules/use-cases/exempt-partners-hotlink-protection/).
