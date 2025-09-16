// -------------------- TERMÉKEK --------------------
const products = [
  {
    name: "Oliver.quaso.png",
    price: 10,
    image: "https://cdn.discordapp.com/attachments/1272972982196899880/1417230071193669662/Untitled38_20250915212607.png?ex=68c9b9db&is=68c8685b&hm=6185e2770b20a6c09d24f5e6d57bbf431705482df747faa82473b4a09cbe0a98&"
  }
];

// -------------------- KUPONOK --------------------
const coupons = {
  "nemvagyokbuzi": { discount: 100 },

};
let appliedCoupon = JSON.parse(localStorage.getItem("appliedCoupon")) || null;

// -------------------- TERMÉKEK BETÖLTÉSE --------------------
const productList = document.getElementById("product-list");
products.forEach(product => {
  const div = document.createElement("div");
  div.className = "product";
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h2>${product.name}</h2>
    <p>${product.price} Ft</p>
    <button onclick="order('${product.name}')">Megrendelés</button>
  `;
  productList.appendChild(div);
});

// -------------------- TERMÉK KIVÁLASZTÁS --------------------
function order(productName) {
  document.getElementById("product").value = productName;
  updateTotal();
  document.getElementById("orderForm").scrollIntoView({ behavior: 'smooth' });
}

// -------------------- KUPON PANEL --------------------
document.getElementById("menu-toggle").addEventListener("click", () => {
  document.getElementById("coupon-panel").classList.toggle("active");
});

// -------------------- KUPON BEVÁLTÁS --------------------
document.getElementById("couponForm").addEventListener("submit", e => {
  e.preventDefault();
  const code = document.getElementById("coupon").value.trim().toUpperCase();
  const msg = document.getElementById("couponMessage");

  if (appliedCoupon) {
    msg.textContent = "Már beváltottál kupont!";
    msg.style.color = "orange";
    return;
  }

  if (coupons[code]) {
    appliedCoupon = coupons[code];
    localStorage.setItem("appliedCoupon", JSON.stringify(appliedCoupon));
    msg.textContent = `Kupon beváltva! (${appliedCoupon.discount}% kedvezmény)`;
    msg.style.color = "green";
    updateTotal();
  } else {
    msg.textContent = "Érvénytelen kupon!";
    msg.style.color = "red";
  }
});

// -------------------- THEME VÁLTÁS --------------------
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  toggleBtn.textContent = document.body.classList.contains("light") ? "☀️" : "🌙";
});

// -------------------- ÁR FRISSÍTÉSE --------------------
function updateTotal() {
  const productName = document.getElementById("product").value;
  if (!productName) {
    document.getElementById("totalPriceBox").innerHTML = "Fizetendő: <strong>0 Ft</strong>";
    document.getElementById("finalPrice").value = "";
    return;
  }

  let basePrice = products.find(p => p.name === productName).price;
  const method = document.getElementById("payment").value;

  if (method === "utanvet") basePrice += 10;

  if (appliedCoupon) {
    basePrice = basePrice - (basePrice * appliedCoupon.discount / 100);
  }

  document.getElementById("totalPriceBox").innerHTML = `Fizetendő: <strong>${basePrice} Ft</strong>`;
  document.getElementById("finalPrice").value = basePrice + " Ft";
  document.getElementById("couponUsed").value = appliedCoupon ? `${appliedCoupon.discount}% kedvezmény` : "Nincs";
}

document.getElementById("payment").addEventListener("change", updateTotal);

// -------------------- RENDELÉS KÜLDÉS --------------------
document.getElementById("orderForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  updateTotal(); // friss ár
  const form = this;
  const action = form.action;
  const formData = new FormData(form);

  try {
    const response = await fetch(action, {
      method: "POST",
      body: formData,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      document.getElementById("confirmation").style.display = "block";
      form.reset();

      // --- KUPON RESET ---
      localStorage.removeItem("appliedCoupon");
      appliedCoupon = null;
      updateTotal();
    } else {
      alert("❌ Hiba történt a rendelés során.");
    }
  } catch (err) {
    alert("⚠️ Hálózati hiba!");
    console.error(err);
  }
});

// -------------------- OLDAL BETÖLTÉSE --------------------
window.onload = updateTotal;
