// Checkout and Order Management

// Load order summary on checkout page
function loadOrderSummary() {
    const cart = getCart();
    
    console.log('Loading order summary, cart:', cart);
    
    if (!cart || cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        setTimeout(() => {
            window.location.href = 'cart.html';
        }, 1500);
        return;
    }
    
    let html = '<div class="order-items-list">';
    cart.forEach(item => {
        html += `
            <div class="d-flex justify-content-between mb-3 pb-2 border-bottom">
                <div>
                    <strong>${item.name}</strong>
                    <br>
                    <small class="text-muted">Quantity: ${item.quantity}</small>
                </div>
                <div class="text-end">
                    <span class="fw-bold">${formatPrice(item.price)}</span>
                    <br>
                    <small class="text-muted">Total: ${formatPrice(item.price * item.quantity)}</small>
                </div>
            </div>
        `;
    });
    html += '</div>';
    
    const subtotal = calculateTotal(cart);
    const shipping = subtotal > 50000 ? 0 : 499;
    const tax = Math.round(subtotal * 0.18);
    const total = subtotal + shipping + tax;
    
    html += `
        <hr class="my-3">
        <div class="d-flex justify-content-between mb-2">
            <span>Subtotal</span>
            <span class="fw-bold">${formatPrice(subtotal)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Shipping</span>
            <span class="fw-bold">${shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
        </div>
        <div class="d-flex justify-content-between mb-2">
            <span>Tax (18% GST)</span>
            <span class="fw-bold">${formatPrice(tax)}</span>
        </div>
        <hr class="my-3">
        <div class="d-flex justify-content-between mb-2 fs-4 fw-bold text-primary">
            <span>Total Amount</span>
            <span>${formatPrice(total)}</span>
        </div>
    `;
    
    $('#orderSummary').html(html);
    
    // Store order details for processing
    window.pendingOrder = {
        cart: cart,
        subtotal: subtotal,
        shipping: shipping,
        tax: tax,
        total: total
    };
}

