# Do Mineiro — loja digital

Protótipo funcional de loja de pão de queijo com:
- Catálogo com categorias e produtos de demonstração
- Carrinho com quantidades e total
- Formulário de encomenda/reserva (entrega ou retirada, data, horário, pagamento)
- Registro de pedidos em `data/orders.json` via Express
- Mensagem pronta para confirmação no WhatsApp
- Página de consulta interna em `/admin/pedidos`

## Rodar localmente
Requer Node.js 18+.

```bash
npm install
npm start
```
Abra http://localhost:3000

## Personalização antes de publicar
1. Em `public/app.js`, revise preços, nomes, descrições e fotos (são ilustrativos).
2. Configure o WhatsApp da loja no começo de `public/app.js` ou substitua `window.DO_MINEIRO_WHATSAPP` por número com DDI+DDD, ex. `5531999999999`.
   Exemplo para adicionar antes do código de `app.js` no HTML:
   `<script>window.DO_MINEIRO_WHATSAPP="5531999999999"</script>`
3. Atualize endereço, horários, taxa/área de entrega e política de cancelamento.
4. Troque imagens de demonstração por fotos próprias e use HTTPS.
5. Proteja `/admin/pedidos` com autenticação antes de publicar. O painel atual é apenas demonstração.
6. Em produção, use banco de dados persistente (SQLite/Postgres/Supabase) e autenticação, backups e validação de pagamentos. O JSON local pode não persistir em hospedagens efêmeras.

## Pagamento online
As opções Pix/cartão neste protótipo registram a preferência do cliente; não cobram automaticamente. Para cobrar online, integrar um gateway (ex.: Mercado Pago/Stripe) com backend, credenciais secretas e webhook.
