// Base de datos - Local First
const defaultProducts = [
    { id: 1, name: "Enchiladas Suizas", price: 120.00, category: "Restaurante", emoji: "🥘", image: null, stock: Infinity },
    { id: 2, name: "Chilaquiles Verdes con Huevo", price: 110.00, category: "Restaurante", emoji: "🍳", image: null, stock: Infinity },
    { id: 3, name: "Café de Olla", price: 35.00, category: "Restaurante", emoji: "☕", image: null, stock: Infinity },
    { id: 4, name: "Pan Dulce (Concha)", price: 20.00, category: "Restaurante", emoji: "🥐", image: null, stock: Infinity },
    { id: 5, name: "Torta de Milanesa", price: 85.00, category: "Restaurante", emoji: "🥪", image: null, stock: Infinity },
    { id: 6, name: "Caldo de Camarón", price: 160.00, category: "Restaurante", emoji: "🍲", image: null, stock: Infinity },
    { id: 7, name: "Refresco Cola 600ml", price: 25.00, category: "Tienda", emoji: "🥤", image: null, stock: 15 },
    { id: 8, name: "Agua Mineral", price: 20.00, category: "Tienda", emoji: "🫧", image: null, stock: 12 },
    { id: 9, name: "Papas Fritas con Sal", price: 18.00, category: "Tienda", emoji: "🥔", image: null, stock: 8 },
    { id: 10, name: "Galletas Crema", price: 22.00, category: "Tienda", emoji: "🍪", image: null, stock: 10 },
    { id: 11, name: "Gomitas de Fruta", price: 15.00, category: "Tienda", emoji: "🍬", image: null, stock: 20 },
    { id: 12, name: "Helado de Limón", price: 30.00, category: "Tienda", emoji: "🍦", image: null, stock: 5 },
    { id: 13, name: "Cacahuates Japoneses", price: 15.00, category: "Tienda", emoji: "🥜", image: null, stock: 7 },
    { id: 14, name: "Botella de Agua 1L", price: 20.00, category: "Tienda", emoji: "💧", image: null, stock: 25 },
];

let products = JSON.parse(localStorage.getItem('pos_products'));
if (!products) { products = defaultProducts; localStorage.setItem('pos_products', JSON.stringify(products)); }

let salesData = JSON.parse(localStorage.getItem('pos_sales')) || { Restaurante: 0, Tienda: 0, Total: 0, Tickets: 0, Efectivo: 0, Tarjeta: 0, Propinas: 0 };
let users = JSON.parse(localStorage.getItem('pos_users')) || [
    { username: 'admin', password: '123', role: 'admin' },
    { username: 'caja', password: '123', role: 'pos' }
];

let currentUser = JSON.parse(sessionStorage.getItem('pos_current_user')) || null;
let cart = JSON.parse(localStorage.getItem('pos_temp_cart')) || [];
let currentFilter = "all";
let paymentMethod = "Efectivo";
let barcodeBuffer = "";
let barcodeTimer = null;

function saveDB() {
    localStorage.setItem('pos_products', JSON.stringify(products));
    localStorage.setItem('pos_sales', JSON.stringify(salesData));
    localStorage.setItem('pos_users', JSON.stringify(users));
    localStorage.setItem('pos_temp_cart', JSON.stringify(cart));
    if (currentUser) sessionStorage.setItem('pos_current_user', JSON.stringify(currentUser));
}

// Elementos Auth
const loginScreen = document.getElementById("loginScreen");
const appMain = document.getElementById("appMain");
const loginForm = document.getElementById("loginForm");
const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");
const loginError = document.getElementById("loginError");
const navAdminBtn = document.getElementById("navAdminBtn");
const navLogoutBtn = document.getElementById("navLogoutBtn");
const currentUserLabel = document.getElementById("currentUserLabel");

// Elementos Admin
const adminModal = document.getElementById("adminModal");
const closeAdminBtn = document.getElementById("closeAdminBtn");
const usersList = document.getElementById("usersList");
const createUserForm = document.getElementById("createUserForm");
const adminTabs = document.querySelectorAll(".admin-tab");
const adminTabContents = document.querySelectorAll(".admin-tab-content");
const adminProductsList = document.getElementById("adminProductsList");
const createProductForm = document.getElementById("createProductForm");
const toastContainer = document.getElementById("toastContainer");

