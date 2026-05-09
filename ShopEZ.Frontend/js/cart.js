// Shopping cart management module

// Load and display cart items - FIXED
function loadCartItems() {
    console.log('Loading cart items...');
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        console.log('User not logged in, showing login prompt');
        $('#emptyCart').show();
        $('#cartContent').hide();
        $('#emptyCart').html(`
            <div class="text-center py-5">
                <i class="bi bi-box-arrow-in-right fs-1 text-muted"></i>
                <h3 class="mt-3">Please Login to View Cart</h3>
                <p class="text-muted">You need to be logged in to view your cart items</p>
                <a href="login.html" class="btn btn-primary-custom mt-3">Login Now</a>
            </div>
        `);
        return;
    }
    
    console.log('User logged in, loading cart...');
    const cart = getCart();
    const container = $('#cartItemsContainer');
    const emptyContainer = $('#emptyCart');
    const cartContent = $('#cartContent');
    
    if (!cart || cart.length === 0) {
        console.log('Cart is empty');
        container.empty();
        emptyContainer.show();
        cartContent.hide();
        emptyContainer.html(`
            <div class="text-center py-5">
                <i class="bi bi-cart-x fs-1 text-muted"></i>
                <h3 class="mt-3">Your cart is empty</h3>
                <p class="text-muted">Looks like you haven't added any items yet</p>
                <a href="products.html" class="btn btn-primary-custom mt-3">Continue Shopping</a>
            </div>
        `);
        return;
    }
    
    console.log('Cart has items:', cart.length);
    emptyContainer.hide();
    cartContent.show();
    
    let html = '';
    cart.forEach(item => {
        html += `
            <div class="cart-item bg-white rounded p-3 mb-3 shadow-sm" data-product-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2 col-4">
                        <img src="${item.image || 'https://via.placeholder.com/80'}" alt="${item.name}" class="img-fluid rounded" style="max-width: 80px; height: auto;" onerror="this.src='https://via.placeholder.com/80'">
                    </div>
                    <div class="col-md-4 col-8">
                        <h6 class="fw-bold">${item.name}</h6>
                        <p class="text-primary fw-bold mb-0">${formatPrice(item.price)}</p>
                    </div>
                    <div class="col-md-3 col-6 mt-3 mt-md-0">
                        <div class="d-flex align-items-center gap-2">
                            <button class="btn btn-sm btn-outline-secondary decrease-qty" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input form-control text-center" 
                                   data-id="${item.id}" value="${item.quantity}" min="1" style="width: 70px;">
                            <button class="btn btn-sm btn-outline-secondary increase-qty" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <div class="col-md-2 col-6 mt-3 mt-md-0">
                        <p class="mb-0 fw-bold fs-5">${formatPrice(item.price * item.quantity)}</p>
                    </div>
                    <div class="col-md-1 col-12 mt-3 mt-md-0 text-md-end">
                        <button class="btn btn-danger btn-sm remove-item" data-id="${item.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.html(html);
    updateCartSummary();
    bindCartEvents();
}

// Update cart summary
function updateCartSummary() {
    const cart = getCart();
    if (!cart || cart.length === 0) {
        $('#cartSubtotal').text(formatPrice(0));
        $('#cartShipping').text('Calculating...');
        $('#cartTax').text(formatPrice(0));
        $('#cartTotal').text(formatPrice(0));
        return;
    }
    
    const subtotal = calculateTotal(cart);
    const shipping = subtotal > 50000 ? 0 : 499;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    
    $('#cartSubtotal').text(formatPrice(subtotal));
    $('#cartShipping').text(shipping === 0 ? 'Free' : formatPrice(shipping));
    $('#cartTax').text(formatPrice(tax));
    $('#cartTotal').text(formatPrice(total));
    
    if (subtotal > 0 && subtotal < 50000) {
        const needed = 50000 - subtotal;
        $('#freeShippingMsg').html(`Add ${formatPrice(needed)} more to get free shipping!`).show();
    } else if (subtotal >= 50000) {
        $('#freeShippingMsg').html('🎉 You qualify for free shipping!').show();
    } else {
        $('#freeShippingMsg').hide();
    }
}

// Bind cart events
function bindCartEvents() {
    // Remove item
    $('.remove-item').off('click').on('click', function() {
        const productId = parseInt($(this).data('id'));
        removeFromCart(productId);
        loadCartItems();
        updateCartCount();
    });
    
    // Quantity input change
    $('.quantity-input').off('change').on('change', function() {
        const productId = parseInt($(this).data('id'));
        let newQuantity = parseInt($(this).val());
        
        if (isNaN(newQuantity) || newQuantity < 1) {
            newQuantity = 1;
            $(this).val(1);
        }
        
        updateQuantity(productId, newQuantity);
        loadCartItems();
        updateCartCount();
    });
    
    // Decrease quantity
    $('.decrease-qty').off('click').on('click', function() {
        const productId = parseInt($(this).data('id'));
        const input = $(`.quantity-input[data-id="${productId}"]`);
        let currentQty = parseInt(input.val());
        
        if (currentQty > 1) {
            currentQty--;
            input.val(currentQty).trigger('change');
        } else {
            removeFromCart(productId);
            loadCartItems();
            updateCartCount();
        }
    });
    
    // Increase quantity
    $('.increase-qty').off('click').on('click', function() {
        const productId = parseInt($(this).data('id'));
        const input = $(`.quantity-input[data-id="${productId}"]`);
        let currentQty = parseInt(input.val());
        currentQty++;
        input.val(currentQty).trigger('change');
    });
}

// Proceed to checkout
function proceedToCheckout() {
    if (!isLoggedIn()) {
        showToast('Please login to checkout', 'warning');
        setTimeout(() => window.location.href = 'login.html', 1500);
        return;
    }
    
    const cart = getCart();
    if (!cart || cart.length === 0) {
        showToast('Your cart is empty!', 'warning');
        return;
    }
    window.location.href = 'checkout.html';
}

// Clear cart
function clearCart() {
    if (!isLoggedIn()) {
        showToast('Please login first', 'warning');
        return;
    }
    
    if (confirm('Are you sure you want to clear your entire cart?')) {
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
        loadCartItems();
        updateCartCount();
        showToast('Cart cleared successfully', 'info');
    }
}

// Initialize cart page
$(document).ready(function() {
    console.log('Cart page loaded');
    loadCartItems();
    
    $('#checkoutBtn').off('click').on('click', proceedToCheckout);
    $('#clearCartBtn').off('click').on('click', clearCart);
});