const products = [
 {id:"trad-6",name:"Tradicional (6 un.)",category:"Tradicionais",price:12.90,description:"Casquinha dourada, miolo macio e muito queijo.",tag:"Queridinho",image:"https://images.unsplash.com/photo-1601000938259-e4f4e9a9e4a7?auto=format&fit=crop&w=700&q=80"},
 {id:"trad-12",name:"Tradicional (12 un.)",category:"Tradicionais",price:23.90,description:"Uma dúzia de carinho pra dividir com a família.",tag:"Pra compartilhar",image:"https://images.unsplash.com/photo-1601000938259-e4f4e9a9e4a7?auto=format&fit=crop&w=700&q=80"},
 {id:"frango",name:"Frango com requeijão",category:"Recheados",price:18.90,description:"Recheio cremoso e temperinho especial.",tag:"Recheado",image:"https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=700&q=80"},
 {id:"quatro",name:"Quatro queijos",category:"Recheados",price:19.90,description:"Uma combinação cremosa pra quem ama queijo.",tag:"Especial",image:"https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80"},
 {id:"calabresa",name:"Calabresa com queijo",category:"Recheados",price:18.90,description:"Sabor marcante, queijo derretendo e massa leve.",tag:"Recheado",image:"https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=700&q=80"},
 {id:"mini",name:"Mini pão de queijo (25 un.)",category:"Tradicionais",price:29.90,description:"Pequenininho no tamanho, grandão no sabor.",tag:"Pra festa",image:"https://images.unsplash.com/photo-1601000938259-e4f4e9a9e4a7?auto=format&fit=crop&w=700&q=80"},
 {id:"kit",name:"Kit Mineirinho",category:"Kits",price:49.90,description:"24 tradicionais + 6 recheados à sua escolha.",tag:"Economize",image:"https://images.unsplash.com/photo-1601000938259-e4f4e9a9e4a7?auto=format&fit=crop&w=700&q=80"},
 {id:"kit-festa",name:"Kit Festa (50 un.)",category:"Kits",price:59.90,description:"Perfeito pra reunião, festa e café com amigos.",tag:"Pra turma",image:"https://images.unsplash.com/photo-1601000938259-e4f4e9a9e4a7?auto=format&fit=crop&w=700&q=80"}
];
// ⚠️ Valores, fotos e recheios são exemplos editáveis; ajuste antes de publicar.
const cart = new Map();
const $ = s => document.querySelector(s);
const money = n => n.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
let activeCategory="Todos";