// Place order
async function placeOrder(customerInfo) {
    try {
        showLoading();
        
        if (!window.pendingOrder) {
            throw new Error('No order data found');
        }
        
        const currentUser = getCurrentUser();
        if (!currentUser) {
            throw new Error('Please login to place order');
        }
        
        // Create order object with user info
        const order = {
            orderId: 'ORD' + Date.now() + Math.floor(Math.random() * 1000),
            orderDate: new Date().toISOString(),
            customer: {
                name: customerInfo.name,
                email: customerInfo.email,
                phone: customerInfo.phone,
                address: customerInfo.address,
                city: customerInfo.city,
                paymentMethod: customerInfo.paymentMethod
            },
            items: window.pendingOrder.cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            subtotal: window.pendingOrder.subtotal,
            shipping: window.pendingOrder.shipping,
            tax: window.pendingOrder.tax,
            total: window.pendingOrder.total,
            status: 'Confirmed',
            userId: currentUser.id,
            userEmail: currentUser.email,
            userName: currentUser.name
        };
        
        console.log('Placing order:', order);
        
        // Get existing orders
        let orders = JSON.parse(localStorage.getItem('shopez_orders') || '[]');
        
        // Add new order
        orders.unshift(order); // Add to beginning
        
        // Save back to localStorage
        localStorage.setItem('shopez_orders', JSON.stringify(orders));
        
        console.log('Orders saved. Total orders:', orders.length);
        console.log('All orders:', orders);
        
        // Clear cart
        localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
        updateCartCount();
        
        // Show order confirmation
        showOrderConfirmation(order);
        
        return order;
        
    } catch (error) {
        console.error('Order placement error:', error);
        showToast(error.message || 'Failed to place order', 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Show order confirmation
function showOrderConfirmation(order) {
    // Generate order items HTML
    let itemsHtml = '';
    order.items.forEach(item => {
        itemsHtml += `
            <div class="d-flex justify-content-between mb-2">
                <div>
                    <strong>${item.name}</strong> × ${item.quantity}
                </div>
                <div>${formatPrice(item.price * item.quantity)}</div>
            </div>
        `;
    });
    
    const modalHtml = `
        <div class="modal fade" id="orderModal" tabindex="-1" data-bs-backdrop="static">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white">
                        <h5 class="modal-title">
                            <i class="bi bi-check-circle-fill"></i> Order Confirmed!
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
                        <div class="text-center mb-4">
                            <i class="bi bi-emoji-smile fs-1 text-success"></i>
                            <h4 class="mt-2">Thank you for your order!</h4>
                            <p class="text-muted">Your order has been placed successfully.</p>
                        </div>
                        
                        <div class="alert alert-info">
                            <strong><i class="bi bi-receipt"></i> Order ID:</strong> ${order.orderId}<br>
                            <strong><i class="bi bi-calendar"></i> Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}<br>
                            <strong><i class="bi bi-check-circle"></i> Status:</strong> <span class="badge bg-success">${order.status}</span>
                        </div>
                        
                        <h6 class="fw-bold mb-3">Order Summary</h6>
                        <div class="bg-light p-3 rounded mb-3">
                            ${itemsHtml}
                            <hr class="my-2">
                            <div class="d-flex justify-content-between fw-bold">
                                <span>Total Paid</span>
                                <span class="text-primary fs-5">${formatPrice(order.total)}</span>
                            </div>
                        </div>
                        
                        <h6 class="fw-bold mb-2">Shipping Information</h6>
                        <div class="bg-light p-3 rounded mb-3">
                            <p class="mb-1"><strong>${order.customer.name}</strong></p>
                            <p class="mb-1"><i class="bi bi-envelope"></i> ${order.customer.email}</p>
                            <p class="mb-1"><i class="bi bi-phone"></i> ${order.customer.phone}</p>
                            <p class="mb-0"><i class="bi bi-geo-alt"></i> ${order.customer.address}, ${order.customer.city}</p>
                        </div>
                        
                        <div class="alert alert-success mb-0">
                            <i class="bi bi-envelope"></i> A confirmation email has been sent to ${order.customer.email}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary-custom" id="viewOrdersBtn">
                            <i class="bi bi-box-seam"></i> View My Orders
                        </button>
                        <button type="button" class="btn btn-secondary" id="continueShoppingBtn">
                            <i class="bi bi-cart"></i> Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    $('#orderModal').remove();
    
    $('body').append(modalHtml);
    const modal = new bootstrap.Modal($('#orderModal')[0]);
    modal.show();
    
    $('#continueShoppingBtn').off('click').on('click', function() {
        $('#orderModal').modal('hide');
        window.location.href = 'products.html';
    });
    
    $('#viewOrdersBtn').off('click').on('click', function() {
        $('#orderModal').modal('hide');
        window.location.href = 'dashboard.html';
    });
    
    $('#orderModal').off('hidden.bs.modal').on('hidden.bs.modal', function() {
        $('#orderModal').remove();
    });
}

// Initialize checkout page
$(document).ready(function() {
    console.log('Checkout page initializing...');
    
    // Check if user is logged in
    if (!isLoggedIn()) {
        console.log('User not logged in, redirecting to login');
        showToast('Please login to checkout', 'warning');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // Load order summary
    loadOrderSummary();
    
    // Pre-fill user information if available
    const currentUser = getCurrentUser();
    if (currentUser) {
        $('#name').val(currentUser.name || '');
        $('#email').val(currentUser.email || '');
    }
    
    // Handle form submission
    $('#checkoutForm').off('submit').on('submit', async function(e) {
        e.preventDefault();
        
        // Validate form
        const name = $('#name').val().trim();
        const email = $('#email').val().trim();
        const phone = $('#phone').val().trim();
        const address = $('#address').val().trim();
        const city = $('#city').val();
        const paymentMethod = $('#paymentMethod').val();
        
        if (!name || !email || !phone || !address) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address', 'error');
            return;
        }
        
        if (!isValidPhone(phone)) {
            showToast('Please enter a valid 10-digit phone number', 'error');
            return;
        }
        
        // Process order
        const customerInfo = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            city: city,
            paymentMethod: paymentMethod
        };
        
        await placeOrder(customerInfo);
    });
});

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}