// ============================================
// FLAVOR RUSH - INTERACTIVE JAVASCRIPT
// ============================================

// Menu Items Database
const menuItems = [
    { id: 1, name: 'Classic Burger', category: 'burgers', price: 8.99, emoji: '🍔' },
    { id: 2, name: 'Double Cheese Burger', category: 'burgers', price: 10.99, emoji: '🍔' },
    { id: 3, name: 'Bacon Burger', category: 'burgers', price: 11.99, emoji: '🍔' },
    { id: 4, name: 'Spicy Burger', category: 'burgers', price: 9.99, emoji: '🍔' },
    { id: 5, name: 'Margherita Pizza', category: 'pizza', price: 12.99, emoji: '🍕' },
    { id: 6, name: 'Pepperoni Pizza', category: 'pizza', price: 13.99, emoji: '🍕' },
    { id: 7, name: 'Vegetarian Pizza', category: 'pizza', price: 11.99, emoji: '🍕' },
    { id: 8, name: 'BBQ Chicken Pizza', category: 'pizza', price: 14.99, emoji: '🍕' },
    { id: 9, name: 'Fried Chicken', category: 'chicken', price: 9.99, emoji: '🍗' },
    { id: 10, name: 'Grilled Chicken', category: 'chicken', price: 10.99, emoji: '🍗' },
    { id: 11, name: 'Chicken Wings', category: 'chicken', price: 7.99, emoji: '🍗' },
    { id: 12, name: 'Spicy Chicken Tenders', category: 'chicken', price: 8.99, emoji: '🍗' },
    { id: 13, name: 'Chocolate Cake', category: 'desserts', price: 5.99, emoji: '🍰' },
    { id: 14, name: 'Cheesecake', category: 'desserts', price: 6.99, emoji: '🍰' },
    { id: 15, name: 'Ice Cream', category: 'desserts', price: 4.99, emoji: '🍦' },
    { id: 16, name: 'Donut', category: 'desserts', price: 2.99, emoji: '🍩' },
    { id: 17, name: 'Coca Cola', category: 'beverages', price: 2.99, emoji: '🥤' },
    { id: 18, name: 'Orange Juice', category: 'beverages', price: 3.99, emoji: '🥤' },
    { id: 19, name: 'Milkshake', category: 'beverages', price: 4.99, emoji: '🥤' },
    { id: 20, name: 'Coffee', category: 'beverages', price: 3.49, emoji: '☕' },
];

// Shopping Cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    renderMenuItems();
    setupEventListeners();
    applyTheme(currentTheme);
    updateCartCount();
    setupFAQ();
}

// ============================================
// THEME TOGGLE
// ============================================
function setupEventListeners() {
    // Theme Toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Search Button
    document.getElementById('searchBtn').addEventListener('click', () => {
        openModal('searchModal');
        document.getElementById('searchInput').focus();
    });

    // Cart Button
    document.getElementById('cartBtn').addEventListener('click', () => {
        openModal('cartModal');
        displayCart();
    });

    // Menu Toggle
    document.getElementById('menuToggle').addEventListener('click', toggleMobileMenu);

    // Search Input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchMenu(e.target.value);
    });

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            filterMenu(e.target.dataset.filter);
        });
    });

    // Newsletter Form
    document.getElementById('newsletterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for subscribing!');
        e.target.reset();
    });

    // Contact Form
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will contact you soon.');
        e.target.reset();
    });

    // Close Modals
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close Mobile Menu
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('mobileMenu').classList.remove('active');
            document.getElementById('menuToggle').classList.remove('active');
        });
    });
}

function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme);
    applyTheme(currentTheme);
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').textContent = '☀️';
    } else {
        document.body.classList.remove('dark-mode');
        document.getElementById('themeToggle').textContent = '🌙';
    }
}