// Elementos del DOM POS
const productsGrid = document.getElementById("productsGrid");
const categoryFilters = document.getElementById("categoryFilters");
const searchInput = document.getElementById("searchInput");
const cartItemsContainer = document.getElementById("cartItems");
const subtotalAmount = document.getElementById("subtotalAmount");
const totalAmount = document.getElementById("totalAmount");
const kitchenAmount = document.getElementById("kitchenAmount");
const storeAmount = document.getElementById("storeAmount");
const checkoutBtn = document.getElementById("checkoutBtn");
const clearCartBtn = document.getElementById("clearCartBtn");

const ticketModal = document.getElementById("ticketModal");
const corteModal = document.getElementById("corteModal");
const paymentModal = document.getElementById("paymentModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const modalTotal = document.getElementById("modalTotal");
const btnEfectivo = document.getElementById("btnEfectivo");
const btnTarjeta = document.getElementById("btnTarjeta");
const cashInputGroup = document.getElementById("cashInputGroup");
const tipAmount = document.getElementById("tipAmount");
const cashReceived = document.getElementById("cashReceived");
const modalChange = document.getElementById("modalChange");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");

const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

// Inicialización
function init() {
    setupAuthListeners();
    setupEventListeners();
    updateOnlineStatus();

    // Restaurar sesión si existe
    if (currentUser) {
        startAppSession();
    }
}

function setupAuthListeners() {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const u = loginUsername.value.trim();
        const p = loginPassword.value.trim();

        const userFound = users.find(usr => usr.username === u && usr.password === p);
        if (userFound) {
            loginError.classList.add("hidden");
            currentUser = userFound;
            startAppSession();
        } else {
            loginError.classList.remove("hidden");
        }
    });

    navLogoutBtn.addEventListener("click", () => {
        currentUser = null;
        cart = [];
        sessionStorage.removeItem('pos_current_user');
        localStorage.removeItem('pos_temp_cart');
        updateCart();
        appMain.classList.add("hidden");
        loginScreen.classList.remove("hidden");
        loginUsername.value = "";
        loginPassword.value = "";
    });
}

function startAppSession() {
    loginScreen.classList.add("hidden");
    appMain.classList.remove("hidden");

    currentUserLabel.textContent = `${currentUser.username} (${currentUser.role})`;

    if (currentUser.role === 'admin') {
        navAdminBtn.classList.remove("hidden");
    } else {
        navAdminBtn.classList.add("hidden");
    }

    renderProducts();
    updateCart();
    saveDB();
}

