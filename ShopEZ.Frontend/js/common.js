// Storage Keys
const STORAGE_KEYS = {
    TOKEN: 'shopez_token',
    USER: 'shopez_user',
    CART: 'shopez_cart'
};

// Check if user is logged in
// Add these functions to common.js if they don't exist

// Get current user - Make sure this exists
function getCurrentUser() {
    if (!isLoggedIn()) return null;
    
    try {
        const userStr = localStorage.getItem('shopez_user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    } catch (e) {
        console.error('Error parsing user:', e);
        return null;
    }
}

// Check if user is logged in
function isLoggedIn() {
    const token = localStorage.getItem('shopez_token');
    const user = localStorage.getItem('shopez_user');
    
    if (!token || !user) {
        return false;
    }
    
    try {
        const userData = JSON.parse(user);
        return userData && userData.id;
    } catch (e) {
        return false;
    }
}

// Debug function to check storage
window.checkStorage = function() {
    console.log('=== LocalStorage Contents ===');
    console.log('User:', localStorage.getItem('shopez_user'));
    console.log('Token:', localStorage.getItem('shopez_token'));
    console.log('Cart:', localStorage.getItem('shopez_cart'));
    console.log('Orders:', localStorage.getItem('shopez_orders'));
};

// Show toast notification
function showToast(message, type = 'success') {
    // Remove existing toasts
    $('.toast-notification').remove();
    
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    
    const icon = {
        success: 'check-circle-fill',
        error: 'exclamation-circle-fill',
        warning: 'exclamation-triangle-fill',
        info: 'info-circle-fill'
    };
    
    const toastHtml = `
        <div class="toast-notification" style="position: fixed; top: 20px; right: 20px; z-index: 99999; min-width: 300px; animation: slideIn 0.3s ease;">
            <div style="background: ${colors[type]}; color: white; padding: 15px; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <i class="bi bi-${icon[type]} me-2"></i>
                        <span>${message}</span>
                    </div>
                    <button type="button" class="btn-close btn-close-white" onclick="$(this).closest('.toast-notification').remove()"></button>
                </div>
            </div>
        </div>
    `;
    
    $('body').append(toastHtml);
    
    setTimeout(() => {
        $('.toast-notification').fadeOut(300, function() { $(this).remove(); });
    }, 3000);
}

// Show/hide loading
function showLoading() {
    if ($('#loadingSpinner').length === 0) {
        $('body').append(`
            <div id="loadingSpinner" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 99999; background: rgba(0,0,0,0.7); padding: 20px; border-radius: 10px; display: none;">
                <div class="spinner-border text-white" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="text-white mt-2">Loading...</div>
            </div>
        `);
    }
    $('#loadingSpinner').fadeIn(200);
}

function hideLoading() {
    $('#loadingSpinner').fadeOut(200);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
}

// Cart functions
function getCart() {
    if (!isLoggedIn()) {
        return [];
    }
    const cart = localStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    if (!isLoggedIn()) {
        return;
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product, quantity = 1) {
    if (!isLoggedIn()) {
        showToast('Please login to add items to cart', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    let cart = getCart();
    const productId = product.productId || product.id;
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        showToast(`Updated ${product.name} quantity to ${existingItem.quantity}`, 'success');
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.imageUrl || product.image || 'https://via.placeholder.com/100',
            quantity: quantity
        });
        showToast(`${product.name} added to cart!`, 'success');
    }
    
    saveCart(cart);
    return true;
}

function removeFromCart(productId) {
    if (!isLoggedIn()) return [];
    
    let cart = getCart();
    const removedItem = cart.find(item => item.id === productId);
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    
    if (removedItem) {
        showToast(`${removedItem.name} removed from cart`, 'warning');
    }
    return cart;
}

function updateQuantity(productId, newQuantity) {
    if (!isLoggedIn()) return [];
    
    if (newQuantity < 1) {
        return removeFromCart(productId);
    }
    
    let cart = getCart();
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart(cart);
    }
    return cart;
}

function calculateTotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartCount() {
    if (!isLoggedIn()) {
        $('.cart-count').text('0');
        return;
    }
    
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    $('.cart-count').text(totalItems);
}

// Logout
function logout() {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.CART);
    
    updateNav();
    updateCartCount();
    
    showToast('Logged out successfully', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Update navigation based on auth status
function updateNav() {
    if (isLoggedIn()) {
        const user = getCurrentUser();
        if (user) {
            $('.nav-user').show();
            $('.nav-guest').hide();
            $('.user-name').text(user.name || 'User');
            updateCartCount();
        } else {
            $('.nav-user').hide();
            $('.nav-guest').show();
        }
    } else {
        $('.nav-user').hide();
        $('.nav-guest').show();
        $('.cart-count').text('0');
    }
}

// Initialize on page load
$(document).ready(function() {
    updateNav();
    updateCartCount();
    
    // Logout button handler
    $(document).on('click', '#logoutBtn', function(e) {
        e.preventDefault();
        logout();
    });
    
    // Add animation styles if not present
    if (!$('#animationStyles').length) {
        $('head').append(`
            <style id="animationStyles">
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .product-card {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                }
            </style>
        `);
    }
});
// Add this function to common.js if not already present

// Debug function to view all orders (for testing)
function viewAllOrders() {
    const orders = JSON.parse(localStorage.getItem('shopez_orders') || '[]');
    console.log('All orders in storage:', orders);
    return orders;
}

// Clear all orders (for testing)
function clearAllOrders() {
    if (confirm('Are you sure you want to clear all orders?')) {
        localStorage.removeItem('shopez_orders');
        showToast('All orders cleared', 'info');
        if (window.location.pathname.includes('dashboard.html')) {
            loadUserOrders();
        }
    }
}