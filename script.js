// --- DATA ---
const PRODUCTS = [
    {
        id: 1,
        name: 'Orb Pendant Light',
        category: 'Lighting',
        price: 240,
        oldPrice: 310,
        rating: 4.8,
        image: 'assets/orb_pendant_light_1777916508054.png',
        description: 'A perfect sphere of frosted glass suspended by a delicate brass chain. Provides soft, diffused light for any modern dining area or entryway.',
        badge: 'Sale'
    },
    {
        id: 2,
        name: 'Ceramic Sculptural Vase',
        category: 'Decor',
        price: 45,
        rating: 4.5,
        image: 'assets/ceramic_vase_1777916524792.png',
        description: 'Hand-crafted ceramic vase with a unique textured finish. An elegant centerpiece for your living room or study.'
    },
    {
        id: 3,
        name: 'Walnut Minimalist Side Table',
        category: 'Furniture',
        price: 320,
        rating: 4.9,
        image: 'assets/walnut_side_table_1777916540846.png',
        description: 'Solid walnut construction with clean lines and a satin finish. Features a hidden drawer for seamless storage.'
    },
    {
        id: 4,
        name: 'Linen Throw Pillow',
        category: 'Decor',
        price: 60,
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1579656335362-97b621174c3e?q=80&w=800',
        description: 'Premium organic linen pillow in a neutral oatmeal shade. Adds comfort and texture to your sofa.'
    },
    {
        id: 5,
        name: 'Abstract Framed Wall Art',
        category: 'Decor',
        price: 180,
        rating: 4.7,
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?q=80&w=800',
        description: 'Original abstract composition in charcoal and cream. Housed in a minimalist black oak frame.'
    },
    {
        id: 6,
        name: 'Brass Task Floor Lamp',
        category: 'Lighting',
        price: 210,
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800',
        description: 'Adjustable floor lamp with a slim profile and brushed brass finish. Ideal for reading nooks.'
    }
];

// --- STATE ---
let cart = JSON.parse(localStorage.getItem('lumino_cart')) || [];

// --- UTILS ---
const saveCart = () => {
    localStorage.setItem('lumino_cart', JSON.stringify(cart));
    updateCartCount();
};

const updateCartCount = () => {
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    document.getElementById('cart-count').textContent = count;
};

const addToCart = (productId, qty = 1) => {
    const product = PRODUCTS.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    if (existing) {
        existing.qty += parseInt(qty);
    } else {
        cart.push({ ...product, qty: parseInt(qty) });
    }
    saveCart();
    alert(`${product.name} added to cart!`);
};

const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
};

const formatPrice = (price) => `$${price.toFixed(2)}`;

// --- ROUTER ---
const app = document.getElementById('app');

const routes = {
    '/': renderHome,
    '/shop': renderShop,
    '/product': renderProduct,
    '/cart': renderCart,
    '/about': renderAbout,
    '/contact': renderContact
};

function router() {
    const hash = window.location.hash.slice(1) || '/';
    const [path, id] = hash.split('/').filter(p => p !== '').map(p => isNaN(p) ? '/' + p : p);
    
    // Handle /product/:id
    if (hash.startsWith('/product/')) {
        const prodId = parseInt(hash.split('/')[2]);
        renderProduct(prodId);
    } else {
        const route = routes[hash] || renderHome;
        route();
    }

    // Update active link
    document.querySelectorAll('.nav-links a').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + hash);
    });

    window.scrollTo(0, 0);
    document.getElementById('mobile-nav').classList.remove('active');
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
    router();
    updateCartCount();
});

// --- COMPONENTS ---

function renderHome() {
    app.innerHTML = `
        <section class="hero">
            <div class="hero-bg" style="background-image: url('assets/hero_interior_1777916556947.png')"></div>
            <div class="container">
                <div class="hero-content">
                    <h1>Elevate Your Living Space</h1>
                    <p style="margin-bottom: 24px; color: var(--text-muted);">Discover our curated collection of minimalist furniture and lighting designed for modern living.</p>
                    <a href="#/shop" class="btn btn-primary btn-xl">Shop Collection</a>
                </div>
            </div>
        </section>

        <section class="container">
            <div class="section-title">
                <h2>Featured Arrivals</h2>
                <p>Thoughtfully selected pieces for your home.</p>
            </div>
            <div class="product-grid">
                ${PRODUCTS.slice(0, 4).map(p => productCard(p)).join('')}
            </div>
            <div style="text-align: center; margin-top: 48px;">
                <a href="#/shop" class="btn btn-primary">View All Products</a>
            </div>
        </section>
    `;
}