// ============================================
// MENU RENDERING
// ============================================
function renderMenuItems(items = menuItems) {
    const menuGrid = document.getElementById('menuGrid');
    menuGrid.innerHTML = items.map(item => `
        <div class="menu-item" data-category="${item.category}">
            <div class="menu-item-image">${item.emoji}</div>
            <div class="menu-item-content">
                <h3>${item.name}</h3>
                <p class="menu-item-category">${item.category}</p>
                <div class="menu-item-footer">
                    <span class="menu-price">$${item.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart('${item.name}', ${item.price})">Add</button>
                </div>
            </div>
        </div>
    `).join('');
}

function filterMenu(category) {
    if (category === 'all') {
        renderMenuItems(menuItems);
    } else {
        const filtered = menuItems.filter(item => item.category === category);
        renderMenuItems(filtered);
    }
}

function searchMenu(query) {
    const resultsContainer = document.getElementById('searchResults');
    if (query.length === 0) {
        resultsContainer.innerHTML = '';
        return;
    }

    const results = menuItems.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );

    resultsContainer.innerHTML = results.map(item => `
        <div style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer;" onclick="addToCart('${item.name}', ${item.price}); closeModal('searchModal')">
            <div style="font-weight: 600;">${item.emoji} ${item.name}</div>
            <div style="font-size: 0.9rem; color: #666;">$${item.price.toFixed(2)}</div>
        </div>
    `).join('');
}

// ============================================
// SHOPPING CART
// ============================================
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1,
            id: Date.now()
        });
    }

    updateCartCount();
    saveCart();
    showNotification(`${name} added to cart!`);
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    updateCartCount();
    saveCart();
    displayCart();
}

function updateQuantity(id, quantity) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            displayCart();
        }
    }
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = count;
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 30px; color: #999;">Your cart is empty</p>';
        document.getElementById('subtotal').textContent = '$0.00';
        document.getElementById('total').textContent = '$0.00';
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div style="padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <div style="font-weight: 600;">${item.name}</div>
                <div style="font-size: 0.9rem; color: #666;">$${item.price.toFixed(2)}</div>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
                <input type="number" value="${item.quantity}" min="1" style="width: 50px; padding: 5px; border: 1px solid #ddd; border-radius: 5px;" onchange="updateQuantity(${item.id}, this.value)">
                <button onclick="removeFromCart(${item.id})" style="background: #ff6b6b; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartTotals();
}

function updateCartTotals() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 50 ? 0 : 5;
    const total = subtotal + deliveryFee;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('deliveryFee').textContent = deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// ============================================
// MODALS
// ============================================
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// ============================================
// MOBILE MENU
// ============================================
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuToggle = document.getElementById('menuToggle');

    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

// ============================================
// FAQ ACCORDION
// ============================================
function setupFAQ() {
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', function () {
            const parent = this.parentElement;
            parent.classList.toggle('active');

            // Close other FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== parent) {
                    item.classList.remove('active');
                }
            });
        });
    });
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #FF6B35, #F7931E);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================
// SCROLL PROGRESS BAR
// ============================================
window.addEventListener('scroll', () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / scrollHeight) * 100;

    // Update scroll indicator if needed
    // You can add a scroll progress bar here
});

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl + K: Open Search
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        openModal('searchModal');
        document.getElementById('searchInput').focus();
    }

    // Escape: Close Modals
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            closeModal(modal.id);
        });
    }
});

// ============================================
// LAZY LOADING
// ============================================
if ('IntersectionObserver' in window) {
    const options = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.feature-card, .menu-item, .review-card').forEach(el => {
        observer.observe(el);
    });
}

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Debounce function for search
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

const debouncedSearch = debounce((query) => {
    searchMenu(query);
}, 300);

// Update search event listener
document.getElementById('searchInput').addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

// ============================================
// ADDITIONAL FEATURES
// ============================================

// Back to Top Button
window.addEventListener('scroll', () => {
    // You can add a back to top button here
});

// Prefetch resources
document.addEventListener('DOMContentLoaded', () => {
    // Optimize images and resources
    console.log('Flavor Rush Restaurant loaded successfully!');
});