function setupEventListeners() {
    // Admin Panel
    navAdminBtn.addEventListener("click", () => {
        adminModal.classList.remove("hidden");
        renderAdminUsers();
        renderAdminProducts();
    });

    adminTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            adminTabs.forEach(t => t.classList.remove("active"));
            adminTabContents.forEach(c => c.classList.remove("active"));
            tab.classList.add("active");
            document.getElementById(tab.dataset.tab).classList.add("active");
        });
    });
    closeAdminBtn.addEventListener("click", () => adminModal.classList.add("hidden"));

    createUserForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nu = document.getElementById("newUsername").value.trim();
        const np = document.getElementById("newPassword").value.trim();
        const nr = document.getElementById("newRole").value;
        if (users.find(u => u.username === nu)) { showToast("Usuario ya existe", "error"); return; }
        users.push({ username: nu, password: np, role: nr });
        showToast("Usuario creado", "success");
        saveDB();
        document.getElementById("newUsername").value = "";
        document.getElementById("newPassword").value = "";
        renderAdminUsers();
    });

    createProductForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("newProdName").value.trim();
        const price = parseFloat(document.getElementById("newProdPrice").value);
        const category = document.getElementById("newProdCategory").value;
        const barcode = document.getElementById("newProdBarcode").value.trim();
        const stockInput = document.getElementById("newProdStock").value;
        const stock = stockInput === "" ? Infinity : parseInt(stockInput);
        const emoji = document.getElementById("newProdEmoji").value || "🥘";

        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, price, category, stock, emoji, barcode, image: null });
        saveDB();

        document.getElementById("newProdName").value = "";
        document.getElementById("newProdPrice").value = "";
        document.getElementById("newProdBarcode").value = "";
        document.getElementById("newProdStock").value = "";
        document.getElementById("newProdEmoji").value = "";
        renderAdminProducts();
        renderProducts();
        showToast("Producto añadido", "success");
    });

    // POS Filters
    categoryFilters.addEventListener("click", (e) => {
        const btn = e.target.closest(".filter-btn");
        if (!btn) return;
        document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.category;
        renderProducts();
    });

    searchInput.addEventListener("input", renderProducts);

    // Cart
    clearCartBtn.addEventListener("click", () => {
        if (confirm("¿Estás seguro de vaciar la orden actual?")) {
            cart = [];
            updateCart();
        }
    });
    checkoutBtn.addEventListener("click", () => { if (cart.length > 0) openPaymentModal(); });

    // Modals
    closeModalBtn.addEventListener("click", closePaymentModal);
    cashReceived.addEventListener("input", calculateChange);
    confirmPaymentBtn.addEventListener("click", processPayment);
    document.getElementById("closeTicketBtn").addEventListener("click", () => ticketModal.classList.add("hidden"));
    document.getElementById("finishTicketBtn").addEventListener("click", () => {
        window.print();
        ticketModal.classList.add("hidden");
    });
    document.getElementById("navCorteBtn").addEventListener("click", showCorte);
    document.getElementById("closeCorteBtn").addEventListener("click", () => corteModal.classList.add("hidden"));

    document.getElementById("closeShiftBtn").addEventListener("click", () => {
        if (confirm("¿Estás seguro de CERRAR EL TURNO? Esto pondrá las ventas actuales en $0.00 y no se puede deshacer.")) {
            salesData = { Restaurante: 0, Tienda: 0, Total: 0, Tickets: 0, Efectivo: 0, Tarjeta: 0, Propinas: 0 };
            saveDB();
            corteModal.classList.add("hidden");
            showToast("Turno cerrado y ventas reiniciadas", "success");
        }
    });

    btnEfectivo.addEventListener("click", () => setPaymentMethod("Efectivo"));
    btnTarjeta.addEventListener("click", () => setPaymentMethod("Tarjeta"));
    tipAmount.addEventListener("input", calculateChange);
    exportCsvBtn.addEventListener("click", exportCorteCSV);

    window.addEventListener("keydown", handleBarcodeScanner);

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
}

function updateOnlineStatus() {
    const statusIcon = document.getElementById("onlineStatusIcon");
    const statusText = document.getElementById("onlineStatusText");
    if (!statusIcon) return;

    if (navigator.onLine) {
        statusIcon.style.color = "#10b981";
        statusText.textContent = "Conectado";
        // Intentar cargar logo si falló antes
        document.querySelectorAll('img').forEach(img => {
            if (img.src.includes('otrorollo.mx') && !img.complete) img.src = img.src;
        });
    } else {
        statusIcon.style.color = "#ef4444";
        statusText.textContent = "Modo Local (Offline)";
        showToast("Sin conexión. Trabajando en modo local.", "warning");
    }
}

window.deleteUser = function (username) {
    if (username === currentUser.username) { showToast("No puedes borrar tu usuario actual", "error"); return; }
    if (confirm(`¿Borrar a ${username}?`)) {
        users = users.filter(u => u.username !== username);
        saveDB();
        renderAdminUsers();
        showToast("Usuario eliminado", "warning");
    }
}

window.deleteProduct = function (id) {
    if (confirm(`¿Borrar el producto?`)) {
        products = products.filter(p => p.id !== id);
        cart = cart.filter(c => c.id !== id);
        updateCart();
        saveDB();
        renderAdminProducts();
        renderProducts();
        showToast("Producto eliminado", "warning");
    }
}