function renderShop() {
    app.innerHTML = `
        <section class="container">
            <div class="section-title">
                <h2>All Products</h2>
                <p>Explore our entire range of minimalist decor.</p>
            </div>
            <div class="shop-layout">
                <aside class="sidebar">
                    <div class="filter-group">
                        <h4>Categories</h4>
                        <ul class="filter-list">
                            <li>All Categories</li>
                            <li>Furniture</li>
                            <li>Lighting</li>
                            <li>Decor</li>
                        </ul>
                    </div>
                    <div class="filter-group">
                        <h4>Price Range</h4>
                        <ul class="filter-list">
                            <li>$0 - $100</li>
                            <li>$100 - $300</li>
                            <li>$300+</li>
                        </ul>
                    </div>
                </aside>
                <div class="product-grid">
                    ${PRODUCTS.map(p => productCard(p)).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderProduct(id) {
    const p = PRODUCTS.find(item => item.id === id);
    if (!p) {
        app.innerHTML = `<div class="container"><h1>Product not found</h1></div>`;
        return;
    }

    app.innerHTML = `
        <section class="container">
            <div class="product-detail">
                <div class="detail-gallery">
                    <img src="${p.image}" alt="${p.name}" style="border-radius: var(--r-lg); width: 100%;">
                </div>
                <div class="detail-info">
                    <div class="product-category">${p.category}</div>
                    <h1>${p.name}</h1>
                    <div class="rating">
                        ${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}
                        <span style="color: var(--text-muted); font-size: 12px; margin-left: 8px;">(${p.rating} review)</span>
                    </div>
                    <div class="detail-price">${formatPrice(p.price)}</div>
                    <p class="detail-desc">${p.description}</p>
                    <div class="stock-status">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        In Stock - Ready to ship
                    </div>
                    <div class="actions">
                        <input type="number" id="qty" value="1" min="1" class="qty-input">
                        <button onclick="addToCart(${p.id}, document.getElementById('qty').value)" class="btn btn-primary btn-xl">Add to Cart</button>
                    </div>
                    <div style="margin-top: 32px; border-top: 1px solid var(--border); padding-top: 24px;">
                        <h4 style="margin-bottom: 8px;">Product Details</h4>
                        <ul style="font-size: var(--sm); color: var(--text-muted); line-height: 2;">
                            <li>• Material: Premium sustainable sources</li>
                            <li>• Dimensions: 45cm x 45cm x 60cm</li>
                            <li>• Care: Wipe with a damp cloth</li>
                            <li>• Warranty: 2-year manufacturer's warranty</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderCart() {
    if (cart.length === 0) {
        app.innerHTML = `
            <section class="container" style="text-align: center; padding: 100px 0;">
                <h2>Your cart is empty</h2>
                <p style="margin: 16px 0 32px; color: var(--text-muted);">Looks like you haven't added anything yet.</p>
                <a href="#/shop" class="btn btn-primary btn-xl">Continue Shopping</a>
            </section>
        `;
        return;
    }

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    app.innerHTML = `
        <section class="container cart-container">
            <h1>Your Shopping Cart</h1>
            <table class="cart-table">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map(item => `
                        <tr class="cart-item">
                            <td>
                                <div class="cart-product">
                                    <img src="${item.image}" alt="${item.name}">
                                    <div>
                                        <a href="#/product/${item.id}" style="font-weight: 500;">${item.name}</a>
                                        <div style="font-size: var(--text-xs); color: var(--text-muted);">${item.category}</div>
                                    </div>
                                </div>
                            </td>
                            <td>${formatPrice(item.price)}</td>
                            <td>${item.qty}</td>
                            <td>${formatPrice(item.price * item.qty)}</td>
                            <td style="text-align: right;">
                                <button onclick="removeFromCart(${item.id})" class="remove-btn">Remove</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="cart-summary">
                <div class="summary-box">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>${formatPrice(subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Shipping</span>
                        <span style="color: var(--green);">Free</span>
                    </div>
                    <div class="summary-row summary-total">
                        <span>Total</span>
                        <span>${formatPrice(subtotal)}</span>
                    </div>
                    <button class="btn btn-primary btn-xl" style="width: 100%; margin-top: 24px;" onclick="alert('Checkout integration coming soon!')">Checkout Now</button>
                </div>
            </div>
        </section>
    `;
}

function renderAbout() {
    app.innerHTML = `
        <section class="container" style="padding: 80px 0;">
            <div style="max-width: 800px; margin: 0 auto; text-align: center;">
                <span class="product-category">Our Story</span>
                <h1 style="font-size: var(--3xl); margin: 16px 0;">Crafting Spaces with Intent</h1>
                <p style="font-size: var(--lg); color: var(--text-muted); margin-bottom: 32px;">LUMINO was founded on the belief that our environment profoundly shapes our well-being. We curate and design pieces that bring harmony, clarity, and beauty to the modern home.</p>
                <img src="assets/hero_interior_1777916556947.png" style="width: 100%; border-radius: var(--r-lg); margin-bottom: 48px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; text-align: left;">
                    <div>
                        <h3 style="margin-bottom: 16px;">Our Philosophy</h3>
                        <p style="color: var(--text-muted);">Minimalism isn't about having less; it's about making room for what matters. Every piece in our collection is chosen for its quality, functionality, and timeless aesthetic.</p>
                    </div>
                    <div>
                        <h3 style="margin-bottom: 16px;">Sustainability</h3>
                        <p style="color: var(--text-muted);">We partner with artisans who prioritize ethical sourcing and sustainable materials, ensuring our products are as kind to the earth as they are to your home.</p>
                    </div>
                </div>
            </div>
        </section>
    `;
}

function renderContact() {
    app.innerHTML = `
        <section class="container" style="padding: 80px 0;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 64px;">
                <div>
                    <span class="product-category">Contact Us</span>
                    <h1 style="font-size: var(--3xl); margin: 16px 0;">Get in Touch</h1>
                    <p style="color: var(--text-muted); margin-bottom: 32px;">Have questions about our products or your order? Our team is here to help.</p>
                    
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 8px;">Studio Address</h4>
                        <p style="color: var(--text-muted);">123 Minimalist Way<br>Copenhagen, Denmark</p>
                    </div>
                    <div style="margin-bottom: 24px;">
                        <h4 style="margin-bottom: 8px;">Inquiries</h4>
                        <p style="color: var(--text-muted);">hello@lumino.studio<br>+45 12 34 56 78</p>
                    </div>
                </div>
                <div style="background: var(--bg-subtle); padding: 48px; border-radius: var(--r-lg);">
                    <form onsubmit="event.preventDefault(); alert('Message sent!');">
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; font-size: var(--sm); margin-bottom: 8px;">Name</label>
                            <input type="text" required style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: var(--r-sm);">
                        </div>
                        <div style="margin-bottom: 16px;">
                            <label style="display: block; font-size: var(--sm); margin-bottom: 8px;">Email</label>
                            <input type="email" required style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: var(--r-sm);">
                        </div>
                        <div style="margin-bottom: 24px;">
                            <label style="display: block; font-size: var(--sm); margin-bottom: 8px;">Message</label>
                            <textarea required rows="5" style="width: 100%; padding: 12px; border: 1px solid var(--border); border-radius: var(--r-sm); font-family: inherit;"></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary btn-xl" style="width: 100%;">Send Message</button>
                    </form>
                </div>
            </div>
        </section>
    `;
}

function productCard(p) {
    return `
        <div class="product-card">
            ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ''}
            <a href="#/product/${p.id}" class="product-img-wrapper">
                <img src="${p.image}" alt="${p.name}" class="product-img" loading="lazy">
            </a>
            <div class="product-info">
                <span class="product-category">${p.category}</span>
                <a href="#/product/${p.id}" class="product-name">${p.name}</a>
                <div class="rating">
                    ${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5 - Math.floor(p.rating))}
                </div>
                <div class="product-price">
                    ${p.oldPrice ? `<span class="price-old">${formatPrice(p.oldPrice)}</span>` : ''}
                    ${formatPrice(p.price)}
                </div>
            </div>
        </div>
    `;
}

// --- UI INTERACTION ---
document.getElementById('mobile-menu-btn').addEventListener('click', () => {
    document.getElementById('mobile-nav').classList.toggle('active');
});
