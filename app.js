const products = [
  {id:1,name:"Vintage Memory Tee",price:999,cat:"T-Shirts",badge:"MEMORY EDIT",img:"assets/deck-image-4.jpg",desc:"A relaxed everyday tee designed as a canvas for the memories you want to keep close.",why:"Relaxed proportions and earthy tones make this a strong match for nostalgic, minimal wardrobes."},
  {id:2,name:"Second Story Hoodie",price:1899,cat:"Hoodies",badge:"REWORKED",img:"assets/deck-image-5.jpg",desc:"Soft heavyweight hoodie with a quiet archive feel and room for a personal memory mark.",why:"The deeper palette works with relaxed vintage styling and personal graphic details."},
  {id:3,name:"Memory Shirt",price:1499,cat:"Shirts",badge:"STILL YOURS",img:"assets/deck-image-3.jpg",desc:"An editorial overshirt silhouette inspired by pieces worth keeping.",why:"A versatile silhouette makes it easy to layer into a minimal wardrobe."},
  {id:4,name:"Archive Jacket",price:2799,cat:"Jackets",badge:"LIMITED",img:"assets/deck-image-1.jpg",desc:"A tactile outer layer with an old-photo, lived-in visual language.",why:"Structured texture balances nostalgic references with a contemporary streetwear shape."},
  {id:5,name:"Memory Tote",price:1299,cat:"Accessories",badge:"UPCYCLED",img:"assets/deck-image-4.jpg",desc:"A useful daily tote designed around the idea that a pocket can hold a whole story.",why:"Functional, understated and made to carry a personal detail."},
  {id:6,name:"Your Story Tee",price:1199,cat:"Custom Products",badge:"CUSTOM",img:"assets/deck-image-2.jpg",desc:"Upload a photo, add a line, date or initials and create your own edition.",why:"The clean base makes your personal visual the focus."},
  {id:7,name:"Reworked Patch Hoodie",price:2199,cat:"Reworked / Upcycled",badge:"ONE OF ONE",img:"assets/deck-image-6.jpg",desc:"Patch-led construction for garments that deserve a visible second chapter.",why:"Layered texture works with expressive, collected aesthetics."},
  {id:8,name:"Memory Collection Box",price:899,cat:"Memory Collection",badge:"STORY KIT",img:"assets/deck-image-5.jpg",desc:"A premium story kit for notes, dates and digital memory details.",why:"Designed to turn the emotional layer into part of the physical experience."}
];

let cart = JSON.parse(localStorage.getItem("stillYoursCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("stillYoursWishlist") || "[]");
let activeCat = "All";

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const money = n => "₹" + n.toLocaleString("en-IN");

function toast(msg){
  const t=$("#toast"); t.textContent=msg; t.classList.add("show");
  clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove("show"),2600);
}
function save(){localStorage.setItem("stillYoursCart",JSON.stringify(cart));localStorage.setItem("stillYoursWishlist",JSON.stringify(wishlist));updateCartCount();renderCart();}
function updateCartCount(){$("#cartCount").textContent=cart.reduce((a,x)=>a+x.qty,0)}
function scrollToSel(sel){$(sel)?.scrollIntoView({behavior:"smooth",block:"start"})}

$$("[data-scroll]").forEach(b=>b.addEventListener("click",()=>scrollToSel(b.dataset.scroll)));
$$(".nav a,.mobile-menu a,.footer-links a").forEach(a=>a.addEventListener("click",()=>$("#mobileMenu").classList.remove("open")));
$("#menuBtn").addEventListener("click",()=>$("#mobileMenu").classList.toggle("open"));
window.addEventListener("scroll",()=>$("#nav").classList.toggle("scrolled",scrollY>20));

function renderProducts(){
  const q=($("#productSearch")?.value||"").toLowerCase().trim();
  const list=products.filter(p=>(activeCat==="All"||p.cat===activeCat) && (!q || `${p.name} ${p.cat} ${p.badge}`.toLowerCase().includes(q)));
  $("#productGrid").innerHTML=list.map(p=>`
    <article class="product-card">
      <button class="wish ${wishlist.includes(p.id)?"active":""}" onclick="toggleWish(${p.id})">${wishlist.includes(p.id)?"♥":"♡"}</button>
      <span class="badge">${p.badge}</span>
      <div class="product-image" style="background-image:url('${p.img}')" onclick="openProduct(${p.id})"></div>
      <div class="product-info"><h3>${p.name}<span class="price">${money(p.price)}</span></h3><p>${p.cat}</p>
        <div class="product-actions"><button onclick="addToCart(${p.id})">ADD TO BAG</button><button onclick="openProduct(${p.id})">CUSTOMIZE</button></div>
      </div>
    </article>`).join("");
  $("#shopEmpty").style.display=list.length?"none":"block";
}
function toggleWish(id){
  wishlist=wishlist.includes(id)?wishlist.filter(x=>x!==id):[...wishlist,id]; save();
  toast(wishlist.includes(id)?"Saved to wishlist":"Removed from wishlist"); renderProducts();
}
function addToCart(id){
  const item=cart.find(x=>x.id===id); item?item.qty++:cart.push({id,qty:1}); save(); toast("Added to your bag");
}
window.toggleWish=toggleWish; window.addToCart=addToCart;
function openProduct(id){
  const p=products.find(x=>x.id===id);
  $("#productDetail").innerHTML=`<div class="product-detail-grid"><div class="detail-image" style="background-image:url('${p.img}')"></div><div class="detail-copy"><p class="eyebrow">${p.cat} / ${p.badge}</p><h2>${p.name}</h2><div class="detail-price">${money(p.price)}</div><div class="detail-tags"><span>STORY-LED</span><span>AI-READY</span><span>SECOND LIFE</span></div><p>${p.desc}</p><p><b>Why it fits:</b> ${p.why}</p><button class="primary-btn" onclick="addToCart(${p.id});closeModal('productModal')">ADD TO BAG →</button></div></div>`;
  $("#productModal").classList.add("open");
}
window.openProduct=openProduct;
function closeModal(id){$("#"+id).classList.remove("open")}
$$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));