function showToast(msg, type = "success") {
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    let icon = "ph-check-circle";
    if (type === "error") icon = "ph-x-circle";
    if (type === "warning") icon = "ph-warning-circle";

    toast.innerHTML = `<i class="ph ${icon}"></i> <span>${msg}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = "fadeOut 0.3s forwards";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function renderAdminUsers() {
    usersList.innerHTML = users.map(u => `
        <div class="admin-user-row" style="background:var(--bg-main); border:none; padding:16px;">
            <div style="display:flex; align-items:center; gap:12px;">
                <img src="https://ui-avatars.com/api/?name=${u.username}&background=0345BF&color=fff" style="width:32px; height:32px; border-radius:50%;">
                <div>
                    <strong style="display:block; font-size:14px;">${u.username}</strong>
                    <span class="role-badge ${u.role}" style="font-size:10px;">${u.role}</span>
                </div>
            </div>
            <button class="del-user-btn" onclick="deleteUser('${u.username}')" style="background:#fee2e2; color:#ef4444; border:none; width:32px; height:32px; border-radius:8px; cursor:pointer;"><i class="ph ph-trash"></i></button>
        </div>
    `).join("");
}

function renderAdminProducts() {
    adminProductsList.innerHTML = products.map(p => `
        <div class="admin-product-row" style="background:var(--bg-main); border:none; padding:12px; margin-bottom:12px;">
            <div class="p-info">
                <span style="font-size: 24px;">${p.emoji}</span>
                <div>
                    <div style="font-weight:700;">${p.name} <span class="category-badge badge-${p.category}" style="position:static; margin-left:8px; display:inline-block; font-size:9px; vertical-align:middle;">${p.category}</span></div>
                    <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">
                        <i class="ph ph-barcode"></i> ${p.barcode || 'Sin código'} | 
                        <i class="ph ph-package"></i> Stock: ${p.stock === Infinity ? '∞' : p.stock}
                    </div>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap: 16px;">
                <span class="p-price" style="font-weight:800; color:var(--brand-green);">${formatter.format(p.price)}</span>
                <button class="del-user-btn" onclick="deleteProduct(${p.id})" style="background:#fee2e2; color:#ef4444; border:none; width:32px; height:32px; border-radius:8px; cursor:pointer;"><i class="ph ph-trash"></i></button>
            </div>
        </div>
    `).join("");
}

function getFilteredProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    return products.filter(p => {
        const matchCategory = currentFilter === "all" || p.category === currentFilter;
        const matchSearch = p.name.toLowerCase().includes(searchTerm);
        return matchCategory && matchSearch;
    });
}

function renderProducts() {
    productsGrid.innerHTML = "";
    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
        productsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);"><i class="ph ph-magnifying-glass" style="font-size: 48px; margin-bottom: 16px;"></i><p>No se encontraron productos.</p></div>`;
        return;
    }

    filtered.forEach((p, index) => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.style.setProperty('--n', index);
        const stockInfo = p.stock === Infinity || p.stock === null ? '' : `<div class="stock-badge ${p.stock <= 3 ? 'low-stock' : ''}">Stock: ${p.stock}</div>`;

        card.innerHTML = `
            <span class="category-badge badge-${p.category}">${p.category}</span>
            <div class="image-container">
                ${p.image ? `<img src="${p.image}" alt="${p.name}">` : `<span class="emoji-placeholder">${p.emoji}</span>`}
            </div>
            <h3>${p.name}</h3>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: auto;">
                <p class="price" style="margin-top:0;">${formatter.format(p.price)}</p>
                ${stockInfo}
            </div>
        `;

        if (p.stock === 0) {
            card.classList.add("out-of-stock");
            card.innerHTML += `<div class="sold-out-overlay">Agotado</div>`;
        } else {
            card.addEventListener("click", () => addToCart(p));
        }

        productsGrid.appendChild(card);
    });
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    const currentQty = existing ? existing.qty : 0;

    if (product.stock !== Infinity && currentQty + 1 > product.stock) {
        showToast(`Stock insuficiente. Solo quedan ${product.stock} de ${product.name}.`, "error");
        return;
    }

    if (existing) existing.qty += 1;
    else cart.push({ ...product, qty: 1 });
    updateCart();
    saveDB();
}

