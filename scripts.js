// BASE DE DATOS LOCALSTORAGE 
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
        { id: 10, nombre: 'Torta de Zanahoria', desc: 'Especiada, con nueces y frosting suave.', precio: 50.00, cat: 'tortas', img: 'https://veggiefestchicago.org/wp-content/uploads/2021/04/21-carrot-cake.jpg' },
        { id: 11, nombre: 'Croissant de Almendras', desc: 'Crujiente, relleno de crema de almendras.', precio: 12.00, cat: 'postres', img: 'https://es.cravingsjournal.com/wp-content/uploads/2021/05/croissant-de-almendras-5.jpg' },
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

/* --- 3. CHECKOUT (LEAFLET & HAVERSINE) --- */
const STORE_LAT = -12.0464; 
const STORE_LNG = -77.0428;

const setupCheckout = () => {
    if (cart.length === 0) { window.location.href = 'tienda.html'; return; }
    
    let map, marker;
    let costoDelivery = 0;
    const subtotal = cart.reduce((acc, item) => acc + (item.precio * item.cant), 0);
    
    const renderResumen = () => {
        const container = document.getElementById('checkout-items');
        container.innerHTML = '';
        cart.forEach(item => {
            container.innerHTML += `<div class="order-summary-item"><span>${item.cant}x ${item.nombre}</span><span>${formatMoney(item.precio * item.cant)}</span></div>`;
        });
        document.getElementById('checkout-subtotal').innerText = formatMoney(subtotal);
        document.getElementById('checkout-delivery').innerText = formatMoney(costoDelivery);
        document.getElementById('checkout-total').innerText = formatMoney(subtotal + costoDelivery);
    };

    const calcHaversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)));
    };

    const updateDeliveryCost = (lat, lng) => {
        const dist = calcHaversine(STORE_LAT, STORE_LNG, lat, lng);
        if (dist <= 2) costoDelivery = 10;
        else costoDelivery = 10 + Math.ceil(dist - 2) * 2;
        renderResumen();
    };

    document.getElementById('tipo-entrega').addEventListener('change', (e) => {
        const mapDiv = document.getElementById('map');
        if (e.target.value === 'delivery') {
            mapDiv.style.display = 'block';
            costoDelivery = 10;
            if (!map) {
                map = L.map('map').setView([STORE_LAT, STORE_LNG], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
                marker = L.marker([STORE_LAT, STORE_LNG], { draggable: true }).addTo(map);
                marker.on('dragend', (ev) => {
                    const pos = ev.target.getLatLng();
                    updateDeliveryCost(pos.lat, pos.lng);
                });
            }
        } else {
            mapDiv.style.display = 'none';
            costoDelivery = 0;
        }
        renderResumen();
    });

    document.getElementById('metodo-pago').addEventListener('change', (e) => {
        document.getElementById('form-tarjeta').style.display = e.target.value === 'tarjeta' ? 'block' : 'none';
        document.getElementById('form-yape').style.display = e.target.value === 'yape' ? 'block' : 'none';
    });

    document.getElementById('btn-confirmar').addEventListener('click', () => {
        const nombre = document.getElementById('cliente-nombre').value;
        const dni = document.getElementById('cliente-dni').value;
        const tipoEntrega = document.getElementById('tipo-entrega').value;

        if (!nombre || !dni) {
            showToast('Por favor, ingresa tu nombre y DNI');
            return;
        }

        const newOrder = {
            id: 'ORD-' + Math.floor(Math.random() * 10000),
            cliente: nombre,
            dni: dni,
            items: cart,
            total: subtotal + costoDelivery,
            tipo_entrega: tipoEntrega,
            estado: 'pendiente',
            fecha: new Date().toLocaleDateString()
        };
        
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        localStorage.setItem('cart', JSON.stringify([]));
        showToast('¡Gracias por tu compra, ' + nombre + '!');
        setTimeout(() => window.location.href = 'tienda.html', 2000);
    });

    renderResumen();
};

/* --- 4. PANEL ADMIN --- */
const setupAdmin = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const products = JSON.parse(localStorage.getItem('products')) || [];
    
    const entregados = orders.filter(o => o.estado === 'entregado');
    const totalVentas = entregados.reduce((acc, o) => acc + o.total, 0);
    const pendientes = orders.filter(o => o.estado === 'pendiente').length;

    document.getElementById('stat-ventas').innerText = formatMoney(totalVentas);
    document.getElementById('stat-pendientes').innerText = pendientes;
    document.getElementById('stat-productos').innerText = products.length;

    renderAdminOrders();
    renderAdminHistory();
};