function renderCart(){
  const box=$("#cartItems");
  if(!cart.length){box.innerHTML=`<div class="result-empty" style="padding:90px 0"><span>♡</span><h3>YOUR BAG IS QUIET.</h3><p>Add something worth keeping.</p></div>`;$("#cartTotal").textContent="₹0";return}
  let total=0;
  box.innerHTML=cart.map(item=>{
    const p=products.find(x=>x.id===item.id), sub=p.price*item.qty;total+=sub;
    return `<div class="cart-line"><img src="${p.img}" alt=""><div><h4>${p.name}</h4><p>${money(p.price)} × ${item.qty}</p><p style="margin-top:8px"><button class="remove" onclick="changeQty(${p.id},-1)">−</button> <b>${item.qty}</b> <button class="remove" onclick="changeQty(${p.id},1)">+</button></p></div><button class="remove" onclick="removeCart(${p.id})">REMOVE</button></div>`;
  }).join("");
  $("#cartTotal").textContent=money(total);
}
function changeQty(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save()}
function removeCart(id){cart=cart.filter(i=>i.id!==id);save()}
window.changeQty=changeQty;window.removeCart=removeCart;
$("#cartBtn").addEventListener("click",()=>{$("#cartDrawer").classList.add("open")});
$("#drawerBackdrop").addEventListener("click",()=>$("#cartDrawer").classList.remove("open"));
$("#checkoutBtn").addEventListener("click",()=>{if(!cart.length)return toast("Your bag is empty");toast("Checkout prototype ready — payment is not connected yet.")});
$("#clearFilters").addEventListener("click",()=>{activeCat="All";$("#productSearch").value="";$$(".categories button").forEach(b=>b.classList.toggle("active",b.dataset.cat==="All"));renderProducts()});
$$(".categories button").forEach(b=>b.addEventListener("click",()=>{activeCat=b.dataset.cat;$$(".categories button").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderProducts()}));
$("#productSearch").addEventListener("input",renderProducts);

const uploadPanel=$("#uploadPanel"), memoryInput=$("#memoryInput");
$("#chooseMemory").addEventListener("click",()=>memoryInput.click());
["dragenter","dragover"].forEach(ev=>uploadPanel.addEventListener(ev,e=>{e.preventDefault();uploadPanel.classList.add("drag")}));
["dragleave","drop"].forEach(ev=>uploadPanel.addEventListener(ev,e=>{e.preventDefault();uploadPanel.classList.remove("drag")}));
uploadPanel.addEventListener("drop",e=>{const f=e.dataTransfer.files[0];if(f)runAI(f)});
memoryInput.addEventListener("change",e=>e.target.files[0]&&runAI(e.target.files[0]));