function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    const product = products.find(p => p.id === id);
    const newQty = item.qty + delta;

    if (product.stock !== Infinity && newQty > product.stock) {
        showToast(`Stock insuficiente. Solo quedan ${product.stock}.`, "error");
        return;
    }

    item.qty += delta;
    if (item.qty <= 0) cart = cart.filter(i => i.id !== id);

    updateCart();
    saveDB();
}
window.updateQuantity = updateQuantity;

function updateCart() {
    cartItemsContainer.innerHTML = "";
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<div class="empty-cart-msg">El carrito está vacío,<br>agrega productos para comenzar.</div>`;
        checkoutBtn.disabled = true;
        subtotalAmount.textContent = "$0.00"; totalAmount.textContent = "$0.00"; kitchenAmount.textContent = "$0.00"; storeAmount.textContent = "$0.00";
        return;
    }

    checkoutBtn.disabled = false;
    let totalObj = { Restaurante: 0, Tienda: 0 };

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalObj[item.category] += itemTotal;
        const el = document.createElement("div");
        el.className = `cart-item`;
        el.innerHTML = `
            <div class="item-visual">${item.image ? `<img src="${item.image}">` : `<span>${item.emoji}</span>`}</div>
            <div class="item-details">
                <h4>${item.name}</h4>
                <div class="price">${formatter.format(item.price)}</div>
            </div>
            <div class="item-actions">
                <button onclick="updateQuantity(${item.id}, -1)"><i class="ph ph-minus"></i></button>
                <span>${item.qty}</span>
                <button onclick="updateQuantity(${item.id}, 1)"><i class="ph ph-plus"></i></button>
            </div>
        `;
        cartItemsContainer.appendChild(el);
    });

    const grandTotal = totalObj.Restaurante + totalObj.Tienda;
    subtotalAmount.textContent = formatter.format(grandTotal);
    totalAmount.textContent = formatter.format(grandTotal);
    kitchenAmount.textContent = formatter.format(totalObj.Restaurante);
    storeAmount.textContent = formatter.format(totalObj.Tienda);
}

let currentTotal = 0;

function setPaymentMethod(method) {
    paymentMethod = method;
    if (method === "Efectivo") {
        btnEfectivo.classList.add("active");
        btnTarjeta.classList.remove("active");
        cashInputGroup.style.display = "block";
    } else {
        btnTarjeta.classList.add("active");
        btnEfectivo.classList.remove("active");
        cashInputGroup.style.display = "none";
    }
    calculateChange();
}

function openPaymentModal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    currentTotal = total;
    modalTotal.textContent = formatter.format(total);
    cashReceived.value = "";
    tipAmount.value = "";
    setPaymentMethod("Efectivo");
    modalChange.textContent = "$0.00";
    modalChange.style.color = "var(--text-secondary)";
    confirmPaymentBtn.disabled = true;
    paymentModal.classList.remove("hidden");
    setTimeout(() => cashReceived.focus(), 100);
}

function closePaymentModal() { paymentModal.classList.add("hidden"); }

function calculateChange() {
    const cash = parseFloat(cashReceived.value) || 0;
    const tip = parseFloat(tipAmount.value) || 0;
    const finalTotal = currentTotal + tip;
    modalTotal.textContent = formatter.format(finalTotal) + (tip > 0 ? " (Inc. propina)" : "");

    if (paymentMethod === "Efectivo") {
        if (cash >= finalTotal) {
            modalChange.textContent = formatter.format(cash - finalTotal);
            modalChange.style.color = "#10b981";
            confirmPaymentBtn.disabled = false;
        } else {
            modalChange.textContent = "Monto insuficiente";
            modalChange.style.color = "#ef4444";
            confirmPaymentBtn.disabled = true;
        }
    } else {
        modalChange.textContent = "-";
        modalChange.style.color = "var(--text-secondary)";
        confirmPaymentBtn.disabled = false;
    }
}

function processPayment() {
    const tip = parseFloat(tipAmount.value) || 0;
    const finalTotal = currentTotal + tip;
    const cash = paymentMethod === "Efectivo" ? (parseFloat(cashReceived.value) || 0) : finalTotal;
    const change = paymentMethod === "Efectivo" ? (cash - finalTotal) : 0;

    const kitchenItems = cart.filter(i => i.category === "Restaurante");
    const storeItems = cart.filter(i => i.category === "Tienda");

    let kitchenTotal = kitchenItems.reduce((s, i) => s + (i.price * i.qty), 0);
    let storeTotal = storeItems.reduce((s, i) => s + (i.price * i.qty), 0);

    // Restar de inventario
    cart.forEach(item => {
        const prod = products.find(p => p.id === item.id);
        if (prod && prod.stock !== Infinity) prod.stock -= item.qty;
    });

    salesData.Restaurante += kitchenTotal;
    salesData.Tienda += storeTotal;
    salesData.Total += currentTotal;
    salesData.Propinas += tip;
    if (paymentMethod === "Efectivo") salesData.Efectivo += finalTotal;
    else salesData.Tarjeta += finalTotal;
    salesData.Tickets += 1;

    saveDB(); // Guardamos local-first
    generateTicket(kitchenItems, storeItems, kitchenTotal, storeTotal, currentTotal, tip, finalTotal, cash, change, paymentMethod);

    cart = [];
    localStorage.removeItem('pos_temp_cart');
    updateCart();
    renderProducts();
    closePaymentModal();
    ticketModal.classList.remove("hidden");
}

function generateTicket(kitchenItems, storeItems, kTotal, sTotal, total, tip, finalTotal, cash, change, method) {
    let html = `<div class="ticket-wrapper" style="padding:40px 20px; text-align:center;">
        <img src="logo.png" style="max-width: 140px; display:block; margin: 0 auto 20px auto; filter: grayscale(100%);">
        <h2 style="font-size:20px; font-weight:900; margin-bottom:4px; text-transform:uppercase;">El Otro Rollo</h2>
        <p style="font-size:12px; color:#666; margin-bottom:20px;">Parque Acuático Aventura</p>
        <div style="border-top:1px dashed #ccc; border-bottom:1px dashed #ccc; padding:10px 0; margin-bottom:20px; font-size:12px;">
            <p>Ticket: <strong>#${String(salesData.Tickets).padStart(4, '0')}</strong></p>
            <p>Fecha: ${new Date().toLocaleString()}</p>
            <p>Atendido por: ${currentUser.username}</p>
        </div>`;

    if (kitchenItems.length > 0) {
        html += `<div style="text-align:left; margin-bottom:16px;">
            <p style="font-weight:900; font-size:11px; margin-bottom:8px; border-left:3px solid var(--kitchen-color); padding-left:8px;">[ÁREA COCINA]</p>`;
        kitchenItems.forEach(i => html += `<div class="t-line" style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;"><span>${i.qty}x ${i.name}</span><span>${formatter.format(i.price * i.qty)}</span></div>`);
        html += `</div>`;
    }

    if (storeItems.length > 0) {
        html += `<div style="text-align:left; margin-bottom:16px;">
            <p style="font-weight:900; font-size:11px; margin-bottom:8px; border-left:3px solid var(--brand-green); padding-left:8px;">[ÁREA TIENDA]</p>`;
        storeItems.forEach(i => html += `<div class="t-line" style="display:flex; justify-content:space-between; font-size:13px; margin-bottom:4px;"><span>${i.qty}x ${i.name}</span><span>${formatter.format(i.price * i.qty)}</span></div>`);
        html += `</div>`;
    }

    html += `<div style="border-top:2px solid #000; padding-top:12px; margin-top:12px;">
        <div style="display:flex; justify-content:space-between; font-weight:700;"><span>SUBTOTAL:</span><span>${formatter.format(total)}</span></div>`;
    if (tip > 0) {
        html += `<div style="display:flex; justify-content:space-between; color:#666;"><span>PROPINA:</span><span>${formatter.format(tip)}</span></div>`;
    }
    html += `<div style="display:flex; justify-content:space-between; font-size:20px; font-weight:900; margin-top:8px;"><span>TOTAL:</span><span>${formatter.format(finalTotal)}</span></div>
    </div>`;

    html += `<div style="margin-top:20px; font-size:12px; color:#666; font-style:italic;">
        <p>Método de pago: ${method}</p>
        ${method === "Efectivo" ? `<p>Pago con: ${formatter.format(cash)}</p><p>Cambio: ${formatter.format(change)}</p>` : ""}
        <p style="margin-top:20px;">¡Gracias por visitarnos!</p>
        <p>www.otrorollo.mx</p>
    </div></div>`;
    document.getElementById("ticketBody").innerHTML = html;
}