const renderAdminOrders = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('admin-orders-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const activos = orders.filter(o => o.estado !== 'entregado');

    if (activos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay pedidos activos en este momento.</td></tr>';
        return;
    }

    activos.reverse().forEach(o => {
        tbody.innerHTML += `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.cliente}</td>
                <td>${o.tipo_entrega === 'delivery' ? 'Delivery' : 'Recojo'}</td>
                <td>${formatMoney(o.total)}</td>
                <td><span class="badge ${o.estado}">${o.estado.replace('_', ' ').toUpperCase()}</span></td>
                <td>
                    <select onchange="cambiarEstadoPedido('${o.id}', this.value)">
                        <option value="pendiente" ${o.estado==='pendiente'?'selected':''}>Pendiente</option>
                        <option value="preparando" ${o.estado==='preparando'?'selected':''}>Preparando</option>
                        <option value="en_camino" ${o.estado==='en_camino'?'selected':''}>En Camino</option>
                        <option value="entregado" ${o.estado==='entregado'?'selected':''}>Entregado</option>
                    </select>
                </td>
            </tr>
        `;
    });
};

const renderAdminHistory = () => {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const tbody = document.getElementById('admin-history-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const entregados = orders.filter(o => o.estado === 'entregado');

    if (entregados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Aún no hay ventas completadas.</td></tr>';
        return;
    }

    entregados.reverse().forEach(o => {
        let listaProductos = '<ul class="items-lista">';
        o.items.forEach(item => {
            listaProductos += `<li><b>${item.cant}x</b> ${item.nombre}</li>`;
        });
        listaProductos += '</ul>';

        let nombreMotorizado = o.tipo_entrega === 'delivery' 
            ? (o.motorizado ? o.motorizado : 'Delivery') 
            : '<span style="color:#888;">N/A (Recojo)</span>';

        tbody.innerHTML += `
            <tr>
                <td><strong>${o.id}</strong></td>
                <td>${o.cliente}<br><small style="color:#888;">DNI: ${o.dni || 'N/A'}</small></td>
                <td>${nombreMotorizado}</td>
                <td><span class="badge ${o.tipo_entrega === 'delivery' ? 'en_camino' : 'preparando'}">${o.tipo_entrega.toUpperCase()}</span></td>
                <td>${listaProductos}</td>
                <td>${o.fecha}</td>
                <td style="color: var(--gold); font-weight: bold; font-size: 1.1rem;">${formatMoney(o.total)}</td>
            </tr>
        `;
    });
};

window.cambiarEstadoPedido = (id, nuevoEstado) => {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const order = orders.find(o => o.id === id);
    if(order) order.estado = nuevoEstado;
    localStorage.setItem('orders', JSON.stringify(orders));
    showToast('Estado actualizado');
    
    if (document.body.id === 'page-admin') {
        setupAdmin(); 
    }
};

/* --- 5. PANEL DELIVERY --- */
const setupDelivery = () => {
    renderDeliveryOrders();
};

const renderDeliveryOrders = () => {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const user = getLoggedUser();
    const listDisp = document.getElementById('delivery-disponibles');
    const listMis = document.getElementById('delivery-mis-pedidos');
    if(!listDisp || !listMis) return;
    
    listDisp.innerHTML = ''; listMis.innerHTML = '';

    const disponibles = orders.filter(o => o.estado === 'preparando' && o.tipo_entrega === 'delivery');
    const misPedidos = orders.filter(o => o.estado === 'en_camino' && o.motorizado === user.email);

    disponibles.forEach(o => {
        listDisp.innerHTML += `
            <div class="stat-card" style="text-align:left; border-left:4px solid var(--gold); border-bottom:none; margin-bottom:15px;">
                <h4>${o.id} - ${o.cliente}</h4>
                <p style="font-size:1rem; margin:10px 0;">Total: ${formatMoney(o.total)}</p>
                <button class="btn btn-block" onclick="aceptarPedido('${o.id}')">Aceptar Pedido</button>
            </div>
        `;
    });

    misPedidos.forEach(o => {
        listMis.innerHTML += `
            <div class="stat-card" style="text-align:left; border-left:4px solid #3498db; border-bottom:none; margin-bottom:15px;">
                <h4>${o.id} - ${o.cliente}</h4>
                <span class="badge en_camino">En Camino</span>
                <button class="btn btn-block" style="background:#2ecc71; color:white; margin-top:15px;" onclick="completarPedido('${o.id}')">Marcar Entregado</button>
            </div>
        `;
    });
    
    if(disponibles.length === 0) listDisp.innerHTML = '<p>No hay pedidos listos para recoger.</p>';
    if(misPedidos.length === 0) listMis.innerHTML = '<p>No tienes pedidos asignados.</p>';
};

window.aceptarPedido = (id) => {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const order = orders.find(o => o.id === id);
    if(order) {
        order.estado = 'en_camino';
        order.motorizado = getLoggedUser().email;
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast('Pedido aceptado');
        renderDeliveryOrders();
    }
};

window.completarPedido = (id) => {
    const orders = JSON.parse(localStorage.getItem('orders'));
    const order = orders.find(o => o.id === id);
    if(order) {
        order.estado = 'entregado';
        localStorage.setItem('orders', JSON.stringify(orders));
        showToast('Pedido entregado exitosamente');
        renderDeliveryOrders();
    }
};