function runAI(file){
  if(!file.type.startsWith("image/"))return toast("Please upload an image file.");
  const reader=new FileReader(); reader.onload=()=>{
    $("#uploadPreview").style.display="block";$("#uploadPreview").innerHTML=`<img src="${reader.result}" alt="Uploaded memory preview">`;
    $("#aiStatus").textContent="Preparing visual analysis…"; $("#aiResult").innerHTML=`<div class="result-empty"><span>✦</span><h3>ANALYSING YOUR IMAGE…</h3><p>Reading colours · understanding your aesthetic · finding your style</p></div>`;
    const stages=["Reading colours…","Understanding your aesthetic…","Finding your style…","Matching the Still Yours edit…"];
    stages.forEach((s,i)=>setTimeout(()=>$("#aiStatus").textContent=s,i*650));
    setTimeout(()=>showAIResult(),2900);
  }; reader.readAsDataURL(file);
}
function showAIResult(){
  const recs=products.slice(0,4);
  $("#aiStatus").textContent="Analysis complete.";
  $("#aiResult").innerHTML=`<div class="analysis"><div class="analysis-top"><div><small>YOUR STYLE</small><h3>VINTAGE + MINIMAL + RELAXED</h3></div><small>PROTOTYPE<br>VISION MODEL</small></div><p class="analysis-copy">Your image has earthy tones, relaxed silhouettes and a nostalgic aesthetic. These recommendations are a mock result designed to demonstrate the production flow; connect a vision API later for real image understanding.</p><div class="rec-grid">${recs.map((p,i)=>`<article class="rec-card"><div class="rec-image" style="background-image:url('${p.img}')"></div><h4>${p.name}</h4><div class="rec-meta"><span>${money(p.price)}</span><span class="match">${94-i*5}% STYLE MATCH</span></div><p>${p.why}</p><div class="rec-actions"><button onclick="openProduct(${p.id})">VIEW PRODUCT</button><button onclick="addToCart(${p.id})">CUSTOMIZE</button></div></article>`).join("")}</div></div>`;
}

$("#designInput").addEventListener("change",e=>{
  const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{const p=$("#designPrint");p.style.backgroundImage=`url(${r.result})`;p.style.backgroundSize="cover";p.style.padding="25px";p.style.minHeight="90px";p.style.backgroundPosition="center";p.dataset.uploaded="true"};r.readAsDataURL(f)
});
$$(".swatch").forEach(s=>s.addEventListener("click",()=>{const col=s.dataset.col;$$(".swatch").forEach(x=>x.classList.remove("active"));s.classList.add("active");$("#designPrint").style.color=col}));
$("#designText").addEventListener("input",e=>$("#printText").textContent=e.target.value||"YOUR STORY");
$("#designDate").addEventListener("input",e=>$("#printDate").textContent=e.target.value||"STILL YOURS");
$("#designFont").addEventListener("change",e=>$("#designPrint").style.fontFamily=e.target.value==="serif"?"var(--serif)":e.target.value==="mono"?"var(--mono)":"var(--sans)");
$("#generateDesign").addEventListener("click",()=>{
  const btn=$("#generateDesign");btn.disabled=true;btn.textContent="GENERATING YOUR DESIGN…";
  setTimeout(()=>{btn.disabled=false;btn.innerHTML="GENERATE WITH AI <span>✦</span>";toast("AI design generated — preview updated.");$("#designPrint").animate([{transform:"translate(-50%,-50%) scale(.8)",opacity:.2},{transform:"translate(-50%,-50%) scale(1)",opacity:.95}],{duration:600})},1800)
});
$$(".product-switcher button").forEach(b=>b.addEventListener("click",()=>{$$(".product-switcher button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#garment").className="garment "+b.dataset.product}));

$("#openMemory").addEventListener("click",()=>$("#memoryModal").classList.add("open"));
$("#playMemory").addEventListener("click",()=>toast("Voice memory demo triggered — audio storage is not connected in this prototype."));
$$(".read-story").forEach(b=>b.addEventListener("click",()=>{$("#storyTitle").textContent="STILL YOURS MEMORY";$("#storyBody").textContent=b.dataset.story;$("#storyModal").classList.add("open")}));
$("#shareStory").addEventListener("click",()=>$("#shareModal").classList.add("open"));
$("#shareForm").addEventListener("submit",e=>{e.preventDefault();closeModal("shareModal");toast("Story submitted to the prototype community wall.")});
$("#contactForm").addEventListener("submit",e=>{e.preventDefault();toast("Thanks — your enquiry is queued in this prototype.");e.target.reset()});
$("#newsletterForm").addEventListener("submit",e=>{e.preventDefault();toast("You're on the list — welcome to Still Yours.");e.target.reset()});

$("#searchBtn").addEventListener("click",()=>$("#searchModal").classList.add("open"));
$("#globalSearch").addEventListener("input",e=>{
  const q=e.target.value.toLowerCase().trim();
  const results=products.filter(p=>!q||`${p.name} ${p.cat} ${p.badge}`.toLowerCase().includes(q)).slice(0,6);
  $("#searchResults").innerHTML=results.map(p=>`<button class="search-result" onclick="openProduct(${p.id});closeModal('searchModal')"><strong>${p.name}</strong><span>${p.cat} · ${money(p.price)}</span></button>`).join("") || `<p class="fineprint" style="padding:25px 0">No matches. Try another word.</p>`;
});

const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add("visible")),{threshold:.08});
$$(".reveal").forEach(el=>observer.observe(el));
renderProducts();renderCart();updateCartCount();

window.closeModal=closeModal;