function renderProducts(){
 const list=products.filter(p=>activeCategory==="Todos"||p.category===activeCategory);
 $("#products").innerHTML=list.map(p=>`<article class="product-card">
  <div class="product-img"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'"><span class="tag">${p.tag}</span></div>
  <div class="product-info"><h3>${p.name}</h3><p>${p.description}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-button" data-add="${p.id}" aria-label="Adicionar ${p.name}">+</button></div></div>
 </article>`).join("");
}
function totals(){let qty=0,total=0;cart.forEach((q,id)=>{qty+=q;total+=q*products.find(p=>p.id===id).price});return {qty,total}}
function renderCart(){
 const items=$("#cartItems"),{qty,total}=totals();
 $("#cartCount").textContent=qty;$("#cartTotal").textContent=money(total);$("#checkoutTotal").textContent=money(total);
 if(!qty){items.innerHTML='<div class="empty-cart">Sua sacolinha está vazia 🧺<br><small>Escolha uma delícia do cardápio!</small></div>';$("#checkoutItems").textContent="";return}
 items.innerHTML=[...cart.entries()].map(([id,q])=>{const p=products.find(x=>x.id===id);return `<div class="cart-line"><div><h4>${p.name}</h4><small>${money(p.price)} · ${money(p.price*q)}</small></div><div class="quantity"><button data-minus="${id}">−</button><b>${q}</b><button data-plus="${id}">+</button></div></div>`}).join("");
 $("#checkoutItems").textContent=[...cart.entries()].map(([id,q])=>`${q}× ${products.find(p=>p.id===id).name}`).join(" · ");
}
function add(id,n=1){cart.set(id,Math.max(0,(cart.get(id)||0)+n));if(cart.get(id)===0)cart.delete(id);renderCart()}
function openCart(){ $("#cartOverlay").hidden=false;$("#cartDrawer").classList.add("open");$("#cartDrawer").setAttribute("aria-hidden","false");document.body.style.overflow="hidden"}
function closeCart(){ $("#cartOverlay").hidden=true;$("#cartDrawer").classList.remove("open");$("#cartDrawer").setAttribute("aria-hidden","true");document.body.style.overflow=""}
$("#products").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b){add(b.dataset.add);b.textContent="✓";setTimeout(()=>b.textContent="+",700)}});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
$("#openCart").addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);$("#cartOverlay").addEventListener("click",closeCart);
$("#cartItems").addEventListener("click",e=>{const p=e.target.closest("[data-plus]"),m=e.target.closest("[data-minus]");if(p)add(p.dataset.plus);if(m)add(m.dataset.minus,-1)});
$("#checkoutButton").addEventListener("click",()=>{if(!cart.size){alert("Sua sacolinha está vazia!");return}closeCart();$("#checkoutFeedback").textContent="";$("#checkoutDialog").showModal();});
$("#closeCheckout").addEventListener("click",()=>$("#checkoutDialog").close());
$("#checkoutForm [name=date]").min=new Date(Date.now()-new Date().getTimezoneOffset()*60000).toISOString().slice(0,10);
$("#checkoutForm [name=fulfillment]").addEventListener("change",e=>{$(".address-field").style.display=e.target.value==="Entrega"?"flex":"none"});
$("#checkoutForm").addEventListener("submit",async e=>{
 e.preventDefault();const f=new FormData(e.target),{total}=totals();
 const payload={customer:{name:f.get("name"),phone:f.get("phone")},items:[...cart.entries()].map(([id,q])=>({productId:id,name:products.find(p=>p.id===id).name,quantity:q,unitPrice:products.find(p=>p.id===id).price})),fulfillment:f.get("fulfillment"),date:f.get("date"),time:f.get("time"),payment:f.get("payment"),address:f.get("address"),notes:f.get("notes"),total};
 const feedback=$("#checkoutFeedback");feedback.className="";feedback.textContent="Registrando pedido…";
 let orderId="DM-"+Date.now().toString().slice(-6);
 try{const r=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await r.json();if(r.ok)orderId=data.orderId;else throw new Error(data.error||"Falha no registro");}
 catch(err){feedback.textContent="Não foi possível registrar no servidor (modo demonstração). Vamos preparar o WhatsApp.";feedback.className="error";}
 const phone=(window.DO_MINEIRO_WHATSAPP||"").replace(/\D/g,""); // Configure o número no formato 55DDDNUMERO
 const text=`Olá, Do Mineiro! Quero confirmar meu pedido ${orderId}:\n\n${payload.items.map(i=>`${i.quantity}x ${i.name} — ${money(i.unitPrice*i.quantity)}`).join("\n")}\n\nTotal: ${money(total)}\nNome: ${payload.customer.name}\nTelefone: ${payload.customer.phone}\nRecebimento: ${payload.fulfillment}\nData: ${payload.date} às ${payload.time}\nPagamento: ${payload.payment}\n${payload.address?`Endereço: ${payload.address}\n`:""}${payload.notes?`Obs.: ${payload.notes}`:""}`;
 const url=phone?`https://wa.me/${phone}?text=${encodeURIComponent(text)}`:`https://wa.me/?text=${encodeURIComponent(text)}`;
 window.open(url,"_blank","noopener");
 feedback.className="";feedback.textContent=`Pedido ${orderId} preparado! Confira o WhatsApp e aguarde a confirmação da loja.`;
 cart.clear();renderCart();
});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();
