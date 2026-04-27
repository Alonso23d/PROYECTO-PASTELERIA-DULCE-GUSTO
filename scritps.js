// --- BASE DE DATOS LOCALSTORAGE ---
const initDB = () => {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([
            { email: 'admin@dulcegusto.com', pass: '123', rol: 'admin', nombre: 'Administrador' },
            { email: 'delivery@dulcegusto.com', pass: '123', rol: 'delivery', nombre: 'Motorizado 1' }
        ]));
    }
    
    const extendedProducts = [
        { id: 1, nombre: 'Torta Tres Leches', desc: 'Clásica y esponjosa, bañada en tres leches.', precio: 45.00, cat: 'tortas', img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80' },
        { id: 2, nombre: 'Cheesecake de Frutos Rojos', desc: 'Base de galleta artesanal con coulis.', precio: 55.00, cat: 'postres', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&q=80' },
        { id: 3, nombre: 'Cupcake Red Velvet', desc: 'Con frosting de queso crema premium.', precio: 8.00, cat: 'cupcakes', img: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=500&q=80' },
        { id: 4, nombre: 'Torta de Chocolate Fudge', desc: 'Húmeda con fudge artesanal oscuro.', precio: 60.00, cat: 'tortas', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80' },
        { id: 5, nombre: 'Tiramisú Italiano', desc: 'Auténtico postre italiano con mascarpone.', precio: 25.00, cat: 'postres', img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&q=80' },
        { id: 6, nombre: 'Caja de Macarons', desc: 'Docena de macarons surtidos tipo francés.', precio: 40.00, cat: 'postres', img: 'https://images.unsplash.com/photo-1568644396922-5c3bfae12521?w=500&q=80' },
        { id: 7, nombre: 'Torta Selva Negra', desc: 'Bizcocho, cerezas y crema chantilly.', precio: 65.00, cat: 'tortas', img: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?w=500&q=80' },
        { id: 8, nombre: 'Cupcake Vainilla Chips', desc: 'Clásico de vainilla con chispas de chocolate.', precio: 7.00, cat: 'cupcakes', img: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?w=500&q=80' },
        { id: 9, nombre: 'Brownie Melcochudo', desc: 'Con nueces y helado de vainilla.', precio: 15.00, cat: 'postres', img: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=500&q=80' },
        { id: 10, nombre: 'Torta de Zanahoria', desc: 'Especiada, con nueces y frosting suave.', precio: 50.00, cat: 'tortas', img: 'https://images.unsplash.com/photo-1590080826492-fbf34f71fbdf?w=500&q=80' },
        { id: 11, nombre: 'Croissant de Almendras', desc: 'Crujiente, relleno de crema de almendras.', precio: 12.00, cat: 'postres', img: 'https://images.unsplash.com/photo-1549903072-7e6e0829faa1?w=500&q=80' },
        { id: 12, nombre: 'Cupcake de Limón', desc: 'Relleno de lemon curd y merengue tostado.', precio: 9.00, cat: 'cupcakes', img: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=500&q=80' }
    ];

    let currentProducts = JSON.parse(localStorage.getItem('products')) || [];
    if (currentProducts.length < 12) {
        localStorage.setItem('products', JSON.stringify(extendedProducts));
    }

    if (!localStorage.getItem('orders')) localStorage.setItem('orders', JSON.stringify([]));
    if (!localStorage.getItem('cart')) localStorage.setItem('cart', JSON.stringify([]));
};

const showToast = (msg) => {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = msg;
    container.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 3000);
};

const getLoggedUser = () => JSON.parse(localStorage.getItem('loggedUser'));
const formatMoney = (amount) => `S/ ${parseFloat(amount).toFixed(2)}`;
const logout = () => { localStorage.removeItem('loggedUser'); window.location.href = 'index.html'; };

document.addEventListener('DOMContentLoaded', () => {
    initDB();
    const pageId = document.body.id;
    const user = getLoggedUser();

    // Solo Admin y Delivery requieren sesión
    const paginasPrivadas = ['page-admin', 'page-delivery'];
    if (!user && paginasPrivadas.includes(pageId)) {
        window.location.href = 'index.html';
        return;
    }

    if (pageId === 'page-login') setupLogin();
    if (pageId === 'page-tienda') setupTienda();
    if (pageId === 'page-checkout') setupCheckout();
    if (pageId === 'page-admin') setupAdmin();
    if (pageId === 'page-delivery') setupDelivery();

    const logoutBtn = document.getElementById('btn-logout');
    if(logoutBtn) logoutBtn.addEventListener('click', logout);
});

/* --- 1. LOGIN (SOLO PERSONAL) --- */
const setupLogin = () => {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('log-email').value;
        const pass = document.getElementById('log-pass').value;
        const users = JSON.parse(localStorage.getItem('users'));
        
        const validUser = users.find(u => u.email === email && u.pass === pass);
        if (validUser) {
            localStorage.setItem('loggedUser', JSON.stringify(validUser));
            if (validUser.rol === 'admin') window.location.href = 'admin.html';
            else if (validUser.rol === 'delivery') window.location.href = 'delivery.html';
        } else {
            showToast('Credenciales incorrectas');
        }
    });
};

/* --- 2. TIENDA & CARRITO --- */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const setupTienda = () => {
    const user = getLoggedUser();
    const userDisplay = document.getElementById('user-info-nav');
    
    if (userDisplay) {
        if (user) {
            userDisplay.innerHTML = `<span style="color: var(--beige);">Personal Activo: <b>${user.nombre}</b></span>`;
        } else {
            userDisplay.innerHTML = `<a href="index.html" class="btn btn-outline" style="font-size:0.7rem; padding:5px 10px;">Acceso Personal</a>`;
        }
    }

    renderProducts('todos');
    updateCartUI();

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            renderProducts(e.target.dataset.cat);
        });
    });
};

const renderProducts = (cat) => {
    const products = JSON.parse(localStorage.getItem('products'));
    const grid = document.getElementById('products-grid');
    if(!grid) return;
    grid.innerHTML = '';
    
    const filtered = cat === 'todos' ? products : products.filter(p => p.cat === cat);
    
    filtered.forEach(p => {
        grid.innerHTML += `
            <div class="product-card">
                <img src="${p.img}" alt="${p.nombre}">
                <h3>${p.nombre}</h3>
                <p>${p.desc}</p>
                <div class="price">${formatMoney(p.precio)}</div>
                <button class="btn" onclick="addToCart(${p.id})">Añadir al Carrito</button>
            </div>
        `;
    });
};

window.addToCart = (id) => {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === id);
    const existing = cart.find(item => item.id === id);
    
    if (existing) existing.cant++;
    else cart.push({ ...product, cant: 1 });
    
    saveCart();
    showToast('Producto añadido');
    document.getElementById('cart-sidebar').classList.add('open');
};

window.updateQty = (id, delta) => {
    const item = cart.find(i => i.id === id);
    if (item) {
        item.cant += delta;
        if (item.cant <= 0) cart = cart.filter(i => i.id !== id);
        saveCart();
    }
};

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
};

window.toggleCart = () => {
    document.getElementById('cart-sidebar').classList.toggle('open');
};

const updateCartUI = () => {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if(!cartCount) return;

    cartCount.innerText = cart.reduce((acc, item) => acc + item.cant, 0);
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        total += item.precio * item.cant;
        cartItems.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.nombre}</h4>
                    <p>${formatMoney(item.precio)}</p>
                </div>
                <div class="cart-controls">
                    <button onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.cant}</span>
                    <button onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            </div>
        `;
    });
    cartTotal.innerText = formatMoney(total);
};

window.goToCheckout = () => {
    if (cart.length === 0) { showToast('El carrito está vacío'); return; }
    window.location.href = 'checkout.html';
};
