const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, "[]", "utf8");

app.get("/api/health", (_req, res) => res.json({ ok: true, loja: "Do Mineiro" }));

app.post("/api/orders", (req, res) => {
  const { customer, items, fulfillment, date, time, payment, address, notes, total } = req.body || {};
  if (!customer?.name || !customer?.phone || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: "Informe nome, telefone e pelo menos um produto." });
  }
  const order = {
    id: "DM-" + Date.now().toString(36).toUpperCase(),
    createdAt: new Date().toISOString(),
    status: "Recebido",
    customer, items, fulfillment, date, time, payment, address, notes,
    total: Number(total || 0)
  };
  try {
    const all = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    all.unshift(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(all, null, 2), "utf8");
    res.status(201).json({ ok: true, orderId: order.id, message: "Pedido registrado!" });
  } catch {
    res.status(500).json({ error: "Não foi possível registrar o pedido." });
  }
});

// Painel simples para consultar pedidos: /admin/pedidos
app.get("/admin/pedidos", (_req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    res.type("html").send(`<!doctype html><meta charset="utf-8"><title>Pedidos Do Mineiro</title>
    <style>body{font:16px system-ui;background:#f7f1e6;color:#392519;padding:24px}h1{color:#6d351d}
    article{background:white;padding:16px;margin:12px 0;border-radius:12px;box-shadow:0 2px 8px #0001}
    pre{white-space:pre-wrap;overflow-wrap:anywhere}</style><h1>Pedidos — Do Mineiro</h1>
    <p>Total: ${orders.length}</p>${orders.map(o=>`<article><h3>${o.id} · ${o.customer.name} · R$ ${o.total.toFixed(2).replace(".",",")}</h3><pre>${JSON.stringify(o,null,2)}</pre></article>`).join("")}`);
  } catch { res.status(500).send("Erro ao ler pedidos"); }
});

app.listen(PORT, () => console.log(`Do Mineiro disponível em http://localhost:${PORT}`));