function showCorte() {
    corteModal.classList.remove("hidden");
    document.getElementById("corteBody").innerHTML = `
        <div class="corte-wrapper" style="display:grid; grid-template-columns: repeat(2, 1fr); gap:16px;">
            <div class="corte-card kitchen" style="grid-column: span 1;">
                <i class="ph-fill ph-cooking-pot"></i> 
                <div><h3 style="font-size:12px; text-transform:uppercase;">Cocina</h3><p style="font-size:24px;">${formatter.format(salesData.Restaurante)}</p></div>
            </div>
            <div class="corte-card store" style="grid-column: span 1;">
                <i class="ph-fill ph-shopping-basket"></i>
                <div><h3 style="font-size:12px; text-transform:uppercase;">Tienda</h3><p style="font-size:24px;">${formatter.format(salesData.Tienda)}</p></div>
            </div>
            <div class="corte-card" style="background:#f1f5f9; border-left:4px solid #64748b;">
                <i class="ph-fill ph-money" style="color:#10b981;"></i>
                <div><h3 style="font-size:12px; text-transform:uppercase;">Efectivo</h3><p style="font-size:20px;">${formatter.format(salesData.Efectivo || 0)}</p></div>
            </div>
            <div class="corte-card" style="background:#f1f5f9; border-left:4px solid #64748b;">
                <i class="ph-fill ph-credit-card" style="color:#3b82f6;"></i>
                <div><h3 style="font-size:12px; text-transform:uppercase;">Tarjeta</h3><p style="font-size:20px;">${formatter.format(salesData.Tarjeta || 0)}</p></div>
            </div>
            <div class="corte-card total" style="grid-column: span 2; background:var(--brand-blue); color:white; border:none; padding:32px;">
                <div style="width:100%;">
                    <h3 style="color:rgba(255,255,255,0.8); text-transform:uppercase;">Ventas Totales Netas</h3>
                    <p style="font-size:42px;">${formatter.format(salesData.Total)}</p>
                    <div style="display:flex; justify-content:space-between; margin-top:16px; font-size:14px; color:rgba(255,255,255,0.7);">
                        <span>${salesData.Tickets} Transacciones</span>
                        <span>Propinas: ${formatter.format(salesData.Propinas || 0)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function exportCorteCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Concepto,Monto\n";
    csvContent += `Ventas Restaurante,${salesData.Restaurante}\n`;
    csvContent += `Ventas Tienda,${salesData.Tienda}\n`;
    csvContent += `Ingresos Efectivo (Inc propina),${salesData.Efectivo || 0}\n`;
    csvContent += `Ingresos Tarjeta (Inc propina),${salesData.Tarjeta || 0}\n`;
    csvContent += `Total Propinas Recolectadas,${salesData.Propinas || 0}\n`;
    csvContent += `Total Ingresos (Sin propinas),${salesData.Total}\n`;
    csvContent += `Total Tickets Emitidos,${salesData.Tickets}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const date = new Date().toISOString().split("T")[0];
    link.setAttribute("download", `corte_caja_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function handleBarcodeScanner(e) {
    if (document.activeElement && document.activeElement.tagName === "INPUT") return;
    if (!paymentModal.classList.contains("hidden") || !adminModal.classList.contains("hidden") || !corteModal.classList.contains("hidden")) return;

    if (e.key === "Enter") {
        if (barcodeBuffer.length > 2) {
            const prod = products.find(p => p.barcode === barcodeBuffer);
            if (prod) {
                addToCart(prod);
                showToast(`[Escaneado] ${prod.name}`, "success");
            } else {
                showToast(`Código no encontrado: ${barcodeBuffer}`, "error");
            }
        }
        barcodeBuffer = "";
        clearTimeout(barcodeTimer);
    } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
        clearTimeout(barcodeTimer);
        barcodeTimer = setTimeout(() => {
            barcodeBuffer = "";
        }, 50);
    }
}

init();
